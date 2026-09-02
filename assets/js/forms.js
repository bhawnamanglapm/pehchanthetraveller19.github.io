/**
 * Partnership enquiry form.
 *
 * No backend exists, so rather than pretending to submit — or silently dropping
 * a real business lead — this composes a pre-filled email in the user's own
 * client. Nothing is stored or transmitted without the sender seeing it.
 *
 * To connect a CRM: replace the mailto branch below with a fetch to your
 * endpoint. The validation, analytics event and status messaging stay as they are.
 */
import { track } from "./analytics.js";

const form = document.querySelector("[data-partner-form]");
if (form) {
  const status = form.querySelector(".form-status");
  // Read from the rendered form so site.json stays the single source of truth.
  const PARTNER_EMAIL = form.dataset.partnerEmail || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const missing = ["name", "company", "email", "message"].filter(k => !String(data[k] || "").trim());
    if (missing.length) {
      status.hidden = false; status.dataset.tone = "err";
      status.textContent = `Please complete: ${missing.join(", ")}.`;
      form.querySelector(`[name="${missing[0]}"]`)?.focus();
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(data.email)) {
      status.hidden = false; status.dataset.tone = "err";
      status.textContent = "That email address does not look right.";
      form.email.focus();
      return;
    }

    track("partner_enquiry_submit", {
      businessType: data.businessType, partnershipType: data.partnershipType,
      budgetBand: data.budget, country: data.country
    });

    const body = [
      `Name: ${data.name}`, `Company: ${data.company}`, `Email: ${data.email}`,
      `Website: ${data.website || "—"}`, `Country: ${data.country || "—"}`,
      `Business type: ${data.businessType}`, `Partnership type: ${data.partnershipType}`,
      `Budget: ${data.budget}`, "", data.message
    ].join("\n");

    location.href = `mailto:${PARTNER_EMAIL}`
      + `?subject=${encodeURIComponent(`Partnership enquiry — ${data.company}`)}`
      + `&body=${encodeURIComponent(body)}`;

    status.hidden = false; status.dataset.tone = "ok";
    status.textContent = "Your email client should now be open with this enquiry filled in. "
      + `If nothing happened, email ${PARTNER_EMAIL} directly — nothing was sent or stored from this page.`;
  });
}
