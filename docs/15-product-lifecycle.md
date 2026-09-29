# The product lifecycle, and where Pehchan actually is

Recorded 29 Sep 2026. Everything built so far was built in response to a
conversation rather than to a process. This document puts a process around it,
places the existing work inside it, and names what was skipped.

It supersedes nothing; it organises everything.

---

## The ten stages

| | Stage | The question it answers |
|---|---|---|
| **1** | **Discovery** | Whose problem, and is it worth solving? |
| **2** | **Market** | Who else solves it, how big is it, why us? |
| **3** | **Customer validation** | Do real people say what we assume they say? |
| **4** | **Positioning** | What are we, in one sentence, and what are we not? |
| **5** | **Definition** | What exactly are we building, and in what order? |
| **6** | **Design** | How does it look and behave? |
| **7** | **Build** | Does it exist? |
| **8** | **Quality** | Does it work, for real people, on real devices? |
| **9** | **Launch** | Does anybody know it exists? |
| **10** | **Measure & iterate** | Is it working, and what changes next? |

Wrapped around all of them: **Operations** — entity, tax, legal, support.

---

## Where we actually are

| Stage | State | Evidence |
|---|---|---|
| 1 Discovery | 🟢 **Written and researched** | All eleven parts present, 29 Sep. Alternatives, severity, moat, assumptions, constraints and exit criteria are sourced, not assumed |
| 2 Market | 🔴 **Researched the wrong market** | Real research on pilgrimage logistics, adventure safety, government schemes — then we pivoted to women's travel and never researched *that* market at all |
| 3 Validation | 🟠 **Started, stalled** | Survey live since 23 Sep. **4 responses, one of them the founder's own test.** n=3 — see `docs/16` |
| 4 Positioning | 🟠 **Decided four times, never applied** | `site.json` still reads *"Journeys & Stays / Handcrafted journeys. Beautiful stays."* — the media-era copy. "Find your identity" appears nowhere on the site |
| 5 Definition | 🟢 **Done** | `docs/10`, `docs/11`, the nine points |
| 6 Design | 🟢 **Done** | Product redesign, one type family, cool neutrals, 44px targets |
| 7 Build | 🟢 **Done** | 85 pages, the profile engine, six product surfaces, PWA, voice |
| 8 Quality | 🔴 **Barely started** | Build integrity checks exist and caught real bugs. But: no automated tests, **nobody outside this session has ever used it**, no device or accessibility pass |
| 9 Launch | 🔴 **Not started** | Site is live and nothing points at it. Instagram bio unchanged, no content, no form connected |
| 10 Measure | 🔴 **Blind** | `analytics.provider` is `null`. Zero visitors measured, ever |
| Ops | 🔴 **Not started** | No entity, no GST, no legal review |

## The pattern, stated plainly

**Stages 5, 6 and 7 are done thoroughly. Stages 1, 2, 3, 8, 9 and 10 are barely
touched.**

That is the classic order to get wrong: define, design and build at length,
while skipping the validation that tells you whether to build it and the
distribution that decides whether anyone sees it.

Three specific consequences:

1. **The market was never researched.** Competitive work was done on pilgrimage
   and adventure. Then the product became women's solo travel, and no research
   followed it. We do not know who else serves this, how well, or how large it
   is. That is the most important gap in this document.

2. **Three real survey responses are steering a whole product.** The
   family-permission insight now rests on three women and some reasoning. All
   three report family influence over the decision, and rate their family's
   likely support at 2.0 out of 5 — so the hypothesis is holding. It is still
   not validated. `docs/16` reads the responses in full.

3. **Nothing measures anything.** The analytics layer was built and never
   connected, so even after launch there would be no signal — the site could
   take a thousand visitors and we would not know.

None of this invalidates what exists. The product definition is strong and the
build is real. But the next work is not more building.

---

# Stage 1 — Discovery

Done properly here for the first time.

## The problem

> An Indian woman who wants to travel is stopped twice: once by her own fear of
> the practical parts, and again by a family who will not agree. Travel
> companies address neither. They sell destinations to people who have already
> decided to go — and who already have permission.

The second half is the part nobody builds for, and it is the one this product
found first: the survey's permission gradient runs from *"some influence"*
through *"significant influence"* to **"I cannot travel without their
approval."**

**The word "alone" was removed from this statement on 29 Sep**, after reading
the survey. None of the three respondents wants to travel solo (`docs/16`,
finding 1). The problem is permission and competence, not solitude. Everything
downstream that still says *solo* is inherited from an earlier draft and is
listed as assumption 4 below.

## The job she is hiring us for

Not *"find me a destination."* It is:

> **"Tell me honestly whether I can do this, help me believe it, and give me
> something my family will accept."**

Three parts, in that order. Most travel products answer none of them.

*"This"* is whatever trip she is actually considering — with friends, with a
group, or alone. The job does not require her to be solo, and reading it as if
it does is what produced the solo framing now in question.

## Who — three hypotheses, not findings

With n=3 these are segments to **test**, not personas to design against. Each
is written so it can be proved wrong. `docs/16` scores them against the
responses received so far.

**A. The metro professional (25–35).**
Earns her own money, parents still have a significant say, blocked by annual
leave more than by cost. Wants nearly every safety feature offered. *Source:
**two** survey respondents, plus the shape of the Instagram audience.*
*Test:* does leave, not money, come up as the main blocker at n=30?
*Status 29 Sep:* two of two name time — "limited annual paid leave", "timing".
The only segment with more than one data point.

**B. The older married woman (45–60), smaller town.**
Cannot travel without spousal approval, low comfort across almost everything,
budget around ₹10,000, wants the whole trip arranged, leans religious.
*Source: one survey respondent.*
*Test:* does she exist in numbers, and will she pay anything at all?
*Status 29 Sep:* still exactly one. No second instance has appeared.

**C. The NRI daughter.**
Abroad, planning for herself or her parents, has money, no local knowledge, no
one to trust. *Source: reasoning from the fraud research, not from any
respondent.*
*Test:* pure conjecture until one appears in the data.
*Status 29 Sep:* still zero. Should stop being listed as a segment until one
appears.

**The segments are very different.** A product that serves A well probably
serves B badly. Choosing between them is a real decision and it has not been
made.

## What she does today — the alternative we have to beat

Researched 29 Sep 2026. This is the section that decides whether the product is
needed, and it was missing.

**She does not use a travel agency. She uses a feed.** Across Indian travellers,
67% rely on travel reviews, 55% on social media and 51% on personal
recommendations; 60% say their trip *inspiration* comes from Instagram,
Facebook or YouTube. Our own three respondents said the same: Instagram, Google
Search, Google Maps, YouTube, ChatGPT, friends and family.

**And a real, funded, women-only competitive set already exists.** It is older
and larger than the strategy docs assumed:

| Operator | Since | Shape | Price signal |
|---|---|---|---|
| **WOW Club** | 2005 | Women-only trips, founded by Sumitra Senapaty | — |
| **F5 Escapes** | ~2014 | Bangalore. All-women fixed departures, groups of 8–10. Founder Malini Gowrishankar | Day trips from **₹4,400** |
| **Jugni Travels** | recent | Women-only groups built around solo travellers. Claims 5,000+ women. WhatsApp-first support | Trips from **~₹48,999** |
| **Women on Clouds** | — | Trips plus a paid members' club ("White Clouds"), meetups, workshops | — |
| **The Flapper Life** | — | All-female team, every traveller assigned a "Flapper Buddy" trip manager | — |
| Wander Womaniya, WeGoBond, WoVoyage, Bukit | — | Smaller group operators | — |

Two things follow.

**First, "women-only travel in India" is a twenty-year-old category, not a gap.**
WOW Club has been running since 2005. Anything positioned as *"finally, travel
for Indian women"* is factually late and will read that way.

**Second — and this is the opening — every one of them sells a trip.** They are
tour operators. Not one of them sells the thing our survey says is the actual
blocker: **the conversation with her family before any trip is booked.** Jugni's
own marketing answers "which group should I join"; nobody answers "how do I get
permission to go".

Note also that Jugni, one of the largest women-only operators, was founded by
two men. Being a woman who has actually travelled is a differentiator that
exists in this market and is not fully taken.

**The competitor to beat is not F5 Escapes. It is her giving up.** Her realistic
alternatives today are: join an existing women's group trip (solved, by five
companies), or plan it herself from Instagram and ChatGPT, or not go. The third
is what our survey respondents mostly do — all three travel just 1–2 times a
year.

## How badly it hurts — severity and frequency

**The planning cost is large and measured.** Over 60% of Indian travellers spend
**more than 10 hours** planning a single trip; 39.5% spend up to 20 hours and
24.2% spend 40 hours or more. Our three respondents reported 5–10, 2–5 and 2–5
hours. At 1–2 trips a year, this is a painful but *infrequent* cost — which
matters: infrequent pain does not sustain a subscription, and it is a poor fit
for a habit-forming app. It suits a service bought per trip.

**The permission problem is real, measurable and national.** This is the
strongest external evidence found, and it supports the product's core thesis:

> In **NFHS-5 (2019–21)**, **42% of Indian women** were "usually allowed to go
> alone" to all three of the market, a health facility, and anywhere outside
> their own village or community — 56% the market, 52% a health facility, 50%
> outside the community.

**The movement over five years is the finding: 41% → 42%.** In NFHS-4 (2015–16)
it was 41% (54% / 50% / 48%), with 6% permitted none of the three. One
percentage point in half a decade. This is not a problem that is solving itself.

Two gradients from NFHS-4, which reports the breakdowns:

- Age 15–19: **22%**. Age 40–49: **55%**. Permission is granted with age.
- Poorest wealth quintile: 35%. **Richest quintile: 47%.** Money barely moves it
  — even among the wealthiest Indian women, **fewer than half** may go out
  alone. Earning her own money does not buy her permission.

That last line is the single most useful fact in this document. It says the
family gate is not a poverty problem that economic growth will dissolve, and it
is exactly why a product aimed at the family conversation can exist at all.

**But be honest about what this number is not.** Three limitations, each of
which a sharp reader will find:

1. **It measures everyday mobility, not leisure travel.** The market and the
   health facility are not a five-day trip to Goa. Permission for one does not
   imply permission for the other — it almost certainly *understates* the
   barrier for travel, but that is an inference, not a measurement.
2. **It measures permissibility, not autonomy.** The question asks whether she
   is *allowed*, not whether she decides. Critics of the instrument note it
   never asks whose permission, or how it is negotiated.
3. **The state spread makes it unreliable as a proxy.** Himachal Pradesh 82%,
   Mizoram 75%, Sikkim 66% — but **Kerala 15%**, the lowest in India, in the
   state with the highest female literacy. A measure that ranks Kerala last is
   capturing a norm about how the question is answered, not freedom itself.

Use the 42% as evidence that the constraint exists and is not shrinking. Do not
use it to size a market. **Haryana's own figure was not looked up and should
be** — it is where the founder is.

**The fear is not irrational — though the data is a proxy.** NCRB recorded 192
cases with **foreign** victims in 2022, up 28% from 150 in 2021, including 28
rapes. Between 2016 and 2022, only 16 of 148 rape cases involving foreign
victims reached court and **7 ended in conviction — under 5%** — with 56% still
pending at investigation. The rate of crimes against women in India overall rose
12.9% between 2018 and 2022.

**These are figures about foreign tourists, not about Indian women travelling
domestically.** No equivalent dataset for Indian women travellers was found, and
the two populations are not interchangeable. What the conviction rate does show
— under 5%, 56% stuck at investigation — holds regardless of victim
nationality, and that is the part a worried family is reacting to: not the odds
of something happening, but what follows if it does.

**The market is moving, fast, off a small base.**

- **30%** of Indian women who booked accommodation in 2023 were travelling by
  themselves (Airbnb)
- Zostel: **92,192** solo female bookings in 2025, against 33,357 in 2018 and
  18,372 in the 2020 low — roughly 5× the pandemic floor
- Scapia reports solo travel among women growing **~9× year on year**
- India's online travel market is ~**US$23–24bn** in 2025; domestic is 78.5% of
  it, on 2,948 million domestic visits in 2024

**What could not be found:** no reliable figure exists for women's *share of
travel spend* in India, and no public data on what women-only operators earn.
The market size for this specific segment is unknown, and should not be
estimated. Anyone quoting a number for it is guessing.

## Why now

Each line here now has a number behind it.

- **The behaviour is growing fast off a small base.** Zostel's solo female
  bookings: **33,357 (2018) → 18,372 (2020 low) → 92,192 (2025)** — roughly 5×
  the pandemic floor and near 3× the pre-pandemic level. Scapia reports ~9×
  year-on-year growth. 30% of Indian women booking accommodation in 2023
  travelled alone.
- **The blocker has not moved with it.** Freedom of movement went **41%
  (NFHS-4, 2015–16) → 42% (NFHS-5, 2019–21)** — one point in five years, and
  only 47% even in the richest quintile. Demand is growing against a constraint
  that is not shrinking, and nobody is selling into it.
- **The incumbents are twenty years old and all sell the same thing** — a seat
  on a trip. None sells the family conversation.
- Adventure-sector safety guidelines remain voluntary, so nothing is verified by
  anyone but the operator selling it.

## Why us — what kind of advantage actually survives here

Roughly **80% of travel startups fail.** The failure causes named repeatedly in
the post-mortems are, in order:

1. **No differentiation.** "Simply integrating AI isn't enough" — the exact
   strategy `docs/08` once proposed. Big OTAs replicate features quickly.
2. **Building without validating.** Founders back an idea without testing it —
   which is precisely what the audit at the top of this document found.
3. **Not knowing the sector's economics** before starting.

The defence named just as repeatedly is **community**: a space where travellers
share stories and experiences builds trust that competitors struggle to
replicate. That is a real finding, not a slogan, and it points at a specific
answer for this product.

So the advantage cannot be the app, the AI, or the idea of women-only travel —
all three are already taken or easily copied. On the evidence, only three things
here are hard to copy:

| Claimed advantage | Copyable? | Status |
|---|---|---|
| A founder who has actually done the travel, writing from her own trips | **No** — it took years to acquire | **Unverified.** Needs the real trip count, destinations and dates written down |
| Verified first-hand reports from other Indian women, accumulated | **No** — it compounds and cannot be bought | **Zero collected so far.** The machinery is built; the corpus is empty |
| Owning the *family* conversation rather than the booking | **Not yet** — no competitor sells it | **Built, untested.** Claim rests on operators' public marketing read via search, not a page-by-page audit — verify before using it in a pitch |
| Women-only positioning | **Yes** — five operators, one since 2005 | Not a moat |
| AI itinerary planning | **Yes** — named as a failure mode | Not a moat |

**This section cannot be finished from research.** The first row is a claim only
Bhawna can substantiate, and until the actual travel history is written down —
where, when, how long, alone or not — "she has done it herself" is an assertion,
not an asset. That is the highest-value hour available in Stage 1.

## Assumption register

Every belief this product rests on, ranked by what it would cost to be wrong,
each with a condition that kills it. A belief with no kill condition never dies
— it just gets built on.

| # | We believe | Evidence now | **Dead if** |
|---|---|---|---|
| **1** | Family permission is the real blocker, not destination choice | NFHS-4: 41% of women may go out alone; only 47% in the richest quintile. Our n=3: all report family influence, mean family support 2.0/5 | At n=30, fewer than half report family influence — **then the Family Pack comes out** |
| **2** | She will pay for reassurance, not just for a trip | 3 of 3 said "definitely/probably" pay extra. **No one has paid anything** | 20 people see a price and fewer than 2 proceed |
| **3** | First-hand reports from Indian women beat operator marketing | Named in the research as the one defensible moat | 10 women read a real report and a polished operator page and prefer the operator page |
| **4** | She wants to travel *solo* | **Contradicted already.** 0 of 3 would book a solo trip (`docs/16`) | Already failing. At n=20, if under 20% want solo, **the word comes out of the positioning** |
| **5** | Women-only is what she wants | **Contradicted.** Women-only groups rated 3.7/5, female trip leader 3.7, female drivers 2.7 — the lowest-scoring ideas in our survey | Already weak. Do not build women-only supply on this |
| **6** | A woman who has done it herself is more trusted than a company | Untested. Jugni is founded by two men and is among the largest | Instagram engagement on founder-voice posts is no better than on generic posts |
| **7** | The NRI daughter segment exists | **Zero evidence, zero respondents** | Already dead as a segment. Remove it until someone appears |

Assumptions 4 and 5 are already in trouble, and both are load-bearing for the
current positioning. That is the finding of this stage.

## Constraints — what is actually possible, and when

Researched, not assumed. These set the ceiling on Stage 1 and 2.

**Government recognition is three years away, structurally.** Ministry of
Tourism *Approved Tour Operator* recognition requires a **minimum of 3 years of
operation**, ₹3 lakh minimum annual turnover, full-time qualified staff, proper
office premises and a track record. No amount of product quality shortens this.
The earlier goal of "being recognised by Indian government tourism bodies"
cannot be met before roughly 2029 on this route, and planning around it now is
wasted effort.

**There is no single travel agency licence in India.** What is actually
required, in order:

| Requirement | Trigger | Note |
|---|---|---|
| Company or LLP registration (SPICe+, MCA) | Before trading | NIC 79110 travel agency / 79120 tour operator |
| Shop & Establishment registration | On having a place of business | State-level |
| **GST registration** | Turnover over **₹20 lakh** for services, **or any inter-state supply** | SAC **998551**. Sources conflict on the ₹40 lakh figure — that is the *goods* threshold. **Confirm with a CA before relying on it** |
| GST rate election | At registration | **5% without input tax credit** or **18% with ITC** — a real decision that depends on the model |
| IATA accreditation | Only to issue international air tickets | Optional. Strict financial tests |
| Ministry of Tourism recognition | 3 years in, ₹3 lakh turnover | Optional, but the only route to "government recognised" |

**What this means for sequencing.** Nothing above is needed to run a survey,
publish verified reports, or charge for a planning consultation under the ₹20
lakh threshold within one state. Everything above is needed the moment money is
taken for travel across state lines. The entity is therefore a **Stage 4–5
problem, not a Stage 1 problem** — but the *3-year clock* on government
recognition only starts when the entity is registered, so if that recognition is
genuinely wanted, registering early is the one thing worth doing ahead of need.

**The binding constraint is not legal or technical. It is founder hours.**
Everything outstanding in this document — five interviews, the travel history,
the first trip reports, the Instagram bio, driving the survey — needs Bhawna
specifically and cannot be delegated to this repository.

## Exit criteria — the rule for leaving Stage 1

Not revenue. Not traffic. A target is not a rule, so here is the rule.

**Leave Stage 1 when all three hold:**

1. **n = 50 completed survey responses**, and **one segment is at least 40% of
   them.** If no segment reaches 40%, the segmentation is wrong and gets re-cut
   — that is not a reason to carry on into Stage 2 with three segments.
2. **Five recorded conversations**, one hour each, at least three of them with
   the leading segment. A form cannot answer assumption 4.
3. **Assumptions 1, 4 and 5 each resolved** — confirmed or killed against the
   conditions in the register above. Not "leaning towards". Written down.

**Do not leave Stage 1 on a deadline.** The cost of arriving in Stage 2 with the
wrong segment is every downstream stage built on it.

## Explicitly not doing

- Not building for all three segments at once
- Not writing destination content until a segment is chosen
- Not taking payments, or an entity, before there is demand to serve
- Not building women-only supply — female drivers, female trip leaders,
  women-only groups. They are the lowest-rated ideas in our own survey and the
  most crowded part of the market
- Not planning around government recognition, which is three years out by rule

## What this section still owes

Audited 29 Sep, after writing. All eleven parts are present; these are the known
soft spots, recorded rather than papered over.

| Gap | Why it matters | Who can close it |
|---|---|---|
| Haryana's NFHS-5 freedom-of-movement figure not looked up | It is the founder's own state and the likeliest first market | Research — 10 minutes |
| No dataset on crime against **Indian** women travelling domestically | The NCRB figures used are about foreign tourists. The proxy is flagged, not fixed | Research — may not exist publicly |
| Operator claims rest on marketing pages read via search summaries, not audited page by page | The "nobody sells the family conversation" claim is the whole opening | Stage 2 |
| No evidence anyone will pay anything | Assumption 2 is completely untested | A price test, not a survey |
| The founder's actual travel history is not written down | It is row 1 of the moat table and currently an assertion | **Only Bhawna** |
| Segment C is still listed although it has zero evidence | Internal inconsistency; assumption 7 says remove it | One edit, once agreed |

## Sources

Everything in the four research sections above traces to one of these. Figures
are as published; where two sources disagree the disagreement is stated in the
text rather than resolved silently.

- NFHS-5 (2019–21) freedom of movement, 42%, and state spread — [Feminism in India](https://feminisminindia.com/2022/12/07/what-nfhs-data-says-or-does-not-say-about-womens-freedom-of-movement/), [NFHS-5 India report (DHS)](https://dhsprogram.com/pubs/pdf/FR375/FR375.pdf)
- NFHS-4 (2015–16) breakdowns by age and wealth quintile — [Ideas for India](https://www.ideasforindia.in/topics/social-identity/urbanisation-gender-and-social-change-women-s-mobility-in-north-india), [SPRF](https://sprf.in/womens-mobility-and-public-transportation/)
- Critique of the freedom-of-movement instrument — [Feminism in India](https://feminisminindia.com/2022/12/07/what-nfhs-data-says-or-does-not-say-about-womens-freedom-of-movement/), [The Lancet](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)00338-0/fulltext)
- NCRB crimes against foreign victims, conviction rates — [Deccan Chronicle](https://www.deccanchronicle.com/news/ncrb-says-192-foreign-tourists-raped-in-2022-1870366), [CJP](https://cjp.org.in/mapping-gender-based-violence-in-india-trends-determinants-and-institutional-frameworks/)
- Solo female travel growth, Airbnb and Zostel figures — [Outlook Traveller](https://www.outlooktraveller.com/News/solo-confident-and-on-the-move-new-data-reveals-how-indian-women-are-redefining-travel), [Curly Tales](https://curlytales.com/india/trending/solo-female-travel-surges-in-with-bookings-goa-jaipur-gokarna-top-picks/), [Women's Media Center](https://womensmediacenter.com/news-features/women-in-india-join-global-trend-of-increased-solo-travel)
- Trip-planning behaviour and hours — [bestmediainfo](https://bestmediainfo.com/insights/over-60-of-indian-travellers-spend-more-than-10-hours-planning-a-trip-12236034), [MMGY Travel Intelligence](https://mmgyintel.com/indian-travellers-go-global-safety-social-media-and-sustainability-stand-out-in-new-mmgy-study/), [Business Traveller](https://www.businesstraveller.com/business-travel/smarter-savvier-how-indians-are-travelling-in-2025/)
- Women-only operators, history and pricing — [F5 Escapes](https://f5escapes.com/), [Local Samosa](https://www.localsamosa.com/business/women-only-travel-clubs-10777336), [The Better India](https://thebetterindia.com/346981/solo-women-travel-groups-india-wovoyage-bukit-jugni-wander-womaniya-wegobond/), [Tweak India](https://tweakindia.com/living/travel/travel-groups-for-women-india-solo-vacation/), [Al Jazeera, 2013](https://www.aljazeera.com/features/2013/10/19/all-women-travel-takes-off-in-india)
- Travel startup failure modes — [Hotelier India](https://www.hotelierindia.com/travel/why-travel-startups-fail-and-how-to-build-one-that-lasts), [Failory](https://www.failory.com/startups/travel-failures), [TNMT](https://tnmt.com/startup-graveyard/)
- Registration, GST and Ministry of Tourism recognition — [LegalWiz](https://www.legalwiz.in/blog/how-to-open-a-travel-agency-in-india), [Razorpay Rize](https://razorpay.com/rize/blogs/how-to-start-a-travel-agency/), [eStartIndia](https://www.estartindia.com/knowledge-hub/blog/how-to-get-a-travel-agent-license-in-india), [Online Legal India](https://www.onlinelegalindia.com/blogs/gst-registration-for-tours-and-travel/)
- Market size — [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/online-travel-market-in-india), [IBEF](https://www.ibef.org/industry/tourism-hospitality-india)

Tax and company-law figures here are research, not advice. Confirm the GST
threshold and rate election with a CA before acting on them.

---

## What happens next, in order

| Stage | Next action | Blocked by |
|---|---|---|
| **1 Discovery** | ✅ This document. Remaining: write down the real travel history (see *Why us*) | The founder, one hour |
| **2 Market** | Partly done in *What she does today* above. Remaining: pricing and positioning of the five named operators, page by page; their actual scale; whether any is profitable | Nothing. Do next. |
| **3 Validation** | Talk to five women first, then drive the survey to 50. Instagram bio, Google Form | The founder, five hours |
| **4 Positioning** | Rewrite `site.json` brand copy once a segment is chosen. **Re-examine the word "solo"** — `docs/16`, finding 1 | Stage 3 |
| **8 Quality** | Put it in front of five real women and watch | Nothing |
| **9 Launch** | Content, distribution, a reason to visit | Stage 3 |
| **10 Measure** | Connect analytics — one config line | Nothing |

Stages 2, 8 and 10 are blocked by nothing at all.
