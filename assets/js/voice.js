/**
 * Speak-your-answer.
 *
 * Attaches a microphone to any field marked `data-voice`. Dictation is an
 * enhancement beside the keyboard, never a replacement: Web Speech support is
 * good in Chrome and Edge, partial on Android and unreliable on iOS Safari, so
 * where it is missing no button appears and nothing changes.
 *
 * It exists because the audience for these forms is substantially Hindi-first
 * and the long questions are the ones that get abandoned. Talking is faster
 * than typing a paragraph on a phone, in any language.
 *
 * Nothing is recorded or uploaded. Recognition is the browser's own; this file
 * only puts the resulting text into the field she is already filling in.
 */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const LANG_KEY = "pehchan-voice-lang";

const LANGS = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिन्दी" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ" },
  { code: "mr-IN", label: "मराठी" },
  { code: "gu-IN", label: "ગુજરાતી" },
  { code: "ta-IN", label: "தமிழ்" },
  { code: "bn-IN", label: "বাংলা" }
];

const readLang = () => {
  try { return localStorage.getItem(LANG_KEY) || "en-IN"; } catch { return "en-IN"; }
};
const writeLang = (v) => { try { localStorage.setItem(LANG_KEY, v); } catch { /* ignore */ } };

const MIC = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/>
  <path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`;

/**
 * Wire one field for dictation.
 * @param {HTMLTextAreaElement|HTMLInputElement} field
 */
export function attachVoice(field) {
  if (!SR || field.dataset.voiceReady) return;
  field.dataset.voiceReady = "1";

  const bar = document.createElement("div");
  bar.className = "voice";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "voice__btn";
  btn.setAttribute("aria-pressed", "false");
  btn.innerHTML = MIC + "<span>Speak</span>";

  const pick = document.createElement("select");
  pick.className = "voice__lang";
  pick.setAttribute("aria-label", "Language for speaking");
  pick.innerHTML = LANGS.map(l =>
    `<option value="${l.code}">${l.label}</option>`).join("");
  pick.value = readLang();
  pick.addEventListener("change", () => writeLang(pick.value));

  const status = document.createElement("span");
  status.className = "voice__status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  bar.append(btn, pick, status);
  field.insertAdjacentElement("afterend", bar);

  let rec = null, listening = false, base = "", settled = "";

  const stop = () => { if (rec) { try { rec.stop(); } catch { /* already stopped */ } } };

  const paint = (interim) => {
    const joined = (base + settled + interim).replace(/\s+/g, " ").trimStart();
    field.value = joined;
    // The draft autosave listens for input; a programmatic set does not fire it.
    field.dispatchEvent(new Event("input", { bubbles: true }));
  };

  btn.addEventListener("click", () => {
    if (listening) { stop(); return; }

    rec = new SR();
    rec.lang = pick.value;
    rec.continuous = true;
    rec.interimResults = true;

    base = field.value ? field.value.trimEnd() + " " : "";
    settled = "";

    rec.onstart = () => {
      listening = true;
      btn.setAttribute("aria-pressed", "true");
      btn.classList.add("is-live");
      btn.querySelector("span").textContent = "Stop";
      status.textContent = "Listening — speak naturally.";
    };

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) settled += t + " "; else interim += t;
      }
      paint(interim);
    };

    rec.onerror = (e) => {
      // A pause in speech is not a failure worth reporting.
      if (e.error === "no-speech" || e.error === "aborted") return;
      status.textContent = (e.error === "not-allowed" || e.error === "service-not-allowed")
        ? "Microphone blocked. Allow it in your browser, or just type instead."
        : "Could not hear that — please type it instead.";
    };

    rec.onend = () => {
      listening = false;
      btn.setAttribute("aria-pressed", "false");
      btn.classList.remove("is-live");
      btn.querySelector("span").textContent = "Speak";
      paint("");
      if (!status.textContent.includes("blocked") && !status.textContent.includes("Could not")) {
        status.textContent = settled.trim() ? "Added. Edit it however you like." : "";
      }
      rec = null;
    };

    try { rec.start(); }
    catch { status.textContent = "Could not start the microphone — please type instead."; }
  });
}

/** Wire everything currently marked, and anything added later. */
export function initVoice(root = document) {
  if (!SR) return;
  root.querySelectorAll("[data-voice]").forEach(attachVoice);
}

initVoice();
