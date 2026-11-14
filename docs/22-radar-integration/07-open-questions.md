# 07 — Decisions and inputs for the owner

**The build waits on the items marked ⛔.** Each has a recommendation. Answering "go with the recommendations"
settles every decision; the owner inputs (O-) still need your own words.

---

## Decisions

| # | Decision | Options | Recommendation | Blocks |
|---|---|---|---|---|
| ⛔ **D-1** | How the radar appears in the nav | **A** a direct link that leaves the site · **B** a panel like the other four · **C** footer and About only | **B**, last in the nav (`02`) | Nav build |
| ⛔ **D-2** | How the two brands relate | **A** "built and run by Bhawna Mangla, who also runs Pehchan" · **B** "a Pehchan product" · **C** don't say | **A**. The radar's terms say "run by Bhawna", and Pehchan Travel Studio isn't registered (`02`) | Page copy, footer copy |
| ⛔ **D-3** | Label and URL | "Radar" at `/radar/` · "Labs" at `/labs/radar/` · "For builders" | **"Radar" at `/radar/`**, unless a second builder tool is definitely coming. Is `docs/20` Reality Check for builders or for travellers? | Route, nav |
| ⛔ **D-4** | Show the business case, including that ₹1 doesn't cover cost? | Show the table · one line and a link to the business case | **Show it.** It's already public in the repo, and the reasoning is the strongest PM evidence on the page. Showing the losing case is the point | Section 9 |
| D-5 | One contact email across both sites? | `pehchanthetraveller@gmail.com` (Pehchan) · `pehchanthetraveller19@gmail.com` (radar) · keep both | Keep both for now, since they serve different products, but say which is which on the page's contact line | — |
| D-6 | Rewrite the About page in the same release? | Yes · later · never | **Yes, as a separate PR.** It still describes "a global travel discovery platform" covering eight regions. Without a rewrite, don't add a radar paragraph to it (`04`) | About link only |
| D-7 | A link back from the radar's footer | Yes · no | **Yes.** One line in the radar repo (`04`) | — |
| D-8 | Fix the two dead entries in site search (`/plan/`, `/deals/`) in the same PR | Yes · separate PR | **Same PR.** Found while planning, and it's a two-line fix plus a check (`05`) | — |

## Owner inputs: your words, not guesses

The radar's README marks these *OWNER INPUT NEEDED*. A portfolio page can't fill them in for you.

| # | Question | Where it's used | ⛔? |
|---|---|---|---|
| ⛔ **O-1** | **Your role, in one or two sentences.** The radar README suggests: *"Implemented with Claude Code; I owned the problem framing, architecture decisions, evals and testing."* Confirm, edit or replace it | Section 13, and `radar.json → role` | Yes. The build fails without it (`05`) |
| O-2 | Did anyone other than you use the radar, such as a PM team or a manager? If not, the page says so | Sections 4 and 12 | No. The page defaults to "no user research yet", as the repo does |
| O-3 | Did any radar item become real work, such as a PRD, a pitch or a decision? | An optional "What it led to" line | No. It's left out if you don't answer |
| O-4 | One "I was wrong about…", in your words. The README offers three candidates: sharing, delivery, quality | Section 13 | No, but it's the most persuasive line a case study can have |
| O-5 | Is BUG-002 (S1) still open? | Section 12, `facts.openBugs` | Re-check on launch day |
| O-6 | Will the price still be ₹1 at launch? | `facts.price`, section 9 | Re-check on launch day |
| O-7 | Refund window: `plan.json` says "within 7 days" and also `"refundDays": 14`. Which is right, or do they mean different things? | Not on this page, but Pehchan's nav will send people to that pricing page | Radar repo |
| O-8 | Does the radar record where a sign-up came from? If yes, add UTM parameters to Pehchan's links. If no, skip them | `05`, analytics | No |

## Model for the next step

Planning used Opus. **The build in `05` is standard implementation, so Sonnet suits it**, per your model policy.
Switch with `/model` before saying go.
