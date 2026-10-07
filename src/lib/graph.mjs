import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "content");
const read = (f) => JSON.parse(readFileSync(join(DIR, f), "utf8"));

/**
 * Loads the content model, resolves every relationship into a navigable graph and
 * fails loudly on a dangling reference. This validation is what keeps a growing
 * content set from silently rotting — see docs/01-brand-and-architecture.md §3.
 */
export function buildGraph() {
  const site = read("site.json");
  // A custom domain always serves from its own root, so it overrides both the
  // origin and the subpath. One field to move the whole site.
  if (site.customDomain) {
    site.origin = "https://" + site.customDomain;
    site.basePath = "";
  }
  // Single source of truth for absolute URLs. Templates and the shell must use
  // this, never `origin` alone, or a subpath deploy loses the base path.
  site.siteUrl = site.origin + (site.basePath || "");
  const regions = read("regions.json");
  const countries = read("countries.json");
  const destinations = read("destinations.json");
  const taxonomies = read("taxonomies.json");
  const comfort = read("comfort.json");
  const tripReports = read("trip-reports.json");

  const errors = [];
  const byRegion = new Map(regions.map(r => [r.slug, r]));
  const byCountry = new Map(countries.map(c => [c.slug, c]));
  const byDest = new Map(destinations.map(d => [d.slug, d]));

  // Two independent trees, so each can grow without disturbing the other:
  //   /international/{region}/{country}/{destination}/
  //   /india/{region}/{state}/{destination}/
  const rootFor = (scope) => scope === "india" ? "/india" : "/international";
  for (const r of regions) {
    if (!["international", "india"].includes(r.scope)) errors.push(`region ${r.slug}: bad scope "${r.scope}"`);
    r.root = rootFor(r.scope);
    r.url = `${r.root}/${r.slug}/`;
    r.countries = countries.filter(c => c.region === r.slug);

  }
  for (const c of countries) {
    if (!byRegion.has(c.region)) { errors.push(`country ${c.slug}: unknown region "${c.region}"`); continue; }
    c.region_ = byRegion.get(c.region);
    c.scope = c.region_.scope;
    c.url = `${c.region_.root}/${c.region}/${c.slug}/`;
    c.destinations = []; c.publishedDestinations = []; c.draftDestinations = [];
  }
  const GUIDE_FIELDS = ["summary", "whyVisit", "bestTime", "gettingThere", "howManyDays",
                        "whereToStay", "thingsToDo", "food", "budgetNotes", "safety", "culture", "faqs"];
  for (const d of destinations) {
    d.status = d.status || "published";
    const c = byCountry.get(d.country);
    if (!c) { errors.push(`destination ${d.slug}: unknown country "${d.country}"`); continue; }
    // A draft is a deliberate placeholder: name, place and nothing invented.
    // A published guide must be complete — the build refuses a half-written one.
    if (d.status === "published") {
      const missing = GUIDE_FIELDS.filter(f => !d[f] || (Array.isArray(d[f]) && !d[f].length));
      if (missing.length) errors.push(`destination ${d.slug}: published but missing ${missing.join(", ")}`);
    } else if (d.status !== "draft") {
      errors.push(`destination ${d.slug}: bad status "${d.status}"`);
    }
    d.country_ = c; d.region_ = c.region_; d.region = c.region;
    d.scope = c.scope;
    d.url = `${c.region_.root}/${c.region}/${c.slug}/${d.slug}/`;
    c.destinations.push(d);
    (d.status === "draft" ? (c.draftDestinations ||= []) : (c.publishedDestinations ||= [])).push(d);
  }
  // A region with nothing in it is a promise the site cannot keep. Empty regions
  // stay in regions.json so they come back the day they have content, but until
  // then they get no page, no nav entry and no share image.
  const liveRegions = regions.filter(r => r.countries.some(c => c.destinations.length));

  const g = {
    site, regions: liveRegions, allRegions: regions, countries, destinations, taxonomies, comfort, tripReports,
    intlRegions: liveRegions.filter(r => r.scope === "international"),
    indiaRegions: liveRegions.filter(r => r.scope === "india"),
    intlDestinations: destinations.filter(d => d.scope === "international" && d.status === "published"),
    indiaDestinations: destinations.filter(d => d.scope === "india" && d.status === "published"),
    intlDrafts: destinations.filter(d => d.scope === "international" && d.status === "draft"),
    indiaDrafts: destinations.filter(d => d.scope === "india" && d.status === "draft"),
    published: destinations.filter(d => d.status === "published"),
    drafts: destinations.filter(d => d.status === "draft"),
    byRegion, byCountry, byDest,
    errors
  };

  return g;
}
