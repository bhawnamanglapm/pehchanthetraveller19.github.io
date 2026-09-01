import { esc, list, card, sectionHead, figure, chip, breadcrumbs, nextSteps, priceBand, truncate, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub) => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}
</div></section>`;

const TYPE_LABEL = { style: "By travel style", landscape: "By landscape", length: "By trip length", budget: "By budget" };

export function collectionsIndex(g) {
  const groups = ["style", "landscape", "length", "budget"];
  const body = `
${pageHero("Collections", "Browse by how you want to travel",
  "The same catalogue, cut four ways — by style, by landscape, by trip length and by budget.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Collections" }])}</div>
${list(groups, (type, n) => `<section class="section section--tight${n % 2 ? " section--tinted" : ""}"><div class="wrap">
  ${sectionHead({ eyebrow: TYPE_LABEL[type], title: TYPE_LABEL[type].replace("By ", "").replace(/^./, c => c.toUpperCase()) })}
  <div class="grid grid--4">
    ${list(g.taxonomies.collections.filter(c => c.type === type), (c) => {
      const total = c.destinations_.length + c.hotels_.length + c.experiences_.length + c.itineraries_.length;
      return card({ href: c.url, title: c.title, kicker: TYPE_LABEL[c.type], desc: c.intro, entity: c, ratio: "4x3",
        flush: true, footLeft: `${total} entries` });
    })}
  </div>
</div></section>`)}`;
  return {
    url: "/collections/", template: "collections-index",
    title: "Travel Collections — By Style, Landscape, Length & Budget | Pehchan",
    description: "Curated travel collections: luxury escapes, solo trips, slow travel, mountains, beaches, deserts, weekend breaks and every budget band.",
    body, ogArt: "collections",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Collections", href: "/collections/" }],
    schema: { "@type": "CollectionPage", name: "Travel collections", url: g.site.siteUrl + "/collections/" }
  };
}

export function collectionPage(c, g) {
  const body = `
${pageHero(TYPE_LABEL[c.type], c.title, c.intro)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Collections", href: "/collections/" }, { label: c.title }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(g.taxonomies.collections.filter(o => o.type === c.type),
    (o) => o === c ? `<span class="chip chip--on">${esc(o.title)}</span>` : chip(o.title, o.url))}</div>
</div></section>
${c.destinations_.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Destinations", title: `Destinations for ${c.title.toLowerCase()}` })}
  <div class="grid grid--3">${list(c.destinations_, (d) => card({ href: d.url, title: d.name, kicker: d.kicker,
    desc: d.summary, entity: d, ratio: "3x2", footLeft: esc(d.country_.name) }))}</div>
</div></section>` : ""}
${c.itineraries_.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Journeys", title: "Itineraries in this collection" })}
  <div class="grid grid--3">${list(c.itineraries_, (i) => card({ href: i.url, title: i.title, kicker: `${i.days} days`,
    desc: i.overview, entity: i, ratio: "3x2", footRight: priceBand(i.budgetBand) }))}</div>
</div></section>` : ""}
${c.hotels_.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Stay", title: "Stays in this collection", link: { href: "/stay/", label: "All stays" } })}
  <div class="grid grid--4">${list(c.hotels_.slice(0, 12), (h) => card({ href: h.url, title: h.name,
    kicker: h.destination_.name, desc: h.kicker, entity: h, ratio: "4x3", badges: h.sample ? ["sample"] : [],
    footLeft: priceBand(h.priceBand) }))}</div>
</div></section>` : ""}
${c.experiences_.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Experiences", title: "Experiences in this collection", link: { href: "/experiences/", label: "All experiences" } })}
  <div class="grid grid--4">${list(c.experiences_.slice(0, 12), (e) => card({ href: e.url, title: e.name,
    kicker: e.destination_.name, desc: e.description, entity: e, ratio: "4x3", badges: e.sample ? ["sample"] : [] }))}</div>
</div></section>` : ""}
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next", steps: [
    { href: "/plan/", title: "Plan a trip", desc: "Turn this shortlist into a day-by-day itinerary." },
    { href: "/collections/", title: "Browse other collections", desc: "By style, landscape, length and budget." },
    { href: "/newsletter/", title: "Get the weekly edit", desc: "One considered email a week." }
  ]})}</div></section>`;
  return {
    url: c.url, template: "collection", title: fitTitle([c.title, "Curated Travel Collection", "Pehchan"]),
    description: truncate(c.intro, 155), body, ogArt: `col-${c.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Collections", href: "/collections/" }, { label: c.title, href: c.url }],
    schema: { "@type": "CollectionPage", name: c.title, description: c.intro, url: g.site.siteUrl + c.url }
  };
}

export function guidesIndex(g) {
  const byRegion = g.regions.map(r => ({ r, dests: r.countries.flatMap(c => c.destinations) })).filter(x => x.dests.length);
  const body = `
${pageHero("Travel guides", "Every guide, one structure",
  "Why visit, best time to visit, how to get there, how many days, where to stay, best things to do, food, budget, safety, culture, FAQs.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Guides" }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="prose"><p class="lede">A destination guide is only useful if it answers the questions you actually have, in the
  order you have them. Ours follow a fixed template so you can compare places rather than re-learn a layout — and so that
  a guide written two years from now is as complete as one written today.</p>
  <p>We do not publish thin programmatic pages. Every guide below is a full-length piece; if a place cannot support one, it
  does not get a URL. That is a deliberate constraint on how fast this section can grow.</p></div>
</div></section>
${list(byRegion, ({ r, dests }, n) => `<section class="section section--tight${n % 2 ? " section--tinted" : ""}"><div class="wrap">
  ${sectionHead({ eyebrow: r.name, title: `${r.name} guides`, link: { href: r.url, label: `All of ${r.name}` } })}
  <div class="grid grid--4">${list(dests, (d) => card({ href: d.url, title: d.name, kicker: d.country_.name,
    desc: d.summary, entity: d, ratio: "4x3", flush: true }))}</div>
</div></section>`)}`;
  return {
    url: "/guides/", template: "guides-index", title: "Travel Guides — Destination Guides Worldwide | Pehchan",
    description: "Full-length destination guides: why to visit, the best time to go, how many days you need, where to stay, what to do, food and budget.",
    body, ogArt: "guides",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Guides", href: "/guides/" }],
    schema: { "@type": "CollectionPage", name: "Travel guides", url: g.site.siteUrl + "/guides/" }
  };
}
