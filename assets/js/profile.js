/**
 * The Solo Travel Profile engine.
 *
 * A woman rates her comfort on twelve axes; a destination is rated on the same
 * twelve for how much comfort it demands. The match is a per-axis comparison,
 * so every answer explains itself instead of emitting a score:
 *
 *     gap[axis] = destination.demand[axis] − traveller.comfort[axis]
 *
 * Everything runs in the browser. The profile is written to localStorage and
 * never leaves the device — which matters, because these questions ask a woman
 * what she is afraid of.
 */
const KEY = "pehchan-comfort-profile";

/* ---- storage --------------------------------------------------------- */

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && p.comfort ? p : null;
  } catch { return null; }
}

export function saveProfile(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); return true; }
  catch { return false; }        // private mode, blocked storage — never throw
}

export function clearProfile() {
  try { localStorage.removeItem(KEY); } catch { /* nothing to do */ }
}

/* ---- derivation ------------------------------------------------------ */

/** Mean comfort across every answered axis. */
export function meanComfort(comfort, axes) {
  const vals = axes.map(a => comfort[a.key]).filter(v => typeof v === "number");
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export function tierFor(mean, tiers) {
  return tiers.find(t => mean <= t.max) || tiers[tiers.length - 1];
}

/** The "you prefer…" bullets, from rules rather than prose written per tier. */
export function preferencesFor(comfort, rules) {
  const out = [];
  for (const r of rules) {
    const v = comfort[r.axis];
    if (typeof v !== "number") continue;
    if (typeof r.atMost === "number" && v <= r.atMost) out.push(r.text);
    if (typeof r.atLeast === "number" && v >= r.atLeast) out.push(r.text);
  }
  return [...new Set(out)];
}

/** The axes she is already comfortable with. Leads the result, deliberately. */
export function strengthsFor(comfort, axes) {
  return axes.filter(a => comfort[a.key] >= 4);
}

/** "How do I book a safe place?" answered from her own answers. */
export function bookingFor(comfort, rules) {
  const out = [];
  for (const r of rules || []) {
    const v = comfort[r.axis];
    if (typeof v !== "number") continue;
    if (typeof r.atMost === "number" && v <= r.atMost) out.push(r.text);
    if (typeof r.atLeast === "number" && v >= r.atLeast) out.push(r.text);
  }
  return [...new Set(out)];
}

/**
 * Compare a profile against a destination's demand vector.
 * Returns the axes that stretch her, worst first, plus the ones that suit her.
 */
export function matchDestination(comfort, demand, axes) {
  const stretch = [], comfortable = [];
  for (const a of axes) {
    const c = comfort[a.key], d = demand[a.key];
    if (typeof c !== "number" || typeof d !== "number") continue;
    const gap = d - c;
    (gap > 0 ? stretch : comfortable).push({ axis: a, gap, comfort: c, demand: d });
  }
  stretch.sort((x, y) => y.gap - x.gap);
  return {
    stretch,
    comfortable,
    // A single stretched axis is a thing to prepare for; several at once is
    // what makes a trip genuinely hard. Deliberately not a score out of 100.
    verdict: stretch.length === 0 ? "suits"
           : stretch.length <= 2 && stretch[0].gap <= 2 ? "prepare"
           : "stretch"
  };
}

/* ---- questionnaire UI ------------------------------------------------ */

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderResult(host, model, profile) {
  const { axes, tiers, preferences, scale, bookingRules } = model;
  const mean = meanComfort(profile.comfort, axes);
  const tier = tierFor(mean, tiers);
  const prefs = preferencesFor(profile.comfort, preferences);
  const strong = strengthsFor(profile.comfort, axes);
  const booking = bookingFor(profile.comfort, bookingRules);

  host.innerHTML = "";
  const card = el("div", "profile-result");

  // Answer the question she actually asked before describing her.
  card.append(el("span", "eyebrow", "Your Solo Travel Profile"));
  const yes = el("p", "profile-result__yes", "Yes — you can do this.");
  card.append(yes);
  const h = el("h2", "profile-result__tier"); h.textContent = tier.name; card.append(h);
  card.append(el("p", "profile-result__summary", tier.summary));

  // Strengths first. She came in expecting to be told what she cannot do.
  const strengths = el("section", "profile-result__block");
  strengths.append(el("h3", null, "What you are already comfortable with"));
  if (strong.length) {
    strengths.append(el("p", null,
      `You said you are fine with ${strong.length} of the ${axes.length} things a trip asks of you.`));
    const ul = el("ul", "profile-result__tags");
    strong.forEach(a => ul.append(el("li", null, a.label)));
    strengths.append(ul);
  } else {
    strengths.append(el("p", null,
      "You would want most of it arranged for you. That is a completely normal place to begin, "
      + "and it is exactly what a planned first trip is for."));
  }
  card.append(strengths);

  if (prefs.length) {
    const b = el("section", "profile-result__block");
    b.append(el("h3", null, "What to look for in a trip"));
    const ul = el("ul", "profile-result__prefs");
    prefs.forEach(p => ul.append(el("li", null, p)));
    b.append(ul);
    card.append(b);
  }

  if (booking.length) {
    const b = el("section", "profile-result__block");
    b.append(el("h3", null, "How to book it safely"));
    b.append(el("p", "muted", "Specific to your answers — not general advice."));
    const ol = el("ol", "profile-result__booking");
    booking.forEach(t => ol.append(el("li", null, t)));
    b.append(ol);
    card.append(b);
  }

  const detail = el("details", "profile-result__detail");
  detail.append(el("summary", null, "See every answer"));
  const dl = el("dl", "profile-result__grid");
  axes.forEach(a => {
    const v = profile.comfort[a.key];
    dl.append(el("dt", null, a.label));
    dl.append(el("dd", null, (scale.find(s => s.value === v) || {}).traveller || "—"));
  });
  detail.append(dl);
  card.append(detail);

  const note = el("p", "profile-result__note");
  note.textContent = "Saved on this device only. It is not sent anywhere, and we cannot see it.";
  card.append(note);

  const row = el("div", "btn-row");
  const again = el("button", "btn btn--ghost", "Answer again");
  again.type = "button";
  again.addEventListener("click", () => { clearProfile(); start(host, model); });
  const forget = el("button", "btn btn--ghost", "Delete my profile");
  forget.type = "button";
  forget.addEventListener("click", () => {
    clearProfile();
    host.innerHTML = "";
    host.append(el("p", "profile-result__note", "Deleted from this device."));
    const b = el("button", "btn btn--primary", "Start again");
    b.type = "button";
    b.addEventListener("click", () => start(host, model));
    const r = el("div", "btn-row"); r.append(b); host.append(r);
  });
  row.append(again, forget);
  card.append(row);

  host.append(card);
  host.dispatchEvent(new CustomEvent("profile:ready", { bubbles: true, detail: profile }));
}

function renderQuestions(host, model) {
  const { axes, scale } = model;
  const answers = {};

  host.innerHTML = "";
  const form = el("form", "profile-form");
  form.noValidate = true;

  const intro = el("p", "profile-form__intro");
  intro.textContent = "Twelve questions. There are no right answers, and nothing here is a test — "
    + "the point is to describe how you actually feel, so that what we suggest fits you.";
  form.append(intro);

  axes.forEach((a, i) => {
    const fs = el("fieldset", "profile-q");
    const lg = el("legend");
    lg.append(el("span", "profile-q__num", String(i + 1).padStart(2, "0")));
    lg.append(document.createTextNode(" How comfortable are you with: " + a.question + "?"));
    fs.append(lg);

    const opts = el("div", "profile-q__opts");
    scale.forEach(s => {
      const id = `${a.key}-${s.value}`;
      const label = el("label", "choice choice--scale");
      const input = document.createElement("input");
      input.type = "radio"; input.name = a.key; input.value = String(s.value); input.id = id;
      input.addEventListener("change", () => {
        answers[a.key] = s.value;
        fs.classList.add("is-answered");
        progress.textContent = `${Object.keys(answers).length} of ${axes.length} answered`;
        submit.disabled = Object.keys(answers).length < axes.length;
      });
      label.append(input, document.createTextNode(" " + s.traveller));
      opts.append(label);
    });
    fs.append(opts);
    form.append(fs);
  });

  const progress = el("p", "profile-form__progress", `0 of ${axes.length} answered`);
  const submit = el("button", "btn btn--primary", "See my profile");
  submit.type = "submit"; submit.disabled = true;

  const row = el("div", "btn-row");
  row.append(submit);
  form.append(progress, row);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < axes.length) return;
    const profile = { version: 1, savedOn: new Date().toISOString().slice(0, 10), comfort: answers };
    saveProfile(profile);
    renderResult(host, model, profile);
    host.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  host.append(form);
}

function start(host, model) {
  const existing = loadProfile();
  if (existing) renderResult(host, model, existing);
  else renderQuestions(host, model);
}

/* ---- boot ------------------------------------------------------------ */

const host = document.getElementById("profile-app");
if (host) {
  const model = JSON.parse(document.getElementById("comfort-model").textContent);
  start(host, model);
}
