# Segment surveys — replacing one long form with three short ones

Written 29 Sep 2026, at the founder's direction: *"my data was just a normal
survey, not covering all segments. We should make for segments."*

Correct on both counts, and the second problem turns out to be smaller than the
first.

---

## Two problems with the instrument we have

### 1. It is 101 questions long

Counted, not estimated: the response sheet runs to column CW. At twenty seconds
a question that is **about thirty-four minutes**.

Four responses in six days was read in `docs/18` as a distribution problem. It
is at least as much an instrument problem. **Nobody fills in a thirty-four
minute form for a stranger on Instagram**, and the fact that three people did
says more about who they are than about how many might.

### 2. It pools people who cannot be pooled

The three real respondents are a 25–30 metro freelancer, a 51–60 married woman
in a town who cannot travel without her husband's approval, and a 25–30 metro
professional. Averaging them produces numbers that describe nobody.

**This applies to the analysis in `docs/16` and it is a fair criticism of it.**
Statements there of the form *"women-only groups rated 3.7"* are a mean of
three incomparable people. The *direction* of those findings may hold; the
figures should not be quoted as if they were segment-level truth, and anywhere
they have been, that was an overreach.

What survives pooling is only what was **unanimous**, because unanimity across
different people is the one thing a tiny mixed sample can legitimately show:

| Finding | Status |
|---|---|
| All three report family influence over the decision | **Holds.** Unanimous |
| "Travelling with people I met online" scored 1/5 | **Holds.** Unanimous, and the lowest item in the instrument |
| Not one would book a solo trip or a women-only trip | **Holds.** Unanimous |
| Women-only groups "rated 3.7" | **Withdraw.** A mean of three incomparable people |
| Safety features ranked in order | **Withdraw.** Same reason |

---

## The fix: three short surveys, one screener, one shared core

Each form is **twelve to fourteen questions, about three minutes**. The three
map onto the audience roadmap, so each one tests the phase it belongs to.

### The screener — one question, asked first

> **Which sounds most like you?**
> - I travel alone, or I want to → **Form 1**
> - I travel with friends or family → **Form 2**
> - I'd consider joining a trip with women I haven't met → **Form 3**

Multiple answers allowed; route on the first. A woman who picks more than one is
herself a finding.

### The shared core — six questions, identical in all three forms

Identical wording matters more than it sounds: it is the only thing that makes
the three segments comparable later.

1. **Age group** — Under 25 / 25–30 / 31–35 / 36–40 / 41–50 / Over 50
2. **Where do you live** — Metro / Small city / Town or village / Outside India
3. **If you want to take a trip, how much influence does your family have over
   the decision?** — None / Some / Significant / *I cannot travel without their
   approval*
4. **What would make your family more comfortable about you going?** —
   *checkbox:* complete itinerary · hotel name and address · a phone number they
   can call · transport details · regular check-ins · emergency contacts ·
   knowing who else is going · nothing would · they are already comfortable
5. **Would you pay for help with this?** — Definitely / Probably / Maybe / No
6. **Your email or Instagram, and would you talk to me for thirty minutes?** —
   Yes / No

**Question 6 exists to fix a specific failure.** `docs/18` found that the long
survey produced at most one interviewable person out of three, because the
consent question sat at the end of a thirty-four minute form. At question six of
twelve it will do better.

---

## Form 1 — Solo travellers

*Tests assumption 4, and therefore the positioning decided on 29 Sep.*

7. **Have you ever travelled alone?** — Never · Only within my city · Once or
   twice · Many times
8. *(If never or city-only)* **What stops you?** — *checkbox:* safety ·
   family would not agree · don't know how to plan · cost · no time · I would
   not enjoy it · nothing, I just haven't yet
9. **Think of a trip you wanted to take alone and didn't. What stopped it?** —
   *short text*
10. **If everything were arranged, paid for and safe — would you rather go alone
    or with people?** — Alone / With people / Depends on the trip
11. **Why?** — *short text*
12. **How do you plan a trip now?** — *checkbox:* Instagram · Google · YouTube ·
    ChatGPT or AI · friends and family · booking sites · a travel agent
13. **Roughly how long does planning take you?** — Under 2 hours · 2–5 · 5–10 ·
    over 10 hours
14. **What is the hardest part?** — *checkbox:* choosing where · budgeting ·
    finding safe places to stay · building the itinerary · local transport ·
    knowing what to avoid · **telling my family**

**Question 10 is the one that matters.** It is the survey form of the interview
question in `docs/18`, and it decides whether the word *solo* in the positioning
is speaking to anyone. Four-fifths choosing *with people* changes the descriptor.

---

## Form 2 — Women who travel in groups

*Tests phase 2, and the claim that a group is worth more to this product than a
solo traveller.*

7. **Who do you usually travel with?** — *checkbox:* female friends · mixed
   friends · partner · parents · siblings · colleagues
8. **When your group plans a trip, who actually does the planning?** — me ·
   one other person · we split it · nobody, it drifts
9. **How many families need to agree before your group trip actually
   happens?** — None · 1 · 2–3 · 4 or more · I've never counted
10. **Has a group trip ever fallen through? What happened?** — *short text*
11. **What usually goes wrong in the planning?** — *checkbox:* nobody decides ·
    dates never line up · budgets don't match · someone's family says no ·
    booking too late · it just fades out
12. **Would you rather one person planned the whole thing and sent it to
    everyone?** — Yes / No / Depends who
13. **Would you pay for that, split across the group?** — Definitely /
    Probably / Maybe / No

**Question 9 is the thesis test.** If group trips routinely need three or four
families to agree, the document is worth more per trip in phase 2 than in phase
1, exactly as the roadmap claims. If the answer is usually "none", the thesis
is wrong and phase 2 is just a bigger booking.

---

## Form 3 — Joining a group of strangers

*Tests phase 3, which currently rests on the lowest-scoring item in the whole
existing survey.*

7. **How comfortable would you be joining a trip with women you have never
   met?** — 1 to 5
8. **What would make you more comfortable?** — *checkbox:* background
   verification · seeing the other travellers' profiles beforehand · a video
   call before booking · a woman leading the trip · someone I know having
   travelled with them · reviews from other women · nothing would
9. **Would you share a room with a woman you had never met?** — Yes / Only if I
   could choose / No
10. **What would your family say about it?** — *short text*
11. **Have you ever done it? What happened?** — *short text*
12. **What would worry you most?** — *checkbox:* who the others are · the
    company's reliability · being stuck with people I don't like · safety ·
    money · my family finding out

**Set expectations low here.** All three existing respondents scored
*"travelling with people I met online"* at **1 out of 5** — unanimous, and the
lowest item in the instrument. If Form 3 comes back the same way, phase 3 is not
dead, but its entire job is answering question 8.

---

## How many responses are needed

Honest arithmetic, because "n=50" was never broken down by segment.

| | Responses | What it buys |
|---|---|---|
| **10 per form** | 30 | Directional. Enough to see a lopsided answer to question 10 or question 9 |
| **25 per form** | 75 | Enough to say a segment is real, and to compare the three on the shared core |
| **50 in one form** | 50 | Enough to make one segment a decision |

**Target 25 per form.** Below 10 in a form, do not quote percentages from it —
report the raw counts and say n out loud, which is the discipline that was
missing the first time.

## What happens to the existing survey

**Keep the responses. Retire the form as the primary instrument.**

The three real responses stay valid as three individual accounts; they were
never wrong, they were just over-read. The long form still has a use: as the
**deep-dive sent after an interview**, to someone who has already spent an hour
and will finish it. That is the only population for whom thirty-four minutes is
realistic.

## What this changes in `docs/18`

The Stage 3 plan assumed the constraint was distribution and prescribed one
post plus an Instagram bio change. Both still apply. But the first fix is the
form itself: **1,000 people seeing a link to a thirty-four minute survey
produces almost nothing.** The short forms come first, then the traffic.
