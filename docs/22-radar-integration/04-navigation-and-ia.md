# 04 — Navigation and information architecture

This assumes the recommendations D-1 = B (a panel), D-2 = A (by the founder) and D-3 = "Radar" at `/radar/`.

---

## Where the radar appears

| Place | What appears | Why |
|---|---|---|
| **Desktop nav** | A fifth, last item, `Radar`, which opens a mega panel | The ask. Every page |
| **Mobile drawer** | A `Radar` `<details>` group, last among the groups | The same model as desktop: `navModel()` drives both |
| **Footer** | A "Radar" link in the **Company** column, plus "Travel Problem Radar ↗" | A second way in, read by people who scroll |
| **About page** | One paragraph in "The founder", linking to `/radar/` | It's where people check who is behind a site. Depends on D-6 |
| **`/radar/`** | The case study | — |
| Search | The page in `assets/search-index.json` | It comes from the route table, but check it (`05`) |
| Sitemap | `/radar/` | Automatic from the route table |
| **Not** on: home, Profile, Destinations, Safety, Real Trips, the trip document | — | G4: keep the radar off the traveller's path |

## Desktop mega panel

The panel copies the structure of the other four, so `navModel()` keeps one shape.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PEHCHAN            Profile  Destinations  Real Trips  Safety  [Radar]  🔍 ◐  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FOR PEOPLE WHO BUILD              HOW IT WAS BUILT                          │
│  TRAVEL PRODUCTS                                                             │
│  Open Travel Problem Radar ↗       The case study                            │
│  Try the demo, no sign-in ↗        Full record on GitHub ↗                   │
│  This week's trends ↗                                                        │
│                                                     [ Read the case study ]  │
└──────────────────────────────────────────────────────────────────────────────┘
```

- The ghost button bottom right normally reads `All {label}` and links to `item.href`. "All radar" doesn't read
  well, so the item gets an `allLabel` override: **"Read the case study"** → `/radar/`.
- External links get a visible ↗ and screen-reader text: `<span class="sr-only">(opens radar.pehchanthetraveller.com)</span>`.
- **They open in the same tab.** The site doesn't open new tabs from nav links, and Back works. The footer's social
  links use `target="_blank"` because those are other people's sites. The radar is ours.
- `rel="noopener"` on external links regardless.
- `data-track` attributes are listed in `05`.

## Mobile drawer (375px)

```
┌───────────────────────────────┐
│ PEHCHAN                 🔍 ☰ │
├───────────────────────────────┤
│ ▸ Profile                     │
│ ▸ Destinations                │
│ ▸ Real Trips                  │
│ ▸ Safety                      │
│ ▾ Radar                       │
│    Read the case study        │  ← the allLabel override, not "All radar"
│    Open Travel Problem Radar ↗│
│    Try the demo, no sign-in ↗ │
│    This week's trends ↗       │
│    Full record on GitHub ↗    │
│ ───────────────────────────── │
│ Report something              │
│ Women & Travel                │
│ Partner With Us               │
│ About                         │
│ [      Can I do this?       ] │
└───────────────────────────────┘
```

On mobile, the column titles disappear (`flatMap`). The audience line "For people who build travel products" would
be lost, so add it as the first line in the group: a non-link `<li class="drawer__note">`. That's a small change to
the drawer render.

## Nav width check

Five labels: Profile · Destinations · Real Trips · Safety · Radar. "Radar" is 5 characters, the shortest. Check at
the desktop breakpoint where the nav first appears, with the "Can I do this?" CTA showing, that nothing wraps. If it
does, the fallback is to drop the nav gap a step rather than shorten any label.

## Footer

Under **Company**, after Partner With Us:

```
Company
  About
  Women & Travel
  Partner With Us
  Travel Problem Radar        → /radar/
  Contact
```

One link to the page, not to the subdomain. The page leads to the product.

## About page (if D-6 approves it)

Add to "The founder" section after it's rewritten for the current positioning:

> *Bhawna also builds products for the people who build travel. [Travel Problem Radar](/radar/) finds
> travel-industry problems every day and turns each one into a product idea.*

**Don't** add this to the current About text. That text describes a global discovery platform that no longer
exists, and adding to it would make the contradiction worse. Rewrite first, or leave About alone.

## The way back from the radar (radar repo, separate decision D-7)

Recommended for the radar's footer:

```
Travel Problem Radar · by Bhawna Mangla, who also runs Pehchan ↗
```

linking to `https://www.pehchanthetraveller.com/radar/`. The relationship is then stated the same way on both sites,
and the case study gets a link from the product it describes.

## URL map

| URL | Host | Owner |
|---|---|---|
| `/radar/` | pehchanthetraveller.com | This repo: the case-study summary |
| `/` | radar.pehchanthetraveller.com | Radar repo: product home and sign-up |
| `/demo/` | radar.pehchanthetraveller.com | Radar repo: sample replay, public |
| `/trends/` | radar.pehchanthetraveller.com | Radar repo: counts, public |
| `/live/` | radar.pehchanthetraveller.com | Radar repo: Pro only. **Don't link it from Pehchan.** It shows a sign-in wall to everyone else |
| `pm/CASE_STUDY.md` | github.com | Radar repo: the full record |

Use the `radar.pehchanthetraveller.com/demo/` form for the demo, not the `bhawnamanglapm.github.io/...` one. The
GitHub Pages copy redirects to the Vercel host anyway (the script at the top of the radar's pages), and one host is
easier to maintain.
