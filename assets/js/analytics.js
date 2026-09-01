/**
 * Provider-neutral analytics layer.
 *
 * Buffers events and forwards them to whichever provider is configured in
 * src/content/site.json (GA4, Plausible, or a warehouse endpoint). With no
 * provider configured — the current state — nothing is transmitted and nothing
 * is stored, so the site ships privacy-clean by default.
 *
 * Event taxonomy: docs/02-journeys-monetization-conversion.md §5
 */

const CONFIG = {
  ga4MeasurementId: null,
  plausibleDomain: null,
  endpoint: null,
  debug: false
};

const buffer = [];
let ready = false;

function context() {
  const b = document.body;
  return {
    template: b.dataset.template || "page",
    path: location.pathname,
    referrer: document.referrer ? new URL(document.referrer).hostname : null
  };
}

function dispatch(name, props) {
  const payload = { event: name, ...context(), ...props, ts: Date.now() };
  if (CONFIG.debug) console.debug("[analytics]", name, payload);

  if (CONFIG.ga4MeasurementId && typeof window.gtag === "function") window.gtag("event", name, props);
  if (CONFIG.plausibleDomain && typeof window.plausible === "function") window.plausible(name, { props });
  if (CONFIG.endpoint && navigator.sendBeacon) {
    navigator.sendBeacon(CONFIG.endpoint, new Blob([JSON.stringify(payload)], { type: "application/json" }));
  }
  // No provider configured: the event is observable to a listener on this page
  // and goes nowhere else.
  window.dispatchEvent(new CustomEvent("pehchan:track", { detail: payload }));
}

export function track(name, props = {}) {
  if (!ready) { buffer.push([name, props]); return; }
  dispatch(name, props);
}

export function configure(cfg = {}) {
  Object.assign(CONFIG, cfg);
  ready = true;
  while (buffer.length) dispatch(...buffer.shift());
}

/** Wires the declarative data-track attributes the templates emit. */
export function autoTrack() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) {
      track(el.dataset.track, {
        label: el.dataset.trackLabel || el.textContent.trim().slice(0, 60),
        partner: el.dataset.partner,
        network: el.dataset.network,
        entityType: el.dataset.entityType,
        entitySlug: el.dataset.entity
      });
    }
    const link = e.target.closest('a[href^="http"]');
    if (link && link.hostname !== location.hostname && !link.dataset.track) {
      track("outbound_click", { host: link.hostname, context: context().template });
    }
  }, { capture: true });

  // Engagement depth — the difference between a visit and a read.
  const marks = [25, 50, 75, 100];
  let hit = 0;
  const onScroll = () => {
    const h = document.documentElement;
    const pct = Math.min(100, Math.round(((h.scrollTop + innerHeight) / h.scrollHeight) * 100));
    while (hit < marks.length && pct >= marks[hit]) {
      track("scroll_depth", { depth: marks[hit] });
      if (marks[hit] === 100) track("read_complete", {});
      hit++;
    }
    if (hit >= marks.length) removeEventListener("scroll", onScroll);
  };
  addEventListener("scroll", onScroll, { passive: true });

  track("page_view", {});
}

// Boot with the shipped (empty) configuration. Replace these values — or load
// them from site.json at build time — to switch a provider on.
configure(CONFIG);
