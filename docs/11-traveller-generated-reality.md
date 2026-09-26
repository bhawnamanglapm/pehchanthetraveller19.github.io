# Traveller-generated reality

Recorded 26 Sep 2026 from the founder's second product brief. It extends
`docs/10` with the `RETURN` half of the loop — what a woman records after a
trip, and how that becomes the thing the next woman relies on.

---

## The strategic shift

> Don't build Pehchan around travel content.
> Build it around **traveller-generated reality**.

Not *"here is what you can do"* but *"here is what women like you actually
experienced."*

This is the most defensible thing said about the product so far, and it is the
same thesis that survived every previous turn — verification as the asset —
now sourced from travellers rather than from the founder. It is also the only
version that scales past one person's legs.

---

## My Travel Experience — post-trip capture

**1. The trip.** Destination · dates · duration · solo/friends/group · first
solo trip? · age group (optional) · starting city.

**2. Planned vs actual.** Budget planned against actual spend; itinerary
planned against what happened; and what changed — transport delay · weather ·
more expensive than expected · changed accommodation · added activities · felt
uncomfortable somewhere · found something better locally.

This is the single highest-value question in the brief. Brochures state plans.
Only a returning traveller can state outcomes.

**3. "What I wish I knew before going."** Near-mandatory, free text.

> *"The airport transfer takes much longer than Google Maps suggests."*
> *"The area around the hotel becomes very quiet after 9pm."*
> *"Don't underestimate how much cash you need in smaller towns."*

**4. "What surprised me."** ❤️ best surprise · ⚠️ biggest disappointment ·
😍 hidden gem · 🚩 something I would avoid.

**5. Something went wrong.** Explicitly invited, across fourteen categories
(transport, accommodation, money, connectivity, navigation, stranger
interaction, documentation, lost belongings, weather, health, safety, food,
booking, other). Then: what did you do · was it resolved · what would you
recommend another woman do.

A platform that is artificially positive is useless for the decision it exists
to support. The "what did you do" answer turns a complaint into a
problem-solving database.

**6. Solo comfort journey.** Confidence before the trip and after it, on the
same five-point scale — *"you started this trip nervous and came back
confident."*

**7. What I could do alone.** A checklist she ticks: took a flight alone · took
a train alone · used local transport · checked in alone · ate alone · went
sightseeing alone · trekked · met strangers · joined a group activity ·
navigated an unfamiliar city · handled a problem alone.

Across trips this becomes a **growth record**. It is the emotional core of the
product, and nothing else in travel does it.

**8. Would you do it again,** and for whom — first-time solo · experienced
solo · with family · on a budget. Plus self-tagged suitability (introverts,
social travellers, slow travellers, short breaks, and so on).

**9. What I spent.** Line items — transport, stay, food, activities, local
transport, miscellaneous — against what she expected. Real numbers from real
trips beat any estimated budget.

**10. Packing reality.** What she used, what she did not, what she would pack
next time.

**11. My local discovery.** Hidden café, viewpoint, women-owned business, local
guide, quiet spot — pinned and added.

**12. My exact route.** The real sequence of the journey, which another woman
can then choose to travel.

---

## What it produces

### Real women's experience, in place of star ratings

> **Women who stayed here said…**
> 92% felt comfortable staying alone · 87% would stay again ·
> 76% found transport easy · 68% recommended arriving during daytime

Plus anonymised quotes. Vastly more useful than five stars, and it answers the
question actually being asked.

### Reality Cards

Per destination, property or activity: women travellers · verified trips ·
average actual spend · most common positive · most common challenge · most
useful tip · best suited for · last updated.

Paired with **expected vs experienced** — what travellers thought they were
getting, against what they got. This is the signature feature.

### Women Who Went Before You

> *18 women from your city travelled here in the last 12 months.*

Anonymous entries with duration, actual spend and how experienced the traveller
was. The emotional payload is the entire point: **"I am not the first woman
doing this."** That is the problem Pehchan exists to solve, stated precisely.

---

## Integrity mechanics

These are what stop the dataset rotting, and they are not optional.

| Mechanic | Rule |
|---|---|
| **Verified Trip** | Evidence supplied (booking, stay, transport, activity). Show `✓ Trip verified` only — never the documents. |
| **Community Experience** | Submitted but unverified, and labelled as such. The distinction is the credibility. |
| **Visibility** | Per contribution: 🟢 public · 🟡 members · 🔵 anonymous · 🔴 private, improves Pehchan only. Essential for sensitive experiences. |
| **Business response, not deletion** | A business may reply. It may never remove legitimate traveller feedback. |
| **Last verified** | Every safety-relevant fact carries a date and a count of who confirmed it. |

---

## Risks specific to this half

`docs/10` covers duty of care, defamation and DPDP. Three more arrive with
user-generated content:

1. **"92% felt comfortable" needs a denominator.** A percentage from four
   responses is misleading in exactly the way a star rating is. Suppress
   aggregates below a threshold and always show n.

2. **Verification evidence is personal data.** Booking confirmations carry
   names, addresses and card fragments. Verify, record the outcome, and do not
   retain the document.

3. **Negative experiences about named businesses are the defamation exposure
   from `docs/10`, arriving through a different door.** "Something went wrong"
   and business listings must not be wired together until moderation and a
   right of reply exist.

---

## Where this sits in the build

The capture form needs no backend to *start* — the Women & Travel survey is
already proving that route. A post-trip form collecting sections 1–12 could run
today and begin accumulating the dataset months before the app that displays it
exists.

Everything that *displays* the result — reality cards, aggregates, women who
went before you — needs a server, and needs n to be greater than zero. Until
then those surfaces should show honest empty states, in the manner this
repository already uses for unwritten guides.

**The dataset is the moat, and it starts with one form and one returning
traveller.**
