# Pehchan — Brand, Information Architecture & Content Model

> Planning artifact 1 of 3. Written before implementation, per the build brief.

---

## 1. Brand positioning

**Wordmark:** `PEHCHAN`
**Descriptor:** Journeys & Stays
**Promise line:** *Handcrafted journeys. Beautiful stays. Stories worth travelling for.*

**Positioning statement**

> A global travel discovery platform helping modern travellers find exceptional
> destinations, stays, experiences and thoughtfully designed journeys.

**Why this name.** The brand inherits the owner's existing handle and domain equity
(`pehchanthetraveller19.github.io`) but is deliberately shortened to a single,
ownable word. Single-word names of South Asian origin have precedent as global
premium travel brands (Aman, Soneva, Oberoi, Taj), so the name reads
*international and distinctive* rather than *India-only*. Nothing in the codebase
depends on it: the wordmark, descriptor, promise line, legal entity name and
domain all live in `src/content/site.json` and can be changed in one edit.

**Brand attributes.** Premium · trustworthy · international · aspirational ·
authentic · editorial · modern · human · experience-led.
**Explicitly not:** corporate SaaS, influencer blog, deal-spam aggregator.

**Voice.** First person only where a human genuinely travelled. Specific over
superlative — "the 4:40am chai stop below Nathang Valley", not "an unforgettable
Himalayan adventure". Never "best in the world", never manufactured urgency.

**Audience.** Affluent and aspirational travellers; solo travellers; couples;
luxury and boutique-hotel travellers; experience seekers; slow travellers;
culture, nature and adventure travellers; professionals buying curation with
money rather than time; inbound travellers planning India; Indian travellers
planning outbound trips.

**Geography.** Global from day one. India is *one* of eight top-level regions and
is modelled with exactly the same schema as the other seven. No India-specific
assumption is hard-coded anywhere in the content model, routing, currency or
affiliate layers.

---

## 2. Information architecture

```
/                                   Home
/destinations/                      Region index (8 regions)
  /destinations/{region}/           Region → countries
  /destinations/{region}/{country}/ Country → destinations
  /destinations/{region}/{country}/{destination}/   Destination guide (SEO hub)
/stay/                              Accommodation discovery
  /stay/{category}/                 11 stay categories
  /stay/hotel/{hotel}/              Hotel page (affiliate-structured)
/experiences/                       Experience discovery
  /experiences/{category}/          13 experience categories
  /experiences/{experience}/        Experience page (affiliate-structured)
/journeys/                          Curated itineraries index
  /journeys/{itinerary}/            Day-by-day itinerary
/stories/                           Editorial index
  /stories/{category}/              11 story categories
  /stories/{story}/                 Story
/guides/                            Travel guide index (routes into destinations)
/collections/                       Editorial collections index
  /collections/{collection}/        Style · landscape · trip length · budget
/plan/                              AI Trip Planner
/tools/                             Planning tools index
  /tools/{tool}/                    11 individual tools
/deals/                             Travel deals (partner-slot architecture, no fabricated offers)
/search/                            Global search
/partner/                           Partner With Us (B2B lead gen)
/about/                             About
/newsletter/                        The Weekly Escape
/dashboard/                         Business-intelligence dashboard concept
/legal/editorial-standards/
/legal/affiliate-disclosure/
/legal/privacy/
/legal/terms/
/legal/cookies/
/contact/
```

**Canonical hierarchy.** `Region → Country → Destination → {Hotels, Experiences,
Itineraries, Stories}`. A destination is the SEO hub; hotels, experiences and
itineraries are the commerce leaves; stories are the top-of-funnel inbound.
Collections and categories are *cross-cuts* — alternative, tag-driven entry
points into the same node set. They never duplicate content; they list and link.

Example path: `Asia → India → Kerala → Munnar`.

---

## 3. Content model

Nine entities, all stored as JSON in `src/content/`, all with a stable `slug`
primary key. This is the schema a CMS or database would implement verbatim.

| Entity | Key fields |
|---|---|
| `site` | brand, promise, nav, currencies, locales, affiliate networks, analytics config |
| `regions` | slug, name, blurb, positioning, seedArt |
| `countries` | slug, region, name, currency, languages, visaNote, bestMonths |
| `destinations` | slug, country, region, name, kicker, summary, whyVisit, bestTime[], gettingThere[], howManyDays, whereToStay, thingsToDo[], food[], budget{tiers}, safety[], culture[], faqs[], related[], coords |
| `hotels` | slug, destination, name, category[], overview, whyStayHere[], bestRooms[], amenities[], nearbyExperiences[], bestFor[], bestTime, pros[], considerations[], nearbyAttractions[], priceBand, bookingPartners[], alternatives[] |
| `experiences` | slug, destination, name, categories[], description, duration, idealTraveller, included[], whatToExpect[], recommendedTime, partnerType, difficulty |
| `itineraries` | slug, title, countries[], days, style, overview, budgetBand, travelTime, packing[], bestTime, days[] {day, place, morning, afternoon, evening, stay, eat, experience, transport} |
| `stories` | slug, title, category[], destination, dek, readingTime, publishedAt, author, body[] |
| `collections` | slug, type (style/landscape/length/budget), title, intro, filter (declarative query over the graph) |

**Relationship rules.** Every hotel and experience must resolve to a real
destination; every destination to a real country; every country to a real region.
The build fails loudly on a dangling reference — this is what keeps a
programmatic content set from silently rotting as it scales.

**Editorial integrity fields.** Every commerce node carries `contentType`
(`editorial` | `sponsored` | `affiliate`) and `verifiedAt`. These drive the
visible disclosure badge; there is no way to publish a commercial placement
without one.

---

## 4. Component system

Presentation is a small, fixed set of primitives. Nothing bespoke per page.

**Layout:** `shell`, `masthead` (sticky, condensing), `mega-nav`, `footer`,
`section`, `section-head` (eyebrow + title + link), `grid` (2/3/4-up, responsive
by container), `split` (media + prose), `rail`.

**Content:** `card` (place / stay / experience / journey / story variants),
`card-wide`, `feature` (immersive hero card), `figure` (art + caption),
`fact-row`, `spec-table`, `prose`, `pull-quote`, `day-block` (itinerary),
`faq` (native `<details>`, emits FAQ schema), `breadcrumbs`, `chip`, `tag-row`,
`disclosure-badge`, `at-a-glance`, `next-steps` (the conversion block).

**Commerce:** `cta-primary` (Check Availability / Book), `cta-ghost`,
`partner-slot` (renders a labelled placeholder until a real partner link exists),
`price-band` (bands, never fabricated numbers), `affiliate-note`.

**Interactive:** `search-overlay`, `planner-form`, `planner-result`,
`tool-panel`, `map-embed` (static, click-to-load), `newsletter-form`,
`partner-form`, `save-button` (wishlist, local-first).

All primitives are plain semantic HTML plus CSS custom properties. No framework,
no hydration cost.

---

## 5. Technical architecture and why

**Constraint:** the repository is a GitHub Pages site whose Actions workflow
uploads the repository root as a static artifact. There is no server runtime.

**Decision:** a zero-dependency static site generator (`src/build.mjs`, Node 18+)
renders the JSON content graph into static HTML at the repo root. Client-side
behaviour is progressive enhancement in vanilla ES modules.

This yields exactly what the brief asks for — extremely fast, Core Web Vitals
friendly, crawlable, cheap to run — and keeps the door open: the same
`src/content/*.json` can be swapped for a CMS or database read later without
touching a single template, because templates only ever consume the resolved
content graph.

**Imagery.** The brief forbids cheap stock and fabricated visuals. Until real,
licensed photography exists, every media slot renders a deterministic,
seed-derived SVG artwork generated at build time — no network requests, no
layout shift, no pretence of being a photograph. Each is captioned
*"Illustrated placeholder"*, and every content record has an optional `image`
field: the moment a real licensed asset is added there, it replaces the artwork
with no template change.

**Deferred by design (documented, not built):** user accounts, server-side
personalisation, live pricing, real affiliate API calls. Each has a named seam
in the code (`assets/js/account.js` local-first store, `partner-slot`,
`plannerProvider`) so Phase 2/3 is additive rather than a rewrite.
