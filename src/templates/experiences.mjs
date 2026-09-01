import { esc, list, card, sectionHead, figure, chip, breadcrumbs, atAGlance, nextSteps, bookingModule,
         newsletterBlock, truncate, badge, saveButton, factList, priceBand, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub) => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}
</div></section>`;

export function experiencesIndex(g) {
  const { taxonomies, experiences, site } = g;
  const body = `
${pageHero("Experiences", "The reason you went",
  "Craft workshops, market kitchens, high scrambles, dawn game drives and desert nights — run by the people who live there.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Experiences" }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(taxonomies.experienceCategories, (c) => chip(c.name, c.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "All experiences", title: `${experiences.length} experiences across ${new Set(experiences.map(e => e.destination_.slug)).size} destinations` })}
  <div class="grid grid--3">
    ${list(experiences, (e) => card({ href: e.url, title: e.name, kicker: `${e.destination_.name} · ${e.duration}`,
      desc: e.description, entity: e, ratio: "3x2", badges: e.sample ? ["sample"] : [],
      footLeft: esc(e.categories[0].replace(/-/g, " ")), footRight: esc(e.difficulty.split("—")[0]) }))}
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  <div class="disclosure"><div><strong>Sample listings.</strong> ${esc(site.sampleContentNotice)}</div></div>
</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(site, "experiences-index")}</div></section>`;
  return {
    url: "/experiences/", template: "experiences-index",
    title: "Travel Experiences — Tours, Workshops, Treks & Food | Pehchan",
    description: "A curated global experiences catalogue: adventure, food, culture, wellness, wildlife, hiking and local experiences, with honest difficulty notes.",
    body, ogArt: "experiences",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Experiences", href: "/experiences/" }],
    schema: { "@type": "CollectionPage", name: "Travel experiences", url: g.site.siteUrl + "/experiences/" }
  };
}

export function experienceCategoryPage(c, g) {
  const body = `
${pageHero("Experiences", c.name, c.intro)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Experiences", href: "/experiences/" }, { label: c.name }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(g.taxonomies.experienceCategories, (o) => o === c ? `<span class="chip chip--on">${esc(o.name)}</span>` : chip(o.name, o.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${c.experiences_.length ? `<div class="grid grid--3">${list(c.experiences_, (e) => card({ href: e.url, title: e.name,
    kicker: `${e.destination_.name} · ${e.duration}`, desc: e.description, entity: e, ratio: "3x2",
    badges: e.sample ? ["sample"] : [], footRight: esc(e.difficulty.split("—")[0]) }))}</div>`
  : `<p class="muted">Nothing in this category yet. <a href="/experiences/">Browse all experiences</a>.</p>`}
</div></section>
<section class="section section--tight"><div class="wrap">${nextSteps({ title: "Next", steps: [
  { href: "/destinations/", title: "Explore destinations", desc: "Where these experiences actually are." },
  { href: "/stay/", title: "Find a stay nearby", desc: "Book the bed before the activity." },
  { href: "/plan/", title: "Build an itinerary", desc: "Fit them into a day-by-day plan." }
]})}</div></section>`;
  return {
    url: c.url, template: "experience-category", title: fitTitle([`${c.name} Experiences Worldwide`, "Pehchan"]),
    description: truncate(`${c.intro} ${c.experiences_.length} curated ${c.name.toLowerCase()} experiences across our destinations.`, 155),
    body, ogArt: `exp-${c.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Experiences", href: "/experiences/" }, { label: c.name, href: c.url }],
    schema: { "@type": "CollectionPage", name: c.name, url: g.site.siteUrl + c.url }
  };
}

export function experiencePage(e, g) {
  const d = e.destination_;
  const bullets = (items) => `<ul class="checks">${list(items, (i) => `<li>${esc(i)}</li>`)}</ul>`;
  const body = `
<section class="hero">
  ${figure(e, { ratio: "16x9", label: e.name, note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(d.name)} · ${esc(d.country_.name)}</span>
    <h1>${esc(e.name)}</h1>
    <p class="hero__sub">${esc(e.description)}</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--book" href="#book" data-track="cta_book_experience" data-entity="${esc(e.slug)}">Book Experience</a>
      <a class="btn btn--ghost" style="border-color:rgba(255,255,255,.5);color:#fff" href="${esc(d.url)}">${esc(d.name)} guide</a>
    </div>
  </div>
</section>
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Experiences", href: "/experiences/" },
  { label: d.name, href: d.url }, { label: e.name }])}</div>
<section class="section section--tight"><div class="wrap">
  <div style="display:flex;flex-wrap:wrap;gap:var(--s-2);margin-bottom:var(--s-5)">
    ${e.sample ? badge("sample") : ""}${badge("editorial")}${badge("affiliate")}
  </div>
  ${atAGlance([
    ["Location", `${d.name}, ${d.country_.name}`],
    ["Duration", e.duration],
    ["Difficulty", e.difficulty],
    ["Recommended time", e.recommendedTime]
  ])}
</div></section>
<section class="section section--tight"><div class="wrap">
  <div class="grid grid--asym">
    <div class="prose">
      <h2 style="margin-top:0">What it is</h2><p>${esc(e.description)}</p>
      <h2>Ideal traveller</h2><p>${esc(e.idealTraveller)}</p>
      <h2>What is included</h2>${bullets(e.included)}
      <h2>What to expect</h2>${bullets(e.whatToExpect)}
      <h2>Reviews</h2>
      <p class="muted">We do not publish reviews or ratings we have not collected ourselves, and we do not republish a partner's
      star rating as though it were ours. When first-party reviews exist for this experience, they will appear here with the
      collection method stated. Until then, the honest answer is: we have none.</p>
    </div>
    <aside class="stack" id="book" style="position:sticky;top:calc(var(--header-h) + 24px)">
      ${bookingModule(e, g.site, { type: "experience", ctaLabel: "Book Experience" })}
      <div class="btn-row">${saveButton("experience", e.slug, e.name)}
        <a class="btn btn--ghost btn--sm" href="/plan/?destination=${esc(d.slug)}">Add to a trip</a></div>
      ${factList([
        ["Destination", `<a href="${esc(d.url)}">${esc(d.name)} guide</a>`],
        ["Categories", e.categories.map(c => {
          const cat = g.taxonomies.experienceCategories.find(x => x.slug === c);
          return cat ? `<a href="${cat.url}">${esc(cat.name)}</a>` : esc(c);
        }).join(", ")],
        ["Best time in ${d.name}".replace("${d.name}", d.name), d.bestTime[0].split(":")[0]]
      ])}
    </aside>
  </div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Gallery", title: "What you will see" })}
  <div class="grid grid--3">
    ${list([0, 1, 2], (i) => `<figure class="figure">${figure({ art: e.art, slug: e.slug + "-g" + i }, { ratio: "4x3", label: e.name })}
    <figcaption>Illustrated placeholder pending licensed photography.</figcaption></figure>`)}
  </div>
</div></section>
${d.hotels.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Stay nearby", title: `Where to stay in ${d.name}` })}
  <div class="grid grid--3">${list(d.hotels.slice(0, 3), (h) => card({ href: h.url, title: h.name, kicker: h.kicker,
    desc: h.overview, entity: h, ratio: "3x2", badges: h.sample ? ["sample"] : [], footLeft: priceBand(h.priceBand) }))}</div>
</div></section>` : ""}
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "Next steps", steps: [
    { href: "#book", title: "Book the experience", desc: "Handed off to an activity partner. We may earn a commission." },
    { href: `${d.url}#stay`, title: "Find where to stay", desc: `${d.hotels.length} stays in ${d.name}.` },
    { href: `/plan/?destination=${d.slug}`, title: "Build the whole trip", desc: "Day-by-day, with this in it." }
  ]})}</div></section>`;
  return {
    url: e.url, template: "experience", ogType: "article",
    title: fitTitle([e.name, d.name, "Pehchan"]),
    description: truncate(`${e.description}`, 155),
    body, ogArt: `exp-item-${e.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Experiences", href: "/experiences/" },
      { label: d.name, href: d.url }, { label: e.name, href: e.url }],
    schema: { "@type": "TouristAttraction", name: e.name, description: e.description, url: g.site.siteUrl + e.url,
      address: { "@type": "PostalAddress", addressLocality: d.name, addressCountry: d.country_.name },
      touristType: e.idealTraveller }
  };
}
