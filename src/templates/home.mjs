import { esc, list, card, feature, sectionHead, figure, newsletterBlock, chip, priceBand, truncate } from "../lib/html.mjs";

export function home(g) {
  const { site, hotels, experiences, itineraries, stories, taxonomies } = g;
  const destinations = g.published;
  const trending = [destinations[16], destinations[7], destinations[13], destinations[1]].filter(Boolean);
  const featuredDest = destinations.filter(d => ["kyoto", "amalfi-coast", "wadi-rum", "banff", "munnar", "queenstown", "marrakech", "cusco-sacred-valley"].includes(d.slug));
  const featuredStays = hotels.filter(h => ["the-lantern-ryokan-arashiyama", "sayan-gorge-retreat-ubud", "murren-cliff-lodge", "riad-nine-doors-marrakech"].includes(h.slug));
  const featuredExp = experiences.filter(e => ["wadi-rum-jebel-burdah-scramble", "oaxaca-mezcal-palenque-day", "amalfi-path-of-the-gods", "mara-dawn-game-drive"].includes(e.slug));

  const body = `
<section class="hero">
  ${figure({ art: "himalaya", slug: "home-hero" }, { ratio: "16x9", label: "Mountain horizon", note: false })}
  <div class="hero__inner">
    <span class="eyebrow" style="color:rgba(255,255,255,.75)">${esc(site.promise)}</span>
    <h1>Your next extraordinary journey starts here.</h1>
    <p class="hero__sub">Discover remarkable places, beautiful stays and unforgettable experiences — thoughtfully curated for the way you want to travel.</p>
    <div class="btn-row" style="margin-top:var(--s-3)">
      <a class="btn btn--light" href="/plan/" data-track="cta_primary" data-track-label="Plan My Trip">Plan My Trip</a>
      <a class="btn btn--ghost" href="/india/" style="border-color:rgba(255,255,255,.5);color:#fff" data-track="cta_secondary" data-track-label="Explore India">Explore India</a>
    </div>
    <div class="hero__meta">
      <span>${destinations.length} destination guides</span>
      <span>${hotels.length} stays</span>
      <span>${experiences.length} experiences</span>
      <span>${itineraries.length} curated journeys</span>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Trending now", title: "Where travellers are looking this month", intro: "The guides and journeys drawing the most attention right now, across seven continents.", link: { href: "/india/", label: "Explore India" } })}
    <div class="grid grid--4" data-reveal>
      ${list(trending, (d) => card({
        href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "4x3", flush: true,
        footLeft: esc(d.howManyDays.split(";")[0]), footRight: esc(d.region_.name)
      }))}
    </div>
  </div>
</section>

<section class="section section--tinted">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Destinations worth discovering", title: "India, region by region — and the world beyond it", intro: "Every guide follows the same structure — why go, when to go, how long to stay, where to sleep and what is genuinely worth your time.", link: { href: "/international/", label: "Travel international" } })}
    <div class="grid grid--4" data-reveal>
      ${list(featuredDest, (d) => card({
        href: d.url, title: d.name, kicker: d.kicker, desc: d.summary, entity: d, ratio: "3x2",
        footLeft: esc(d.country_.name), footRight: esc(d.bestTime[0].split(":")[0].split(" for ")[0])
      }))}
    </div>
    <div class="btn-row" style="margin-top:var(--s-6);justify-content:center">
      ${list(g.indiaRegions, (r) => chip(r.name, r.url))}
      ${list(g.intlRegions, (r) => chip(r.name, r.url))}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Exceptional stays", title: "Where you sleep is half the journey", intro: "Boutique houses, mountain lodges, desert camps and design hotels — assessed on who they suit and what they lack, not on adjectives.", link: { href: "/stay/", label: "All stays" } })}
    <div class="grid grid--4" data-reveal>
      ${list(featuredStays, (h) => card({
        href: h.url, title: h.name, kicker: h.destination_.name, desc: h.kicker, entity: h, ratio: "4x3",
        badges: h.sample ? ["sample"] : [],
        footLeft: priceBand(h.priceBand), footRight: esc(taxonomies.stayCategories.find(c => c.slug === h.categories[0])?.name || "")
      }))}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid--asym" data-reveal>
      ${feature({
        href: itineraries[0].url, title: itineraries[0].title, kicker: "Curated journey",
        desc: itineraries[0].overview, entity: itineraries[0], cta: "View the itinerary"
      })}
      <div class="stack-lg">
        ${sectionHead({ eyebrow: "Curated journeys", title: "Itineraries built to be travelled", intro: "Day by day, with the stays, the experiences and the transfers — and an honest note on what each day actually costs you in time." })}
        <div class="stack">
          ${list(itineraries.slice(1, 5), (i) => `<a class="card card--flush" href="${esc(i.url)}" style="flex-direction:row;gap:var(--s-4);align-items:center">
            <div style="flex:0 0 96px">${figure(i, { ratio: "1x1", label: i.title, note: false })}</div>
            <div class="card__body" style="padding:0">
              <span class="card__kicker">${i.days} days · ${esc(i.style.replace(/-/g, " "))}</span>
              <h3 class="card__title" style="font-size:var(--t-md)">${esc(i.title)}</h3>
              <p class="card__desc">${esc(truncate(i.subtitle, 70))}</p>
            </div></a>`)}
        </div>
        <a class="link-more" href="/journeys/">All curated journeys</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--tinted">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Experiences worth travelling for", title: "The reason you went, not the thing you filled a morning with", intro: "Guided by the people who live there — craft families, plantation staff, Bedouin guides, Maasai trackers.", link: { href: "/experiences/", label: "All experiences" } })}
    <div class="grid grid--4" data-reveal>
      ${list(featuredExp, (e) => card({
        href: e.url, title: e.name, kicker: e.destination_.name, desc: e.description, entity: e, ratio: "3x2",
        badges: e.sample ? ["sample"] : [],
        footLeft: esc(e.duration), footRight: esc(e.difficulty.split("—")[0])
      }))}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split">
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Plan with AI</span>
          <h2 class="display" style="font-size:var(--t-2xl)">Tell it how you travel. It builds the trip.</h2>
          <p class="lede" style="margin-top:var(--s-4)">Destination, dates, budget, pace, interests and who you are travelling with — and you get a day-by-day itinerary with stays, experiences, transport and a realistic budget attached to every day.</p>
        </div>
        <ul class="checks">
          <li>Day-by-day plan drawn from our own curated catalogue, not scraped listings</li>
          <li>Every recommendation links to a real guide, stay or experience on this site</li>
          <li>Save it, share it, download it — or hand it to us to design properly</li>
        </ul>
        <div class="btn-row">
          <a class="btn btn--primary" href="/plan/" data-track="cta_planner">Open the AI Trip Planner</a>
          <a class="btn btn--ghost" href="/tools/">Free travel tools</a>
        </div>
      </div>
      <div>${figure({ art: "andes-terrace", slug: "planner" }, { ratio: "4x3", label: "Planning" })}</div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Travel stories", title: "Writing from the road", intro: "First-person, specific, and honest about the days that did not work.", link: { href: "/stories/", label: "All stories" } })}
    <div class="grid grid--3" data-reveal>
      ${list(stories.slice(0, 3), (s) => card({
        href: s.url, title: s.title, kicker: s.categories[0].replace(/-/g, " "), desc: s.dek, entity: s, ratio: "3x2", flush: true,
        footLeft: esc(s.readingTime), footRight: s.destination_ ? esc(s.destination_.name) : ""
      }))}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Collections", title: "Browse by how you want to travel", intro: "By style, by landscape, by trip length, by budget." })}
    <div class="btn-row">
      ${list(taxonomies.collections, (c) => chip(c.title, c.url))}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">${newsletterBlock(site, "home")}</div>
</section>

<section class="section">
  <div class="wrap">
    <div class="split split--media-right">
      <div>${figure({ art: "africa-medina", slug: "partner" }, { ratio: "4x3", label: "Partnerships" })}</div>
      <div class="stack-lg">
        <div>
          <span class="eyebrow">Partner with us</span>
          <h2 class="display" style="font-size:var(--t-2xl)">Let's create better journeys together</h2>
          <p class="lede" style="margin-top:var(--s-4)">We work with hotels, resorts, tourism boards, tour operators and travel brands on destination storytelling, hotel features, campaigns and content production.</p>
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
      <div><strong>How this site makes money, plainly.</strong> Some outbound booking links earn us a commission at no additional cost to you.
      Sponsored placements are labelled <em>Sponsored</em> wherever they appear. Editorial recommendations are never sold.
      ${esc(site.affiliate.note)} <a href="/legal/editorial-standards/">Read our editorial standards</a>.</div>
    </div>
  </div>
</section>`;

  return {
    url: "/", template: "home", isHome: true,
    title: `${site.brand} — Handcrafted Journeys & Beautiful Stays`,
    description: "Discover remarkable destinations, beautiful stays and unforgettable experiences worldwide — curated guides, itineraries and an AI trip planner.",
    ogArt: "home", body,
    breadcrumbs: [{ label: "Home", href: "/" }]
  };
}
