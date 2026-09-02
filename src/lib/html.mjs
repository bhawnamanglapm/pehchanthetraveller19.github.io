import { art } from "./art.mjs";

export const esc = (s = "") => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const attr = (o = {}) => Object.entries(o)
  .filter(([, v]) => v !== null && v !== undefined && v !== false)
  .map(([k, v]) => v === true ? ` ${k}` : ` ${k}="${esc(v)}"`).join("");

export const clean = (s = "") => String(s).replace(/\s+/g, " ").trim();
export const truncate = (s, n) => { s = clean(s); return s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;.]+\S*$/, "") + "…"; };
export const list = (arr, fn) => (arr || []).map(fn).join("");

/* ---------- media ---------------------------------------------------- */

export function figure(entity, { ratio = "16x9", label = "", note = true, className = "" } = {}) {
  const key = entity?.art || "asia-ridge";
  const seed = entity?.slug || label || "seed";
  const inner = entity?.image
    ? `<img src="${esc(entity.image)}" alt="${esc(entity.imageAlt || label)}" loading="lazy" decoding="async" width="1200" height="800">`
    : art(key, seed, { label });
  return `<div class="art art--${ratio} ${className}">${inner}`
    + (note && !entity?.image ? `<span class="art__note">Illustrated placeholder</span>` : "")
    + `</div>`;
}

/* ---------- primitives ------------------------------------------------ */

export const eyebrow = (t) => t ? `<span class="eyebrow">${esc(t)}</span>` : "";

export function sectionHead({ eyebrow: e, title, intro, link, id }) {
  return `<div class="section-head">
    <div class="section-head__text">${eyebrow(e)}<h2${id ? ` id="${esc(id)}"` : ""}>${esc(title)}</h2>
    ${intro ? `<p>${esc(intro)}</p>` : ""}</div>
    ${link ? `<a class="link-more" href="${esc(link.href)}">${esc(link.label)}</a>` : ""}
  </div>`;
}

export function chip(label, href) {
  return href ? `<a class="chip" href="${esc(href)}">${esc(label)}</a>` : `<span class="chip">${esc(label)}</span>`;
}

export function badge(kind) {
  const map = {
    editorial: ["badge--editorial", "Editorial pick"],
    affiliate: ["badge--affiliate", "Affiliate links"],
    sponsored: ["badge--sponsored", "Sponsored"],
    sample: ["badge--placeholder", "Sample listing"],
    draft: ["badge--draft", "Guide in progress"]
  };
  const [cls, text] = map[kind] || map.editorial;
  return `<span class="badge ${cls}">${text}</span>`;
}

export const priceBand = (n) => n
  ? `<span class="price-band" title="Indicative price band, not a quoted rate">${"$".repeat(n)}<span>${"$".repeat(4 - n)}</span></span>`
  : "";

/* ---------- cards ----------------------------------------------------- */

export function card(o) {
  const {
    href, title, kicker, desc, entity, ratio = "3x2", badges = [],
    footLeft, footRight, flush = false, label
  } = o;
  return `<article class="card${flush ? " card--flush" : ""}">
    ${badges.length ? `<div class="card__badges">${badges.map(badge).join("")}</div>` : ""}
    ${figure(entity, { ratio, label: label || title })}
    <div class="card__body">
      ${kicker ? `<span class="card__kicker">${esc(kicker)}</span>` : ""}
      <h3 class="card__title"><a class="card__link" href="${esc(href)}">${esc(title)}</a></h3>
      ${desc ? `<p class="card__desc">${esc(truncate(desc, 132))}</p>` : ""}
      ${(footLeft || footRight) ? `<div class="card__foot"><span>${footLeft || ""}</span><span>${footRight || ""}</span></div>` : ""}
    </div>
  </article>`;
}

export function feature(o) {
  const { href, title, kicker, desc, entity, cta = "Read more" } = o;
  return `<article class="feature">
    ${figure(entity, { ratio: "16x9", label: title, note: false })}
    <div class="feature__body">
      ${eyebrow(kicker)}
      <h3>${esc(title)}</h3>
      ${desc ? `<p>${esc(truncate(desc, 190))}</p>` : ""}
      <a class="btn btn--light" href="${esc(href)}">${esc(cta)}</a>
    </div>
  </article>`;
}

/* ---------- structured blocks ---------------------------------------- */

export function atAGlance(pairs) {
  return `<dl class="at-a-glance">${list(pairs.filter(p => p[1]), ([k, v]) =>
    `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)}</dl>`;
}

export function factList(pairs) {
  return `<dl class="fact-list">${list(pairs.filter(p => p[1]), ([k, v]) =>
    `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`)}</dl>`;
}

export function faq(items, { heading = "Frequently asked questions" } = {}) {
  if (!items?.length) return "";
  return `<section class="faq" aria-labelledby="faq-h">
    <h2 class="display" id="faq-h" style="font-size:var(--t-xl);margin-bottom:var(--s-4)">${esc(heading)}</h2>
    ${list(items, (f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)}
  </section>`;
}

export function nextSteps({ title = "Where to next", intro, steps }) {
  return `<section class="next-steps" data-reveal>
    <h2>${esc(title)}</h2>
    ${intro ? `<p>${esc(intro)}</p>` : ""}
    <div class="next-steps__grid">${list(steps, (s, i) => `<a class="step" href="${esc(s.href)}"
      data-track="next_step" data-track-label="${esc(s.title)}">
      <span class="step__n">0${i + 1}</span>
      <span class="step__t">${esc(s.title)}</span>
      <span class="step__d">${esc(s.desc)}</span></a>`)}</div>
  </section>`;
}

export function breadcrumbs(trail) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>
    ${list(trail, (t, i) => i === trail.length - 1
      ? `<li><span aria-current="page">${esc(t.label)}</span></li>`
      : `<li><a href="${esc(t.href)}">${esc(t.label)}</a></li>`)}
  </ol></nav>`;
}

/* ---------- commerce -------------------------------------------------- */

/**
 * A tracked affiliate slot. Renders a labelled, non-functional placeholder until
 * a partner link exists on the record — we never invent prices or availability.
 */
export function bookingModule(entity, site, { type = "stay", ctaLabel = "Check Availability" } = {}) {
  const partners = entity.bookingPartners || [];
  const network = site.affiliate.networks.find(n => n.type === type);
  const links = partners.length
    ? list(partners, (p) => `<a class="btn btn--book btn--block" rel="sponsored noopener" target="_blank"
        href="${esc(p.href)}" data-track="affiliate_click"
        data-partner="${esc(p.name)}" data-network="${esc(p.network || network?.id || "")}"
        data-entity-type="${esc(type)}" data-entity="${esc(entity.slug)}">${esc(p.label || ctaLabel)}</a>`)
    : `<div class="partner-slot">
        <span class="badge badge--placeholder">Partner slot — not yet live</span>
        <p>${esc(network?.label || "Booking partner")} integration is not connected yet. When it is, this becomes a tracked
        ${esc(ctaLabel.toLowerCase())} link. We do not display prices or availability we cannot verify.</p>
        <button class="btn btn--ghost btn--sm" type="button" disabled aria-disabled="true">${esc(ctaLabel)}</button>
      </div>`;
  return `<div class="booking">
    <div class="booking__head"><h3>${esc(ctaLabel)}</h3>${entity.priceBand ? priceBand(entity.priceBand) : ""}</div>
    ${links}
    <p class="affiliate-note">${esc(site.affiliate.disclosureShort)}
      <a href="/legal/affiliate-disclosure/">How we make money</a>.</p>
  </div>`;
}

export function newsletterBlock(site, placement) {
  return `<section class="newsletter" data-reveal data-placement="${esc(placement)}">
    ${eyebrow(site.newsletterName)}
    <h2>One considered email a week. Nothing else.</h2>
    <p>New destinations, stays worth knowing about, quiet-season timing and the occasional itinerary — sent once a week.</p>
    <form data-newsletter data-placement="${esc(placement)}" novalidate>
      <label class="visually-hidden" for="nl-${esc(placement)}">Email address</label>
      <input id="nl-${esc(placement)}" type="email" name="email" placeholder="you@example.com" required autocomplete="email">
      <button class="btn btn--light" type="submit">Subscribe</button>
    </form>
    <p class="form-note">No spam, no list selling, unsubscribe in one click. See our <a href="/legal/privacy/" style="color:inherit;border-bottom:1px solid">privacy policy</a>.</p>
    <p class="form-status" hidden></p>
  </section>`;
}

export function saveButton(type, slug, label) {
  return `<button class="btn btn--ghost btn--sm" type="button" data-save data-entity-type="${esc(type)}"
    data-entity="${esc(slug)}" data-label="${esc(label)}" aria-pressed="false">Save</button>`;
}

/**
 * Builds a <title> that fits the ~60–65 char SERP budget by dropping trailing
 * segments before it resorts to truncation. Titles are load-bearing for SEO, so
 * the build fails rather than shipping one that gets cut off in results.
 */
export function fitTitle(parts, max = 68) {
  const segs = parts.filter(Boolean).map(clean);
  for (let n = segs.length; n > 0; n--) {
    const t = segs.slice(0, n).join(" — ");
    if (t.length <= max) return t;
  }
  return truncate(segs[0], max);
}


/**
 * Shown where a section has nothing published yet. Says what will be there and
 * why it is not — never an empty grid, never filler to cover the gap.
 */
export function emptyState({ title, body, actions = [] }) {
  return `<div class="empty-state">
    <h2 class="display">${esc(title)}</h2>
    <p>${esc(body)}</p>
    ${actions.length ? `<div class="btn-row" style="margin-top:var(--s-6)">
      ${list(actions, (a) => `<a class="btn ${a.primary ? "btn--primary" : "btn--ghost"}" href="${esc(a.href)}">${esc(a.label)}</a>`)}
    </div>` : ""}
  </div>`;
}
