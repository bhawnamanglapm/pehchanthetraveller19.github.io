# 02 — Strategy and decisions

## Goals

| # | Goal | How we will know |
|---|---|---|
| G1 | Someone on pehchanthetraveller.com can find the live radar in one or two clicks from any page | A nav entry on every page; manual check |
| G2 | A product manager or hiring manager can read `/radar/` in about five minutes and understand the problem, the product, the main decisions, what is proven and what isn't | Under 1,500 words; each section answers one question; read-aloud test with one PM (see `06`) |
| G3 | A travel founder or PM who is interested has an obvious next step: open the radar, try the demo, or read the full case study | Three CTAs, ranked; outbound clicks tracked |
| G4 | Pehchan's core visitor, a woman planning a trip, isn't confused or diverted | The nav panel and the page state the audience. No radar content on consumer pages |
| G5 | The page stays true as the radar changes | Figures in one dated file; a staleness warning at build; a refresh routine |

## Non-goals

- **Showing live radar findings on Pehchan.** They are AI-gathered and unverified (the radar says so itself), and
  this site's editorial standards and safety focus rule that out for now. See `06`, later phases.
- **Merging the brands or design systems.** `/radar/` uses Pehchan's design system. The radar keeps its own.
- **Moving the radar's payments, accounts or legal terms under Pehchan.**
- **Rebuilding the radar's docs here.** GitHub stays the record.
- **A "Labs" or "Work" index page with one item on it.** This site removed thin pages on 26 Sep. A one-item index
  would be the same mistake.

## Who the page is for

| | Visitor | Arrives from | Wants | The page's job |
|---|---|---|---|---|
| **Primary** | A PM, hiring manager or peer reading the owner's work | LinkedIn, a CV, GitHub, a direct link | Judgement: how the problem was framed, the trade-offs, how quality was checked, honesty about gaps | Be the five-minute version and link to the full one |
| **Secondary** | A travel founder or PM who might subscribe | The nav panel, search, the radar's own link back | What it does, what it costs, can I try it | Send them to the demo or the radar quickly |
| **Incidental** | A Pehchan traveller who clicked out of curiosity | The nav | A trip | Say in one line that this isn't for trip-planning, and link to `/profile/` |

The primary reader comes in from **outside** the site. That matters for the measurement plan: most of the page's
value won't show up as nav clicks.

## How the two brands relate (decision D-2)

| Option | Wording on the page | Pros | Cons |
|---|---|---|---|
| **A. By the founder (recommended)** | "Travel Problem Radar is built and run by Bhawna Mangla, who also runs Pehchan." | Accurate: the radar's terms say "run by Bhawna". No suggestion that Pehchan is the seller. Leaves the brands free to diverge | The connection is personal, not a product family |
| B. A Pehchan product | "Travel Problem Radar, from Pehchan." | The subdomain already suggests it. Simple story | Implies "Pehchan Travel Studio" sells it, which is not a registered entity and is not what the terms say. Ties a PM tool to a consumer brand built on trust |
| C. Don't state it | No relationship line | Nothing to get wrong | A nav link with no explanation is the confusion G4 is meant to prevent |

**Recommendation: A**, and revisit it if Pehchan becomes a registered entity that also operates the radar.

## Where it goes in the nav (decision D-1)

The current nav is four items, and each opens a mega panel. Three options:

### A. A direct link that leaves the site: `Radar ↗`

The literal reading of the ask: a top-level nav item that goes straight to radar.pehchanthetraveller.com.

- **Pros.** One click to the product. Simplest wording.
- **Cons.** It's the only nav item that leaves the site and the only one with no panel, so it needs its own render
  path in `shell.mjs` (the others are `<button>`s). It gives no context before a consumer lands on a PM tool. The
  case study page then needs another way in.

### B. A "Radar" item that opens a panel, like the other four (recommended)

```
 PEHCHAN   Profile   Destinations   Real Trips   Safety   Radar ▾
 ─────────────────────────────────────────────────────────────────────────────
  FOR PEOPLE WHO BUILD TRAVEL PRODUCTS     HOW IT WAS BUILT
  Open Travel Problem Radar ↗              Read the case study
  Try the demo, no sign-in ↗               The full record on GitHub ↗
  This week's trends ↗
                                           [ Read the case study ]
```

- **Pros.** It matches the existing pattern, so there's no new interaction to learn. The column title tells the
  traveller this isn't for her before she clicks. The live product is still the first link, so it's one click after
  opening. The case study page gets its link from the nav, which also satisfies the build's orphan check.
- **Cons.** One extra click compared with A. It's a fifth nav item, which reaches the code's own "five, not
  thirteen" limit.

### C. Footer and About only

- **Pros.** The consumer nav stays untouched.
- **Cons.** It doesn't meet the ask, and people rarely find links in footers.

**Recommendation: B.** It's the only option that does what was asked (the radar is reachable from the navigation bar
on every page) and also tells each audience whether it's meant for them. Put it **last**, after Safety, because the
order of items states priority, and Pehchan's own product comes first.

## Label and URL (decision D-3)

| Label | URL | When to choose it |
|---|---|---|
| **Radar (recommended)** | `/radar/` | The radar is the only builder tool. It matches the subdomain, and it's short enough for the nav at phone width |
| Labs | `/labs/radar/` | A second builder tool is definitely coming (for example, if `docs/20` Reality Check is meant for builders rather than travellers). Without a second item, a `/labs/` page would be thin |
| For builders | `/radar/` | Says the audience outright, but it's longer, and it sits oddly next to the other nav items, which are nouns |

A 301 redirect is impossible on GitHub Pages, but a later move from `/radar/` to `/labs/radar/` could use a
`<meta http-equiv="refresh">` stub. Starting with `/radar/` doesn't rule out Labs later.

## How strongly the page pushes the product

1. **Primary:** "Open Travel Problem Radar ↗". It's the live product, and the radar's home page handles sign-up.
2. **Secondary:** "Try the demo, no sign-in ↗". It costs nothing and can't break, so it's the right first step
   for someone curious.
3. **Tertiary:** "Read the full case study on GitHub ↗". For the reader who wants the evidence.

No sign-up form on Pehchan. The radar owns its own accounts and consent (DPDP, double opt-in), and copying that here
would mean two places to keep correct.

## Why this order of work

The page and nav are cheap and reversible. The things that cost more are **staleness** (the figures go out of date
weekly) and **brand ambiguity** (who is the seller). The plan puts its effort there: one data file, dated
figures, accurate relationship wording, and a 30-day review that can move the link to the footer if it isn't used
(see `06`).
