/**
 * Incident reporting.
 *
 * Deliberately unlike every other form on this site.
 *
 * It does NOT autosave. The trip form keeps a draft because losing ten
 * minutes of writing loses the submission; here, a half-written account of
 * being harassed, sitting in localStorage on a borrowed or shared phone, is a
 * risk to the woman who wrote it. Nothing is persisted. Close the tab and it
 * is gone, which is the correct behaviour for this one.
 *
 * It does NOT post to the Google Form backend either. Sheets is right for trip
 * reports and wrong for this: harassment data needs real access control, not a
 * Drive folder (docs/14). Until there is somewhere properly controlled, she
 * composes the report here and sends it herself, from whatever address she
 * chooses — which also means she can be genuinely anonymous.
 */

const FIELDS = [
  { section: "What happened" },
  { key: "category", label: "What kind of thing?", type: "select", required: true,
    options: ["", "A driver or transport", "Accommodation", "A scam or overcharging",
              "Someone following or approaching me", "An unsafe place or route",
              "A tour, guide or activity", "A payment or booking", "Something else"] },
  { key: "what", label: "What happened?", type: "textarea", rows: 6, required: true,
    placeholder: "As much or as little as you want to write." },
  { key: "when", label: "Roughly when?", type: "text", placeholder: "Last week, or a date if you remember it" },
  { key: "where", label: "Which town or city?", type: "text", required: true },
  { key: "area", label: "Which area, if you are comfortable saying", type: "text" },

  { section: "Was anyone or anywhere involved by name?",
    note: "Only if you want to. A name goes nowhere near the public site — it is checked first, and the business gets a right of reply before anything is ever said publicly. Most reports do not need this to be useful." },
  { key: "named", label: "Name of the business, driver or service", type: "text" },

  { section: "What you did" },
  { key: "didWhat", label: "What did you do?", type: "textarea", rows: 3 },
  { key: "reported", label: "Did you report it to anyone?", type: "select",
    options: ["", "No", "Police", "The hotel or operator", "A helpline", "Someone else"] },
  { key: "resolved", label: "Was it resolved?", type: "select",
    options: ["", "Yes", "Partly", "No", "I did not pursue it"] },
  { key: "advice", label: "What would you tell another woman about this?", type: "textarea", rows: 3,
    placeholder: "The thing you wish somebody had told you." },

  { section: "How we may use it" },
  { key: "use", label: "", type: "radio", required: true,
    options: [
      "Use it to warn other women — checked first, and never with anything that identifies me",
      "Only to inform Pehchan's own checks — do not publish anything from it",
      "I am just telling you. Do not use it at all."
    ] },
  { key: "contact", label: "A way to reach you, only if you want a reply", type: "text",
    placeholder: "Leave blank to stay completely anonymous" }
];

const esc = (s) => String(s == null ? "" : s)
  .replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

const app = document.getElementById("incident-app");

if (app) {
  app.innerHTML = `<form id="incident-form" novalidate autocomplete="off">
    ${FIELDS.map(f => {
      if (f.section) {
        return `<div class="form-section"><h2>${esc(f.section)}</h2>${
          f.note ? `<p class="muted">${esc(f.note)}</p>` : ""}</div>`;
      }
      const id = "i-" + f.key;
      const req = f.required ? ' <span class="req">required</span>' : "";
      if (f.type === "radio") {
        return `<fieldset class="field"><legend>${esc(f.label)}${req}</legend>
          <div class="choices choices--stack">${f.options.map((o, i) => `<label class="choice">
            <input type="radio" name="${f.key}" value="${esc(o)}" id="${id}-${i}"> ${esc(o)}</label>`).join("")}
          </div></fieldset>`;
      }
      if (f.type === "select") {
        return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
          <select id="${id}" name="${f.key}">${f.options.map(o =>
            `<option value="${esc(o)}">${esc(o) || "—"}</option>`).join("")}</select></div>`;
      }
      if (f.type === "textarea") {
        return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
          <textarea id="${id}" name="${f.key}" rows="${f.rows || 3}" data-voice
            placeholder="${esc(f.placeholder || "")}"></textarea></div>`;
      }
      return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
        <input type="text" id="${id}" name="${f.key}" placeholder="${esc(f.placeholder || "")}"></div>`;
    }).join("")}
    <div class="btn-row">
      <button class="btn btn--primary" type="submit">Prepare my report</button>
      <button class="btn btn--ghost" type="button" id="i-clear">Clear this form</button>
    </div>
    <p class="muted" id="i-status" role="status" aria-live="polite"></p>
  </form>
  <div id="i-out"></div>`;

  import("./voice.js").then(m => m.initVoice(app)).catch(() => { /* optional */ });

  const form = document.getElementById("incident-form");
  const out = document.getElementById("i-out");
  const status = document.getElementById("i-status");

  document.getElementById("i-clear").addEventListener("click", () => {
    form.reset();
    out.innerHTML = "";
    status.textContent = "Cleared. Nothing was saved.";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    for (const f of FIELDS) {
      if (f.section) continue;
      if (f.type === "radio") {
        const on = form.querySelector(`[name="${CSS.escape(f.key)}"]:checked`);
        if (on) data[f.key] = on.value;
      } else {
        const el = form.elements[f.key];
        if (el && el.value.trim()) data[f.key] = el.value.trim();
      }
    }

    const missing = FIELDS.filter(f => f.required && !data[f.key])
      .map(f => f.label || "how we may use it");
    if (missing.length) { status.textContent = "Still needed: " + missing.join(", ") + "."; return; }

    const text = FIELDS.filter(f => !f.section && data[f.key])
      .map(f => `${f.label || "How we may use it"}\n  ${data[f.key]}`).join("\n\n");

    out.innerHTML = "";
    const box = document.createElement("div");
    box.className = "disclosure";
    box.innerHTML = `<span><strong>Nothing has been sent.</strong> Your report is below. Copy it and
      email it to us — from any address, including one that is not yours. We would rather you stayed
      anonymous than not tell us at all.</span>`;
    const ta = document.createElement("textarea");
    ta.rows = 14; ta.readOnly = true; ta.value = text; ta.className = "trip-form__out";
    const row = document.createElement("div");
    row.className = "btn-row";
    row.innerHTML = `<button class="btn btn--primary" type="button" id="i-copy">Copy my report</button>`;
    out.append(box, ta, row);

    document.getElementById("i-copy").addEventListener("click", async (ev) => {
      try { await navigator.clipboard.writeText(text); ev.target.textContent = "Copied"; }
      catch { ta.select(); ev.target.textContent = "Press Ctrl/Cmd+C"; }
    });
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    status.textContent = "";
  });
}
