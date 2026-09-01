import { esc, list, card, sectionHead, figure, chip, breadcrumbs, nextSteps, newsletterBlock, truncate, fitTitle } from "../lib/html.mjs";

const pageHero = (kicker, title, sub) => `
<section class="hero hero--page"><div class="hero__inner">
  ${kicker ? `<span class="eyebrow">${esc(kicker)}</span>` : ""}
  <h1 class="display">${esc(title)}</h1>
  ${sub ? `<p class="hero__sub">${esc(sub)}</p>` : ""}
</div></section>`;

export function storiesIndex(g) {
  const [lead, ...rest] = g.stories;
  const body = `
${pageHero("Travel stories", "Writing from the road",
  "First-person, specific, and honest about the days that did not work. Sample editorial demonstrating the section's voice and structure.")}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Stories" }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(g.taxonomies.storyCategories, (c) => chip(c.name, c.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  <a class="card card-wide" href="${esc(lead.url)}" style="border:0;background:none">
    ${figure(lead, { ratio: "3x2", label: lead.title })}
    <div class="card__body" style="padding:0">
      <span class="card__kicker">${esc(lead.categories[0].replace(/-/g, " "))} · ${esc(lead.readingTime)}</span>
      <h2 class="card__title" style="font-size:var(--t-2xl)">${esc(lead.title)}</h2>
      <p class="card__desc" style="font-size:var(--t-md)">${esc(lead.dek)}</p>
      <span class="link-more" style="margin-top:var(--s-3)">Read the story</span>
    </div></a>
</div></section>
<section class="section section--tight"><div class="wrap">
  <div class="grid grid--3">${list(rest, (s) => card({ href: s.url, title: s.title,
    kicker: `${s.categories[0].replace(/-/g, " ")} · ${s.readingTime}`, desc: s.dek, entity: s, ratio: "3x2", flush: true,
    footLeft: s.destination_ ? esc(s.destination_.name) : "", footRight: esc(s.publishedAt) }))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "stories-index")}</div></section>`;
  return {
    url: "/stories/", template: "stories-index", title: "Travel Stories — Writing From the Road | Pehchan",
    description: "Personal travel writing on solo travel, mountains, food, culture, slow travel and the lessons that only come from getting it wrong.",
    body, ogArt: "stories",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Stories", href: "/stories/" }],
    schema: { "@type": "Blog", name: "Pehchan Travel Stories", url: g.site.siteUrl + "/stories/" }
  };
}

export function storyCategoryPage(c, g) {
  const body = `
${pageHero("Stories", c.name, c.intro)}
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Stories", href: "/stories/" }, { label: c.name }])}</div>
<section class="section section--tight"><div class="wrap">
  <div class="btn-row">${list(g.taxonomies.storyCategories, (o) => o === c ? `<span class="chip chip--on">${esc(o.name)}</span>` : chip(o.name, o.url))}</div>
</div></section>
<section class="section section--tight"><div class="wrap">
  ${c.stories_.length ? `<div class="grid grid--3">${list(c.stories_, (s) => card({ href: s.url, title: s.title,
    kicker: s.readingTime, desc: s.dek, entity: s, ratio: "3x2", flush: true }))}</div>`
  : `<p class="muted">Nothing in this category yet. <a href="/stories/">All stories</a>.</p>`}
</div></section>`;
  return {
    url: c.url, template: "story-category", title: fitTitle([c.name, "Travel Stories", "Pehchan"]),
    description: truncate(`${c.intro} ${c.stories_.length} ${c.stories_.length === 1 ? "story" : "stories"} from the road.`, 155),
    body, ogArt: `story-cat-${c.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Stories", href: "/stories/" }, { label: c.name, href: c.url }],
    schema: { "@type": "CollectionPage", name: c.name, url: g.site.siteUrl + c.url }
  };
}

export function storyPage(s, g) {
  const bodyHtml = list(s.body, (b) => {
    if (b.type === "h2") return `<h2>${esc(b.text)}</h2>`;
    if (b.type === "quote") return `<blockquote>${esc(b.text)}</blockquote>`;
    return `<p>${esc(b.text)}</p>`;
  });
  const related = g.stories.filter(o => o !== s && o.categories.some(c => s.categories.includes(c))).slice(0, 3);
  const body = `
<section class="hero">
  ${figure(s, { ratio: "16x9", label: s.title, note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(s.categories.map(c => c.replace(/-/g, " ")).join(" · "))}</span>
    <h1>${esc(s.title)}</h1>
    <p class="hero__sub">${esc(s.dek)}</p>
    <div class="hero__meta"><span>${esc(s.author)}</span><span>${esc(s.publishedAt)}</span><span>${esc(s.readingTime)}</span></div>
  </div>
</section>
<div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Stories", href: "/stories/" }, { label: s.title }])}</div>
<section class="section section--tight"><div class="wrap wrap--prose">
  <article class="prose">${bodyHtml}</article>
  <div class="btn-row" style="margin-top:var(--s-7)">
    <button class="btn btn--ghost btn--sm" type="button" data-share data-share-title="${esc(s.title)}" data-track="share_story">Share</button>
    ${s.destination_ ? `<a class="btn btn--ghost btn--sm" href="${esc(s.destination_.url)}">${esc(s.destination_.name)} guide</a>` : ""}
  </div>
  <div class="disclosure" style="margin-top:var(--s-6)">
    <div><strong>Sample editorial.</strong> This piece demonstrates the voice and structure of the Stories section. It is
    illustrative writing, not a report of a specific verified trip, and is labelled as such. Published stories will carry
    a named author and travel dates. See our <a href="/legal/editorial-standards/">editorial standards</a>.</div>
  </div>
</div></section>
${s.destination_ ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "The destination", title: `Plan a trip to ${s.destination_.name}` })}
  <div class="grid grid--3">
    ${card({ href: s.destination_.url, title: `${s.destination_.name} guide`, kicker: s.destination_.kicker,
      desc: s.destination_.summary, entity: s.destination_, ratio: "3x2" })}
    ${s.destination_.hotels[0] ? card({ href: s.destination_.hotels[0].url, title: s.destination_.hotels[0].name,
      kicker: "Where to stay", desc: s.destination_.hotels[0].kicker, entity: s.destination_.hotels[0], ratio: "3x2",
      badges: ["sample"] }) : ""}
    ${s.destination_.experiences[0] ? card({ href: s.destination_.experiences[0].url, title: s.destination_.experiences[0].name,
      kicker: "What to do", desc: s.destination_.experiences[0].description, entity: s.destination_.experiences[0], ratio: "3x2",
      badges: ["sample"] }) : ""}
  </div>
</div></section>` : ""}
${related.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "More stories", title: "Keep reading" })}
  <div class="grid grid--3">${list(related, (o) => card({ href: o.url, title: o.title, kicker: o.readingTime,
    desc: o.dek, entity: o, ratio: "3x2", flush: true }))}</div>
</div></section>` : ""}
<section class="section section--tight"><div class="wrap">${nextSteps({
  title: "From story to trip", steps: [
    ...(s.destination_ ? [{ href: s.destination_.url, title: `Explore ${s.destination_.name}`, desc: "The full destination guide." }] : []),
    ...(s.destination_?.itineraries[0] ? [{ href: s.destination_.itineraries[0].url, title: "View an itinerary", desc: s.destination_.itineraries[0].title }]
      : [{ href: "/journeys/", title: "Browse journeys", desc: "Curated day-by-day itineraries." }]),
    { href: "/plan/", title: "Plan your own trip", desc: "The AI Trip Planner, in about a minute." }
  ]})}</div></section>
<section class="section section--tight"><div class="wrap">${newsletterBlock(g.site, "story")}</div></section>`;
  return {
    url: s.url, template: "story", ogType: "article",
    title: fitTitle([s.title, "Pehchan Travel Stories"]),
    description: truncate(s.dek, 155), body, ogArt: `story-${s.slug}`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Stories", href: "/stories/" }, { label: s.title, href: s.url }],
    schema: { "@type": "Article", headline: s.title, description: s.dek, datePublished: s.publishedAt,
      author: { "@type": "Organization", name: s.author }, publisher: { "@id": g.site.siteUrl + "/#org" },
      mainEntityOfPage: g.site.siteUrl + s.url, articleSection: s.categories[0] }
  };
}
