/**
 * Site shell behaviour: navigation, theme, search overlay, saves, sharing,
 * maps, newsletter capture and reveal-on-scroll. Progressive enhancement only —
 * every page is fully readable and navigable with this file blocked.
 */
import { track, autoTrack } from "./analytics.js";
import { store } from "./account.js";

/** Base path for a project-site subpath deploy; empty at a domain root. */
const BASE = document.body.dataset.base || "";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- theme ------------------------------------------------------ */
$("[data-theme-toggle]")?.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("pehchan-theme", next); } catch {}
});

/* ---------- mega nav + drawer ------------------------------------------ */
const megaButtons = $$("[data-mega]");
const closeMega = () => {
  $$("[data-mega-panel]").forEach(p => delete p.dataset.open);
  megaButtons.forEach(b => b.setAttribute("aria-expanded", "false"));
};
megaButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = $(`[data-mega-panel="${btn.dataset.mega}"]`);
    const open = panel.hasAttribute("data-open");
    closeMega();
    if (!open) { panel.dataset.open = ""; btn.setAttribute("aria-expanded", "true"); }
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".masthead")) closeMega();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMega(); });

const drawerBtn = $("[data-drawer-toggle]"), drawer = $("[data-drawer]");
drawerBtn?.addEventListener("click", () => {
  const open = drawer.hasAttribute("data-open");
  if (open) { delete drawer.dataset.open; document.body.style.overflow = ""; }
  else { drawer.dataset.open = ""; document.body.style.overflow = "hidden"; }
  drawerBtn.setAttribute("aria-expanded", String(!open));
});

// Desktop-only CTA — kept out of the HTML flow on small screens where the
// drawer already carries it.
const desktopCta = $("[data-desktop-cta]");
const syncCta = () => { if (desktopCta) desktopCta.style.display = innerWidth >= 900 ? "" : "none"; };
syncCta(); addEventListener("resize", syncCta, { passive: true });

/* ---------- search overlay --------------------------------------------- */
const overlay = $("[data-search-overlay]");
const input = $("[data-search-input]");
const results = $("[data-search-results]");
let index = null, activeIdx = -1;

async function loadIndex() {
  if (index) return index;
  const res = await fetch(BASE + "/assets/search-index.json");
  index = await res.json();
  return index;
}

/**
 * Ranked search over the site index. Deliberately intent-aware rather than a
 * plain substring match: "mountain luxury hotels in India" should surface stays,
 * destinations and experiences together, which is exactly the brief's example.
 */
export function search(query, data, typeFilter = "all") {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const stop = new Set(["in", "the", "a", "of", "for", "to", "and", "with", "on", "at", "best", "top"]);
  const terms = q.split(/\s+/).filter(t => t.length > 1 && !stop.has(t));
  if (!terms.length) return [];

  const TYPE_HINTS = {
    stay: ["hotel", "hotels", "stay", "stays", "resort", "resorts", "villa", "villas", "lodge", "riad", "camp", "boutique", "accommodation"],
    experience: ["experience", "experiences", "tour", "tours", "activity", "activities", "trek", "hike", "class", "workshop", "safari"],
    journey: ["itinerary", "itineraries", "journey", "journeys", "trip", "days", "day", "route"],
    story: ["story", "stories", "blog", "read", "writing"],
    destination: ["destination", "destinations", "guide", "guides", "country", "city", "visit"]
  };
  const hinted = Object.entries(TYPE_HINTS)
    .filter(([, words]) => words.some(w => terms.includes(w)))
    .map(([t]) => t);

  return data.map(item => {
    const name = item.n.toLowerCase(), desc = item.d.toLowerCase(), keys = item.k.toLowerCase();
    let score = 0, matched = 0;
    for (const t of terms) {
      let s = 0;
      if (name === t) s += 60;
      else if (name.startsWith(t)) s += 34;
      else if (name.includes(t)) s += 24;
      if (keys.includes(t)) s += 12;
      if (desc.includes(t)) s += 6;
      if (s) matched++;
      score += s;
    }
    if (!matched) return null;
    // Every meaningful term matching is a much stronger signal than one strong hit.
    score *= matched / terms.length;
    if (hinted.length && hinted.includes(item.t)) score *= 1.9;
    if (typeFilter !== "all" && item.t !== typeFilter.replace(/s$/, "")) return null;
    return { ...item, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
}

const TYPE_LABEL = { destination: "Destination", stay: "Stay", experience: "Experience",
  journey: "Journey", story: "Story", collection: "Collection", tool: "Tool" };

function renderResults(list, target, query) {
  activeIdx = -1;
  if (!query.trim()) { target.innerHTML = `<li class="search-empty">Search destinations, stays, experiences, journeys and stories.</li>`; return; }
  if (!list.length) {
    target.innerHTML = `<li class="search-empty">Nothing matched “${query.replace(/</g, "&lt;")}”.
      Try a place, a kind of stay, or a trip length — or <a href="${BASE}/destinations/">browse destinations</a>.</li>`;
    track("search", { query, resultCount: 0 });
    return;
  }
  target.innerHTML = list.slice(0, 20).map((r, i) => `<li><a href="${r.u}" data-rank="${i}" data-type="${r.t}">
    <span class="r-type">${TYPE_LABEL[r.t] || r.t}</span>
    <span class="r-title">${r.n}</span>
    <span class="r-desc">${r.d}</span></a></li>`).join("");
  track("search", { query, resultCount: list.length });
}

async function runOverlaySearch() {
  const data = await loadIndex();
  renderResults(search(input.value, data), results, input.value);
}

function openSearch() {
  overlay.dataset.open = "";
  document.body.style.overflow = "hidden";
  input.focus();
  loadIndex().then(() => renderResults([], results, ""));
}
function closeSearch() { delete overlay.dataset.open; document.body.style.overflow = ""; }

$$("[data-search-open]").forEach(b => b.addEventListener("click", openSearch));
$("[data-search-close]")?.addEventListener("click", closeSearch);
overlay?.addEventListener("click", (e) => { if (e.target === overlay) closeSearch(); });

let searchTimer;
input?.addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(runOverlaySearch, 130); });

document.addEventListener("keydown", (e) => {
  if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
      !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
    e.preventDefault(); openSearch(); return;
  }
  if (!overlay?.hasAttribute("data-open")) return;
  if (e.key === "Escape") { closeSearch(); return; }
  const items = $$("a", results);
  if (!items.length) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    activeIdx = (activeIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[activeIdx].focus();
  }
});
results?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (a) track("search_result_click", { query: input.value, resultType: a.dataset.type, rank: Number(a.dataset.rank) });
});

/* ---------- saves ------------------------------------------------------ */
async function syncSaveButtons() {
  for (const btn of $$("[data-save]")) {
    const on = await store.has(btn.dataset.entityType, btn.dataset.entity);
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? "Saved ✓" : "Save";
  }
}
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-save]");
  if (!btn) return;
  const { entityType: type, entity: slug, label } = btn.dataset;
  if (await store.has(type, slug)) await store.remove(type, slug);
  else { await store.add({ type, slug, label, url: location.pathname }); track("save_item", { entityType: type, slug }); }
  syncSaveButtons();
});
syncSaveButtons();

/* ---------- share ------------------------------------------------------ */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-share]");
  if (!btn) return;
  const shareData = { title: btn.dataset.shareTitle || document.title, url: location.href };
  try {
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard.writeText(location.href); btn.textContent = "Link copied ✓"; }
  } catch { /* user dismissed */ }
});

/* ---------- print / download itinerary --------------------------------- */
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-download-itinerary]")) window.print();
});

/* ---------- click-to-load maps ----------------------------------------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-map-load]");
  if (!btn) return;
  const box = btn.closest("[data-map]");
  const { lat, lng, label } = box.dataset;
  const d = 0.35;
  const bbox = [Number(lng) - d, Number(lat) - d / 2, Number(lng) + d, Number(lat) + d / 2].join("%2C");
  box.innerHTML = `<iframe title="Map of ${label}" loading="lazy"
    src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}"></iframe>`;
  track("map_load", { label });
});

/* ---------- newsletter -------------------------------------------------- */
$$("[data-newsletter]").forEach(form => {
  const status = form.parentElement.querySelector(".form-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
      status.hidden = false; status.dataset.tone = "err";
      status.textContent = "That does not look like an email address — check it and try again.";
      return;
    }
    track("newsletter_submit", { placement: form.dataset.placement });
    status.hidden = false; status.dataset.tone = "ok";
    status.textContent = "Thank you — no email provider is connected yet, so nothing was transmitted or stored. "
      + "This form is wired and waiting for a provider endpoint.";
    form.reset();
  });
});
if ("IntersectionObserver" in window) {
  const nlObserver = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) {
      track("newsletter_view", { placement: en.target.dataset.placement });
      nlObserver.unobserve(en.target);
    }
  }, { threshold: 0.4 });
  $$("[data-placement]").forEach(el => nlObserver.observe(el));
}

/* ---------- reveal on scroll -------------------------------------------- */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }, { rootMargin: "0px 0px -40px 0px" });
  $$("[data-reveal]").forEach(el => io.observe(el));
} else {
  $$("[data-reveal]").forEach(el => el.classList.add("in"));
}

autoTrack();
