# Voice

Recorded 26 Sep 2026. Three different features travel under the word "voice".
Only the first is built; the other two are specified here rather than half-made.

---

## 1. Voice input — built

`assets/js/voice.js`. A microphone beside every long-answer field on
`/trips/share/` — thirteen of them.

**Why it matters more than it looks.** The long questions are the ones that get
abandoned, the audience is substantially Hindi-first, and typing a paragraph on
a phone in Devanagari is slow. Talking is faster in every language.

**Seven languages**: English, Hindi, Punjabi, Marathi, Gujarati, Tamil, Bengali,
all `-IN` locales. The choice is remembered across fields and visits, because
nobody wants to set it thirteen times.

**How it behaves.** It appends rather than replaces, so she can type a little,
speak a little, and edit afterwards. Interim results appear live in the field.
It fires an `input` event on every update so the draft autosave still works —
a programmatic value set does not fire one by itself. A pause in speech is not
reported as an error; a blocked microphone says so plainly and tells her to
type instead.

**Nothing is recorded or uploaded.** Recognition is the browser's own. This
file only puts the resulting text into the field she is already filling in.

**Support is uneven and the design accepts that.** Good in Chrome and Edge,
partial on Android, unreliable on iOS Safari. Where the API is absent no button
is rendered at all — dictation is an enhancement beside the keyboard, never a
replacement, and a woman on an unsupported browser sees a form that works.

### Worth doing next
Voice input on the twelve profile questions would need a different shape —
those are radio buttons, so it would mean matching a spoken phrase to a point
on the scale. Worth it only if the profile shows abandonment.

---

## 2. Voice companion — specified, not built

An assistant she can talk to, grounded in the verified data.

**Directly validated.** One survey respondent, asked what a travel company
should solve for her, answered: *"have a comfortable person to talk to when
travelling."* That is the feature, in a customer's own words.

**What it must be.** Grounded in the verified dataset, citing the source and
the `last_verified` date; answering "I don't know, let me ask Bhawna" when the
data is not there, and creating a real handoff when it says so. A companion
that invents a helicopter price destroys the one thing that differentiates
this product.

**What it must never be.** A crisis line. If a woman says something frightening
at 2am, the honest response is her trusted contacts and the public emergency
services — never an implied Pehchan response, per the duty-of-care rule in
`docs/10`.

**Blocked on** the backend (`docs/12`, point 3) and on there being verified data
to ground it in.

**Cost is not the obstacle.** At a couple of rupees per exchange, a hundred
conversations a day is trivial against a single booking.

---

## 3. Human voice calls — specified, not built

Calls with Pehchan or with the community.

**This is an operations business, not a feature.** It needs people, hours,
a rota and an escalation policy. A phone number that rings out is worse than
no phone number, and on a site about women's safety it is much worse.

Build it when there is someone to answer. Until then the honest offer is a
callback request with a stated response window, which is the same promise
shape as the 12-hour review SLA in `docs/12` — and carries the same warning:
it gets staffed or it gets changed, never quietly left untrue.
