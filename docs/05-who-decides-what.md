# Who decides what

A clear split, so nothing falls between us.

---

## The principle

**You own everything that requires having been somewhere, met someone, or made a
business decision. I own everything that requires code.**

The site's whole claim is first-hand curation. That claim is only as good as
your input — I can build the machine, but I cannot supply the thing that makes
it worth visiting.

---

## YOU decide — I cannot do these

| What | Why it has to be you | Where it goes |
|---|---|---|
| **Which destinations exist** | The current 20 were my picks from examples in the brief. They are not your travel history. | `intake/DESTINATION.md` |
| **Everything inside a guide** | Why go, when to go, what to skip, what people get wrong. This is judgement, not research. | `intake/DESTINATION.md` |
| **Which stays are listed** | All 27 current ones are invented samples. A stay you haven't slept in cannot be reviewed. | `intake/STAY.md` |
| **Which experiences are listed** | Same. All 31 are samples. | `intake/EXPERIENCE.md` |
| **Stories** | The one part that must sound like you and nobody else. | `intake/STORY.md` |
| **Photography** | Every image is placeholder artwork until you supply real photos. | Send them to me |
| **The brand name** | "Pehchan" was my proposal. Changing it is one config field. | `src/content/site.json` |
| **About page / your bio** | Currently generic: "a travel curator and digital travel creator". No name, no story. | Tell me and I'll write it |
| **Commercial terms** | Rates, what you'll accept, which partners. | `/partner/` copy |
| **Affiliate accounts** | Only you can sign up and hold the IDs. | `src/content/site.json` → `affiliate` |
| **Analytics account** | Your GA4 / Plausible property. | `src/content/site.json` → `analytics` |
| **Domain** | Yours to buy. | `src/content/site.json` → `customDomain` |

---

## I decide — you don't need to think about these

Information architecture · URL structure · page templates and layout · the design
system, type and colour · responsive behaviour · accessibility · performance and
page weight · SEO plumbing (canonicals, schema, sitemap, breadcrumbs, internal
linking) · the search engine · the trip planner logic · the tools · build
integrity checks · deployment · the content model's shape.

If any of it looks wrong to you, say so and I'll change it — but you shouldn't
have to go looking.

---

## Together

- **Turning your notes into pages.** You write plain English in `intake/`.
  I convert it to the content model, build and deploy.
- **Editing.** I'll tighten your writing, never replace your judgement.
  If I'd be inventing, I leave it blank and ask.
- **Verification.** Nothing publishes as first-hand until you sign it off —
  see `docs/04-content-verification.md`.

---

## The honest position on what exists now

| Content | Status |
|---|---|
| 20 destination guides | **My writing, from general knowledge.** Real places, accurate as far as it goes, but not your voice and not your picks. |
| 27 stays | **Invented samples.** Badged as such. To be deleted, not edited. |
| 31 experiences | **Invented samples.** Badged as such. To be deleted, not edited. |
| 8 stories | **Sample editorial.** Labelled as illustrative writing on every page. |
| 8 itineraries | Built from the above, so inherits their status. |
| Every image | Generated placeholder artwork, labelled. |
| The platform itself | Real, tested and production-quality. |

**None of it is deceptive** — every invented item is labelled on the page. But
labelled placeholder content is scaffolding, not a business. The site becomes
yours when the scaffolding comes out.

---

## What I'd do first

1. **Pick 3 places you know properly.** Not ten. Three.
2. Fill in `intake/DESTINATION.md` for each — blanks are fine.
3. I rebuild those three as real guides and delete the rest of the invented set.
4. Add one real stay and one real experience per place.
5. Then a story in your voice.

Three real guides beat twenty generic ones, for readers and for search. Google
has no shortage of generic Kyoto content; it has a shortage of first-hand
writing about places you actually know.
