# 01 — Context and audit

Read on 7 Nov 2026 from the radar repo (`main` at `4a44f8c`, 4 Nov 2026), the live radar site, and this repo.
Everything below is sourced. Where something couldn't be checked, it says so.

---

## What Travel Problem Radar is

**Sources:** radar `README.md`, `pm/CASE_STUDY.md`, `CHANGELOG.md`, `plan.json`, and the live `/about/` and
`/legal/terms/` pages.

| | |
|---|---|
| **What it does** | Up to five times a day, a server job asks Claude with web search for recent travel-industry problems in four categories. It keeps up to 5 per category plus up to 2 from India. Each item gets a source link, a severity and a one-line product opportunity. Sources over 60 days old are dropped, and new items are flagged |
| **The four categories** | Traveler pain (booking, airlines, hotels, refunds, loyalty, service failures) · Government and policy (visa rules, entry requirements, bans, tourist taxes) · Websites and apps (outages, bugs, broken flows, security issues) · Industry (strikes, bankruptcies, capacity cuts, overtourism, pricing shocks) |
| **Who it is for** | "A product manager looking for problems worth solving, starting with the owner" (README) |
| **History** | First built July 2026 as an artifact in Claude's app, posting a digest to Slack. The demo, live page and tests were added in Oct 2026 with Claude Code. It moved from `travel-problem-radar.vercel.app` to `radar.pehchanthetraveller.com` on 28 Oct 2026 |
| **Model** | Haiku 5.5 by default since 25 Oct 2026 |
| **Plans** | Free: one daily email of counts and headlines. Pro: the live board and 1 to 5 emails a day, for chosen categories and areas. **₹1 a month or ₹1 a year**, no GST, through Razorpay since 28 Oct 2026 |
| **Open to the public** | Home `/`, demo `/demo/` (replays a saved July 2026 sample, makes no AI calls), Trends `/trends/` (counts only, free), `/about/`, `/pricing/`, legal pages |
| **Behind the paywall** | The live board `/live/`, Pro only since 23 Oct 2026 |
| **Who runs it** | Terms: "run by Bhawna". Contact: `pehchanthetraveller19@gmail.com` |
| **Stack** | React, Claude with web search, Vercel Functions, Cron and Blob, GitHub Actions, Resend, Razorpay, Google sign-in, GitHub Pages, esbuild |
| **License** | MIT |

### What the radar has evidence for, and what it doesn't

From `pm/CASE_STUDY.md` (updated 31 Oct) and `CHANGELOG.md` (4 Nov):

| Has | Doesn't have |
|---|---|
| A live product taking payments | **User research.** The interview plan is written and was never run |
| 3 live ₹1 payments by 29 Oct 2026 | **Any finding scored by a person.** The rubric and `score-items.mjs` exist and haven't been run |
| A measured cost of **$0.1121 a sweep** on Haiku, over 10 sweeps | Revenue, conversion or retention data |
| A cost floor of **about ₹6,797 a month**, which 24 members at ₹299 would cover (28 if GST is inside the price) | A price that covers cost. At ₹1, no number of members does. The target price is open |
| Link provenance: 1 of 190 items carried a link that search never returned (26 to 30 Oct) | A check that the source supports the summary |
| A median source age of 8.5 days on the 18 dated sources | A signed-off test run. BUG-002 (S1) was open on 31 Oct |
| A full PM lifecycle: 38 documents across 8 stages | Answers to three *OWNER INPUT NEEDED* blocks in the README |
| An offline test suite on every push | **A stable test count.** It was 1,582 in the README (30 Oct), 1,719 in the case study (31 Oct) and 1,748 in the changelog (4 Nov) |

**What follows for the page:** its strongest asset is its honesty. The radar repo names what isn't proven,
and Pehchan's editorial standards ask for the same. The page should lead with that rather than smooth it over.

### Problems found on the radar side

These belong to the radar repo, not this one. Each needs a separate decision.

1. **The radar doesn't link back.** Its footer links to `bhawnamanglapm.github.io`, not to pehchanthetraveller.com.
2. **The contact emails differ.** Radar: `pehchanthetraveller19@gmail.com`. Pehchan: `pehchanthetraveller@gmail.com`.
3. **The refund wording may be inconsistent.** `plan.json` says "within 7 days of your first payment" and also sets
   `"refundDays": 14`. The two fields may mean different things. It needs checking before Pehchan's nav sends people
   to the pricing page.
4. **The radar README still has three *OWNER INPUT NEEDED* blocks**: did anyone else use it, did an item become real
   work, and the authorship line.

---

## What this site is today

**Sources:** `src/content/site.json`, `src/lib/shell.mjs`, `docs/15-product-lifecycle.md`.

- **Positioning.** "Solo travel for Indian women, and the plan that gets your family to yes."
- **Nav.** Four items, each a button that opens a mega panel: Profile · Destinations · Real Trips · Safety. The
  mobile drawer adds flat links to Report something, Women & Travel, Partner With Us and About.
- **Footer.** Six columns. "Company" holds About, Women & Travel, Partner With Us and Contact.
- **Traffic.** Unknown. `analytics.provider` is `null`, and Stage 9 (Launch) is "not started: nothing points at it".
- **Build guarantees.** Builds fail on a dangling reference, a duplicate route, a title over 75 characters, a
  description over 165, an orphan page, or a broken internal link. External `https://` links aren't checked.
- **Service worker.** It ignores other origins (`sw.js`, line 43), so links to the radar's subdomain aren't affected.
- **Analytics.** `assets/js/analytics.js` already sends `outbound_click` with the host for every external link,
  once a provider is configured.

### Problems found on this side that the integration exposes

1. **The About page describes a product that no longer exists.** `aboutPage()` calls Pehchan "a global travel
   discovery platform" covering "eight regions", and describes the founder as "a travel curator and digital travel
   creator". A case study that presents the same person as a product owner who builds with AI will contradict it.
   That needs fixing whatever is decided here (see `07`, D-6).
2. **The README is also stale.** This was flagged in the earlier status check.
3. **There is nothing to measure with.** Without analytics, nobody will know whether the nav link earns its place
   (see `06`).

---

## What this means for the plan

| Finding | What the plan does about it |
|---|---|
| Different audiences | The nav item opens a panel that says who the radar is for. The page opens with a one-line note that sends trip-planners back |
| Figures change weekly | All figures go in `src/content/radar.json` with `asOf` and `sourceCommit`. The build warns when they go stale |
| The repo is long and thorough | The page summarises and links into it. Nothing is duplicated |
| Gaps are stated openly | The page has a "what isn't proven yet" section |
| The relationship between the two brands is legally unclear | The page uses "by the founder of Pehchan" wording, not "a Pehchan product", until the owner decides (D-2) |
| No analytics | Connecting analytics goes on the launch checklist (one config line, `docs/15`) |
