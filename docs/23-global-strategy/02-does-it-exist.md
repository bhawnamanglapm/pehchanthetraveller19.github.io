# 02 — Has someone already built this?

The brief asks for something unique enough "that people don't think such websites already exist". This is the check.

## The map

| Category | Who | What they answer | What they don't | Do we compete? |
|---|---|---|---|---|
| AI trip planners | Mindtrip, Layla, Wanderlog, Gemini, Booking and Tripadvisor AI | "What should I do there?" | "Will it be what I expect?" | **No.** Saturated, with booking inventory we'll never have |
| Review sites | Tripadvisor, Google Maps | "Is this hotel or restaurant good?" | "Was the *trip* worth it, for someone like me?" Reviews rate places, not trips | **No**, but we inherit their fraud problem |
| Forums | Reddit, TripAdvisor forums | "What did one person experience?" | How many people, which kind of people, and in what proportion | **Partly.** We turn anecdotes into counts |
| Guidebooks and blogs | Lonely Planet, Culture Trip, thousands of blogs | "What's there?" | Anything measured. AI now summarises them | **No.** The old Pehchan already lost here (`docs/08`) |
| Disruption alerts | TripIt Pro Risk Alerts, Sitata, Strike Tracker | "Is my booked trip affected?" | "Should I still go?", asked before booking | **Adjacent.** Our "What changed" is for the deciding stage |
| Entry requirements | Sherpa, IATA Timatic | "What documents do I need?" | What changed recently, and what it means for people like me | **No.** Link to them, don't rebuild |
| Personality quizzes | The Spot For Me, Woofound, Hilton | "Which destination suits my type?" | Evidence. Output is a guess, not data | **We differ by design.** Profile filters real reports |
| Group planning | Kayak Trip Huddle, Mindtrip group chat | "Which option do we vote for?" | "How do I get the people who must say yes to say yes?" | **No.** The Trip Document is a different job |
| Women's tour operators | WOW Club, Wandering Jane and others (`docs/17`) | "Take me on a safe group trip" | Independent truth about destinations | **No.** Don't become the ninth (`docs/17`) |
| Big OTA women's features | MakeMyTrip women's safety features (`docs/17`) | "Is this stay safe for women?" | Anything beyond their own inventory | **No.** It's their feature, not our product |
| Industry intelligence | Skift, PhocusWire, Riskline | "What's happening in travel?" | "Which traveller problems are worth building for?" | **The radar is here**, as a small, cheap, specific tool |

## The gap, stated precisely

**Nobody in this map publishes, per destination and per type of traveller, how often the trip lived up to
expectations, what it really cost against the plan, and what people wish they'd known, with the sample size on
every number.**

The pieces exist separately:
- the national disappointment surveys in `01` (finding 4)
- anecdotes on Reddit
- star ratings for places

**The combination doesn't**, and the combination is what's defensible:

1. **A different unit.** The unit is *the trip as experienced*, not the place as rated. Reviews can't become this
   without asking different questions.
2. **A lens.** The comparison is with people like you. A generic average hides the thing you care about.
3. **Honesty as a feature.** n is shown on every card, and the empty state says "Nobody has reported this yet"
   (`docs/20`). A large platform with an engagement target can't easily ship a product that says "we don't know".
4. **First-party data compounds.** Each report makes the next visitor's answer better, and an AI answer has to cite
   it rather than replace it.

## Why people won't think "this already exists"

> **Superseded on 7 Nov 2026.** The owner chose not to lead with verdict cards. The first thing a visitor sees is
> now an ask box and voices from people like them (`07`). The card below is kept as a record, and per-destination
> counts may still appear later as a small detail, never as the front door. For the competitive check of the new
> direction (Reddit Answers, TikTok search, local-Q&A apps), see `07`, "Why this stands out in an AI world".

~~Because **the first thing they see isn't a destination guide, a chat box or a star rating. It's a verdict**:~~

```
┌──────────────────────────────────────────────┐
│  BALI · for first-time international travellers │
│                                                 │
│  Lived up to it:       {x} of {n}               │
│  Spent vs planned:     +{y}%  (median)          │
│  Felt more confident:  {z} of {n}               │
│  Most common "wish I'd known": {theme}          │
│                                                 │
│  n = {n} · last report {date} · how this works  │
└──────────────────────────────────────────────┘
```

*The placeholders are deliberate. There's no data yet, and the card obeys the `docs/20` thresholds:*
- *no averages below 3 reports;*
- *numbers from 3 reports, with "from n reports" beside them;*
- *ranges from 6.*

*With lenses, those thresholds apply to each destination × lens cell (D-8 in `06`).*

The empty state is just as distinctive: "No first-timers have reported on Bali yet. Be the first. It takes 6
minutes." No incumbent ships that sentence.

## The limits of this check

- It's desk research on one day. I didn't use product databases (Crunchbase, Product Hunt search, app-store
  scraping). **Before spending money on the repositioning, spend an hour on those three, searching for "expectation
  vs reality", "trip verdict" and "travel truth".**
- Someone may be doing this in another language (Chinese, Korean, German travel apps). I didn't check.
- "Nobody does X" is also what you'd find if X doesn't work. **The risk isn't a competitor. It's that travellers
  won't submit reports.** That's why Phase 1 in `05` tests submissions before anything else.
