/** Full search page: same ranking engine as the overlay, plus type filters and URL state. */
import { track } from "./analytics.js";
import { search } from "./site.js";

/** Base path for a project-site subpath deploy; empty at a domain root. */
const BASE = document.body.dataset.base || "";

const form = document.querySelector("[data-search-page]");
const results = document.querySelector("[data-search-page-results]");
const count = document.querySelector("[data-search-count]");
const input = document.getElementById("q");

const TYPE_LABEL = { destination: "Destination", stay: "Stay", experience: "Experience",
  journey: "Journey", story: "Story", collection: "Collection", tool: "Tool" };

let index = null;

async function load() {
  if (!index) index = await (await fetch(BASE + "/assets/search-index.json")).json();
  return index;
}

function render(list, query) {
  if (!query.trim()) {
    count.textContent = "";
    results.innerHTML = `<li class="search-empty">Type to search ${index.length} destinations, stays, experiences, journeys, collections and stories.</li>`;
    return;
  }
  count.textContent = `${list.length} result${list.length === 1 ? "" : "s"} for “${query}”`;
  if (!list.length) {
    results.innerHTML = `<li class="search-empty">Nothing matched. Try a place name, a kind of stay, or a trip length —
      or <a href="${BASE}/destinations/">browse destinations</a>.</li>`;
    track("search", { query, resultCount: 0 });
    return;
  }
  results.innerHTML = list.slice(0, 60).map((r, i) => `<li><a href="${r.u}" data-rank="${i}" data-type="${r.t}">
    <span class="r-type">${TYPE_LABEL[r.t] || r.t}</span>
    <span class="r-title">${r.n}</span><span class="r-desc">${r.d}</span></a></li>`).join("");
  track("search", { query, resultCount: list.length });
}

async function run(pushState = true) {
  const data = await load();
  const type = form.querySelector('input[name="type"]:checked')?.value || "all";
  const q = input.value;
  render(search(q, data, type), q);
  if (pushState) {
    const url = new URL(location.href);
    q ? url.searchParams.set("q", q) : url.searchParams.delete("q");
    type !== "all" ? url.searchParams.set("type", type) : url.searchParams.delete("type");
    history.replaceState(null, "", url);
  }
}

if (form) {
  let t;
  input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(run, 150); });
  form.addEventListener("change", () => run());
  form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
  results.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) track("search_result_click", { query: input.value, resultType: a.dataset.type, rank: Number(a.dataset.rank) });
  });

  const params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");
  if (params.get("type")) {
    const radio = form.querySelector(`input[name="type"][value="${params.get("type")}"]`);
    if (radio) radio.checked = true;
  }
  load().then(() => { run(false); input.focus(); });
}
