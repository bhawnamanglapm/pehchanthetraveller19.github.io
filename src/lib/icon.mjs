/**
 * App icon rasteriser.
 *
 * Draws the Pehchan mark — a serif P on the accent green — at any size, as
 * 8-bit RGBA. Same geometry as assets/favicon.svg, hand-drawn here because the
 * build has no font or SVG rasteriser to call on. Coverage is computed by 3x3
 * supersampling per pixel, which is enough to keep the curve clean at 192px.
 *
 * Replace these with a designed icon before submitting to either store; the
 * stores show this asset at large sizes and it is the brand's first impression.
 */
import { encodePNG } from "./png.mjs";

const GREEN = [0x1D, 0x4E, 0x45];
const PAPER = [0xFC, 0xFA, 0xF7];

/** Signed-distance-ish tests, all in pixel space. */
const inRect = (x, y, x0, y0, x1, y1) => x >= x0 && x <= x1 && y >= y0 && y <= y1;

const inRoundRect = (x, y, x0, y0, x1, y1, r) => {
  if (!inRect(x, y, x0, y0, x1, y1)) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};

const inEllipse = (x, y, cx, cy, rx, ry) =>
  rx > 0 && ry > 0 && ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

/**
 * Draw the mark.
 *
 * @param {number} size    pixel width/height
 * @param {object} [opts]
 * @param {boolean} [opts.maskable]  fill the full canvas and shrink the glyph
 *   into the safe zone, per the maskable-icon contract
 * @param {boolean} [opts.square]    square corners (iOS masks its own)
 */
export function drawIcon(size, { maskable = false, square = false } = {}) {
  const px = Buffer.alloc(size * size * 4);
  const S = 3;                       // supersample factor per axis
  const radius = maskable || square ? 0 : size * 0.1875;

  // The glyph box. A maskable icon must keep its content inside the safe
  // circle (40% radius), so the glyph shrinks and the plate fills everything.
  const H = size * (maskable ? 0.40 : 0.56);
  const gx = size / 2 - H * 0.34;    // glyph left edge (bowl extends right)
  const gy = size / 2 - H / 2;

  const sw = H * 0.15;               // stem width
  const serifX = H * 0.07;           // serif overhang
  const serifY = H * 0.045;          // serif thickness
  const stroke = H * 0.105;          // bowl stroke weight

  const bowlRy = H * 0.30;
  const bowlRx = H * 0.34;
  const bowlCx = gx + sw / 2;
  const bowlCy = gy + bowlRy;

  const inGlyph = (x, y) => {
    if (inRect(x, y, gx, gy, gx + sw, gy + H)) return true;                            // stem
    if (inRect(x, y, gx - serifX, gy, gx + sw + serifX, gy + serifY)) return true;     // top serif
    if (inRect(x, y, gx - serifX * 1.4, gy + H - serifY * 1.15,
                     gx + sw + serifX * 1.4, gy + H)) return true;                     // foot serif
    if (x >= bowlCx &&                                                                  // bowl
        inEllipse(x, y, bowlCx, bowlCy, bowlRx, bowlRy) &&
        !inEllipse(x, y, bowlCx, bowlCy, bowlRx - stroke, bowlRy - stroke)) return true;
    return false;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let plate = 0, glyph = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const px_ = x + (sx + 0.5) / S;
          const py_ = y + (sy + 0.5) / S;
          const onPlate = radius
            ? inRoundRect(px_, py_, 0, 0, size, size, radius)
            : true;
          if (!onPlate) continue;
          plate++;
          if (inGlyph(px_, py_)) glyph++;
        }
      }
      const n = S * S;
      const a = plate / n;                       // plate coverage -> alpha
      const g = plate ? glyph / plate : 0;       // glyph coverage within plate
      const i = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) px[i + c] = Math.round(GREEN[c] * (1 - g) + PAPER[c] * g);
      px[i + 3] = Math.round(a * 255);
    }
  }
  return encodePNG(px, size, size);
}
