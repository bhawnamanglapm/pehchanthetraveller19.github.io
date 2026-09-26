#!/usr/bin/env node
/**
 * Import approved trip reports from the review sheet into the site.
 *
 *   node src/import-reports.mjs --csv responses.csv [--dry-run]
 *   node src/import-reports.mjs --csv "https://docs.google.com/.../pub?output=csv"
 *
 * The Google Sheet behind the form is the database and the review queue
 * (docs/14). This closes the loop: rows the reviewer has marked approved
 * become entries in src/content/trip-reports.json, and the build publishes
 * them.
 *
 * It refuses by default and imports only what is explicitly approved. Three
 * rules it enforces rather than trusts:
 *
 *   1. Contact details never reach the published file.
 *   2. A private submission is never published, whatever its status says.
 *   3. Accommodation and dates are never published together — a named
 *      property plus a date range plus a lone woman is an identification
 *      (docs/12). The month is dropped when an area is given.
 *
 * Zero dependencies, Node 18+.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "content", "trip-reports.json");

/* ---- CSV ------------------------------------------------------------- */

/** RFC4180-ish parser: handles quoted fields, embedded commas and newlines. */
export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ""));
}

/* ---- mapping --------------------------------------------------------- */

// Sheet column (the Google Form question, loosely matched) -> our field.
const COLUMNS = [
  ["where did you go", "destination"],
  ["how many days", "days"],
  ["area or neighbourhood", "area"],
  ["city did you travel from", "startedFrom"],
  ["when?", "month"],
  ["who did you travel with", "travelledAs"],
  ["first solo trip", "firstSolo"],
  ["age group", "ageGroup"],
  ["expect to spend", "plannedBudget"],
  ["actually spend", "actualSpend"],
  ["transport", "spendTransport"],
  ["stay", "spendStay"],
  ["food", "spendFood"],
  ["activities", "spendActivities"],
  ["local transport", "spendLocal"],
  ["changed from the plan", "changed"],
  ["wish i had known", "wishIKnew"],
  ["best surprise", "bestSurprise"],
  ["biggest disappointment", "disappointment"],
  ["not in any itinerary", "hiddenGem"],
  ["what went well", "goodThings"],
  ["what did not", "badThings"],
  ["advice to the next woman", "advice"],
  ["tell it properly", "story"],
  ["a video", "videoUrl"],
  ["what kind of thing", "wentWrongCategory"],
  ["what happened", "wentWrongWhat"],
  ["what did you do about it", "wentWrongDid"],
  ["tell another woman to do", "wentWrongAdvice"],
  ["before the trip, how confident", "confidenceBefore"],
  ["and afterwards", "confidenceAfter"],
  ["do alone on this trip", "couldDoAlone"],
  ["travel there again", "wouldReturn"],
  ["who would this trip suit", "suitableFor"],
  ["actually use", "packingUsed"],
  ["never touch", "packingUnused"],
  ["how should this be shown", "visibility"],
  ["show us it happened", "verification"]
];

// Columns the reviewer adds by hand, and the one that must never be published.
const STATUS_COL = "status";
const NOTES_COL = "reviewer notes";
const CONTACT_HINTS = ["reach you", "email", "phone", "instagram", "contact"];

const CONFIDENCE = ["very nervous", "nervous", "neutral", "confident", "very confident"];
const norm = (s) => String(s || "").toLowerCase().trim();
const num = (v) => {
  const raw = String(v == null ? "" : v).replace(/[^0-9.-]/g, "");
  if (raw === "") return null;                 // blank is absent, never zero
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};
const multi = (v) => String(v || "").split(/[;,]\s*/).map(s => s.trim()).filter(Boolean);

function headerMap(header) {
  const map = {};
  header.forEach((h, i) => {
    const key = norm(h);
    if (!key) return;
    if (key === STATUS_COL) { map.__status = i; return; }
    if (key === NOTES_COL) { map.__notes = i; return; }
    if (CONTACT_HINTS.some(c => key.includes(c))) { map.__contact = i; return; }  // located so it can be excluded
    // Longest match wins: "Local transport" must not be captured by the
    // shorter "transport" fragment just because it appears earlier.
    const hits = COLUMNS.filter(([frag]) => key.includes(frag))
      .sort((a, b) => b[0].length - a[0].length);
    const hit = hits[0];
    if (hit && map[hit[1]] === undefined) map[hit[1]] = i;
  });
  return map;
}

function toReport(row, map, index) {
  const get = (f) => (map[f] === undefined ? "" : (row[map[f]] || "").trim());
  const ts = (row[0] || "").trim();

  const spend = {};
  for (const [label, field] of [["Transport", "spendTransport"], ["Stay", "spendStay"],
    ["Food", "spendFood"], ["Activities", "spendActivities"], ["Local transport", "spendLocal"]]) {
    const n = num(get(field));
    if (n != null) spend[label] = n;
  }

  const wrongCat = get("wentWrongCategory");
  const hasWrong = wrongCat && !/^nothing/i.test(wrongCat);
  const area = get("area");

  const report = {
    id: "trip-" + (Date.parse(ts) || Date.now()) + "-" + index,
    destination: get("destination"),
    area: area || null,
    startedFrom: get("startedFrom") || null,
    // Never an area and a date together: that pair identifies her.
    month: area ? null : (get("month") || null),
    days: num(get("days")),
    travelledAs: get("travelledAs") || "Alone",
    firstSolo: /^yes/i.test(get("firstSolo")),
    ageGroup: get("ageGroup") && !/prefer not/i.test(get("ageGroup")) ? get("ageGroup") : null,
    verified: /mark it verified/i.test(get("verification")),
    visibility: /anonymous/i.test(get("visibility")) ? "anonymous" : "public",
    submittedOn: ts ? ts.slice(0, 10) : null,
    publishedOn: new Date().toISOString().slice(0, 10),
    confidenceBefore: CONFIDENCE.indexOf(norm(get("confidenceBefore"))) + 1 || null,
    confidenceAfter: CONFIDENCE.indexOf(norm(get("confidenceAfter"))) + 1 || null,
    plannedBudget: num(get("plannedBudget")),
    actualSpend: num(get("actualSpend")),
    spend,
    changed: multi(get("changed")),
    wishIKnew: get("wishIKnew"),
    bestSurprise: get("bestSurprise") || null,
    disappointment: get("disappointment") || null,
    hiddenGem: get("hiddenGem") || null,
    goodThings: get("goodThings") || null,
    badThings: get("badThings") || null,
    advice: get("advice") || null,
    story: get("story") || null,
    videoUrl: get("videoUrl") || null,
    wentWrong: hasWrong ? {
      category: wrongCat,
      what: get("wentWrongWhat"),
      whatIDid: get("wentWrongDid"),
      resolved: null,
      adviceToOthers: get("wentWrongAdvice")
    } : null,
    couldDoAlone: multi(get("couldDoAlone")),
    wouldReturn: get("wouldReturn") || null,
    suitableFor: multi(get("suitableFor")),
    packingUsed: multi(get("packingUsed")),
    packingUnused: multi(get("packingUnused"))
  };
  return report;
}

/* ---- run ------------------------------------------------------------- */

async function loadCsv(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`fetching the sheet failed: HTTP ${res.status}`);
    return res.text();
  }
  return readFileSync(src, "utf8");
}

async function main() {
  const args = process.argv.slice(2);
  const csvArg = args[args.indexOf("--csv") + 1];
  const dryRun = args.includes("--dry-run");
  if (!args.includes("--csv") || !csvArg) {
    console.error("usage: node src/import-reports.mjs --csv <file|url> [--dry-run]");
    process.exit(1);
  }

  const rows = parseCsv(await loadCsv(csvArg));
  if (rows.length < 2) { console.error("no rows in that CSV."); process.exit(1); }

  // A single unquoted comma in the sheet shifts every column after it, and a
  // silent shift publishes one woman's answers under another's question. Refuse.
  const width = rows[0].length;
  const ragged = rows.slice(1)
    .map((r, i) => ({ line: i + 2, got: r.length }))
    .filter(r => r.got !== width);
  if (ragged.length) {
    console.error(`\ncolumn count mismatch — the CSV is misaligned and will not be imported.`);
    console.error(`  header has ${width} columns; these rows differ:`);
    ragged.slice(0, 10).forEach(r => console.error(`      line ${r.line}: ${r.got} columns`));
    console.error(`  re-export from Google Sheets (File -> Download -> CSV) rather than pasting.\n`);
    process.exit(1);
  }

  const map = headerMap(rows[0]);
  if (map.__status === undefined) {
    console.error(`no "Status" column. Add one to the sheet and write "approved" in it to publish a row.`);
    process.exit(1);
  }
  if (map.destination === undefined) {
    console.error(`no destination column matched. Check the question titles against COLUMNS in this file.`);
    process.exit(1);
  }

  const skipped = [];
  const approved = [];
  rows.slice(1).forEach((row, i) => {
    const status = norm(row[map.__status]);
    const visibility = map.visibility === undefined ? "" : norm(row[map.visibility]);
    const dest = (row[map.destination] || "").trim();
    const who = dest || `row ${i + 2}`;

    if (status !== "approved") { skipped.push(`${who} — status "${status || "empty"}"`); return; }
    if (visibility.startsWith("private")) { skipped.push(`${who} — marked private, never published`); return; }
    if (!dest) { skipped.push(`row ${i + 2} — no destination`); return; }
    approved.push(toReport(row, map, i));
  });

  const existing = JSON.parse(readFileSync(OUT, "utf8"));
  const samples = existing.filter(r => r.sample);
  const real = existing.filter(r => !r.sample);
  const byId = new Map(real.map(r => [r.id, r]));
  let added = 0;
  for (const r of approved) { if (!byId.has(r.id)) { byId.set(r.id, r); added++; } }

  const merged = [...byId.values()].sort((a, b) =>
    String(b.submittedOn || "").localeCompare(String(a.submittedOn || "")));

  // The samples were only ever scaffolding. The first real report retires them.
  const next = merged.length ? merged : samples;

  console.log(`\nreviewed ${rows.length - 1} row(s)`);
  console.log(`  approved and imported : ${added}`);
  console.log(`  already present       : ${approved.length - added}`);
  console.log(`  skipped               : ${skipped.length}`);
  skipped.slice(0, 12).forEach(s => console.log(`      · ${s}`));
  if (map.__contact !== undefined) console.log(`  contact column found and excluded from the published file`);
  if (samples.length && merged.length) console.log(`  retiring ${samples.length} sample(s) — real reports now exist`);

  if (dryRun) { console.log("\n--dry-run: nothing written.\n"); return; }
  writeFileSync(OUT, JSON.stringify(next, null, 2) + "\n");
  console.log(`\nwrote ${next.length} report(s) to src/content/trip-reports.json`);
  console.log(`next: node src/build.mjs, then commit.\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error("\n" + e.message + "\n"); process.exit(1); });
}
