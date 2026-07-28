// Image-based parallax backgrounds. Each background is a stack of PNG
// layers (see BG_LAYERS) scaled to fill the canvas height. 'sky' is drawn
// once, centered, without scrolling; the rest tile horizontally and scroll
// at their own speed (bgO[0..4], see BG_CONFIG) for the parallax effect.

// Draws one scrolling layer, tiling it across the canvas width.
// off is an unbounded, ever-growing scroll distance in image-space pixels.
function bgDrawLayer(img, off, scale) {
  if (!img || !img.complete || !img.naturalWidth) return;
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  let x = -(((off % dw) + dw) % dw);
  while (x < VW) {
    ctx.drawImage(img, x, 0, dw, dh);
    x += dw;
  }
}

function drawBGImage(key, o) {
  const layers = imgs.bg[key];
  if (!layers) return;

  const sky = layers.sky;
  const scale = (sky && sky.naturalHeight) ? VH / sky.naturalHeight : VH / 1080;

  if (sky && sky.complete && sky.naturalWidth) {
    const dw = sky.naturalWidth * scale;
    ctx.drawImage(sky, (VW - dw) / 2, 0, dw, VH);
  } else {
    ctx.fillStyle = '#0E1621';
    ctx.fillRect(0, 0, VW, VH);
  }

  BG_SCROLL_LAYERS.forEach((layer, i) => bgDrawLayer(layers[layer], o[i], scale));
}

// ─── dispatch table ──────────────────────────────────────────────────────────
const BG_FN = {};
BGS.forEach(bg => { BG_FN[bg] = o => drawBGImage(bg, o); });
