/**
 * AI Trip Planner — engine v1.
 *
 * Runs entirely in the browser: a deterministic matching and scheduling engine
 * over our own curated catalogue. It sends nothing to a server and stores
 * nothing about the user.
 *
 * Why not a language model today: we have no server to hold an API key, and a
 * model with no grounding would invent hotels, prices and availability — which
 * the editorial standards forbid. The interface below is the seam: implement
 * `plannerProvider` against a hosted endpoint and the whole funnel, the result
 * rendering and the analytics stay exactly as they are.
 *
 *   export async function plannerProvider(brief, catalog) -> Plan
 *
 * A model-backed provider must still resolve every recommendation to a slug in
 * `catalog`; anything it cannot resolve is dropped rather than rendered.
 */
import { track } from "./analytics.js";
import { store } from "./account.js";

/** Base path for a project-site subpath deploy; empty at a domain root. */
const BASE = document.body.dataset.base || "";

const form = document.getElementById("planner");
const out = document.getElementById("planner-result");
if (form && out) init();

async function init() {
  const catalog = await (await fetch(BASE + "/assets/catalog.json")).json();

  // Deep-links from destination guides, hotel pages and curated journeys.
  const params = new URLSearchParams(location.search);
  if (params.get("destination")) form.destination.value = params.get("destination");
  if (params.get("itinerary")) {
    const it = catalog.itineraries.find(i => i.slug === params.get("itinerary"));
    if (it) {
      form.days.value = it.days;
      form.budget.value = String(it.budgetBand);
      const radio = form.querySelector(`input[name="budget"][value="${it.budgetBand}"]`);
      if (radio) radio.checked = true;
      if (it.destinations[0]) form.destination.value = it.destinations[0];
      const style = form.querySelector("#p-style");
      if (style && [...style.options].some(o => o.value === it.style)) style.value = it.style;
    }
  }
  if (params.get("stay")) form.dataset.preferStay = params.get("stay");

  let started = false;
  form.addEventListener("input", () => {
    if (!started) { started = true; track("planner_start", {}); }
  }, { once: false });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const brief = readBrief(form);
    // The planner refuses to plan from an empty catalogue rather than inventing
    // a destination. It plans only over guides that have actually been written.
    if (!catalog.destinations.length) {
      out.innerHTML = `<div class="empty-state" style="margin-top:var(--s-8)">
        <h2 class="display">Nothing to plan with yet</h2>
        <p>This planner builds itineraries only from guides published on this site, so it cannot suggest a place it has
        not been told about. The first guides are being written — it opens as they land.</p>
        <div class="btn-row" style="margin-top:var(--s-6);justify-content:center">
          <a class="btn btn--primary" href="${BASE}/india/">See where we have been</a>
          <a class="btn btn--ghost" href="${BASE}/newsletter/">Get told when it opens</a>
        </div></div>`;
      out.dataset.ready = "";
      out.scrollIntoView({ behavior: "smooth", block: "start" });
      track("planner_generate", { result: "empty_catalog" });
      return;
    }
    const plan = plannerProvider(brief, catalog);
    out.innerHTML = renderPlan(plan, brief, catalog);
    out.dataset.ready = "";
    out.focus();
    out.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    track("planner_generate", {
      destination: brief.destination || "suggested", days: brief.days, travellers: brief.travellers,
      budget: brief.budget, style: brief.style, pace: brief.pace, interests: brief.interests.join(",")
    });
    wireResultActions(plan, brief);
  });

  form.addEventListener("reset", () => { delete out.dataset.ready; out.innerHTML = ""; });
}

function readBrief(f) {
  const data = new FormData(f);
  return {
    destination: data.get("destination") || "",
    start: data.get("start") || "",
    days: Math.min(45, Math.max(2, Number(data.get("days")) || 7)),
    travellers: Math.max(1, Number(data.get("travellers")) || 2),
    party: data.get("party") || "couple",
    pace: data.get("pace") || "balanced",
    activity: data.get("activity") || "moderate",
    budget: Number(data.get("budget")) || 2,
    hotelPref: data.get("hotelPref") || "",
    currency: data.get("currency") || "USD",
    interests: data.getAll("interests"),
    food: data.get("food") || "everything",
    style: data.get("style") || "culture"
  };
}

/* ===================== the engine ====================================== */

const STYLE_TAGS = {
  culture: ["culture", "cities", "food"], adventure: ["adventure", "mountains", "hiking"],
  romantic: ["romantic", "beaches"], luxury: ["luxury", "luxury-budget", "premium"],
  "slow-travel": ["slow-travel", "nature"], solo: ["solo", "cities"], wellness: ["wellness", "nature"]
};
const PARTY_STAY = { solo: "solo-friendly-stays", couple: "romantic-stays", family: "family-stays",
  group: "villas", friends: "boutique-hotels" };
const ACTIVITY_RANK = { gentle: 0, moderate: 1, high: 2 };

function difficultyRank(text = "") {
  const t = text.toLowerCase();
  if (t.includes("hard")) return 2;          // "Moderate to hard" is a hard day
  if (t.includes("moderate")) return 1;
  return 0;
}

/** Scores destinations against the brief and returns the best matches. */
function chooseDestinations(brief, catalog) {
  if (brief.destination) {
    const primary = catalog.destinations.find(d => d.slug === brief.destination);
    if (primary) {
      // Long trips get a second base in the same region rather than one static stay.
      const extras = brief.days >= 12
        ? catalog.destinations
            .filter(d => d.slug !== primary.slug && d.region === primary.region)
            .slice(0, brief.days >= 20 ? 2 : 1)
        : [];
      return [primary, ...extras];
    }
  }
  const want = new Set([...(STYLE_TAGS[brief.style] || []), ...brief.interests.map(i => i.replace("hiking-trekking", "hiking"))]);
  const budgetTag = ["budget", "mid-range", "premium", "luxury-budget"][brief.budget - 1];
  const ranked = catalog.destinations.map(d => {
    let score = d.tags.filter(t => want.has(t)).length * 10;
    if (d.tags.includes(budgetTag)) score += 8;
    if (brief.days <= 4 && d.tags.includes("weekend")) score += 6;
    if (brief.days >= 14 && d.tags.includes("long-journey")) score += 6;
    if (brief.party === "solo" && d.tags.includes("solo")) score += 5;
    if (brief.party === "family" && d.tags.includes("family")) score += 5;
    return { d, score };
  }).sort((a, b) => b.score - a.score);
  const bases = brief.pace === "slow" ? 1 : brief.days >= 12 ? 3 : brief.days >= 7 ? 2 : 1;
  return ranked.slice(0, bases).map(r => r.d);
}

function chooseStay(dest, brief, catalog, used) {
  const pool = catalog.hotels.filter(h => h.destination === dest.slug);
  if (!pool.length) return null;
  const partyCat = PARTY_STAY[brief.party];
  return pool.map(h => {
    let score = 0;
    if (brief.hotelPref && h.categories.includes(brief.hotelPref)) score += 24;
    if (partyCat && h.categories.includes(partyCat)) score += 12;
    score -= Math.abs(h.priceBand - brief.budget) * 7;
    if (used.has(h.slug)) score -= 4;
    for (const i of brief.interests) if (h.categories.includes(i)) score += 4;
    return { h, score };
  }).sort((a, b) => b.score - a.score)[0].h;
}

function rankExperiences(dest, brief, catalog) {
  const maxDiff = ACTIVITY_RANK[brief.activity];
  return catalog.experiences
    .filter(e => e.destination === dest.slug)
    // Hard exclusion, not a penalty: a strong interest match must never be able
    // to out-vote the activity level and schedule someone onto a climb.
    .filter(e => difficultyRank(e.difficulty) <= maxDiff)
    .map(e => {
      let score = e.categories.filter(c => brief.interests.includes(c)).length * 14;
      score += (maxDiff - difficultyRank(e.difficulty)) * 2;
      if (brief.party === "family" && e.categories.includes("family-activities")) score += 10;
      if (brief.budget >= 3 && e.categories.includes("luxury-experiences")) score += 6;
      if (brief.food !== "everything" && e.categories.includes("food-culinary")) score -= 2;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.e);
}

/**
 * The provider seam. Swap this implementation for a hosted model call and
 * nothing else in this file changes.
 */
export function plannerProvider(brief, catalog) {
  const dests = chooseDestinations(brief, catalog);
  const usedStays = new Set();
  const perBase = Math.max(2, Math.floor(brief.days / dests.length));
  const days = [];
  let dayNo = 1;

  dests.forEach((dest, di) => {
    const isLast = di === dests.length - 1;
    const nights = isLast ? brief.days - dayNo + 1 : perBase;
    const stay = chooseStay(dest, brief, catalog, usedStays);
    if (stay) usedStays.add(stay.slug);
    const exps = rankExperiences(dest, brief, catalog);
    let ei = 0;

    for (let n = 0; n < nights && dayNo <= brief.days; n++, dayNo++) {
      const arrival = n === 0;
      const departure = isLast && dayNo === brief.days;
      // Rest days keep the pace honest: nobody does a hard experience every day.
      const restDay = !arrival && !departure && brief.pace === "slow" && n % 3 === 2;
      const exp = (!arrival && !departure && !restDay && ei < exps.length) ? exps[ei++] : null;

      days.push({
        n: dayNo, dest, stay, experience: exp, arrival, departure, restDay,
        morning: arrival ? `Arrive in ${dest.name}. ${dest.gettingThere[0]}`
          : departure ? `Last morning in ${dest.name} — keep it light before travelling.`
          : restDay ? "Nothing scheduled. This is deliberate: a plan with no slack is a plan that breaks."
          : exp ? `${exp.name} — ${exp.duration}. ${exp.recommendedTime}.`
          : dest.thingsToDo[(dayNo + di) % dest.thingsToDo.length],
        afternoon: arrival ? "Check in, then walk the immediate area on foot. Do not schedule anything demanding on an arrival day."
          : departure ? "Travel onward or to the airport."
          : dest.thingsToDo[(dayNo + di + 2) % dest.thingsToDo.length],
        evening: departure ? "Departure."
          : `${dest.food[(dayNo + di) % dest.food.length]}`,
        transport: arrival ? dest.gettingThere[1] || dest.gettingThere[0]
          : departure ? "Transfer out — allow more time than the map suggests."
          : "Local transport or on foot."
      });
    }
  });

  return { days, destinations: dests, stays: [...usedStays].map(s => catalog.hotels.find(h => h.slug === s)),
           experiences: days.map(d => d.experience).filter(Boolean), brief };
}

/* ===================== rendering ======================================= */

const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Rough daily rates by band, in USD, used only to produce a clearly-labelled
// estimate. These are planning assumptions the user can see and override in the
// budget calculator — never a quoted price.
const BAND_RATES = { 1: { stay: 45, food: 20, local: 8, exp: 15 }, 2: { stay: 120, food: 45, local: 18, exp: 35 },
                     3: { stay: 260, food: 80, local: 35, exp: 70 }, 4: { stay: 620, food: 150, local: 70, exp: 160 } };

function estimate(brief) {
  const r = BAND_RATES[brief.budget];
  const rooms = Math.ceil(brief.travellers / 2);
  const stay = r.stay * brief.days * rooms;
  const food = r.food * brief.days * brief.travellers;
  const local = r.local * brief.days * brief.travellers;
  const exp = r.exp * brief.days * brief.travellers;
  const sub = stay + food + local + exp;
  return { stay, food, local, exp, sub, buffer: Math.round(sub * 0.12), total: Math.round(sub * 1.12) };
}

function packingFor(brief, dests) {
  const items = ["Passport, visas and a photo of both stored separately", "Travel insurance covering your activity level",
    "A card that works abroad plus a small amount of local cash", "Universal adapter and a power bank"];
  const tags = new Set(dests.flatMap(d => d.tags));
  if (tags.has("mountains") || brief.activity === "high") items.push("Layers, a waterproof shell and broken-in walking shoes");
  if (tags.has("beaches")) items.push("Reef-safe sunscreen and swimwear you can walk in");
  if (tags.has("deserts")) items.push("A warm layer for the night — deserts get genuinely cold after dark");
  if (tags.has("culture") || tags.has("cities")) items.push("Modest clothing that covers shoulders and knees for religious sites");
  if (brief.party === "family") items.push("A small first-aid kit and any medication in original packaging");
  if (brief.days >= 14) items.push("Laundry plan — pack for seven days, not for the trip length");
  if (brief.interests.includes("photography")) items.push("Spare batteries and twice the card storage you think you need");
  return items;
}

function renderPlan(plan, brief, catalog) {
  const est = estimate(brief);
  const money = (n) => `${brief.currency} ${Math.round(n).toLocaleString("en-US")}`;
  const dest = plan.destinations[0];

  return `
<div class="section-head" style="margin-top:var(--s-8)">
  <div class="section-head__text">
    <span class="eyebrow">Your itinerary</span>
    <h2>${brief.days} days in ${esc(plan.destinations.map(d => d.name).join(", "))}</h2>
    <p>Built from ${plan.destinations.length} ${plan.destinations.length === 1 ? "base" : "bases"},
    ${plan.stays.filter(Boolean).length} ${plan.stays.filter(Boolean).length === 1 ? "stay" : "stays"} and
    ${plan.experiences.length} scheduled ${plan.experiences.length === 1 ? "experience" : "experiences"}.
    Every recommendation links to a real page on this site.</p>
  </div>
  <div class="btn-row">
    <button class="btn btn--ghost btn--sm" type="button" data-plan-save>Save this trip</button>
    <button class="btn btn--ghost btn--sm" type="button" data-plan-print>Print / PDF</button>
  </div>
</div>

<dl class="planner-summary">
  <div><dt>Days</dt><dd>${brief.days}</dd></div>
  <div><dt>Travellers</dt><dd>${brief.travellers}</dd></div>
  <div><dt>Pace</dt><dd>${esc(brief.pace)}</dd></div>
  <div><dt>Budget band</dt><dd>${"$".repeat(brief.budget)}</dd></div>
  <div><dt>Estimated total</dt><dd>${money(est.total)}</dd></div>
  <div><dt>Best time</dt><dd>${esc((dest.bestTime[0] || "").split(":")[0].split(" —")[0])}</dd></div>
</dl>

<p class="engine-note" style="margin-top:var(--s-5)"><strong>About that estimate.</strong> It is arithmetic on published
planning assumptions for a ${"$".repeat(brief.budget)} trip — ${money(BAND_RATES[brief.budget].stay)}/night per room,
${money(BAND_RATES[brief.budget].food)}/person/day for food, plus local transport, experiences and a 12% contingency.
It excludes international flights. It is not a quote, and no price on this site is taken from a live booking system.
Put your own numbers into the <a href="${BASE}/tools/trip-budget-calculator/">budget calculator</a> for something firmer.</p>

<div class="grid grid--asym" style="margin-top:var(--s-7)">
  <div>
    <h3 class="display" style="font-size:var(--t-xl);margin-bottom:var(--s-5)">Day by day</h3>
    ${plan.days.map(d => `<article class="day">
      <div class="day__no">Day ${d.n}<small>${esc(d.dest.name)}</small></div>
      <div>
        <h4 class="day__title">${d.arrival ? "Arrival · " : d.departure ? "Departure · " : d.restDay ? "Unscheduled · " : ""}${esc(d.dest.name)}</h4>
        <div class="day__slots">
          <div class="day__slot"><b>Morning</b><span>${esc(d.morning)}</span></div>
          <div class="day__slot"><b>Afternoon</b><span>${esc(d.afternoon)}</span></div>
          <div class="day__slot"><b>Evening</b><span>${esc(d.evening)}</span></div>
          <div class="day__slot"><b>Transport</b><span>${esc(d.transport)}</span></div>
          ${d.stay && !d.departure ? `<div class="day__slot"><b>Stay</b><span><a href="${d.stay.url}">${esc(d.stay.name)}</a> — ${esc(d.stay.kicker)}</span></div>` : ""}
        </div>
        <div class="day__links">
          ${d.stay && !d.departure ? `<a class="btn btn--book btn--sm" href="${d.stay.url}#book" data-track="planner_result_click" data-entity-type="stay" data-entity="${d.stay.slug}">Book the stay</a>` : ""}
          ${d.experience ? `<a class="btn btn--ghost btn--sm" href="${d.experience.url}#book" data-track="planner_result_click" data-entity-type="experience" data-entity="${d.experience.slug}">Book ${esc(d.experience.name)}</a>` : ""}
          <a class="btn btn--ghost btn--sm" href="${d.dest.url}">${esc(d.dest.name)} guide</a>
        </div>
      </div></article>`).join("")}
  </div>

  <aside class="stack-lg">
    <div class="booking">
      <div class="booking__head"><h3>Estimated budget</h3><span class="price-band">${"$".repeat(brief.budget)}</span></div>
      <div class="bar-row">
        ${[["Accommodation", est.stay], ["Food", est.food], ["Local transport", est.local],
           ["Experiences", est.exp], ["Contingency", est.buffer]].map(([label, v]) =>
          `<div><span>${label}</span><span class="bar"><i style="width:${(v / est.total * 100).toFixed(1)}%"></i></span><span>${money(v)}</span></div>`).join("")}
      </div>
      <p class="affiliate-note" style="margin-top:var(--s-4)">Excludes international flights. Booking links may earn us a
      commission at no cost to you. <a href="${BASE}/legal/affiliate-disclosure/">Details</a>.</p>
    </div>

    <div class="booking">
      <div class="booking__head"><h3>Recommended stays</h3></div>
      ${plan.stays.filter(Boolean).map(h => `<a class="btn btn--ghost btn--block" href="${h.url}">${esc(h.name)} · ${"$".repeat(h.priceBand)}</a>`).join("")}
    </div>

    <div class="booking">
      <div class="booking__head"><h3>Packing list</h3></div>
      <ul class="checks">${packingFor(brief, plan.destinations).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>

    <div class="booking">
      <div class="booking__head"><h3>Travel tips for ${esc(dest.name)}</h3></div>
      <ul class="checks">${[...dest.safety.slice(0, 2), ...dest.culture.slice(0, 2)].map(i => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>

    <div class="booking">
      <div class="booking__head"><h3>Want this designed properly?</h3></div>
      <p class="affiliate-note">Premium trip planning — bookings handled, restaurants reserved, the logistics checked by
      someone who has been there. Not yet live; register interest and we will tell you when it opens.</p>
      <a class="btn btn--primary btn--block" href="${BASE}/partner/#enquiry" data-track="premium_planning_interest">Register interest</a>
    </div>
  </aside>
</div>

<div style="margin-top:var(--s-8)">
  <h3 class="display" style="font-size:var(--t-lg);margin-bottom:var(--s-4)">Related curated journeys</h3>
  <div class="grid grid--3">
    ${catalog.itineraries.filter(i => i.destinations.some(s => plan.destinations.some(d => d.slug === s)) || i.style === brief.style)
      .slice(0, 3).map(i => `<a class="card" href="${i.url}"><div class="card__body">
        <span class="card__kicker">${i.days} days · ${esc(i.style.replace(/-/g, " "))}</span>
        <h4 class="card__title" style="font-size:var(--t-md)">${esc(i.title)}</h4></div></a>`).join("")
      || `<p class="muted">No curated journey covers this combination yet — <a href="${BASE}/journeys/">browse all journeys</a>.</p>`}
  </div>
</div>`;
}

function wireResultActions(plan, brief) {
  out.querySelector("[data-plan-print]")?.addEventListener("click", () => {
    track("download_itinerary", { entityType: "planner" }); window.print();
  });
  out.querySelector("[data-plan-save]")?.addEventListener("click", async (e) => {
    await store.add({ type: "trip", slug: `plan-${Date.now()}`,
      label: `${brief.days} days in ${plan.destinations.map(d => d.name).join(", ")}`, url: location.href + location.search });
    track("save_item", { entityType: "trip" });
    e.target.textContent = "Saved ✓";
  });
}
