/**
 * Safety by journey.
 *
 * The hard rule this file is built around: Pehchan is not an emergency
 * service and must never behave as though it were. Nobody here is watching a
 * screen. If a woman presses a button at 2am, the only honest thing that can
 * happen is that the people she chose hear from her, fast — so that is exactly
 * what these buttons do, and the page says so before she relies on them.
 *
 * Everything runs on her device:
 *   · the before-you-go checklist saves locally
 *   · check-in reminders are generated as a calendar file her own phone fires,
 *     not a notification we send
 *   · the I'm OK buttons open WhatsApp to her own contacts, pre-written
 *
 * No account, no server, no tracking. One tap instead of five, at the moment
 * when five is too many.
 */

const STORE = "pehchan-safety";
const esc = (s) => String(s == null ? "" : s)
  .replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

const CHECKLIST = [
  { key: "contacts", text: "Two people have my full plan — not just one." },
  { key: "stay", text: "My accommodation is booked and I have called them to confirm it exists." },
  { key: "arrival", text: "I arrive in daylight, and the transfer from the station or airport is arranged." },
  { key: "docs", text: "ID, tickets and bookings are on my phone and screenshotted, in case there is no signal." },
  { key: "cash", text: "I am carrying cash as well as cards." },
  { key: "insurance", text: "Travel insurance is bought and the policy number is saved somewhere I can reach it." },
  { key: "meds", text: "Any medicine I need is packed, in its box, with the prescription." },
  { key: "local", text: "I have written down the nearest hospital to where I am staying." },
  { key: "charge", text: "Power bank charged. A dead phone is the thing that turns a problem into a crisis." },
  { key: "family", text: "My family has the Share with Family pack." }
];

const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } };
const write = (d) => { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch { /* ignore */ } };

const digits = (s) => String(s || "").replace(/[^\d]/g, "");

/* ---- check-in reminders as a calendar file --------------------------- */

const pad = (n) => String(n).padStart(2, "0");
const stamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
  + `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

/**
 * Build a .ics her phone will fire on its own. Deliberately not a push
 * notification: a notification implies a server that is paying attention,
 * and there isn't one.
 */
function buildIcs({ from, to, times, who }) {
  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  if (isNaN(start) || isNaN(end) || end < start) return null;

  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pehchan//Check-in//EN", "CALSCALE:GREGORIAN"];
  const now = stamp(new Date());
  let n = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (const t of times) {
      const [h, m] = t.split(":").map(Number);
      const at = new Date(d);
      at.setHours(h, m, 0, 0);
      n++;
      lines.push(
        "BEGIN:VEVENT",
        `UID:pehchan-${at.getTime()}-${n}@pehchan`,
        `DTSTAMP:${now}`,
        `DTSTART:${stamp(at)}`,
        `DURATION:PT10M`,
        `SUMMARY:Message ${who || "home"} — check in`,
        `DESCRIPTION:A quick message so nobody has to wonder. One line is enough.`,
        "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY",
        `DESCRIPTION:Check in with ${who || "home"}`, "END:VALARM",
        "END:VEVENT"
      );
    }
  }
  lines.push("END:VCALENDAR");
  return { ics: lines.join("\r\n"), count: n };
}

/* ---- boot ------------------------------------------------------------ */

const app = document.getElementById("safety-app");
if (app) {
  const saved = read();

  app.innerHTML = `
<section class="safety-block">
  <h3>Before you go</h3>
  <p class="muted">Ten things. Ticks are saved on this device so you can come back to it.</p>
  <ul class="safety-list">${CHECKLIST.map(c => `<li>
    <label class="choice"><input type="checkbox" name="${c.key}" ${saved.checks && saved.checks[c.key] ? "checked" : ""}>
    ${esc(c.text)}</label></li>`).join("")}</ul>
  <p class="safety-progress" id="safety-progress" role="status" aria-live="polite"></p>
</section>

<section class="safety-block">
  <h3>Who hears from you</h3>
  <p class="muted">Saved on this device only. Used to pre-write the messages below — never sent anywhere.</p>
  <div class="field"><label for="s-who">Their name</label>
    <input type="text" id="s-who" name="who" value="${esc(saved.who || "")}" placeholder="Amma"></div>
  <div class="field"><label for="s-num">Their WhatsApp number, with country code</label>
    <input type="tel" id="s-num" name="num" value="${esc(saved.num || "")}" placeholder="91 98765 43210"></div>
</section>

<section class="safety-block">
  <h3>While you are away</h3>
  <p class="muted">One tap instead of five. Each opens WhatsApp with the message written — you send it.</p>
  <div class="okay-row" id="okay-row"></div>
</section>

<section class="safety-block">
  <h3>Check-in reminders</h3>
  <p class="muted">Your phone reminds you, not us. This makes a calendar file you add once.</p>
  <div class="field-grid">
    <div class="field"><label for="s-from">From</label>
      <input type="date" id="s-from" name="from" value="${esc(saved.from || "")}"></div>
    <div class="field"><label for="s-to">To</label>
      <input type="date" id="s-to" name="to" value="${esc(saved.to || "")}"></div>
  </div>
  <fieldset class="field"><legend>When</legend>
    <div class="choices">
      <label class="choice"><input type="checkbox" name="t" value="09:00"
        ${!saved.times || saved.times.includes("09:00") ? "checked" : ""}> Every morning, 9am</label>
      <label class="choice"><input type="checkbox" name="t" value="20:00"
        ${!saved.times || saved.times.includes("20:00") ? "checked" : ""}> Every evening, 8pm</label>
    </div>
  </fieldset>
  <div class="btn-row"><button class="btn btn--ghost" type="button" id="s-ics">Add to my calendar</button></div>
  <p class="muted" id="s-ics-note" role="status" aria-live="polite"></p>
</section>

<section class="safety-block safety-block--urgent">
  <h3>If something is wrong right now</h3>
  <p><strong>Call 112.</strong> It is the national emergency number in India and it reaches police,
  ambulance and fire. Pehchan cannot send anyone — this page is on your phone, and nobody here is
  watching it.</p>
  <div class="btn-row">
    <a class="btn btn--primary" href="tel:112">Call 112</a>
    <a class="btn btn--ghost" href="tel:1091">Women's helpline 1091</a>
    <a class="btn btn--ghost" href="tel:1363">Tourist helpline 1363</a>
  </div>
</section>`;

  const progress = document.getElementById("safety-progress");
  const okayRow = document.getElementById("okay-row");
  const note = document.getElementById("s-ics-note");

  const state = () => {
    const checks = {};
    CHECKLIST.forEach(c => {
      const el = app.querySelector(`[name="${c.key}"]`);
      if (el && el.checked) checks[c.key] = true;
    });
    return {
      checks,
      who: app.querySelector("#s-who").value.trim(),
      num: app.querySelector("#s-num").value.trim(),
      from: app.querySelector("#s-from").value,
      to: app.querySelector("#s-to").value,
      times: [...app.querySelectorAll('[name="t"]:checked')].map(i => i.value)
    };
  };

  function paintOkay(s) {
    const to = digits(s.num);
    const name = s.who || "them";
    const link = (text) => `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
    if (!to) {
      okayRow.innerHTML = `<p class="muted">Add a name and number above and the buttons appear here.</p>`;
      return;
    }
    okayRow.innerHTML = `
      <a class="okay okay--safe" href="${link("I'm safe. All good — will message again later.")}"
         target="_blank" rel="noopener"><span>🟢</span> I'm safe<em>to ${esc(name)}</em></a>
      <a class="okay okay--help" href="${link("I'm okay but I need you to call me when you see this.")}"
         target="_blank" rel="noopener"><span>🟡</span> Call me<em>to ${esc(name)}</em></a>
      <a class="okay okay--sos" href="${link("I need help. Please call me now.")}"
         target="_blank" rel="noopener"><span>🔴</span> I need help now<em>to ${esc(name)} — call 112 first if you are in danger</em></a>`;
  }

  function paintProgress(s) {
    const done = Object.keys(s.checks).length;
    progress.textContent = done === CHECKLIST.length
      ? "All ten. You are as ready as anyone gets."
      : `${done} of ${CHECKLIST.length} done.`;
  }

  const sync = () => { const s = state(); write(s); paintProgress(s); paintOkay(s); };
  app.addEventListener("input", sync);
  app.addEventListener("change", sync);
  sync();

  document.getElementById("s-ics").addEventListener("click", () => {
    const s = state();
    if (!s.from || !s.to) { note.textContent = "Pick the dates you are away."; return; }
    if (!s.times.length) { note.textContent = "Choose at least one time."; return; }
    const built = buildIcs({ from: s.from, to: s.to, times: s.times, who: s.who });
    if (!built) { note.textContent = "Those dates do not look right — check the order."; return; }

    const blob = new Blob([built.ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pehchan-check-ins.ics";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    note.textContent = `${built.count} reminder${built.count === 1 ? "" : "s"} downloaded. Open the file to add them to your calendar.`;
  });
}
