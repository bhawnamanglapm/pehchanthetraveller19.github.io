#!/usr/bin/env node
/**
 * Pehchan static site build.
 *
 * Renders the content graph in src/content into static HTML at the repository
 * root, where the GitHub Pages workflow (.github/workflows/static.yml) uploads
 * it. Zero dependencies, Node 18+.
 *
 *   node src/build.mjs [--clean]
 */
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { buildGraph } from "./lib/graph.mjs";
import { page as renderPage, ogCard } from "./lib/shell.mjs";
import { esc, truncate, clean } from "./lib/html.mjs";
import { home } from "./templates/home.mjs";
import { destinationsIndex, regionPage, countryPage, destinationPage } from "./templates/destinations.mjs";
import { stayIndex, stayCategoryPage, hotelPage } from "./templates/stay.mjs";
import { experiencesIndex, experienceCategoryPage, experiencePage } from "./templates/experiences.mjs";
import { journeysIndex, itineraryPage } from "./templates/journeys.mjs";
import { storiesIndex, storyCategoryPage, storyPage } from "./templates/stories.mjs";
import { collectionsIndex, collectionPage, guidesIndex } from "./templates/collections.mjs";
import { plannerPage, toolsIndex, toolPage, partnerPage, aboutPage, newsletterPage, contactPage,
         dealsPage, searchPage, dashboardPage, legalPage, legalSlugs, notFoundPage } from "./templates/pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIRS = ["destinations", "stay", "experiences", "journeys", "stories", "collections", "guides",
  "plan", "tools", "deals", "partner", "about", "newsletter", "contact", "search", "dashboard", "legal"];

function write(relPath, contents) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}

function urlToFile(url) {
  if (url.endsWith(".html")) return url.replace(/^\//, "");
  return (url === "/" ? "index.html" : url.replace(/^\//, "") + "index.html");
}

function main() {
  const started = Date.now();
  const clean_ = process.argv.includes("--clean");
  const g = buildGraph();

  if (g.errors.length) {
    console.error("\nContent validation failed:");
    g.errors.forEach(e => console.error("  ✗ " + e));
    process.exit(1);
  }

  if (clean_) {
    for (const d of OUT_DIRS) rmSync(join(ROOT, d), { recursive: true, force: true });
    rmSync(join(ROOT, "assets", "og"), { recursive: true, force: true });
  }

  /* ---- route table ------------------------------------------------- */
  const pages = [
    home(g),
    destinationsIndex(g),
    ...g.regions.map(r => regionPage(r, g)),
    ...g.countries.map(c => countryPage(c, g)),
    ...g.destinations.map(d => destinationPage(d, g)),
    stayIndex(g),
    ...g.taxonomies.stayCategories.map(c => stayCategoryPage(c, g)),
    ...g.hotels.map(h => hotelPage(h, g)),
    experiencesIndex(g),
    ...g.taxonomies.experienceCategories.map(c => experienceCategoryPage(c, g)),
    ...g.experiences.map(e => experiencePage(e, g)),
    journeysIndex(g),
    ...g.itineraries.map(i => itineraryPage(i, g)),
    storiesIndex(g),
    ...g.taxonomies.storyCategories.map(c => storyCategoryPage(c, g)),
    ...g.stories.map(s => storyPage(s, g)),
    collectionsIndex(g),
    ...g.taxonomies.collections.map(c => collectionPage(c, g)),
    guidesIndex(g),
    plannerPage(g),
    toolsIndex(g),
    ...g.taxonomies.tools.filter(t => !t.redirect).map(t => toolPage(t, g)),
    dealsPage(g),
    partnerPage(g),
    aboutPage(g),
    newsletterPage(g),
    contactPage(g),
    searchPage(g),
    dashboardPage(g),
    ...legalSlugs.map(s => legalPage(s, g)),
    notFoundPage(g)
  ];

  /* ---- integrity checks -------------------------------------------- */
  const seen = new Map();
  const problems = [];
  for (const p of pages) {
    if (seen.has(p.url)) problems.push(`duplicate route: ${p.url}`);
    seen.set(p.url, p);
    if (!p.title || p.title.length > 75) problems.push(`title length ${p.title?.length}: ${p.url} — "${p.title}"`);
    if (!p.description || p.description.length > 165) problems.push(`description length ${p.description?.length}: ${p.url}`);
    if (!p.body || p.body.length < 400) problems.push(`suspiciously short body: ${p.url}`);
  }
  /* ---- render ------------------------------------------------------- */
  const rendered = pages.map(p => [p, renderPage(p, g)]);

  // Every indexable page must be reachable from at least one other page. Checked
  // against fully rendered output so nav and footer links count.
  const allHtml = rendered.map(([, h]) => h).join("");
  for (const p of pages) {
    if (p.noindex || p.url === "/" || p.url.endsWith(".html")) continue;
    if (!allHtml.includes(`href="${p.url}"`) && !allHtml.includes(`href="${p.url}#`) &&
        !allHtml.includes(`href="${p.url}?`)) {
      problems.push(`orphan page — nothing links to ${p.url}`);
    }
  }
  // Every internal href must resolve to a route we actually emit. Nav and footer
  // links are re-derived from the graph, and a hand-written path that drifts from
  // a route would otherwise ship a broken link on all 200+ pages at once.
  const routes = new Set(pages.map(p => p.url));
  const brokenLinks = new Map();
  for (const [p, htmlOut] of rendered) {
    for (const m of htmlOut.matchAll(/href="(\/[^"]*)"/g)) {
      const target = m[1].split("#")[0].split("?")[0];
      if (!target || target.startsWith("/assets/") || /\.(xml|txt|svg|json|ico)$/.test(target)) continue;
      if (!routes.has(target)) {
        if (!brokenLinks.has(target)) brokenLinks.set(target, p.url);
      }
    }
  }
  for (const [target, from] of brokenLinks) problems.push(`broken link to ${target} (first seen on ${from})`);

  if (problems.length) {
    console.error("\nBuild integrity check failed:");
    problems.slice(0, 30).forEach(e => console.error("  ✗ " + e));
    if (problems.length > 30) console.error(`  … and ${problems.length - 30} more`);
    process.exit(1);
  }

  // Templates author clean root-relative URLs ("/stay/…"). The base path is
  // applied once here — after the integrity checks have validated those routes —
  // so a project-site subpath, a rename, or a custom domain is one config change
  // rather than an edit to every template.
  const BASE = g.site.basePath || "";
  const applyBase = (html) => BASE
    ? html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${BASE}/`)
    : html;

  // Guard: after prefixing, no root-relative URL may be missing the base. This is
  // the bug that shipped a site whose every link and asset 404'd at a project-site
  // subpath, so it fails the build rather than relying on a manual check.
  const escaped = [];
  for (const [p, htmlOut] of rendered) {
    const out = applyBase(htmlOut);
    if (BASE) {
      for (const m of out.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        if (!m[1].startsWith(BASE + "/") && m[1] !== BASE) escaped.push(`${p.url}: ${m[1]}`);
      }
    }
    write(urlToFile(p.url), out);
  }
  if (escaped.length) {
    console.error("\nBase-path check failed — these URLs would 404 at the deploy subpath:");
    [...new Set(escaped)].slice(0, 20).forEach(e => console.error("  ✗ " + e));
    process.exit(1);
  }

  /* ---- Open Graph share images -------------------------------------- */
  const ogSpecs = new Map();
  const addOg = (name, title, kicker, artKey, seed) => ogSpecs.set(name, [title, kicker, artKey, seed]);
  addOg("default", g.site.brand, g.site.descriptor, "himalaya", "default");
  addOg("home", "Your next extraordinary journey starts here", g.site.descriptor, "himalaya", "home");
  for (const d of g.destinations) addOg(`dest-${d.slug}`, `${d.name} Travel Guide`, d.country_.name, d.art, d.slug);
  for (const r of g.regions) addOg(`region-${r.slug}`, `${r.name} Travel Guides`, "Destinations", r.art, r.slug);
  for (const c of g.countries) addOg(`country-${c.slug}`, `${c.name} Travel Guide`, c.region_.name, c.region_.art, c.slug);
  for (const h of g.hotels) addOg(`hotel-${h.slug}`, h.name, h.destination_.name, h.art, h.slug);
  for (const e of g.experiences) addOg(`exp-item-${e.slug}`, e.name, e.destination_.name, e.art, e.slug);
  for (const i of g.itineraries) addOg(`journey-${i.slug}`, i.title, `${i.days} day itinerary`, i.art, i.slug);
  for (const s of g.stories) addOg(`story-${s.slug}`, s.title, "Travel story", s.art, s.slug);
  for (const c of g.taxonomies.collections) addOg(`col-${c.slug}`, c.title, "Collection", c.art, c.slug);
  for (const c of g.taxonomies.stayCategories) addOg(`stay-${c.slug}`, c.name, "Where to stay", c.art, c.slug);
  for (const c of g.taxonomies.experienceCategories) addOg(`exp-${c.slug}`, `${c.name} Experiences`, "Experiences", "asia-hills", c.slug);
  for (const c of g.taxonomies.storyCategories) addOg(`story-cat-${c.slug}`, c.name, "Travel stories", "europe-city", c.slug);
  for (const t of g.taxonomies.tools) addOg(`tool-${t.slug}`, t.name, "Free travel tool", "andes-terrace", t.slug);
  for (const s of legalSlugs) addOg(`legal-${s}`, s.replace(/-/g, " "), "Trust & transparency", "europe-city", s);
  for (const k of ["destinations", "stay", "experiences", "journeys", "stories", "collections", "guides", "planner",
                   "tools", "deals", "partner", "about", "newsletter", "contact", "search", "dashboard", "404"]) {
    if (!ogSpecs.has(k)) addOg(k, k.replace(/-/g, " ").replace(/^./, c => c.toUpperCase()), g.site.brand, "asia-ridge", k);
  }
  for (const [name, [title, kicker, artKey, seed]] of ogSpecs) {
    write(`assets/og/${name}.svg`, ogCard(title, kicker, artKey, seed));
  }

  /* ---- search index -------------------------------------------------- */
  const index = [
    ...g.destinations.map(d => ({ t: "destination", u: d.url, n: d.name,
      d: truncate(d.summary, 120), k: [d.country_.name, d.region_.name, ...d.tags, ...d.thingsToDo.slice(0, 2)].join(" ") })),
    ...g.countries.map(c => ({ t: "destination", u: c.url, n: c.name,
      d: `${c.destinations.length} destination guides. Best months: ${c.bestMonths}.`, k: `${c.region_.name} country ${c.languages.join(" ")}` })),
    ...g.regions.map(r => ({ t: "destination", u: r.url, n: r.name, d: truncate(r.blurb, 120), k: "region " + r.kicker })),
    ...g.hotels.map(h => ({ t: "stay", u: h.url, n: h.name, d: truncate(h.kicker, 120),
      k: [h.destination_.name, h.destination_.country_.name, h.destination_.region_.name, ...h.categories, ...h.bestFor, "$".repeat(h.priceBand)].join(" ") })),
    ...g.experiences.map(e => ({ t: "experience", u: e.url, n: e.name, d: truncate(e.description, 120),
      k: [e.destination_.name, e.destination_.country_.name, ...e.categories, e.duration].join(" ") })),
    ...g.itineraries.map(i => ({ t: "journey", u: i.url, n: i.title, d: truncate(i.subtitle, 120),
      k: [`${i.days} days`, i.style, ...i.countries_.map(c => c.name), ...i.destinations_.map(d => d.name)].join(" ") })),
    ...g.stories.map(s => ({ t: "story", u: s.url, n: s.title, d: truncate(s.dek, 120),
      k: [...s.categories, s.destination_?.name || ""].join(" ") })),
    ...g.taxonomies.collections.map(c => ({ t: "collection", u: c.url, n: c.title, d: truncate(c.intro, 120), k: c.type })),
    ...g.taxonomies.stayCategories.map(c => ({ t: "stay", u: c.url, n: c.name, d: truncate(c.intro, 120), k: "category hotels stay" })),
    ...g.taxonomies.experienceCategories.map(c => ({ t: "experience", u: c.url, n: c.name, d: truncate(c.intro, 120), k: "category experiences" })),
    ...g.taxonomies.tools.map(t => ({ t: "tool", u: t.redirect || `/tools/${t.slug}/`, n: t.name, d: truncate(t.blurb, 120), k: "tool calculator planner" })),
    { t: "tool", u: "/plan/", n: "AI Trip Planner", d: "Build a day-by-day itinerary from your dates, budget, pace and interests.", k: "planner itinerary generator ai" },
    { t: "collection", u: "/deals/", n: "Travel Deals", d: "Hotel, flight, tour and experience offers from booking partners.", k: "deals offers discounts" },
    { t: "collection", u: "/partner/", n: "Partner With Us", d: "Sponsored stories, hotel features and destination campaigns.", k: "brands hotels tourism boards b2b" }
  ];
  for (const entry of index) entry.u = BASE + entry.u;
  write("assets/search-index.json", JSON.stringify(index));

  /* ---- planner catalogue --------------------------------------------- */
  // The planner matches against this rather than against scraped listings, so
  // every recommendation it makes resolves to a real page on this site.
  const withBase = (u) => BASE + u;
  write("assets/catalog.json", JSON.stringify({
    destinations: g.destinations.map(d => ({
      slug: d.slug, name: d.name, url: withBase(d.url), country: d.country_.name, region: d.region_.name,
      summary: d.summary, tags: d.tags, days: d.howManyDays, bestTime: d.bestTime,
      whereToStay: d.whereToStay, thingsToDo: d.thingsToDo, food: d.food, budgetNotes: d.budgetNotes,
      culture: d.culture, safety: d.safety, currency: d.country_.currency, coords: d.coords,
      gettingThere: d.gettingThere
    })),
    hotels: g.hotels.map(h => ({
      slug: h.slug, name: h.name, url: withBase(h.url), destination: h.destination, kicker: h.kicker,
      categories: h.categories, priceBand: h.priceBand, bestFor: h.bestFor, sample: !!h.sample
    })),
    experiences: g.experiences.map(e => ({
      slug: e.slug, name: e.name, url: withBase(e.url), destination: e.destination, categories: e.categories,
      duration: e.duration, difficulty: e.difficulty, recommendedTime: e.recommendedTime,
      description: e.description, sample: !!e.sample
    })),
    itineraries: g.itineraries.map(i => ({
      slug: i.slug, title: i.title, url: withBase(i.url), days: i.days, style: i.style,
      destinations: i.destinations, budgetBand: i.budgetBand
    }))
  }));

  /* ---- sitemap, robots, feed, favicon -------------------------------- */
  const today = new Date().toISOString().slice(0, 10);
  const indexable = pages.filter(p => !p.noindex && !p.url.endsWith(".html"));
  write("sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable.map(p => {
      const pri = p.url === "/" ? "1.0" : p.url.split("/").filter(Boolean).length <= 1 ? "0.9" : "0.7";
      return `  <url><loc>${g.site.siteUrl}${p.url}</loc><lastmod>${today}</lastmod><priority>${pri}</priority></url>`;
    }).join("\n") + `\n</urlset>\n`);

  write("robots.txt", `# ${g.site.brand}\nUser-agent: *\nAllow: /\nDisallow: ${BASE}/search/\nDisallow: ${BASE}/dashboard/\n\nSitemap: ${g.site.siteUrl}/sitemap.xml\n`);

  write("feed.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n` +
    `<title>${esc(g.site.brand)} — Travel Stories</title>\n<link>${g.site.siteUrl}/stories/</link>\n` +
    `<description>${esc(g.site.promise)}</description>\n<language>en</language>\n` +
    g.stories.map(s => `<item><title>${esc(s.title)}</title><link>${g.site.siteUrl}${s.url}</link>` +
      `<guid>${g.site.siteUrl}${s.url}</guid><pubDate>${new Date(s.publishedAt).toUTCString()}</pubDate>` +
      `<description>${esc(s.dek)}</description></item>`).join("\n") +
    `\n</channel></rss>\n`);

  write("assets/favicon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1D4E45"/>` +
    `<text x="32" y="44" font-family="Georgia,serif" font-size="36" fill="#FCFAF7" text-anchor="middle">P</text></svg>`);

  write(".nojekyll", "");

  // GitHub Pages reads CNAME to bind a custom domain. Written only when one is
  // configured, and removed when it is not — a stale CNAME silently breaks the
  // site by pointing Pages at a domain that no longer resolves here.
  const cnamePath = join(ROOT, "CNAME");
  if (g.site.customDomain) write("CNAME", g.site.customDomain + "\n");
  else if (existsSync(cnamePath)) rmSync(cnamePath);

  /* ---- report -------------------------------------------------------- */
  let bytes = 0, files = 0;
  const walk = (d) => { for (const f of readdirSync(d)) {
    const p = join(d, f); const s = statSync(p);
    if (s.isDirectory()) { if (!["node_modules", ".git", "src", "docs"].includes(f)) walk(p); }
    else if (f.endsWith(".html")) { bytes += s.size; files++; }
  }};
  walk(ROOT);
  console.log(`✓ ${pages.length} pages · ${ogSpecs.size} share images · ${index.length} search entries`);
  console.log(`  ${files} HTML files, ${(bytes / 1024).toFixed(0)}KB total, avg ${(bytes / files / 1024).toFixed(1)}KB`);
  console.log(`  built in ${Date.now() - started}ms`);
}

main();
