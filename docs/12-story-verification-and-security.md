# Trip reports: verification, the 12-hour promise, and keeping a story safe

Recorded 26 Sep 2026, when the founder specified that women should be able to
submit a travel experience, that it should be verified before publication, that
it should appear within 12 hours, and that every story must be secured.

---

## What was built

| | |
|---|---|
| `/trips/` | The trip reports index — how it works, how a story is protected, and the reports themselves |
| `/trips/share/` | The submission form, ~35 fields across six sections |
| `assets/js/trip-report.js` | Field declaration, draft autosave, submission |
| `src/content/trip-reports.json` | The reports. Currently three **samples**, flagged |
| `site.json → tripReports` | Endpoint, SLA hours, moderation address |

## The samples

The founder asked for dummy stories so the page has a shape. They are there,
and they are marked in three places at once: a dashed border, a line on each
card reading *"Sample — invented, for layout only. Not a real submission"*, and
a banner above the list saying every one of them is deleted the day a real
report is published.

The distinction being held: a clearly-labelled layout placeholder is not the
same object as a fabricated review. On a site whose entire proposition is that
these are real women's real experiences, and whose best decision to date was
PR #5 deleting invented content, a fake testimonial would undo the product.
A labelled sample does not.

**They are temporary. Delete `sample: true` entries as real ones arrive.**

## Submission

The form covers the brief in `docs/11`: the trip, planned against actual with a
spend breakdown, what she wishes she had known, surprises, what went wrong and
what she did about it, confidence before and after, what she did alone,
suitability, packing reality, visibility and verification.

Two decisions worth recording:

**Only destination and duration are required.** Every additional required field
is a woman who abandons the form. The rest is offered, not demanded.

**The draft autosaves to the browser.** It is a ten-minute form; losing it to a
mistyped URL would mean losing the submission entirely.

**There is no backend yet.** `site.json → tripReports.submissionEndpoint` is
`null`, and with no endpoint the form does not pretend to send: it renders what
she wrote, with a copy button, and tells her where to send it. Set the endpoint
to a form service and it posts JSON directly. This is the same config-gated
pattern the repository already uses for the custom domain, analytics and
affiliate IDs.

## Verification

A report is published in one of two states, and the distinction is shown:

- **✓ Trip verified** — she offered a booking, ticket or stay confirmation, and
  a person checked it.
- **Community experience** — submitted in good faith, unverified, and labelled.

**The evidence is checked and then destroyed.** A booking confirmation carries
her name, address and often a card fragment. It is looked at, the outcome is
recorded, and the file is deleted. The site never displays the document, and
never stores it.

## The 12-hour promise

Stated on both pages: a person reads every submission and it goes up within 12
hours, or she hears back why not.

**This is an operational promise, not a software guarantee.** No code enforces
it; a person reads submissions and publishes them. At current volume that is
trivial. At fifty a day it is a job, and the promise either gets staffed or
gets changed — it must never quietly become untrue, because it is printed next
to a request for a woman's trust.

`reviewSlaHours` is config, so changing the promise is one line and it updates
everywhere it is stated.

### What the reviewer is actually checking

1. Does it read like somebody who went.
2. Does anything identify her by accident — an employer, a street, a rare
   detail plus a date.
3. Does it name a business in a way that makes an allegation. If so it leaves
   the story route entirely (see below).
4. Does it describe harassment or assault. If so it is never published as a
   story.
5. Spelling only. Nothing else is edited without asking her.

## How a story is secured

**Anonymous by default.** The recommended option, and the one most will take.
Her name appears only if she specifically asks for it.

**Never the accommodation plus the dates.** A named property, a date range and
a lone woman is an identification. One of the three is always removed.

**Naming a business goes through incident reporting, not a story.** `docs/10`
and `docs/11` set out the defamation exposure — India has criminal as well as
civil defamation, and *"this hotel did X to me"* published unmoderated is the
highest-risk thing this product could do. The story route and the incident
route are deliberately separate, and the form says so.

**Harassment and assault are never published as stories.** The form states this
before she starts writing, so she does not disclose something painful into the
wrong channel. It informs what other women are warned about; it does not become
public content.

**Contact details are separated from the story** and used only to reach her
about it.

**She can withdraw it at any time**, no reason, same day.

## What is still missing

1. **The endpoint.** Nothing is collected until one is set.
2. **The private route** for harassment and incidents. The form points at it;
   it does not exist yet. Build it before promoting the share form widely.
3. **A withdrawal mechanism** better than emailing and hoping.
4. **Legal review** of the incident and business-naming route before either
   ships.
5. **Aggregates need a denominator** — no "92% felt comfortable" until the n is
   shown and above a threshold (`docs/11`).
