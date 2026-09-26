# Product specification — the solo travel confidence engine

Recorded 26 Sep 2026 from the founder's product brief. This is the fullest
statement of what Pehchan is for, and it supersedes `docs/08` where they
conflict: the business is a women's travel platform, not a cross-border
heritage and boutique agency.

---

## The spine

```
DREAM → CONFIDENCE → PLAN → MATCH → TRAVEL → SUPPORT → RETURN
```

Every feature below belongs to one stage, and the last stage feeds the first
for the next woman. `RETURN` is not an epilogue — it is where the dataset comes
from.

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

## 3. Share with Family

A generated pack covering: destination · accommodation · airport transfer ·
daily itinerary · emergency contacts · location-sharing plan · local women
support · arrival and departure times · total estimated cost · insurance ·
check-in schedule.

Then **"family questions answered"** — where will she stay, how will she
travel, what happens in an emergency, who knows where she is, what if she
misses her transport.

This replaces reassurance with evidence, and it is the sharpest insight in the
brief. The survey data already shows why: the permission gradient runs from
"some influence" through "significant influence" to "I cannot travel without
their approval." **The buyer is often not the traveller.** Nobody else in
travel builds for the person who has to say yes.

## 4. The Trust Layer

Verifiable signals, never a composite score:

🟢 phone verified · identity verified · women-only verified · previous trips ·
community reputation · report history

A "98% trusted" badge is a claim the platform cannot stand behind and a user
cannot interrogate. A list of what was checked, and when, is both honest and
more useful.

## 5. Pehchan Local

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

## 7. Incident reporting → the moat

Private or anonymous reports: driver · accommodation · scam · harassment ·
unsafe location · tourist trap · payment · transport.

Aggregated into **Traveller Intelligence**: *"12 women reported this taxi scam
in the last 30 days."*

## 8. Last verified

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

**v1 — no backend required.** Solo Travel Profile · comfort vector · destination
readiness vectors · the match with per-axis explanations · voice input · the
Family Pack as a generated, printable page. All client-side, all shippable on
the current build.

**v2 — accounts and a server.** Saved trips · trusted contacts · check-ins with
configurable escalation · Pehchan Local listings with verification signals ·
trip memory capture · voice companion.

**v3 — community and moderated intelligence.** Incident reporting · aggregated
traveller intelligence · community reputation · the contribution loop that
keeps `last_verified` current.

v1 is the honest MVP: it delivers the insight that makes the product
distinctive — *"what kind of traveller am I, and will this trip suit me?"* —
with no login, no personal data leaving the device, and no promises the
business cannot keep.
