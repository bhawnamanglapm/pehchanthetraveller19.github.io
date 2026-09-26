# The free backend: Google Forms as the database

Recorded 26 Sep 2026, answering "is there anything free of cost?". Yes — and
for this project it is also the right answer, not merely the cheap one.

---

## Why not the obvious choice

Supabase's free tier is a real Postgres with file storage, and it would be the
better engineering answer for almost any other project. But **free projects
pause after seven days of inactivity.** A new site taking one submission a week
would spend most of its life paused, and submissions would fail in exactly the
months when every single one matters most.

Firebase and Cloudflare Workers with D1 are both genuinely free and neither
sleeps. They are the upgrade path — see the end of this document — but both
need an account, a CLI and a deploy step.

## What we are using instead

**A Google Form, and the Sheet behind it.**

| | |
|---|---|
| Cost | Free, with no expiry and no pause |
| Database | The linked Google Sheet |
| Review queue | The same Sheet — one row per submission, one column for status |
| Admin email | Built in: **Responses → ⋮ → Get email notifications for new responses** |
| Ops | None |

This is the same route the Women & Travel survey already runs on, so it is
proven in this project and already familiar.

**The site's own form is what she fills in.** It posts into the Google Form
behind the scenes, so the 42-field form stays, and the brand stays. She never
sees a Google page.

## Setting it up

1. Create a Google Form titled *Pehchan — Trip Report*, with the questions in
   the table below, in this order.
2. **Responses → Link to Sheets.** That sheet is the database.
3. **Responses → ⋮ → Get email notifications for new responses.** That is
   point 4 — every submission reaches the admin.
4. Add one final **Paragraph** question called *Anything else* — this is the
   fallback that catches any field without its own mapping, so nothing a
   traveller writes is ever dropped.
5. Get the entry IDs: **⋮ → Get pre-filled link**, fill anything, Get link,
   and read the `entry.NNNNNNN` values out of the URL.
6. Put them in `src/content/site.json`:

```json
"tripReports": {
  "googleForm": {
    "actionUrl": "https://docs.google.com/forms/d/e/<FORM_ID>/formResponse",
    "fields": {
      "destination": "entry.111111111",
      "days":        "entry.222222222"
    }
  },
  "fallbackField": "entry.999999999"
}
```

Rebuild, and the form is live. Fields you do not map are not lost — they are
appended to the fallback question.

## What this cannot do, honestly

**No delivery receipt.** Google refuses cross-origin reads, so the browser
gets an opaque response: we can confirm the request was sent, never that it
landed. The confirmation says exactly that, and keeps her draft on the device
rather than clearing it on a guess:

> We cannot get a delivery receipt back from Google, so your draft is still
> saved on this device: if you have not heard from us in 12 hours, please
> email it instead.

**No photo upload.** Google Forms file upload requires the respondent to sign
in to a Google account, which breaks anonymity — the one promise this form
cannot bend. Photos are collected by email until there is somewhere to put
them.

**It is an undocumented endpoint.** `formResponse` is widely used and stable,
but Google does not support it. If it ever breaks, the copy-out fallback still
works and nothing she wrote is lost.

**Sensitive data sits in Google Drive.** Acceptable for trip reports. Not
acceptable for incident reports involving harassment (point 9) — those need
somewhere with real access control, and should not be built on this.

## When to move off it

Move when any of these is true: photos need uploading, submissions pass a few
a day, delivery confirmation matters, or incident reporting ships.

**Cloudflare Workers + D1** is the recommended next step and is also free:
100,000 requests a day, 5GB of database, and it does not sleep. It gives a
real API with CORS, so the form can confirm a save, and R2 handles photos.
The cost is a Cloudflare account and a `wrangler deploy`.

---

## The questions to create

42 questions. Only the first two should be marked required.


### Your trip
*Only the first two are required.*

| # | Question | Type | Our field |
|---|---|---|---|
| 1 | Where did you go? | Short answer | `destination` |
| 2 | How many days? | Short answer | `days` |
| 3 | Which area or neighbourhood did you stay in? | Short answer | `area` |
| 4 | A map link, if you have one | Short answer | `mapLink` |
| 5 | Which city did you travel from? | Short answer | `startedFrom` |
| 6 | When? | Short answer | `month` |
| 7 | Who did you travel with?<br>· Alone<br>· With a friend<br>· With friends<br>· With a group<br>· With family | Multiple choice | `travelledAs` |
| 8 | Was this your first solo trip?<br>· Yes<br>· No | Multiple choice | `firstSolo` |
| 9 | Age group<br>· Prefer not to say<br>· Under 25<br>· 25–30<br>· 31–35<br>· 36–40<br>· 41–50<br>· Over 50 | Dropdown | `ageGroup` |

### Planned against actual
*The single most useful thing you can tell another woman.*

| # | Question | Type | Our field |
|---|---|---|---|
| 10 | What did you expect to spend, in total? | Short answer | `plannedBudget` |
| 11 | What did you actually spend? | Short answer | `actualSpend` |
| 12 | Of that — transport | Short answer | `spendTransport` |
| 13 | Stay | Short answer | `spendStay` |
| 14 | Food | Short answer | `spendFood` |
| 15 | Activities | Short answer | `spendActivities` |
| 16 | Local transport | Short answer | `spendLocal` |
| 17 | What changed from the plan?<br>· Transport delay<br>· Weather<br>· More expensive than expected<br>· Changed accommodation<br>· Added activities<br>· Felt uncomfortable somewhere<br>· Found something better locally<br>· Other | Checkboxes | `changed` |

### What you wish you knew
*Write it the way you would tell a friend.*

| # | Question | Type | Our field |
|---|---|---|---|
| 18 | Before this trip, I wish I had known… | Paragraph | `wishIKnew` |
| 19 | Best surprise | Paragraph | `bestSurprise` |
| 20 | Biggest disappointment | Paragraph | `disappointment` |
| 21 | Something you found that was not in any itinerary | Paragraph | `hiddenGem` |
| 22 | What went well? | Paragraph | `goodThings` |
| 23 | What did not? | Paragraph | `badThings` |
| 24 | Your advice to the next woman going there | Paragraph | `advice` |

### The whole story
*Optional, and the part people read most. Write as much or as little as you like.*

| # | Question | Type | Our field |
|---|---|---|---|
| 25 | Tell it properly | Paragraph | `story` |
| 26 | A video, if you made one | Short answer | `videoUrl` |
| 27 | Photos | — not supported, collect by email | `photos` |

### Did anything go wrong?
*A page where nothing ever goes wrong is no use to anyone. If it involved harassment or assault, please do not write it here — use the private route at the bottom instead, and it will never be published.*

| # | Question | Type | Our field |
|---|---|---|---|
| 28 | What kind of thing?<br>· Nothing went wrong<br>· Transport<br>· Accommodation<br>· Money or payment<br>· Connectivity<br>· Navigation<br>· Documentation<br>· Lost belongings<br>· Weather<br>· Health<br>· Food<br>· Booking<br>· Other | Dropdown | `wentWrongCategory` |
| 29 | What happened? | Paragraph | `wentWrongWhat` |
| 30 | What did you do about it? | Paragraph | `wentWrongDid` |
| 31 | What would you tell another woman to do? | Paragraph | `wentWrongAdvice` |

### How it felt

| # | Question | Type | Our field |
|---|---|---|---|
| 32 | Before the trip, how confident were you?<br>· Very nervous<br>· Nervous<br>· Neutral<br>· Confident<br>· Very confident | Multiple choice | `confidenceBefore` |
| 33 | And afterwards?<br>· Very nervous<br>· Nervous<br>· Neutral<br>· Confident<br>· Very confident | Multiple choice | `confidenceAfter` |
| 34 | What did you do alone on this trip?<br>· Took a flight alone<br>· Took a train alone<br>· Took a bus alone<br>· Used local transport<br>· Checked into a hotel alone<br>· Ate alone<br>· Went sightseeing alone<br>· Trekked<br>· Met strangers<br>· Joined a group activity<br>· Navigated an unfamiliar city<br>· Handled a problem alone | Checkboxes | `couldDoAlone` |

### Who is it for?

| # | Question | Type | Our field |
|---|---|---|---|
| 35 | Would you travel there again?<br>· Absolutely<br>· Probably<br>· Maybe<br>· Probably not | Multiple choice | `wouldReturn` |
| 36 | Who would this trip suit?<br>· First-time solo travellers<br>· Experienced solo travellers<br>· Introverts<br>· Social travellers<br>· Budget travellers<br>· Luxury travellers<br>· Adventure lovers<br>· Slow travellers<br>· Women travelling with family<br>· Women looking for a short break | Checkboxes | `suitableFor` |
| 37 | What did you actually use? | Paragraph | `packingUsed` |
| 38 | What did you carry and never touch? | Paragraph | `packingUnused` |

### Before you send it
*This part decides how your story appears.*

| # | Question | Type | Our field |
|---|---|---|---|
| 39 | How should this be shown?<br>· Anonymous — no name, no handle (recommended)<br>· With my first name only<br>· With my name and Instagram<br>· Private — use it to improve Pehchan, do not publish it | Multiple choice | `visibility` |
| 40 | Can you show us it happened?<br>· I can send a booking or ticket if you ask — mark it verified<br>· No — publish it as a community experience | Multiple choice | `verification` |
| 41 | How do we reach you about this story? | Short answer | `contact` |
| 42 | Consent<br>· I wrote this myself, it is my own trip, and Pehchan may publish it as I have chosen above. I understand I can have it removed at any time. | Checkboxes (required) | `consent` |