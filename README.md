# Pehchan — Journeys & Stays

**Handcrafted journeys. Beautiful stays. Stories worth travelling for.**

A global travel discovery platform: destination guides, a curated catalogue of
stays and experiences, day-by-day itineraries, an AI trip planner, free planning
tools, and a monetization architecture built for affiliate commerce, sponsored
partnerships and premium trip planning.

Live at **https://pehchanthetraveller19.github.io**

---

## What this is

A production-quality static site generated from a structured content model.
214 pages, no framework, no runtime dependencies, no third-party scripts,
no webfonts.

| | |
|---|---|
| Regions | 8 (Asia, Europe, Middle East, Africa, North America, South America, Oceania, India) |
| Countries | 20 |
| Destination guides | 20, full-length |
| Stays | 27 |
| Experiences | 31 |
| Curated journeys | 8 |
| Travel stories | 8 |
| Collections | 24 (style · landscape · trip length · budget) |
| Planning tools | 8 live, 3 on the roadmap |
| Homepage weight | ~27KB gzipped |

## Planning artifacts

The brief required the thinking before the code. It lives in `docs/`:

1. [`docs/01-brand-and-architecture.md`](docs/01-brand-and-architecture.md) —
   brand positioning, information architecture, content model, component system,
   technical decisions
2. [`docs/02-journeys-monetization-conversion.md`](docs/02-journeys-monetization-conversion.md) —
   user journeys, the monetization map, conversion strategy, the analytics event taxonomy
3. [`docs/03-seo-and-roadmap.md`](docs/03-seo-and-roadmap.md) —
   SEO architecture, the responsive design system, MVP / Phase 2 / Phase 3 roadmap

## Repository layout

```
src/
  content/*.json      the content model — swap for a CMS without touching templates
  lib/graph.mjs       loads and validates the content graph; fails on dangling refs
  lib/art.mjs         deterministic SVG artwork generator (see "Imagery" below)
  lib/html.mjs        component library — cards, booking modules, FAQ, next-steps
  lib/shell.mjs       page shell: head, metadata, JSON-LD, nav, footer
  templates/*.mjs     one module per page type
  build.mjs           route table, integrity checks, renderer
assets/
  css/tokens.css      design tokens, full light + dark palettes
  css/main.css        the design system (~34KB, unminified)
  js/                 progressive enhancement, ES modules, loaded per page need
docs/                 the planning artifacts
<generated>           destinations/ stay/ experiences/ journeys/ stories/ … + sitemap.xml
```

## Build

```bash
node src/build.mjs           # render into the repository root
node src/build.mjs --clean   # remove generated output first
```

Node 18+. No `npm install` — there are no dependencies.

The build **fails rather than publishing a defect**. It rejects:

- a dangling reference (a hotel pointing at a destination that does not exist)
- a duplicate route
- a `<title>` over 75 characters or a meta description over 165
- an orphan page — anything nothing else links to, checked against rendered output

## Deployment

`.github/workflows/static.yml` uploads the repository root to GitHub Pages on
every push to `main`. Generated HTML is committed, so the workflow needs no build
step; run `node src/build.mjs` and commit the result before pushing.

## Honesty constraints

These are enforced in the code, not just stated in a policy page:

- **No fabricated prices, availability, offers, reviews, ratings, awards or urgency.**
  Cost is a band (`$`–`$$$$`) marked indicative. Booking modules render a visible
  *Partner slot — not yet live* placeholder with a disabled button until a real
  affiliate link exists.
- **No `Review` or `AggregateRating` schema.** We hold no first-party review data,
  so emitting it would be fabrication.
- **Sample content is badged.** Stays and experiences are illustrative sample
  listings demonstrating page structure; every card and page carries a
  *Sample listing* badge and an explanatory note.
- **Imagery is generated, labelled artwork.** Every media slot renders a
  deterministic seed-derived SVG captioned *Illustrated placeholder* — no stock
  photography, no AI-generated images implying we were somewhere we were not.
  Add a real licensed asset to a record's `image` field and it takes over with no
  template change.
- **The planner cannot invent.** It matches over the site's own catalogue, so
  every recommendation resolves to a real page here.

## Monetization seams

Everything commercial is architecturally present and clearly not yet live:

| Stream | Seam |
|---|---|
| Hotel affiliate | `bookingModule()` in `src/lib/html.mjs`; add `bookingPartners[]` to a hotel record |
| Activities affiliate | Same module, `type: "experience"` |
| Flights / transport | `site.json → affiliate.networks` |
| Sponsored content | `/partner/`, plus the `Sponsored` disclosure badge |
| Premium planning | Planner result → *Register interest* → partner enquiry |
| Newsletter | `newsletterBlock()`; add a provider endpoint in `assets/js/site.js` |

Analytics is provider-neutral (`assets/js/analytics.js`): configure GA4, Plausible
or a warehouse endpoint in `src/content/site.json`. **With none configured — the
current state — nothing is transmitted and nothing is stored.**

## Extending it

- **New destination** — add to `src/content/destinations.json` and rebuild. Region,
  country, hotel, experience, itinerary and collection links resolve automatically.
- **New page type** — add a template in `src/templates/`, register it in the route
  table in `src/build.mjs`.
- **Rebrand** — every name, promise line, email, currency and network lives in
  `src/content/site.json`.
- **Real photography** — set `image` (and `imageAlt`) on any content record.
- **A real LLM planner** — implement `plannerProvider(brief, catalog)` in
  `assets/js/planner.js` against a hosted endpoint. It must still resolve every
  recommendation to a catalogue slug; anything unresolvable is dropped.

## Licence

Code is MIT (see `LICENSE`). Written content and the brand are not.
