# SEO Architecture, Design System & MVP Roadmap

> Planning artifact 3 of 3.

---

## 1. SEO architecture

**Topical authority through clusters, not volume.** Each destination is a hub;
its hotels, experiences, itineraries and stories are spokes; every spoke links
back to the hub and laterally to siblings. Collections are curated cross-links
between clusters. The rule the brief demands is enforced editorially: *no
thousands of thin programmatic pages.* Every URL that exists answers a question a
traveller actually asks, or it does not get generated.

**Technical foundation** (all emitted by the build):

- Clean, stable, lowercase, trailing-slash URLs that mirror the hierarchy
- Per-page `<title>` (≤60 chars) and meta description (≤158 chars), authored not templated-generic
- Canonical URL on every page
- Open Graph + Twitter card, with a generated per-page share image
- JSON-LD: `Organization` + `WebSite` (with `SearchAction`) site-wide;
  `BreadcrumbList` on every nested page; `TouristDestination`, `Hotel`,
  `TouristAttraction`, `Trip`/`ItemList`, `Article`, `FAQPage`, `WebApplication`
  where genuinely applicable
- **No `Review`/`AggregateRating` schema** — we hold no first-party review data,
  so emitting it would be fabrication. The seam exists for when it is earned.
- `sitemap.xml` (generated from the route table), `robots.txt`, `.nojekyll`
- Visible breadcrumbs that match the breadcrumb schema
- Internal links: every page carries hub, sibling and next-step links; orphan
  pages fail the build
- Semantic landmarks, one `h1`, skip link, focus states, `prefers-reduced-motion`
- 404 page that routes back into discovery

**International SEO.** URLs are locale-agnostic (`/destinations/asia/india/kerala/`)
with `hreflang` self-reference emitted today and a `locales` array in
`site.json` ready to switch on `/{locale}/` prefixes. Currency is a display-layer
concern (`assets/js/currency.js`) — never baked into content or URLs.

**Target query shapes.** `{destination} travel guide`, `best time to visit
{destination}`, `where to stay in {destination}`, `{n} day {country} itinerary`,
`{style} hotels in {destination}`, `things to do in {destination}`.

---

## 2. Responsive design system

**Aesthetic:** luxury travel magazine × modern marketplace. Editorial grid,
generous whitespace, hairline rules, large display serif against a quiet sans,
restrained motion.

**Tokens** (`assets/css/tokens.css`): an ink/paper palette with a deep jade
accent and bronze commerce colour; a modular type scale on `clamp()`; an 8px
space scale; three radii; two shadows. Full dark-mode token set, driven by
`prefers-color-scheme` and an explicit toggle.

**Typography.** Display: a system old-style serif stack. UI: the system sans
stack. Zero webfont requests — the fastest possible first render and no FOUT.

**Responsive.** Mobile-first, fluid type and space, `min()`/`clamp()` layout,
container-aware grids, no horizontal scroll at any width, 44px minimum touch
targets.

**Performance budget.** No framework, no webfonts, no third-party scripts by
default. CSS ≈ 30KB, JS shipped as small deferred ES modules loaded per page
need. All imagery is inline SVG or lazy-loaded with explicit dimensions, so CLS
is structurally ~0. Maps are click-to-load.

**Accessibility.** WCAG 2.2 AA contrast, visible focus rings, keyboard-operable
nav/search/planner, `aria-live` on generated results, reduced-motion honoured,
real labels on every input.

---

## 3. Roadmap

**MVP — built in this repository**
Homepage · destinations (8 regions → countries → guides) · travel guides ·
hotels · experiences · curated journeys · travel stories · AI Trip Planner ·
collections · planning tools · deals framework · Partner With Us · About ·
newsletter capture · global search · affiliate-ready CTAs and disclosure ·
SEO foundation (schema, sitemap, robots, canonicals, breadcrumbs) · analytics
event layer · dashboard concept · full legal and trust pages.

**Phase 2**
User accounts (the local-first save store swaps to an authenticated API) ·
wishlists and saved trips synced · advanced planner with a live LLM provider ·
hotel and experience comparison tools · live deals via partner feeds ·
personalised recommendations · CMS migration of `src/content`.

**Phase 3**
Premium trip-planning service · digital products and checkout · direct hotel
partnerships and managed inventory · tourism-board campaigns · marketplace ·
mobile app · proprietary travel data (own ratings, own seasonality index).

**Explicitly deferred and why.** Authentication is absent because the MVP needs
no identity; adding it early would cost complexity and privacy surface with no
user benefit. `assets/js/account.js` already implements the exact interface an
API-backed store would expose, so Phase 2 replaces a storage adapter rather than
rewriting features.

---

## 4. The success test

> A visitor arrives thinking *"I want to travel somewhere beautiful."*

Home → *Explore Destinations* → Kerala → *Where to stay* → a hotel →
*Check Availability*; or Home → *Plan My Trip* → a generated day-by-day
itinerary with stays and experiences attached → save, share, download, click
through to book. Both paths are live in the MVP and both are instrumented.
