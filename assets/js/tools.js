/** Travel tools. Each runs entirely in the browser; nothing is transmitted. */
import { track } from "./analytics.js";

/** Base path for a project-site subpath deploy; empty at a domain root. */
const BASE = document.body.dataset.base || "";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = (n, cur) => `${cur} ${Math.round(n).toLocaleString("en-US")}`;


function show(root, html) {
  const box = $("[data-output]", root);
  box.hidden = false;
  box.innerHTML = html;
  track("tool_use", { tool: root.dataset.tool });
}

/* ---------------- trip budget calculator ------------------------------ */
function budget(root) {
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(root);
    const n = (k) => Number(f.get(k)) || 0;
    const days = Math.max(1, n("days")), people = Math.max(1, n("travellers")), cur = f.get("currency");
    const rooms = Math.ceil(people / 2);
    const lines = [
      ["Accommodation", n("stay") * days * rooms, `${money(n("stay"), cur)} × ${days} nights × ${rooms} room${rooms > 1 ? "s" : ""}`],
      ["Food", n("food") * days * people, `${money(n("food"), cur)} × ${days} days × ${people}`],
      ["Local transport", n("local") * days * people, `${money(n("local"), cur)} × ${days} days × ${people}`],
      ["Experiences", n("exp") * days * people, `${money(n("exp"), cur)} × ${days} days × ${people}`],
      ["Flights", n("flights") * people, `${money(n("flights"), cur)} × ${people}`]
    ];
    const sub = lines.reduce((t, l) => t + l[1], 0);
    const buffer = sub * (n("buffer") / 100);
    const total = sub + buffer;
    show(root, `
      <div class="tool-figure">${money(total, cur)}<small>Estimated total for ${people} traveller${people > 1 ? "s" : ""}, ${days} days</small></div>
      <p class="muted" style="margin-top:var(--s-4);font-size:var(--t-sm)">${money(total / people, cur)} per person ·
      ${money(total / days, cur)} per day · ${money(total / days / people, cur)} per person per day</p>
      <div class="bar-row" style="margin-top:var(--s-6)">
        ${lines.concat([[`Contingency (${n("buffer")}%)`, buffer, "Applied to everything above"]])
          .map(([l, v]) => `<div><span>${esc(l)}</span><span class="bar"><i style="width:${total ? (v / total * 100).toFixed(1) : 0}%"></i></span><span>${money(v, cur)}</span></div>`).join("")}
      </div>
      <p class="muted" style="margin-top:var(--s-5);font-size:var(--t-sm)">These are your numbers, not ours — we do not
      ship estimates of what a destination "should" cost. <a href="${BASE}/plan/">Plan the trip</a> and
      <a href="${BASE}/collections/">browse by budget band</a>.</p>`);
  });
}

/* ---------------- currency converter ---------------------------------- */
function currency(root) {
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(root);
    const amount = Number(f.get("amount")) || 0, rate = Number(f.get("rate")) || 0;
    const from = f.get("from"), to = f.get("to");
    if (from === to) { show(root, `<p class="muted">Those are the same currency.</p>`); return; }
    show(root, `
      <div class="tool-figure">${money(amount * rate, to)}<small>${money(amount, from)} at ${rate} ${to} per ${from}</small></div>
      <div class="bar-row" style="margin-top:var(--s-6)">
        ${[1, 5, 10, 20, 50, 100].map(m => `<div><span>${money(amount * m / 10, from)}</span>
          <span class="bar"><i style="width:${m}%"></i></span><span>${money(amount * m / 10 * rate, to)}</span></div>`).join("")}
      </div>
      <p class="muted" style="margin-top:var(--s-5);font-size:var(--t-sm)">We ask you for the rate rather than shipping a
      table that silently goes stale. Check a live source the morning you convert, and remember that card and ATM rates
      differ from the mid-market rate you looked up.</p>`);
  });
}

/* ---------------- packing list ---------------------------------------- */
const PACKING = {
  base: ["Passport and visas", "Travel insurance documents", "Cards that work abroad plus some local cash",
    "Universal adapter", "Power bank", "Medication in original packaging", "Reusable water bottle"],
  climate: {
    tropical: ["Light breathable clothing", "Insect repellent with DEET or picaridin", "Rain layer for afternoon storms", "Quick-dry towel"],
    temperate: ["Layers you can add and remove", "A light waterproof jacket", "Comfortable walking shoes"],
    alpine: ["Insulated mid-layer", "Waterproof shell and trousers", "Warm hat and gloves", "Merino base layers", "Broken-in boots"],
    desert: ["Sun hat and high-SPF sunscreen", "A warm layer for after dark", "Loose long sleeves", "Lip balm and moisturiser"],
    monsoon: ["Waterproof jacket and dry bag", "Sandals that survive being soaked", "Quick-dry clothing", "Waterproof phone pouch"]
  },
  style: {
    city: ["One smart outfit for dinner", "A day bag that closes properly", "Offline maps downloaded"],
    beach: ["Swimwear ×2", "Reef-safe sunscreen", "Beach towel", "Waterproof phone pouch"],
    hiking: ["Daypack (20–30L)", "Trekking poles", "Blister plasters", "Head torch", "Trail snacks"],
    safari: ["Neutral-coloured clothing", "Binoculars", "Wide-brim hat", "Dust-proof camera bag"],
    luxury: ["Smart-casual outfits for dinner", "Garment folder to avoid creasing", "Comfortable but presentable shoes"]
  },
  extras: {
    altitude: ["Altitude medication if your doctor advises it", "Extra warm layers — nights are cold at height", "Lip balm with SPF"],
    photography: ["Spare batteries", "Double the card storage you think you need", "Lens cloth", "Compact tripod"],
    swimming: ["Goggles", "Dry bag", "Rash vest for sun protection"],
    "religious sites": ["Scarf or shawl", "Clothing covering shoulders and knees", "Socks — shoes come off"],
    children: ["Snacks and entertainment for transfers", "Child-dose medication", "Spare change of clothes in the day bag"],
    "long-haul flight": ["Compression socks", "Eye mask and earplugs", "Refillable bottle for after security", "One full change of clothes in hand luggage"]
  }
};
function packing(root) {
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(root);
    const days = Number(f.get("days")) || 7;
    const groups = [
      ["Essentials", PACKING.base],
      ["For the climate", PACKING.climate[f.get("climate")] || []],
      ["For the trip type", PACKING.style[f.get("style")] || []],
      ...f.getAll("extras").map(x => [`For ${x}`, PACKING.extras[x] || []])
    ].filter(gr => gr[1].length);
    const clothing = days >= 10
      ? "Pack for seven days and plan to do laundry — beyond a week, more clothing is a worse trip, not a better one."
      : `Pack for ${days} day${days > 1 ? "s" : ""} plus one spare set.`;
    show(root, `
      <p class="muted" style="margin-bottom:var(--s-5)">${clothing}</p>
      ${groups.map(([title, items]) => `<h3 class="display" style="font-size:var(--t-md);margin-top:var(--s-6)">${esc(title)}</h3>
        <ul class="checklist">${items.map(i => `<li><input type="checkbox"><span>${esc(i)}</span></li>`).join("")}</ul>`).join("")}
      <div class="btn-row" style="margin-top:var(--s-6)"><button class="btn btn--ghost btn--sm" type="button" onclick="window.print()">Print this list</button></div>`);
    wireTicks(root);
  });
}
function wireTicks(root) {
  $$(".checklist input", root).forEach(cb => cb.addEventListener("change", () =>
    cb.closest("li").classList.toggle("done", cb.checked)));
}

/* ---------------- trip duration --------------------------------------- */
function duration(root) {
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(root);
    const start = f.get("start"), end = f.get("end");
    if (!start || !end) { show(root, `<p class="muted">Enter both dates.</p>`); return; }
    const total = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
    if (total < 1) { show(root, `<p class="muted">The return date is before departure.</p>`); return; }
    const flight = Number(f.get("flight")) || 0, tz = Number(f.get("tz")) || 0, bases = Math.max(1, Number(f.get("bases")) || 1);
    const travelDays = Math.min(total, (flight * 2) / 24 > 0.6 ? 2 : 1);
    const jetlag = Math.min(3, Math.round(tz / 3));
    const transfers = (bases - 1) * 0.5;
    const usable = Math.max(0, total - travelDays - jetlag - transfers);
    show(root, `
      <div class="tool-figure">${usable.toFixed(1)} days<small>Genuinely usable out of ${total} calendar days</small></div>
      <div class="bar-row" style="margin-top:var(--s-6)">
        ${[["Usable days", usable], ["Travel days", travelDays], ["Jet lag recovery", jetlag], ["Transfer half-days", transfers]]
          .map(([l, v]) => `<div><span>${esc(l)}</span><span class="bar"><i style="width:${(v / total * 100).toFixed(1)}%"></i></span><span>${v.toFixed(1)}</span></div>`).join("")}
      </div>
      <p class="muted" style="margin-top:var(--s-5);font-size:var(--t-sm)">
      ${bases > 1 ? `Each move between bases costs roughly half a day once you count packing, checkout, transfer and check-in. With ${bases} bases that is ${transfers} days. ` : ""}
      ${usable / total < 0.6 ? "<strong>You are spending more of this trip in transit than on the ground.</strong> Cut a base or add days." : "That ratio is healthy."}
      <a href="${BASE}/plan/">Build an itinerary that fits</a>.</p>`);
  });
}

/* ---------------- filters (best time, visa) ---------------------------- */
function besttime(root) { filterTable(root); }
function visa(root) { filterTable(root); }
function filterTable(root) {
  const input = $("[data-filter]", root), rows = $$("[data-rows] tr", root);
  input?.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    let shown = 0;
    rows.forEach(r => { const hit = !q || r.dataset.text.includes(q); r.hidden = !hit; if (hit) shown++; });
    track("tool_use", { tool: root.dataset.tool, query: q, results: shown });
  });
}

/* ---------------- travel checklist ------------------------------------ */
const CHECKLIST = [
  ["8–12 weeks out", ["Check passport validity — many countries require six months beyond your return",
    "Research visa requirements for your nationality on the official government site",
    "Book flights and the first two nights of accommodation", "Check required and recommended vaccinations with a travel clinic"]],
  ["4–6 weeks out", ["Buy travel insurance that covers your actual activities", "Book anything with a capacity limit — permits, trains, restaurants",
    "Tell your bank and card providers your travel dates", "Arrange an international driving permit if you will drive"]],
  ["1–2 weeks out", ["Download offline maps and translation packs", "Photograph passport, insurance and bookings; store a copy separately",
    "Order local currency if the destination is cash-heavy", "Confirm airport transfers and check-in times"]],
  ["Final 48 hours", ["Check in online and choose seats", "Check the weather forecast and adjust the packing list",
    "Charge everything, including the power bank", "Re-read entry requirements — they change"]],
  ["On arrival", ["Buy a local SIM or activate an eSIM", "Note the local emergency number",
    "Save your accommodation's address in the local language", "Take out a small amount of cash for taxis and tips"]]
];
function checklist(root) {
  const key = "pehchan-checklist";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  const host = $("[data-checklist]", root);
  host.innerHTML = CHECKLIST.map(([phase, items]) => `
    <h3 class="display" style="font-size:var(--t-md);margin-top:var(--s-6)">${esc(phase)}</h3>
    <ul class="checklist">${items.map(i => {
      const id = phase + "|" + i;
      return `<li class="${state[id] ? "done" : ""}"><input type="checkbox" data-id="${esc(id)}"${state[id] ? " checked" : ""}><span>${esc(i)}</span></li>`;
    }).join("")}</ul>`).join("");
  host.addEventListener("change", (e) => {
    const cb = e.target.closest("input[data-id]");
    if (!cb) return;
    state[cb.dataset.id] = cb.checked;
    cb.closest("li").classList.toggle("done", cb.checked);
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
    track("tool_use", { tool: "checklist" });
  });
  $("[data-reset-checklist]", root)?.addEventListener("click", () => {
    state = {};
    try { localStorage.removeItem(key); } catch {}
    $$("input[data-id]", host).forEach(cb => { cb.checked = false; cb.closest("li").classList.remove("done"); });
  });
}

/* ---------------- destination comparison ------------------------------ */
async function compare(root) {
  const catalog = await (await fetch(BASE + "/assets/catalog.json")).json();
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(root);
    const a = catalog.destinations.find(d => d.slug === f.get("a"));
    const b = catalog.destinations.find(d => d.slug === f.get("b"));
    if (!a || !b || a === b) { show(root, `<p class="muted">Pick two different destinations.</p>`); return; }
    const stays = (d) => catalog.hotels.filter(h => h.destination === d.slug);
    const rows = [
      ["Country", a.country, b.country],
      ["Region", a.region, b.region],
      ["Best time", a.bestTime[0].split(":")[0], b.bestTime[0].split(":")[0]],
      ["Days needed", a.days.split(";")[0], b.days.split(";")[0]],
      ["Currency", a.currency, b.currency],
      ["Stays listed", String(stays(a).length), String(stays(b).length)],
      ["Price bands", [...new Set(stays(a).map(h => "$".repeat(h.priceBand)))].join(", ") || "—",
                      [...new Set(stays(b).map(h => "$".repeat(h.priceBand)))].join(", ") || "—"],
      ["Experiences", String(catalog.experiences.filter(x => x.destination === a.slug).length),
                      String(catalog.experiences.filter(x => x.destination === b.slug).length)],
      ["Best for", a.tags.slice(0, 4).join(", ").replace(/-/g, " "), b.tags.slice(0, 4).join(", ").replace(/-/g, " ")],
      ["Budget note", a.budgetNotes, b.budgetNotes]
    ];
    show(root, `
      <div class="table-scroll"><table class="data">
        <thead><tr><th></th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead>
        <tbody>${rows.map(([l, x, y]) => `<tr><th scope="row">${esc(l)}</th><td>${esc(x)}</td><td>${esc(y)}</td></tr>`).join("")}</tbody>
      </table></div>
      <div class="btn-row" style="margin-top:var(--s-5)">
        <a class="btn btn--ghost btn--sm" href="${a.url}">${esc(a.name)} guide</a>
        <a class="btn btn--ghost btn--sm" href="${b.url}">${esc(b.name)} guide</a>
        <a class="btn btn--primary btn--sm" href="${BASE}/plan/">Plan a trip</a>
      </div>`);
  });
}

/* ---------------- dispatch --------------------------------------------- *
 * Runs last: the handler table must be built after every handler is
 * initialised, or a `const` handler is still in its temporal dead zone and the
 * whole module throws before any tool wires up.                            */
const panel = $("[data-tool]");
if (panel) {
  const handlers = { budget, currency, packing, duration, besttime, checklist, compare, visa };
  (handlers[panel.dataset.tool] || (() => {}))(panel);
}
