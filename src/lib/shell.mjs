import { esc, list } from "./html.mjs";
import { art } from "./art.mjs";

/** Nav model — one source of truth for masthead, drawer and footer. */
export function navModel(g) {
  const { site, regions, taxonomies, itineraries } = g;
  return [
    // Two separate trees in the nav, so each grows without crowding the other.
    { label: "India", href: "/india/", columns: [
      { title: "By region", links: g.indiaRegions.map(r => ({ label: r.name, href: r.url })) },
      { title: "By state", links: g.indiaRegions.flatMap(r => r.countries).filter(c => c.destinations.length).slice(0, 8).map(c => ({ label: c.name, href: c.url })) },
      ...(g.indiaDestinations.length ? [{ title: "Guides", links: g.indiaDestinations.slice(0, 6).map(d => ({ label: d.name, href: d.url })) }] : [])
    ]},
    { label: "International", href: "/international/", columns: [
      { title: "By region", links: g.intlRegions.map(r => ({ label: r.name, href: r.url })) },
      { title: "Guides", links: g.intlDestinations.slice(0, 8).map(d => ({ label: d.name, href: d.url })) },
      { title: "Collections", links: taxonomies.collections.filter(c => c.type === "landscape" && c.total).slice(0, 5).map(c => ({ label: c.title, href: c.url })) }
    ]},
    { label: "Stay", href: "/stay/", columns: [
      { title: "By type", links: taxonomies.stayCategories.filter(c => c.hotels_.length).slice(0, 6).map(c => ({ label: c.name, href: c.url })) },
      { title: "By traveller", links: taxonomies.stayCategories.filter(c => c.hotels_.length).slice(6).map(c => ({ label: c.name, href: c.url })) },
      { title: "Featured stays", links: g.hotels.slice(0, 5).map(h => ({ label: h.name, href: h.url })) }
    ]},
    { label: "Experiences", href: "/experiences/", columns: [
      { title: "By interest", links: taxonomies.experienceCategories.filter(c => c.experiences_.length).slice(0, 7).map(c => ({ label: c.name, href: c.url })) },
      { title: "More", links: taxonomies.experienceCategories.filter(c => c.experiences_.length).slice(7).map(c => ({ label: c.name, href: c.url })) }
    ]},
    { label: "Journeys", href: "/journeys/", columns: [
      { title: "Curated itineraries", links: itineraries.slice(0, 6).map(i => ({ label: i.title, href: i.url })) },
      { title: "By trip length", links: taxonomies.collections.filter(c => c.type === "length" && c.total).map(c => ({ label: c.title, href: c.url })) }
    ]},
    { label: "Stories", href: "/stories/", columns: [
      { title: "Categories", links: taxonomies.storyCategories.filter(c => c.stories_.length).slice(0, 6).map(c => ({ label: c.name, href: c.url })) },
      { title: "Latest", links: g.stories.slice(0, 5).map(s => ({ label: s.title, href: s.url })) }
    ]},
    { label: "Plan", href: "/plan/", columns: [
      { title: "Plan a trip", links: [
        { label: "AI Trip Planner", href: "/plan/" },
        { label: "Travel Tools", href: "/tools/" },
        { label: "Travel Guides", href: "/guides/" },
        { label: "Collections", href: "/collections/" },
        { label: "Travel Deals", href: "/deals/" }
      ]},
      { title: "Free tools", links: taxonomies.tools.filter(t => t.phase === "mvp").slice(0, 6).map(t => ({ label: t.name, href: t.redirect || `/tools/${t.slug}/` })) }
    ]}
  ];
}

function masthead(g) {
  const nav = navModel(g);
  return `<header class="masthead">
  <div class="masthead__bar">
    <a class="wordmark" href="/">${esc(g.site.wordmark)}<small>${esc(g.site.descriptor)}</small></a>
    <nav class="nav" aria-label="Primary">
      ${list(nav, (item, i) => `<button class="nav__link" type="button" aria-expanded="false" aria-controls="mega-${i}" data-mega="${i}">${esc(item.label)}</button>`)}
      <a class="nav__link" href="/partner/">Partner</a>
    </nav>
    <div class="masthead__actions">
      <button class="icon-btn" type="button" data-search-open aria-label="Search the site">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      </button>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch colour theme">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
      </button>
      <a class="btn btn--primary btn--sm" href="/plan/" data-track="cta_plan" style="display:none" data-desktop-cta>Plan My Trip</a>
      <button class="icon-btn nav-toggle" type="button" data-drawer-toggle aria-expanded="false" aria-label="Open menu">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
  ${list(nav, (item, i) => `<div class="mega" id="mega-${i}" data-mega-panel="${i}"><div class="mega__inner">
    ${list(item.columns.filter(c => c.links.length), (col) => `<div><h3>${esc(col.title)}</h3><ul>${list(col.links, (l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)}</ul></div>`)}
    <div><h3>&nbsp;</h3><a class="btn btn--ghost btn--sm" href="${esc(item.href)}">All ${esc(item.label.toLowerCase())}</a></div>
  </div></div>`)}
  <div class="drawer" data-drawer>
    ${list(nav, (item) => `<details><summary>${esc(item.label)}</summary><ul>
      <li><a href="${esc(item.href)}"><strong>All ${esc(item.label.toLowerCase())}</strong></a></li>
      ${list(item.columns.flatMap(c => c.links), (l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)}
    </ul></details>`)}
    <a class="drawer__flat" href="/partner/">Partner With Us</a>
    <a class="drawer__flat" href="/about/">About</a>
    <div style="margin-top:var(--s-6)"><a class="btn btn--primary btn--block" href="/plan/">Plan My Trip</a></div>
  </div>
</header>`;
}

function footer(g) {
  const { site, taxonomies, regions } = g;
  const cols = [
    { title: "India", links: g.indiaRegions.map(r => ({ label: r.name, href: r.url })).concat([{ label: "All of India", href: "/india/" }]) },
    { title: "International", links: g.intlRegions.map(r => ({ label: r.name, href: r.url })).concat([{ label: "All international", href: "/international/" }]) },
    { title: "Discover", links: [
      { label: "Stay", href: "/stay/" }, { label: "Experiences", href: "/experiences/" },
      { label: "Curated Journeys", href: "/journeys/" }, { label: "Travel Guides", href: "/guides/" },
      { label: "Collections", href: "/collections/" }, { label: "Travel Stories", href: "/stories/" }
    ]},
    { title: "Plan", links: [
      { label: "AI Trip Planner", href: "/plan/" }, { label: "Travel Tools", href: "/tools/" },
      { label: "Travel Deals", href: "/deals/" }, { label: "Search", href: "/search/" },
      { label: site.newsletterName, href: "/newsletter/" }
    ]},
    { title: "Company", links: [
      { label: "About", href: "/about/" }, { label: "Partner With Us", href: "/partner/" },
      { label: "Contact", href: "/contact/" }, { label: "Business Dashboard", href: "/dashboard/" }
    ]},
    { title: "Trust", links: [
      { label: "Editorial Standards", href: "/legal/editorial-standards/" },
      { label: "Affiliate Disclosure", href: "/legal/affiliate-disclosure/" },
      { label: "Privacy Policy", href: "/legal/privacy/" },
      { label: "Terms", href: "/legal/terms/" },
      { label: "Cookie Policy", href: "/legal/cookies/" }
    ]}
  ];
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        <span class="wordmark">${esc(site.wordmark)}<small>${esc(site.descriptor)}</small></span>
        <p>${esc(site.promise)}</p>
        <p style="margin-top:var(--s-4)"><a href="/newsletter/" class="link-more" style="color:#fff">Join ${esc(site.newsletterName)}</a></p>
      </div>
      ${list(cols, (c) => `<div><h3>${esc(c.title)}</h3><ul>${list(c.links, (l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)}</ul></div>`)}
    </div>
    ${(site.social || []).some(x => x.href && x.href !== "#") ? `<div style="margin-top:var(--s-6);display:flex;gap:var(--s-4)">
      ${list((site.social || []).filter(x => x.href && x.href !== "#"),
        (x) => `<a href="${esc(x.href)}" rel="me noopener" target="_blank" style="font-size:var(--t-sm)">${esc(x.label)}</a>`)}
    </div>` : ""}
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${esc(site.legalEntity)}. All rights reserved.</span>
      <span>Some links are affiliate links — <a href="/legal/affiliate-disclosure/">what that means</a>.</span>
      <span>${esc(site.contactEmail)}</span>
    </div>
  </div>
</footer>`;
}

function searchOverlay() {
  return `<div class="search-overlay" data-search-overlay role="dialog" aria-modal="true" aria-label="Search">
  <div class="search-panel">
    <div class="search-panel__head">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      <label class="visually-hidden" for="site-search">Search destinations, stays, experiences, journeys and stories</label>
      <input id="site-search" type="search" placeholder="Search places, regions and guides" autocomplete="off" data-search-input>
      <button class="icon-btn" type="button" data-search-close aria-label="Close search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <ul class="search-results" data-search-results></ul>
    <div class="search-panel__foot">
      <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>enter</kbd> to open</span><span><kbd>esc</kbd> to close</span>
      <span style="margin-left:auto"><a href="/search/">Full search page →</a></span>
    </div>
  </div>
</div>`;
}

/** JSON-LD graph. We emit only schema we can genuinely substantiate. */
function jsonLd(page, g) {
  const { site } = g;
  const base = site.siteUrl;
  const nodes = [];
  if (page.isHome) {
    nodes.push({
      "@type": "Organization", "@id": base + "/#org", name: site.brand, url: base + "/",
      description: site.positioning, email: site.contactEmail, foundingDate: site.founded,
      slogan: site.promise
    });
    nodes.push({
      "@type": "WebSite", "@id": base + "/#website", url: base + "/", name: site.brand,
      publisher: { "@id": base + "/#org" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: base + "/search/?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      }
    });
  }
  if (page.breadcrumbs?.length > 1) {
    nodes.push({
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((b, i) => ({
        "@type": "ListItem", position: i + 1, name: b.label,
        item: b.href ? base + b.href : undefined
      }))
    });
  }
  if (page.schema) nodes.push(...(Array.isArray(page.schema) ? page.schema : [page.schema]));
  if (!nodes.length) return "";
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": nodes })
    .replace(/</g, "\\u003c")}</script>`;
}

/**
 * Renders a complete page.
 * page: { url, title, description, body, breadcrumbs, schema, isHome, scripts[], ogArt, noindex }
 */
export function page(p, g) {
  const { site } = g;
  const base = site.basePath || "";
  const canonical = site.siteUrl + p.url;
  const title = p.title;
  const ogImage = site.siteUrl + "/assets/og/" + (p.ogArt || "default") + ".svg";
  return `<!doctype html>
<html lang="${esc(site.locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="${esc(site.locale)}" href="${esc(canonical)}">
<link rel="alternate" hreflang="x-default" href="${esc(canonical)}">
${p.noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta property="og:type" content="${esc(p.ogType || "website")}">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="theme-color" content="#191411" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#FCFAF7" media="(prefers-color-scheme: light)">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="stylesheet" href="/assets/css/main.css">
<script>try{var t=localStorage.getItem("pehchan-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
${jsonLd(p, g)}
</head>
<body${p.bodyClass ? ` class="${esc(p.bodyClass)}"` : ""} data-template="${esc(p.template || "page")}" data-base="${esc(base)}"${p.dataAttrs || ""}>
<a class="skip-link" href="#main">Skip to content</a>
${masthead(g)}
<main id="main">
${p.body}
</main>
${footer(g)}
${searchOverlay()}
<script type="module" src="/assets/js/site.js"></script>
${list(p.scripts || [], (s) => `<script type="module" src="${esc(s)}"></script>`)}
</body>
</html>`;
}

export function ogCard(title, kicker, artKey, seed) {
  const bg = art(artKey || "asia-ridge", seed || title, { label: title });
  const svgInner = bg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const wrapText = (t, max, lines) => {
    const words = String(t).split(" "); const out = []; let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max) { out.push(cur.trim()); cur = w; } else cur += " " + w;
      if (out.length === lines) break;
    }
    if (out.length < lines && cur.trim()) out.push(cur.trim());
    return out.slice(0, lines);
  };
  const lines = wrapText(title, 26, 3);
  return `<svg viewBox="0 0 1200 630" width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(0,-85)">${svgInner}</g>
<rect width="1200" height="630" fill="#0C0A09" opacity="0.5"/>
<text x="72" y="112" font-family="system-ui,sans-serif" font-size="22" letter-spacing="7" fill="#FCFAF7" opacity="0.85">PEHCHAN</text>
${kicker ? `<text x="72" y="152" font-family="system-ui,sans-serif" font-size="20" letter-spacing="3" fill="#FCFAF7" opacity="0.6">${esc(String(kicker).toUpperCase())}</text>` : ""}
${lines.map((l, i) => `<text x="72" y="${330 + i * 76}" font-family="Georgia,serif" font-size="66" fill="#FFFFFF">${esc(l)}</text>`).join("")}
<text x="72" y="566" font-family="system-ui,sans-serif" font-size="21" fill="#FCFAF7" opacity="0.7">Handcrafted journeys. Beautiful stays.</text>
</svg>`;
}
