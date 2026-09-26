/**
 * Share with Family.
 *
 * She fills in her trip; the page produces something her family can read,
 * keep, and act on. The survey behind this product found the permission
 * gradient running all the way to "I cannot travel without their approval" —
 * so the family is often the real decision-maker, and reassurance without
 * evidence does not move them. This replaces "don't worry" with a phone
 * number for the hotel.
 *
 * No backend. The pack is encoded into the URL fragment, so the link renders
 * for whoever opens it and the details never reach a server — not ours, not
 * anyone's. A fragment is not sent in the HTTP request at all.
 *
 * That also means the link IS the data: anyone holding it can read the trip.
 * The page says so, plainly, before she shares it.
 */

const FIELDS = [
  { section: "The trip" },
  { key: "name", label: "Your name", type: "text", placeholder: "So the pack is addressed properly" },
  { key: "destination", label: "Where you are going", type: "text", required: true },
  { key: "leaveDate", label: "Leaving on", type: "date", required: true },
  { key: "returnDate", label: "Back on", type: "date", required: true },

  { section: "Getting there and back" },
  { key: "outbound", label: "How you are travelling out", type: "text",
    placeholder: "6E 2134, Delhi to Udaipur, landing 14:20" },
  { key: "inbound", label: "How you are coming back", type: "text",
    placeholder: "Train 12964, departs 21:10, arrives 06:40" },
  { key: "transfer", label: "How you get from the airport or station to where you are staying", type: "textarea",
    rows: 2, placeholder: "Hotel is sending a car. Driver's number will be shared the day before." },
  { key: "backup", label: "What you will do if you miss it", type: "textarea", rows: 2,
    placeholder: "Wait inside the terminal and book the next one. I will not take a cab from the rank at night." },

  { section: "Where you are staying" },
  { key: "stayName", label: "Name of the hotel or guesthouse", type: "text", required: true },
  { key: "stayAddress", label: "Address", type: "textarea", rows: 2 },
  { key: "stayPhone", label: "Their phone number", type: "tel",
    placeholder: "So your family can call the front desk themselves" },

  { section: "The plan" },
  { key: "plan", label: "Roughly what you are doing each day", type: "textarea", rows: 6,
    placeholder: "Day 1 — arrive, rest.\nDay 2 — old city on foot.\nDay 3 — lake, back by dark.\nDay 4 — travel home." },
  { key: "cost", label: "Roughly what it costs", type: "text", placeholder: "₹16,000 including travel" },

  { section: "Staying in touch" },
  { key: "myPhone", label: "Your number", type: "tel", required: true },
  { key: "checkIn", label: "How often you will check in", type: "select",
    options: ["Twice a day — morning and evening", "Once a day, every evening",
              "Every morning", "Every two days", "Whenever I can get signal"] },
  { key: "contacts", label: "Who else knows your plan", type: "textarea", rows: 3,
    placeholder: "One name and number per line — a friend, a colleague, anyone at the destination." },
  { key: "sharing", label: "How they can see where you are", type: "text",
    placeholder: "Live location shared on WhatsApp with Amma and Divya for the whole trip" },

  { section: "If something goes wrong" },
  { key: "localHelp", label: "Local emergency numbers and the nearest hospital", type: "textarea", rows: 2,
    placeholder: "112 nationwide. Nearest hospital: GBH American, 3km from the hotel." },
  { key: "insurance", label: "Travel insurance", type: "text", placeholder: "Provider and policy number" }
];

const STORE = "pehchan-family-pack";
const esc = (s) => String(s == null ? "" : s)
  .replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const nl = (s) => esc(s).replace(/\n/g, "<br>");

/* ---- the link is the data ------------------------------------------- */

function encode(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = "";
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decode(str) {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - b64.length % 4) % 4));
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch { return null; }
}

const readSaved = () => { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } };
const writeSaved = (d) => { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch { /* ignore */ } };

/* ---- the pack ------------------------------------------------------- */

const dateText = (d) => {
  if (!d) return "";
  const t = new Date(d + "T00:00:00");
  return isNaN(t) ? d : t.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

function nights(a, b) {
  if (!a || !b) return null;
  const n = Math.round((new Date(b) - new Date(a)) / 86400000);
  return n > 0 ? n : null;
}

/** The five questions a family actually asks, answered from what she entered. */
function answers(d) {
  const out = [];
  out.push(["Where will she stay?", d.stayName
    ? `<strong>${esc(d.stayName)}</strong>${d.stayAddress ? `<br>${nl(d.stayAddress)}` : ""}`
      + (d.stayPhone ? `<br>You can call them yourself: <a href="tel:${esc(d.stayPhone)}">${esc(d.stayPhone)}</a>` : "")
    : "Not filled in yet."]);
  out.push(["How will she travel?", [d.outbound, d.inbound, d.transfer].filter(Boolean).map(nl).join("<br>")
    || "Not filled in yet."]);
  out.push(["What if she misses her transport?", d.backup ? nl(d.backup) : "Not filled in yet."]);
  out.push(["Who knows where she is?", [
    d.contacts ? nl(d.contacts) : "",
    d.sharing ? nl(d.sharing) : "",
    d.checkIn ? `She will be in touch: <strong>${esc(d.checkIn.toLowerCase())}</strong>.` : ""
  ].filter(Boolean).join("<br>") || "Not filled in yet."]);
  out.push(["What happens in an emergency?", [
    d.myPhone ? `Her number: <a href="tel:${esc(d.myPhone)}">${esc(d.myPhone)}</a>` : "",
    d.localHelp ? nl(d.localHelp) : "",
    d.insurance ? `Insurance: ${esc(d.insurance)}` : ""
  ].filter(Boolean).join("<br>") || "Not filled in yet."]);
  return out;
}

function renderPack(host, d) {
  const n = nights(d.leaveDate, d.returnDate);
  const who = d.name ? `${d.name}'s trip` : "The trip";

  host.innerHTML = `
<article class="pack">
  <header class="pack__head">
    <span class="eyebrow">Travel plan</span>
    <h2>${esc(who)} to ${esc(d.destination || "—")}</h2>
    <p class="pack__dates">${esc(dateText(d.leaveDate))} &rarr; ${esc(dateText(d.returnDate))}${
      n ? ` · ${n} night${n === 1 ? "" : "s"}` : ""}</p>
  </header>

  <section class="pack__qa">
    ${answers(d).map(([q, a]) => `<div class="pack__q"><h3>${esc(q)}</h3><p>${a}</p></div>`).join("")}
  </section>

  ${d.plan ? `<section class="pack__block"><h3>Day by day</h3><p>${nl(d.plan)}</p></section>` : ""}
  ${d.cost ? `<section class="pack__block"><h3>What it costs</h3><p>${esc(d.cost)}</p></section>` : ""}

  <footer class="pack__foot">
    <p>Made with Pehchan. Nothing here was sent to us — this page was built on her phone,
       and the details live only in the link she shared with you.</p>
  </footer>
</article>`;
}

/* ---- boot ------------------------------------------------------------ */

const app = document.getElementById("family-app");
if (app) {
  const shared = location.hash.length > 1 ? decode(location.hash.slice(1)) : null;

  if (shared) {
    renderPack(app, shared);
    const back = document.createElement("div");
    back.className = "btn-row";
    back.innerHTML = `<a class="btn btn--ghost" href="${location.pathname}">Make my own</a>
      <button class="btn btn--ghost" type="button" id="pack-print">Print this</button>`;
    app.append(back);
    document.getElementById("pack-print").addEventListener("click", () => window.print());
  } else {
    const saved = readSaved();
    app.innerHTML = `<form id="pack-form" novalidate>${FIELDS.map(f => {
      if (f.section) return `<div class="form-section"><h2>${esc(f.section)}</h2></div>`;
      const id = "p-" + f.key;
      const v = saved[f.key] || "";
      const req = f.required ? ' <span class="req">required</span>' : "";
      if (f.type === "textarea") {
        return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
          <textarea id="${id}" name="${f.key}" rows="${f.rows || 3}" data-voice
            placeholder="${esc(f.placeholder || "")}">${esc(v)}</textarea></div>`;
      }
      if (f.type === "select") {
        return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
          <select id="${id}" name="${f.key}">${f.options.map(o =>
            `<option${v === o ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;
      }
      return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
        <input type="${f.type}" id="${id}" name="${f.key}" value="${esc(v)}"
          placeholder="${esc(f.placeholder || "")}"></div>`;
    }).join("")}
    <div class="btn-row"><button class="btn btn--primary" type="submit">Make the pack</button></div>
    <p class="muted" id="pack-status" role="status" aria-live="polite"></p></form>
    <div id="pack-out"></div>`;

    import("./voice.js").then(m => m.initVoice(app)).catch(() => { /* optional */ });

    const form = document.getElementById("pack-form");
    const out = document.getElementById("pack-out");
    const status = document.getElementById("pack-status");

    let t;
    form.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const d = {};
        FIELDS.filter(f => !f.section).forEach(f => {
          const el = form.elements[f.key];
          if (el && el.value.trim()) d[f.key] = el.value.trim();
        });
        writeSaved(d);
      }, 500);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = {};
      FIELDS.filter(f => !f.section).forEach(f => {
        const el = form.elements[f.key];
        if (el && el.value.trim()) d[f.key] = el.value.trim();
      });
      const missing = FIELDS.filter(f => f.required && !d[f.key]).map(f => f.label);
      if (missing.length) { status.textContent = "Still needed: " + missing.join(", ") + "."; return; }

      writeSaved(d);
      const link = location.origin + location.pathname + "#" + encode(d);
      const msg = `${d.name ? d.name + "'s" : "My"} travel plan for ${d.destination}`
        + ` — where I am staying, how I am travelling, and who to call. ${link}`;

      out.innerHTML = "";
      renderPack(out, d);

      const row = document.createElement("div");
      row.className = "btn-row";
      row.innerHTML = `
        <a class="btn btn--primary" href="https://wa.me/?text=${encodeURIComponent(msg)}"
           target="_blank" rel="noopener">Send on WhatsApp</a>
        <button class="btn btn--ghost" type="button" id="pack-copy">Copy the link</button>
        <button class="btn btn--ghost" type="button" id="pack-print2">Print it</button>`;
      out.append(row);

      // Browsers and messaging apps handle long URLs unevenly past ~2000
      // characters. Say so rather than letting a truncated link fail silently.
      if (link.length > 1900) {
        const long = document.createElement("p");
        long.className = "disclosure";
        long.innerHTML = `<span><strong>This link is getting long.</strong> Some apps cut very long
          links. Shortening the day-by-day plan will make it more reliable — or print the pack and
          send a photo of it instead.</span>`;
        out.append(long);
      }

      const warn = document.createElement("p");
      warn.className = "disclosure";
      warn.innerHTML = `<span><strong>The link carries your details.</strong> Everything above travels
        inside it — it was never sent to us and it is not stored anywhere, but anyone who opens the link
        can read it. Send it only to the people you want to have it.</span>`;
      out.append(warn);

      document.getElementById("pack-copy").addEventListener("click", async (ev) => {
        try { await navigator.clipboard.writeText(link); ev.target.textContent = "Copied"; }
        catch { status.textContent = link; }
      });
      document.getElementById("pack-print2").addEventListener("click", () => window.print());
      out.scrollIntoView({ behavior: "smooth", block: "start" });
      status.textContent = "";
    });
  }
}
