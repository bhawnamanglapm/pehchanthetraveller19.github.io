/**
 * The share-your-trip form.
 *
 * Builds the field set from one declaration, keeps a draft in localStorage as
 * she types (it is a long form and losing it would be the end of the
 * submission), and posts to the endpoint configured in site.json. With no
 * endpoint set it degrades to handing her the text rather than silently
 * dropping what she wrote.
 *
 * Nothing is sent anywhere until she presses submit.
 */
const DRAFT = "pehchan-trip-draft";

const FIELDS = [
  { section: "Your trip", note: "Only the first two are required." },
  { name: "destination", label: "Where did you go?", type: "text", required: true, placeholder: "Town or city, and state" },
  { name: "days", label: "How many days?", type: "number", required: true, min: 1, max: 120 },
  { name: "startedFrom", label: "Which city did you travel from?", type: "text" },
  { name: "month", label: "When?", type: "month" },
  { name: "travelledAs", label: "Who did you travel with?", type: "radio",
    options: ["Alone", "With a friend", "With friends", "With a group", "With family"] },
  { name: "firstSolo", label: "Was this your first solo trip?", type: "radio", options: ["Yes", "No"] },
  { name: "ageGroup", label: "Age group", type: "select", optional: true,
    options: ["Prefer not to say", "Under 25", "25–30", "31–35", "36–40", "41–50", "Over 50"] },

  { section: "Planned against actual", note: "The single most useful thing you can tell another woman." },
  { name: "plannedBudget", label: "What did you expect to spend, in total?", type: "number", prefix: "₹" },
  { name: "actualSpend", label: "What did you actually spend?", type: "number", prefix: "₹" },
  { name: "spendTransport", label: "Of that — transport", type: "number", prefix: "₹" },
  { name: "spendStay", label: "Stay", type: "number", prefix: "₹" },
  { name: "spendFood", label: "Food", type: "number", prefix: "₹" },
  { name: "spendActivities", label: "Activities", type: "number", prefix: "₹" },
  { name: "spendLocal", label: "Local transport", type: "number", prefix: "₹" },
  { name: "changed", label: "What changed from the plan?", type: "checkbox",
    options: ["Transport delay", "Weather", "More expensive than expected", "Changed accommodation",
              "Added activities", "Felt uncomfortable somewhere", "Found something better locally", "Other"] },

  { section: "What you wish you knew", note: "Write it the way you would tell a friend." },
  { name: "wishIKnew", label: "Before this trip, I wish I had known…", type: "textarea", rows: 4,
    placeholder: "The airport transfer takes far longer than the map says. The area is very quiet after 9pm. You need more cash than you think." },
  { name: "bestSurprise", label: "Best surprise", type: "textarea", rows: 2 },
  { name: "disappointment", label: "Biggest disappointment", type: "textarea", rows: 2 },
  { name: "hiddenGem", label: "Something you found that was not in any itinerary", type: "textarea", rows: 2 },

  { section: "Did anything go wrong?",
    note: "A page where nothing ever goes wrong is no use to anyone. If it involved harassment or assault, please do not write it here — use the private route at the bottom instead, and it will never be published." },
  { name: "wentWrongCategory", label: "What kind of thing?", type: "select",
    options: ["Nothing went wrong", "Transport", "Accommodation", "Money or payment", "Connectivity",
              "Navigation", "Documentation", "Lost belongings", "Weather", "Health", "Food", "Booking", "Other"] },
  { name: "wentWrongWhat", label: "What happened?", type: "textarea", rows: 3 },
  { name: "wentWrongDid", label: "What did you do about it?", type: "textarea", rows: 3 },
  { name: "wentWrongAdvice", label: "What would you tell another woman to do?", type: "textarea", rows: 2 },

  { section: "How it felt" },
  { name: "confidenceBefore", label: "Before the trip, how confident were you?", type: "radio",
    options: ["Very nervous", "Nervous", "Neutral", "Confident", "Very confident"] },
  { name: "confidenceAfter", label: "And afterwards?", type: "radio",
    options: ["Very nervous", "Nervous", "Neutral", "Confident", "Very confident"] },
  { name: "couldDoAlone", label: "What did you do alone on this trip?", type: "checkbox",
    options: ["Took a flight alone", "Took a train alone", "Took a bus alone", "Used local transport",
              "Checked into a hotel alone", "Ate alone", "Went sightseeing alone", "Trekked",
              "Met strangers", "Joined a group activity", "Navigated an unfamiliar city", "Handled a problem alone"] },

  { section: "Who is it for?" },
  { name: "wouldReturn", label: "Would you travel there again?", type: "radio",
    options: ["Absolutely", "Probably", "Maybe", "Probably not"] },
  { name: "suitableFor", label: "Who would this trip suit?", type: "checkbox",
    options: ["First-time solo travellers", "Experienced solo travellers", "Introverts", "Social travellers",
              "Budget travellers", "Luxury travellers", "Adventure lovers", "Slow travellers",
              "Women travelling with family", "Women looking for a short break"] },
  { name: "packingUsed", label: "What did you actually use?", type: "textarea", rows: 2 },
  { name: "packingUnused", label: "What did you carry and never touch?", type: "textarea", rows: 2 },

  { section: "Before you send it", note: "This part decides how your story appears." },
  { name: "visibility", label: "How should this be shown?", type: "radio",
    options: ["Anonymous — no name, no handle (recommended)",
              "With my first name only",
              "With my name and Instagram",
              "Private — use it to improve Pehchan, do not publish it"] },
  { name: "verification", label: "Can you show us it happened?", type: "radio",
    options: ["I can send a booking or ticket if you ask — mark it verified",
              "No — publish it as a community experience"] },
  { name: "contact", label: "How do we reach you about this story?", type: "text",
    placeholder: "Email, phone or Instagram — kept separate from your story, never published" },
  { name: "consent", label: "", type: "consentCheck",
    options: ["I wrote this myself, it is my own trip, and Pehchan may publish it as I have chosen above. I understand I can have it removed at any time."] }
];

/* ---- draft ----------------------------------------------------------- */
const readDraft = () => { try { return JSON.parse(localStorage.getItem(DRAFT) || "{}"); } catch { return {}; } };
const writeDraft = (d) => { try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch { /* ignore */ } };
const dropDraft = () => { try { localStorage.removeItem(DRAFT); } catch { /* ignore */ } };

/* ---- build ----------------------------------------------------------- */
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

function fieldHtml(f, draft) {
  const v = draft[f.name];
  const id = "f-" + f.name;
  const req = f.required ? ' <span class="req" aria-hidden="true">required</span>' : "";

  if (f.type === "radio" || f.type === "checkbox" || f.type === "consentCheck") {
    const type = f.type === "checkbox" ? "checkbox" : f.type === "consentCheck" ? "checkbox" : "radio";
    const chosen = Array.isArray(v) ? v : v != null ? [v] : [];
    return `<fieldset class="field"><legend>${esc(f.label)}${req}</legend>
      <div class="choices">${f.options.map((o, i) => `<label class="choice">
        <input type="${type}" name="${esc(f.name)}" value="${esc(o)}" id="${id}-${i}"
          ${chosen.includes(o) ? "checked" : ""}> ${esc(o)}</label>`).join("")}</div></fieldset>`;
  }
  if (f.type === "select") {
    return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
      <select id="${id}" name="${esc(f.name)}">
        ${f.options.map(o => `<option${v === o ? " selected" : ""}>${esc(o)}</option>`).join("")}
      </select></div>`;
  }
  if (f.type === "textarea") {
    return `<div class="field"><label for="${id}">${esc(f.label)}${req}</label>
      <textarea id="${id}" name="${esc(f.name)}" rows="${f.rows || 3}"
        ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ""}>${esc(v || "")}</textarea></div>`;
  }
  const attrs = [
    `type="${esc(f.type)}"`, `id="${id}"`, `name="${esc(f.name)}"`,
    v != null ? `value="${esc(v)}"` : "",
    f.placeholder ? `placeholder="${esc(f.placeholder)}"` : "",
    f.min != null ? `min="${f.min}"` : "", f.max != null ? `max="${f.max}"` : "",
    f.required ? "required" : ""
  ].filter(Boolean).join(" ");
  return `<div class="field"><label for="${id}">${esc(f.label)}${f.prefix ? ` (${esc(f.prefix)})` : ""}${req}</label>
    <input ${attrs}></div>`;
}

function collect(form) {
  const out = {};
  for (const f of FIELDS) {
    if (f.section) continue;
    if (f.type === "checkbox" || f.type === "consentCheck") {
      const on = [...form.querySelectorAll(`[name="${CSS.escape(f.name)}"]:checked`)].map(i => i.value);
      if (on.length) out[f.name] = on;
    } else if (f.type === "radio") {
      const on = form.querySelector(`[name="${CSS.escape(f.name)}"]:checked`);
      if (on) out[f.name] = on.value;
    } else {
      const el = form.elements[f.name];
      if (el && el.value !== "") out[f.name] = el.value;
    }
  }
  return out;
}

function asText(data) {
  return FIELDS.filter(f => !f.section && data[f.name] != null)
    .map(f => `${f.label || "Consent"}\n  ${[].concat(data[f.name]).join("; ")}`)
    .join("\n\n");
}

/* ---- boot ------------------------------------------------------------ */
const form = document.getElementById("trip-form");
const host = document.getElementById("trip-form-fields");

if (form && host) {
  const draft = readDraft();
  host.innerHTML = FIELDS.map(f => f.section
    ? `<div class="form-section"><h2>${esc(f.section)}</h2>${f.note ? `<p class="muted">${esc(f.note)}</p>` : ""}</div>`
    : fieldHtml(f, draft)).join("");

  const status = document.getElementById("trip-form-status");
  let saveTimer;
  form.addEventListener("input", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      writeDraft(collect(form));
      status.textContent = "Draft saved on this device.";
    }, 600);
  });

  form.querySelector("[data-clear-draft]").addEventListener("click", () => {
    dropDraft();
    form.reset();
    host.innerHTML = FIELDS.map(f => f.section
      ? `<div class="form-section"><h2>${esc(f.section)}</h2>${f.note ? `<p class="muted">${esc(f.note)}</p>` : ""}</div>`
      : fieldHtml(f, {})).join("");
    status.textContent = "Draft cleared.";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = collect(form);

    if (!data.destination || !data.days) {
      status.textContent = "Please give at least the destination and how many days.";
      return;
    }
    if (!data.consent) {
      status.textContent = "Please confirm the last box so we know we may publish it.";
      return;
    }

    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      // No backend yet. Never lose what she wrote: show it and let her copy it.
      status.innerHTML = "";
      const box = document.createElement("div");
      box.className = "disclosure";
      box.innerHTML = `<span><strong>Submissions are not connected yet.</strong> Your story is below and
        saved on this device. Copy it and send it to us, and it goes up within 12 hours.</span>`;
      const ta = document.createElement("textarea");
      ta.rows = 12; ta.readOnly = true; ta.value = asText(data); ta.className = "trip-form__out";
      const copy = document.createElement("button");
      copy.type = "button"; copy.className = "btn btn--primary"; copy.textContent = "Copy my story";
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(ta.value); copy.textContent = "Copied"; }
        catch { ta.select(); copy.textContent = "Press Ctrl/Cmd+C"; }
      });
      status.append(box, ta, copy);
      return;
    }

    status.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() })
      });
      if (!res.ok) throw new Error(String(res.status));
      dropDraft();
      form.innerHTML = `<div class="disclosure"><span><strong>Thank you — we have it.</strong>
        A person reads it next, and it goes up within 12 hours or you hear back why not.
        If you said you could verify the trip, we will ask for the booking and delete it once checked.</span></div>`;
    } catch {
      status.textContent = "That did not send. Your draft is saved — please try again in a moment.";
    }
  });
}
