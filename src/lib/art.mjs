/**
 * Deterministic generated artwork.
 *
 * Every media slot on the site renders one of these instead of stock photography.
 * They are seeded from the entity slug, so a given place always looks the same,
 * they add zero network requests, and — crucially — they do not pretend to be
 * photographs of somewhere we have not been. When a real licensed image is added
 * to a content record's `image` field, it replaces the artwork with no template
 * change. See docs/01-brand-and-architecture.md.
 */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** shape: peaks | dunes | hills | cliffs | skyline | canopy | terrace | plateau */
const SCENES = {
  "asia-ridge":     { shape: "peaks",   sky: ["#F6D9B8", "#C98F6E", "#6A4A54"], layers: ["#8A6470", "#5E4A5E", "#3A3346", "#22202E"], orb: "sun" },
  "asia-temple":    { shape: "hills",   sky: ["#F3E2D0", "#D9A987", "#7C5468"], layers: ["#9C7A78", "#6B5560", "#3F3646", "#241F2A"], orb: "sun", accentRoof: true },
  "asia-river":     { shape: "hills",   sky: ["#FBE6CE", "#E9A97E", "#8A5A65"], layers: ["#A57C74", "#70565C", "#453942"], water: "#C08A73" },
  "asia-hills":     { shape: "hills",   sky: ["#E9F0E2", "#B7CBB0", "#5F7A69"], layers: ["#8AA790", "#5E7A68", "#3C5248", "#26332E"] },
  "asia-jungle":    { shape: "canopy",  sky: ["#E6EEDD", "#A8C2A0", "#4F6B54"], layers: ["#7C9C77", "#4E6E50", "#31492F", "#1E2E1F"] },
  "asia-terrace":   { shape: "terrace", sky: ["#F2ECD8", "#C6D2A8", "#6F8462"], layers: ["#A8BC86", "#7A9463", "#4E6845", "#2E3F2A"] },
  "asia-beach":     { shape: "dunes",   sky: ["#FDEEDA", "#F3C39C", "#8FA9B4"], layers: ["#D9B48F", "#B08C6E"], water: "#6FA0A8", orb: "sun" },
  "europe-coast":   { shape: "cliffs",  sky: ["#FBE5CC", "#EFA97F", "#7B6784"], layers: ["#A38472", "#6E5A5E", "#40363F"], water: "#4E7C86", orb: "sun" },
  "europe-cliff":   { shape: "cliffs",  sky: ["#FDF0DA", "#F0BE93", "#8D7188"], layers: ["#B99277", "#87695F", "#4C3E43"], water: "#487C88" },
  "europe-alps":    { shape: "peaks",   sky: ["#E8F0F6", "#BCD2E0", "#6E88A0"], layers: ["#B6C8D4", "#8098AE", "#546A82", "#2F3E52"], snow: true },
  "europe-city":    { shape: "skyline", sky: ["#FBE7CE", "#E8A87F", "#7A5D72"], layers: ["#A98577", "#77605F", "#453A40"], orb: "sun" },
  "desert-dune":    { shape: "dunes",   sky: ["#FBE0C0", "#E39F72", "#6F4A5A"], layers: ["#D3A077", "#AE7D5D", "#7E5945", "#4E3830"], orb: "sun" },
  "desert-canyon":  { shape: "plateau", sky: ["#FCE3C4", "#E4A177", "#7A5152"], layers: ["#CE9068", "#A8714F", "#7A5239", "#4A3427"], orb: "sun" },
  "savanna":        { shape: "plateau", sky: ["#FBE7C2", "#E9B073", "#8A6A54"], layers: ["#D8B378", "#B08D5E", "#7C6444"], acacia: true, orb: "sun" },
  "africa-medina":  { shape: "skyline", sky: ["#FBE0C2", "#E39B6F", "#7B5158"], layers: ["#C08A6B", "#96684F", "#5F4335"], minaret: true },
  "rockies":        { shape: "peaks",   sky: ["#E6F1F2", "#B9D4D6", "#5D7F86"], layers: ["#A8C3C4", "#74959A", "#4A6670", "#2B3B45"], snow: true, water: "#5FA0A6" },
  "andes":          { shape: "peaks",   sky: ["#F0E9F0", "#C6B4C6", "#6E6178"], layers: ["#B3A2AE", "#7E7186", "#544B5D", "#2E2A36"], snow: true },
  "andes-terrace":  { shape: "terrace", sky: ["#F5E9D8", "#D5B48D", "#7A6250"], layers: ["#BFA07C", "#96795C", "#655040", "#3A2E26"] },
  "fiord":          { shape: "cliffs",  sky: ["#E4EEF2", "#B0C9D4", "#54707E"], layers: ["#8FAEB8", "#5F7E8C", "#3B535F"], water: "#3E6874" },
  "himalaya":       { shape: "peaks",   sky: ["#EDE6E0", "#C2AFA4", "#6B5D5C"], layers: ["#BCA79A", "#8C7A72", "#5C5150", "#332E30"], snow: true },
  "india-tea":      { shape: "terrace", sky: ["#EEF1E0", "#BCCBA4", "#5F7458"], layers: ["#9DB884", "#6E8C60", "#48603F", "#2A3927"] },
  "india-palace":   { shape: "skyline", sky: ["#FBE8D2", "#EDAE85", "#7E5C6C"], layers: ["#C79881", "#96705F", "#5C4440"], water: "#8A7A88", dome: true, orb: "sun" },
  "india-forest":   { shape: "canopy",  sky: ["#E4EEE6", "#A6C3B0", "#48685A"], layers: ["#7FA189", "#4F7161", "#324A40", "#1E2D28"] },
  "americas-town":  { shape: "skyline", sky: ["#FBE9D0", "#EDB183", "#7F5F6E"], layers: ["#C99C7E", "#9A745E", "#5E4640"], dome: true }
};

const DEFAULT = SCENES["asia-ridge"];

const r0 = (n) => Math.round(n);

function ridgePath(r, cfg, y0, amp, steps, shape) {
  const W = 1200, H = 800;
  const pts = [];
  if (shape === "skyline") {
    let x = -40;
    while (x < W + 40) {
      const w = 40 + r() * 90;
      const h = amp * (0.35 + r() * 1.0);
      pts.push([x, y0 - h], [x + w, y0 - h]);
      x += w + (4 + r() * 14);
    }
  } else if (shape === "peaks") {
    // Alternating summit/saddle with bounded jitter. Raw noise here reads as a
    // seismograph rather than a mountain range.
    const n = steps;
    for (let i = 0; i <= n; i++) {
      const x = (W + 120) * (i / n) - 60;
      const summit = i % 2 === 1;
      const base = summit ? 0.82 : 0.34;
      const y = y0 - amp * (base + (r() - 0.5) * 0.22);
      pts.push([x, y]);
    }
  } else if (shape === "dunes" || shape === "hills" || shape === "canopy" || shape === "plateau" || shape === "terrace") {
    const n = steps;
    for (let i = 0; i <= n; i++) {
      const x = (W + 120) * (i / n) - 60;
      const wave = Math.sin(i * 0.8 + r() * 0.4) * 0.5 + Math.sin(i * 0.31) * 0.5;
      const flat = shape === "plateau" ? Math.round(wave * 2) / 2 : wave;
      pts.push([x, y0 - amp * (0.45 + flat * 0.55)]);
    }
  } else { // cliffs
    const n = steps;
    for (let i = 0; i <= n; i++) {
      const x = (W + 120) * (i / n) - 60;
      const step = Math.pow(Math.abs(Math.sin(i * 0.9)), 0.4);
      pts.push([x, y0 - amp * (0.3 + step * 0.85)]);
    }
  }
  let d = `M-60 ${H + 20}L${r0(pts[0][0])} ${r0(pts[0][1])}`;
  if (shape === "skyline" || shape === "plateau") {
    for (const [x, y] of pts.slice(1)) d += `L${r0(x)} ${r0(y)}`;
  } else {
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i], [px, py] = pts[i - 1];
      const cx = (px + x) / 2;
      d += `Q${r0(cx)} ${r0(py)} ${r0(x)} ${r0(y)}`;
    }
  }
  d += `L${W + 60} ${H + 20}Z`;
  return d;
}

/**
 * @param {string} key   scene key from SCENES
 * @param {string} seed  entity slug — same seed always renders the same artwork
 */
export function art(key, seed = "", opts = {}) {
  const cfg = SCENES[key] || DEFAULT;
  const r = rng(hash(key + "::" + seed));
  const id = "a" + hash(key + seed).toString(36).slice(0, 7);
  const W = 1200, H = 800;
  const horizon = cfg.water ? 470 : 520;
  let out = "";

  out += `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0.15" y2="1">`
      +  cfg.sky.map((c, i) => `<stop offset="${(i / (cfg.sky.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`).reverse().join("")
      +  `</linearGradient></defs>`;
  out += `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;

  if (cfg.orb) {
    const ox = 180 + r() * 840, oy = 120 + r() * 180;
    out += `<circle cx="${ox.toFixed(0)}" cy="${oy.toFixed(0)}" r="${(46 + r() * 26).toFixed(0)}" fill="#FFF3E0" opacity="0.5"/>`;
    out += `<circle cx="${ox.toFixed(0)}" cy="${oy.toFixed(0)}" r="${(26 + r() * 12).toFixed(0)}" fill="#FFF8EC" opacity="0.85"/>`;
  }

  // Atmospheric depth as one soft veil. Hard-edged bands read as artefacts.
  out += `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1">`
      +  `<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>`
      +  `<stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.13"/>`
      +  `<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`
      +  `<rect x="0" y="220" width="${W}" height="340" fill="url(#${id}h)"/>`;

  if (cfg.water) {
    out += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${cfg.water}" opacity="0.9"/>`;
    for (let i = 0; i < 7; i++) {
      const y = horizon + 26 + i * 42 + r() * 14;
      out += `<rect x="${(r() * 400).toFixed(0)}" y="${y.toFixed(0)}" width="${(180 + r() * 520).toFixed(0)}" height="2" fill="#FFFFFF" opacity="${(0.1 + r() * 0.14).toFixed(2)}"/>`;
    }
  }

  const n = cfg.layers.length;
  cfg.layers.forEach((colour, i) => {
    const t = i / Math.max(1, n - 1);
    const y0 = (cfg.water ? horizon + 20 : horizon - 20) + t * 235;
    const amp = (300 - t * 165) * (cfg.shape === "skyline" ? 0.45 : 1);
    const steps = cfg.shape === "peaks" ? 7 + Math.floor(r() * 3) : 8 + Math.floor(r() * 4);
    out += `<path d="${ridgePath(r, cfg, y0, amp, steps, cfg.shape)}" fill="${colour}"/>`;

    if (cfg.snow && i < 2) {
      // Snow follows the same ridge and fades out downward. An unclipped snow
      // path floods the slope; a hard clip leaves a straight edge across it.
      const gid = `${id}n${i}`;
      const top = r0(y0 - amp * 1.05), bottom = r0(y0 - amp * 0.42);
      out += `<linearGradient id="${gid}" x1="0" y1="${top}" x2="0" y2="${bottom}" gradientUnits="userSpaceOnUse">`
          +  `<stop offset="0%" stop-color="#FFFFFF" stop-opacity="${(0.78 - i * 0.24).toFixed(2)}"/>`
          +  `<stop offset="70%" stop-color="#FFFFFF" stop-opacity="${(0.22 - i * 0.1).toFixed(2)}"/>`
          +  `<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`
          +  `<path d="${ridgePath(rng(hash(key + seed + i)), cfg, y0, amp * 0.98, steps, cfg.shape)}" fill="url(#${gid})"/>`;
    }
    if (cfg.shape === "terrace") {
      for (let k = 0; k < 5; k++) {
        const ty = y0 - amp * (0.1 + k * 0.13);
        out += `<path d="M -60 ${ty.toFixed(0)} Q 300 ${(ty - 24).toFixed(0)} 640 ${(ty - 6).toFixed(0)} T 1260 ${(ty - 14).toFixed(0)}" stroke="#FFFFFF" stroke-width="1.4" fill="none" opacity="${(0.16 - k * 0.02).toFixed(2)}"/>`;
      }
    }
  });

  if (cfg.acacia) {
    for (let i = 0; i < 4; i++) {
      const x = 90 + r() * 1020, y = 600 + r() * 120, s = 0.6 + r() * 0.9;
      out += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})" fill="#2B2118" opacity="0.82">`
          +  `<rect x="-3" y="-46" width="6" height="52"/>`
          +  `<ellipse cx="0" cy="-52" rx="52" ry="15"/><ellipse cx="-16" cy="-62" rx="30" ry="10"/>`
          +  `</g>`;
    }
  }
  if (cfg.minaret || cfg.dome || cfg.accentRoof) {
    const x = 160 + r() * 880, base = 560 + r() * 60;
    out += `<g fill="#2A2027" opacity="0.9">`;
    if (cfg.minaret) out += `<rect x="${x}" y="${base - 210}" width="34" height="210"/><path d="M ${x - 6} ${base - 210} L ${x + 17} ${base - 250} L ${x + 40} ${base - 210} Z"/>`;
    if (cfg.dome) out += `<path d="M ${x - 54} ${base} Q ${x} ${base - 130} ${x + 54} ${base} Z"/><rect x="${x - 3}" y="${base - 158}" width="6" height="32"/>`;
    if (cfg.accentRoof) out += `<path d="M ${x - 96} ${base} L ${x} ${base - 62} L ${x + 96} ${base} Z"/><path d="M ${x - 70} ${base - 22} L ${x} ${base - 96} L ${x + 70} ${base - 22} Z"/>`;
    out += `</g>`;
  }

  // No filters by design: an feTurbulence grain reads nicely but costs a real
  // paint on every card, and a page can carry thirty of these. The haze bands
  // above already break up the flat fills.

  const label = opts.label || "";
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img"`
       + ` aria-label="${label ? label.replace(/"/g, "&quot;") + " — illustrated placeholder artwork" : "Illustrated placeholder artwork"}"`
       + ` xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}

export const artKeys = Object.keys(SCENES);
