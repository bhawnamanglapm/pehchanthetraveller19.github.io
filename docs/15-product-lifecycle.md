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
| 1 Discovery | 🟠 **Assumed, never written** | The problem was circled over many turns; never stated once as a problem, a segment and a job |
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

> An Indian woman who wants to travel alone is stopped twice: once by her own
> fear of the practical parts, and again by a family who will not agree.
> Travel companies address neither. They sell destinations to people who have
> already decided to go.

The second half is the part nobody builds for, and it is the one this product
found first: the survey's permission gradient runs from *"some influence"*
through *"significant influence"* to **"I cannot travel without their
approval."**

## The job she is hiring us for

Not *"find me a destination."* It is:

> **"Tell me honestly whether I can do this, help me believe it, and give me
> something my family will accept."**

Three parts, in that order. Most travel products answer none of them.

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

## Why now

- Government alerts on tourist fraud; women travelling alone are the
  disproportionate victims
- Adventure-sector safety guidelines are voluntary, so nothing is verified
- Indian women's independent travel is rising, and no product addresses the
  family conversation

## What success looks like at this stage

Not revenue. Not traffic.

**50 completed survey responses**, enough to confirm or kill the
family-permission hypothesis and to pick one segment of the three.

## Explicitly not doing

- Not building for all three segments at once
- Not writing destination content until a segment is chosen
- Not taking payments, or an entity, before there is demand to serve

---

## What happens next, in order

| Stage | Next action | Blocked by |
|---|---|---|
| **1 Discovery** | ✅ This document | — |
| **2 Market** | Research women's travel in India: who else, how good, how big | Nothing. Do next. |
| **3 Validation** | Talk to five women first, then drive the survey to 50. Instagram bio, Google Form | The founder, five hours |
| **4 Positioning** | Rewrite `site.json` brand copy once a segment is chosen. **Re-examine the word "solo"** — `docs/16`, finding 1 | Stage 3 |
| **8 Quality** | Put it in front of five real women and watch | Nothing |
| **9 Launch** | Content, distribution, a reason to visit | Stage 3 |
| **10 Measure** | Connect analytics — one config line | Nothing |

Stages 2, 8 and 10 are blocked by nothing at all.
