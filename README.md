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

**Live URL:** https://bhawnamanglapm.github.io/pehchanthetraveller19.github.io/

### About that URL — and the `basePath` setting

GitHub publishes a *user site* at `https://<account>.github.io/` only when the
repository is named `<account>.github.io`. This account is `bhawnamanglapm`, so a
user site would need a repo named `bhawnamanglapm.github.io`. The name
`pehchanthetraveller19.github.io` merely *looks* like a domain, so GitHub treats
this as an ordinary **project site** and serves it from a subpath.

Every internal link and asset reference would 404 at a subpath if it were
root-relative, so `src/content/site.json` carries:

```json
"origin":   "https://bhawnamanglapm.github.io",
"basePath": "/pehchanthetraveller19.github.io"
```

Templates author clean URLs (`/stay/…`); `src/build.mjs` applies `basePath` once
at write time, and a build guard fails if any URL escapes it. `site.siteUrl`
(`origin + basePath`) is the single source for canonicals, Open Graph, JSON-LD,
the sitemap and the feed.

**If you move the site, this is a one-line change.** Set `basePath` to `""` and
update `origin`, then rebuild:

| Destination | `origin` | `basePath` |
|---|---|---|
| Custom domain (e.g. `pehchan.travel`) | `https://pehchan.travel` | `""` |
| Rename repo to `bhawnamanglapm.github.io` | `https://bhawnamanglapm.github.io` | `""` |
| Current project site | `https://bhawnamanglapm.github.io` | `/pehchanthetraveller19.github.io` |

### Moving to a custom domain

Set **one** field in `src/content/site.json` and rebuild:

```json
"customDomain": "pehchan.travel"
```

That overrides `origin` and `basePath`, re-points canonicals, Open Graph, JSON-LD,
the sitemap and the feed at the domain, drops the subpath from every internal
URL, and emits the `CNAME` file GitHub Pages reads. Clearing it back to `null`
removes `CNAME` and restores the subpath — a stale `CNAME` is worse than none,
because Pages keeps serving a domain that no longer resolves.

**Order matters. Configure DNS first, then set the field.** Setting it before DNS
resolves makes the live site unreachable, because Pages stops answering on the
`github.io` URL.

**DNS records** (confirm against GitHub's current documentation before relying on
these — the addresses are long-standing but GitHub is the authority):

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `bhawnamanglapm.github.io.` |

Then: repo **Settings → Pages → Custom domain**, enter the domain, wait for the
DNS check to pass, and tick **Enforce HTTPS** once the certificate is issued
(usually minutes, occasionally up to 24 hours).

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
