# 26 · How we implement it: one plan across docs 01–25

**Written:** 14 Nov 2026.
**For:** the owner, the PM, the developer and the designer.
**What it does:** reads all 25 docs, says which still apply, and sets one order of work, with money first.

---

## 1. The short answer

Pehchan earns from **its own documentary trips first**, then from **booking links**, then from **hotels and
paid tiers**. Each one only works once the step before it exists. So the order is:

1. **This week (owner, no code):** close decisions D1–D7, open Instagram, and pick the candidate places.
   Income line 2 depends on the account's age, so the clock starts now.
2. **Weeks 1–2 (developer, small PRs in this repo):**
   - Switch on analytics and the forms, which are both null today.
   - Fix the About page and site search.
   - The live site then measures and captures people before anything new is sent to it.
3. **Phase 0 (owner, sheet and WhatsApp, no code):**
   - Score the places and check the stays.
   - Hold 20 creator and stay talks.
   - Take the trip and keep the real Trip Balance.
   - Decide whether to build, against a pass mark set in advance.
4. **Phase 1 (trip app, only if 0.07 says build):**
   - The separate app on its own subdomain, with one destination pack and booking links.
   - The nav link in this repo switches on at launch.
5. **Phases 2–3:** more destinations, live data, the partner tracker, Hindi, then accounts, AI and Razorpay.
6. **Parked until there's traffic or spare hours:** the radar page (22), the Problem Lab (24), the global and Q&A
   ideas (23), and the app stores (09).

Everything in step 4 onward already has a task file in [25-trip-that-pays/tasks/](../25-trip-that-pays/tasks/README.md).
This plan doesn't repeat those. It decides what comes before and around them.

---

## 2. Where each doc stands

| Doc | Status | What we take from it now |
|---|---|---|
| [01](../01-brand-and-architecture.md) Brand and architecture | **Partly live** | The static site's structure still holds. The brand line is replaced by D1 |
| [02](../02-journeys-monetization-conversion.md) Journeys and money | Superseded | By 25 §11, the six income lines |
| [03](../03-seo-and-roadmap.md) SEO and roadmap | **SEO still applies** | SEO rules carry into the trip app (task 1.02). The roadmap is superseded |
| [04](../04-content-verification.md) Content verification | **Applies** | "Signed off one by one" became the source-and-date rule in every destination pack (1.36) |
| [05](../05-who-decides-what.md) Who decides what | **Applies** | The owner/builder split. The tasks README roles follow it |
| [06](../06-real-footprint-and-positioning.md) Real footprint | Input | The places the owner has visited feed 0a's "+1 for visited" and D3 |
| [07](../07-outreach-priority.md) Outreach priority | **Mostly back in force** | "Does this make a partner say yes?" is the test 25 uses for stays and tourism boards |
| [08](../08-cross-border-platform-strategy.md) Cross-border | Superseded | By 10, then by 25. The five corridor destinations survive in 2.12 |
| [09](../09-app-store-strategy.md) App stores | **Parked** | The trip app is a web app first. Revisit after phase 2 |
| [10](../10-product-spec.md) / [11](../11-traveller-generated-reality.md) Product spec, reports | Background | The "document a parent reads" idea becomes the stage 1 safety pack. Live trip reports stay on the main site |
| [12](../12-story-verification-and-security.md) Story verification | **Applies to the live site** | Governs the trip-report form once it's connected |
| [13](../13-voice.md) Voice | Background | Only the built part stays. Nothing new |
| [14](../14-free-backend.md) Free backend | **Applies, step 2** | Google Forms are how the live site captures people. The `actionUrl`s are still null |
| [15](../15-product-lifecycle.md) Lifecycle | **The register** | Launch 🔴, Measure 🔴, Ops 🔴. Steps 2 and 7 of this plan close those |
| [16](../16-survey-findings.md)–[19](../19-segment-surveys.md) Survey, market, stage 3 | Background | 17's warning still holds: **don't become a tour operator.** 25 never holds money, so it complies. The survey (n=3) is replaced by the 20 talks in 0.05 |
| [20](../20-reality-check.md) Reality Check | Background | Its "what Instagram doesn't tell you" angle suits the documentary's content, not a separate build |
| [21](../21-research-prompt.md) Research prompt | Done | Used. Nothing to build |
| [22](../22-radar-integration/README.md) Radar page | **Parked** | A portfolio page for the radar. It earns nothing for Pehchan. One part is worth taking now: D-8, the dead search links (step 2) |
| [23](../23-global-strategy/README.md) Global strategy | Background | The honesty rules and the radar gate apply. "Ask, humans answer" is not being built |
| [24](../24-problem-lab/README.md) Problem Lab | **Parked, re-aimed** | Its customer is now the documentary traveller (25 §17). Start it after phase 0 |
| [25](../25-trip-that-pays/README.md) Trip that pays | **The plan** | 70+ tasks, phases 0–3, decisions D1–D7 |

---

## 3. Who pays, and when the money starts

The source is 25 §11. Rates are the sourced ones there. Nothing here is a forecast.

| Income line | Starts | What has to exist first | Who makes it happen |
|---|---|---|---|
| 2 · Own documentary trips | **Phase 0, the test trip** | The Instagram account (0.02) and the trip (0.06) | Owner |
| 1 · Booking commission (Agoda about 4–7%, GetYourGuide about 8%, Klook 5–6.5%) | Phase 1 launch | Affiliate sign-ups (1.16), the first destination pack (1.36), the app live | Owner signs up, developer builds |
| 4 · "Open to creator stays" listings | About 20 checked stays in a destination | The 0.04 stays and footage to show them | Owner and PM pitch (2.13) |
| 5 · Sponsored destination guides | Once there's traffic | Analytics proving traffic (step 2 and 1.19) | Owner pitches (2.14) |
| 3 · Paid Creator tier | Phase 3 (price tested in phase 2) | Accounts, Razorpay, AI (3.03–3.06) | Developer |
| 6 · Pre-selling Pehchan's own film | Phase 3 | Razorpay and a film with an audience | Owner |

**What this means for the order:** the first rupee comes from the owner's trip and the Instagram account, not
from code. Every week Instagram starts late pushes back barter eligibility. TripGyani asks for a one-year-old
account with 5k+ followers, per earlier research quoted in 25 §16. So step 1 matters more than any build step.

---

## 4. The order of work

### Step 1 · This week: owner decisions (no code)

| # | Do | Task |
|---|---|---|
| 1 | Answer D1–D7, or say "go with the defaults" for D1, D2, D6 and D7 | [0.01](../25-trip-that-pays/tasks/0.01-decisions.md) |
| 2 | Open Pehchan's Instagram account if it doesn't exist. Put the live site in the bio | [4.04](../25-trip-that-pays/tasks/4.04-instagram-account.md) (was 0.02) |
| 3 | Write down 3–5 real candidate places (D3) and the pass mark (D4) **before** any talks | 0.01 |
| 4 | Decide the parked items in §6 below. "Park all" is a valid answer | — |

### Step 2 · Weeks 1–2: make the live site measure and capture (this repo, Sonnet)

This is small, separate PRs. Each one is independent. None adds a page.

| PR | What | Why now | Source |
|---|---|---|---|
| 2a | **Analytics.** Set `analytics.provider` in `site.json`. GA4 is free; the config already has a slot for it. Plausible's hosted plan is paid, so it needs the owner's OK | Stage 10 is "blind": zero visitors ever measured. Sponsored guides (line 5) need traffic numbers | 15, D7 |
| 2b | **Forms.** Create the newsletter and trip-report Google Forms, then set their `actionUrl`s | The site captures nobody today. The newsletter list is the audience the trip app launches to | 14 |
| 2c | **About page.** Replace "a global travel discovery platform… eight regions" with the D1 line | Hotels and boards pitched in 0.05 will open it. It currently describes a different business | 22 D-6, D1 |
| 2d | **Site search.** Remove or repoint the dead `/plan/` and `/deals/` entries (`src/build.mjs:221-222`), and add a check | Two broken results on a live site | 22 D-8 |
| 2e | **Destinations:** leave all 26 as draft. Publish only the place picked in 0.03, after the trip, with a link to the worked example | 26 empty guides help no one. One real, visited one is the proof | 15 |

**What step 2 doesn't include:** the nav link to the trip app (1.20). It ships at launch, not before. A link to an
app that doesn't exist yet is a dead end.

### Step 3 · Phase 0: the test trip (owner, no code)

Run [0.03 → 0.07](../25-trip-that-pays/tasks/README.md) exactly as written. Two things to watch:

- **Time the stay checks (0.04).** That number sets how fast destinations can grow (1.36, 2.12). Don't guess it.
- **0.07 is a real gate.** If the pass mark isn't met, the trip app isn't built. The live site, the Instagram account
  and the trip's content still earn through line 2. Nothing in steps 1–2 is wasted either way.

**What the developer and designer do during phase 0:** the phase 1 tasks that don't depend on the trip's results,
so building can start the day 0.07 says yes.
- Repo, hosting and CMS setup: 1.01, 1.04, 1.05.
- The shell and design system: 1.22.
- The Strapi collections: 1.08–1.11.

These are low-regret: they're needed whatever the destination. **The owner confirms this before any work starts,**
because it spends builder hours before the gate (D5).

### Step 4 · Phase 1: the trip app

Follow the [tasks README](../25-trip-that-pays/tasks/README.md):

- **Critical path:** 1.01 → 1.05 → 1.08–1.11 → 1.13 → 1.22 → 1.23 → 1.24 → 1.26 → 1.27–1.29 → 1.30 → 1.31 → 1.32 → 1.40.
- **Start early:** begin the first destination pack (1.36) and the legal reviews (1.34) as soon as their
  dependencies allow. They take calendar time, not code time.

**Launch day:**
1. Switch on the nav link in this repo (1.20).
2. Update the Instagram bio.
3. Post the worked example (1.37).

### Step 5 · Phases 2–3

As in the tasks folder.

**The order inside phase 2 is money first:**
1. More destination packs (2.12), because each adds booking commission.
2. Creator-stay listings (2.13).
3. The Creator tier price test (2.11).
4. Then live data and Hindi.

### Step 6 · After phase 0: re-open the parked work

- **Problem Lab (24):** start once there's a real traveller to score problems for. It feeds stage content.
- **Radar:** only its stage 2 alerts in phase 3 (3.08). The portfolio page (22) is the owner's call. It's separate
  from Pehchan's revenue.

---

## 5. Things to check before they bite

These are not settled by any doc. Each one names who checks it.

| Check | Why | Who |
|---|---|---|
| **Vercel plan for a site with booking links** | The trip app is planned on Vercel. Vercel's free Hobby plan is described as non-commercial. I haven't checked whether affiliate links count, and Pro is paid. If they do count, it's a paid dependency and needs the owner's OK. Check before 1.01 | Developer, owner approves |
| India basics for the launch pack | 25 §1 says "one destination plus basics for India", but nowhere lists them (1.36) | PM with owner |
| Tax wording on free stays | 25 §12. The old Section 194R and the new Income-tax Act differ | CA, before launch (1.34) |
| Consent text and terms | 25 §12 | Lawyer, before launch (1.34) |
| Insurance, eSIM and forex commission rates | Not sourced yet. They aren't shown until they are | PM, before phase 2 |
| Entity, GST and legal review | 15 marks Ops 🔴. Commission income needs an entity to be paid into. Thresholds are in 15 §Constraints; **confirm with a CA** | Owner and CA, before the first affiliate payout |

---

## 6. Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| D1–D7 | The trip app's blocking decisions ([0.01](../25-trip-that-pays/tasks/0.01-decisions.md)) | Defaults for D1, D2, D6 and D7. D3, D4 and D5 need your answer |
| P1 | Step 2's five small PRs to this repo | **Yes, now.** They're small and make the site measure and capture before launch |
| P2 | Let the builder start the low-regret phase 1 setup during phase 0 | **Yes**, if D5 gives them hours. Otherwise wait for 0.07 |
| P3 | Radar page (22) | **Park.** It's a career portfolio piece, not Pehchan revenue. Do it only if you want it for that reason |
| P4 | Problem Lab (24) | **Park until after phase 0.** Then confirm L-1, its customer |
| P5 | The 26 draft destinations on the main site | **Leave as draft.** Publish only visited places, starting with the phase 0 place |
| P6 | App stores (09) | **Park** until the trip app has users |

---

## 7. Model guidance

| Work | Model |
|---|---|
| This plan, decisions, architecture (1.01, 1.05) | Opus |
| Step 2 PRs, phase 1–3 building | Sonnet |
| Entering destination packs, bulk content | Haiku |
