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
    <h1>Can I do this on my own?</h1>
    <p class="hero__sub">The question that actually stops women travelling — and the one no travel site answers.
    Twelve questions about how you really feel, and you get a profile of the traveller you are and the trips that will suit you.</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--light" href="/profile/" data-track="cta_primary" data-track-label="Solo Travel Profile">Find out</a>
      <a class="btn btn--ghost" href="/india/" style="border-color:rgba(255,255,255,.5);color:#fff" data-track="cta_secondary" data-track-label="Destinations">Where we have been</a>
    </div>
    <div class="hero__meta">
      <span>Twelve questions</span>
      <span>Stays on your device</span>
      <span>No account needed</span>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="split">
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Why this is different</span>
          <h2 class="display" style="font-size:var(--t-2xl)">We will not tell you a place is safe</h2>
          <p class="lede" style="margin-top:var(--s-4)">No destination is safe or unsafe in the abstract, and any site that
          says otherwise is guessing on your behalf. What we can tell you is which parts of a particular trip sit outside
          what <em>you</em> said you were comfortable with — the night arrival, the four-hour bus, the stretch with no signal.</p>
        </div>
        <p class="muted">Every guide comes from first-hand travel, and every destination is rated on the same twelve
        things you rate yourself on. This site grows slowly and honestly: a page appears when there is something worth
        reading on it, and not before.</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="/profile/">Build my profile</a>
          <a class="btn btn--ghost" href="/women-and-travel/">The research behind it</a>
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









<section class="section section--tight">
  <div class="wrap">
    <div class="split split--media-right">
      <div>${figure({ art: "andes-terrace", slug: "planner" }, { ratio: "4x3", label: "Planning" })}</div>
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Plan with AI</span>
          <h2 class="display" style="font-size:var(--t-2xl)">Tell us how you travel. We tell you what fits.</h2>
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
          <a class="btn btn--primary" href="/profile/" data-track="cta_profile">Build my profile</a>
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
