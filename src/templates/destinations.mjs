import { esc, list, card, sectionHead, figure, chip, breadcrumbs, atAGlance, faq, nextSteps,
         newsletterBlock, priceBand, truncate, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub, extra = "") => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}
  ${extra}
</div></section>`;

/** Shared body for the two destination trees. */
function scopeIndex(g, { scope, url, kicker, title, sub, intro, template, ogArt, title_, description }) {
  const regions = scope === "india" ? g.indiaRegions : g.intlRegions;
  const dests = scope === "india" ? g.indiaDestinations : g.intlDestinations;
  const drafts = scope === "india" ? g.indiaDrafts : g.intlDrafts;
  const label = scope === "india" ? "India" : "International";
  const body = `
${pageHero(kicker, title, sub)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: label }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="prose" style="max-width:70ch"><p class="lede">${esc(intro)}</p></div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "By region", title: scope === "india" ? "Choose a part of the country" : "Choose a region" })}
  <div class="grid grid--3">
    ${list(regions, (r) => {
      const n = r.countries.reduce((t, c) => t + c.publishedDestinations.length, 0);
      return `<article class="card">
        ${figure(r, { ratio: "3x2", label: r.name })}
        <div class="card__body">
          <span class="card__kicker">${esc(r.kicker || r.countries.map(c => c.name).join(" · "))}</span>
          <h2 class="card__title"><a class="card__link" href="${esc(r.url)}">${esc(r.name)}</a></h2>
          <p class="card__desc">${esc(r.blurb)}</p>
          <div class="card__foot"><span>${r.countries.length} ${scope === "india" ? (r.countries.length === 1 ? "state" : "states") : (r.countries.length === 1 ? "country" : "countries")}</span>
          <span>${n} ${n === 1 ? "guide" : "guides"}</span></div>
        </div></article>`;
    })}
  </div>
</div></section>
${dests.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "All guides", title: scope === "india" ? "Every India guide" : "Every international guide" })}
  <div class="grid grid--4">
    ${list(dests, (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d,
      ratio: "4x3", flush: true, footLeft: esc(d.country_.name) }))}
  </div>
</div></section>` : ""}
${drafts.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "In progress", title: `${drafts.length} places we have been`,
    intro: "Guides being written from first-hand travel — these are the places, not a wish list. Each goes live when it is written." })}
  <div class="grid grid--4">
    ${list(drafts, (x) => card({ href: x.url, title: x.name, kicker: x.kicker, entity: x, ratio: "4x3",
      flush: true, badges: ["draft"], footLeft: esc(x.country_.name), footRight: "In progress" }))}
  </div>
</div></section>` : ""}

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next",
  steps: [
    { href: scope === "india" ? "/international/" : "/india/",
      title: scope === "india" ? "Travel international" : "Travel in India",
      desc: scope === "india" ? "Asia, the Gulf and beyond." : "Six regions, from the Himalaya to the coast." },
    { href: "/plan/", title: "Plan a trip", desc: "A day-by-day itinerary in about a minute." },
    { href: "/stories/", title: "Read the stories", desc: "The writing behind the guides." }
  ]})}</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, template)}</div></section>`;
  return {
    url, template, title: title_, description, body, ogArt,
    breadcrumbs: [{ label: "Home", href: "/" }, { label, href: url }],
    schema: { "@type": "CollectionPage", name: title_, url: g.site.siteUrl + url }
  };
}

export function indiaIndex(g) {
  return scopeIndex(g, {
    scope: "india", url: "/india/", kicker: "India", title: "Travel in India, region by region",
    sub: "Six regions, from the Char Dham shrines and Himalayan ridges to the Konkan coast and the southern backwaters.",
    intro: "India does not travel like one country. The mountain states run on a season that opens and closes; the plains hold the densest pilgrimage routes anywhere; the coast and the south move at an entirely different pace. Pick the part of the country first — the itinerary follows from that.",
    template: "india-index", ogArt: "india",
    title_: "Travel in India — Guides by Region | Pehchan",
    description: "India travel guides by region: the Himalayan north, the northern plains and temple towns, west India and the coast, central India, the south, and the northeast."
  });
}

export function internationalIndex(g) {
  return scopeIndex(g, {
    scope: "international", url: "/international/", kicker: "International", title: "Travel beyond India",
    sub: "Asia and the Gulf first — the trips that are short, straightforward and worth taking more than once — then further afield.",
    intro: "International travel from India starts closer than most people assume. Southeast Asia and the Gulf are short flights with simple entry, and they reward a second and third visit far more than a single sweep. Everything here is organised by region so it can keep growing.",
    template: "international-index", ogArt: "international",
    title_: "International Travel Guides | Pehchan",
    description: "International travel guides by region — Asia, the Middle East, Europe, Africa, the Americas and Oceania — written for travellers heading out from India."
  });
}

export function regionPage(r, g) {
  const dests = r.countries.flatMap(c => c.publishedDestinations);
  // A state with no guide yet gets no page of its own — an empty page is a thin
  // page. It is listed here as planned coverage instead.
  const covered = r.countries.filter(c => c.publishedDestinations.length);
  const planned = r.countries.filter(c => !c.publishedDestinations.length);
  const drafts = r.countries.flatMap(c => c.draftDestinations);
  const body = `
${pageHero(`${r.scope === "india" ? "India" : "International"} · ${esc(r.kicker || r.countries.map(c => c.name).join(" · "))}`, r.name, r.blurb)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" },
  { label: r.scope === "india" ? "India" : "International", href: r.root + "/" }, { label: r.name }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="split">
    <div>${figure(r, { ratio: "4x3", label: r.name })}</div>
    <div class="prose"><p class="lede">${esc(r.intro)}</p>
    <p>Below: every country we cover in ${esc(r.name)}, and every destination guide within them. Each guide follows the same
    template, so you can compare a Himalayan valley with an Alpine one without re-learning how to read the page.</p></div>
  </div>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: r.scope === "india" ? "States" : "Countries", title: `Where we travel in ${r.name}` })}
  ${covered.length ? `<div class="grid grid--3">
    ${list(covered, (c) => `<article class="card">
      <div class="card__body">
        <span class="card__kicker">${esc(c.currency)} · ${esc(c.languages.join(", "))}</span>
        <h3 class="card__title"><a class="card__link" href="${esc(c.url)}">${esc(c.name)}</a></h3>
        <p class="card__desc">Best months: ${esc(c.bestMonths)}</p>
        <div class="card__foot"><span>${c.publishedDestinations.length} ${c.publishedDestinations.length === 1 ? "guide" : "guides"}</span><span>→</span></div>
      </div></article>`)}
  </div>` : ""}
  ${planned.length ? `<div style="margin-top:${covered.length ? "var(--s-7)" : "0"}">
    <span class="eyebrow">Coverage in progress</span>
    <p class="muted" style="max-width:60ch;margin-bottom:var(--s-4)">Guides for these are being written from first-hand
    travel. They appear here as they are finished — we do not publish a page before there is something worth reading on it.</p>
    <div class="tag-row">${list(planned, (c) => `<span class="chip">${esc(c.name)}</span>`)}</div>
  </div>` : ""}
</div></section>
${dests.length ? `<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Guides", title: `Destination guides in ${r.name}` })}
  <div class="grid grid--3">
    ${list(dests, (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "3x2",
      footLeft: esc(d.country_.name), footRight: esc(d.howManyDays.split(";")[0]) }))}
  </div>
</div></section>` : ""}
${drafts.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "In progress", title: `Places we have been in ${r.name}`,
    intro: "Guides being written from first-hand travel. Each goes live when it is finished." })}
  <div class="grid grid--4">
    ${list(drafts, (x) => card({ href: x.url, title: x.name, kicker: x.kicker, entity: x, ratio: "4x3",
      flush: true, badges: ["draft"], footLeft: esc(x.country_.name), footRight: "In progress" }))}
  </div>
</div></section>` : ""}

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Keep going",
  intro: `Everything in ${r.name} connects — guides to stays, stays to experiences, experiences to a plan.`,
  steps: [
    { href: "/stay/", title: "Find a stay", desc: "Boutique houses, lodges and camps across the region." },
    { href: "/experiences/", title: "Explore experiences", desc: "Guided by the people who live there." },
    { href: "/plan/", title: "Build an itinerary", desc: "Turn a shortlist into a day-by-day trip." }
  ]})}</div></section>`;
  return {
    url: r.url, template: "region", title: fitTitle([`${r.name} Travel Guide`, "Destinations, Stays & Journeys", "Pehchan"]),
    description: truncate(`${r.blurb} Destination guides, boutique stays and curated itineraries across ${r.countries.map(c => c.name).join(", ")}.`, 155),
    body, ogArt: `region-${r.slug}`, noindex: dests.length === 0,
    breadcrumbs: [{ label: "Home", href: "/" },
      { label: r.scope === "india" ? "India" : "International", href: r.root + "/" }, { label: r.name, href: r.url }],
    schema: { "@type": "CollectionPage", name: `${r.name} travel guides`, url: g.site.siteUrl + r.url }
  };
}

export function countryPage(c, g) {
  const body = `
${pageHero(`${c.region_.name} · ${c.type === "state" ? "State" : "Country"}`, c.name,
  `${c.publishedDestinations.length} destination ${c.publishedDestinations.length === 1 ? "guide" : "guides"} in ${c.name}. Best months: ${c.bestMonths}.`)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" },
  { label: c.scope === "india" ? "India" : "International", href: c.region_.root + "/" },
  { label: c.region_.name, href: c.region_.url }, { label: c.name }])}</div>
<section class="section section--tight"><div class="wrap">
  ${atAGlance([
    ["Region", c.region_.name],
    ["Currency", c.currency],
    ["Languages", c.languages.join(", ")],
    ["Best months", c.bestMonths],
    ["Guides", String(c.publishedDestinations.length)]
  ])}
  <div class="disclosure" style="margin-top:var(--s-6)">
    <div><strong>Entry requirements.</strong> ${esc(c.visaNote)} Requirements change and depend on your nationality —
    always confirm with the official government source for your passport before booking. See our
    <a href="/tools/visa-information/">visa information tool</a>.</div>
  </div>
</div></section>
${c.draftDestinations.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "In progress", title: `Places we have been in ${c.name}` })}
  <div class="grid grid--4">${list(c.draftDestinations, (x) => card({ href: x.url, title: x.name,
    kicker: x.kicker, entity: x, ratio: "4x3", flush: true, badges: ["draft"], footRight: "In progress" }))}</div>
</div></section>` : ""}

<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Destinations", title: `Where to go in ${c.name}` })}
  <div class="grid grid--3">
    ${list(c.publishedDestinations, (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "3x2",
      footLeft: esc(d.howManyDays.split(";")[0]) }))}
  </div>
</div></section>
${c.publishedDestinations.some(d => d.hotels.length) ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Stay", title: `Places to stay in ${c.name}`, link: { href: "/stay/", label: "All stays" } })}
  <div class="grid grid--4">
    ${list(c.publishedDestinations.flatMap(d => d.hotels).slice(0, 8), (h) => card({ href: h.url, title: h.name, kicker: h.destination_.name,
      desc: h.kicker, entity: h, ratio: "4x3", badges: h.sample ? ["sample"] : [], footLeft: priceBand(h.priceBand) }))}
  </div>
</div></section>` : ""}`;
  return {
    url: c.url, template: "country", title: fitTitle([`${c.name} Travel Guide`, "Where to Go & When to Visit", "Pehchan"]),
    description: truncate(`Travel guide to ${c.name}: ${c.destinations.map(d => d.name).join(", ")}. Best time to visit, where to stay, entry requirements and curated journeys.`, 155),
    body, ogArt: `country-${c.slug}`, noindex: c.publishedDestinations.length === 0,
    breadcrumbs: [{ label: "Home", href: "/" },
      { label: c.scope === "india" ? "India" : "International", href: c.region_.root + "/" },
      { label: c.region_.name, href: c.region_.url }, { label: c.name, href: c.url }],
    schema: { "@type": "CollectionPage", name: `${c.name} travel guide`, url: g.site.siteUrl + c.url }
  };
}

export function destinationPage(d, g) {
  const sec = (id, title, inner) => `<section class="section section--tight" id="${id}"><div class="wrap">${inner}</div></section>`;
  const bullets = (items) => `<ul class="checks">${list(items, (i) => `<li>${esc(i)}</li>`)}</ul>`;

  const body = `
<section class="hero">
  ${figure(d, { ratio: "16x9", label: d.name, note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(d.kicker)}</span>
    <h1>${esc(d.name)}</h1>
    <p class="hero__sub">${esc(d.summary)}</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--light" href="#stay">Where to stay</a>
      <a class="btn btn--ghost" style="border-color:rgba(255,255,255,.5);color:#fff" href="/plan/?destination=${esc(d.slug)}" data-track="cta_plan_destination" data-track-label="${esc(d.name)}">Build this trip</a>
    </div>
  </div>
</section>
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" },
  { label: d.scope === "india" ? "India" : "International", href: d.region_.root + "/" },
  { label: d.region_.name, href: d.region_.url }, { label: d.country_.name, href: d.country_.url }, { label: d.name }])}</div>

${sec("glance", "", atAGlance([
  [d.country_.type === "state" ? "State" : "Country", d.country_.name],
  ["How many days", d.howManyDays.split(";")[0]],
  ["Best time", d.bestTime[0].split(":")[0].split(" —")[0]],
  ["Currency", d.country_.currency],
  ["Stays listed", String(d.hotels.length)],
  ["Experiences", String(d.experiences.length)]
]))}

${d.personalNote ? `<section class="section section--tight"><div class="wrap">
  <aside class="personal">
    <span class="eyebrow">From my own journey${d.visited ? ` · ${esc(d.visited)}` : ""}</span>
    <blockquote>${esc(d.personalNote)}</blockquote>
    <p class="personal__by">— ${esc(g.site.brand)}</p>
  </aside>
</div></section>` : ""}

${sec("why-visit", "", `<div class="grid grid--asym">
  <div class="prose"><h2 style="margin-top:0">Why visit ${esc(d.name)}</h2><p class="drop-cap">${esc(d.whyVisit)}</p>
  <h2>Best time to visit</h2>${bullets(d.bestTime)}
  <h2>How to get there</h2>${bullets(d.gettingThere)}
  <h2>How many days do you need</h2><p>${esc(d.howManyDays)}</p>
  <h2>Where to stay</h2><p>${esc(d.whereToStay)}</p></div>
  <aside class="stack" style="position:sticky;top:calc(var(--header-h) + 24px)">
    <div class="booking"><div class="booking__head"><h3>Plan ${esc(d.name)}</h3></div>
      <a class="btn btn--primary btn--block" href="/plan/?destination=${esc(d.slug)}" data-track="cta_plan_destination">Build this trip</a>
      <a class="btn btn--ghost btn--block" href="#stay">See ${d.hotels.length} stays</a>
      <a class="btn btn--ghost btn--block" href="#experiences">See ${d.experiences.length} experiences</a>
      <p class="affiliate-note">Booking links on this page may earn us a commission at no cost to you.
      <a href="/legal/affiliate-disclosure/">Details</a>.</p>
    </div>
    <div class="tag-row">${list(d.tags, (t) => {
      const col = g.taxonomies.collections.find(c => (c.filter.destinationTags || []).includes(t));
      return col ? chip(col.title, col.url) : chip(t.replace(/-/g, " "));
    })}</div>
  </aside>
</div>`)}

${sec("things-to-do", "", `<div class="prose" style="max-width:none">
  <h2 style="margin-top:0">Best things to do in ${esc(d.name)}</h2>
  <div class="grid grid--2" style="margin-top:var(--s-5)">
    <div>${bullets(d.thingsToDo)}</div>
    <div><h3 style="margin-top:0">Food</h3>${bullets(d.food)}</div>
  </div></div>`)}

${d.experiences.length ? `<section class="section section--tinted" id="experiences"><div class="wrap">
  ${sectionHead({ eyebrow: "Experiences", title: `Experiences in ${d.name}`, link: { href: "/experiences/", label: "All experiences" } })}
  <div class="grid grid--3">${list(d.experiences, (e) => card({ href: e.url, title: e.name, kicker: e.categories[0].replace(/-/g, " "),
    desc: e.description, entity: e, ratio: "3x2", badges: e.sample ? ["sample"] : [], footLeft: esc(e.duration), footRight: esc(e.difficulty.split("—")[0]) }))}</div>
</div></section>` : ""}

${d.hotels.length ? `<section class="section" id="stay"><div class="wrap">
  ${sectionHead({ eyebrow: "Stay", title: `Where to stay in ${d.name}`, intro: d.whereToStay, link: { href: "/stay/", label: "All stays" } })}
  <div class="grid grid--3">${list(d.hotels, (h) => card({ href: h.url, title: h.name, kicker: h.kicker, desc: h.overview,
    entity: h, ratio: "3x2", badges: h.sample ? ["sample"] : [], footLeft: priceBand(h.priceBand), footRight: esc(g.taxonomies.stayCategories.find(c => c.slug === h.categories[0])?.name || "") }))}</div>
</div></section>` : ""}

${sec("practical", "", `<div class="grid grid--2">
  <div class="prose" style="max-width:none"><h2 style="margin-top:0">Budget</h2><p>${esc(d.budgetNotes)}</p>
    <h3>Safety &amp; practical information</h3>${bullets(d.safety)}</div>
  <div class="prose" style="max-width:none"><h2 style="margin-top:0">Local culture</h2>${bullets(d.culture)}
    <h3>Getting oriented</h3><p>Use the map to place ${esc(d.name)} in its region before you plan transfers — distances in
    guides are frequently longer in practice than they look on a page.</p>
    <div class="map-embed" data-map data-lat="${d.coords[0]}" data-lng="${d.coords[1]}" data-label="${esc(d.name)}">
      <div class="map-embed__cta"><span class="eyebrow" style="margin:0">Map</span>
        <p class="muted" style="font-size:var(--t-sm);max-width:34ch">Loads OpenStreetMap only when you ask it to — no third-party requests before then.</p>
        <button class="btn btn--ghost btn--sm" type="button" data-map-load>Load map of ${esc(d.name)}</button></div>
    </div>
  </div>
</div>`)}

${d.itineraries.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Curated journeys", title: `Itineraries including ${d.name}` })}
  <div class="grid grid--3">${list(d.itineraries, (i) => card({ href: i.url, title: i.title, kicker: `${i.days} days`,
    desc: i.overview, entity: i, ratio: "3x2", footLeft: esc(i.style.replace(/-/g, " ")), footRight: priceBand(i.budgetBand) }))}</div>
</div></section>` : ""}

${d.stories.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "From the road", title: `Stories from ${d.name}` })}
  <div class="grid grid--3">${list(d.stories, (s) => card({ href: s.url, title: s.title, kicker: s.readingTime, desc: s.dek,
    entity: s, ratio: "3x2", flush: true }))}</div>
</div></section>` : ""}

<section class="section section--tight"><div class="wrap" style="max-width:940px">${faq(d.faqs)}</div></section>

<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Related", title: "Where else to look" })}
  <div class="grid grid--4">${list(
    g.published.filter(o => o !== d && o.scope === d.scope && (o.region === d.region || o.tags.some(t => d.tags.includes(t)))).slice(0, 4),
    (o) => card({ href: o.url, title: o.name, kicker: o.country_.name, desc: o.summary, entity: o, ratio: "4x3", flush: true }))}</div>
</div></section>

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: `Your next step in ${d.name}`,
  intro: "Read the guide, then move down the funnel — stays, experiences, then a day-by-day plan you can actually book.",
  steps: [
    { href: "#stay", title: "Explore hotels", desc: `${d.hotels.length} stays, assessed on who they suit.` },
    { href: "#experiences", title: "Explore experiences", desc: `${d.experiences.length} experiences worth the time.` },
    { href: `/plan/?destination=${d.slug}`, title: "Build an itinerary", desc: "Generate a day-by-day plan in about a minute." }
  ]})}</div></section>

<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "destination-guide")}</div></section>`;

  return {
    url: d.url, template: "destination", ogType: "article",
    title: fitTitle([`${d.name} Travel Guide`, "Best Time to Visit & Where to Stay", "Pehchan"]),
    description: truncate(`${d.summary} Best time to visit, how many days you need, where to stay and the experiences worth travelling for.`, 155),
    body, ogArt: `dest-${d.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" },
      { label: d.scope === "india" ? "India" : "International", href: d.region_.root + "/" },
      { label: d.region_.name, href: d.region_.url }, { label: d.country_.name, href: d.country_.url },
      { label: d.name, href: d.url }],
    schema: [
      { "@type": "TouristDestination", name: d.name, description: d.summary,
        url: g.site.siteUrl + d.url,
        address: { "@type": "PostalAddress", addressCountry: d.country_.name },
        geo: { "@type": "GeoCoordinates", latitude: d.coords[0], longitude: d.coords[1] },
        touristType: d.tags.map(t => t.replace(/-/g, " ")) },
      { "@type": "FAQPage", mainEntity: d.faqs.map(f => ({
        "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    ]
  };
}

/**
 * A destination the founder has been to, whose guide is not written yet.
 * Deliberately shows the empty structure rather than filler: nothing here
 * claims to be content, and the page is kept out of search until it is.
 */
export function destinationDraftPage(d, g) {
  const sections = [
    ["Why visit", "What the place actually is, and who it suits."],
    ["Best time to visit", "The months that work, the months that do not, and why."],
    ["How to get there", "Airport or railhead, the journey, and what people get wrong about it."],
    ["How many days", "The minimum that is worth it, and what is actually recommended."],
    ["Where to stay", "Which area, and anywhere to avoid."],
    ["Things to do", "Specific and named — and what is overrated."],
    ["Food", "What to eat and where."],
    ["Budget", "Which band it sits in and what drives the cost."],
    ["Safety & practical", "Permits, registration, health, weather, anything that catches people out."],
    ["Local culture", "What visitors get wrong."],
    ["FAQs", "The questions actually asked about this place."]
  ];
  const body = `
<section class="hero">
  ${figure(d, { ratio: "16x9", label: d.name, note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(d.kicker)}</span>
    <h1>${esc(d.name)}</h1>
    <p class="hero__sub">A guide to ${esc(d.name)} is being written from first-hand travel. This page is the
    structure it will fill — nothing on it is invented in the meantime.</p>
  </div>
</section>
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" },
  { label: d.scope === "india" ? "India" : "International", href: d.region_.root + "/" },
  { label: d.region_.name, href: d.region_.url }, { label: d.country_.name, href: d.country_.url },
  { label: d.name }])}</div>

<section class="section section--tight"><div class="wrap">
  <div class="disclosure">
    <div><strong>Guide in progress.</strong> ${esc(d.name)} is on our list because we have actually been —
    it is not here to fill a gap. The guide goes live when it is written, and not before. Until then this page
    is not listed in search.</div>
  </div>
</div></section>

<section class="section section--tight"><div class="wrap">
  ${atAGlance([
    [d.country_.type === "state" ? "State" : "Country", d.country_.name],
    ["Region", d.region_.name],
    ["Status", "Guide in progress"]
  ])}
</div></section>

<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "What this guide will cover", title: `The ${esc(d.name)} guide, section by section`,
    intro: "Every guide on this site follows the same structure, so places can be compared rather than re-learned." })}
  <div class="grid grid--3">
    ${list(sections, (sx) => `<article class="card"><div class="card__body">
      <h3 class="card__title" style="font-size:var(--t-md)">${esc(sx[0])}</h3>
      <p class="card__desc">${esc(sx[1])}</p></div></article>`)}
  </div>
</div></section>

${g.published.filter(o => o.scope === d.scope).length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "In the meantime", title: "Guides that are finished" })}
  <div class="grid grid--4">${list(g.published.filter(o => o.scope === d.scope).slice(0, 4),
    (o) => card({ href: o.url, title: o.name, kicker: o.country_.name, desc: o.summary, entity: o, ratio: "4x3", flush: true }))}</div>
</div></section>` : ""}

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next", steps: [
    { href: d.region_.url, title: `More of ${d.region_.name}`, desc: "What else is covered in this region." },
    { href: "/plan/", title: "Plan a trip", desc: "The trip planner works across everything published." },
    { href: "/newsletter/", title: "Get told when it lands", desc: "One considered email a week." }
  ]})}</div></section>`;
  return {
    url: d.url, template: "destination-draft", noindex: true,
    title: fitTitle([`${d.name} Travel Guide`, "Coming soon", "Pehchan"]),
    description: truncate(`A first-hand travel guide to ${d.name}, ${d.country_.name} — in progress.`, 155),
    body, ogArt: `dest-${d.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" },
      { label: d.scope === "india" ? "India" : "International", href: d.region_.root + "/" },
      { label: d.region_.name, href: d.region_.url }, { label: d.country_.name, href: d.country_.url },
      { label: d.name, href: d.url }]
  };
}
