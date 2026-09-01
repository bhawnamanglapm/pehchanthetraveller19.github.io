import { esc, list, card, sectionHead, figure, chip, breadcrumbs, atAGlance, nextSteps,
         newsletterBlock, priceBand, truncate, saveButton, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub) => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}
</div></section>`;

export function journeysIndex(g) {
  const body = `
${pageHero("Curated journeys", "Itineraries built to be travelled",
  "Day by day, with the stays, the experiences, the transfers and an honest note on what each day costs you in time.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Journeys" }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(g.taxonomies.collections.filter(c => c.type === "length"), (c) => chip(c.title, c.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  <div class="grid grid--3">
    ${list(g.itineraries, (i) => card({ href: i.url, title: i.title, kicker: `${i.days} days · ${i.style.replace(/-/g, " ")}`,
      desc: i.overview, entity: i, ratio: "3x2",
      footLeft: esc(i.countries_.map(c => c.name).join(", ")), footRight: priceBand(i.budgetBand) }))}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Not quite the trip you had in mind?",
  intro: "The planner builds one around your own dates, budget and pace.",
  steps: [
    { href: "/plan/", title: "Use the AI Trip Planner", desc: "A day-by-day plan in about a minute." },
    { href: "/destinations/", title: "Start from a destination", desc: "Pick the place, then shape the days." },
    { href: "/partner/", title: "Have it designed for you", desc: "Premium trip planning — enquire about availability." }
  ]})}</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "journeys-index")}</div></section>`;
  return {
    url: "/journeys/", template: "journeys-index", title: "Curated Travel Itineraries — 7, 10, 14 Day Journeys | Pehchan",
    description: "Curated day-by-day itineraries: 7 days in Japan, 10 in Italy, 14 in Thailand and more — with stays, experiences, transport and budget bands.",
    body, ogArt: "journeys",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Journeys", href: "/journeys/" }],
    schema: { "@type": "CollectionPage", name: "Curated journeys", url: g.site.origin + "/journeys/" }
  };
}

export function itineraryPage(i, g) {
  const stays = [...new Set(i.dayPlan.map(d => d.stay_).filter(Boolean))];
  const exps = [...new Set(i.dayPlan.map(d => d.experience_).filter(Boolean))];
  const body = `
<section class="hero">
  ${figure(i, { ratio: "16x9", label: i.title, note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">Curated journey · ${i.days} days</span>
    <h1>${esc(i.title)}</h1>
    <p class="hero__sub">${esc(i.subtitle)}</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--light" href="/plan/?itinerary=${esc(i.slug)}" data-track="cta_build_this_trip" data-track-label="${esc(i.title)}">Build This Trip</a>
      <a class="btn btn--ghost" style="border-color:rgba(255,255,255,.5);color:#fff" href="#days">See the days</a>
    </div>
  </div>
</section>
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Journeys", href: "/journeys/" }, { label: i.title }])}</div>

<section class="section section--tight"><div class="wrap">
  ${atAGlance([
    ["Duration", `${i.days} days`],
    ["Countries", i.countries_.map(c => c.name).join(", ")],
    ["Style", i.style.replace(/-/g, " ")],
    ["Budget band", "$".repeat(i.budgetBand) + " (indicative)"],
    ["Best time", i.bestTime],
    ["Travel time", i.travelTime]
  ])}
</div></section>

<section class="section section--tight"><div class="wrap">
  <div class="grid grid--asym">
    <div class="prose"><h2 style="margin-top:0">Overview</h2><p class="drop-cap">${esc(i.overview)}</p>
      <h2>Destinations on this route</h2>
      <div class="tag-row" style="margin-top:var(--s-4)">
        ${list(i.destinations_, (d) => chip(d.name, d.url))}
        ${list(i.countries_.filter(c => !i.destinations_.some(d => d.country === c.slug)), (c) => chip(c.name, c.url))}
      </div>
      <h2>Estimated budget</h2>
      <p>We publish budget <em>bands</em> rather than invented totals: this journey sits at
      <strong>${"$".repeat(i.budgetBand)}</strong> of four. To turn that into your own number — with your dates, your
      standard of stay and your flights — use the <a href="/tools/trip-budget-calculator/">trip budget calculator</a>.</p>
      <h2>Packing recommendations</h2>
      <ul class="checks">${list(i.packing, (p) => `<li>${esc(p)}</li>`)}</ul>
    </div>
    <aside class="stack" style="position:sticky;top:calc(var(--header-h) + 24px)">
      <div class="booking">
        <div class="booking__head"><h3>Take this trip</h3>${priceBand(i.budgetBand)}</div>
        <a class="btn btn--primary btn--block" href="/plan/?itinerary=${esc(i.slug)}" data-track="cta_build_this_trip">Build This Trip</a>
        <button class="btn btn--ghost btn--block" type="button" data-download-itinerary="${esc(i.slug)}"
          data-track="download_itinerary">Download / print</button>
        <button class="btn btn--ghost btn--block" type="button" data-share data-share-title="${esc(i.title)}"
          data-track="share_trip">Share this journey</button>
        <div class="btn-row">${saveButton("itinerary", i.slug, i.title)}</div>
        <p class="affiliate-note">Stay and experience links in this itinerary may earn us a commission at no cost to you.
        <a href="/legal/affiliate-disclosure/">Details</a>.</p>
      </div>
      <div class="map-embed" data-map data-lat="${i.destinations_[0]?.coords[0] || 0}" data-lng="${i.destinations_[0]?.coords[1] || 0}" data-label="${esc(i.title)}">
        <div class="map-embed__cta"><span class="eyebrow" style="margin:0">Route map</span>
          <p class="muted" style="font-size:var(--t-sm);max-width:32ch">Click to load OpenStreetMap centred on the first stop.</p>
          <button class="btn btn--ghost btn--sm" type="button" data-map-load>Load map</button></div>
      </div>
    </aside>
  </div>
</div></section>

<section class="section" id="days"><div class="wrap">
  ${sectionHead({ eyebrow: "Day by day", title: "The itinerary" })}
  <div>${list(i.dayPlan, (d, n) => `<article class="day">
    <div class="day__no">${esc(d.day)}<small>${esc(d.place)}</small></div>
    <div>
      <h3 class="day__title">${esc(d.place)}</h3>
      <div class="day__slots">
        ${d.morning ? `<div class="day__slot"><b>Morning</b><span>${esc(d.morning)}</span></div>` : ""}
        ${d.afternoon ? `<div class="day__slot"><b>Afternoon</b><span>${esc(d.afternoon)}</span></div>` : ""}
        ${d.evening ? `<div class="day__slot"><b>Evening</b><span>${esc(d.evening)}</span></div>` : ""}
        ${d.transport ? `<div class="day__slot"><b>Transport</b><span>${esc(d.transport)}</span></div>` : ""}
        ${d.stay_ ? `<div class="day__slot"><b>Stay</b><span><a href="${esc(d.stay_.url)}">${esc(d.stay_.name)}</a> — ${esc(d.stay_.kicker)}</span></div>` : ""}
        ${d.experience_ ? `<div class="day__slot"><b>Experience</b><span><a href="${esc(d.experience_.url)}">${esc(d.experience_.name)}</a> — ${esc(d.experience_.duration)}</span></div>` : ""}
      </div>
      <div class="day__links">
        ${d.stay_ ? `<a class="btn btn--book btn--sm" href="${esc(d.stay_.url)}#book" data-track="itinerary_stay_click" data-entity="${esc(d.stay_.slug)}">Book the stay</a>` : ""}
        ${d.experience_ ? `<a class="btn btn--ghost btn--sm" href="${esc(d.experience_.url)}#book" data-track="itinerary_experience_click" data-entity="${esc(d.experience_.slug)}">Book the experience</a>` : ""}
      </div>
    </div></article>`)}
  </div>
</div></section>

${stays.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Stays on this journey", title: "Where you sleep" })}
  <div class="grid grid--3">${list(stays, (h) => card({ href: h.url, title: h.name, kicker: h.destination_.name,
    desc: h.kicker, entity: h, ratio: "3x2", badges: h.sample ? ["sample"] : [], footLeft: priceBand(h.priceBand) }))}</div>
</div></section>` : ""}

${exps.length ? `<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Experiences on this journey", title: "What you will do" })}
  <div class="grid grid--3">${list(exps, (e) => card({ href: e.url, title: e.name, kicker: e.duration,
    desc: e.description, entity: e, ratio: "3x2", badges: e.sample ? ["sample"] : [] }))}</div>
</div></section>` : ""}

<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Other journeys", title: "More itineraries" })}
  <div class="grid grid--4">${list(g.itineraries.filter(o => o !== i).slice(0, 4), (o) => card({ href: o.url,
    title: o.title, kicker: `${o.days} days`, desc: o.subtitle, entity: o, ratio: "4x3", flush: true }))}</div>
</div></section>

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Make it yours", steps: [
    { href: `/plan/?itinerary=${i.slug}`, title: "Build this trip", desc: "Adjust the dates, budget and pace in the planner." },
    { href: "#days", title: "Book the stays", desc: "Every night links to a property page." },
    { href: "/partner/", title: "Have it designed for you", desc: "Premium trip planning — enquire about availability." }
  ]})}</div></section>`;

  return {
    url: i.url, template: "itinerary", ogType: "article",
    title: fitTitle([i.title, `Day-by-Day ${i.days}-Day Itinerary`, "Pehchan"]),
    description: truncate(`${i.subtitle}. A ${i.days}-day itinerary with day-by-day plans, stays, experiences, transport and budget guidance.`, 155),
    body, ogArt: `journey-${i.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Journeys", href: "/journeys/" }, { label: i.title, href: i.url }],
    schema: { "@type": "ItemList", name: i.title, description: i.overview, numberOfItems: i.dayPlan.length,
      itemListElement: i.dayPlan.map((d, n) => ({ "@type": "ListItem", position: n + 1, name: `${d.day} — ${d.place}` })) }
  };
}
