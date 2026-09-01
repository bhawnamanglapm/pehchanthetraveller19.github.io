import { esc, list, card, sectionHead, figure, chip, breadcrumbs, atAGlance, nextSteps, faq,
         newsletterBlock, truncate, priceBand, factList, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub, extra = "") => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}${extra}
</div></section>`;

const crumbs = (...parts) => `<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, ...parts])}</div>`;

/* ===================== AI TRIP PLANNER ================================== */

export function plannerPage(g) {
  const opt = (v, l) => `<option value="${esc(v)}">${esc(l)}</option>`;
  const choice = (name, v, l, type = "checkbox") =>
    `<label class="choice"><input type="${type}" name="${esc(name)}" value="${esc(v)}"> ${esc(l)}</label>`;

  const body = `
${pageHero("AI Trip Planner", "Tell it how you travel. It builds the trip.",
  "Destination, dates, budget, pace, interests and who is coming — and you get a day-by-day itinerary with stays, experiences, transport and a realistic budget attached to every day.")}
${crumbs({ label: "Plan" })}

<section class="section section--tight"><div class="wrap">
  <p class="engine-note"><strong>How this planner works, honestly.</strong> Version one runs entirely in your browser: a
  deterministic matching engine over our own curated catalogue of ${g.destinations.length} destinations,
  ${g.hotels.length} stays and ${g.experiences.length} experiences. It sends nothing to a server and stores nothing about you.
  It is designed as a drop-in for a language-model provider — see <code>plannerProvider</code> in
  <code>assets/js/planner.js</code> — so a live model can be connected without changing the interface or the funnel.
  It will never invent a hotel, a price or an availability.</p>
</div></section>

<section class="section section--tight"><div class="wrap">
  <form class="planner-form" id="planner" novalidate>
    <div class="planner-step">
      <h2><span>01</span> Where and when</h2>
      <p>Pick a destination we cover, or let the planner suggest one from your interests.</p>
      <div class="field-grid">
        <div class="field"><label for="p-dest">Destination</label>
          <select id="p-dest" name="destination">
            <option value="">Suggest one for me</option>
            ${list(g.regions, (r) => `<optgroup label="${esc(r.name)}">${
              list(r.countries.flatMap(c => c.destinations), (d) => opt(d.slug, `${d.name}, ${d.country_.name}`))
            }</optgroup>`)}
          </select></div>
        <div class="field"><label for="p-start">Start date</label><input id="p-start" name="start" type="date"></div>
        <div class="field"><label for="p-days">Trip length (days)</label>
          <input id="p-days" name="days" type="number" min="2" max="45" value="7" inputmode="numeric"></div>
        <div class="field"><label for="p-travellers">Travellers</label>
          <input id="p-travellers" name="travellers" type="number" min="1" max="12" value="2" inputmode="numeric"></div>
      </div>
    </div>

    <div class="planner-step">
      <h2><span>02</span> Who is travelling</h2>
      <p>This changes the stays and the pace more than anything else you tell us.</p>
      <div class="choice-row">
        ${["Solo", "Couple", "Family", "Group", "Friends"].map(v => choice("party", v.toLowerCase(), v, "radio")).join("")}
      </div>
      <div class="field-grid" style="margin-top:var(--s-5)">
        <div class="field"><label for="p-pace">Desired pace</label>
          <select id="p-pace" name="pace">
            ${opt("slow", "Slow — two or three bases, long stays")}
            ${opt("balanced", "Balanced — move every three days")}
            ${opt("fast", "Fast — see as much as possible")}
          </select></div>
        <div class="field"><label for="p-activity">Activity level</label>
          <select id="p-activity" name="activity">
            ${opt("gentle", "Gentle — walking, no hard days")}
            ${opt("moderate", "Moderate — a full day hike is fine")}
            ${opt("high", "High — altitude, scrambles, long trails")}
          </select></div>
      </div>
    </div>

    <div class="planner-step">
      <h2><span>03</span> Budget and standard</h2>
      <p>We plan in bands, not invented totals. Use the <a href="/tools/trip-budget-calculator/">budget calculator</a> for a number.</p>
      <div class="choice-row">
        ${[["1", "Budget"], ["2", "Mid-range"], ["3", "Premium"], ["4", "Luxury"]].map(([v, l]) => choice("budget", v, l, "radio")).join("")}
      </div>
      <div class="field-grid" style="margin-top:var(--s-5)">
        <div class="field"><label for="p-hotel">Hotel preference</label>
          <select id="p-hotel" name="hotelPref">
            <option value="">No preference</option>
            ${list(g.taxonomies.stayCategories, (c) => opt(c.slug, c.name))}
          </select></div>
        <div class="field"><label for="p-currency">Show budgets in</label>
          <select id="p-currency" name="currency">${list(g.site.currencies, (c) => opt(c.code, `${c.code} — ${c.label}`))}</select></div>
      </div>
    </div>

    <div class="planner-step">
      <h2><span>04</span> Interests</h2>
      <p>Pick as many as apply — these drive which experiences get scheduled.</p>
      <div class="choice-row">
        ${list(g.taxonomies.experienceCategories, (c) => choice("interests", c.slug, c.name))}
      </div>
      <div class="field-grid" style="margin-top:var(--s-5)">
        <div class="field"><label for="p-food">Food preferences</label>
          <select id="p-food" name="food">
            ${opt("everything", "I eat everything")}${opt("vegetarian", "Vegetarian")}
            ${opt("vegan", "Vegan")}${opt("halal", "Halal")}${opt("no-alcohol", "No alcohol")}${opt("allergies", "Allergies — I will specify with operators")}
          </select></div>
        <div class="field"><label for="p-style">Travel style</label>
          <select id="p-style" name="style">
            ${opt("culture", "Culture and craft")}${opt("adventure", "Adventure and outdoors")}
            ${opt("romantic", "Romantic")}${opt("luxury", "Luxury")}${opt("slow-travel", "Slow travel")}
            ${opt("solo", "Solo-friendly")}${opt("wellness", "Wellness")}
          </select></div>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn btn--primary" type="submit" data-track="planner_generate">Generate my itinerary</button>
      <button class="btn btn--ghost" type="reset">Reset</button>
    </div>
    <p class="form-note">Nothing is sent anywhere. Your answers stay in this browser tab.</p>
  </form>

  <div class="planner-result" id="planner-result" aria-live="polite" tabindex="-1"></div>
</div></section>

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Prefer a ready-made plan?",
  steps: [
    { href: "/journeys/", title: "Browse curated journeys", desc: `${g.itineraries.length} itineraries, written day by day.` },
    { href: "/destinations/", title: "Start from a destination", desc: "Read the guide first, plan second." },
    { href: "/partner/", title: "Have it designed for you", desc: "Premium trip planning — enquire about availability." }
  ]})}</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "planner")}</div></section>`;

  return {
    url: "/plan/", template: "planner",
    title: "AI Trip Planner — Build a Day-by-Day Itinerary | Pehchan",
    description: "Enter your destination, dates, budget, pace and interests, and get a day-by-day itinerary with stays, experiences, transport and a budget estimate.",
    body, ogArt: "planner", scripts: ["/assets/js/planner.js"],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Plan", href: "/plan/" }],
    schema: { "@type": "WebApplication", name: "Pehchan AI Trip Planner", url: g.site.siteUrl + "/plan/",
      applicationCategory: "TravelApplication", operatingSystem: "Any modern browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
  };
}

/* ===================== TOOLS =========================================== */

const TOOL_PANELS = {
  "trip-budget-calculator": (g) => `
<form class="tool-panel" data-tool="budget">
  <div class="field-grid">
    <div class="field"><label for="b-days">Trip length (days)</label><input id="b-days" name="days" type="number" value="10" min="1" max="90"></div>
    <div class="field"><label for="b-travellers">Travellers</label><input id="b-travellers" name="travellers" type="number" value="2" min="1" max="12"></div>
    <div class="field"><label for="b-currency">Currency</label><select id="b-currency" name="currency">${
      list(g.site.currencies, (c) => `<option value="${esc(c.code)}">${esc(c.code)}</option>`)}</select></div>
  </div>
  <div class="field-grid" style="margin-top:var(--s-5)">
    <div class="field"><label for="b-stay">Accommodation per night</label><input id="b-stay" name="stay" type="number" value="180" min="0"><small>Per room, not per person.</small></div>
    <div class="field"><label for="b-food">Food per person per day</label><input id="b-food" name="food" type="number" value="55" min="0"></div>
    <div class="field"><label for="b-local">Local transport per day</label><input id="b-local" name="local" type="number" value="25" min="0"></div>
    <div class="field"><label for="b-exp">Experiences per person per day</label><input id="b-exp" name="exp" type="number" value="40" min="0"></div>
    <div class="field"><label for="b-flights">Flights per person</label><input id="b-flights" name="flights" type="number" value="700" min="0"></div>
    <div class="field"><label for="b-buffer">Contingency (%)</label><input id="b-buffer" name="buffer" type="number" value="12" min="0" max="50"></div>
  </div>
  <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--primary" type="submit">Calculate</button></div>
  <div class="tool-output" data-output hidden></div>
</form>`,

  "currency-converter": (g) => `
<form class="tool-panel" data-tool="currency">
  <div class="field-grid">
    <div class="field"><label for="c-amount">Amount</label><input id="c-amount" name="amount" type="number" value="1000" min="0"></div>
    <div class="field"><label for="c-from">From</label><select id="c-from" name="from">${
      list(g.site.currencies, (c) => `<option value="${esc(c.code)}">${esc(c.code)} — ${esc(c.label)}</option>`)}</select></div>
    <div class="field"><label for="c-to">To</label><select id="c-to" name="to">${
      list(g.site.currencies, (c) => `<option value="${esc(c.code)}"${c.code === "EUR" ? " selected" : ""}>${esc(c.code)} — ${esc(c.label)}</option>`)}</select></div>
    <div class="field"><label for="c-rate">Exchange rate (1 from = ? to)</label><input id="c-rate" name="rate" type="number" step="any" value="0.92" min="0">
      <small>You supply the rate. We deliberately do not ship a hard-coded rate table that would silently go stale.</small></div>
  </div>
  <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--primary" type="submit">Convert</button></div>
  <div class="tool-output" data-output hidden></div>
</form>`,

  "packing-list-generator": () => `
<form class="tool-panel" data-tool="packing">
  <div class="field-grid">
    <div class="field"><label for="k-climate">Climate</label><select id="k-climate" name="climate">
      <option value="tropical">Tropical / humid</option><option value="temperate">Temperate</option>
      <option value="alpine">Alpine / cold</option><option value="desert">Desert</option><option value="monsoon">Monsoon / wet</option></select></div>
    <div class="field"><label for="k-days">Trip length (days)</label><input id="k-days" name="days" type="number" value="10" min="1" max="90"></div>
    <div class="field"><label for="k-style">Trip type</label><select id="k-style" name="style">
      <option value="city">City and culture</option><option value="beach">Beach</option>
      <option value="hiking">Hiking and outdoors</option><option value="safari">Safari</option><option value="luxury">Luxury / smart dining</option></select></div>
  </div>
  <fieldset style="border:0;padding:0;margin-top:var(--s-5)"><legend class="field-label">Add for</legend>
    <div class="choice-row" style="margin-top:var(--s-3)">
      ${["Altitude", "Photography", "Swimming", "Religious sites", "Children", "Long-haul flight"].map(v =>
        `<label class="choice"><input type="checkbox" name="extras" value="${esc(v.toLowerCase())}"> ${esc(v)}</label>`).join("")}
    </div>
  </fieldset>
  <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--primary" type="submit">Generate list</button></div>
  <div class="tool-output" data-output hidden></div>
</form>`,

  "trip-duration-calculator": () => `
<form class="tool-panel" data-tool="duration">
  <div class="field-grid">
    <div class="field"><label for="d-start">Departure date</label><input id="d-start" name="start" type="date"></div>
    <div class="field"><label for="d-end">Return date</label><input id="d-end" name="end" type="date"></div>
    <div class="field"><label for="d-flight">One-way travel time (hours, door to door)</label><input id="d-flight" name="flight" type="number" value="14" min="0" step="0.5"></div>
    <div class="field"><label for="d-tz">Time zones crossed</label><input id="d-tz" name="tz" type="number" value="5" min="0" max="14"></div>
    <div class="field"><label for="d-bases">Number of bases on the trip</label><input id="d-bases" name="bases" type="number" value="3" min="1" max="20"></div>
  </div>
  <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--primary" type="submit">Calculate usable days</button></div>
  <div class="tool-output" data-output hidden></div>
</form>`,

  "best-time-to-visit": (g) => `
<div class="tool-panel" data-tool="besttime">
  <div class="field"><label for="t-search">Filter destinations</label>
    <input id="t-search" type="search" placeholder="Search by name, country or region" data-filter></div>
  <div class="table-scroll" style="margin-top:var(--s-5)">
    <table class="data"><thead><tr><th>Destination</th><th>Country</th><th>Best months</th><th>Days needed</th><th></th></tr></thead>
    <tbody data-rows>
      ${list(g.destinations, (d) => `<tr data-text="${esc((d.name + " " + d.country_.name + " " + d.region_.name).toLowerCase())}">
        <td><strong>${esc(d.name)}</strong></td><td>${esc(d.country_.name)}</td>
        <td>${esc(d.bestTime[0].replace(/^([^:]*):.*$/, "$1"))}</td>
        <td>${esc(d.howManyDays.split(";")[0])}</td>
        <td><a class="link-more" href="${esc(d.url)}">Guide</a></td></tr>`)}
    </tbody></table>
  </div>
</div>`,

  "travel-checklist": () => `
<div class="tool-panel" data-tool="checklist">
  <p class="muted" style="font-size:var(--t-sm);margin-bottom:var(--s-5)">Ticks are saved in this browser only — nothing is sent anywhere.</p>
  <div data-checklist></div>
  <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--ghost btn--sm" type="button" data-reset-checklist>Reset all</button></div>
</div>`,

  "destination-comparison": (g) => `
<form class="tool-panel" data-tool="compare">
  <div class="field-grid">
    <div class="field"><label for="cmp-a">Destination A</label><select id="cmp-a" name="a">${
      list(g.destinations, (d, i) => `<option value="${esc(d.slug)}"${i === 0 ? " selected" : ""}>${esc(d.name)}, ${esc(d.country_.name)}</option>`)}</select></div>
    <div class="field"><label for="cmp-b">Destination B</label><select id="cmp-b" name="b">${
      list(g.destinations, (d, i) => `<option value="${esc(d.slug)}"${i === 16 ? " selected" : ""}>${esc(d.name)}, ${esc(d.country_.name)}</option>`)}</select></div>
  </div>
  <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--primary" type="submit">Compare</button></div>
  <div class="tool-output" data-output hidden></div>
</form>`,

  "visa-information": (g) => `
<div class="tool-panel" data-tool="visa">
  <div class="disclosure" style="margin-bottom:var(--s-5)">
    <div><strong>Starting points, not legal advice.</strong> Entry requirements depend on your nationality, your purpose of
    travel and the date you arrive, and they change without notice. Always confirm with the destination government's own
    website or your nearest embassy before booking anything.</div>
  </div>
  <div class="field"><label for="v-search">Find a country</label><input id="v-search" type="search" placeholder="Search countries" data-filter></div>
  <div class="table-scroll" style="margin-top:var(--s-5)">
    <table class="data"><thead><tr><th>Country</th><th>Region</th><th>General entry note</th></tr></thead>
    <tbody data-rows>${list(g.countries, (c) => `<tr data-text="${esc((c.name + " " + c.region_.name).toLowerCase())}">
      <td><strong><a href="${esc(c.url)}">${esc(c.name)}</a></strong></td><td>${esc(c.region_.name)}</td>
      <td>${esc(c.visaNote)}</td></tr>`)}</tbody></table>
  </div>
</div>`
};

const PHASE2_PANEL = (t) => `
<div class="tool-panel">
  <span class="badge badge--placeholder">Phase 2</span>
  <h2 class="display" style="font-size:var(--t-lg);margin:var(--s-4) 0 var(--s-3)">Not built yet — and we would rather say so</h2>
  <p class="muted" style="max-width:56ch">${esc(t.blurb)} This tool needs data we do not yet hold with enough confidence to
  publish — real route timings, or comparable rate data across properties. It sits in Phase 2 of the roadmap rather than
  shipping as a guess.</p>
  <div class="btn-row" style="margin-top:var(--s-5)">
    <a class="btn btn--ghost btn--sm" href="/tools/">Tools that are live</a>
    <a class="btn btn--ghost btn--sm" href="/plan/">Use the trip planner</a>
  </div>
</div>`;

export function toolsIndex(g) {
  const live = g.taxonomies.tools.filter(t => t.phase === "mvp");
  const later = g.taxonomies.tools.filter(t => t.phase !== "mvp");
  const body = `
${pageHero("Travel tools", "Free tools that do one thing properly",
  "No sign-up, no data collection, no stale hard-coded rate tables. Everything runs in your browser.")}
${crumbs({ label: "Tools" })}
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Available now", title: "Live tools" })}
  <div class="grid grid--3">
    ${list(live, (t) => `<article class="card"><div class="card__body">
      <span class="card__kicker">Free · in-browser</span>
      <h3 class="card__title"><a class="card__link" href="${esc(t.redirect || `/tools/${t.slug}/`)}">${esc(t.name)}</a></h3>
      <p class="card__desc">${esc(t.blurb)}</p>
      <div class="card__foot"><span>Open</span><span>→</span></div></div></article>`)}
  </div>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Roadmap", title: "Coming in Phase 2", intro: "Listed here because a roadmap you can see is more useful than a tool that guesses." })}
  <div class="grid grid--3">
    ${list(later, (t) => `<article class="card"><div class="card__body">
      <span class="card__kicker">Phase 2</span>
      <h3 class="card__title"><a class="card__link" href="/tools/${esc(t.slug)}/">${esc(t.name)}</a></h3>
      <p class="card__desc">${esc(t.blurb)}</p></div></article>`)}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "tools-index")}</div></section>`;
  return {
    url: "/tools/", template: "tools-index", title: "Free Travel Planning Tools — Budget, Packing, Visas | Pehchan",
    description: "Free travel tools: trip budget calculator, currency converter, packing list generator, best time to visit, travel checklist and visa information.",
    body, ogArt: "tools",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Tools", href: "/tools/" }],
    schema: { "@type": "CollectionPage", name: "Travel planning tools", url: g.site.siteUrl + "/tools/" }
  };
}

export function toolPage(t, g) {
  const panel = TOOL_PANELS[t.slug] ? TOOL_PANELS[t.slug](g) : PHASE2_PANEL(t);
  const related = t.slug === "trip-budget-calculator" ? g.taxonomies.collections.filter(c => c.type === "budget")
    : t.slug === "best-time-to-visit" ? g.taxonomies.collections.filter(c => c.type === "landscape").slice(0, 4)
    : g.taxonomies.collections.filter(c => c.type === "length");
  const body = `
${pageHero("Travel tools", t.name, t.blurb)}
${crumbs({ label: "Tools", href: "/tools/" }, { label: t.name })}
<section class="section section--tight"><div class="wrap wrap--narrow">${panel}</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Related", title: "Where this leads" })}
  <div class="grid grid--4">${list(related, (c) => card({ href: c.url, title: c.title, kicker: "Collection",
    desc: c.intro, entity: c, ratio: "4x3", flush: true }))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next", steps: [
    { href: "/plan/", title: "Plan the trip", desc: "Turn the numbers into a day-by-day itinerary." },
    { href: "/destinations/", title: "Pick a destination", desc: "Full guides with timing and budget notes." },
    { href: "/tools/", title: "Other tools", desc: "Budget, packing, visas, comparison and more." }
  ]})}</div></section>`;
  return {
    url: `/tools/${t.slug}/`, template: "tool", title: fitTitle([t.name, "Free Travel Tool", "Pehchan"]),
    description: truncate(t.blurb, 155), body, ogArt: `tool-${t.slug}`, scripts: ["/assets/js/tools.js"],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Tools", href: "/tools/" }, { label: t.name, href: `/tools/${t.slug}/` }],
    schema: { "@type": "WebApplication", name: t.name, url: g.site.siteUrl + `/tools/${t.slug}/`,
      applicationCategory: "TravelApplication", operatingSystem: "Any modern browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
  };
}

/* ===================== PARTNER WITH US ================================= */

export function partnerPage(g) {
  const opts = (arr) => list(arr, (v) => `<option value="${esc(v)}">${esc(v)}</option>`);
  const services = [
    ["Sponsored destination stories", "Long-form editorial built around a destination, always labelled Sponsored."],
    ["Hotel features", "A full property page produced to the same template as our editorial reviews, clearly badged."],
    ["Social media campaigns", "Multi-platform campaigns built around a stay, a route or a season."],
    ["UGC and content production", "Photography, video and written assets licensed for your own channels."],
    ["Influencer collaborations", "Co-ordinated creator campaigns with defined deliverables and disclosure."],
    ["Destination campaigns", "Tourism board programmes covering multiple regions, seasons and formats."],
    ["Product placement", "Travel gear, luggage and equipment integrated into real trips, disclosed as paid."],
    ["Newsletter placement", `A dedicated slot in ${g.site.newsletterName}, marked as a partner feature.`]
  ];
  const body = `
${pageHero("Partner with us", "Let's create better journeys together",
  "We work with hotels, resorts, tourism boards, airlines, tour operators, experience providers and travel brands on storytelling that a reader actually finishes.")}
${crumbs({ label: "Partner" })}

<section class="section section--tight"><div class="wrap">
  <div class="split">
    <div class="prose">
      <p class="lede">Pehchan is a global travel discovery platform: destination guides, stays, experiences, curated
      journeys and a trip planner, built for travellers in the research phase — the point at which a recommendation
      still changes a decision.</p>
      <p>We are early. We would rather tell you that than quote numbers we cannot yet stand behind. What we can offer
      today is a well-built, fast, editorially serious platform, a defined audience, transparent labelling of every
      paid placement, and a team that will produce work you would be happy to run on your own channels.</p>
      <p><strong>What we will not do:</strong> publish a paid placement without labelling it, write a review we do not
      believe, invent ratings or awards, or promise editorial coverage in exchange for a rate.</p>
    </div>
    <div>${figure({ art: "europe-coast", slug: "partner-hero" }, { ratio: "4x3", label: "Partnerships" })}</div>
  </div>
</div></section>

<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Who we work with", title: "Partnership types" })}
  <div class="grid grid--4">
    ${list([
      ["Hotels & resorts", "Property features, stay experiences, seasonal campaigns and photography."],
      ["Tourism boards", "Destination campaigns across guides, journeys, stories and social."],
      ["Airlines & transport", "Route storytelling and destination programmes tied to new services."],
      ["Tour & experience operators", "Experience features and integration into curated journeys."],
      ["Travel technology", "Product integrations, planner partnerships and co-marketing."],
      ["Travel gear & luggage", "Product placement in real trips, with disclosure."],
      ["Luxury brands", "Considered brand storytelling in a travel context."],
      ["Booking platforms", "Affiliate and API partnerships across stays, activities and transport."]
    ], ([t, d]) => `<article class="card"><div class="card__body">
      <h3 class="card__title" style="font-size:var(--t-md)">${esc(t)}</h3>
      <p class="card__desc">${esc(d)}</p></div></article>`)}
  </div>
</div></section>

<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Services", title: "What we produce" })}
  ${factList(services.map(([t, d]) => [t, esc(d)]))}
</div></section>

<section class="section section--tight" id="enquiry"><div class="wrap wrap--narrow">
  ${sectionHead({ eyebrow: "Enquiry", title: "Start a partnership", intro: "Tell us what you are trying to achieve and we will reply with what we can realistically deliver, and what we cannot." })}
  <form class="tool-panel" data-partner-form novalidate>
    <div class="field-grid">
      <div class="field"><label for="pf-name">Name *</label><input id="pf-name" name="name" required autocomplete="name"></div>
      <div class="field"><label for="pf-company">Company *</label><input id="pf-company" name="company" required autocomplete="organization"></div>
      <div class="field"><label for="pf-email">Email *</label><input id="pf-email" name="email" type="email" required autocomplete="email"></div>
      <div class="field"><label for="pf-website">Website</label><input id="pf-website" name="website" type="url" placeholder="https://"></div>
      <div class="field"><label for="pf-country">Country</label><input id="pf-country" name="country" autocomplete="country-name"></div>
      <div class="field"><label for="pf-business">Business type</label><select id="pf-business" name="businessType">
        ${opts(["Hotel", "Resort", "Tourism board", "Airline", "Tour operator", "Experience provider", "Travel technology", "Travel gear brand", "Luxury brand", "Booking platform", "Other"])}
      </select></div>
      <div class="field"><label for="pf-type">Partnership type</label><select id="pf-type" name="partnershipType">
        ${opts(["Sponsored destination story", "Hotel feature", "Social media campaign", "UGC and content production", "Photography", "Video", "Influencer collaboration", "Destination campaign", "Product placement", "Affiliate or API partnership", "Not sure yet"])}
      </select></div>
      <div class="field"><label for="pf-budget">Campaign budget</label><select id="pf-budget" name="budget">
        ${opts(["Under 1,000 USD", "1,000–5,000 USD", "5,000–15,000 USD", "15,000–50,000 USD", "50,000 USD+", "Prefer to discuss"])}
      </select></div>
    </div>
    <div class="field" style="margin-top:var(--s-5)"><label for="pf-message">Message *</label>
      <textarea id="pf-message" name="message" required placeholder="What are you trying to achieve, what is the timing, and which destinations or properties are involved?"></textarea></div>
    <div class="btn-row" style="margin-top:var(--s-5)"><button class="btn btn--primary" type="submit" data-track="partner_enquiry_submit">Start a Partnership</button></div>
    <p class="form-note" style="margin-top:var(--s-4)">No backend is connected yet, so this form does not transmit anywhere.
    On submit it opens a pre-filled email to <strong>${esc(g.site.partnerEmail)}</strong> — which means nothing you type is
    stored or sent without you seeing it first. Connecting a CRM endpoint is a one-line change in
    <code>assets/js/forms.js</code>.</p>
    <p class="form-status" hidden></p>
  </form>
</div></section>

<section class="section section--tight"><div class="wrap wrap--narrow">
  ${faq([
    { q: "Do you guarantee positive coverage?", a: "No. Sponsored placements are guaranteed placement, production quality and disclosure — not a guaranteed verdict. If we cannot recommend something honestly, we will tell you before the work starts rather than write around it." },
    { q: "How is sponsored content labelled?", a: "Every paid placement carries a visible Sponsored badge at the point of the content, not only in a footer policy. Affiliate links carry their own disclosure on the same page as the link." },
    { q: "Do you accept free stays in exchange for coverage?", a: "We will accept a hosted stay to make a review possible, and we disclose it on the page. It does not buy a positive review, and it does not guarantee publication." },
    { q: "What audience data can you share?", a: "We will share current analytics directly with prospective partners rather than publish traffic claims on a marketing page. We would rather under-promise on a call than over-claim in public." },
    { q: "Do you work with early-stage brands?", a: "Yes. Tell us the budget honestly and we will tell you what is realistic within it." }
  ], { heading: "Partnership FAQs" })}
</div></section>`;
  return {
    url: "/partner/", template: "partner", title: "Partner With Us — Hotels, Tourism Boards & Travel Brands | Pehchan",
    description: "Work with us on sponsored destination stories, hotel features, social campaigns, UGC and photography. Transparent labelling, honest editorial.",
    body, ogArt: "partner", scripts: ["/assets/js/forms.js"],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Partner", href: "/partner/" }],
    schema: { "@type": "WebPage", name: "Partner With Us", url: g.site.siteUrl + "/partner/" }
  };
}

/* ===================== ABOUT / NEWSLETTER / CONTACT ==================== */

export function aboutPage(g) {
  const body = `
${pageHero("About", "Handcrafted journeys. Beautiful stays. Stories worth travelling for.",
  "Pehchan is a global travel discovery platform helping modern travellers find exceptional destinations, stays, experiences and thoughtfully designed journeys.")}
${crumbs({ label: "About" })}
<section class="section section--tight"><div class="wrap">
  <div class="split">
    <div class="prose">
      <h2 style="margin-top:0">What we are building</h2>
      <p class="drop-cap">Most travel content is written to rank, not to be used. It answers the question that has the
      search volume rather than the question you actually have at 11pm three weeks before you fly. We are building the
      opposite: a smaller number of genuinely complete guides, a curated catalogue of stays and experiences with an honest
      note on who each one suits, and a planner that turns all of it into days you can actually book.</p>
      <p>The platform is global by construction. Eight regions, the same template applied to every one of them, and no
      assumption anywhere in the architecture that any single country is the default. India is one region among eight
      and is modelled exactly like the other seven.</p>
      <h2>The founder</h2>
      <p>Pehchan is founded and edited by a <strong>travel curator and digital travel creator</strong> whose work began
      in the mountains — long road journeys, small villages, the stays that do not photograph well — and grew into
      curating journeys for other people. The interest has always been the same: places, the people who keep them going,
      and the difference between seeing somewhere and having been there.</p>
      <p>But the brand is deliberately larger than one person. The content model, editorial standards and page templates
      are built so that other writers, photographers and destination specialists can contribute to the same standard.
      A platform that only works while one person is travelling is not a business.</p>
      <h2>How we make decisions</h2>
      <p>Three rules do most of the work. We do not publish a recommendation we would not act on ourselves. We label every
      commercial relationship at the point a reader encounters it, not in a policy page they will never open. And we say
      when we do not know something — which is why several sections of this site carry a visible note about what is
      sample content and what is verified.</p>
      <h2>Where this goes</h2>
      <p>Booking partnerships and affiliate integrations, then user accounts and saved trips, then premium trip planning
      and direct hotel partnerships. The <a href="/dashboard/">business dashboard</a> shows the metrics we intend to run
      the company on, and the roadmap is public in the repository that builds this site.</p>
    </div>
    <div class="stack">
      ${figure({ art: "himalaya", slug: "about" }, { ratio: "4x3", label: "About Pehchan" })}
      ${atAGlance([
        ["Founded", g.site.founded],
        ["Regions covered", String(g.regions.length)],
        ["Destination guides", String(g.destinations.length)],
        ["Stays", String(g.hotels.length)],
        ["Experiences", String(g.experiences.length)],
        ["Curated journeys", String(g.itineraries.length)]
      ])}
    </div>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Start somewhere", steps: [
    { href: "/destinations/", title: "Explore destinations", desc: "Eight regions, one consistent standard." },
    { href: "/plan/", title: "Plan a trip", desc: "The trip planner, in about a minute." },
    { href: "/partner/", title: "Work with us", desc: "Hotels, tourism boards and travel brands." }
  ]})}</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "about")}</div></section>`;
  return {
    url: "/about/", template: "about", title: "About Pehchan — A Global Travel Discovery Platform",
    description: "A global travel discovery platform: complete destination guides, a curated catalogue of stays and experiences, and a planner that builds the trip.",
    body, ogArt: "about",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "About", href: "/about/" }],
    schema: { "@type": "AboutPage", name: "About Pehchan", url: g.site.siteUrl + "/about/" }
  };
}

export function newsletterPage(g) {
  const body = `
${pageHero(g.site.newsletterName, "One considered email a week. Nothing else.",
  "New destinations, stays worth knowing about, quiet-season timing, hidden gems and the occasional full itinerary.")}
${crumbs({ label: "Newsletter" })}
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "newsletter-page")}</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "What is in it", title: "Six things it covers" })}
  <div class="grid grid--3">
    ${list([
      ["New destinations", "One guide a week, in full, before it is promoted anywhere else."],
      ["Hotel discoveries", "Small properties worth knowing about, with the honest caveats."],
      ["Travel deals", "Only when they are genuinely good, and always labelled if commercial."],
      ["Hidden gems", "The places that have not yet been optimised for visitors."],
      ["Curated itineraries", "Day-by-day plans, occasionally as a downloadable."],
      ["Luxury travel inspiration", "What a premium actually buys, and when it does not."]
    ], ([t, d]) => `<article class="card"><div class="card__body">
      <h3 class="card__title" style="font-size:var(--t-md)">${esc(t)}</h3><p class="card__desc">${esc(d)}</p></div></article>`)}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap wrap--narrow">
  ${faq([
    { q: "How often is it sent?", a: "Once a week. If there is nothing worth sending, we skip a week rather than pad it." },
    { q: "Will you sell or share my email address?", a: "No. It is used to send the newsletter and nothing else. See the privacy policy." },
    { q: "Is it free?", a: "Yes. It may carry clearly labelled partner placements in future; it will never be gated." },
    { q: "How do I unsubscribe?", a: "One click in the footer of any issue. No retention flow, no confirmation gauntlet." }
  ])}
</div></section>`;
  return {
    url: "/newsletter/", template: "newsletter", title: fitTitle([g.site.newsletterName, "Weekly Travel Newsletter", "Pehchan"]),
    description: "One considered email a week: new destinations, hotel discoveries, hidden gems, curated itineraries and travel deals worth acting on.",
    body, ogArt: "newsletter",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Newsletter", href: "/newsletter/" }]
  };
}

export function contactPage(g) {
  const body = `
${pageHero("Contact", "Get in touch", "Editorial, corrections, partnerships and everything else.")}
${crumbs({ label: "Contact" })}
<section class="section section--tight"><div class="wrap">
  <div class="grid grid--3">
    ${list([
      ["Editorial and general", g.site.contactEmail, "Questions, corrections, suggestions and factual errors — corrections are the ones we answer fastest."],
      ["Partnerships", g.site.partnerEmail, "Hotels, tourism boards, brands and agencies. The partnership page has the detail."],
      ["Press", g.site.contactEmail, "Media enquiries and requests to reproduce material."]
    ], ([t, e, d]) => `<article class="card"><div class="card__body">
      <h3 class="card__title" style="font-size:var(--t-md)">${esc(t)}</h3>
      <p class="card__desc">${esc(d)}</p>
      <p><a class="link-more" href="mailto:${esc(e)}">${esc(e)}</a></p></div></article>`)}
  </div>
  <div class="disclosure" style="margin-top:var(--s-7)">
    <div><strong>Found something wrong?</strong> Travel information goes out of date — roads close, properties change hands,
    entry rules move. If something on this site is inaccurate, tell us and we will correct it and note the correction.
    That is a commitment in our <a href="/legal/editorial-standards/">editorial standards</a>, not a courtesy.</div>
  </div>
</div></section>`;
  return {
    url: "/contact/", template: "contact", title: "Contact Pehchan",
    description: "Contact Pehchan for editorial enquiries, corrections, partnerships and press.",
    body, ogArt: "contact",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Contact", href: "/contact/" }]
  };
}

/* ===================== DEALS =========================================== */

export function dealsPage(g) {
  const body = `
${pageHero("Travel deals", "Deals, when they are genuinely deals",
  "This section is built and instrumented, and deliberately empty. We will not manufacture an offer to fill a page.")}
${crumbs({ label: "Deals" })}
<section class="section section--tight"><div class="wrap">
  <div class="disclosure">
    <div><strong>Nothing here is fabricated, which is why there is nothing here yet.</strong> Live rates, availability and
    offers come from booking partners through their APIs and feeds. Until those integrations are signed and connected, the
    honest thing to publish is the structure, not invented prices, fake countdown timers or a “was/now” that was never true.
    Each category below is a live, tracked slot waiting for a partner feed.</div>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Categories", title: "How this section will work" })}
  <div class="grid grid--3">
    ${list(g.taxonomies.dealCategories, (c) => `<article class="card"><div class="card__body">
      <span class="badge badge--placeholder">Awaiting partner feed</span>
      <h3 class="card__title" style="font-size:var(--t-md);margin-top:var(--s-3)">${esc(c.name)}</h3>
      <p class="card__desc">${esc(c.note)}</p>
      <div class="partner-slot" style="margin-top:var(--s-4)">
        <p>Offer cards render here once the ${esc(c.name.toLowerCase())} feed is connected. Every card will show its source,
        its expiry and whether the link is commercial.</p>
      </div></div></article>`)}
  </div>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "In the meantime", title: "Genuinely good value, without a countdown timer",
    intro: "The most reliable saving in travel is not a flash sale. It is going in the right month and staying in the right town." })}
  <div class="grid grid--4">
    ${list(g.taxonomies.collections.filter(c => c.type === "budget"), (c) => card({ href: c.url, title: c.title,
      kicker: "By budget", desc: c.intro, entity: c, ratio: "4x3", flush: true }))}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "deals")}</div></section>
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Better than a deal page", steps: [
    { href: "/tools/best-time-to-visit/", title: "Check the quiet season", desc: "Shoulder-season timing beats most discounts." },
    { href: "/collections/budget/", title: "Browse by budget", desc: "Destinations where a good trip is not an expensive one." },
    { href: "/plan/", title: "Plan around a budget", desc: "The planner works in bands you set." }
  ]})}</div></section>`;
  return {
    url: "/deals/", template: "deals", title: "Travel Deals — Hotel, Flight & Experience Offers | Pehchan",
    description: "Hotel, flight, tour and experience offers. We publish deals only from connected booking partners — never invented prices or manufactured urgency.",
    body, ogArt: "deals",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Deals", href: "/deals/" }]
  };
}

/* ===================== SEARCH ========================================== */

export function searchPage(g) {
  const body = `
${pageHero("Search", "Search everything",
  "Destinations, countries, stays, experiences, journeys, collections and stories — one index, ranked by relevance.")}
${crumbs({ label: "Search" })}
<section class="section section--tight"><div class="wrap wrap--narrow">
  <form data-search-page role="search">
    <div class="field"><label for="q">Search</label>
      <input id="q" name="q" type="search" placeholder="Try “mountain luxury hotels in India” or “7 day itinerary Japan”" autocomplete="off"></div>
    <div class="choice-row" style="margin-top:var(--s-4)">
      ${list(["All", "Destinations", "Stays", "Experiences", "Journeys", "Stories", "Collections"], (t, i) =>
        `<label class="choice"><input type="radio" name="type" value="${esc(t.toLowerCase())}"${i === 0 ? " checked" : ""}> ${esc(t)}</label>`)}
    </div>
  </form>
  <div style="margin-top:var(--s-6)">
    <p class="muted" data-search-count></p>
    <ul class="search-results" data-search-page-results style="border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;margin-top:var(--s-4)"></ul>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Popular searches", title: "Try one of these" })}
  <div class="btn-row">
    ${list(["mountain luxury hotels in India", "best time to visit Kyoto", "7 day itinerary Japan", "solo travel Vietnam",
      "desert camps", "safari conservancy", "boutique hotels Lisbon", "slow travel"],
      (q) => `<a class="chip" href="/search/?q=${encodeURIComponent(q)}">${esc(q)}</a>`)}
  </div>
</div></section>`;
  return {
    url: "/search/", template: "search", title: "Search — Destinations, Stays, Experiences & Journeys | Pehchan",
    description: "Search every destination guide, stay, experience, curated journey, collection and travel story on Pehchan.",
    body, ogArt: "search", scripts: ["/assets/js/search-page.js"], noindex: true,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Search", href: "/search/" }]
  };
}

/* ===================== DASHBOARD CONCEPT =============================== */

export function dashboardPage(g) {
  const kpi = (label, value, sub) => `<div class="kpi"><dt>${esc(label)}</dt><dd>${esc(value)}</dd>
    <span class="kpi-sub">${esc(sub)}</span></div>`;
  const body = `
${pageHero("Business intelligence", "The dashboard concept",
  "A design specification for the numbers this business will be run on — defined before the pipeline exists, so the metrics are decided by strategy rather than by whatever the tool happens to report.")}
${crumbs({ label: "Dashboard" })}
<section class="section section--tight"><div class="wrap">
  <div class="disclosure"><div><strong>This is a wireframe, not live data.</strong> Every figure below is shown as a dash
  because no analytics provider is connected. The purpose of this page is to fix the metric definitions and the event
  taxonomy now — see <code>docs/02-journeys-monetization-conversion.md</code> — so that when a provider is configured in
  <code>src/content/site.json</code>, there is no argument about what counts.</div></div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Acquisition", title: "Traffic and audience" })}
  <dl class="kpi-grid">
    ${kpi("Sessions", "—", "Total sessions, 30-day rolling")}
    ${kpi("Users", "—", "Unique users, 30-day rolling")}
    ${kpi("Organic share", "—", "Sessions from search / all sessions")}
    ${kpi("Newsletter subscribers", "—", "Total confirmed, plus net weekly growth")}
    ${kpi("Return rate", "—", "Users with 2+ sessions in 30 days")}
    ${kpi("Pages per session", "—", "Depth signal for internal linking")}
  </dl>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Revenue", title: "Commerce and conversion" })}
  <dl class="kpi-grid">
    ${kpi("Affiliate clicks", "—", "Tracked outbound clicks to booking partners")}
    ${kpi("Click-through rate", "—", "Affiliate clicks / sessions on commerce pages")}
    ${kpi("Confirmed bookings", "—", "Reported by partner networks, lagging 30–60 days")}
    ${kpi("Revenue", "—", "Commission, by network and by month")}
    ${kpi("Revenue per session", "—", "The single number that governs content investment")}
    ${kpi("Partner leads", "—", "Enquiries from the partnership form, by budget band")}
  </dl>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Content", title: "What is working" })}
  <div class="table-scroll">
    <table class="data"><thead><tr><th>Report</th><th>Dimension</th><th>Primary metric</th><th>Decision it drives</th></tr></thead><tbody>
      ${list([
        ["Top destinations", "Destination", "Revenue per session", "Where to invest guide and photography budget"],
        ["Most clicked stays", "Hotel", "Affiliate clicks + CTR", "Which properties to pursue for direct partnerships"],
        ["Most popular experiences", "Experience", "Affiliate clicks", "Which activity categories to expand"],
        ["Top-performing content", "URL", "Assisted conversions", "What to update, expand or repeat"],
        ["Planner funnel", "Step", "Completion rate", "Where the planner loses people"],
        ["Search demand", "Query", "Searches with zero results", "The content gaps our own users are naming"],
        ["Newsletter capture", "Placement", "Submit rate", "Which surfaces actually build the list"],
        ["Partner pipeline", "Business type", "Leads and value", "Which B2B segment to target next"]
      ], (r) => `<tr>${r.map((c, i) => i === 0 ? `<td><strong>${esc(c)}</strong></td>` : `<td>${esc(c)}</td>`).join("")}</tr>`)}
    </tbody></table>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Instrumentation", title: "Events the site already emits" })}
  <div class="table-scroll">
    <table class="data"><thead><tr><th>Event</th><th>Key properties</th><th>Status</th></tr></thead><tbody>
      ${list([
        ["page_view", "template, region, country, destination", "Emitted"],
        ["affiliate_click", "partner, network, entityType, entitySlug, ctaLabel", "Emitted on every booking anchor"],
        ["outbound_click", "host, context", "Emitted"],
        ["planner_start / planner_generate", "style, budget, days, travellers, interests", "Emitted"],
        ["newsletter_view / newsletter_submit", "placement", "Emitted"],
        ["partner_enquiry_submit", "businessType, partnershipType, budgetBand, country", "Emitted"],
        ["search / search_result_click", "query, resultCount, resultType, rank", "Emitted"],
        ["save_item / share_trip / download_itinerary", "entityType, slug", "Emitted"],
        ["tool_use", "tool", "Emitted"],
        ["scroll_depth / read_complete", "template, slug", "Emitted"]
      ], (r) => `<tr><td><code>${esc(r[0])}</code></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`)}
    </tbody></table>
  </div>
  <p class="muted" style="margin-top:var(--s-5);font-size:var(--t-sm)">Events are buffered by
  <code>assets/js/analytics.js</code> and forwarded to GA4, Plausible or a warehouse endpoint once one is configured.
  With no provider configured, nothing is transmitted and nothing is stored — the site ships privacy-clean by default.</p>
</div></section>`;
  return {
    url: "/dashboard/", template: "dashboard", title: "Business Dashboard Concept | Pehchan",
    description: "The metric definitions and event taxonomy this platform is run on: traffic, affiliate clicks, conversion rate, revenue per session, top content and partner leads.",
    body, ogArt: "dashboard", noindex: true,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard/" }]
  };
}

/* ===================== LEGAL & TRUST =================================== */

const LEGAL = {
  "editorial-standards": {
    title: "Editorial Standards",
    lede: "How we decide what to recommend, and what would make us change our minds.",
    sections: [
      ["Independence", ["Editorial recommendations are never sold. No payment, hosted stay, gift or partnership buys a place in a guide, a collection or a curated journey.",
        "Where a commercial relationship exists, it is labelled at the point a reader encounters it — on the card, next to the link, at the top of the page — not only in this document.",
        "We distinguish three things explicitly and visibly: <strong>editorial recommendation</strong> (our judgement, unpaid), <strong>sponsored placement</strong> (paid, labelled Sponsored) and <strong>affiliate link</strong> (we may earn a commission if you book)."]],
      ["What we will not publish", ["Superlative claims we cannot substantiate — “best hotel in the world”, “lowest price guaranteed”, “number one destination”.",
        "Reviews, ratings or testimonials we did not collect, and star ratings borrowed from a third party and presented as ours.",
        "Prices, availability or offers we cannot verify from a live partner source. Where we indicate cost, it is a band, marked indicative.",
        "Manufactured urgency — countdown timers, invented scarcity, “3 people are looking at this”.",
        "Awards or accolades we have not received, and partner logos we are not entitled to display."]],
      ["Sample and placeholder content", ["This platform is early. Some catalogue entries are illustrative sample listings, created to demonstrate page structure and the booking flow. Every one carries a visible <em>Sample listing</em> badge.",
        "Sample entries are replaced by verified properties as partnerships are confirmed and first-hand assessments are completed. They are never presented as reviewed.",
        "Imagery is generated placeholder artwork, labelled as such, until licensed photography exists. We do not use imagery that implies we were somewhere we were not."]],
      ["Accuracy and corrections", ["Travel information decays. Roads close, properties change hands, entry rules move, seasons shift.",
        "If we publish something inaccurate, we correct it and note that we did. Corrections are the enquiries we answer fastest — write to us at the contact address.",
        "Guides carry the assumptions behind them where those assumptions matter, and we say plainly when we do not know something."]],
      ["Sources and expertise", ["Guides are written from first-hand travel, direct contact with operators and properties, and official sources for anything regulatory.",
        "Entry requirements, permits and safety information always point to the official government source. We do not restate immigration rules as though they were ours to interpret.",
        "Contributors are named on the work they produce, and hosted or sponsored travel is disclosed on the piece it produced."]]
    ]
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure",
    lede: "How this site makes money, in plain terms.",
    sections: [
      ["The short version", ["Some links on this site are affiliate links. If you click one and book, we may receive a commission from the provider. You pay exactly the same price — the commission comes out of the provider's margin, not your booking.",
        "Affiliate links never influence whether something is recommended or where it appears. They are added after an editorial decision, never before it."]],
      ["Where affiliate links appear", ["Booking modules on stay and experience pages.",
        "“Where to stay” and “experiences” sections within destination guides.",
        "Stay and experience recommendations inside curated journeys and planner results.",
        "Travel deals, once partner feeds are connected.",
        "All commercial outbound links carry <code>rel=\"sponsored noopener\"</code> and open in a new tab."]],
      ["Current status", ["No affiliate contracts are active at the time of writing. Booking modules on this site are structured, tracked slots waiting for partner links — which is why they are labelled <em>Partner slot — not yet live</em> and are not clickable.",
        "We publish this rather than quietly implying commercial relationships we do not have."]],
      ["Sponsored content", ["Sponsored content is paid placement and is always labelled <em>Sponsored</em> on the content itself.",
        "Payment buys placement, production and disclosure. It does not buy a positive verdict. If we cannot recommend something honestly we say so before the work begins.",
        "Hosted stays and press trips are disclosed on the resulting page."]],
      ["Questions", ["If anything about a commercial relationship on this site is unclear, ask us. We would rather answer an awkward question than lose a reader's trust."]]
    ]
  },
  "privacy": {
    title: "Privacy Policy",
    lede: "What this site collects, which today is close to nothing.",
    sections: [
      ["What we collect", ["<strong>Nothing by default.</strong> No analytics provider is currently configured, so no analytics events are transmitted or stored.",
        "The trip planner, the travel tools and the save/wishlist feature run entirely in your browser. What you enter stays on your device in <code>localStorage</code> and is never sent to us.",
        "The partnership form does not transmit to a server. On submit it opens a pre-filled email in your own mail client, so nothing leaves your device without you seeing it.",
        "Newsletter subscription will collect an email address once an email provider is connected. At that point this page will name the provider and the retention period."]],
      ["What we will collect when analytics is enabled", ["Aggregate usage: page views, referrer, approximate country, device type, and the product events listed on the dashboard concept page.",
        "Affiliate click events, so we can tell which recommendations are useful. These record the destination link and the page it was on, not who you are.",
        "We will not sell personal data, and we will not run third-party advertising trackers."]],
      ["Cookies and storage", ["The site sets no cookies. It uses browser <code>localStorage</code> for your theme preference, saved items and tool state. You can clear it at any time in your browser settings. See the <a href=\"/legal/cookies/\">cookie policy</a>."]],
      ["Third parties", ["Maps load from OpenStreetMap only after you explicitly click to load them, so no map request is made unless you ask for one.",
        "Outbound booking links take you to third-party sites governed by their own privacy policies."]],
      ["Your rights", ["Where data protection law applies to you — including the UK GDPR, EU GDPR and India's DPDP Act — you have rights of access, correction, deletion and objection. Since we currently hold no personal data, most requests will be answered by telling you exactly that.",
        "Contact us at the address on the contact page to exercise any right."]]
    ]
  },
  "terms": {
    title: "Terms of Use",
    lede: "The basis on which this site is provided.",
    sections: [
      ["Using this site", ["This site is provided for personal, non-commercial use. You may read, print and share pages freely.",
        "You may not scrape, republish or resell the content, or use it to train a model, without written permission."]],
      ["No guarantee of accuracy", ["Travel information changes constantly. We take reasonable care, but we do not warrant that anything here is current, complete or suitable for your circumstances.",
        "Entry requirements, safety guidance, permits, opening times and prices must be confirmed with official and provider sources before you rely on them.",
        "Nothing here is legal, medical, financial or immigration advice."]],
      ["Third-party services", ["Bookings made through outbound links are contracts between you and that provider. We are not a party to them and cannot resolve disputes, refunds or cancellations on your behalf.",
        "We are not responsible for the content, availability or conduct of third-party sites."]],
      ["Liability", ["To the fullest extent permitted by law, we are not liable for loss arising from use of this site or reliance on its content. Nothing excludes liability that cannot lawfully be excluded."]],
      ["Intellectual property", ["Text, page templates, generated artwork and the site design are owned by the operator. Trade marks referenced remain the property of their owners."]],
      ["Changes", ["These terms may be updated. Continued use after a change constitutes acceptance."]]
    ]
  },
  "cookies": {
    title: "Cookie Policy",
    lede: "This site sets no cookies. Here is what it does use.",
    sections: [
      ["Cookies", ["We set no cookies — not for analytics, not for advertising, not for functionality. There is consequently no cookie banner, because there is nothing to consent to."]],
      ["Browser storage we do use", ["<code>pehchan-theme</code> — remembers whether you chose light or dark.",
        "<code>pehchan-saved</code> — the destinations, stays, experiences and journeys you have saved.",
        "<code>pehchan-checklist</code> — your ticks in the travel checklist tool.",
        "All of it stays on your device. None of it is transmitted to us or to anyone else, and you can clear it at any time through your browser's site-data settings."]],
      ["If this changes", ["If we later add analytics or an embedded third-party service that sets cookies, this page will be updated before it goes live and consent will be requested where the law requires it."]],
      ["Third-party content you choose to load", ["Map embeds load from OpenStreetMap only when you click to load them, and may set their own storage at that point. Nothing loads before you ask."]]
    ]
  }
};

export function legalPage(slug, g) {
  const doc = LEGAL[slug];
  const body = `
${pageHero("Trust & transparency", doc.title, doc.lede)}
${crumbs({ label: "Legal" }, { label: doc.title })}
<section class="section section--tight"><div class="wrap wrap--prose">
  <article class="prose">
    ${list(doc.sections, ([h, paras]) => `<h2>${esc(h)}</h2><ul>${list(paras, (p) => `<li>${p}</li>`)}</ul>`)}
    <hr style="margin-block:var(--s-7)">
    <p class="muted" style="font-size:var(--t-sm)">Last reviewed on publication of this version of the site. Questions:
    <a href="/contact/">contact us</a>.</p>
  </article>
  <div class="btn-row" style="margin-top:var(--s-7)">
    ${list(Object.entries(LEGAL).filter(([s]) => s !== slug), ([s, d]) => chip(d.title, `/legal/${s}/`))}
  </div>
</div></section>`;
  return {
    url: `/legal/${slug}/`, template: "legal", title: fitTitle([doc.title, "Pehchan"]),
    description: truncate(doc.lede + " " + doc.sections[0][1][0].replace(/<[^>]+>/g, ""), 155),
    body, ogArt: `legal-${slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: doc.title, href: `/legal/${slug}/` }]
  };
}

export const legalSlugs = Object.keys(LEGAL);

export function notFoundPage(g) {
  const body = `
${pageHero("404", "That page does not exist",
  "It may have moved, or it may never have existed. Either way, here is the way back in.")}
<section class="section section--tight"><div class="wrap">
  <div class="grid grid--4">
    ${list([
      ["Destinations", "/destinations/", "Eight regions, one consistent standard."],
      ["Where to stay", "/stay/", "Boutique houses, lodges and camps."],
      ["Experiences", "/experiences/", "The reason you went."],
      ["AI Trip Planner", "/plan/", "A day-by-day plan in about a minute."]
    ], ([t, h, d]) => `<article class="card"><div class="card__body">
      <h3 class="card__title" style="font-size:var(--t-md)"><a class="card__link" href="${esc(h)}">${esc(t)}</a></h3>
      <p class="card__desc">${esc(d)}</p></div></article>`)}
  </div>
  <div class="btn-row" style="margin-top:var(--s-7)">
    <button class="btn btn--primary" type="button" data-search-open>Search the site</button>
    <a class="btn btn--ghost" href="/">Back to the homepage</a>
  </div>
</div></section>`;
  return { url: "/404.html", template: "404", title: "Page not found | Pehchan",
    description: "The page you were looking for does not exist.", body, noindex: true, ogArt: "404",
    breadcrumbs: [{ label: "Home", href: "/" }] };
}
