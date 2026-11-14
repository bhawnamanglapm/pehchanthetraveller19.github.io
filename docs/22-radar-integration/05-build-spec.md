# 05 — Build spec

For whoever implements this, probably a Sonnet session once the plan is approved. It assumes D-1 = B, D-2 = A and
D-3 = `/radar/`. Every file path and helper named here was checked against the repo on 7 Nov 2026.

---

## Files

| File | Change |
|---|---|
| `src/content/radar.json` | **New.** Every figure, link and date the page shows. The single place to refresh |
| `src/lib/graph.mjs` | Load `radar.json` the way `trip-reports.json` is loaded (`read(...)`, line 29) and validate it (below) |
| `src/templates/pages.mjs` | **New** `radarPage(g)`, built from the existing `pageHero`, `crumbs`, `figure`, `atAGlance` and `nextSteps` |
| `src/build.mjs` | Add `radarPage(g)` to the route table after `aboutPage(g)`. Add an OG card `addOg("radar", …)`, because `ogArt: "radar"` otherwise points at a missing SVG. Add a search-index entry, because the index is built by hand and not from routes |
| `src/lib/shell.mjs` | Add the nav item, support for external links, the `allLabel` override, the drawer note, and the footer link |
| `assets/css/main.css` | Styles for the external-link mark and `.drawer__note`, plus anything the decision cards and category grid need that the existing card styles don't cover |
| `assets/radar/demo-board.png` | Copied from the radar repo's `docs/demo-board.png`, which is MIT and the owner's own work. Long edge 1,600px or less, under 300KB |
| `README.md` | One line under the docs list pointing to `docs/22-radar-integration/` |

No new dependencies, no runtime fetch, no third-party script.

## `src/content/radar.json`

```json
{
  "asOf": "2026-11-07",
  "sourceRepo": "https://github.com/bhawnamanglapm/travel-problem-radar-case-study",
  "sourceCommit": "4a44f8c",
  "links": {
    "product":   "https://radar.pehchanthetraveller.com/",
    "demo":      "https://radar.pehchanthetraveller.com/demo/",
    "trends":    "https://radar.pehchanthetraveller.com/trends/",
    "pricing":   "https://radar.pehchanthetraveller.com/pricing/",
    "caseStudy": "https://github.com/bhawnamanglapm/travel-problem-radar-case-study/blob/main/pm/CASE_STUDY.md",
    "readme":    "https://github.com/bhawnamanglapm/travel-problem-radar-case-study#readme"
  },
  "facts": {
    "firstBuilt": "July 2026",
    "paymentsLive": "28 Oct 2026",
    "price": "₹1 a month or ₹1 a year",
    "tests": 1748, "checks": 259, "testsAsOf": "2026-11-04",
    "costPerSweep": "$0.1121 (Haiku, mean of 10 sweeps)",
    "monthlyCost": "about ₹6,797",
    "breakEven299": "24 members (28 with GST inside the price)",
    "livePayments": "3 payments of ₹1 by 29 Oct 2026",
    "openBugs": "BUG-002 (S1) open at 31 Oct 2026"
  },
  "stages": [
    { "name": "Discover", "did": "…", "href": "…/pm/01-discovery/discovery-log.md" }
  ],
  "role": null
}
```

**Re-pull every value on launch day.** The values above are what the repo said on 7 Nov. `role` stays `null` until
O-1 is answered.

### Validation in `graph.mjs`

The build already fails rather than publish a defect. Extend that:

- **Fail** if any `links.*` isn't `https://`.
- **Fail** if `role` is `null` while the page is in the route table. That stops a case study going live without the
  authorship line. The alternative is to render section 13 only when `role` is set. **Pick one in review:
  failing is safer, rendering conditionally is more flexible.**
- **Warn, don't fail**, if `asOf` is more than 45 days old: `radar.json is 52 days old: re-pull figures from the
  radar repo`. Fresh figures matter, but they shouldn't block an unrelated fix.

## `src/lib/shell.mjs`

### `navModel()`: the fifth item

```js
{ label: "Radar", href: "/radar/", allLabel: "Read the case study", note: "For people who build travel products",
  columns: [
    { title: "For people who build travel products", links: [
      { label: "Open Travel Problem Radar", href: radar.links.product, external: true, track: "nav_radar_open" },
      { label: "Try the demo, no sign-in", href: radar.links.demo, external: true, track: "nav_radar_demo" },
      { label: "This week's trends",       href: radar.links.trends, external: true, track: "nav_radar_trends" }
    ]},
    { title: "How it was built", links: [
      { label: "The case study",         href: "/radar/" },
      { label: "Full record on GitHub",  href: radar.links.caseStudy, external: true }
    ]}
  ]}
```

### Render changes

1. **One link renderer** used by the mega panel and the drawer. For `external: true`, add `rel="noopener"`, a ↗
   mark (`aria-hidden="true"`), and `<span class="visually-hidden">(opens {host})</span>`. The class
   `.visually-hidden` already exists in `main.css`. Add `data-track` when `track` is set.
2. **`allLabel`**: use `item.allLabel ?? \`All ${item.label.toLowerCase()}\`` in both the mega panel and the
   drawer.
3. **`note`**: in the drawer, render `<li class="drawer__note">{note}</li>` as the first line of the group.
4. **Footer**: add `{ label: "Travel Problem Radar", href: "/radar/" }` to **Company**, before Contact.

The broken-link check only matches `href="/…"`, so external hrefs pass untouched. The orphan check is satisfied
because the nav and footer link to `/radar/`.

## `radarPage(g)` in `pages.mjs`

Sections and copy as in `03`. The page object:

```js
return {
  url: "/radar/", template: "radar",
  title: "Travel Problem Radar — A Product Case Study | Pehchan",
  description: "An AI model with web search finds travel-industry problems daily and turns each into a product idea. How it was framed, built, priced and tested.",
  body, ogArt: "radar",
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Radar", href: "/radar/" }],
  schema: {
    "@type": "WebPage", name: "Travel Problem Radar — case study", url: g.site.siteUrl + "/radar/",
    about: { "@type": "SoftwareApplication", name: "Travel Problem Radar", url: radar.links.product,
             applicationCategory: "BusinessApplication", operatingSystem: "Web" }
  }
};
```

**No `offers`, `aggregateRating` or `review`.** The site rule is in the main README under *Honesty constraints*, and
the price changes too often for schema anyway.

Use `nextSteps()` for the closing CTAs. It emits `data-track="next_step"` with a label, so those clicks are already
counted.

## Search index entry (`build.mjs`, around line 210)

```js
{ t: "collection", u: "/radar/", n: "Travel Problem Radar",
  d: "A case study: an AI radar for travel-industry problems, each turned into a product idea.",
  k: "radar case study product manager ai travel industry problems builders" }
```

**Found while planning, and worth fixing in the same PR:** the index still lists `/plan/` and `/deals/`, both
removed on 26 Sep 2026. Site search sends people to two 404s. Remove both entries, and extend the broken-link check
to cover `index[].u`, so this can't happen again.

## Analytics events

The provider is `null` today, so nothing is sent. Name the events now anyway, so the first day of data is usable.

| Event | Where | Fired by |
|---|---|---|
| `nav_open` with `{ item: "Radar" }` | Opening the mega panel | Check whether `site.js` already tracks panel opens. If not, add it **for all five items**, or there's no baseline to compare against |
| `nav_radar_open` / `_demo` / `_trends` | Panel links | `data-track` |
| `radar_cta_open` / `radar_cta_demo` | Hero buttons | `data-track` |
| `next_step` with a label | Closing CTAs | Already built in `nextSteps()` |
| `outbound_click` with `{ host }` | Every external link | Already built in `analytics.js` |

**UTM parameters: not by default.** Only add `?utm_source=pehchan&utm_medium=nav|case_study` if the radar records
them at sign-up (O-8). Otherwise they only clutter the URLs.

## Test plan

| # | Check | How |
|---|---|---|
| 1 | The build passes all its integrity checks | `node src/build.mjs` |
| 2 | Document tests still pass | `node src/test-document.mjs` (34) |
| 3 | `/radar/` title is 75 characters or fewer, description 165 or fewer | The build enforces it |
| 4 | The page renders in light and dark mode, at 375px and 1280px, with no horizontal scroll | Browser |
| 5 | The mega panel opens with mouse and keyboard (Tab, Enter, Esc), and focus is visible on every link | Browser |
| 6 | The drawer shows the Radar group with its note, and "Read the case study" instead of "All radar" | Browser at 375px |
| 7 | All five nav labels fit on one line at the first desktop breakpoint, with the CTA showing | Browser |
| 8 | Every external link returns 200 | `curl -sIL` on each `links.*` |
| 9 | A screen reader announces "(opens radar.pehchanthetraveller.com)" on external links | Read the accessibility tree |
| 10 | Search for "radar" finds the page, and nothing in the index 404s | `/search/`, plus the extended check |
| 11 | `asOf` older than 45 days prints the warning | Set a past date temporarily |
| 12 | `role: null` behaves as decided (fails the build or hides section 13) | Set it temporarily |
| 13 | The OG card exists at `assets/og/radar.svg` | `ls` |
| 14 | The service worker version changes, so returning visitors get the new nav | `sw.js` fingerprint diff |

## Commits

One branch and one PR, as small commits:

1. `Add the radar content model and its build checks` (radar.json, graph.mjs)
2. `Add the Travel Problem Radar case study page` (pages.mjs, build.mjs route, OG, image)
3. `Put the radar in the nav, the drawer and the footer` (shell.mjs, css)
4. `Stop site search linking to two deleted pages` (search index, extended check)
5. Rebuild output (the generated HTML is committed, per the README)
