# Travel Problem Radar on Pehchan — integration plan

Written 7 Nov 2026. **Status: plan, awaiting the owner's decisions. Nothing is built.**

The ask: add a page about [Travel Problem Radar](https://github.com/bhawnamanglapm/travel-problem-radar-case-study)
to this site, and link the live product, https://radar.pehchanthetraveller.com/, from the navigation bar.

---

## The recommendation, in one paragraph

Add **one page, `/radar/`**: a five-minute case study that summarises the radar repo and links into it. Don't copy it.
Add **a fifth, last nav item, "Radar"**. Like the other four, it opens a panel. The panel names who the radar is for
("people who build travel products") and links to the live product, the free demo and the case study. Don't make the
nav item a bare link that leaves the site, and don't put radar findings on any consumer page. Keep every changing
figure in one data file with an "as of" date, because the radar repo's own numbers changed three times in a week.

## Why this needs a plan

The two products serve **different people**:

| | Pehchan (this site) | Travel Problem Radar |
|---|---|---|
| Who it is for | Indian women planning solo travel, and the family that has to say yes | Product managers and founders looking for travel problems worth solving |
| What they come for | Confidence to go, and a plan the family can read | A daily feed of travel-industry problems, each with a product idea |
| Brand | Pehchan tokens, "Find your identity" | Its own brand: green and amber, Inter Tight, Italiana wordmark |
| Who runs it | "Pehchan Travel Studio" in the footer, though it is not a registered entity (`docs/15`, Ops) | "run by Bhawna", per the radar's terms page |
| Money | Nothing live | Razorpay, ₹1 a month or ₹1 a year since 28 Oct 2026 |

The nav bar is the most valuable space on the site, and the nav code says so: *"Five, not thirteen. Every item leads
somewhere with something on it."* A woman planning Kedarnath who taps "Radar" and lands on a feed of airline outages
for PMs has been sent the wrong way. The plan's job is to make the link work for the people it is for, without
costing the people the site is for.

## The files

| File | What it answers |
|---|---|
| [01-context-and-audit.md](01-context-and-audit.md) | What the radar is, from its repo and live site; what this site is; what each lacks today |
| [02-strategy-and-decisions.md](02-strategy-and-decisions.md) | Goals and non-goals, who the page is for, brand relationship, nav options compared, and the recommendation |
| [03-page-content-spec.md](03-page-content-spec.md) | The `/radar/` page section by section: purpose, content, the source for every claim, draft copy, and what must not be said |
| [04-navigation-and-ia.md](04-navigation-and-ia.md) | Nav panel, mobile drawer, footer, About, search and sitemap, with mock-ups |
| [05-build-spec.md](05-build-spec.md) | Files to change, the data file, template, build checks, SEO, analytics events, test plan |
| [06-launch-and-measurement.md](06-launch-and-measurement.md) | Launch checklist, release order, metrics, the 30-day review, refreshing content, risks, later phases |
| [07-open-questions.md](07-open-questions.md) | **The decisions and inputs only the owner can give.** The build waits on these |

## What the owner needs to decide before anything is built

Full list with options: [07-open-questions.md](07-open-questions.md). The four that change the build:

1. **D-1 Nav shape.** A panel (recommended), a direct link that leaves the site, or footer only.
2. **D-2 How the two brands relate.** "By the founder of Pehchan" (recommended), "a Pehchan product", or no link stated.
3. **D-3 Label and URL.** "Radar" at `/radar/` (recommended), or "Labs" at `/labs/radar/` if a second builder tool is
   coming.
4. **O-1 Your role, in your own words.** The radar README marks the authorship line *OWNER INPUT NEEDED*. A
   case-study page can't go live with it guessed.

## Ground rules this plan holds itself to

- **Every figure on the page comes from a file in the radar repo, with its date.** No user counts, revenue,
  testimonials or outcomes that the repo doesn't record. The repo says plainly that there is no user research and no
  finding scored by a person, and the page will say the same.
- **The radar repo stays the full record.** `/radar/` summarises it and links into it.
- **Nothing on Pehchan's consumer pages shows radar output.** Those items are AI-gathered and unverified. The site's
  editorial standards don't allow that next to safety content (see `06`, later phases).
- **The build's own checks apply.** Title 75 characters or fewer, description 165 or fewer, no orphan pages, no
  broken internal links.
