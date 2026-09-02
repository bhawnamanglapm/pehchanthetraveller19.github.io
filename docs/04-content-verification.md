# Content Verification Log

> Every destination is signed off by the founder before it counts as verified.
> Requested process: locations are reviewed **one by one** for originality and accuracy.

---

## How this works

1. A destination is added with `verification.status: "pending"`.
2. It is reviewed here — one at a time — against the two questions below.
3. On sign-off, `src/content/destinations.json` is updated:

```json
"verification": {
  "status": "verified",
  "verifiedBy": "Pehchan",
  "verifiedOn": "2026-09-02",
  "notes": "Visited 2024; corrected the Kolukkumalai jeep timing."
}
```

**No new destination is published without going through this.**

## The two questions

**1. Originality.** Is this our own writing?

All existing destination text was written from general knowledge for this site.
None of it was copied from a guidebook, a blog, a tourism board or another
website. There is no scraped or reprinted content anywhere in
`src/content/`. What needs checking is that it *reads* as ours — the voice,
the specificity, the opinions — rather than as generic travel filler.

**2. Accuracy.** Is it true, and is it still true?

Travel facts decay. The claims most worth checking on each guide:

- Best time to visit, and the months given
- How many days the place actually needs
- How to get there — airports, drive times, transport that has since changed
- Anything about permits, closures, seasons or road access
- Whether the "things to do" are things you would genuinely send someone to

Prices, availability and offers are deliberately absent, so there is nothing
there to verify.

## Status

| # | Destination | Country / State | Region | Status |
|---|---|---|---|---|
| 1 | Kyoto | Japan | Asia | ⬜ pending |
| 2 | Hoi An | Vietnam | Asia | ⬜ pending |
| 3 | Chiang Mai | Thailand | Asia | ⬜ pending |
| 4 | Ubud | Indonesia | Asia | ⬜ pending |
| 5 | Amalfi Coast | Italy | Europe | ⬜ pending |
| 6 | Lisbon | Portugal | Europe | ⬜ pending |
| 7 | Lauterbrunnen Valley | Switzerland | Europe | ⬜ pending |
| 8 | AlUla | Saudi Arabia | Middle East | ⬜ pending |
| 9 | Wadi Rum | Jordan | Middle East | ⬜ pending |
| 10 | Marrakech | Morocco | Africa | ⬜ pending |
| 11 | Maasai Mara | Kenya | Africa | ⬜ pending |
| 12 | Banff & Lake Louise | Canada | North America | ⬜ pending |
| 13 | Oaxaca | Mexico | North America | ⬜ pending |
| 14 | El Chaltén & Patagonia | Argentina | South America | ⬜ pending |
| 15 | Cusco & the Sacred Valley | Peru | South America | ⬜ pending |
| 16 | Queenstown & Fiordland | New Zealand | Oceania | ⬜ pending |
| 17 | Munnar | Kerala | India | ⬜ pending |
| 18 | Udaipur | Rajasthan | India | ⬜ pending |
| 19 | Spiti Valley | Himachal Pradesh | India | ⬜ pending |
| 20 | Meghalaya | Meghalaya | India | ⬜ pending |

## Suggested order

Start with places you have actually been — you can verify those from memory in
minutes, and they are the ones where your own voice should replace mine. Then
the places you know by research. Leave the rest until last; those are the
candidates for cutting rather than verifying, because a guide nobody on the team
knows first-hand is the weakest thing on the site.

## Stays and experiences

Separate from this log. All 27 stays and 31 experiences are **illustrative
samples**, badged as such on every card and page. They are not pending
verification — they are placeholders to be replaced by real, first-hand
reviewed properties. See `docs/01-brand-and-architecture.md`.
