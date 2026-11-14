# 03 — Content spec for `/radar/`

The page is a **five-minute case study** of about 1,200 to 1,500 words. Each section below has its purpose, what goes
in it, where each claim comes from, draft copy, and what must not be said.

**Source key** (all in `bhawnamanglapm/travel-problem-radar-case-study`):
`R` = `README.md` · `CS` = `pm/CASE_STUDY.md` · `CL` = `CHANGELOG.md` · `PJ` = `plan.json` ·
`T` = live `/legal/terms/` · `A` = live `/about/` · `DEC` = `docs/decisions.md`

**Rule:** a figure that changes over time (tests, cost, price, payments, bugs) is never written into the template.
It comes from `src/content/radar.json` and shows its `asOf` date (see `05`).

---

## Meta

| Field | Draft | Limit |
|---|---|---|
| `<title>` | `Travel Problem Radar — A Product Case Study \| Pehchan` (54) | 75 |
| Meta description | `An AI model with web search finds travel-industry problems daily and turns each into a product idea. How it was framed, built, priced and tested.` (149) | 165 |
| Breadcrumbs | Home › Radar | — |
| OG art | `radar`, generated like the others in `assets/og/` | — |

---

## 1. Hero

**Purpose:** say in five seconds what this is, that it's live, and where to go.

- Eyebrow: `Case study · Live product`
- H1: **Travel Problem Radar**
- Dek: *"An AI model with web search looks for travel-industry problems up to five times a day, and turns each one
  into a product idea a PM could build."* (R, A)
- Facts strip, from `radar.json`: `Built July 2026` · `Live at radar.pehchanthetraveller.com` · `Pro through Razorpay
  since 28 Oct 2026` · `Built with Claude` (R, CS)
- Buttons: **Open Travel Problem Radar ↗** (primary) · **Try the demo, no sign-in ↗** (secondary)

## 2. Audience note

**Purpose:** G4. Send the traveller back without slowing down the PM.

A slim callout under the hero:

> *Planning a trip? This page is about a tool for people who **build** travel products. For your own trip, start
> with the [Solo Travel Profile](/profile/).*

## 3. Screenshot

**Purpose:** show the product before explaining it.

- Image: `docs/demo-board.png` from the radar repo. It's the owner's own work under MIT, so no credit is needed under
  `assets/photos/README.md`. Resize it to a long edge of 1,600px or less and under 300KB.
- Alt: *"The radar's demo board: eight problem cards in four categories, each with a severity, a source link and a
  product opportunity."*
- Caption: *"The public demo, replaying a saved July 2026 sample. Every card has a source link and a one-line product
  opportunity."* (R)
- **Don't** caption it as live data. It's the sample.

## 4. The problem

**Purpose:** the PM reader's first question is whether the problem is real and whose it is.

Draft:

> The best product ideas in travel start as someone's bad day: a refund that never came, a visa fee that quietly
> quadrupled, a booking that vanished after payment. Those signals are spread across news wires, government notices,
> outage trackers and review sites, worldwide. No product manager has time to read all of it every day.
>
> The user is a product manager looking for travel problems worth solving, and the first one was me. The goal was a
> standing feed that finds problems, sorts them and suggests the "so what" before the morning starts, not a one-off
> research report.

Source: R ("Problem"). The "the first one was me" line restates R's "starting with the owner". **The owner should
confirm the first-person voice (O-1).**

**Must not say:** that PMs or teams use it. R: *"This repo records no user research."*

## 5. What it does

**Purpose:** the product in one screen.

- **Four categories**, as a 2×2 grid of short cards (traveler pain · government and policy · websites and apps ·
  industry), each with its examples from A.
- **One sweep, step by step:** search with Claude and web search, one call per category, in parallel → keep up to
  5 per category, plus up to 2 from India → drop sources over 60 days old → flag anything not seen before → save.
  Visitors read the saved sweep and never trigger an AI call. (CS, R)
- **Free and Pro**, as a two-column table: Free = one daily email of counts and headlines. Pro = the live board, 1 to
  5 emails a day, chosen categories and areas, at `{price}` from `radar.json`. (R, PJ)
- A "Trends" link: public counts, free (CL 31 Oct).

## 6. Where AI does the work, and where it doesn't

**Purpose:** this is the section a PM reader is most likely to value. It shows judgement about AI, not just use of
it.

| Job | Who does it | Why |
|---|---|---|
| Finding problems across news, government notices, outage trackers and travel sites | Claude with web search, one call per category | There's no fixed list of sources or keywords to write rules against |
| Summary, severity, product opportunity | Claude, in a fixed JSON shape | This is the judgement part |
| Merging, removing duplicates, "New" flags, history, run limits | Plain code | These must be predictable and testable |
| Cleaning the model's output | Plain code | A link must start with `http(s)://` or it's dropped. A severity outside Low, Medium or High becomes Medium |

Source: R ("Why AI, and why not just rules"). Keep R's honest note: *"The repo does not record whether keyword alerts
or RSS feeds were tried first."*

## 7. Decisions and trade-offs

**Purpose:** show trade-offs. Five cards, each in the form **Decision / Gave up / Got**. All from R and DEC.

1. **Four category calls, not one big prompt.** Gave up: one ranked list across categories. Got: the calls run in
   parallel, and one failed category doesn't sink the other three.
2. **Visitors never trigger an AI call.** Gave up: fresh results on every visit. Got: at most five sweeps a day
   whatever the traffic, and the API key stays on the server.
3. **The public demo replays a saved sample.** Gave up: live data in the demo. Got: a demo with no key, no cost and
   nothing to break. The sample is now dated, and the page says so.
4. **"New" means a headline not seen before.** Gave up: recognising the same event under a different headline. Got:
   a rule that can be tested.
5. **Claims without evidence were removed.** On 18 Oct 2026 the case study was checked against the repo. "Raised
   result quality", "posts to email" and two dead buttons came out, and offline checks fail if they come back.

Optional sixth card, from CS: **pricing from the cost floor, and showing the case that loses money.** It depends on
D-4.

## 8. How quality is checked, and what isn't measured yet

**Purpose:** the credibility section. Lead with what is measured, then say what isn't, at the same weight.

**Tested.** `{tests}` offline tests and `{checks}` offline checks run on every push, with Anthropic, Razorpay, Resend
and storage stubbed (from `radar.json`, with `asOf`).

**Measured.**
- Link provenance: `{linkProvenance}`. On 26 to 30 Oct, 1 of 190 items had a link that web search never returned. (R)
- Source age: the median was 8.5 days on the 18 dated sources so far. (R)
- Model comparison, 30 Oct: Haiku 5.5 kept 28 of 55 items (51%) and Sonnet 5.5 kept 15 of 52 (29%) in a blind review.
  **That review was marked by ChatGPT, not a person**, and the page says so in the same sentence. (R)

**Not measured yet**, in a box styled with the same weight as the rest:
- whether the source supports the summary;
- whether the category and severity are right;
- whether the product opportunity is useful.

A six-point scoring rubric is built (`scripts/score-items.mjs`), and no live sweep has been scored by a person. (R, CS)

**Must not say:** "accurate", "verified", "high-quality findings", or any accuracy percentage.

## 9. The business case: a cost floor, not a forecast

**Depends on D-4.** If it is approved:

| | |
|---|---|
| Cost of one sweep (Haiku) | `{costPerSweep}` |
| Monthly running cost with payments | `{monthlyCost}` |
| Members to cover it at ₹299 | `{breakEven299}` |
| Price today | `{price}`. No number of members covers the cost at this price, and the target price is an open decision |
| Revenue forecast | None. There is no demand data |

Source: CS ("Business case"). If D-4 says no, replace this with one line, *"The pricing reasoning, including the
version that loses money, is in the [business case ↗]."*, and link to the GitHub file.

## 10. Guardrails

**Purpose:** show that failure modes were thought through. Five rows from R's table:

| What can go wrong | Guardrail |
|---|---|
| One category's search fails | It's skipped. The others are saved, and the failure is logged |
| Someone triggers sweeps to run up costs | Refused without the secret. A cap on manual runs a day, plus the Anthropic spend limit |
| A reader treats AI findings as fact | The live page says items are AI-gathered and unverified, and asks readers to check each source |
| Subscriber addresses leak | Replies and logs carry counts only. The data feed refuses subscriber keys |
| **The model invents or misreads a source** | **Partly guarded.** Links that search never returned are counted. Nothing yet checks that a source supports its summary. This is the main open risk |

Keep the last row in bold. It's the honest one.

## 11. How it was run: eight PM stages

**Purpose:** for the reader who wants to go further, show that the full lifecycle exists, and link to every stage.

A table of the eight stages from CS. Each row has one line on what was done and a link to the GitHub file:
Discover · Define · Design · Plan and govern · Justify and launch · Communicate · Measure · Test.

## 12. What isn't proven, and what's next

**Purpose:** end on the truth, not a pitch.

Not proven, from CS "Known gaps" (refresh at launch):
- no user research, and no finding scored by a person;
- the price is below the running cost;
- the first test run isn't signed off (`{openBugs}`);
- no usage or revenue data.

Next, from R "What's next" (refresh at launch): score 20+ live items by hand and publish the result · fix the open
S1 bug · recognise the same event under a new headline · refresh the demo sample · ask PMs whether the opportunities
are useful.

## 13. My role

**Blocked on O-1. Don't publish a guess.**

R suggests this, marked *OWNER INPUT NEEDED*: *"Implemented with Claude Code; I owned the problem framing,
architecture decisions, evals and testing."* The owner confirms or rewrites it. If one of R's three "I was wrong
about…" candidates is chosen (O-4), it goes here too, in the owner's own words.

## 14. Closing CTAs

Reuse the `nextSteps()` component:

| Title | Description | Link |
|---|---|---|
| Open Travel Problem Radar | Free daily email, or the live board with Pro | radar.pehchanthetraveller.com ↗ |
| Try the demo | A saved sample, no sign-in and no AI calls | `/demo/` ↗ |
| See this week's trends | New problems by area and category, free | `/trends/` ↗ |
| Read the full case study | 38 documents across eight stages, on GitHub | `pm/CASE_STUDY.md` ↗ |

## 15. Provenance line

At the bottom, in small type:

> *Figures as of `{asOf}`, from `travel-problem-radar-case-study` at `{sourceCommit}`. The repository is the
> record. Where this page and it disagree, it is right.*

Then the relationship line, worded per D-2: *"Travel Problem Radar is built and run by Bhawna Mangla, who also
runs Pehchan."*

---

## Never on this page

- User counts, team names, companies or testimonials. None are recorded.
- Revenue, MRR or growth claims. Three ₹1 payments is the whole record, and it's stated as that.
- "AI-verified", "accurate", "real-time", or "trusted by".
- `Review`, `AggregateRating` or `Offer` schema. Site rule: no first-party review data, and the price is volatile.
- Live radar items embedded on the page. They are unverified, and the page would show stale items whenever the build
  is old.
- Anything still marked *OWNER INPUT NEEDED* in the radar repo, until the owner answers it.
