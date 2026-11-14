# 04 — Brand architecture: parent, children, and how they feed each other

## Three standard models

| Model | What it means | Example | Fit here |
|---|---|---|---|
| **Branded house** | One brand, and products are features of it | Google Maps, Google Docs | **Right for the consumer side.** Reality Check, Profile, Document and What changed are four questions on one site, not four brands |
| **Endorsed brand** | A product with its own name, backed by the parent | "Courtyard **by Marriott**" | **Right for the radar now.** Different audience, domain, pricing and buyer |
| House of brands | Separate brands, parent hidden | P&G (Tide, Pampers) | **Wrong.** Hides the one story that makes both credible |

## The tree

```
PEHCHAN  (parent: the mission and the name)
"What travel is really like, for someone like you"
│
├─ CONSUMER  ─ branded house ─ pehchanthetraveller.com
│   ├─ Reality Check    plain name, no logo of its own
│   ├─ Profile          plain name
│   ├─ What changed     plain name, gated
│   ├─ Trip Document    plain name
│   ├─ Real Trips       the reports, the source of all four
│   └─ Lenses           Women · First time abroad · Families · Accessible · 60+ · Passport
│
└─ INDUSTRY  ─ endorsed ─ radar.pehchanthetraveller.com
    └─ Travel Problem Radar, by Pehchan
       later, if D-2 goes that way: "Pehchan Radar"
```

**Naming rule:** a product gets its own name only if it has **its own audience, its own URL and its own price**.
Today only the radar meets all three. Everything else is a plain-English feature name.

**The domain:** `pehchanthetraveller.com` covers both children, and the radar subdomain already sits under it. No
new domain is needed.

## The legal line: read this before saying "by Pehchan"

`docs/22` recommended *not* calling the radar "a Pehchan product" (its D-2). The reasons:
- the radar takes payments through Razorpay;
- its terms say it's "run by Bhawna";
- "Pehchan Travel Studio" isn't a registered entity.

A parent-child relationship doesn't change those facts. **Split brand from legal:**

| Layer | Wording now | Wording after an entity is registered |
|---|---|---|
| Brand (nav, logo, page headers) | "Travel Problem Radar, by Pehchan" | "Pehchan Radar" (optional) |
| Legal (terms, invoices, payment pages) | "Run by Bhawna Mangla", unchanged | The entity's name |

Brand endorsement on a website is common practice, but **check this with a CA or lawyer before showing it
next to a payment button.** I'm not qualified to say it's fine. Registering the entity is the cleanest fix, and it's
the owner's decision (D-3 in `06`).

## How the two children feed each other

This is the reason they belong under one parent and aren't just two projects by the same person.

```
         ┌────────────────── travellers ──────────────────┐
         │                                                 ▲
  submit a report                                  read verdicts, use profile,
         │                                         build a document (free)
         ▼                                                 │
   ┌─────────────┐   aggregated, anonymised,     ┌──────────────────┐
   │ REAL TRIPS  │──── with consent only ───────▶│  RADAR           │
   │ first-party │   "where expectations fail"   │  traveller-pain  │──▶ industry
   │ reports     │                               │  category        │    (paid)
   └─────────────┘                               └──────────────────┘
         ▲                                                 │
         │                                       policy / strike / fee /
   verdict cards                                 outage sweeps (AI, daily)
   + WHAT CHANGED  ◀──── a person verifies each item ──────┘
   on destination pages      (gate: docs/22, 06, phase 3)
```

| Pehchan gives the radar | The radar gives Pehchan |
|---|---|
| **First-party traveller pain.** Today the radar's "traveler pain" category comes only from web search. Reports would give it data no competitor has | **What changed.** Visa, fee, strike and outage signals for destination pages, after a person checks each one |
| A reason for industry buyers to pay: "where expectations fail, by destination and by type of traveller" | A revenue line that doesn't depend on selling travellers anything, which keeps the consumer side honest |
| A credible story for the case study: the radar has a source of its own | Daily sweeps that keep destination pages current between reports |

**The business logic:** the consumer side stays free and honest because the industry side pays. That only holds if
the line between them is strict:
- Industry buyers get **aggregates over a threshold**, never individual reports.
- **Travellers consent to it in the report form, from the first report.** Consent can't be added later to data
  that's already collected. That's why it's in Phase 1 of `05`.
- Nobody can pay to change a verdict. Put that sentence on the About page.

## What this means for the nav

There's no big restructure yet. The current nav is Profile · Destinations · Real Trips · Safety, plus the radar as
planned in `docs/22`.

| Now | After Phase 2 (`05`) |
|---|---|
| Profile | Profile |
| Destinations | Destinations, where each page leads with its Reality Check and a lens switcher |
| Real Trips | Real Trips, with "Report your trip" as the main call to action |
| Safety | Safety & changes, once What changed passes its gate |
| Radar, per `docs/22` | Radar, labelled "For the travel industry" |

The `docs/22` panel still works. Only its audience line and the relationship wording change (`06`).
