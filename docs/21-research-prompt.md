# Research & blueprint prompt for Pehchan

Written 4 Oct 2026, in the shape of the LedgerLens prompt the founder liked.
Paste the block below into a capable model with web search enabled.

Two things make this different from a generic "design my travel app" prompt,
and both matter:

1. **It carries the real constraints.** Zero users, no entity, one founder,
   n=3 validation, and MakeMyTrip already shipping the safety layer. A prompt
   that hides those gets back a plan for a company that doesn't exist.
2. **It names the things already decided**, so the output builds on Stages 1–5
   rather than re-deriving them badly.

---

```
Act as a Senior Product Manager, Consumer Marketplace Strategist, Trust & Safety
product lead, and UX strategist.

I am building PEHCHAN THE TRAVELLER, a solo-travel confidence platform for
Indian women. The core insight, and the only part with real-world evidence, is
that an Indian woman is stopped twice: once by her own uncertainty about the
practical parts, and again by a family who will not agree. Travel companies
address neither — they sell destinations to people who have already decided to
go and who already have permission.

A working product exists at https://bhawnamanglapm.github.io/pehchanthetraveller19.github.io/
Static site, zero dependencies, 82 pages. It includes:
- A TRIP DOCUMENT builder: she enters a plan, it produces a printable four-page
  A4 document for her family — day-by-day itinerary, travel legs with
  automatically computed connection times (tight connections flagged), named
  stays with phone numbers, a budget with calculated subtotals separating fixed
  from optional spend, and a check-in section. Everything is computed, nothing
  typed twice.
- A COMFORT PROFILE engine: 12 axes (flying, trains, buses, driving, taxis,
  being out after dark, hostels, homestays, eating alone, meeting strangers,
  changing places, no connectivity), each scored 1-5 by the traveller and 1-5
  by the destination, matched to answer "can I do this?" with per-axis reasons.
- A TRIP REPORT pipeline: a 42-field structured form capturing planned vs
  actual spend, confidence before and after the trip, what went wrong, what she
  wishes she'd known — with a verification step and a 12-hour review promise.
- SAFETY BY JOURNEY: checklist, WhatsApp "I'm OK" buttons, calendar check-in
  reminders.
- INCIDENT REPORTING: deliberately separate from trip reports, never stored in
  a spreadsheet, never published, no draft autosave.
- Voice input in 7 Indian languages. Installable PWA with offline support.

EVIDENCE BASE — treat this as the ground truth and do not inflate it:
- ONE observed case: a complete itinerary was written for a woman in permanent
  government employment, shown to her parents, and it persuaded them.
  Permission followed. n=1, the founder's own family, self-reported.
- THREE real survey responses (a fourth is the founder's own test). All three
  report family influence over the decision. All three scored "travelling with
  people I met online" at 1 out of 5 — the lowest item in the instrument.
  NONE would book a solo trip or a women-only trip.
- NFHS-5 (2019-21): 42% of Indian women are permitted to go alone to the
  market, a health facility and outside their community. Only 47% even in the
  richest wealth quintile — income barely moves it, and the figure rose just
  one point from 41% in five years.
- NCRB 2024: ~4.45 lakh recorded crimes against women; the largest category is
  cruelty by a husband or his relatives at 27.2%. Recorded crime against Indian
  women is overwhelmingly domestic, not something that happens on the road.
- Google Trends: "women solo travel" hit a 15-year high in Q1 2026, peaking in
  Mumbai, Delhi and Bengaluru.

HARD CONSTRAINTS — a plan that ignores these is useless to me:
- ZERO users. Nobody outside the build has used the product. Nobody has paid
  anything, ever.
- ONE founder, part-time, no capital, no team, no entity, no GST registration.
- No custom domain, so both app stores are currently blocked.
- Analytics have never been connected; there is no traffic baseline at all.
- The destination content is empty: 27 destinations exist as honest
  "guide in progress" pages, all unvisited, none with a comfort demand vector,
  so the matching engine has nothing to match against.
- The trip report corpus has ZERO entries.

COMPETITIVE REALITY — already researched, build on it, correct it if wrong:
- The women-only travel category in India is twenty years old and has never
  raised outside money. WOW Club (2005, ~Rs 18 crore revenue, 3,000-4,000
  travellers a year, 125 trips, 12 staff), Girls On The Go (2008), F5 Escapes
  (2013), Jugni (2014), The Flapper Life (2016), Women on Clouds, Wandering
  Jane. All bootstrapped. The category's only published margin is 10%.
- Veena World and Kesari serve the same segment at national scale and already
  guarantee a roommate at no single-occupancy charge, which the specialists do
  not — F5 Escapes prices Ladakh at Rs 58,000 with a Rs 19,750 single
  supplement, so a woman alone pays 34% more.
- In 2026 MakeMyTrip shipped women-centric safety signals across ~97,000
  properties and 3,500 bus operators: women's reviews with AI summaries,
  safety amenity indicators, female-only adjacent bus berths. They are also
  building AI travel discovery with OpenAI.
- CONCLUSION ALREADY REACHED: do not become the ninth tour operator, and do not
  compete on verified stays, safety signals or AI itinerary planning. Challenge
  this conclusion if the evidence warrants, but do not ignore it.

WHAT I WANT FROM YOU:

1. MARKET RESEARCH
Research and analyse, for India primarily and globally where instructive:
women-focused travel operators and communities, solo-travel platforms,
user-generated travel content platforms, trust and verification products, and
any product anywhere that helps someone get permission or buy-in from family
for a personal decision (this last category may not exist in travel — look at
healthcare, education, migration and financial products). Compare across:
audience acquisition, content supply, trust and verification mechanics,
personalisation, monetisation, retention, community moderation, and unit
economics. Cite sources and dates; flag anything you could not verify.

2. PRODUCT VISION
The problem solved, for the traveller and for the family who must agree.
Target personas, written as falsifiable hypotheses rather than invented
characters, and say what evidence would disprove each.
Use cases: first solo trip, a group of friends where several families must
agree, a married woman needing spousal agreement, a daughter planning for her
parents, an NRI planning from abroad, pilgrimage travel.
Value proposition and the specific differentiation that survives MakeMyTrip.

3. CURRENT MARKET CAPABILITIES
What is commonly available already: destination guides, reviews, itinerary
builders, group departures, safety features, community forums, buddy matching,
booking and payments, UGC and creator content, loyalty.

4. ADVANCED / DIFFERENTIATING CAPABILITIES
Candidates to evaluate, not accept: the family-facing document; a comfort/demand
matching engine; "reality check" cards comparing expectation against what
travellers reported; confidence shift measured before and after a trip;
verified first-hand reports with provenance and sample size shown; an
expectation-versus-reality layer over destination content; permission-conversation
support; post-trip memory products; creator partnerships with ordinary
travellers rather than influencers.

5. END-TO-END FLOW
Design the full journey: discovery -> "can I do this?" -> plan -> the family
conversation -> permission -> booking (done elsewhere) -> travel -> check-ins ->
return -> trip report -> that report improving the next woman's decision.
Name the component at each stage and where the loop currently breaks.

6. PRODUCT MODULES
Define the architecture: discovery and destination content; the comfort profile
engine; the document builder; the trip report pipeline with verification and
moderation; reality-check cards; safety and check-ins; incident reporting
(isolated); search; notifications; a creator or contributor layer; admin and
moderation console; analytics; payments if justified.

7. OPERATIONS CONSOLE
Workflows for: verifying a trip report within 12 hours; handling a report that
describes harassment and must never be published; moderating a contributor;
correcting a destination's comfort vector when reports contradict it; handling
a request for deletion under the DPDP Act; escalating a safety complaint about
a named business.

8. TRUST, VERIFICATION AND INTEGRITY ENGINE
Design how a first-hand report is verified without making contribution
unbearable: evidence of travel, consistency checks against stated dates and
costs, duplicate and brigading detection, synthetic or AI-generated text
detection, identity handling for anonymous contributors, and what is published
versus withheld. Note the existing rule: a named property plus exact dates
plus a lone woman is an identification, so one of the three is always removed.

9. DECISION / MATCHING ENGINE
Design the "can I do this?" engine: comfort axes, destination demand vectors,
the gap calculation, how a verdict is phrased so it reassures rather than
ranks, confidence thresholds, what it must never claim (it must never tell a
woman a place is safe), how it degrades when a destination has no data, and
how trip reports update destination demand over time.

10. API AND TECHNICAL ARCHITECTURE
The product is currently a static zero-dependency site with no backend and no
accounts, which is a deliberate privacy posture: the document is built in the
browser and never transmitted. Propose what must change and what must not.
Cover: where state becomes necessary, authentication only if justified, report
submission and moderation, media handling and EXIF stripping, PII handling and
retention, encryption, consent capture, any LLM usage on user text and the
controls around it, cost per user, monitoring, and scaling. Argue explicitly
for keeping things client-side wherever it is defensible.

11. USER JOURNEYS
Detail: a woman who has never travelled alone and does not want to; a woman
whose family has already said no once; a group of four friends needing four
families to agree; a 50-something married woman needing spousal agreement; a
contributor filing her first trip report; a moderator handling a harassment
disclosure filed in the wrong place; a destination with zero reports.

12. MVP, PHASE 2, PHASE 3
Prioritise with MoSCoW and explain each placement. Mark clearly what already
exists in the current build versus what is new. Given zero users, state
explicitly which items are worthless until there is an audience, and what the
sequencing should therefore be.

13. PRD FOR THE MVP
Problem statement, goals, non-goals, personas as hypotheses, user stories,
functional and non-functional requirements, acceptance criteria, success
metrics, dependencies, risks, assumptions.

14. METRICS
Recommend a North Star and its input metrics. Candidates to assess: documents
produced; documents shown to a family; permissions granted; trip reports
filed; confidence shift before versus after a trip; destinations with a
complete comfort vector; contributor retention; paid conversions. For each,
say how it is measured with no backend and no analytics currently connected.

15. UX AND INFORMATION ARCHITECTURE
Screen-by-screen structure, mobile-first. Note that the current design has been
criticised as dated: heavy letter-spaced uppercase, no display typeface, no
photography anywhere, and a cool palette for a product whose job is warmth and
reassurance. Propose a direction and justify it.

16. COMPETITIVE GAP ANALYSIS
Table: Feature | Commonly available | Advanced | Opportunity for Pehchan |
Priority. Do not copy existing operators. Identify genuine problems for Indian
women and their families that remain poorly solved.

17. FINALLY
Recommend 3-5 high-impact ideas that could become the defining capabilities.
For each: the user problem, the workflow, expected business value, complexity,
and an MVP approach that works with zero users and zero budget.

HOW TO ANSWER:
- Distinguish ASSUMPTION from EVIDENCE every time, and label which.
- Where I need to verify something myself, say EVIDENCE REQUIRED.
- Name TRADE-OFFs and RISKs explicitly.
- Do not invent statistics, user quotes, personas or market sizes. If a figure
  is unavailable, say so — I would rather have a gap than a guess. There is no
  reliable public figure for women's share of Indian travel spend; do not
  produce one.
- Challenge my premises, including the conclusions above, where the evidence
  supports it.
- Prefer what works at n=0 over what works at scale.

REGULATORY AND LEGAL — flag anything needing professional validation:
- DPDP Act 2023: consent, purpose limitation, data minimisation, the rights of
  a data principal, and the position of a sole proprietor as data fiduciary.
- Collecting and publishing user-generated content about named businesses:
  India has criminal as well as civil defamation, so publishing "this hotel
  did X" unmoderated is the single highest-risk action available.
- Handling harassment and assault disclosures: duty of care, mandatory
  reporting, and what must never be published.
- Selling travel advice for money: scope, limitation of liability, and whether
  a travel agency registration, GST registration (Rs 20 lakh services
  threshold, or any inter-state supply, SAC 998551, 5% without input tax credit
  versus 18% with) or Ministry of Tourism recognition is required. Note that
  Ministry recognition requires three years of operation and Rs 3 lakh
  turnover.
- Consumer protection and e-commerce rules on claims made about safety.
- Advertising standards on travel claims.
- Minors, and any contributor under 18.
```

---

## What to do with the answer

Treat the output as a research memo, not a plan of record. Anything it proposes
that needs other people — community, matching, Q&A, marketplace — is worthless
until the audience exists, and the prompt says so. The parts worth acting on
first are the ones that work at n=0.
