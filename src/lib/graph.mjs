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
  const hotels = read("hotels.json");
  const experiences = read("experiences.json");
  const itineraries = read("itineraries.json");
  const stories = read("stories.json");
  const taxonomies = read("taxonomies.json");

  const errors = [];
  const byRegion = new Map(regions.map(r => [r.slug, r]));
  const byCountry = new Map(countries.map(c => [c.slug, c]));
  const byDest = new Map(destinations.map(d => [d.slug, d]));
  const byHotel = new Map(hotels.map(h => [h.slug, h]));
  const byExp = new Map(experiences.map(e => [e.slug, e]));
  const byItin = new Map(itineraries.map(i => [i.slug, i]));

  // Two independent trees, so each can grow without disturbing the other:
  //   /international/{region}/{country}/{destination}/
  //   /india/{region}/{state}/{destination}/
  const rootFor = (scope) => scope === "india" ? "/india" : "/international";
  for (const r of regions) {
    if (!["international", "india"].includes(r.scope)) errors.push(`region ${r.slug}: bad scope "${r.scope}"`);
    r.root = rootFor(r.scope);
    r.url = `${r.root}/${r.slug}/`;
    r.countries = countries.filter(c => c.region === r.slug);
    if (!r.countries.length) errors.push(`region ${r.slug}: no countries or states`);
  }
  for (const c of countries) {
    if (!byRegion.has(c.region)) { errors.push(`country ${c.slug}: unknown region "${c.region}"`); continue; }
    c.region_ = byRegion.get(c.region);
    c.scope = c.region_.scope;
    c.url = `${c.region_.root}/${c.region}/${c.slug}/`;
    c.destinations = [];
  }
  for (const d of destinations) {
    const c = byCountry.get(d.country);
    if (!c) { errors.push(`destination ${d.slug}: unknown country "${d.country}"`); continue; }
    d.country_ = c; d.region_ = c.region_; d.region = c.region;
    d.scope = c.scope;
    d.url = `${c.region_.root}/${c.region}/${c.slug}/${d.slug}/`;
    d.hotels = []; d.experiences = []; d.stories = []; d.itineraries = [];
    c.destinations.push(d);
  }
  for (const h of hotels) {
    const d = byDest.get(h.destination);
    if (!d) { errors.push(`hotel ${h.slug}: unknown destination "${h.destination}"`); continue; }
    h.destination_ = d; h.url = `/stay/${h.slug}/`;
    for (const cat of h.categories) {
      if (!taxonomies.stayCategories.some(c => c.slug === cat))
        errors.push(`hotel ${h.slug}: unknown stay category "${cat}"`);
    }
    d.hotels.push(h);
  }
  for (const e of experiences) {
    const d = byDest.get(e.destination);
    if (!d) { errors.push(`experience ${e.slug}: unknown destination "${e.destination}"`); continue; }
    e.destination_ = d; e.url = `/experiences/${e.slug}/`;
    for (const cat of e.categories) {
      if (!taxonomies.experienceCategories.some(c => c.slug === cat))
        errors.push(`experience ${e.slug}: unknown experience category "${cat}"`);
    }
    d.experiences.push(e);
  }
  for (const h of hotels) {
    h.alternatives_ = (h.alternatives || []).map(s => {
      const alt = byHotel.get(s);
      if (!alt) errors.push(`hotel ${h.slug}: unknown alternative "${s}"`);
      return alt;
    }).filter(Boolean);
    // Fill in same-destination fallbacks so no hotel page dead-ends.
    if (h.alternatives_.length < 2 && h.destination_) {
      for (const other of h.destination_.hotels) {
        if (other !== h && !h.alternatives_.includes(other)) h.alternatives_.push(other);
        if (h.alternatives_.length >= 2) break;
      }
    }
  }
  for (const i of itineraries) {
    i.url = `/journeys/${i.slug}/`;
    i.destinations_ = (i.destinations || []).map(s => {
      const d = byDest.get(s);
      if (!d) errors.push(`itinerary ${i.slug}: unknown destination "${s}"`);
      else d.itineraries.push(i);
      return d;
    }).filter(Boolean);
    i.countries_ = (i.countries || []).map(s => {
      const c = byCountry.get(s);
      if (!c) errors.push(`itinerary ${i.slug}: unknown country "${s}"`);
      return c;
    }).filter(Boolean);
    for (const day of i.dayPlan) {
      if (day.stay) {
        day.stay_ = byHotel.get(day.stay);
        if (!day.stay_) errors.push(`itinerary ${i.slug} (${day.day}): unknown stay "${day.stay}"`);
      }
      if (day.experience) {
        day.experience_ = byExp.get(day.experience);
        if (!day.experience_) errors.push(`itinerary ${i.slug} (${day.day}): unknown experience "${day.experience}"`);
      }
    }
  }
  for (const s of stories) {
    s.url = `/stories/${s.slug}/`;
    if (s.destination) {
      s.destination_ = byDest.get(s.destination);
      if (!s.destination_) errors.push(`story ${s.slug}: unknown destination "${s.destination}"`);
      else s.destination_.stories.push(s);
    }
    for (const cat of s.categories) {
      if (!taxonomies.storyCategories.some(c => c.slug === cat))
        errors.push(`story ${s.slug}: unknown story category "${cat}"`);
    }
  }
  stories.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const g = {
    site, regions, countries, destinations, hotels, experiences, itineraries, stories, taxonomies,
    intlRegions: regions.filter(r => r.scope === "international"),
    indiaRegions: regions.filter(r => r.scope === "india"),
    intlDestinations: destinations.filter(d => d.scope === "international"),
    indiaDestinations: destinations.filter(d => d.scope === "india"),
    byRegion, byCountry, byDest, byHotel, byExp, byItin,
    hotelsIn: (cat) => hotels.filter(h => h.categories.includes(cat)),
    expIn: (cat) => experiences.filter(e => e.categories.includes(cat)),
    storiesIn: (cat) => cat === "travel-stories" ? stories : stories.filter(s => s.categories.includes(cat)),
    errors
  };

  // Resolve declarative collection filters into concrete result sets.
  for (const col of taxonomies.collections) {
    const f = col.filter || {};
    col.url = `/collections/${col.slug}/`;
    col.destinations_ = destinations.filter(d =>
      (f.destinationTags || []).some(t => (d.tags || []).includes(t)));
    col.hotels_ = hotels.filter(h =>
      (f.stayCategories || []).some(c => h.categories.includes(c)) ||
      (f.priceBands || []).includes(h.priceBand));
    col.experiences_ = experiences.filter(e =>
      (f.experienceCategories || []).some(c => e.categories.includes(c)));
    col.itineraries_ = itineraries.filter(i =>
      (f.itineraryStyles || []).includes(i.style) ||
      (f.itineraryDays ? i.days >= f.itineraryDays[0] && i.days <= f.itineraryDays[1] : false));
    if (!col.destinations_.length && !col.hotels_.length && !col.experiences_.length && !col.itineraries_.length)
      errors.push(`collection ${col.slug}: filter matches nothing`);
  }
  for (const c of taxonomies.stayCategories) { c.url = `/stay/category/${c.slug}/`; c.hotels_ = g.hotelsIn(c.slug); }
  for (const c of taxonomies.experienceCategories) { c.url = `/experiences/category/${c.slug}/`; c.experiences_ = g.expIn(c.slug); }
  for (const c of taxonomies.storyCategories) { c.url = `/stories/category/${c.slug}/`; c.stories_ = g.storiesIn(c.slug); }

  return g;
}
