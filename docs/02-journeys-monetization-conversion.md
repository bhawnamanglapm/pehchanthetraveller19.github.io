# User Journeys, Monetization Map, Conversion Strategy & Analytics

> Planning artifact 2 of 3.

---

## 1. The business principle

```
Inspire → Discover → Plan → Compare → Book → Return
```

Traffic → Trust → Email audience → Affiliate clicks → Bookings → Revenue →
Brand partnerships → Repeat users.

Page views are an input, not the goal. Every template is judged on whether it
moves a visitor one step to the right.

---

## 2. Primary user journeys

**J1 — "I want to travel somewhere beautiful." (the success test)**
Home hero → *Explore Destinations* → region → destination guide → *Where to
stay* → hotel page → *Check Availability* (outbound, tracked).
Alternate exit at every step: *Build this trip* → AI Trip Planner → save/share.
Target: destination → commerce intent in under three clicks.

**J2 — Search-led (dominant at scale).**
Google → destination guide or "best time to visit X" → in-guide next-steps block
→ hotels / experiences → outbound booking. Newsletter capture mid-scroll.

**J3 — Planner-led.**
Home → *Plan My Trip* → preferences → generated day-by-day itinerary →
each day carries a stay + an experience → outbound links → save trip → email
the itinerary to myself (newsletter capture with genuine value exchange).

**J4 — Story-led (top of funnel).**
Social → story → destination → itinerary → planner. Slowest to convert, best for
audience and brand trust; this is the journey that makes partnership revenue
possible.

**J5 — B2B.**
Hotel marketing manager or tourism board → sees a hotel/destination feature →
footer or masthead *Partner* → partnership page → enquiry form → lead.

**J6 — Return.**
Newsletter → new destination or journey → saved trips → planner. Phase 2 turns
the local-only wishlist into an account.

---

## 3. Monetization map

| # | Stream | Surface | Mechanism | Status |
|---|---|---|---|---|
| 1 | Hotel affiliate commission | Hotel pages, destination "where to stay", planner results, collections | `partner-slot` → outbound tracked link to booking network | Architecture live, partner IDs pending |
| 2 | Tours & activities | Experience pages, itinerary days, planner results | Same slot mechanism, activity networks | Architecture live |
| 3 | Flights & transport | Destination "how to get there", itinerary transport rows, planner | Same, where commercially feasible | Architecture live |
| 4 | Sponsored content | Partner page, sponsored features | Fixed-fee campaigns, always badged `Sponsored` | Page live, sold manually |
| 5 | Premium trip planning | Planner result → "Have this designed for you" | Lead form → paid engagement | Seam live, service not activated |
| 6 | Digital products | Journeys, tools | Paid downloadable itineraries/planners | Roadmap Phase 3 |
| 7 | Newsletter — The Weekly Escape | Everywhere | Audience asset; sponsorship + owned distribution | Live (capture) |

**Monetizable surface per template**

- Destination guide → stays, experiences, itinerary, planner, newsletter
- Hotel → booking CTA, alternative hotels, nearby experiences, destination guide
- Experience → booking CTA, where to stay, itinerary containing it
- Itinerary → per-day stay + experience CTAs, *Build This Trip*, download
- Planner result → stay, experience, transport per day + premium planning offer
- Story → destination, itinerary, planner
- Tool → the product the tool implies (budget → stays; packing → gear; visa → services)

**Guard rails (non-negotiable).** No fabricated prices, availability, reviews,
ratings, awards or scarcity. Price is expressed as a *band* (`$`–`$$$$`) with an
explicit "indicative, verify with the provider" note. Affiliate and sponsored
placements are badged at the point of the link, not only in a footer policy.

---

## 4. Conversion strategy

Every page ends with a `next-steps` block — never a dead end, never more than
three choices, always ordered *primary intent, adjacent intent, low-commitment*.

```
Destination guide : Explore hotels  →  Explore experiences  →  Build itinerary
Hotel             : Check availability → Nearby experiences → Alternative stays
Experience        : Book experience  →  Where to stay      →  Destination guide
Itinerary         : Build this trip  →  Book the stays     →  Download / share
Story             : Explore the destination → View the journey → Plan a trip
Planner result    : Book stays → Book experiences → Save & email the trip
Tool              : Relevant stays / journeys → Planner
```

**Email is the compounding asset.** Capture points: home, mid-guide, planner
result, itinerary download, deals, tools. Each asks once, never on load, never
as an interstitial.

**Honest CTAs.** "Check Availability" (accurate — we hand off), not "Book now,
2 rooms left" (fabricated).

---

## 5. Analytics & business intelligence

Provider-neutral event layer: `assets/js/analytics.js` exposes `track(name,
props)`, buffers before consent, and forwards to GA4 / Plausible / a warehouse
endpoint once configured in `src/content/site.json`. Nothing fires without a
configured destination, so the site ships privacy-clean by default.

**Event taxonomy**

| Event | Key properties | Answers |
|---|---|---|
| `page_view` | template, region, country, destination, contentType | Which clusters earn traffic |
| `affiliate_click` | partner, network, entityType, entitySlug, destination, position, ctaLabel | Revenue attribution, top hotels |
| `outbound_click` | host, context | Leakage vs. monetized exits |
| `planner_start` / `planner_generate` / `planner_result_click` | style, budget, days, travellers, interests | Planner value and its funnel |
| `newsletter_view` / `newsletter_submit` | placement | Which surface builds the list |
| `partner_enquiry_submit` | businessType, partnershipType, budgetBand, country | B2B pipeline |
| `search` / `search_result_click` | query, resultCount, resultType, rank | Demand signals; content gaps |
| `save_item` / `share_trip` / `download_itinerary` | entityType, slug | Return-intent, product-market fit |
| `tool_use` | tool, inputs summary | Which tools deserve investment |
| `scroll_depth` / `read_complete` | template, slug | Genuine engagement vs. bounce |

**Dashboard concept** (`/dashboard/`, a non-functional design spec, clearly
labelled): traffic and users; top destinations by revenue-per-session; affiliate
clicks and click-through rate by partner; conversion rate; top-performing
content; partner leads; newsletter growth; planner usage. Built as a wireframe
so the metric definitions exist before the pipeline does.

**Instrumentation rules.** Affiliate clicks are tracked on the anchor, not the
card, so the number means what it says. Outbound links use
`rel="sponsored noopener"` where commercial, `rel="noopener"` otherwise.
