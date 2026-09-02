import { esc, list, card, sectionHead, figure, chip, newsletterBlock, priceBand, truncate } from "../lib/html.mjs";

/**
 * The homepage renders only what exists. Every block below is conditional, so
 * the page is honest at every stage — from a site with nothing published to a
 * full catalogue — rather than showing empty shelves or invented filler.
 */
export function home(g) {
  const { site, hotels, experiences, itineraries, stories, taxonomies } = g;
  const published = g.published;
  const drafts = g.drafts;
  const hasContent = published.length > 0;

  const body = `
<section class="hero">
  ${figure({ art: "himalaya", slug: "home-hero" }, { ratio: "16x9", label: "Mountain horizon", note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(site.promise)}</span>
    <h1>Your next extraordinary journey starts here.</h1>
    <p class="hero__sub">Discover remarkable places, beautiful stays and unforgettable experiences — thoughtfully curated for the way you want to travel.</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--light" href="/india/" data-track="cta_primary" data-track-label="Explore India">Explore India</a>
      <a class="btn btn--ghost" href="/international/" style="border-color:rgba(255,255,255,.5);color:#fff" data-track="cta_secondary" data-track-label="International">Travel International</a>
    </div>
    <div class="hero__meta">
      <span>${g.indiaRegions.length} regions across India</span>
      <span>${drafts.length + published.length} places travelled</span>
      ${hasContent ? `<span>${published.length} guides published</span>` : ""}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="split">
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Written from the road</span>
          <h2 class="display" style="font-size:var(--t-2xl)">Only places we have actually been</h2>
          <p class="lede" style="margin-top:var(--s-4)">Every guide here comes from first-hand travel — the timing that actually
          works, the permits nobody mentions, the stay worth the money and the one that is not. Nothing is assembled from
          somebody else's blog.</p>
        </div>
        <p class="muted">That means this site grows slowly and honestly. Places we have travelled are listed below as their
        guides are written; a page appears when there is something worth reading on it, and not before.</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="/india/">Explore India by region</a>
          <a class="btn btn--ghost" href="/international/">International</a>
        </div>
      </div>
      <div>${figure({ art: "india-palace", slug: "home-about" }, { ratio: "4x3", label: "Travel" })}</div>
    </div>
  </div>
</section>

${hasContent ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Guides", title: "Destination guides", intro: "Why go, when to go, how long to stay, where to sleep and what is genuinely worth your time.", link: { href: "/india/", label: "Explore India" } })}
  <div class="grid grid--4" data-reveal>
    ${list(published.slice(0, 8), (d) => card({ href: d.url, title: d.name, kicker: d.kicker, desc: d.summary,
      entity: d, ratio: "3x2", footLeft: esc(d.country_.name) }))}
  </div>
</div></section>` : ""}

${drafts.length ? `<section class="section${hasContent ? "" : " section--tinted"}"><div class="wrap">
  ${sectionHead({ eyebrow: "Places we have been", title: `${drafts.length} destinations, guides in progress`,
    intro: "These are the places travelled, not a wish list. Each guide goes live when it is written." })}
  <div class="grid grid--4" data-reveal>
    ${list(drafts.slice(0, 12), (d) => card({ href: d.url, title: d.name, kicker: d.kicker, entity: d,
      ratio: "4x3", flush: true, badges: ["draft"], footLeft: esc(d.country_.name), footRight: "In progress" }))}
  </div>
  <div class="btn-row" style="margin-top:var(--s-6)">
    <a class="btn btn--ghost" href="/india/">All of India</a>
    <a class="btn btn--ghost" href="/international/">All international</a>
  </div>
</div></section>` : ""}

${hotels.length ? `<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Exceptional stays", title: "Where you sleep is half the journey", link: { href: "/stay/", label: "All stays" } })}
  <div class="grid grid--4" data-reveal>
    ${list(hotels.slice(0, 4), (h) => card({ href: h.url, title: h.name, kicker: h.destination_.name, desc: h.kicker,
      entity: h, ratio: "4x3", footLeft: priceBand(h.priceBand) }))}
  </div>
</div></section>` : ""}

${experiences.length ? `<section class="section section--tinted"><div class="wrap">
  ${sectionHead({ eyebrow: "Experiences worth travelling for", title: "The reason you went", link: { href: "/experiences/", label: "All experiences" } })}
  <div class="grid grid--4" data-reveal>
    ${list(experiences.slice(0, 4), (e) => card({ href: e.url, title: e.name, kicker: e.destination_.name,
      desc: e.description, entity: e, ratio: "3x2", footLeft: esc(e.duration) }))}
  </div>
</div></section>` : ""}

${itineraries.length ? `<section class="section"><div class="wrap">
  ${sectionHead({ eyebrow: "Curated journeys", title: "Itineraries built to be travelled", link: { href: "/journeys/", label: "All journeys" } })}
  <div class="grid grid--3" data-reveal>
    ${list(itineraries.slice(0, 3), (i) => card({ href: i.url, title: i.title, kicker: `${i.days} days`,
      desc: i.overview, entity: i, ratio: "3x2", footRight: priceBand(i.budgetBand) }))}
  </div>
</div></section>` : ""}

${stories.length ? `<section class="section section--tight"><div class="wrap">
  ${sectionHead({ eyebrow: "Travel stories", title: "Writing from the road", link: { href: "/stories/", label: "All stories" } })}
  <div class="grid grid--3" data-reveal>
    ${list(stories.slice(0, 3), (s) => card({ href: s.url, title: s.title, kicker: s.readingTime, desc: s.dek,
      entity: s, ratio: "3x2", flush: true }))}
  </div>
</div></section>` : ""}

<section class="section section--tight">
  <div class="wrap">
    <div class="split split--media-right">
      <div>${figure({ art: "andes-terrace", slug: "planner" }, { ratio: "4x3", label: "Planning" })}</div>
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Plan with AI</span>
          <h2 class="display" style="font-size:var(--t-2xl)">Tell it how you travel. It builds the trip.</h2>
          <p class="lede" style="margin-top:var(--s-4)">Destination, dates, budget, pace and interests — and you get a
          day-by-day itinerary with stays, experiences, transport and a realistic budget attached to every day.</p>
        </div>
        ${hasContent ? `<ul class="checks">
          <li>Drawn from our own guides, never scraped listings</li>
          <li>Every recommendation links to a real page on this site</li>
          <li>Save it, share it, download it</li>
        </ul>` : `<p class="muted">The planner works from our published guides. It opens for planning as the first
        guides go live — it will not invent a place it has never been told about.</p>`}
        <div class="btn-row">
          <a class="btn btn--primary" href="/plan/" data-track="cta_planner">Open the AI Trip Planner</a>
          <a class="btn btn--ghost" href="/tools/">Free travel tools</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight"><div class="wrap">${newsletterBlock(site, "home")}</div></section>

<section class="section">
  <div class="wrap">
    <div class="split">
      <div>${figure({ art: "africa-medina", slug: "partner" }, { ratio: "4x3", label: "Partnerships" })}</div>
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Partner with us</span>
          <h2 class="display" style="font-size:var(--t-2xl)">Let's create better journeys together</h2>
          <p class="lede" style="margin-top:var(--s-4)">We work with hotels, resorts, tourism boards, tour operators and
          travel brands on destination storytelling, hotel features, campaigns and content production.</p>
        </div>
        <div class="btn-row">
          <a class="btn btn--primary" href="/partner/" data-track="cta_partner">Start a partnership</a>
          <a class="btn btn--ghost" href="/about/">About Pehchan</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="disclosure">
      <div><strong>How this site makes money, plainly.</strong> Some outbound booking links earn us a commission at no
      additional cost to you. Sponsored placements are labelled <em>Sponsored</em> wherever they appear. Editorial
      recommendations are never sold, and no page here fabricates prices, availability or offers.
      <a href="/legal/editorial-standards/">Read our editorial standards</a>.</div>
    </div>
  </div>
</section>`;

  return {
    url: "/", template: "home", isHome: true,
    title: `${site.brand} — Handcrafted Journeys & Beautiful Stays`,
    description: "First-hand travel guides across India and beyond — where to go, when, how long to stay and what is genuinely worth your time.",
    ogArt: "home", body,
    breadcrumbs: [{ label: "Home", href: "/" }]
  };
}
