import { esc, list, card, sectionHead, figure, chip, breadcrumbs, atAGlance, faq, nextSteps,
         newsletterBlock, priceBand, truncate, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub, extra = "") => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}
  ${extra}
</div></section>`;

export function destinationsIndex(g) {
  const body = `
${pageHero("Destinations", "Every region, one consistent standard",
  "Eight regions, structured the same way — so a guide to the Bernese Oberland is as useful as a guide to Kerala, and comparable to it.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Destinations" }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="grid grid--2">
    ${list(g.regions, (r) => `<article class="card">
      ${figure(r, { ratio: "3x2", label: r.name })}
      <div class="card__body">
        <span class="card__kicker">${esc(r.kicker)}</span>
        <h2 class="card__title" style="font-size:var(--t-xl)"><a class="card__link" href="${esc(r.url)}">${esc(r.name)}</a></h2>
        <p class="card__desc">${esc(r.blurb)}</p>
        <div class="card__foot"><span>${r.countries.length} ${r.countries.length === 1 ? "country" : "countries"}</span>
        <span>${r.countries.reduce((n, c) => n + c.destinations.length, 0)} guides</span></div>
      </div></article>`)}
  </div>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "All destination guides", title: "Browse every guide", intro: "Each one covers why to visit, when to go, how many days, where to stay, what to do, food, budget, safety and culture." })}
  <div class="grid grid--4">
    ${list(g.destinations, (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "4x3", flush: true }))}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "destinations-index")}</div></section>`;
  return {
    url: "/destinations/", template: "destinations-index", title: "Travel Destinations — Guides to Every Region | Pehchan",
    description: "Destination guides across Asia, Europe, the Middle East, Africa, the Americas, Oceania and India — when to go, how long to stay, where to sleep.",
    body, ogArt: "destinations",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" }],
    schema: { "@type": "CollectionPage", name: "Travel Destinations", url: g.site.siteUrl + "/destinations/" }
  };
}

export function regionPage(r, g) {
  const dests = r.countries.flatMap(c => c.destinations);
  const body = `
${pageHero(`Destinations · ${r.name}`, r.name, r.blurb)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" }, { label: r.name }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="split">
    <div>${figure(r, { ratio: "4x3", label: r.name })}</div>
    <div class="prose"><p class="lede">${esc(r.intro)}</p>
    <p>Below: every country we cover in ${esc(r.name)}, and every destination guide within them. Each guide follows the same
    template, so you can compare a Himalayan valley with an Alpine one without re-learning how to read the page.</p></div>
  </div>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Countries", title: `Where we travel in ${r.name}` })}
  <div class="grid grid--3">
    ${list(r.countries, (c) => `<article class="card">
      <div class="card__body">
        <span class="card__kicker">${esc(c.currency)} · ${esc(c.languages.join(", "))}</span>
        <h3 class="card__title"><a class="card__link" href="${esc(c.url)}">${esc(c.name)}</a></h3>
        <p class="card__desc">Best months: ${esc(c.bestMonths)}</p>
        <div class="card__foot"><span>${c.destinations.length} ${c.destinations.length === 1 ? "guide" : "guides"}</span><span>→</span></div>
      </div></article>`)}
  </div>
</div></section>
<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Guides", title: `Destination guides in ${r.name}` })}
  <div class="grid grid--3">
    ${list(dests, (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "3x2",
      footLeft: esc(d.country_.name), footRight: esc(d.howManyDays.split(";")[0]) }))}
  </div>
</div></section>
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
    body, ogArt: `region-${r.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" }, { label: r.name, href: r.url }],
    schema: { "@type": "CollectionPage", name: `${r.name} travel guides`, url: g.site.siteUrl + r.url }
  };
}

export function countryPage(c, g) {
  const body = `
${pageHero(`${c.region_.name} · ${c.type === "state" ? "State" : "Country"}`, c.name,
  `${c.destinations.length} destination ${c.destinations.length === 1 ? "guide" : "guides"} in ${c.name}. Best months: ${c.bestMonths}.`)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" },
  { label: c.region_.name, href: c.region_.url }, { label: c.name }])}</div>
<section class="section section--tight"><div class="wrap">
  ${atAGlance([
    ["Region", c.region_.name],
    ["Currency", c.currency],
    ["Languages", c.languages.join(", ")],
    ["Best months", c.bestMonths],
    ["Guides", String(c.destinations.length)]
  ])}
  <div class="disclosure" style="margin-top:var(--s-6)">
    <div><strong>Entry requirements.</strong> ${esc(c.visaNote)} Requirements change and depend on your nationality —
    always confirm with the official government source for your passport before booking. See our
    <a href="/tools/visa-information/">visa information tool</a>.</div>
  </div>
</div></section>
<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Destinations", title: `Where to go in ${c.name}` })}
  <div class="grid grid--3">
    ${list(c.destinations, (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "3x2",
      footLeft: esc(d.howManyDays.split(";")[0]) }))}
  </div>
</div></section>
${c.destinations.some(d => d.hotels.length) ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Stay", title: `Places to stay in ${c.name}`, link: { href: "/stay/", label: "All stays" } })}
  <div class="grid grid--4">
    ${list(c.destinations.flatMap(d => d.hotels).slice(0, 8), (h) => card({ href: h.url, title: h.name, kicker: h.destination_.name,
      desc: h.kicker, entity: h, ratio: "4x3", badges: h.sample ? ["sample"] : [], footLeft: priceBand(h.priceBand) }))}
  </div>
</div></section>` : ""}`;
  return {
    url: c.url, template: "country", title: fitTitle([`${c.name} Travel Guide`, "Where to Go & When to Visit", "Pehchan"]),
    description: truncate(`Travel guide to ${c.name}: ${c.destinations.map(d => d.name).join(", ")}. Best time to visit, where to stay, entry requirements and curated journeys.`, 155),
    body, ogArt: `country-${c.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" },
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
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" },
  { label: d.region_.name, href: d.region_.url }, { label: d.country_.name, href: d.country_.url }, { label: d.name }])}</div>

${sec("glance", "", atAGlance([
  [d.country_.type === "state" ? "State" : "Country", d.country_.name],
  ["How many days", d.howManyDays.split(";")[0]],
  ["Best time", d.bestTime[0].split(":")[0].split(" —")[0]],
  ["Currency", d.country_.currency],
  ["Stays listed", String(d.hotels.length)],
  ["Experiences", String(d.experiences.length)]
]))}

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
    g.destinations.filter(o => o !== d && (o.region === d.region || o.tags.some(t => d.tags.includes(t)))).slice(0, 4),
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
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations/" },
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
