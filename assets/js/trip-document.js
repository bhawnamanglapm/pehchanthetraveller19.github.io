/**
 * The trip document.
 *
 * Stage 1 turned up one piece of hard evidence, and this is built on it: a
 * complete, branded itinerary was written, shown to a traveller's parents, and
 * it persuaded them. Permission followed. The survey says the same thing from
 * the other direction — "complete itinerary" and "hotel details" were the two
 * most-requested reassurances, ahead of every safety feature on the list.
 *
 * So the deliverable is a document, not a link. Three reasons, in order:
 *
 *   1. A parent is *shown* something. They do not tap a URL in a group chat.
 *   2. A document survives. It gets forwarded, saved, opened again the night
 *      before, shown to the relative who was not in the room.
 *   3. A full itinerary does not fit in a URL. The older share-link pack
 *      encoded itself into the fragment, which works for five short answers
 *      and breaks well before forty itinerary rows.
 *
 * Input is deliberately plain text rather than a row editor, because the one
 * document we know worked was built in a spreadsheet — its own budget note
 * says "as entered in the trip sheet". Pasting columns out of Sheets lands
 * here as tab-separated text and parses without the traveller learning
 * anything new. Typing pipes by hand works identically.
 *
 * Nothing is sent anywhere. The draft lives in localStorage on her own device;
 * the document is rendered in the page and printed by the browser.
 */

/* ---- small helpers ---------------------------------------------------- */

const esc = (s) => String(s == null ? "" : s)
  .replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

/** Split a row on pipes or tabs, so pasted spreadsheet cells work unchanged. */
const cells = (line) => line.split(/\t|\s*\|\s*/).map(s => s.trim());

/** Indian digit grouping: 63000 -> 63,000, 150000 -> 1,50,000. */
export const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/** Accepts "8,000", "₹8000", "8000 " — anything but a number returns null. */
export function amount(raw) {
  if (raw == null) return null;
  const n = Number(String(raw).replace(/[₹,\s]/g, ""));
  return Number.isFinite(n) && String(raw).trim() !== "" ? n : null;
}

const PRIORITIES = {
  must: "MUST-DO", "must-do": "MUST-DO", mustdo: "MUST-DO",
  ess: "ESSENTIAL", essential: "ESSENTIAL",
  rec: "RECOMMENDED", recommended: "RECOMMENDED",
  opt: "OPTIONAL", optional: "OPTIONAL"
};
const priority = (raw) => PRIORITIES[String(raw || "").trim().toLowerCase()] || "";

const dateText = (d, opts) => {
  if (!d) return "";
  const t = new Date(d + "T00:00:00");
  return isNaN(t) ? d : t.toLocaleDateString("en-IN",
    opts || { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

/**
 * A date range the way a person writes one: "20 – 25 October 2026" when the
 * month is shared, "28 October – 3 November 2026" when it is not. Repeating
 * the month and year on both sides is how a form fills a field, not how a
 * document reads.
 */
function dateRange(a, b) {
  if (!a) return "";
  if (!b) return dateText(a);
  const x = new Date(a + "T00:00:00"), y = new Date(b + "T00:00:00");
  if (isNaN(x) || isNaN(y)) return [a, b].join(" – ");
  const sameYear = x.getFullYear() === y.getFullYear();
  const sameMonth = sameYear && x.getMonth() === y.getMonth();
  const end = y.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const start = x.toLocaleDateString("en-IN", sameMonth
    ? { day: "numeric" }
    : sameYear ? { day: "numeric", month: "long" }
    : { day: "numeric", month: "long", year: "numeric" });
  return `${start} – ${end}`;
}

const nightsBetween = (a, b) => {
  if (!a || !b) return null;
  const n = Math.round((new Date(b) - new Date(a)) / 86400000);
  return n > 0 ? n : null;
};

/* ---- parsing ---------------------------------------------------------- *
 * Each block is line-oriented. A line starting with # opens a section; a
 * line starting with > is an add-on hanging off the row above it. Blank
 * lines are ignored so she can space things out while typing.               */

/**
 * Itinerary.
 *   # Tuesday, 20 October | Port Blair
 *   Afternoon | Cellular Jail | Historical visit | ess
 *   > Light & Sound Show | Show | ess
 */
export function parseItinerary(text) {
  const days = [];
  let day = null;
  for (const raw of String(text || "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      const [label, place] = cells(line.replace(/^#+\s*/, ""));
      day = { label: label || "", place: place || "", rows: [] };
      days.push(day);
      continue;
    }
    if (!day) { day = { label: "", place: "", rows: [] }; days.push(day); }
    const addon = line.startsWith(">");
    const c = cells(addon ? line.replace(/^>\s*/, "") : line);
    // An add-on sits at the same stop, so it has no time of its own and its
    // columns shift left by one.
    day.rows.push(addon
      ? { addon: true, time: "", place: c[0] || "", activity: c[1] || "", priority: priority(c[2]) }
      : { addon: false, time: c[0] || "", place: c[1] || "", activity: c[2] || "", priority: priority(c[3]) });
  }
  return days;
}

/**
 * Travel.
 *   # Outbound | Tuesday, 20 October 2026
 *   IndiGo 6E933 | DEL Delhi | 02:55 | MAA Chennai | 05:45
 */
export function parseTravel(text) {
  const groups = [];
  let g = null;
  for (const raw of String(text || "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      const [label, when] = cells(line.replace(/^#+\s*/, ""));
      g = { label: label || "", when: when || "", legs: [] };
      groups.push(g);
      continue;
    }
    if (!g) { g = { label: "", when: "", legs: [] }; groups.push(g); }
    const [service, from, dep, to, arr] = cells(line);
    g.legs.push({ service: service || "", from: from || "", dep: dep || "", to: to || "", arr: arr || "" });
  }
  groups.forEach(withConnections);
  return groups;
}

/** HH:MM -> minutes, or null. */
export function clock(t) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || "").trim());
  if (!m) return null;
  const h = +m[1], min = +m[2];
  return h < 24 && min < 60 ? h * 60 + min : null;
}
const spanText = (mins) => `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}`;

/**
 * Work out each leg's duration and the gap between legs.
 *
 * This is the one thing the document does that a traveller building it by
 * hand has to remember: a 50-minute connection and a 5-hour connection are
 * different facts about a journey, and both belong on the page a family
 * reads. Times are local and legs may cross midnight, so a negative gap is
 * treated as an overnight roll rather than an error.
 */
export function withConnections(group) {
  let total = 0;
  group.legs.forEach((leg, i) => {
    const d = clock(leg.dep), a = clock(leg.arr);
    if (d != null && a != null) {
      const mins = a >= d ? a - d : a + 1440 - d;
      leg.duration = spanText(mins);
      total += mins;
    }
    const next = group.legs[i + 1];
    if (!next) return;
    const na = clock(leg.arr), nd = clock(next.dep);
    if (na == null || nd == null) return;
    const gap = nd >= na ? nd - na : nd + 1440 - na;
    total += gap;
    leg.connection = {
      mins: gap,
      text: spanText(gap),
      where: leg.to,
      // Under an hour is tight enough that a family should see it flagged;
      // over three hours is a long wait and they should see that too.
      note: gap < 60 ? "Tight connection" : gap >= 180 ? "Long connection" : "Connection"
    };
  });
  if (total) {
    group.total = spanText(total);
    group.stops = Math.max(0, group.legs.length - 1);
  }
}

/**
 * Budget.
 *   # Flights
 *   Return airfare | Both legs | 26000
 *   ? Parasailing | Elephant Beach | 3500
 *   x Scooter hire | Per day, not in the total | 500
 *
 * ? marks an optional line — real money, but only if she does it.
 * x marks a line shown for information and excluded from every total.
 */
export function parseBudget(text) {
  const groups = [];
  let g = null;
  for (const raw of String(text || "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      g = { label: line.replace(/^#+\s*/, "").trim(), rows: [] };
      groups.push(g);
      continue;
    }
    if (!g) { g = { label: "", rows: [] }; groups.push(g); }
    const optional = line.startsWith("?");
    const excluded = /^x\s/i.test(line);
    const c = cells(line.replace(/^[?]\s*/, "").replace(/^x\s+/i, ""));
    g.rows.push({
      label: c[0] || "", note: c[1] || "", amount: amount(c[2]),
      optional, excluded
    });
  }
  for (const grp of groups) {
    grp.fixed = grp.rows.filter(r => !r.optional && !r.excluded)
      .reduce((t, r) => t + (r.amount || 0), 0);
    grp.optional = grp.rows.filter(r => r.optional && !r.excluded)
      .reduce((t, r) => t + (r.amount || 0), 0);
  }
  return groups;
}

/**
 * Stays.
 *   Havelock | 2 | Symphony Palms | +91 3192 282 222 | Govind Nagar Beach
 */
export function parseStays(text) {
  return String(text || "").split("\n").map(l => l.trim()).filter(Boolean).map(line => {
    const [place, nights, property, phone, address] = cells(line);
    return {
      place: place || "", nights: nights || "", property: property || "",
      phone: phone || "", address: address || ""
    };
  });
}

/* ---- rendering the document ------------------------------------------ */

const row = (label, value) => value
  ? `<tr><th scope="row">${esc(label)}</th><td>${esc(value)}</td></tr>` : "";

function itineraryHtml(days) {
  if (!days.length) return "";
  return days.map((d, i) => `
<section class="doc__day">
  <h3 class="doc__dayhead">
    <span class="doc__daynum">Day ${i + 1}</span>
    <span class="doc__daylabel">${esc(d.label)}</span>
    ${d.place ? `<span class="doc__dayplace">${esc(d.place)}</span>` : ""}
  </h3>
  <table class="doc__table">
    <thead><tr><th>Time</th><th>Destination / plan</th><th>Activities</th><th>Priority</th></tr></thead>
    <tbody>
      ${d.rows.map(r => `<tr${r.addon ? ' class="doc__addon"' : ""}>
        <td>${esc(r.time)}</td>
        <td>${r.addon ? "<span aria-hidden=\"true\">›</span> " : ""}${esc(r.place)}</td>
        <td>${esc(r.activity)}</td>
        <td>${r.priority ? `<span class="doc__pri doc__pri--${r.priority.toLowerCase().replace(/[^a-z]/g, "")}">${esc(r.priority)}</span>` : "—"}</td>
      </tr>`).join("")}
    </tbody>
  </table>
</section>`).join("");
}

function travelHtml(groups) {
  if (!groups.length) return "";
  return `
<section class="doc__block">
  <h3>Travel details</h3>
  <p class="doc__note">All times are local.</p>
  ${groups.map(g => `
  <div class="doc__leggroup">
    <h4>${esc(g.label)}${g.when ? ` · ${esc(g.when)}` : ""}${
      g.total ? ` · Journey ${esc(g.total)}, ${g.stops} stop${g.stops === 1 ? "" : "s"}` : ""}</h4>
    ${g.legs.map(l => `
      <div class="doc__leg">
        <span class="doc__legsvc">${esc(l.service)}</span>
        <span class="doc__legtime">${esc(l.dep)}</span>
        <span class="doc__legplace">${esc(l.from)}</span>
        <span class="doc__legarrow" aria-hidden="true">→</span>
        <span class="doc__legtime">${esc(l.arr)}</span>
        <span class="doc__legplace">${esc(l.to)}</span>
        <span class="doc__legdur">${esc(l.duration || "")}</span>
      </div>
      ${l.connection ? `<p class="doc__conn${l.connection.mins < 60 ? " doc__conn--tight" : ""}">
        ${esc(l.connection.note)} · ${esc(l.connection.text)} between flights${
          l.connection.where ? ` in ${esc(l.connection.where)}` : ""}</p>` : ""}
    `).join("")}
  </div>`).join("")}
</section>`;
}

function staysHtml(stays) {
  if (!stays.length) return "";
  return `
<section class="doc__block">
  <h3>Where she is staying</h3>
  <table class="doc__table">
    <thead><tr><th>Place</th><th>Nights</th><th>Property</th><th>Phone</th></tr></thead>
    <tbody>${stays.map(s => `<tr>
      <td>${esc(s.place)}</td>
      <td>${esc(s.nights)}</td>
      <td>${esc(s.property) || "<em>To be confirmed</em>"}${
        s.address ? `<br><span class="doc__sub">${esc(s.address)}</span>` : ""}</td>
      <td>${s.phone ? `<a href="tel:${esc(s.phone)}">${esc(s.phone)}</a>` : "—"}</td>
    </tr>`).join("")}</tbody>
  </table>
  <p class="doc__note">A phone number they can dial themselves does more than any promise.</p>
</section>`;
}

function budgetHtml(groups) {
  if (!groups.length) return "";
  const fixed = groups.reduce((t, g) => t + g.fixed, 0);
  const optional = groups.reduce((t, g) => t + g.optional, 0);
  const excluded = groups.some(g => g.rows.some(r => r.excluded));
  return `
<section class="doc__block">
  <h3>Budget</h3>
  <p class="doc__note">All figures in Indian rupees. Subtotals and the total are calculated from the
    lines below, so they cannot drift out of step with them.</p>
  ${groups.map(g => `
  <table class="doc__table doc__table--money">
    <thead><tr>
      <th colspan="2">${esc(g.label)}</th>
      <th class="doc__amt">${money(g.fixed + g.optional)}${g.optional && g.fixed ? " if all" : ""}</th>
    </tr></thead>
    <tbody>${g.rows.map(r => `<tr${r.excluded ? ' class="doc__excluded"' : ""}>
      <td>${r.optional ? "<span aria-hidden=\"true\">›</span> " : ""}${esc(r.label)}</td>
      <td class="doc__sub">${esc(r.note)}</td>
      <td class="doc__amt">${r.amount == null ? "—" : money(r.amount)}${r.excluded ? " *" : ""}</td>
    </tr>`).join("")}</tbody>
  </table>`).join("")}
  <table class="doc__table doc__total">
    <tbody>
      <tr><th scope="row">Fixed costs</th><td class="doc__amt">${money(fixed)}</td></tr>
      ${optional ? `<tr><th scope="row">Optional, if she does every one</th><td class="doc__amt">${money(optional)}</td></tr>` : ""}
      <tr class="doc__grand"><th scope="row">Estimated total</th><td class="doc__amt">${money(fixed + optional)}</td></tr>
    </tbody>
  </table>
  ${excluded ? `<p class="doc__note">* Shown for information and not counted in any total.</p>` : ""}
</section>`;
}

/**
 * The reassurance block.
 *
 * This is the half the one document we know worked did *not* have — it named
 * no property, gave no number to call, and said nothing about checking in.
 * It persuaded anyway, so none of this is load-bearing on the evidence. It is
 * here because the survey asked for it repeatedly and it costs a family
 * nothing to read.
 */
function familyHtml(d) {
  const rows = [
    row("Her number", d.myPhone),
    row("She will be in touch", d.checkIn),
    row("Who else knows the plan", d.contacts),
    row("How they can see where she is", d.sharing),
    row("If she misses her transport", d.backup),
    row("Local emergency numbers", d.localHelp),
    row("Travel insurance", d.insurance)
  ].filter(Boolean).join("");
  if (!rows) return "";
  return `
<section class="doc__block">
  <h3>Staying in touch, and if something goes wrong</h3>
  <table class="doc__table doc__table--kv"><tbody>${rows}</tbody></table>
</section>`;
}

function renderDocument(host, d) {
  const days = parseItinerary(d.itinerary);
  const travel = parseTravel(d.travel);
  const stays = parseStays(d.stays);
  const budget = parseBudget(d.budget);

  const n = nightsBetween(d.startDate, d.endDate);
  const total = budget.reduce((t, g) => t + g.fixed + g.optional, 0);
  const dates = dateRange(d.startDate, d.endDate);

  const stats = [
    n ? [`${n + 1} / ${n}`, "Days / nights"] : null,
    days.length ? [String(days.length), days.length === 1 ? "Day planned" : "Days planned"] : null,
    stays.length ? [String(stays.length), stays.length === 1 ? "Place" : "Places"] : null,
    total ? [money(total), "Estimated total"] : null
  ].filter(Boolean);

  host.innerHTML = `
<article class="doc" id="trip-document">
  <header class="doc__head">
    <p class="doc__brand">Pehchan the Traveller <span>· Find your identity</span></p>
    <h2 class="doc__title">${esc(d.destination || "Your trip")}</h2>
    <p class="doc__dates">${esc(dates)}${d.route ? ` · ${esc(d.route)}` : ""}</p>
    ${d.traveller ? `<p class="doc__for">Prepared for ${esc(d.traveller)}</p>` : ""}
    ${stats.length ? `<dl class="doc__stats">${stats.map(([v, l]) =>
      `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
  </header>

  ${days.some(day => day.rows.some(r => r.addon))
    ? `<p class="doc__note doc__note--legend">Rows marked › are optional add-ons at the same stop.</p>` : ""}

  ${itineraryHtml(days)}
  ${travelHtml(travel)}
  ${staysHtml(stays)}
  ${budgetHtml(budget)}
  ${familyHtml(d)}

  <footer class="doc__foot">
    <p class="doc__brand">Pehchan the Traveller <span>· Find your identity</span></p>
    ${d.contact ? `<p>${esc(d.contact)}</p>` : ""}
    <p class="doc__note">Built on her own device. Nothing on this page was sent to us or stored anywhere.</p>
  </footer>
</article>`;
}

/* ---- the form --------------------------------------------------------- */

const FIELDS = [
  { section: "The trip", note: "Four lines that give the document its cover." },
  { key: "destination", label: "Where", type: "text", required: true,
    placeholder: "Andaman & Nicobar Islands" },
  { key: "route", label: "Route", type: "text",
    placeholder: "Port Blair → Havelock → Neil → Port Blair" },
  { key: "startDate", label: "First day", type: "date", required: true },
  { key: "endDate", label: "Last day", type: "date", required: true },
  { key: "traveller", label: "Who it is for", type: "text",
    placeholder: "Her name — so the document is addressed to somebody" },

  { section: "Day by day",
    note: "One line per row: <code>time | place | what you are doing | priority</code>. "
      + "Start a day with <code>#</code>. Start a line with <code>&gt;</code> for an optional add-on at "
      + "the same stop. Priority is <code>must</code>, <code>ess</code>, <code>rec</code> or "
      + "<code>opt</code>. Pasting columns straight out of a spreadsheet works too." },
  { key: "itinerary", label: "The plan", type: "textarea", rows: 12, required: true,
    placeholder: `# Tuesday, 20 October | Port Blair
Afternoon | Arrival + hotel | Land 13:00, check in, rest | ess
Evening | Cellular Jail | Historical visit | ess

# Wednesday, 21 October | Port Blair → Havelock
6:00-7:30 AM | Ferry | Reach Havelock ~7:30 | ess
Morning | Elephant Beach | Speedboat | ess
> Snorkelling | | rec
> Sea Walk | I'd skip this if you're doing scuba | opt
4:00-6:30 PM | Radhanagar Beach | Sunset, swimming | must` },

  { section: "Getting there and back",
    note: "One line per leg: <code>service | from | departs | to | arrives</code>. Times as "
      + "<code>HH:MM</code>. Connections and journey length are worked out for you." },
  { key: "travel", label: "Flights, trains or buses", type: "textarea", rows: 7,
    placeholder: `# Outbound | Tuesday, 20 October
IndiGo 6E933 | DEL Delhi | 02:55 | MAA Chennai | 05:45
IndiGo 6E845 | MAA Chennai | 10:45 | IXZ Port Blair | 13:00

# Return | Sunday, 25 October
SpiceJet SG254 | IXZ Port Blair | 13:00 | CCU Kolkata | 15:10` },

  { section: "Where she is staying",
    note: "One line per place: <code>place | nights | property | phone | address</code>. "
      + "Hotel details were the joint most-requested thing in our survey — a number they can "
      + "dial themselves is the single strongest line on the page." },
  { key: "stays", label: "Stays", type: "textarea", rows: 5,
    placeholder: `Port Blair | 2 | Hotel name | +91 3192 000 000 | Aberdeen Bazaar
Havelock | 2 | Hotel name | +91 3192 000 000 | Govind Nagar Beach
Neil Island | 1 | Hotel name | | ` },

  { section: "Budget",
    note: "One line per cost: <code>label | note | amount</code>, grouped with <code>#</code>. "
      + "Prefix <code>?</code> for optional spending and <code>x</code> for a line shown but not "
      + "counted. Subtotals and totals are calculated, so they cannot drift." },
  { key: "budget", label: "What it costs", type: "textarea", rows: 10,
    placeholder: `# Flights
Return airfare | Both legs | 26000

# Stay
5 nights | Across three islands | 10000

# Ferries
Port Blair → Havelock | Makruzz, 6:00–7:30 AM | 1100

# Activities
Scuba diving | Havelock, introductory dive | 8000
? Parasailing | Elephant Beach | 3500
x Scooter hire | Per day, not in the total | 500` },

  { section: "Staying in touch",
    note: "Optional. The document that we know persuaded a family had none of this in it — but the "
      + "survey asked for it repeatedly, and it costs them nothing to read." },
  { key: "myPhone", label: "Her number", type: "tel" },
  { key: "checkIn", label: "How often she will check in", type: "select",
    options: ["", "Twice a day — morning and evening", "Once a day, every evening",
              "Every morning", "Every two days", "Whenever there is signal"] },
  { key: "contacts", label: "Who else knows the plan", type: "textarea", rows: 3,
    placeholder: "One name and number per line." },
  { key: "sharing", label: "How they can see where she is", type: "text",
    placeholder: "Live location shared on WhatsApp for the whole trip" },
  { key: "backup", label: "What she will do if she misses her transport", type: "textarea", rows: 2,
    placeholder: "Wait inside the terminal and book the next one. No cab from the rank at night." },
  { key: "localHelp", label: "Local emergency numbers and nearest hospital", type: "textarea", rows: 2,
    placeholder: "112 nationwide. Nearest hospital: name, distance from the hotel." },
  { key: "insurance", label: "Travel insurance", type: "text", placeholder: "Provider and policy number" },
  { key: "contact", label: "Your contact line for the footer", type: "text",
    placeholder: "Phone · email · @handle" }
];

const KEYS = FIELDS.filter(f => !f.section).map(f => f.key);
const STORE = "pehchan-trip-document";
const readSaved = () => { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } };
const writeSaved = (d) => { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch { /* full or blocked */ } };

function collect(form) {
  const d = {};
  KEYS.forEach(k => {
    const el = form.elements[k];
    if (el && el.value.trim()) d[k] = el.value.trim();
  });
  return d;
}

function fieldHtml(f, saved) {
  if (f.section) {
    return `<div class="form-section"><h2>${esc(f.section)}</h2>${
      f.note ? `<p class="muted doc-help">${f.note}</p>` : ""}</div>`;
  }
  const id = "d-" + f.key;
  const v = saved[f.key] || "";
  const req = f.required ? ' <span class="req">required</span>' : "";
  if (f.type === "textarea") {
    return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
      <textarea id="${id}" name="${f.key}" rows="${f.rows || 3}" spellcheck="false" data-voice
        placeholder="${esc(f.placeholder || "")}">${esc(v)}</textarea></div>`;
  }
  if (f.type === "select") {
    return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
      <select id="${id}" name="${f.key}">${f.options.map(o =>
        `<option${v === o ? " selected" : ""} value="${esc(o)}">${esc(o) || "—"}</option>`).join("")}</select></div>`;
  }
  return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
    <input type="${f.type}" id="${id}" name="${f.key}" value="${esc(v)}"
      placeholder="${esc(f.placeholder || "")}"></div>`;
}

/* ---- boot ------------------------------------------------------------- */

const app = typeof document === "undefined" ? null : document.getElementById("document-app");
if (app) {
  const saved = readSaved();

  app.innerHTML = `
<div class="doc-builder">
  <form id="doc-form" novalidate>
    ${FIELDS.map(f => fieldHtml(f, saved)).join("")}
    <div class="btn-row">
      <button class="btn btn--primary" type="button" id="doc-print">Save as PDF or print</button>
    </div>
    <p class="muted" id="doc-status" role="status" aria-live="polite"></p>
  </form>
  <div class="doc-preview">
    <p class="eyebrow doc-preview__label">The document, as they will see it</p>
    <div id="doc-out"></div>
  </div>
</div>`;

  import("./voice.js").then(m => m.initVoice(app)).catch(() => { /* optional */ });

  const form = document.getElementById("doc-form");
  const out = document.getElementById("doc-out");
  const status = document.getElementById("doc-status");

  // Live preview: she is writing a document, so she should be looking at the
  // document, not at a form with a "generate" button at the bottom.
  let t;
  const refresh = () => {
    const d = collect(form);
    renderDocument(out, d);
    writeSaved(d);
  };
  form.addEventListener("input", () => { clearTimeout(t); t = setTimeout(refresh, 250); });
  form.addEventListener("change", refresh);
  refresh();

  document.getElementById("doc-print").addEventListener("click", () => {
    const d = collect(form);
    const missing = FIELDS.filter(f => f.required && !d[f.key]).map(f => f.label);
    if (missing.length) {
      status.textContent = "Still needed: " + missing.join(", ") + ".";
      return;
    }
    status.textContent = "";
    // The browser's own print engine is the PDF writer: correct fonts, a real
    // rupee sign, and a file she can send on WhatsApp. On Android that is
    // Print → Save as PDF; on iPhone, Share → Print → Save to Files.
    refresh();
    window.print();
  });
}
