# 06 — Launch, measurement and later phases

## Launch checklist

**Before building**
- [ ] D-1, D-2 and D-3 decided (`07`)
- [ ] O-1, the role line, written by the owner
- [ ] D-4 decided: show the business case on the page, or link to it

**Before merging**
- [ ] Every figure in `radar.json` re-pulled from the radar repo **on that day**, with `asOf` and `sourceCommit` updated
- [ ] The price on the radar's `/pricing/` matches `radar.json` (it was ₹1 on 7 Nov)
- [ ] The refund wording in the radar's `plan.json` checked (O-7). Pehchan's nav will send people to that pricing page
- [ ] Every external link returns 200
- [ ] All 14 checks in `05` pass
- [ ] One read-through by a PM who hasn't seen the radar: can they say what it does, its main trade-off, and what
      isn't proven, after one read? This is the only test of G2

**At launch**
- [ ] Analytics connected (`site.json → analytics.provider`, one line, already the top unblocked item in `docs/15`).
      Without it the 30-day review below can't happen
- [ ] The radar's footer links back (D-7, radar repo)
- [ ] The README docs list updated

## Release order

1. **This repo, one PR:** the page, nav, footer and search fix. Fully reversible: removing the nav item and the route
   takes the whole thing out again.
2. **Radar repo, a separate PR:** the link back, and the contact email if D-5 unifies it.
3. **About rewrite** (D-6), only if approved. It's a separate change because it's a positioning decision, not part of
   this integration.

## What to measure

Nothing is measured on this site today. What follows only applies once analytics is connected.

| Question | Metric | Source |
|---|---|---|
| Is the nav item used? | Radar panel opens ÷ all nav panel opens | `nav_open` |
| Does the panel send people on? | Panel link clicks ÷ Radar panel opens | `nav_radar_*` |
| Does the page do its job? | `/radar/` views, and outbound CTA clicks ÷ views | `next_step`, `radar_cta_*`, `outbound_click` |
| Where do readers come from? | Referrer on `/radar/` views: internal nav, or LinkedIn / GitHub / direct | Analytics referrer |
| **Guardrail:** are travellers being diverted? | Profile starts per session, before and after launch | Existing `cta_profile` events. Note there's no pre-launch baseline if analytics goes live at the same time |
| Does Pehchan send the radar any sign-ups? | Radar sign-ups referred by pehchanthetraveller.com | **Radar side.** Only possible if the radar records a referrer (O-8) |

**No targets are set here.** There's no traffic baseline for either site, and an invented threshold would be a
made-up number. The owner sets them after the first 30 days of data.

## The 30-day review

Thirty days after analytics is live, answer one question: **does the Radar nav item earn its place in a five-item
nav on a consumer site?**

| What the data shows | Action |
|---|---|
| The panel is used, and most `/radar/` traffic arrives through it | Keep it |
| `/radar/` traffic comes mostly from outside (LinkedIn, GitHub, direct) and the nav item is rarely opened | Move the radar to the footer only and keep the page. The page is doing its job, and the nav item isn't |
| Profile starts fall after launch and Radar panel opens are high | Travellers are being diverted. Move it to the footer |
| Too little traffic to tell | Say so and wait another 30 days. Don't decide on noise |

## Keeping the content true

The radar repo changes every few days. The page shows a snapshot with a date.

- **When to refresh:** at each radar milestone (a price change, the first person-scored sweep, BUG-002 closed, the
  first paying member above ₹1), or monthly, whichever comes first. The build warning at 45 days is the backstop.
- **How to refresh:** read `pm/CASE_STUDY.md`, the top of `CHANGELOG.md` and `plan.json` → update `radar.json`
  `facts`, `asOf` and `sourceCommit` → rebuild → commit `Refresh radar figures to <date>`.
- **What doesn't need refreshing:** the problem, the decisions, the AI-versus-code split and the guardrails. Those
  sit in the template because they don't change week to week.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Travellers click "Radar" and are confused or lost | Medium | Medium: the site's core audience | The panel and page say who it's for, Radar sits last, the 30-day review |
| Figures on the page go stale and contradict the repo | **High**: three test counts in a week | Medium: a credibility page that's wrong loses credibility | One data file, a visible `asOf`, the build warning, the "the repo is right" line |
| The page implies Pehchan Travel Studio sells the radar | Medium | **High**: payments are taken, and the entity isn't registered | D-2 = A wording. Never "a Pehchan product" until it is |
| A safety-first consumer brand becomes associated with unverified AI output | Low with this plan | High | No radar items on Pehchan. The page says the findings are unverified |
| The radar is down, so the nav link is broken | Low | Low | Outside this repo's control. The case study page still works |
| The ₹1 price reads as a joke or a bait price | Medium | Low to medium | Show the cost-floor reasoning (D-4), or don't mention the price and link to `/pricing/` |
| The case study ships with a guessed role line | Low | **High** for a portfolio page | The `role: null` build guard |
| Five nav items wrap at some width | Low | Low | Test 7 in `05` |

## Later phases: not in this plan, written down so they aren't half-built

**Phase 2: the radar reciprocates.** A link back from the radar's footer (D-7), one contact email (D-5), and a
referrer recorded at sign-up (O-8).

**Phase 3: radar findings that matter to Pehchan's traveller.** The radar's "government and policy" category and its
India area overlap with what an Indian woman planning travel needs: visa changes, entry rules, tourist taxes,
strikes. A "travel rule changes this month" block on `/safety/` or a destination page would be useful.

**It's gated, and shouldn't start until all of these hold:**
1. A person has scored live items with the radar's rubric, and "the source supports the summary" passes at a rate
   the owner is willing to put next to safety content. The radar calls this its main open risk.
2. Every item shown on Pehchan is **checked by a person before it appears**, with a `last_verified` date, the same
   standard as `docs/04-content-verification.md` and `docs/12`.
3. Pehchan has a reason to send a traveller there (Stage 3 validation in `docs/15`).

Until then, showing radar output on a consumer page would break the rule this site is built on: *no
recommendation we would not act on ourselves.*
