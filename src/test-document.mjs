/**
 * Tests for the trip document parsers.
 *
 * Run with: node src/test-document.mjs
 *
 * Every expected figure below is taken from the real Andaman & Nicobar
 * itinerary that was shown to a traveller's parents and persuaded them — the
 * one artefact this product has evidence for. If the parsers stop reproducing
 * that document exactly, something has regressed in the thing that works.
 */
import { parseItinerary, parseTravel, parseBudget, parseStays, money }
  from "../assets/js/trip-document.js";

let fails = 0;
const eq = (got, want, what) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails++; console.log(`FAIL ${what}\n   got  ${JSON.stringify(got)}\n   want ${JSON.stringify(want)}`); }
  else console.log(`ok   ${what} = ${JSON.stringify(got)}`);
};

/* --- her real Andaman data -------------------------------------------- */
const itinerary = `# Wednesday, 21 October | Port Blair → Havelock
6:00-7:30 AM | Ferry | Reach Havelock ~7:30 AM | ess
Morning | Elephant Beach | Speedboat | ess
> Parasailing | | rec
> Sea Walk | I'd skip if doing scuba | opt
4:00-6:30 PM | Radhanagar Beach | Swimming, beach walk, sunset, photos | must`;

const d = parseItinerary(itinerary);
eq(d.length, 1, "one day parsed");
eq(d[0].label, "Wednesday, 21 October", "day label");
eq(d[0].place, "Port Blair → Havelock", "day place");
eq(d[0].rows.length, 5, "five rows");
eq(d[0].rows[0].priority, "ESSENTIAL", "ess -> ESSENTIAL");
eq(d[0].rows[4].priority, "MUST-DO", "must -> MUST-DO");
eq(d[0].rows[2].addon, true, "> marks an add-on");
eq(d[0].rows[2].place, "Parasailing", "add-on shifts columns left");
eq(d[0].rows[3].activity, "I'd skip if doing scuba", "add-on keeps her judgement line");
eq(d[0].rows[3].time, "", "add-on has no time of its own");

/* --- travel, with her real connection times ---------------------------- */
const travel = parseTravel(`# Outbound | Tuesday, 20 October 2026
IndiGo 6E933 | DEL Delhi | 02:55 | MAA Chennai | 05:45
IndiGo 6E845 | MAA Chennai | 10:45 | IXZ Port Blair | 13:00

# Return | Sunday, 25 October 2026
SpiceJet SG254 | IXZ Port Blair | 13:00 | CCU Kolkata | 15:10
SpiceJet SG254 | CCU Kolkata | 16:00 | DEL Delhi | 18:25`);

eq(travel[0].legs[0].duration, "2h 50", "DEL-MAA duration (her doc: 2h 50)");
eq(travel[0].legs[1].duration, "2h 15", "MAA-IXZ duration (her doc: 2h 15)");
eq(travel[0].legs[0].connection.text, "5h 00", "Chennai layover (her doc: 5h 00)");
eq(travel[0].legs[0].connection.note, "Long connection", "5h flagged as long");
eq(travel[0].total, "10h 05", "outbound journey (her doc: 10h 05)");
eq(travel[0].stops, 1, "outbound 1 stop");
eq(travel[1].legs[0].connection.text, "0h 50", "Kolkata connection (her doc: 0h 50)");
eq(travel[1].legs[0].connection.note, "Tight connection", "50m flagged as tight");
eq(travel[1].total, "5h 25", "return journey (her doc: 5h 25)");

/* --- overnight roll ---------------------------------------------------- */
const night = parseTravel(`# Overnight
Train 12964 | Delhi | 21:10 | Udaipur | 06:40`);
eq(night[0].legs[0].duration, "9h 30", "overnight leg crosses midnight");

/* --- budget, reproducing her totals ------------------------------------ */
const budget = parseBudget(`# Flights
Return airfare | Both legs | 26000

# Stay
Total, 5 nights | As budgeted in the sheet | 10000

# Ferries
Port Blair → Havelock | Makruzz 6:00-7:30 AM | 1100
Havelock → Neil | ITT Majestic 10:30-11:30 AM | 1450
Neil → Port Blair | Nautika 10:35-11:50 AM | 1650

# Water sports & activities
Elephant Beach Boat | Speedboat transfer | 2000
? Parasailing | Elephant Beach | 3500
? Jet Ski | Elephant Beach | 800
? Snorkelling | Elephant Beach / Neil | 2500
Scuba Diving | Havelock, introductory dive | 8000
? Glass-Bottom Boat | Neil / North Bay | 1000

# Other
Food | Whole trip | 5000
x Scooter hire | Per day, not in the total | 500`);

const fixed = budget.reduce((t, g) => t + g.fixed, 0);
const optional = budget.reduce((t, g) => t + g.optional, 0);
eq(budget[2].fixed, 4200, "ferries subtotal (her doc: 4,200)");
eq(budget[3].fixed + budget[3].optional, 17800, "activities subtotal (her doc: 17,800)");
eq(fixed + optional, 63000, "estimated total (her doc: 63,000)");
eq(budget[4].rows[1].excluded, true, "scooter excluded from totals");
eq(budget[4].fixed, 5000, "other subtotal excludes the scooter");
eq(money(63000), "₹63,000", "Indian grouping, 63,000");
eq(money(150000), "₹1,50,000", "Indian grouping, 1,50,000");

/* --- stays, and pasting straight out of a spreadsheet ------------------ */
const stays = parseStays("Havelock\t2\tSymphony Palms\t+91 3192 282222\tGovind Nagar");
eq(stays[0].property, "Symphony Palms", "tab-separated paste from Sheets parses");
eq(parseStays("Neil Island | 1 | | | ")[0].property, "", "missing property is blank, not a crash");

/* --- robustness -------------------------------------------------------- */
eq(parseItinerary("").length, 0, "empty input, no days");
eq(parseBudget("# Flights\nAirfare | | not a number")[0].rows[0].amount, null, "non-numeric amount -> null");
eq(parseBudget("# Flights\nAirfare | | 0")[0].rows[0].amount, 0, "zero is a real amount, not null");
eq(parseTravel("# X\nBus | A | 99:99 | B | 10:00")[0].legs[0].duration, undefined, "bad clock, no duration invented");
eq(parseItinerary("Afternoon | Beach | Walk | ess")[0].rows.length, 1, "rows without a day heading still parse");

console.log(fails ? `\n${fails} FAILED` : "\nAll passed");
process.exit(fails ? 1 : 0);
