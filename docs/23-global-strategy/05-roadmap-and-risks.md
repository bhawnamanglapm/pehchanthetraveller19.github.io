# 05 — Roadmap, gates and risks

## The principle: global by design, focused in effort

**Global by design** means anyone can report on any destination, the lenses are universal, the copy doesn't assume
an Indian or a female reader, and English is plain.

**Focused in effort** means outreach, verification and the founder's own trips concentrate on **one corridor** until
its cards show real numbers. Spreading a few dozen reports across the world gives every card n=1, so every card shows
the empty state, so the product looks empty everywhere.

**Recommended first corridor:** Indian travellers to the five international destinations the founder has been to:
Dubai, Vietnam, Thailand, Malaysia and Nepal (`docs/06`).
- The founder can verify reports from first-hand knowledge.
- Indian outbound travel is about 29m trips a year and growing (`01` finding 9).
- Existing readers, and the family-approval problem the Trip Document solves, are already here.

**The second corridor is chosen by the data**, from wherever reports arrive unprompted.

## Phases

> **Updated 7 Nov 2026.** Phases 1 and 2 below are **replaced** by Stages A and B in `07`:
> - The real test is no longer "will people submit reports?" but **"will people ask, and will travellers record
>   one 60-second answer?"** (the Stage A concierge test).
> - The consent line from Phase 1 still applies, now per answer, with extra voice consent (`07`, risks).
>
> Phase 0 (copy and About page) stands, with the home hero copy from `07`. Phases 3 and 4 stand: Phase 3 becomes
> `07` Stage C ("changed since"), and Phase 4 uses the "Asked" queue as well as answers. The corridor, the "global
> by design, focused in effort" principle and the risk table all still apply.

### Phase 0: change the words, not the product (1–2 PRs)

- `site.json`: the new `promise` (`03`). Keep `brand` and `descriptor`.
- Home hero and meta copy rewritten to the four questions.
- Rewrite the About page (`docs/22` D-6, now required). Remove "global travel discovery platform" and "eight
  regions", add the story of the name, and add "Nobody can pay to change a verdict."
- Women's pages stay where they are and are labelled as the Women lens.
- The radar page from `docs/22`, using the relationship wording decided in `06`.
- The two dead search entries fixed (`docs/22` D-8).

**Reversible:** copy only. No routes are deleted.

### Phase 1: open the report form to everyone (the real test)

- The report form (`docs/11`) gets an optional "who you are" step: first time abroad (yes/no), age band, who you
  travelled with, accessibility needs (free text, optional), passport country, gender (optional, including "prefer
  not to say").
- **A consent line written in from the first report:** reports may be counted in anonymised totals shared with
  travel companies. A separate tick box, not bundled.
- The Reality Check card and its empty state per `docs/20`, live on the five corridor destinations.
- **The question this phase answers:** will people who aren't women travelling alone submit reports? If not,
  the global repositioning has no engine, and the site should stay a women's product with a wider audience for the
  Trip Document. **This is the decision point of the whole plan.**

**Gate to Phase 2:** the owner sets the bar *before* Phase 1 launches, for example "N reports from outside the
Women lens within 60 days". I haven't set N, because there's no baseline to set it from. `docs/19`'s rule of
thumb (25 per survey form, and no percentages below 10) is a sensible reference.

### Phase 2: lenses on destination pages

- A lens switcher on destination pages, showing only lenses with at least one card over the threshold.
- Profile results link to matching reports ("6 people with a profile like yours went to Hanoi"), not just to
  destinations.
- Trip Document copy generalised: "the people who need to say yes", whether that's parents, a partner, a group or a
  manager.

### Phase 3: Pehchan and the radar exchange data (gated)

The gate is unchanged from `docs/22`, `06`:
- **(1)** A person has scored radar items, and "the source supports the summary" passes at a rate the owner accepts.
- **(2)** A person checks every item before it appears, with a `last_verified` date.
- **(3)** There's a traveller reason to show it, which by now is the corridor destinations.

What ships is a "What changed this month" block on the five corridor destination pages. In the other direction,
anonymised totals of where expectations failed feed the radar's traveller-pain category.

### Phase 4: industry insight (only if Phase 1 consent exists)

Aggregated "where expectations fail" reports, by destination and lens, for tourism boards and operators.
**No forecast of revenue here.** There's no demand data yet. Before building anything, test demand with two or
three conversations with tourism boards for the corridor destinations.

## What to measure

Analytics still isn't connected (`site.json → analytics.provider` is null). **Connecting it is step zero.** Nothing
below can be measured without it.

| Question | Metric | North star? |
|---|---|---|
| Is the engine running? | Reports submitted per week, split by lens | |
| **Is the product filling up?** | **Destination × lens cells over the docs/20 threshold** | **Yes.** Coverage is the product |
| Do people outside the old audience come? | Share of reports with no Women lens | Phase 1 gate |
| Do verdicts lead anywhere? | Reality Check views → profile starts, document starts, or report starts | |
| Do verdicts travel? | Share-card shares (`docs/20`) | |
| Does the radar get anything? | Radar sign-ups referred from Pehchan (`docs/22` O-8) | |

**No targets are set here.** There's no baseline, and an invented target would be a made-up number.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Cold start: nobody reports** | **High** | **Fatal** | One corridor. The founder's own trips seed it (labelled as the founder's). The Phase 1 gate is a real stop |
| Going broad dilutes what the existing audience liked | Medium | Medium | The Women lens keeps every existing page. Phase 0 changes copy, not content |
| Fake or boosted reports | Medium, rising with traffic | High | Integrity mechanics from `docs/11` and `docs/12`. 54% of Tripadvisor's fraud is businesses boosting themselves (`01` finding 5), so never take reports from operators about their own trips |
| Sensitive lens data (gender, disability, passport) | Medium | High | All optional, minimal, never shown below threshold. Check obligations under India's Digital Personal Data Protection Act, 2023, and the GDPR for EU reporters, before Phase 1 |
| Brand says "by Pehchan" next to payments with no entity | Medium | High | The brand and legal split in `04`. Professional advice before showing it |
| AI answers absorb destination pages too | Medium | Medium | Lead with first-party numbers, which AI has to cite. Add structured data for the numbers when they exist |
| One founder, two products | **High** | Medium | Phases are sequential. The radar is in maintenance mode while Phase 1 runs |
| A verdict hurts a destination or business, and they push back | Low now | Medium | n on every card, travellers' words not ours, a published method, and no paid changes |

## The model for each phase

Phase 0 is copy and a small build, so **Sonnet**. Phase 1's form, consent and data model need design first, so plan
with **Opus**, then build with **Sonnet**. This follows your model policy.
