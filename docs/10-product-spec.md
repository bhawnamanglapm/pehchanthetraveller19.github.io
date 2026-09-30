# Product specification — the solo travel confidence engine

Recorded 26 Sep 2026 from the founder's product brief. This is the fullest
statement of what Pehchan is for, and it supersedes `docs/08` where they
conflict: the business is a women's travel platform, not a cross-border
heritage and boutique agency.

> **Re-cut 29 Sep 2026.** The ten components below are unchanged as
> descriptions and still worth reading. What changed is their **weight and
> order**, because three things happened after this was written: one component
> acquired real evidence, two acquired a competitor with national distribution,
> and the thing labelled "the moat" turned out not to be it. The re-cut is the
> next section; individual components carry a dated status line where it
> applies, and the Sequencing section at the end has been rewritten.

---

## The spine

```
DREAM → CONFIDENCE → PLAN → MATCH → TRAVEL → SUPPORT → RETURN
```

Every feature below belongs to one stage, and the last stage feeds the first
for the next woman. `RETURN` is not an epilogue — it is where the dataset comes
from.

**The spine holds. Its centre of gravity moved.** Two of the seven stages now
carry the product: **PLAN**, because a document that wins permission is the one
thing here with evidence behind it, and **RETURN**, because accumulated
first-hand reports are the one asset `docs/17` found that a competitor cannot
buy. The other five earn their place by feeding those two.

---

## The re-cut — what carries weight now

| | Component | Weight | Why it changed |
|---|---|---|---|
| **3** | **Share with Family** | **First. This is the product** | Written for a real traveller, shown to her parents, and it won permission (`docs/15`). The only component with observed evidence |
| — | **Trip reports** (`docs/11`) | **Second. This is the moat** | `docs/17`: accumulated first-hand content is the one defensible asset in a category where ~80% fail on differentiation. **Currently zero entries** |
| 1 | First Solo Trip Engine | Supporting | Establishes what she can handle, which is an input to the document |
| 2 | "Can I do this?" score | Supporting | Same. The reassurance half of the job |
| 6 | Safety by journey | Supporting | The check-in schedule is a section of the document |
| 9 | Travel memory | Supporting | Feeds RETURN |
| 10 | Voice | Supporting | An input method, not a feature |
| **5** | **Pehchan Local** | **Retire, or shrink hard** | MakeMyTrip now surfaces women's safety signals across **~97,000 properties** with structured partner data. A hand-built directory cannot compete on coverage or freshness |
| **8** | **Last verified** | **Retire** | Same territory, same competitor. Verification freshness at scale is an inventory problem |
| **4** | **Trust Layer** | **Reassign to phase 3** | Not a feature of this product. Vetting strangers is the whole of the third phase of the audience roadmap, and is years out |
| **7** | **Incident reporting** | **Keep. Relabel** | Still worth building, still gated on legal review, but it is **not** "the moat" — see below |

### On Pehchan Local and Last verified

Neither is a bad idea and neither was badly specified. They lost to arithmetic.
Verification is a coverage game: a property directory is worth what its breadth
and recency are worth, and an incumbent with a supply relationship with every
hotel in India will always have more of both. `docs/17` records this as the
2026 development that most changed the plan.

If anything survives here it is the **narrow** version: a handful of places the
founder has personally stayed, written in her own voice, which is exactly the
thing MakeMyTrip's structured partner data cannot produce. That is trip report
content, not a directory.

### What the build still ships, and what that means

A definition change is not a build change, and the two now disagree. The site
still ships `/local/` and `/local/join/`, and the `last_verified` signal
machinery is still in the templates.

**That is deliberate for now, not an oversight.** Removing live pages is a
destructive change and belongs in Stage 7 with a decision behind it, not as a
side effect of re-reading the spec. But the disagreement should not sit
unresolved: either those surfaces come out, or `/local/` shrinks to the
founder's own stays written in her own voice, which is the one version an
incumbent's structured partner data cannot reproduce.

Whoever picks this up should note that Pehchan Local lists **no real
providers**. The content file holds eight categories and three entries, and all
three are marked `sample: true` — the unmissably-labelled placeholders, a
photographer in Goa, a trek guide in Bir Billing, a driver in Amritsar.
Retiring it therefore removes machinery and samples, not content anyone
contributed.

### On "the moat"

Section 7 below is titled *"Incident reporting → the moat"*. That title is
withdrawn. `docs/17` found the defensible assets to be the founder's own travel
history and the accumulated body of first-hand reports; incident reporting is a
public good this product should probably offer, and a serious legal exposure it
should not rush. Those are different things from a moat.

---

## 1. The First Solo Trip Engine

A woman answers two sets of questions.

**About me** — age range · city · travel experience · languages · diet ·
budget · work schedule · physical activity level.

**My comfort** — rated across twelve axes:

| | |
|---|---|
| Flying alone | Hostels |
| Trains | Homestays |
| Buses | Eating alone |
| Driving | Meeting strangers |
| Taxis | Changing hotels |
| Walking at night | Travelling without internet |

Out of it comes a **Solo Travel Profile**:

> **Solo Explorer — Level 1**
> Comfortable travelling independently, but prefers daytime arrivals,
> women-friendly accommodation, reliable private transfers, 3–5 day trips,
> moderate activity, and access to a women traveller community.

The shift this makes is the whole point: she is not browsing destinations, she
is **finding out what kind of traveller she is.** That is a reason to come back
before she has any intention of booking.

## 2. The "Can I do this?" score

Not a safety rating. A **Trip Readiness Profile**, per destination:

travel complexity · first-solo suitability · transport complexity · language
considerations · night-arrival considerations · connectivity · accommodation
availability · local support · emergency infrastructure · estimated budget ·
solo-woman community.

And the line that matters:

> **"Why this destination may or may not suit *you*."**

Never *"this is a safe destination."* Absolute safety claims are both
untrue and a liability. The product states practical considerations against
*her* stated comfort, and lets her decide.

### The architecture underneath

**The comfort vector and the destination complexity vector are the same
shape.** Twelve axes, scored 1–5 on both sides. Matching is a comparison:

```
gap[axis] = destination.complexity[axis] − traveller.comfort[axis]
```

Any axis where the gap is positive is a reason this trip may not suit her, and
it names itself. That gives an explanation rather than a number — *"Kaza needs
comfort with travelling without internet (4); you rated yourself 2"* — which is
exactly the output the brief asks for, and it falls out of the model rather
than being written by hand per destination.

**This runs entirely client-side.** The profile lives in browser storage, the
destination vectors ship in the static build. No backend, no account, no
personal data leaving the device — which is also the honest answer to a woman
being asked to disclose what she is afraid of.

> **So sections 1 and 2 are buildable on the current static site, now.**
> Everything below needs a server.

## 3. The trip document  *(was: Share with Family)*

> **Specified properly 30 Sep 2026.** What stood here was fourteen lines
> describing a URL-based "pack". That predates the evidence, and it predates
> the build. This is the component the whole product now rests on, so it gets a
> real specification.

### What it is

**A four-page A4 document, printed by the traveller's own browser, that a woman
puts in front of her family.** Not a link, not a web page she sends. A parent
is *shown* something.

The evidence for this shape is narrow but it is the only evidence the product
has: one such document was written, shown to a traveller's parents, and it won
permission (`docs/15`). The survey independently ranks *"complete itinerary"*
and *"hotel details"* above every safety feature as what makes a family
comfortable.

### Who it is written for

**The family, not the traveller.** This is the line that makes the document
different from every itinerary on the internet, and every choice below follows
from it. The traveller already knows where she is going. The document exists so
that somebody who is worried can stop being worried without having to ask her
for anything.

Practical consequence: it is written in the third person about her, not the
second person to her, and it answers questions before they are put.

### Privacy posture — and the trap in it

**The document is private and carries exactly what a published trip report must
never carry.**

`docs/12` forbids publishing a named property together with a date range,
because "a named property, a date range and a lone woman is an
identification". **That rule does not apply here, and must not be applied
here.** The document is sent by the traveller to her own family, and the named
hotel plus the dates is the single most-requested thing in it.

The two artefacts are opposites and must never be confused by anyone building
on this:

| | The document | A published trip report |
|---|---|---|
| Audience | Her family, chosen by her | Anyone on the internet |
| Property named | **Yes — the point of it** | Only without the dates |
| Exact dates | **Yes** | Only without the property |
| Route | Never leaves her device | Reviewed, then published |

**Nothing in the document is transmitted anywhere.** It is assembled in the
browser, saved in `localStorage` on her own device, and printed locally. There
is no account, no upload and no copy retained. Any future change that sends
document contents to a server is a change to this contract and needs saying out
loud.

### Anatomy

Seven blocks, in this order. Mandatory means the document is not worth sending
without it.

| | Block | Status | Contents |
|---|---|---|---|
| 1 | **Cover** | Mandatory | Wordmark, destination, date range, route, who it is for, and a stat line: days/nights, places, estimated total |
| 2 | **Day by day** | **Mandatory** | One row per stop: time, place, what she is doing, priority. Add-on rows hang off the stop above them |
| 3 | **Travel** | Mandatory if she is flying or on a train | Each leg with service, origin, departure, destination, arrival — and the connection between legs |
| 4 | **Stays** | **Strongly recommended, not mandatory** | Place, nights, property, **phone number**, address |
| 5 | **Budget** | Mandatory | Grouped lines with subtotals, fixed separated from optional, and a total |
| 6 | **Staying in touch** | Optional | Her number, check-in cadence, who else knows, emergency numbers, insurance |
| 7 | **Footer** | Mandatory | Brand and contact, repeated on every printed page |

**Why stays are not mandatory.** The one document known to have worked named no
property at all — "Port Blair 2 nights, ₹10,000" — and the family said yes
anyway. So the honest rule is that it is the strongest single line available
and the document still functions without it. A phone number a parent can dial
themselves does more than any promise; it is simply not the thing that makes or
breaks the yes.

### What the system computes rather than asks for

This is where the document earns its price. A traveller supplies facts; the
document supplies arithmetic she would otherwise get wrong.

- **Leg durations and total journey time**, from the departure and arrival she
  entered, handling legs that cross midnight as an overnight roll.
- **Connection gaps between legs**, labelled: **under 60 minutes is flagged as
  tight**, three hours or more as long. A fifty-minute change of plane belongs
  on the page a family reads, not discovered at the airport.
- **Budget subtotals and totals**, from the lines above them, so a figure can
  never drift out of step with what it sums. Optional spending is totalled
  separately from fixed, and lines marked excluded are shown and not counted.
- **Nights, day count and place count** for the cover.

Nothing on the cover or in a total is typed by hand.

### What it must never contain

- **Anything about harassment or assault.** There is a private route for that
  which is never published and never stored in a spreadsheet. A document that
  gets forwarded around a family is the worst possible place for it.
- **Another person's contact details** without their agreement — a local
  friend's number goes in only if she has asked them.
- **Invented certainty.** An unnamed hotel should read *"to be confirmed"*, not
  a plausible-sounding placeholder. A family that catches one invented detail
  stops believing the rest of the page.
- **Any claim the business cannot stand behind.** The document reports what she
  has booked and planned. It does not certify that a property is safe.

### Acceptance criteria

A document is finished when all of these are true:

1. A parent who has never discussed the trip can answer **where she is, when,
   and who to call** without asking her anything.
2. Every figure on the cover and in every total is **calculated**, not entered.
3. Any connection under an hour is **visibly flagged**.
4. It prints to A4 with the brand on **every** page, and no block is split
   across a page fold where it fits on one.
5. It contains nothing she would mind a relative forwarding to another
   relative.
6. The rupee sign renders. (Not a joke — it is why the document is printed by
   the browser rather than by a hand-rolled PDF writer.)

### Packaging — what ₹2,500 buys

The price and its derivation are in `docs/18`; this is the scope attached to it.

**Included:** one trip of up to eight days · the full document, all seven
blocks · research into the transport options and costs · **one round of
changes** · delivered as a PDF within **three working days**.

**Not included, and stated plainly to the buyer:** no bookings are made and no
payments are handled on her behalf; the document reports her plan, it does not
execute it. No property is certified as safe. Prices are researched at the time
of writing and are not held.

> **Open, and it blocks taking money.** Selling advice creates exposure the
> site's existing legal pages do not cover — privacy, terms, cookies, affiliate
> disclosure and editorial standards say nothing about a paid advisory
> relationship. A short scope-and-liability paragraph needs to exist **before
> the first payment**, not after it. Recorded in `docs/15` as an open gap.

### Build status

Built and shipping at `/family/` since 29 Sep, with the arithmetic above
covered by 34 assertions in `src/test-document.mjs` that check the parsers
against the real Andaman itinerary's published figures.

**Not yet true of it:** no human outside this session has used it. The first
honest test is the founder rebuilding her own Andaman itinerary inside the tool
and finding out whether it is faster than how she made it the first time.

## 4. The Trust Layer

> **Status 29 Sep: reassigned.** Not a feature of the current product. Vetting
> strangers is the entirety of phase 3 of the audience roadmap, and all three
> survey respondents scored *"travelling with people I met online"* at 1 out of
> 5 — the lowest item in the instrument. Build it when phase 3 is funded by
> phases 1 and 2, and treat it as a second business with its own case.

Verifiable signals, never a composite score:

🟢 phone verified · identity verified · women-only verified · previous trips ·
community reputation · report history

A "98% trusted" badge is a claim the platform cannot stand behind and a user
cannot interrogate. A list of what was checked, and when, is both honest and
more useful.

## 5. Pehchan Local

> **Status 29 Sep: retire, or shrink to the founder's own stays.** MakeMyTrip
> shipped women's safety signals across ~97,000 properties in 2026. A directory
> competes on coverage and recency, and this one cannot win either.

Verified women providers per destination — photographer, trek guide, driver,
food experience, yoga instructor, doctor, salon, café owner.

Commercially the strongest item in the brief: a two-sided marketplace where
supply is women-owned businesses that are currently invisible online, and the
verification *is* the product.

## 6. Safety by journey

Not another panic button — dedicated products exist, and Sangati already ships
SOS and live location in India.

| Before | During | After |
|---|---|---|
| Emergency contacts | Optional live location | Check-out |
| Insurance | Check-in reminders | Report an incident |
| Documents | Trip tracking | Review the experience |
| Accommodation verification | Emergency access | Update destination intelligence |
| Transport plan | Nearby verified community | |

### The "I'm OK" button

At times she sets: 🟢 I'm safe · 🟡 I need help · 🔴 Emergency. No response
escalates to a trusted contact, with **configurable** escalation rather than an
assumed emergency.

## 7. Incident reporting

> **Status 29 Sep: keep, relabel.** The original heading called this the moat.
> It is not — see the re-cut above. Still gated on legal review before any
> public aggregation of allegations.

Private or anonymous reports: driver · accommodation · scam · harassment ·
unsafe location · tourist trap · payment · transport.

Aggregated into **Traveller Intelligence**: *"12 women reported this taxi scam
in the last 30 days."*

## 8. Last verified

> **Status 29 Sep: retire.** Verification freshness at scale is an inventory
> problem, and the inventory belongs to somebody else.

Every safety-relevant fact carries `last verified: 14 Sep 2026` and
`verified by 3 women travellers`.

This is the single most important mechanic in the document. It is what stops
the database decaying into another stale travel blog, and it is the thesis that
has survived every strategic turn this project has taken: **the asset is
verification, and here it becomes crowd-maintained rather than founder-maintained.**

## 9. Travel memory

Post-trip capture: budget vs actual cost · accommodation · transport · safety ·
food · activities · solo comfort · would you return · would you recommend to
another woman.

The trip becomes a structured contribution. `RETURN` closes into `DREAM`.

## 10. Voice

Three different things travel under this name; they are not one feature.

| | What it is | Verdict |
|---|---|---|
| **Voice input** | Speak answers instead of typing them | **v1.** Web Speech API, cheap. The profile is ~20 questions and the audience is substantially Hindi-first |
| **Voice companion** | An assistant she can talk to, grounded in her trip and the verified data | **v2.** Directly validated — one survey respondent, asked what a travel company should solve, answered *"have a comfortable person to talk to when travelling"* |
| **Human voice** | Calls with support or the community | **Later.** This is an operations business, not a feature |

Voice input also raises completion on the profile itself, which is the funnel
everything else depends on.

---

## Data model

| Entity | Holds |
|---|---|
| `traveller_profile` | Demographics, 12-axis comfort vector, derived tier |
| `destination_readiness` | 11 factors + the 12-axis complexity vector, each with `last_verified` |
| `trip` | Destination, dates, accommodation, transport, itinerary, cost |
| `family_pack` | Generated from a trip; shareable, revocable |
| `trusted_contact` | Name, channel, escalation rules |
| `checkin` | Scheduled time, status, response, escalation state |
| `provider` | Pehchan Local listing, category, owner |
| `verification_signal` | Type, checked on, by whom, evidence, expiry |
| `incident_report` | Category, subject, body, anonymity, moderation state |
| `trip_memory` | Post-trip structured contribution |

`verification_signal` is deliberately separate from the thing it describes, so
that a signal can expire. A verification without an expiry is a lie waiting to
happen.

---

## Risks that change the design

These are not reasons not to build. They are constraints that must be designed
in from the start, because retrofitting them is much harder.

**1. Safety features create a duty of care.** An "I'm OK" button implies
someone is watching. If a woman presses 🔴 and nothing happens because there is
no 24/7 team, that is a serious failure — human first, legal second. Design it
explicitly as *"we notify the people you nominated"*, state in plain words that
Pehchan is not an emergency service, and never imply rescue. The escalation
target must always be her trusted contacts and the public emergency services,
never an implied Pehchan response.

**2. Incident reporting about named businesses carries defamation exposure.**
*"This accommodation received 7 reports"* is a publishable allegation against
an identifiable business, and India has criminal as well as civil defamation.
This is simultaneously the best moat in the document and its highest-risk
feature. It needs moderation before publication, a right of reply, careful
neutral phrasing, thresholds before anything aggregates publicly, and actual
legal advice before launch. Do not ship it in v1.

**3. Harassment reports are sensitive personal data** under the DPDP Act.
Anonymous-by-default, minimal retention, and explicit consent — and decide
early what happens if a court asks for the data.

**4. Identity verification means KYC**, with per-check cost and its own data
protection obligations. Phone verification is cheap and gets most of the value;
full identity verification should wait until there is a reason.

**5. Women-only verification is hard and consequential** to get wrong, in both
directions. Decide the policy deliberately, write it down, and publish it.

---

## Sequencing

Rewritten 29 Sep against the three-phase audience roadmap in `docs/15`, which
the original sequencing predated.

**Phase 1 — solo travellers. No backend, and it already ships.**
The trip document · the comfort profile and the "can I do this?" answer feeding
it · voice input · the check-in schedule as a section of the document. All
client-side, nothing leaves the device, no account. **This exists today.** The
work left in phase 1 is not building — it is the first paid document and the
first trip report.

**Phase 1b — the corpus.** Trip reports, captured and published. This is the
moat and it currently holds nothing. It needs the Google Form connected and one
real trip written up; both are dated items in `docs/18`.

**Phase 2 — groups of women. Still no backend.**
The same document, for a group. A group of four friends is four families to
convince, so the artefact is worth more per trip while costing the same to
produce. Additions are small: several travellers on one document, a shared
budget split, one plan sent to several homes.

**Phase 3 — solo travellers formed into a group. A different business.**
This is where the Trust Layer, accounts, a server and vetting live. It requires
matching strangers and taking responsibility for the result, which is supply,
which `docs/17` concluded to stay out of. Not to be started until phases 1 and
2 have paid for it.

**Unscheduled, deliberately.** Incident reporting stays specified and unbuilt
pending legal review. Pehchan Local and `last_verified` are retired as
described above.

**What "MVP" means now.** The original v1 was defined around the insight
*"what kind of traveller am I, and will this trip suit me?"* That is still a
good feature and it is no longer the point. The MVP is **one woman paying for
one document that gets her family to yes** — and every component above is
justified by whether it makes that document better or arrive sooner.
