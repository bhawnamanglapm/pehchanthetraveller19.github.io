# 07 — Ask, humans answer

**Decided 7 Nov 2026:** the owner chose this over a full AI companion, a visual swipe app, and being a data source
for AIs. It replaces the report and verdict-card *look* in `02`, `03` and `05`. The mission is unchanged: what
travel is really like, for someone like you. **What changes is the form. No reports, no tables, no documents up
front. You ask, and people like you answer in their own voice.**

---

## The idea in three lines

1. **You ask** in plain words: "Is Hanoi ok for a first trip abroad with my parents?"
2. **AI finds the people**: travellers who went, who were like you (first time abroad, travelling with parents),
   and who answered a question like yours.
3. **They answer**: 30–90 second voice notes, short clips and photos. **AI never writes the answer.** It only finds
   and matches.

**The line on every page: "Real voices. No AI-written answers."**

## Why this stands out in an AI world

| Everyone else | Pehchan |
|---|---|
| AI planners write the answer (Mindtrip, Layla, Gemini) | **AI finds the answer, and a person gives it** |
| Reddit Answers uses AI to *summarise* human posts into AI prose ([The Register](https://www.theregister.com/2024/12/09/reddit_ai_answers_search_feature/)) | **We play the humans themselves.** No summary in between |
| TikTok gives you video, chosen by an algorithm, from influencers ([Tubefilter](https://www.tubefilter.com/2025/09/10/tiktok-search-engine-ads-new-research/)) | Voices chosen by **how similar the person is to you**, not by views |
| Local Q&A apps connect you to people who *live* there (AskNative, Local Guide, The Voyage's paid video calls) ([Brit + Co](https://www.brit.co/travel-like-a-local/), [Local Guide](https://play.google.com/store/apps/details?id=com.localguide.app&hl=en_IN), [The Voyage](https://www.thevoyage.co/local-voices)) | People who **visited as someone like you**. A local knows the place. Someone like you knows what it's like to arrive there as you |
| AI-first voice apps answer *with* AI (Ask Bob, TravelTalk24) ([Ask Bob](https://askbob.guide/), [TravelTalk24](https://traveltalk24.com/)) | AI only routes. A person talks |

**The demand for human answers is real:**
- About 60% of 7,000+ travellers prefer human-curated recommendations (Civitatis,
  [Travelweek](https://www.travelweek.ca/?p=190402)).
- Only 6% fully trust AI (Booking.com, [Hotel Online](https://www.hotel-online.com/news/booking-com-releases-the-global-ai-sentiment-report)).
- 41% want AI combined with human input, against 16% who don't care how content is made (Expedia Group,
  [10 Minutes Hotel](https://en.10minhotel.com/2025/10/29/expedia-group-study-reveals-new-insights-in-travel-content-amid-ai-boom)).

These are all industry-sponsored surveys, so they show a direction, not exact figures.

**Not found in the search:** an app built around *asynchronous voice or short-video answers from travellers
matched to you*. One extended search isn't proof it doesn't exist (see `02`, "The limits of this check").

## What a visitor sees

```
┌───────────────────────────────────────────────┐
│ PEHCHAN                                        │
│                                                │
│   What do you want to know about a trip?       │
│   ┌─────────────────────────────────────────┐  │
│   │ Is Hanoi ok for a first trip abroad      │  │
│   │ with my parents?                       → │  │
│   └─────────────────────────────────────────┘  │
│   I am: [first time abroad ✓] [with parents ✓] │
│         [woman] [60+] [wheelchair] [+ more]    │
│                                                │
│   3 people like you went. Hear them:           │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│   │ ▶  0:42  │ │ ▶  0:31  │ │ ▶  0:55  │       │
│   │ Riya     │ │ Arun     │ │ Meera    │       │
│   │ with mum │ │ 1st trip │ │ 62, w/ son│      │
│   │ Mar 2026 │ │ Jan 2026 │ │ Oct 2025 │       │
│   └──────────┘ └──────────┘ └──────────┘       │
│   ⚠ Changed since: visa fee updated Jun 2026   │
│      (checked by a person, 2 Jul 2026)         │
│                                                │
│   Real voices · no AI-written answers          │
└───────────────────────────────────────────────┘
```

*Names, figures and the change notice are illustrative. There's no data yet.*

**When nobody matches**, the empty state is the growth loop:

> *Nobody like you has answered this yet. We'll ask people who went, and you'll hear back.*
> [ Notify me ] — the question joins the queue in the next section.

## The loop: questions create answers

```
 visitor asks ──▶ match found? ──yes──▶ plays voices ──▶ "Been there? Answer one question"
                     │                                            │
                     no                                           ▼
                     ▼                                     traveller records 60s
              question joins "Asked"  ──── shown to ────▶  (on the site, or a WhatsApp
              queue (by destination)        travellers      voice note in Stage A)
                     ▲                      who went               │
                     │                                             ▼
              asker gets notified ◀──── a person reviews ◀── answer saved, tagged
```

**One question, 60 seconds, not a report.** Asking someone to "answer this one question about Hanoi" is a much
smaller request than a 12-section trip report (`docs/11`). That's the bet: more people will say yes to it.

## Where AI is used, and where it isn't

| Job | Who does it | Why |
|---|---|---|
| Understand the question (destination, topic, who's asking) | AI | Plain language, any phrasing |
| Find the closest people and answers | AI with the comfort-profile axes (the profile engine already exists) | Matching is what AI is good at |
| Transcribe and caption voices | AI, shown as "auto-transcript" | Accessibility and search. Transcribing isn't authoring |
| **The answer** | **A person, always** | The whole promise |
| Approving an answer before it's public | **A person** | `docs/12` standard: never publish unreviewed |
| "Changed since" notices | The radar finds it, **a person verifies it** | The `docs/22` gate |

**Rule for the build:** no model output may appear as an answer, a summary of answers, or a "best answer". The UI
can only say *who* answered and *when*, never *what they collectively think*. This is what keeps us different from
Reddit Answers.

## How the radar fits now

The tree in `04` stands. The radar's job on the consumer side becomes a **"changed since they went"** flag:
- A voice from March 2026 about Hanoi is still useful.
- If the visa fee changed in June, the listener needs to know that.
- The radar sweeps for such changes daily, and a person verifies each one before it's attached.

**This is the cleanest combination of the two products so far:** humans give the experience, and the radar keeps
it current.

In the other direction, the "Asked" queue is first-party demand data, made of real questions travellers couldn't
get answered. That's exactly the traveller-pain signal the radar's industry side lacks (`04`).

## What happens to the existing site

| Today | In this direction |
|---|---|
| Home: hero, profile CTA, destinations | **The ask box, plus a wall of recent voices** |
| Profile (12-axis comfort profile) | Becomes the **"I am" chips** and the matching engine. It's no longer a quiz page that ends in a result |
| Destinations | Each page becomes **"Questions people asked about Hanoi"**, each with voices |
| Real Trips reports (`docs/11`) | Replaced up front by **"Answer one question"**. The long form can stay as an optional deep-dive |
| Safety | Answers tagged "safety", plus verified "changed since" notices |
| Trip Document | **Your decision (D-12).** It's a working tool, but it's the most "document" thing on the site |
| Women's content | The Women lens, one chip among several. Nothing is deleted |

## Building it in stages (cheapest test first)

### Stage A: the concierge test (no new backend, no AI)

The question this stage answers is **whether people ask questions, and whether travellers record answers.** If
either is no, nothing else matters.

- The ask box posts the question to the existing Google Form (`docs/14`). No new backend.
- The founder finds a matching traveller by hand, through her own network, Instagram and WhatsApp, and asks for a
  voice note.
- Approved answers are **compressed audio files committed to the repo, plus a JSON index**. GitHub Pages serves
  them like the existing photos. Keep each file small, about the same size discipline as `assets/photos`.
- Matching on the site is **client-side**: destination plus "I am" chips, filtered over the JSON. No AI yet.
- Seed with the founder's own answers on the five corridor destinations (`05`), labelled as the founder's.

**This is the "Wizard of Oz" test: a person does by hand what AI will do later.** It costs time, not money.

**Gate to Stage B:** the owner sets numbers before launch, for questions asked per week and the share of requests
that become a recorded answer. There's no baseline, so I won't guess them.

### Stage B: real matching and recording

- Record in the browser, with upload to storage.
- AI matching of free-text questions.
- Auto-transcripts.
- The "Asked" queue shown to travellers who went.

**This needs a backend.** The radar already runs on Vercel (Functions, Blob, Claude), so reusing that stack is cheaper
to run and maintain than adding a third. Cloudflare Workers with R2 is the free alternative named in `docs/14`.
Estimate the cost in the build spec, not here.

### Stage C: "changed since" from the radar (gated, as in `05` Phase 3)

### Stage D: being inside the AIs

Transcripts plus structured data make answers citable by ChatGPT, Claude and Gemini, so the option you didn't pick
comes back later for free. The AI quotes the transcript, credits the traveller, and links to the voice.

## Risks specific to this direction

| Risk | Impact | Mitigation |
|---|---|---|
| **People won't record voice.** Many are shy on mic | Fatal | Offer text as a fallback, labelled "written by Riya". Measure the voice share in Stage A |
| Voice is personal data, and a voice identifies a person | High | Explicit consent per answer. First name only. Option to publish as transcript only. Deletion on request. Check India's DPDP Act, 2023, and the GDPR |
| Fake or AI-generated voices | High, and rising | Human review of every clip. Prefer answers from people the founder can trace back, as in `docs/12` |
| Unsafe or harmful advice in a voice | High | Review before publishing. Safety-tagged answers get a second check |
| Outdated answers | Medium | The date on every voice, plus "changed since" (Stage C) |
| A slow first answer kills the asker's interest | Medium | Notify on answer. Show nearby answers ("about Vietnam, from people like you") meanwhile |
| Audio files bloat the repo in Stage A | Low at first | A size cap per file. Move to storage in Stage B |

## What to measure

Connect analytics first (`site.json → analytics.provider`).

- Questions asked per week, and how many get matched instantly versus queued.
- Plays per visit, and how far into a voice people listen.
- Answer requests sent compared with answers recorded (the supply rate).
- **Time from a question to its first answer**, the metric the asker feels most.
- The share of answers given by voice versus text.

No targets until there's a baseline.
