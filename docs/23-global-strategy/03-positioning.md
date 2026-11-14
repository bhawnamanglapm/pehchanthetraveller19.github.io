# 03 — Positioning

## The promise

| Option | Line | Verdict |
|---|---|---|
| **A** | **What travel is really like, for someone like you.** | **Recommended.** It names both differences, reality and the lens, in eight words |
| B | Know before you go, from people like you. | Close second. "Know before you go" is already a common phrase in travel, so it isn't ownable |
| C | The trip, before the trip. | Memorable, but it doesn't say how |

`site.json` today: `promise: "Solo travel for Indian women — and the plan that gets your family to yes."`,
`descriptor: "Find your identity"`.

**Proposed:** `promise: "What travel is really like, for someone like you."`.
**Keep the name and the descriptor.** *Pehchan* (पहचान) means recognition or identity, and the product is literally
about recognising yourself in the people who went before you. That's a better story for the name than the one it
has now. The story goes on the About page, and the name doesn't need a translation in the logo.

> **Updated 7 Nov 2026 (`07`):** the promise, the name, the lenses and "what Pehchan never becomes" all stand. What
> changed is *how* the questions below are answered. Voices from people like you replace verdict cards and long
> reports. Lenses become the "I am" chips.

## Four questions every page answers

| Question | Product | Status |
|---|---|---|
| **Is it what I think it is?** | ~~Reality Check verdict cards~~ → **Ask, and hear people like you who went** (`07`) | Not built. Stage A is a concierge test |
| **Is it for someone like me?** | ~~Profile, with lens filters~~ → **"I am" chips**, matched with the profile engine | The comfort profile engine is built. Matching isn't |
| **Has something changed?** | What changed: verified rule, fee, strike and outage changes | Gated behind human verification (`04`, `05`) |
| **Can I show my people?** | Trip Document | Built (`node src/test-document.mjs`, 34 tests) |

If a proposed page or feature answers none of these, it doesn't ship. **That's the rule that stops the site
becoming generic again.**

## Lenses: how "everyone" works without being generic

A lens is **a filter on reports plus a set of profile axes**, not a separate section of the site. Every destination
page has a lens switcher, and every report records which lenses its author belongs to (all optional).

| Lens | Why it's in the first set | Source |
|---|---|---|
| **Women** | The existing content, audience and brand. It's kept, not dropped | `docs/01`–`docs/20` |
| **First time abroad** | The biggest expectation gap is likely to be here (an assumption to test). It's universal, and it fits the Indian outbound growth story | `01` finding 9 |
| **Families and groups** | 57% of US families plan multigenerational trips. The Trip Document's natural audience | `01` finding 8 |
| **Accessible** | About $50bn a year in the US alone, and the question generic reviews answer worst | `01` finding 10 |
| **60+** | JourneyWoman's 50+ data. An audience that's comfortable with a slower pace and less served by influencers | `01` finding 1 |
| **Passport country** | Visa and entry rules differ by passport. It connects directly to What changed | `01` finding 6 |

**Launch with at most two lenses with data behind them (Women, plus First time abroad).** Show the others only once
they have reports. An empty lens switcher with six options says "nobody's here".

## What we stop saying, and what we start saying

| Stop | Start |
|---|---|
| "Solo travel for Indian women" as the promise | "What travel is really like, for someone like you". Women becomes a lens |
| "Find destinations" | "Find out what it's really like" |
| "Safe for women" as a claim we make | ~~"{x} of {n} women … felt safe after dark"~~ → **Hear three women who went alone talk about evenings there.** The travellers make the claim, in their own voice |
| "Global travel discovery platform" (still on the About page) | Delete it. That's the version that failed |
| "Personality quiz" | "Your comfort profile, which filters reports to people like you" |
| "AI-powered" anywhere on the consumer side | **"Real voices. No AI-written answers."** AI isn't the promise, the people are |
| Long report forms as the main way to contribute | **"Answer one question in 60 seconds"** |

## What Pehchan never becomes

- **An AI itinerary planner.** Saturated, and incumbents own booking (`01` finding 2).
- **A booking engine or tour operator.** Thin margins, and the conflict of interest destroys the truth layer
  (`docs/17`).
- **A guidebook.** The format AI replaces best (`01` finding 3).
- **A ratings site with stars.** Stars rate places. We report trips.

## The voice

Unchanged from `docs/13`. A global audience makes plain English more important, not less: short sentences, no
idioms, numbers with n.
