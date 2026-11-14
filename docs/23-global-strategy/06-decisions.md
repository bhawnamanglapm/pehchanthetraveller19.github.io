# 06 — Decisions, and what changes in the radar plan

**Answering "go with the recommendations" settles D-1 to D-14** (except D-12 and D-14, which only you can answer). The ⛔ items block work starting.

**Settled 7 Nov 2026:** the form of the site is "Ask, humans answer" (`07`). That doesn't settle D-1. D-1 is still
about the *mission*, and option A is still recommended. It now means voices from people like you, not verdict
cards.

## Decisions

| # | Decision | Options | Recommendation |
|---|---|---|---|
| ⛔ **D-1** | What Pehchan becomes | **A** Travel reality for someone like you, with women as the first lens · **B** A global AI trip planner · **C** A global destination guide · **D** Stay a women-only site | **A.** B and C are the two most crowded and fastest-declining shapes (`01`). D keeps a crowded niche and throws away most of the data |
| ⛔ **D-2** | How the radar relates to Pehchan | **A** Endorsed: "Travel Problem Radar, by Pehchan" · **B** Branded house: rename it "Pehchan Radar" now · **C** As `docs/22`: "by Bhawna Mangla, who also runs Pehchan" | **A in the brand layer, with the legal layer unchanged (`04`).** It gives you the parent-child relationship you asked for without implying an unregistered entity sells it. Move to B after D-3 |
| ⛔ **D-3** | Register a legal entity for Pehchan? | Now · after Phase 1 · not yet | **Your call, with a CA.** It's the cleanest way to make the parent real, but costs time and money, and I can't weigh that for you. Until then, use D-2 = A |
| ⛔ **D-4** | The promise line | "What travel is really like, for someone like you" · "Know before you go, from people like you" · your own | **The first** (`03`) |
| D-5 | Keep the name Pehchan for a global audience? | Keep · rename | **Keep.** The meaning (recognition) is the product, and it's distinctive. Renaming throws away the domain, and every existing link |
| D-6 | The first corridor | Indian travellers to Dubai, Vietnam, Thailand, Malaysia, Nepal · somewhere else · global from day one | **The five** (`05`). Global from day one means n=1 everywhere |
| D-7 | Lenses at launch | Women + First time abroad · all six · Women only | **Two.** Only show lenses with reports behind them |
| D-8 | How the `docs/20` thresholds (no averages under 3 reports, numbers from 3, ranges from 6) work with lenses | Per destination × lens cell · per destination only · higher for sensitive lenses | **Per cell, and higher for the Accessible lens.** Now lower priority: voices lead, and counts are only a detail (`07`) |

### New decisions for "Ask, humans answer" (`07`)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| ⛔ **D-9** | Start with the concierge test (Stage A)? | **A** Yes: ask box → Google Form, founder finds people by hand, audio files in the repo · **B** Build real recording and AI matching first | **A.** It tests both halves (asking and answering) for time, not money. B builds a backend before knowing anyone will record |
| ⛔ **D-10** | The promise on every page: "Real voices. No AI-written answers." | Adopt as a hard rule · adopt as copy only · not yet | **Hard rule.** Once it's a line on the site, breaking it once ends the brand. Write it into the build checks the way the honesty rules are (`07`, "Rule for the build") |
| ⛔ **D-11** | What an answer can be | Voice only · voice, or text as a fallback · voice, text or short video | **Voice, or text as a fallback**, both labelled with who said them. Video adds file size and consent weight. Add it in Stage B if people ask |
| D-12 | The Trip Document | Keep, as a tool linked from answers · keep and hide from the nav · retire | **Keep, linked from answers.** It's built and tested, and families are a lens. It isn't the front door, so it doesn't make the site feel like documents. **Your call:** you know how it's used |
| D-13 | Stage B backend | The radar's Vercel stack · Cloudflare Workers with R2 (`docs/14`) · decide later | **Decide after Stage A.** If Stage A passes, compare costs in the build spec. Reusing the radar's stack is the likely default |
| D-14 | Stage A gate numbers | Owner sets them before launch | **Your numbers.** Questions per week, and the share of answer requests that become a recording. I have no baseline, so I won't propose figures |

## Owner checks: things only you know

| # | Question |
|---|---|
| O-1 | Do you have the time to run outreach for Phase 1 while the radar is in maintenance mode? If not, the plan is slower, not different |
| O-2 | Do you know anyone in a tourism board or operator for the corridor destinations? Phase 4 is tested by conversations, not code |
| O-3 | The one-hour check in `02`: search Crunchbase, Product Hunt and the app stores before committing. **For the new direction, search "travel voice answers", "voice Q&A travel" and "ask travellers voice note".** I couldn't run those |
| O-4 | Can you name 10 people who've been to your five corridor destinations and would record a 60-second voice note if you asked on WhatsApp? Stage A depends on this |

## What this changes in `docs/22` (the radar integration plan)

| `docs/22` item | Before | After this plan |
|---|---|---|
| D-2: the brand relationship | "Built and run by Bhawna Mangla, who also runs Pehchan" | **Replaced by D-2 here.** Brand layer: "Travel Problem Radar, by Pehchan". Legal and terms are unchanged |
| D-3: label and URL | "Radar" at `/radar/` | **Unchanged.** Add "For the travel industry" as the audience line |
| D-6: About rewrite | Recommended, as a separate PR | **Required in Phase 0.** The About page is where the parent story lives |
| Panel audience line | "For people who build travel products" | "For the travel industry". Wider, and it matches the tree in `04` |
| Page section 2, the audience note | Sends travellers to the Solo Travel Profile | Sends travellers to "What it's really like", the Reality Check, or the Profile |
| Phase 3 (radar findings on Pehchan) | A later idea | **Part of this roadmap** (`05` Phase 3), with the same gate |
| Everything else | — | Unchanged. The build spec in `docs/22`, `05` still applies |

**Suggested order:** decide D-1 to D-4 here → update `docs/22`, `07` to match → build Phase 0 of this plan and the
`docs/22` radar page in the same release, because the About rewrite and the radar page share the parent story.
