// Procedural parallax backgrounds. Each BG_FN[key](bgO) draws the full scene.
// bgO[0..3]: scroll offsets for 4 parallax layers (each in [0, VW)).

// Translate-tile helper: draws fn() twice side by side for seamless scrolling
function bgScroll(off, fn) {
  ctx.save();
  ctx.translate(-off, 0);
  fn();
  ctx.translate(VW, 0);
  fn();
  ctx.restore();
}

// Seamless mountain silhouette drawn in world-space [0..VW].
// Uses |sin(π·n·t)| which is identical at t=0 and t=1 for all integers n.
function bgMtn(baseY, amp, n1, n2, n3) {
  ctx.beginPath();
  ctx.moveTo(-2, VH);
  for (let x = -2; x <= VW + 2; x += 2) {
    const t = x / VW;
    const h = amp * (
      0.50 * Math.abs(Math.sin(Math.PI * n1 * t)) +
      0.32 * Math.abs(Math.sin(Math.PI * n2 * t + 0.9)) +
      0.18 * Math.abs(Math.sin(Math.PI * n3 * t + 1.8))
    );
    ctx.lineTo(x, baseY - h);
  }
  ctx.lineTo(VW + 2, VH);
  ctx.closePath();
  ctx.fill();
}

// Stylised pine tree. (x, y) = foot position, sc = scale.
function bgPine(x, y, sc) {
  ctx.beginPath();
  ctx.moveTo(x,         y - 62*sc);
  ctx.lineTo(x + 12*sc, y - 40*sc);
  ctx.lineTo(x - 12*sc, y - 40*sc);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x,         y - 44*sc);
  ctx.lineTo(x + 15*sc, y - 20*sc);
  ctx.lineTo(x - 15*sc, y - 20*sc);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x,         y - 26*sc);
  ctx.lineTo(x + 18*sc, y);
  ctx.lineTo(x - 18*sc, y);
  ctx.closePath(); ctx.fill();
  ctx.fillRect(x - 2*sc, y - 8*sc, 4*sc, 8*sc);
}

// Desert cactus. (x, y) = foot position.
function bgCactus(x, y, sc) {
  const tw = 7*sc, th = 55*sc;
  ctx.fillRect(x - tw/2,         y - th,      tw,    th    );
  ctx.fillRect(x - tw/2 - 12*sc, y - th*0.60, 12*sc, 4*sc  );
  ctx.fillRect(x - tw/2 - 12*sc, y - th*0.82, 4*sc,  th*0.26);
  ctx.fillRect(x + tw/2,         y - th*0.50, 11*sc, 4*sc  );
  ctx.fillRect(x + tw/2 + 7*sc,  y - th*0.72, 4*sc,  th*0.26);
}

// Puffy cloud shape.
function bgCloud(x, y, w, h) {
  ctx.beginPath();
  ctx.ellipse(x,          y,          w,        h,        0, 0, Math.PI*2);
  ctx.ellipse(x + w*0.52, y - h*0.40, w*0.58,   h*0.78,   0, 0, Math.PI*2);
  ctx.ellipse(x - w*0.48, y - h*0.30, w*0.52,   h*0.72,   0, 0, Math.PI*2);
  ctx.fill();
}

// Hash-seeded stars drawn in static screen space (no scroll).
function bgStars(count, seed) {
  const h = n => { const v = Math.sin(n * 127.1 + seed) * 43758.5; return v - Math.floor(v); };
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = h(i)     * VW;
    const y = h(i+100) * VH * 0.64;
    const r = h(i+200) * 1.4 + 0.3;
    ctx.globalAlpha = 0.45 + h(i+300) * 0.55;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── BG_01  Desert Sunset ────────────────────────────────────────────────────
function drawBG_01(o) {
  // Sky gradient (dusk)
  const sg = ctx.createLinearGradient(0, 0, 0, VH);
  sg.addColorStop(0,    '#0E0526');
  sg.addColorStop(0.22, '#7C1E40');
  sg.addColorStop(0.52, '#C2480C');
  sg.addColorStop(0.72, '#EE960A');
  sg.addColorStop(0.86, '#C24808');
  sg.addColorStop(1,    '#8A3008');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, VW, VH);

  // Sun halo
  const sx = VW * 0.62, sy = VH * 0.64;
  const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, VW * 0.56);
  hg.addColorStop(0,   'rgba(255,195,0,0.44)');
  hg.addColorStop(0.30,'rgba(255,110,0,0.18)');
  hg.addColorStop(1,   'transparent');
  ctx.fillStyle = hg; ctx.fillRect(0, 0, VW, VH);

  // Sun disc
  ctx.shadowColor = '#FFE000'; ctx.shadowBlur = 34;
  ctx.fillStyle = '#FFE000';
  ctx.beginPath(); ctx.arc(sx, sy, 26, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  // Far rocky mountains
  ctx.fillStyle = '#6A2012';
  bgScroll(o[0], () => bgMtn(VH * 0.52, 102, 3, 7, 13));

  // Near dark cliffs
  ctx.fillStyle = '#3C1008';
  bgScroll(o[1], () => bgMtn(VH * 0.65, 82, 5, 9, 17));

  // Sandy ground
  const gg = ctx.createLinearGradient(0, GY - 18, 0, VH);
  gg.addColorStop(0, '#C4820A'); gg.addColorStop(0.45, '#8B5C08'); gg.addColorStop(1, '#4A2C06');
  ctx.fillStyle = gg; ctx.fillRect(0, GY - 18, VW, VH - GY + 18);

  // Cactus silhouettes
  ctx.fillStyle = '#1C3A08';
  bgScroll(o[2], () => {
    bgCactus( 52, GY - 3, 0.85);
    bgCactus(162, GY - 3, 1.05);
    bgCactus(280, GY - 3, 0.70);
    bgCactus(392, GY - 3, 1.12);
    bgCactus(486, GY - 3, 0.80);
  });

  // Ground rocks (fastest layer)
  ctx.fillStyle = '#2A1404';
  bgScroll(o[3], () => {
    [[48,9,13],[145,6,10],[235,8,12],[375,7,11],[462,9,14]].forEach(([x,rw,rh]) => {
      ctx.beginPath(); ctx.ellipse(x, GY + 3, rw, rh, 0, 0, Math.PI*2); ctx.fill();
    });
  });
}

// ─── BG_02  Starry Night ─────────────────────────────────────────────────────
function drawBG_02(o) {
  // Deep-space sky
  const sg = ctx.createLinearGradient(0, 0, 0, VH);
  sg.addColorStop(0,    '#020210');
  sg.addColorStop(0.42, '#081438');
  sg.addColorStop(0.76, '#162A60');
  sg.addColorStop(1,    '#0D1840');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, VW, VH);

  // Stars (no parallax)
  ctx.fillStyle = '#EEF4FF';
  bgStars(90, 4.2);

  // Crescent moon
  const mx = VW * 0.76, my = VH * 0.13;
  ctx.shadowColor = '#C8D8FF'; ctx.shadowBlur = 22;
  ctx.fillStyle = 'rgba(210,228,255,0.92)';
  ctx.beginPath(); ctx.arc(mx, my, 23, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#081438';
  ctx.beginPath(); ctx.arc(mx + 13, my - 6, 18, 0, Math.PI*2); ctx.fill();

  // Far indigo mountains
  ctx.fillStyle = '#0E1A40';
  bgScroll(o[0], () => bgMtn(VH * 0.50, 118, 4, 8, 15));

  // Mid dark mountains
  ctx.fillStyle = '#080E26';
  bgScroll(o[1], () => bgMtn(VH * 0.63, 82, 6, 11, 19));

  // Dark ground
  ctx.fillStyle = '#040A18'; ctx.fillRect(0, GY - 6, VW, VH - GY + 6);

  // Pine tree silhouettes
  ctx.fillStyle = '#050C1E';
  bgScroll(o[2], () => {
    bgPine( 32, GY, 0.82);
    bgPine(122, GY, 1.06);
    bgPine(215, GY, 0.68);
    bgPine(312, GY, 1.16);
    bgPine(402, GY, 0.90);
    bgPine(492, GY, 0.76);
  });

  // Ground-level mist/shadow
  const mg = ctx.createLinearGradient(0, GY - 4, 0, GY + 10);
  mg.addColorStop(0, 'rgba(20,30,80,0.45)'); mg.addColorStop(1, 'transparent');
  ctx.fillStyle = mg;
  bgScroll(o[3], () => ctx.fillRect(0, GY - 4, VW, 14));
}

// ─── BG_03  Green Forest ─────────────────────────────────────────────────────
function drawBG_03(o) {
  // Daylight sky
  const sg = ctx.createLinearGradient(0, 0, 0, VH);
  sg.addColorStop(0,    '#1A3C5C');
  sg.addColorStop(0.30, '#2E6E9E');
  sg.addColorStop(0.62, '#5BA8C8');
  sg.addColorStop(0.82, '#A0D4E8');
  sg.addColorStop(1,    '#78B8D0');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, VW, VH);

  // Distant green mountains
  ctx.fillStyle = '#3A6854';
  bgScroll(o[0], () => bgMtn(VH * 0.50, 102, 4, 9, 16));

  // Mid forest hills
  ctx.fillStyle = '#286840';
  bgScroll(o[1], () => bgMtn(VH * 0.64, 74, 6, 11, 20));

  // Fog band at treeline
  const fg = ctx.createLinearGradient(0, VH * 0.58, 0, VH * 0.72);
  fg.addColorStop(0, 'transparent');
  fg.addColorStop(0.45, 'rgba(200,232,215,0.40)');
  fg.addColorStop(1, 'transparent');
  ctx.fillStyle = fg; ctx.fillRect(0, VH * 0.58, VW, VH * 0.14);

  // Forest floor
  const gg = ctx.createLinearGradient(0, GY - 12, 0, VH);
  gg.addColorStop(0, '#204828'); gg.addColorStop(0.5, '#142E18'); gg.addColorStop(1, '#0A1C0E');
  ctx.fillStyle = gg; ctx.fillRect(0, GY - 12, VW, VH - GY + 12);

  // Foreground pine trees
  ctx.fillStyle = '#102818';
  bgScroll(o[2], () => {
    bgPine( 22, GY + 4, 1.18);
    bgPine(115, GY + 4, 0.82);
    bgPine(218, GY + 4, 1.36);
    bgPine(328, GY + 4, 0.98);
    bgPine(422, GY + 4, 0.72);
    bgPine(512, GY + 4, 1.10);
  });

  // Grass tufts on ground
  ctx.fillStyle = '#1A3C20';
  bgScroll(o[3], () => {
    [[48,8],[145,7],[242,9],[345,7],[440,8],[515,6]].forEach(([x, h]) => {
      ctx.fillRect(x - 3, GY - h,     2, h    );
      ctx.fillRect(x,     GY - h - 2, 2, h + 2);
      ctx.fillRect(x + 3, GY - h + 1, 2, h - 1);
    });
  });
}

// ─── BG_04  Epic Dawn ────────────────────────────────────────────────────────
function drawBG_04(o) {
  // Cosmic-dawn sky
  const sg = ctx.createLinearGradient(0, 0, 0, VH);
  sg.addColorStop(0,    '#050014');
  sg.addColorStop(0.22, '#1C0040');
  sg.addColorStop(0.48, '#580028');
  sg.addColorStop(0.68, '#A02818');
  sg.addColorStop(0.80, '#E05010');
  sg.addColorStop(0.90, '#F5A000');
  sg.addColorStop(1,    '#C05600');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, VW, VH);

  // God rays from horizon (static, wide fan)
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = '#FFD000';
  const hy = VH * 0.82;
  for (let i = 0; i < 14; i++) {
    const a = -Math.PI / 2 + (i - 6.5) * 0.11;
    ctx.beginPath();
    ctx.moveTo(VW * 0.5, hy);
    ctx.lineTo(VW * 0.5 + Math.cos(a - 0.04) * VH * 1.5, hy + Math.sin(a - 0.04) * VH * 1.5);
    ctx.lineTo(VW * 0.5 + Math.cos(a + 0.04) * VH * 1.5, hy + Math.sin(a + 0.04) * VH * 1.5);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // Dramatic purple clouds
  ctx.fillStyle = '#260044';
  bgScroll(o[0], () => {
    bgCloud( 82, VH * 0.22, 62, 22);
    bgCloud(295, VH * 0.17, 80, 29);
    bgCloud(458, VH * 0.26, 52, 18);
  });

  // Far mountain silhouettes
  ctx.fillStyle = '#1A0030';
  bgScroll(o[1], () => bgMtn(VH * 0.55, 118, 3, 8, 14));

  // Near dark peaks
  ctx.fillStyle = '#0E0020';
  bgScroll(o[2], () => bgMtn(VH * 0.70, 86, 5, 10, 18));

  // Fiery ground
  const gg = ctx.createLinearGradient(0, GY - 12, 0, VH);
  gg.addColorStop(0, '#280010'); gg.addColorStop(0.4, '#180008'); gg.addColorStop(1, '#080004');
  ctx.fillStyle = gg; ctx.fillRect(0, GY - 12, VW, VH - GY + 12);

  // Ancient ruin pillars (foreground)
  ctx.fillStyle = '#0A0006';
  bgScroll(o[3], () => {
    const pillars = [[48,38],[202,54],[362,34],[472,46]];
    pillars.forEach(([x, h]) => {
      ctx.fillRect(x,      GY - h, 11, h);
      ctx.fillRect(x - 4,  GY - h - 7, 19, 8);
      ctx.fillRect(x - 2,  GY - h + h*0.35, 15, 5);
    });
  });
}

// ─── dispatch table ──────────────────────────────────────────────────────────
const BG_FN = {
  BG_01: drawBG_01,
  BG_02: drawBG_02,
  BG_03: drawBG_03,
  BG_04: drawBG_04,
};
