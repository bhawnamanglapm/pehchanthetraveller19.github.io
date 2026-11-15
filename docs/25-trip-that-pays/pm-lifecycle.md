# Trip that pays: the PM's ten steps

**Written:** 14 Nov 2026. **For:** the PM, with the owner, developer and designer.
**What it is:** the ten product stages from [docs/15](../15-product-lifecycle.md), applied to the whole trip app. For
each step: what the PM does, what's already in the plan, and what's still the PM's to do.

**Status marks:** ✅ already in the plan · 🟡 partly there · ⬜ the PM still has to do it.

**Rule for every step:** no invented numbers. Where a target is needed, the PM sets it with the owner and writes down
where it came from. Where there's no source, the doc says so.

---

## Step 1 · Problem: whose problem, and is it worth solving?

### Who has the problem

| Who | Their problem | Evidence today |
|---|---|---|
| **Indian traveller making content, women first** (Creator mode) | Picks a place from reels without knowing if it can earn; pays for the whole trip; doesn't know how to pitch stays, which programmes to join, how to label ads, or that free stays can be taxable | Reels and similar posts shape where 44% of Indians travel (Business Standard, 25 §3). ASCI counts free stays as a "material connection" (25 §12). **No traveller interviewed yet** ⬜ |
| **Safety-first traveller** (Just plan it safely mode) | Wants a checked place, checked stays and a safety plan, without the earning parts | Pehchan's earlier audience (docs/10, 15). The old survey is n=3, so treat it as weak ([docs/16](../16-survey-findings.md)) |
| **Stays** (homestays, hostels, hotels) | Get creator requests with nothing in writing and no way to judge the creator | **Assumption.** 4.07 asks 10 stays, after launch ⬜ |
| **Pehchan** | Needs income lines that don't require holding money or becoming a tour operator ([docs/17](../17-market.md)) | Six income lines, 25 §11 ✅ |

### Problem statement (draft for the PM to confirm after 4.07)

> An Indian traveller who wants to turn a trip into content has no single place that shows which destination can
> earn, which stays are safe and open to creators, and what to do before, during and after the trip to earn, collect
> points and stay free, so most first trips cost them everything and earn nothing back.

### Assumptions the build depends on, and what would kill each

| # | We believe | Tested by | Dead if (PM sets the number before 4.07) |
|---|---|---|---|
| A1 | Creators want help choosing a place that can earn, not just a pretty one | 4.07 creator talks | Fewer than __ of 10 say place choice is a problem |
| A2 | Creators would use a stage-by-stage planner | Real use after launch (1.39), then 4.07 | Fewer than __ of 10 say they'd use it |
| A3 | Stays will agree in writing to consider creator deals | 4.07 stay talks | Fewer than __ of 10 would sign a written OK |
| A4 | A first documentary trip can visibly cut its cost through points, barter and links. **Untested at launch** (since 16 Nov 2026 the trip comes last) | 4.02 Trip Balance | The real Trip Balance shows no saving at all |
| A5 | Some creators would pay for the Creator tier | 4.07 price reactions, then 2.11 | Nobody reacts positively to either price point |

These blanks are the **pass mark (D4)**. They're filled before the talks, never after.

**Untested at launch (since 16 Nov 2026):** the owner moved the talks, the stay checks and the build decision to the
end of the plan so the pages launch first. A1, A2, A3 and A5 are judged after launch, at 4.08, with real use of the
live pages as extra evidence.

### PM to-do in step 1
- ⬜ Fill the "Dead if" blanks with the owner. That's decision D4 in [0.01](tasks/0.01-decisions.md).
- ⬜ Rewrite the problem statement in the creators' own words after 4.07.
- ⬜ Confirm the one-line description of Pehchan (D1).

---

## Step 2 · Goals and metrics: what does "working" look like?

### The main measure ✅ (25 §15, task [1.39](tasks/1.39-measurement.md))

**Trips that reach stage 3 with a Trip Balance.** It proves "the trip pays for itself", or shows honestly that it
doesn't. `trip_closed` sends a band (loss, break-even, profit), never the exact amount.

### Supporting measures ✅

| Measure | Worked out as | What it tells the PM |
|---|---|---|
| Commission per trip started | Monthly commission total ÷ `trip_started` | Whether income line 1 works |
| Drop-off by stage | `stage_completed` counts | Which stage to fix first |
| Hotels open to creators, per destination | Badge count in Strapi | When income line 4 can charge (about 20) |
| Most-skipped steps | `step_skipped` by step and reason type | Which guides are weak or unneeded |
| Checkpoint colour at departure | `checkpoint_status` | Whether stage 1 guidance gets people ready |
| Mode split | `mode` | How many want Creator mode |
| Nav to start | `nav_trip_click` → `trip_started` | Whether the main site sends people |

### Guardrails: things that must never get worse ✅

- No personal data in any event (1.19).
- AI never states visa rules, emergency numbers or scores (25 §9).
- The **Pehchan-checked** badge is never sold or traded (25 §4).
- No destination shows with stale (amber) facts at launch (1.36).
- Pehchan never holds money between a traveller and a partner (25 §11).

### Business goals, by income line

| Line | First goal | Target |
|---|---|---|
| 2 · Own trips | One documentary trip finished, with a real Trip Balance | The trip itself (4.02, the last step) |
| 1 · Commission | Affiliate links live and clicked | ⬜ Set after the first month's baseline |
| 4 · Creator stays | About 20 checked stays in the first destination | From 25 §11 |
| 5 · Sponsored guides | Enough traffic to pitch a tourism board | ⬜ The PM and owner set the number |
| 3 · Creator tier | Two price points tested | 2.11 |

### PM to-do in step 2
- ⬜ Agree that the first month's numbers are the baseline (1.39). Don't set traffic targets before then.
- ⬜ After month 1, set a target for the main measure and for commission per trip, and write down why.
- ⬜ Check that every measure can be read without counting raw data by hand (1.39 acceptance).

---

## Step 3 · Validate: do real people say what we assume?

**Changed 16 Nov 2026 (owner):** these steps moved from phase 0 to the end of the plan (4.04–4.08, were 0.02–0.07),
so the pages launch first. The launch place is picked by AI instead (1.41). Validation now happens **after** launch,
with real use of the live pages as extra evidence.

| Task | What happens | PM's part |
|---|---|---|
| [4.04](tasks/4.04-instagram-account.md) | Pehchan's Instagram keeps growing (it never waited) | Track account age and followers monthly; barter platforms check both |
| [4.05](tasks/4.05-check-the-ai-pick.md) | The owner scores 3–5 places by hand and compares with the AI pick (1.41) | **Build the sheet**, one column per question, a source and date per fact. Record how long each question took |
| [4.06](tasks/4.06-check-stays.md) | The owner checks 10–20 stays; each goes live once it passes | Time every stay check. That sets how fast destinations can grow |
| [4.07](tasks/4.07-creator-and-stay-talks.md) | 10 creators and 10 stays, who can try the live pages | Schedule, take notes, keep answers as said, with dates. Build the one-page tally |
| [4.08](tasks/4.08-keep-change-or-stop.md) | Keep, change or stop | Put the tally and launch numbers next to the pass mark. If "change", update the plan files and tasks before phase 2 |

### How the PM runs the 20 talks well
- **Recruit:** creators from accounts the owner already follows or knows; stays from the 4.06 list. Don't only ask
  friends; note who is a friend.
- **Ask about the past, not the future:** "show me the last time" beats "would you use…". The questions are in 4.07.
- **Two price points** are set by the owner before the talks. Show both; don't suggest a right answer.
- **Never promise** a listing, a badge or a deal (4.07 rules).
- **Write up within a day,** while it's fresh. One row per talk.

### Tally template (one page)

| Question | Creators (of 10) | Stays (of 10) |
|---|---|---|
| Say place choice is a real problem | | — |
| Would use the planner | | — |
| React well to price point A / B | | — |
| Have had a fake collaboration offer | | — |
| Would sign a written OK for creator deals | — | |
| Prefer listing fee / fee per collaboration | — | |
| Most important stage (0a, 0b, 1, 2, 3) | | — |

### PM to-do in step 3
- ⬜ Build the 4.05 sheet and the tally template above.
- ⬜ Book the 20 talks.
- ⬜ Write the 4.08 decision with the date, next to the pass mark.

---

## Step 4 · Scope: what's in now, later, and never?

### In phase 1 ✅ (25 §16)
- The stepper, Trip Card and Trip Balance, both modes, the honesty strip.
- Every stage, 0a to 3, with its checklists and safety items.
- The worked example, booking links, export and import. Trips are saved in the browser.
- **One destination pack**, plus basics for India.
- Free data only: GOV.UK, REST Countries, Frankfurter plus fixed rates, and admin content in Strapi.

### Later ✅
- **Phase 2:** live scoring data, the partner tracker, the media kit builder, Hindi, the Creator tier price test, more
  destinations, tours.
- **Phase 3:** accounts, connected YouTube and Instagram, AI drafts, automatic partner reports, checked radar alerts,
  pre-selling Pehchan's own film.
- **After phase 3:** travelling with a friend (4.01).

### Never ✅ (25 §11, §9)
- Holding money between hotels and creators, or guaranteeing deals.
- Collecting money for other creators.
- AI-generated visa rules, emergency numbers or scores.
- Selling or trading the Pehchan-checked badge.

### The cut line, if time runs short
The plan already marks some steps optional. If phase 1 runs late, the PM proposes cutting these first, in this
order, and the owner decides:

1. E1 · Pre-sell the story (optional on the first trip).
2. S2 · Barter platforms (optional).
3. S3 · Tourism board pitch (optional).
4. P4 · Travel card sign-up bonus (optional).

**Never cut:** safety items, consent, ad labels, export/import, or the honesty strip.

### PM to-do in step 4
- ⬜ Get the owner's yes on the cut line before building starts.
- ⬜ Settle the open scope points in [COVERAGE.md](tasks/COVERAGE.md):
  - the India basics list (1.36)
  - whether the "pitch hotels" item shows in Just plan it safely mode (1.25)
  - which contact form leads go to (2.11, 2.14)

---

## Step 5 · Definition: what exactly are we building?

### Already written ✅
- [README.md](README.md): the plan, stage by stage.
- [user-page.md](user-page.md): what the traveller sees.
- [admin.md](admin.md): what admin does.
- [tasks/](tasks/README.md): 70+ tasks with lead, dependencies and acceptance criteria.
- [COVERAGE.md](tasks/COVERAGE.md): every plan point mapped to a task.

### The product on one page

| Stage | Traveller does | Done when | Task |
|---|---|---|---|
| Landing and first visit | Reads what it is, consents, picks a mode, enters trip basics | `trip_started` fires | 1.21 |
| 0a · Choose the place | Scores 3–5 places on 8 questions, picks one, writes the "why" | One place and the "why" line | 1.23 |
| 0b · Choose the stays | Picks stays that pass the 6-point check | Stays chosen for every night | 1.24 |
| 1 · Before (4–8 weeks out) | Do, Earn (E1–E3), Points (P1–P4), Stay free (S1–S3), safety | Checkpoint on departure day | 1.25–1.30 |
| 2 · During | Daily log, posts with labels, deliveries, safety card | Return date | 1.31 |
| 3 · After | Edit, deliver, close the Trip Balance, tax and records | `trip_closed` | 1.32 |

### PM's job in this step
- **One source of truth.** The plan files and tasks are the spec. Decisions go into the file they change, not into
  chat.
- **Definition of ready:** a task can start when its dependencies are Done, its open points are settled, and the
  designs for it are approved.
- **Definition of done:** every acceptance criterion is ticked, checked on a phone, and the event fires (where there
  is one).
- **Open points list.** From COVERAGE.md, still unsettled:

| Open point | Who settles it |
|---|---|
| D1–D7 | Owner (0.01) |
| India basics | PM with owner |
| Pitch item in Just plan it safely mode | PM with owner |
| Contact form for tier and sponsor leads | PM |
| Minimum count for anonymous pitch totals (2.10) | PM |
| Section 393(1): the new number for the free-stay tax rule | CA |
| ASCI minimum label time in videos | PM, from the current PDF |
| E3 commission rates (insurance, eSIM, forex) | PM, with sources |

### PM to-do in step 5
- ⬜ Close each open point and write the answer into the task it changes.
- ⬜ After 4.08, update every file the decision changes before phase 2 starts.

---

## Step 6 · Design: how does it look and behave?

### Already specified ✅ (task [1.03](tasks/1.03-design-system-and-screens.md), [1.33](tasks/1.33-accessibility-and-responsive.md))
- Brand continuity with the main site: same colours, fonts, wordmark and themes.
- Components with every state: Trip Card, stepper, step card, status chip, fact row, badges, checkpoint, forms, empty
  state.
- Screens: landing, first visit 1–4, 0a (laptop and phone), 0b, stage 1, checkpoint, stage 2 Today view, stage 3,
  trip menu dialogs, offline and error states.
- Phone first for stage 2, wider tables on a laptop for 0a to 1. 360px with no sideways scroll, 44px tap targets,
  WCAG 2.2 AA contrast, never colour alone.

### PM's design review checklist
For every screen the designer shows, the PM checks:

- [ ] **Every state is drawn:** empty, filled, error, offline, and "not needed".
- [ ] **Empty states** say what goes there and link to the worked example or a template.
- [ ] **Sources and dates** show on every fact; stale facts turn amber.
- [ ] **The two badges** look different and never merge.
- [ ] **The honesty strip** is visible on every stage.
- [ ] **Just plan it safely** hides Earn, Points and Stay free completely, with no gaps.
- [ ] **Words:** plain English, about a Class 8 reading level. No jargon like "affiliate" without explanation.
- [ ] **Phone:** checked at 360px, and the stage 2 log works one-handed.
- [ ] **Nothing blocks moving on** because a check is unfinished (1.22).

### Test the design before it's built
⬜ PM proposal, not in the plan yet: show clickable designs for the first visit and 0a to 3–5 creators the owner
knows (the 4.07 talks now come after launch). Watch where they get stuck. It costs a few hours and catches problems before code.

### PM to-do in step 6
- ⬜ Run a review for each screen group, using the checklist.
- ⬜ Run the design test with 3–5 creators, if the owner agrees.
- ⬜ Sign off designs before their tasks start (definition of ready).

---

## Step 7 · Build: does it exist?

### The order ✅ (tasks README)
Critical path: **1.01 → 1.05 → 1.08–1.11 → 1.13 → 1.22 → 1.23 → 1.24 → 1.26 → 1.27–1.29 → 1.30 → 1.31 → 1.32 →
1.40.** Start the destination pack (1.36) and the legal reviews (1.34) as early as possible: they take calendar time,
not code.

### Who's on it

| Role | Who | Note |
|---|---|---|
| Owner | Pehchan's founder | Decisions, the trip, the content, partner talks |
| Developer | Bhavu211 or Rajpal (D5) | Hours per week not set yet ⬜ |
| Designer | ⬜ Not named in the plan | |
| Admin helpers | Strapi editors (1.07) | Destination packs (Haiku suits the data entry) |
| Lawyer, CA | ⬜ Not chosen | Not needed for launch. Fees need the owner's OK (1.34) |

### PM's routine during the build
- **Weekly:** one short plan for the week, and one update to the owner covering done, blocked, and decisions needed.
- **Decision log:** every decision with date and who decided, in the file it changes (0.01 for D1–D7).
- **Unblock fast:** a developer question answered the same day is worth more than a perfect answer next week.
- **Scope changes:** anything new goes to phase 2 by default. It comes into phase 1 only if the owner swaps something
  out.

### Risks the PM tracks

| Risk | What happens | What the PM does |
|---|---|---|
| Builder hours unknown (D5) | No real dates | Get hours per week before 1.01 |
| Vercel's free plan is described as non-commercial; the app has booking links | Hosting may need a paid plan | Developer checks the current terms before 1.01; owner approves any cost |
| Affiliate programmes reject or delay (1.35) | Income line 1 starts late | Apply now, before launch |
| Unchecked legal text or a wrong safety fact goes live | A traveller relies on a wrong fact; a complaint under the DPDP Act 2023 | Since 16 Nov 2026 neither blocks launch. Safety facts pass automatic checks (1.41); the consent form stays hidden until a lawyer checks it; the owner and the lawyer step in as soon as something is found wrong |
| Strapi is one EC2 server with SQLite | Content loss | Daily backup and a tested restore (1.06) before launch |
| Destination pack takes longer than expected | Launch slips, monthly pace slips | Time the 1.36 pack and use it to plan; the 4.06 stay timing comes later |
| Data-source terms (GOV.UK credit, booking programmes' price rules) | Takedown or rejection | Check each before it's built (25 §12) |

### PM to-do in step 7
- ⬜ Get D5 answered and a designer named.
- ⬜ Start the weekly update.
- ⬜ Keep the risk table current.

---

## Step 8 · Quality: does it work, for real people, on real devices?

### Already in the tasks ✅
- Acceptance criteria in every task.
- Accessibility: axe check on every route, a keyboard-only run, a TalkBack run, 360px checks, a slow-3G test (1.33).
- Privacy: a review of every analytics payload for personal data (1.19).
- Tests for the scoring code (`score0a.ts`, 1.23).

### PM's acceptance test (run on a real Android phone)

| # | Run | Pass when |
|---|---|---|
| 1 | Main site nav → landing → Start my trip, in **Creator** mode | Consent, mode and basics screens appear; `trip_started` fires |
| 2 | Same in **Just plan it safely** | Screen 4 is skipped; no Earn, Points or Stay free anywhere |
| 3 | 0a with 3 places, including one with a stale fact | Stale fact shows amber; score adds the +1 visited bonus |
| 4 | 0b, choosing stays | Only checked stays; badges distinct |
| 5 | Stage 1, skipping one step with a reason | Moving on is never blocked; `step_skipped` fires with a reason type, no free text |
| 6 | Checkpoint on a test departure date | Colour shown with words too |
| 7 | Stage 2 log, one-handed, offline after "Save offline" | Entries save offline and survive a reload |
| 8 | Stage 3 close | Trip Balance correct against a hand calculation; `trip_closed` sends a band only |
| 9 | Export, clear browser data, import | The trip comes back whole |
| 10 | Delete my trip | Nothing left in the browser |
| 11 | Returning visitor | "Continue my trip" shows |

### Real people
⬜ Before launch, 3–5 creators the owner knows use the staging app on their own phones, without help. The PM watches and
writes down where they get stuck.

### Bug levels

| Level | Example | Launch? |
|---|---|---|
| Blocker | Data lost, a wrong safety fact, personal data in analytics, consent text not approved | No launch |
| Serious | A stage can't be finished, a broken affiliate link | Fix before launch |
| Minor | Spacing, wording | Can follow in week one |

### PM to-do in step 8
- ⬜ Run the 11 checks above and record the results.
- ⬜ Run the real-people test and fix the blockers it finds.

---

## Step 9 · Launch: does anybody know it exists?

### The gate ✅ (task [1.40](tasks/1.40-launch-checklist.md))
Legal and trust, content, tech and operations checklists. **The PM owns go or no-go:** every box ticked, or the
owner signs off a named exception.

### Launch day ✅
1. Deploy the trip app.
2. Merge the main site's nav link (1.20).
3. Click the link from desktop, drawer and footer; check `nav_trip_click` arrives.
4. Run one full trip to stage 1 on a phone.
5. Post on Instagram with the worked example.

### Who to tell (PM plan)

| Audience | Message | Channel |
|---|---|---|
| Instagram followers | The trip, and the tool that planned it | Post, reel, bio link |
| Newsletter subscribers | Same, with the worked example | Email, once the main site's form is connected |
| Creators the owner knows | "Try it and tell us where you got stuck" (they become the 4.07 talks) | Direct message |
| Stays checked later (4.06) | They're listed; here's the page | Direct message, as each goes live |
| Main site visitors | The nav link | Site |

### Support
⬜ Decide where questions and problems go (the contact form is an open point in COVERAGE.md). Someone reads them
daily in week one.

### PM to-do in step 9
- ⬜ Run the go/no-go with the owner.
- ⬜ Write the launch messages.
- ⬜ Set up support.
- ⬜ Check errors, drop-off and broken links daily for 7 days (1.40).

---

## Step 10 · Measure and iterate: is it working, and what changes next?

### The dashboard ✅ (1.39)
One view in the analytics tool, plus the commission total from Strapi.

### PM's rhythm

| When | Look at | Decide |
|---|---|---|
| Daily, week 1 | Errors, broken links, drop-off | Hot fixes |
| Weekly, month 1 | Funnel from `nav_trip_click` to `stage_completed: 3`, most-skipped steps | Fix the stage that loses the most people |
| Monthly (admin session, 1.38) | All measures, stale facts, link checks, commission | What goes into the next month; which destination is next (2.12) |
| End of month 1 | Everything | Write the baseline; set targets for step 2 |

### Decision rules (PM proposal)
- **Biggest drop-off stage is fixed first,** before new features.
- **A step skipped by most people** gets a rewrite or is cut, after asking 2–3 of them why.
- **Hotels open to creators reach about 20 in a destination:** start the listing test (2.13).
- **Price test results (2.11)** set the Creator tier price for phase 3.
- **Phase 2 starts** when week-one fixes are done (1.40).

### Talk to travellers, not only to numbers
⬜ Every month, talk to 2–3 travellers who closed a trip and 2–3 who dropped off. Numbers say where; talks say why.

### PM to-do in step 10
- ⬜ Set up the review calendar.
- ⬜ Write the month-1 baseline.
- ⬜ Keep a "learned this month" note that feeds the next month's plan.

---

## The PM's to-do list, in order

| When | Do |
|---|---|
| Now | Get a designer named · apply for affiliate programmes |
| Phase 1 | AI pick and pack published (1.41) · design reviews · weekly updates · risk table · acceptance test · real-people test |
| Launch | Go/no-go · launch messages · support · daily checks for 7 days |
| After launch | Baseline · targets · monthly review · the people steps: build the 4.05 sheet and the tally template, time the 4.06 stay checks, run the 4.07 talks, write the 4.08 decision · CA review |
