# 24 — Problem Lab: radar opportunities, scored for our customer, solved one at a time

**Status:** plan, not built. Written 7 Nov 2026.

> **Update 14 Nov 2026:** the customer in this plan (L-1, hotel-led) is replaced. The current direction is "Trip that
> pays", for a traveller making a documentary: see [docs/25 section 17](../25-trip-that-pays/README.md). Use the
> scoring method here, but score problems for that traveller, not for hotels.

## What this is for the business

Each month the radar's sweeps (up to 5 a day) find travel problems. The Lab turns them into a ranked list for
Pehchan's customer. Then we solve the top one in public and make it something the agency sells or earns from.

| What it gives the business | How |
|---|---|
| **A product pipeline** | Each solved problem becomes a service or listing the agency earns from. For example, "booking scams" becomes a Pehchan Verified stays list with affiliate links (Agoda pays about 4–7%, [track360](https://track360.io/blog/agoda-affiliate-program-operator-teardown-2026)), or a hotel partnership |
| **Monthly Instagram content** | Each problem gets three posts: "the problem", "what we're building", and "it's fixed". The content comes from real sources, not trend-chasing |
| **The fest story** | "We track every travel problem the radar finds, and solve the top one in public." The counts on the page come from the export, never from estimates |
| **A path into Radar Pro** | The Lab shows the checked top 10 once a month. Pro keeps the full live board 5 times a day |

## Who "our customer" is when we score

The scoring uses the agency direction (7 Nov 2026):

- **The traveller we serve:** Indian travellers, women first, booking stays and trips in India and the five corridor
  destinations (Dubai/UAE, Vietnam, Thailand, Malaysia and Nepal). They want stays that are cheap but good, with real
  prices and real messages.
- **Who pays:** hotels, restaurants and booking partners (affiliate commission, partnerships and sponsored content,
  always labelled).

A problem scores high when it hurts that traveller, keeps coming back, and solving it gives Pehchan a way to earn.

## How it works

```
Radar (Vercel): sweeps saved privately in Blob storage
   │  1. EXPORT: a read-only, token-protected endpoint returns one month's sweeps
   ▼
scripts/lab-pull.mjs (your machine)
   │  2. MERGE: same problem across sweeps → one item, with counts ("seen in 23 sweeps over 9 days")
   │  3. AUTO-SCORE: where, how often, what type (from the data, no AI)
   ▼
.radar/raw/2026-11.json            ← gitignored and never committed (the repo is PUBLIC)
   │
scripts/lab-review.mjs → http://localhost:4321   (your private dashboard)
   │  4. CHECK: open the source, keep or drop, add one line on why it matters
   │  5. YOUR SCORE: pain, promise fit, money path, ship in 2–4 weeks
   ▼
src/content/lab/2026-11.json       ← only checked items, committed
   │  6. BUILD: node src/build.mjs checks every rule below
   ▼
pehchanthetraveller.com/lab/       (public board)
   │  7. PICK: the top scorer becomes "Now solving"; nothing else is picked until it ships or is parked
```

**Why it's "pull, then you approve", not an automatic push.** This repo is public on GitHub. A file pushed
automatically would publish raw, unchecked AI output and Radar Pro's paid content as soon as it's committed. So raw
data stays on your machine, and only what you've checked enters the repo.

## The scoring (100 points)

Two parts. The script computes the first part from the radar's data. You enter the second part in the dashboard.
**Your judgment carries 55 of the 100 points by design.** The radar's own "severity" is written by AI, so it's shown
for information but isn't scored.

### Part 1: from the data (45 points, computed by the script)

| Signal | Points | Rule |
|---|---|---|
| **Where it happens** | 0–20 | India 20 · a corridor country 16 · the rest of Asia, the Middle East, or "Global" 8 · elsewhere 0 |
| **Keeps coming back** | 0–15 | Distinct days seen in the month: 1 day 3 · 2–3 days 7 · 4–7 days 11 · 8 or more 15 |
| **Type** | 0–10 | Traveller pain 10 · Industry 6 · Government policy 6 · Web/app 3 |

### Part 2: your judgment (55 points, entered in the dashboard; each on a 0–3 scale, then scaled)

| Question | Points | 0 means | 3 means |
|---|---|---|---|
| **Does it hurt our traveller when booking a stay or trip?** | 0–20 | Not our traveller | Directly, and often |
| **Does it fit "the stay, the price and the message are real"?** | 0–10 | Unrelated | It's exactly that promise |
| **Is there a money path?** | 0–15 | None | Clear path: affiliate, hotel or restaurant partner, sponsored content, or Pro |
| **Can we ship something in 2–4 weeks?** | 0–10 | Months, or needs a team | A page, list or tool we can build now |

The weights above are **my proposal, not a measured fact.** They live in `src/content/lab/scoring.json`, so you can
change them, and every month's ranking is recomputed from them. The build rejects a hand-edited total.

## The two screens

### Your private dashboard: `node scripts/lab-review.mjs`, then open http://localhost:4321

It runs only on your machine and is never deployed. Zero dependencies, using Node's built-in server.

- **Inbox:** every merged problem for the month, sorted by data score, with source link, region, counts, the AI's
  summary and the AI's product idea (both labelled as AI).
- **Per item:** Keep / Drop / Merge with another item ("possible duplicate" is flagged when titles are similar or the
  source link is the same), your four scores as 0–3 taps, and a "why it matters" line.
- **Save:** writes only the kept, checked items to `src/content/lab/YYYY-MM.json`, plus your private notes to
  `.radar/notes/` (gitignored).
- **Pick:** sets one item to "Now solving".

### The public board: `/lab/`

Built like a board you scan, not a report.

1. **Now solving:** the one problem, its score, what we're building, a dated progress log, and the result. This is
   the part to show at the fest and turn into reels.
2. **This month's top 10:** ranked cards, each with the problem, place, source, "seen in N sweeps over N days", and a
   score bar you can open into its seven parts.
3. **Past months:** a month switcher, with one static page per month at `/lab/2026-11/`.
4. **Shipped and parked:** every problem we took on and what happened, including the ones that didn't work.

Every card says "Found by the radar (AI). Checked by Bhawna on 30 Nov 2026." The AI's product idea says
"AI-suggested idea".

## What gets built

| # | Where | What | Notes |
|---|---|---|---|
| 1 | Radar repo | `api/export.js`: `GET /api/export?month=YYYY-MM` with `Authorization: Bearer <EXPORT_TOKEN>` | Read-only. Off unless `EXPORT_TOKEN` is set on Vercel (32+ characters, constant-time compare). Lists `sweeps/sweep-YYYY-MM-*` and returns the items with their sweep id and time. No change to sweeps, the board or Pro |
| 2 | This repo | `scripts/lab-pull.mjs 2026-11` | Reads `RADAR_EXPORT_TOKEN` from your environment, never from a file in the repo. Merges by radar id, then by source link, and flags similar titles. Writes `.radar/raw/YYYY-MM.json` |
| 3 | This repo | `scripts/lab-review.mjs`, the local dashboard | Writes `src/content/lab/YYYY-MM.json` and `.radar/notes/` |
| 4 | This repo | `src/content/lab/scoring.json` and `solving.json` | Weights, corridor list, current pick and progress log |
| 5 | This repo | `src/templates/lab.mjs` plus routes in `build.mjs` | `/lab/` and `/lab/YYYY-MM/` |
| 6 | This repo | Validation in `graph.mjs` | See the rules below |
| 7 | This repo | `.gitignore`: add `.radar/` | Before the first pull |
| 8 | This repo | A link to `/lab/` in the footer and on About | So it isn't an orphan page. No fifth main nav item |

### Rules the build enforces (it fails if any is broken)

- Every item has an `https` source link and a `checkedOn` date. Nothing unchecked can be published.
- Every score total matches what `scoring.json` computes.
- At most one item is "solving". "Shipped" and "parked" need an outcome line.
- Items contain only allowed fields, so raw radar fields such as the sweep log or search payload can't leak.
- Month files are named `YYYY-MM.json` and match their `month` field.
- Title and description length limits and link checks apply as for every page.

## Order of work

| Step | What | Model |
|---|---|---|
| 1 | The export endpoint in the radar repo, plus setting `EXPORT_TOKEN`. **First run: confirm how far back sweep files go.** The search index keeps only about 60 sweeps, and I found no code that deletes sweep files, but I haven't confirmed it | Sonnet |
| 2 | `lab-pull.mjs` with merge and data score, tested against a real November export | Sonnet |
| 3 | The local review dashboard | Sonnet |
| 4 | The `/lab/` page, validation and links | Sonnet |
| 5 | **You:** review November (about an hour, depending on how many items survive the merge), and pick the first problem | — |
| Later | A monthly reminder (a GitHub issue on the 1st: "November export ready to pull"). It never carries data | Sonnet |

Steps 1–4 are four small PRs, two in each repo.

## Risks

| Risk | What we do |
|---|---|
| **The radar finds few India problems.** In the 107-item sample, about 37 items were from the US and none from India | "Where" carries 20 points, so the ranking favours India and corridor items. If a month has too few, the fix is the radar's India focus (T42), not lowering the bar |
| Raw or Pro content ends up in the public repo | Raw data stays in `.radar/` (gitignored), only allowed fields reach the content files, and the build checks them |
| The token leaks | It's single-purpose and read-only, held in your environment only, and you can rotate it on Vercel in one step |
| AI summaries are wrong | You open every source before keeping an item. The page names who checked it and when |
| Old months can't be rebuilt | Step 1 confirms retention. If files are pruned, the Lab starts from the first month we pull |

## Decisions

| # | Decision | Recommendation |
|---|---|---|
| L-1 | The customer used for scoring (above) | **Confirm or change.** This is the one I need from you |
| L-2 | The weights | Start with mine, and change them after the first month if the ranking feels wrong |
| L-3 | Export through a radar endpoint, or a local script reading Blob storage directly | **The endpoint.** The radar keeps owning its storage, this repo stays dependency-free, and the token can only read |
| L-4 | Show score breakdowns publicly | **Yes.** It's "build in public", and the content file is public in the repo anyway. Private notes stay in `.radar/notes/` |
