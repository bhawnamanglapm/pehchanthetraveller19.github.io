import { esc, list, card, sectionHead, figure, chip, breadcrumbs, atAGlance, nextSteps, bookingModule,
         newsletterBlock, priceBand, truncate, badge, saveButton, factList, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub, extra = "") => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}${extra}
</div></section>`;

const sampleNotice = (site) => `<div class="disclosure">
  <div><strong>Sample listing.</strong> ${esc(site.sampleContentNotice)}</div></div>`;

export function stayIndex(g) {
  const { taxonomies, hotels, site } = g;
  const body = `
${pageHero("Stay", "Where you sleep is half the journey",
  "Boutique houses, mountain lodges, desert camps, estate bungalows and design hotels — assessed on who they suit and what they lack.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Stay" }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(taxonomies.stayCategories, (c) => chip(c.name, c.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "By type", title: "Find the kind of stay you are after" })}
  <div class="grid grid--3">
    ${list(taxonomies.stayCategories, (c) => `<article class="card">
      ${figure(c, { ratio: "3x2", label: c.name })}
      <div class="card__body">
        <h3 class="card__title"><a class="card__link" href="${esc(c.url)}">${esc(c.name)}</a></h3>
        <p class="card__desc">${esc(c.intro)}</p>
        <div class="card__foot"><span>${c.hotels_.length} ${c.hotels_.length === 1 ? "stay" : "stays"}</span><span>→</span></div>
      </div></article>`)}
  </div>
</div></section>
<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "All stays", title: `Every property in the catalogue`, intro: "Each page covers the overview, the best rooms, who it suits, who it does not, and what to consider before booking." })}
  <div class="grid grid--4">
    ${list(hotels, (h) => card({ href: h.url, title: h.name, kicker: h.destination_.name, desc: h.kicker, entity: h,
      ratio: "4x3", badges: h.sample ? ["sample"] : [], footLeft: priceBand(h.priceBand), footRight: esc(h.destination_.country_.name) }))}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">${sampleNotice(site)}</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(site, "stay-index")}</div></section>`;
  return {
    url: "/stay/", template: "stay-index", title: "Where to Stay — Boutique Hotels, Lodges, Camps & Villas | Pehchan",
    description: "Luxury and boutique stays worldwide: hotels, resorts, mountain retreats, villas and unique stays — assessed on who they genuinely suit.",
    body, ogArt: "stay",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Stay", href: "/stay/" }],
    schema: { "@type": "CollectionPage", name: "Where to stay", url: g.site.siteUrl + "/stay/" }
  };
}

export function stayCategoryPage(c, g) {
  const body = `
${pageHero("Stay", c.name, c.intro)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Stay", href: "/stay/" }, { label: c.name }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(g.taxonomies.stayCategories, (o) => o === c ? `<span class="chip chip--on">${esc(o.name)}</span>` : chip(o.name, o.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${c.hotels_.length ? `<div class="grid grid--3">${list(c.hotels_, (h) => card({ href: h.url, title: h.name,
    kicker: h.destination_.name, desc: h.kicker, entity: h, ratio: "3x2", badges: h.sample ? ["sample"] : [],
    footLeft: priceBand(h.priceBand), footRight: esc(h.bestFor[0]) }))}</div>`
  : `<p class="muted">No properties in this category yet. <a href="/stay/">Browse all stays</a>.</p>`}
</div></section>
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next",
  steps: [
    { href: "/india/", title: "Explore destinations", desc: "Find the place first, then the property." },
    { href: "/experiences/", title: "Explore experiences", desc: "What you will actually do while you are there." },
    { href: "/plan/", title: "Plan the trip", desc: "Generate a day-by-day itinerary around a stay." }
  ]})}</div></section>`;
  return {
    url: c.url, template: "stay-category", title: fitTitle([c.name, "Curated Stays Worldwide", "Pehchan"]),
    description: truncate(`${c.intro} ${c.hotels_.length} properties across our destinations, with an honest note on who each one suits.`, 155),
    body, ogArt: `stay-${c.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Stay", href: "/stay/" }, { label: c.name, href: c.url }],
    schema: { "@type": "CollectionPage", name: c.name, url: g.site.siteUrl + c.url }
  };
}

export function hotelPage(h, g) {
  const d = h.destination_;
  const bullets = (items, cls = "checks") => `<ul class="${cls}">${list(items, (i) => `<li>${esc(i)}</li>`)}</ul>`;
  const body = `
<section class="hero">
  ${figure(h, { ratio: "16x9", label: h.name, note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(d.name)} · ${esc(d.country_.name)}</span>
    <h1>${esc(h.name)}</h1>
    <p class="hero__sub">${esc(h.kicker)}</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--book" href="#book" data-track="cta_check_availability" data-entity="${esc(h.slug)}">Check Availability</a>
      <a class="btn btn--ghost" style="border-color:rgba(255,255,255,.5);color:#fff" href="#alternatives">Alternative stays</a>
    </div>
  </div>
</section>
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Stay", href: "/stay/" },
  { label: d.name, href: d.url }, { label: h.name }])}</div>

<section class="section section--tight"><div class="wrap">
  <div style="display:flex;flex-wrap:wrap;gap:var(--s-2);margin-bottom:var(--s-5)">
    ${h.sample ? badge("sample") : ""}${badge("editorial")}${badge("affiliate")}
  </div>
  ${atAGlance([
    ["Location", d.name],
    ["Price band", "$".repeat(h.priceBand) + " (indicative)"],
    ["Best for", h.bestFor[0]],
    ["Best time", h.bestTime.split(";")[0]],
    ["Style", g.taxonomies.stayCategories.find(c => c.slug === h.categories[0])?.name || h.categories[0]]
  ])}
</div></section>

<section class="section section--tight"><div class="wrap">
  <div class="grid grid--asym">
    <div class="prose">
      <h2 style="margin-top:0">Overview</h2><p>${esc(h.overview)}</p>
      <h2>Location</h2><p>${esc(h.location)}</p>
      <h2>Why stay here</h2>${bullets(h.whyStayHere)}
      <h2>Best rooms</h2>${bullets(h.bestRooms)}
      <h2>Amenities</h2>
      <div class="tag-row" style="margin-top:var(--s-4)">${list(h.amenities, (a) => chip(a))}</div>
      <h2>Who it is best for</h2>${bullets(h.bestFor)}
      <h3>Who it is not for</h3>${bullets(h.notFor, "checks considerations")}
      <h2>Best time to visit</h2><p>${esc(h.bestTime)}</p>
      <h2>Pros and considerations</h2>
      <div class="grid grid--2" style="margin-top:var(--s-4)">
        <div><h3 style="margin-top:0;font-size:var(--t-md)">Pros</h3>${bullets(h.pros)}</div>
        <div><h3 style="margin-top:0;font-size:var(--t-md)">Considerations</h3>${bullets(h.considerations, "checks considerations")}</div>
      </div>
      <h2>Nearby attractions</h2>${bullets(h.nearbyAttractions)}
    </div>
    <aside class="stack" id="book" style="position:sticky;top:calc(var(--header-h) + 24px)">
      ${bookingModule(h, g.site, { type: "stay", ctaLabel: "Check Availability" })}
      <div class="btn-row">${saveButton("hotel", h.slug, h.name)}
        <a class="btn btn--ghost btn--sm" href="/plan/?destination=${esc(d.slug)}&stay=${esc(h.slug)}" data-track="cta_plan_hotel">Build a trip around it</a></div>
      ${factList([
        ["Destination", `<a href="${esc(d.url)}">${esc(d.name)} guide</a>`],
        ["Country", `<a href="${esc(d.country_.url)}">${esc(d.country_.name)}</a>`],
        ["Categories", h.categories.map(c => {
          const cat = g.taxonomies.stayCategories.find(x => x.slug === c);
          return cat ? `<a href="${cat.url}">${esc(cat.name)}</a>` : esc(c);
        }).join(", ")]
      ])}
    </aside>
  </div>
</div></section>

<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Gallery", title: "The property" })}
  <div class="grid grid--3">
    ${list([0, 1, 2], (i) => `<figure class="figure">${figure({ art: h.art, slug: h.slug + "-g" + i }, { ratio: "4x3", label: h.name })}
      <figcaption>${esc(["The setting", "The rooms", "The surroundings"][i])} — illustrated placeholder pending licensed photography.</figcaption></figure>`)}
  </div>
</div></section>

${d.experiences.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Nearby", title: `Experiences near ${d.name}`, link: { href: "/experiences/", label: "All experiences" } })}
  <div class="grid grid--3">${list(d.experiences.slice(0, 3), (e) => card({ href: e.url, title: e.name,
    kicker: e.duration, desc: e.description, entity: e, ratio: "3x2", badges: e.sample ? ["sample"] : [] }))}</div>
</div></section>` : ""}

${h.alternatives_.length ? `<section class="section" id="alternatives"><div class="wrap">
  ${sectionHead({ eyebrow: "Alternatives", title: "If this one is booked, or not quite right" })}
  <div class="grid grid--3">${list(h.alternatives_, (a) => card({ href: a.url, title: a.name, kicker: a.destination_.name,
    desc: a.kicker, entity: a, ratio: "3x2", badges: a.sample ? ["sample"] : [], footLeft: priceBand(a.priceBand) }))}</div>
</div></section>` : ""}

<section class="section section--tight"><div class="wrap">${sampleNotice(g.site)}</div></section>

<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next steps",
  intro: "Read the review, look at the property, check the dates, book.",
  steps: [
    { href: "#book", title: "Check availability", desc: "Goes out to a booking partner. We may earn a commission." },
    { href: `${d.url}#experiences`, title: "Explore experiences nearby", desc: `What to actually do in ${d.name}.` },
    { href: d.url, title: `Read the ${d.name} guide`, desc: "Best time to visit, how many days, and what else is close." }
  ]})}</div></section>`;

  return {
    url: h.url, template: "hotel", ogType: "article",
    title: fitTitle([`${h.name}, ${d.name}`, "Review, Rooms & Who It Suits", "Pehchan"]),
    description: truncate(`${h.kicker}. ${h.overview}`, 155),
    body, ogArt: `hotel-${h.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Stay", href: "/stay/" },
      { label: d.name, href: d.url }, { label: h.name, href: h.url }],
    // Hotel schema without review/rating: we hold no first-party review data,
    // so emitting AggregateRating here would be fabrication.
    schema: { "@type": "Hotel", name: h.name, description: h.overview, url: g.site.siteUrl + h.url,
      address: { "@type": "PostalAddress", addressLocality: d.name, addressCountry: d.country_.name },
      amenityFeature: h.amenities.map(a => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
      priceRange: "$".repeat(h.priceBand) }
  };
}
