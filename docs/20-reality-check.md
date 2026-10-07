# Reality Check — spec

Written 4 Oct 2026, from the founder's idea: *"What Instagram doesn't tell
you."*

It is the strongest idea on that list for one reason: **it is a presentation
layer over data already being collected**, not a new system. The comfort axes,
the trip-report form and the destination intake sheet between them already hold
almost every field it needs.

---

## What it is

One card per destination that answers the question a woman actually has before
she books, and that no travel site answers:

> *Is this place what it looks like online, and what will it actually ask of
> me?*

It sits on the destination page, and it exports as a square image for Instagram
— which matters, because distribution is the problem this product has, not
features.

## The verdict line

The headline is not two star ratings. It is **the gap between them**, stated in
one phrase:

| Verdict | When |
|---|---|
| **Better than it looks online** | Reality rated above expectation |
| **About what you'd expect** | Within one point |
| **Oversold** | Expectation above reality |
| **Nobody has reported on this yet** | No trip reports. **The default** |

That last row is not a failure state. It is the honest state for all 27
destinations today, and the card is designed around it.

## Anatomy, and where each row comes from

Nothing on this card is typed twice. Every row is either computed from reports,
read from the intake sheet, or absent.

| Row | Source | Computed? |
|---|---|---|
| **Confidence shift** | `confidenceAfter − confidenceBefore`, mean across reports | **Yes** |
| **Budget reality** | `actualSpend ÷ plannedBudget`, median across reports | **Yes** |
| **Would go again** | % answering *Absolutely* or *Probably* in `wouldReturn` | **Yes** |
| **What this asks of you** | The three highest axes in the destination's demand vector | **Yes** |
| **Best for** | `Minimum days` / `Days you'd recommend`, intake sheet | No — written |
| **Crowds** | Intake sheet | No — written |
| **Avoid** | `Months to avoid` + `Anywhere to avoid staying` | No — written |
| **What Instagram shows / what it's like** | Intake: *one line* + *why go — expectation vs reality* | No — written |
| **Local tip** | Intake, or a trip report's *wish I'd known* | Either |

### The headline number nobody else publishes

**Confidence shift.** Both halves are already in the report form, and the
capture brief exists specifically so `confidenceBefore` is collected before
departure rather than reconstructed afterwards.

> *Women arrive at Kedarnath nervous and leave confident. Average shift: +1.8.*

No travel site publishes that, because no travel site asks. It is also this
product's North Star rendered per destination, which is why it goes first.

**Budget reality** is the second. *"People spend 18% more than they planned"*
is the single most useful number a woman can read before booking, and the trip
report already captures planned against actual.

---

## The rule that stops this becoming a lie

A mean of three incomparable people describes nobody. This was learned the hard
way on 29 Sep, when ranked safety-feature averages from three very different
survey respondents had to be withdrawn (`docs/16`). The same mistake in public,
on a destination page, would be worse.

**So the card obeys thresholds, and states n every time:**

| Reports | What shows |
|---|---|
| **0** | No computed rows at all. Intake-written rows only, labelled as one traveller's view |
| **1–2** | **No averages.** One quoted line from a report, attributed as *"One woman who went, in October"* |
| **3–5** | Numbers appear, each with **"from 3 reports"** printed beside it |
| **6+** | Numbers, plus a range where it is wide |

**n is always on the card.** A figure without its sample size is the thing
every other travel site does, and it is why nobody believes them.

## The empty state is the real design

All 27 destinations have zero reports today, so the empty card is what ships
first and it has to be good. It should:

- Show the written rows (what it's actually like, crowds, avoid, best for)
- Say plainly: **"No trip reports yet. This is one traveller's view."**
- Carry the one line that makes the loop turn: **"Been here? Add yours."** →
  `/trips/share/`

That link is the point. The empty card is the recruitment poster for the corpus
it needs.

## The share card

Reuse the existing machinery: `ogCard()` in `src/lib/shell.mjs` already
composes `art()` from `src/lib/art.mjs` into an SVG card with wrapped text.
A 1080×1080 variant gives an Instagram-ready export per destination, generated
at build time with everything else.

**What goes on the square:** destination, the verdict line, the confidence
shift if there is one, and the n. Nothing else fits and nothing else is needed.

This is the growth loop in one object: a card worth posting → a profile visit →
a woman who fills a report → a better card.

## What it must never do

- **Never show a computed number below n=3.** No exceptions, however tempting a
  single dramatic report is.
- **Never invent the Instagram-expectation side.** It comes from a traveller
  saying what she expected, or it is absent. A rating of other people's
  Instagram posts, assigned by us, is fiction.
- **Never rate safety.** The site's own line is *"we will not tell you a place
  is safe."* The card reports what a place demands and what women said; it does
  not score danger.
- **Never publish a named property with exact dates** (`docs/12`).
- **Never let a sponsored destination affect a number** — relevant later for
  idea 13, destination sponsorship.

## Data model

No new content file. Two additions:

1. **`destinations.json`** gains `demand` (the 12 axes — already required by the
   profile engine and still empty) and an optional `realityNotes` object for
   the written rows, imported from the intake sheet.
2. **Computation lives in the build**, in a new `src/lib/reality.mjs`, reading
   `trip-reports.json` and grouping by destination. Pure function, testable the
   same way `src/test-document.mjs` tests the document parsers.

Reports marked `visibility: "private"` are excluded from every computation, as
they are from publication.

## Build order

| | Step | Blocked by |
|---|---|---|
| 1 | `reality.mjs` with the thresholds, plus tests | Nothing |
| 2 | The card on destination pages, empty state first | Step 1 |
| 3 | Import `demand` vectors from the intake sheet | **The founder filling 12 numbers × 27 rows** |
| 4 | Square share image via `ogCard` | Step 2 |
| 5 | Numbers light up as reports arrive | The corpus |

**Steps 1, 2 and 4 can be built against zero data** — that is the point of
designing the empty state first. Step 3 is the one that needs a human, and it
is the same 12 numbers the profile engine has been waiting for since it was
built.
