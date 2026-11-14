# 23 — Going global: what Pehchan becomes, and where the radar fits

**Status:** a proposal, written 7 Nov 2026. Nothing on the site changes until the decisions in `06` are made.
**Written for:** the founder, and anyone who joins later and needs to know why the site looks the way it does.

---

## Update, 7 Nov 2026: the form changed, the mission didn't

The owner rejected a report-and-document look for the site and chose **"Ask, humans answer"** (`07`):
- You ask a question in plain words.
- AI finds travellers like you who went.
- They answer in their own voice, as short voice notes, clips and photos. **AI never writes an answer.**

**Read `07` first.** The verdict cards, tables and long report forms in `02`, `03` and `05` are superseded *as
the thing visitors see*. The research, the brand tree in `04`, the honesty rules and the radar gate all still apply.

## The original recommendation (the mission still holds)

**Don't become a bigger travel site. Become the site that tells people what a trip is really like for someone
like them.** That means three things: numbers from travellers who went, filtered by who you are, and updated with
what changed this month. Today, AI planners tell you what to do, review sites rate a hotel, and Reddit gives you one
stranger's story. In this research I found no one who publishes, for each destination, how often the trip lived up
to expectations and how far the budget slipped, for people like you, with the sample size on the card. That is the
product. **"Women travelling alone" stops being the whole site and becomes its first lens.** The radar becomes the
industry-facing child of the same mission: Pehchan shows travellers what a trip is really like, and the radar shows
the travel industry where trips are going wrong.

## Two things in the brief I'd push back on

**"Solo women travellers are a very small segment."** By market size, they aren't. Three research firms estimate
solo travel at **$489–558 billion in 2025**. Women are widely reported to be the majority, but I couldn't verify a
precise share (`01`). The old positioning had two real problems, and size wasn't one of them:
- The people we surveyed didn't want to travel solo. They wanted to be "accompanied but not chaperoned" (`docs/16`).
- The women-only tour market is crowded and works on thin margins (`docs/17`).

**"A big global website used by everyone."** A big global *content* site is the one shape I'd argue against:
- **We already built it and deleted it.** The global boutique build "read generic" and was removed in PR #5
  (`docs/08`).
- **AI answers are taking the traffic.** Lifestyle publishers report Google referrals down 30–50% since AI Overviews
  launched (`01`).
- **Money doesn't fix it.** Culture Trip raised about $155 million and ended up sold off (`01`).

"Everyone" is an audience, not a positioning. **What makes a site global without making it generic is a mechanism
and data nobody else has.** The audience can then be anyone.

## The shape

```
Pehchan — what travel is really like, for someone like you
"Real voices. No AI-written answers."
│
├── For travellers                         pehchanthetraveller.com
│   ├── Ask             one box: "Is Hanoi ok for a first trip with my parents?"
│   ├── Hear            voice notes and clips from people like you who went
│   ├── "I am" chips    first time abroad · woman · with parents · 60+ · wheelchair …
│   │                   (the comfort-profile engine, used for matching)
│   ├── Answer one      "Been there? Answer one question in 60 seconds"
│   ├── Changed since   verified rule, fee and strike changes after the answer was given (gated)
│   └── Trip Document   kept or retired (D-12 in 06)
│
└── For the travel industry                radar.pehchanthetraveller.com
    └── Travel Problem Radar, by Pehchan   what's going wrong in travel, every day
                                           + the "Asked" queue: questions nobody could answer yet
```

*The earlier tree (Reality Check verdict cards, Real Trips reports) is replaced by this one.*

## Files

| File | What's in it |
|---|---|
| `01-research.md` | What the market and the competitors look like, with sources, and what each finding means for us |
| `02-does-it-exist.md` | The "has someone already built this?" check: who does what, where the gap is, and the limits of the check |
| `03-positioning.md` | The promise, the four questions every page answers, lenses, the verdict card, what we stop saying |
| `04-brand-architecture.md` | Parent and children, naming rules, how Pehchan and the radar feed each other, the nav |
| `05-roadmap-and-risks.md` | Phases and the gates between them, what to measure, the first market to focus on, risks |
| `06-decisions.md` | What you need to decide, my recommendations, and what changes in the `docs/22` radar plan |
| **`07-ask-humans-answer.md`** | **The current direction: the concept, what visitors see, where AI is and isn't used, the concierge test, risks** |

## Ground rules carried over

- No invented numbers. Every external figure links to its source, and weak sources are marked as weak.
- A figure is never shown without its sample size (`docs/20`).
- No AI output reaches a traveller unless a person has checked it (`docs/22`, `06`).
- **AI never writes, summarises or ranks an answer as "best". It only finds and matches people (`07`).**
- Women's content isn't deleted. It becomes the first lens.
