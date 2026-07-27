// Procedural parallax backgrounds. Each BG_FN[key](bgO) draws the full scene.
// bgO[0..3]: scroll offsets for 4 terrain parallax layers (each in [0, VW)).
// bgO[4]: scroll offset for the far "epic sky" layer (floating islands / dragon / ruins).

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

// ─── fantasy flourish helpers ─────────────────────────────────────────────────

// Deterministic 0..1 hash, reused by every ambient-particle system below.
function bgHash(n, seed) { const v = Math.sin(n * 127.1 + seed) * 43758.5; return v - Math.floor(v); }

// Drifting glow motes (fireflies / dust / magic sparkles). Rises from yBot to
// yTop over time and loops, with a soft twinkle and edge fade so the wrap
// isn't visible as a pop.
function bgMotes(count, seed, t, cfg) {
  const band = cfg.yBot - cfg.yTop;
  ctx.save();
  ctx.fillStyle = cfg.color;
  for (let i = 0; i < count; i++) {
    const speed = cfg.speed * (0.6 + 0.8 * bgHash(i+50, seed));
    const progress = (t * speed / 1000 + bgHash(i+100, seed) * band) % band;
    const bx = bgHash(i, seed) * VW + Math.sin(t/1000 + i*1.7) * cfg.swayAmp;
    const by = cfg.yBot - progress;
    const frac = progress / band;
    const edgeFade = Math.min(1, frac*6, (1-frac)*6);
    const twinkle = 0.55 + 0.45*Math.sin(t/450 + i*2.3);
    const r = cfg.rMin + bgHash(i+200, seed) * (cfg.rMax - cfg.rMin);
    ctx.globalAlpha = cfg.alpha * edgeFade * twinkle;
    if (cfg.glow) { ctx.shadowColor = cfg.color; ctx.shadowBlur = cfg.glow; }
    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  ctx.restore();
}

// Rocky floating island with dangling roots, optional canopy tuft on top.
function bgFloatingIsland(x, y, w, h, foliage) {
  ctx.beginPath();
  ctx.moveTo(x - w*0.50, y);
  ctx.quadraticCurveTo(x - w*0.55, y - h*0.70, x - w*0.15, y - h);
  ctx.quadraticCurveTo(x + w*0.25, y - h*1.08, x + w*0.50, y - h*0.75);
  ctx.quadraticCurveTo(x + w*0.58, y - h*0.25, x + w*0.35, y + h*0.15);
  ctx.quadraticCurveTo(x, y + h*0.35, x - w*0.50, y);
  ctx.closePath(); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const rx = x - w*0.28 + i*w*0.28;
    const rl = h * (0.35 + 0.25*Math.abs(Math.sin(i*2.1)));
    ctx.beginPath();
    ctx.moveTo(rx - 1.5, y + h*0.10);
    ctx.quadraticCurveTo(rx, y + h*0.10 + rl*0.6, rx + (i-1)*3, y + h*0.10 + rl);
    ctx.lineTo(rx + 3 + (i-1)*3, y + h*0.10 + rl);
    ctx.quadraticCurveTo(rx + 3, y + h*0.10 + rl*0.6, rx + 4.5, y + h*0.10);
    ctx.closePath(); ctx.fill();
  }
  if (foliage) {
    ctx.beginPath();
    ctx.ellipse(x - w*0.05, y - h*0.95, w*0.30, h*0.16, 0, 0, Math.PI*2);
    ctx.ellipse(x + w*0.20, y - h*0.85, w*0.18, h*0.12, 0, 0, Math.PI*2);
    ctx.fill();
  }
}

// Winged silhouette (dragon/wyvern), wings flapping with time. Facing left.
function bgDragon(cx, cy, s, t, color, flapSpeed) {
  ctx.save();
  ctx.translate(cx, cy); ctx.scale(s, s);
  ctx.fillStyle = color;
  const flap = Math.sin(t / (flapSpeed||140)) * 0.55;
  ctx.save(); ctx.rotate(-0.15 - flap);
  ctx.beginPath();
  ctx.moveTo(0,0); ctx.lineTo(-38,-26); ctx.lineTo(-30,-6); ctx.lineTo(-46,-2); ctx.lineTo(-18,6);
  ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.rotate(0.15 + flap);
  ctx.beginPath();
  ctx.moveTo(0,0); ctx.lineTo(38,-26); ctx.lineTo(30,-6); ctx.lineTo(46,-2); ctx.lineTo(18,6);
  ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(0,0,22,8,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(18,-4); ctx.lineTo(34,-10); ctx.lineTo(30,-2); ctx.lineTo(36,2); ctx.lineTo(20,4);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-20,0); ctx.quadraticCurveTo(-38,4,-46,-6); ctx.quadraticCurveTo(-36,2,-20,4);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

// Flowing aurora ribbons across the upper sky.
function bgAurora(t) {
  const bands = [
    {baseY: VH*0.05, amp:13, freq:1.6, speed:0.00035, color:'rgba(80,255,170,'},
    {baseY: VH*0.075,amp:10, freq:2.1, speed:-0.0004, color:'rgba(140,120,255,'},
    {baseY: VH*0.10, amp:15, freq:1.3, speed:0.0003,  color:'rgba(60,220,255,'},
  ];
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  bands.forEach(b => {
    ctx.beginPath();
    for (let x = -2; x <= VW + 2; x += 6) {
      const y = b.baseY + Math.sin(x*b.freq*0.01 + t*b.speed) * b.amp;
      if (x === -2) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle = b.color + '0.30)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = b.color + '0.8)';
    ctx.shadowBlur = 12;
    ctx.stroke();
  });
  ctx.shadowBlur = 0;
  ctx.restore();
}

// Periodic shooting star streak (deterministic from wall-clock time).
function bgShootingStar(t) {
  const cycle = 6000, dur = 900;
  const phase = t % cycle;
  if (phase > dur) return;
  const p = phase / dur;
  const seedOffset = Math.floor(t / cycle) % 5;
  const startX = VW*0.10 + seedOffset*VW*0.18;
  const startY = VH*0.05 + (seedOffset%3)*18;
  const ang = 0.55, len = 70, reach = 220;
  const headX = startX + Math.cos(ang)*p*reach;
  const headY = startY + Math.sin(ang)*p*reach;
  const tailX = headX - Math.cos(ang)*len;
  const tailY = headY - Math.sin(ang)*len;
  ctx.save();
  const grad = ctx.createLinearGradient(tailX,tailY,headX,headY);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(255,255,255,0.9)');
  ctx.strokeStyle = grad; ctx.lineWidth = 2;
  ctx.globalAlpha = Math.sin(Math.PI*p);
  ctx.beginPath(); ctx.moveTo(tailX,tailY); ctx.lineTo(headX,headY); ctx.stroke();
  ctx.restore();
}

// Pulsing magic rune glyph (used on obelisks / ruins).
function bgRuneGlow(x, y, r, t, color) {
  const pulse = 0.55 + 0.45*Math.sin(t/700 + x*0.05);
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = color; ctx.lineWidth = 1.4;
  ctx.shadowColor = color; ctx.shadowBlur = 10*pulse;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x,y,r*0.6,0,Math.PI*2); ctx.stroke();
  for (let k = 0; k < 6; k++) {
    const a = k/6*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(x+Math.cos(a)*r*0.70, y+Math.sin(a)*r*0.70);
    ctx.lineTo(x+Math.cos(a)*r*1.15, y+Math.sin(a)*r*1.15);
    ctx.stroke();
  }
  ctx.restore();
}

// Ancient stone obelisk, foot position (x,y), width w, height h.
function bgObelisk(x, y, h, w) {
  ctx.fillRect(x - w/2, y - h, w, h);
  ctx.beginPath();
  ctx.moveTo(x - w/2 - 3, y - h); ctx.lineTo(x, y - h - 14); ctx.lineTo(x + w/2 + 3, y - h);
  ctx.closePath(); ctx.fill();
}

// Small floating crystal shard, gently bobbing.
function bgCrystal(x, y, s, t, glow) {
  const bob = Math.sin(t/900 + x*0.1) * 4;
  ctx.save();
  ctx.translate(x, y + bob); ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0,-14); ctx.lineTo(7,-2); ctx.lineTo(4,12); ctx.lineTo(-4,12); ctx.lineTo(-7,-2);
  ctx.closePath(); ctx.fill();
  if (glow) {
    ctx.shadowColor = glow; ctx.shadowBlur = 12;
    ctx.strokeStyle = glow; ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6 + 0.4*Math.sin(t/500 + x);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── BG_01  Desert Sunset ────────────────────────────────────────────────────
function drawBG_01(o) {
  const t = Date.now();

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

  // Far sky layer: hazy floating islands + a gliding wyvern
  ctx.fillStyle = 'rgba(90,32,20,0.55)';
  bgScroll(o[4], () => {
    bgFloatingIsland(90,  VH*0.24, 46, 20, true);
    bgFloatingIsland(340, VH*0.16, 34, 15, true);
    bgFloatingIsland(470, VH*0.30, 26, 12, false);
  });
  const wvX = ((t/1000 * 30) % (VW+160)) - 80;
  bgDragon(wvX, VH*0.20 + Math.sin(t/1400)*8, 0.55, t, 'rgba(50,14,8,0.65)', 110);

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

  // Cactus silhouettes + a pair of rune-marked obelisks
  ctx.fillStyle = '#1C3A08';
  bgScroll(o[2], () => {
    bgCactus( 52, GY - 3, 0.85);
    bgCactus(162, GY - 3, 1.05);
    bgCactus(280, GY - 3, 0.70);
    bgCactus(392, GY - 3, 1.12);
    bgCactus(486, GY - 3, 0.80);
  });
  ctx.fillStyle = '#2A1608';
  bgScroll(o[1], () => {
    bgObelisk(228, GY - 8, 46, 12);
    bgObelisk(452, GY - 8, 38, 11);
  });
  bgScroll(o[1], () => {
    bgRuneGlow(228, GY - 8 - 24, 7, t, '#FFB020');
    bgRuneGlow(452, GY - 8 - 20, 6, t, '#FFB020');
  });

  // Drifting warm dust motes
  bgMotes(16, 8.1, t, {yTop: VH*0.30, yBot: GY, speed: 14, swayAmp: 6, rMin:0.6, rMax:1.6, alpha:0.55, color:'#FFC060', glow:5});

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
  const t = Date.now();

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

  // Aurora + the occasional shooting star, behind the moon
  bgAurora(t);
  bgShootingStar(t);

  // Crescent moon
  const mx = VW * 0.76, my = VH * 0.13;
  ctx.shadowColor = '#C8D8FF'; ctx.shadowBlur = 22;
  ctx.fillStyle = 'rgba(210,228,255,0.92)';
  ctx.beginPath(); ctx.arc(mx, my, 23, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#081438';
  ctx.beginPath(); ctx.arc(mx + 13, my - 6, 18, 0, Math.PI*2); ctx.fill();

  // Far sky layer: misty peaks with a lone watchtower silhouette
  ctx.fillStyle = 'rgba(10,16,42,0.65)';
  bgScroll(o[4], () => bgMtn(VH * 0.42, 70, 2, 5, 9));
  ctx.fillStyle = 'rgba(6,10,28,0.75)';
  bgScroll(o[4], () => {
    ctx.fillRect(150 - 6, VH*0.42 - 46, 12, 46);
    ctx.beginPath();
    ctx.moveTo(150-9, VH*0.42-46); ctx.lineTo(150, VH*0.42-58); ctx.lineTo(150+9, VH*0.42-46);
    ctx.closePath(); ctx.fill();
  });
  bgScroll(o[4], () => bgRuneGlow(150, VH*0.42-38, 4, t, '#FFD87A'));

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

  // Cool magic motes drifting through the trees
  bgMotes(14, 2.7, t, {yTop: VH*0.55, yBot: GY+4, speed: 10, swayAmp: 8, rMin:0.5, rMax:1.5, alpha:0.6, color:'#BFE0FF', glow:6});

  // Ground-level mist/shadow
  const mg = ctx.createLinearGradient(0, GY - 4, 0, GY + 10);
  mg.addColorStop(0, 'rgba(20,30,80,0.45)'); mg.addColorStop(1, 'transparent');
  ctx.fillStyle = mg;
  bgScroll(o[3], () => ctx.fillRect(0, GY - 4, VW, 14));
}

// ─── BG_03  Green Forest ─────────────────────────────────────────────────────
function drawBG_03(o) {
  const t = Date.now();

  // Daylight sky
  const sg = ctx.createLinearGradient(0, 0, 0, VH);
  sg.addColorStop(0,    '#1A3C5C');
  sg.addColorStop(0.30, '#2E6E9E');
  sg.addColorStop(0.62, '#5BA8C8');
  sg.addColorStop(0.82, '#A0D4E8');
  sg.addColorStop(1,    '#78B8D0');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, VW, VH);

  // Soft sunbeams through the canopy
  ctx.save();
  ctx.globalAlpha = 0.06; ctx.fillStyle = '#FFFDE0';
  for (let i = 0; i < 4; i++) {
    const bx = VW*0.20 + i*VW*0.24;
    ctx.beginPath();
    ctx.moveTo(bx-10, 0); ctx.lineTo(bx+18, 0); ctx.lineTo(bx+70, VH*0.6); ctx.lineTo(bx+20, VH*0.6);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // Far sky layer: misty floating isles with tiny waterfalls above the canopy
  ctx.fillStyle = 'rgba(200,235,225,0.40)';
  bgScroll(o[4], () => {
    bgFloatingIsland(70,  VH*0.20, 40, 17, true);
    bgFloatingIsland(300, VH*0.14, 30, 13, true);
    bgFloatingIsland(430, VH*0.24, 22, 10, true);
  });

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

  // Fireflies drifting near the treeline
  bgMotes(18, 6.6, t, {yTop: VH*0.62, yBot: GY, speed: 9, swayAmp: 10, rMin:0.6, rMax:1.7, alpha:0.7, color:'#D4FF6A', glow:7});

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
  const t = Date.now();

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

  // Far sky layer: drifting crystal shards + a slow, majestic dragon
  bgScroll(o[4], () => {
    bgCrystal(80,  VH*0.20, 1.1, t, '#FFC060');
    bgCrystal(260, VH*0.14, 0.8, t, '#FF9060');
    bgCrystal(430, VH*0.22, 1.3, t, '#FFC060');
  });
  const drX = ((t/1000 * 24) % (VW+240)) - 120;
  bgDragon(drX, VH*0.30 + Math.sin(t/2000)*10, 1.4, t, 'rgba(20,0,10,0.55)', 220);

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

  // Ancient ruin pillars (foreground) with faint rune glow
  ctx.fillStyle = '#0A0006';
  bgScroll(o[3], () => {
    const pillars = [[48,38],[202,54],[362,34],[472,46]];
    pillars.forEach(([x, h]) => {
      ctx.fillRect(x,      GY - h, 11, h);
      ctx.fillRect(x - 4,  GY - h - 7, 19, 8);
      ctx.fillRect(x - 2,  GY - h + h*0.35, 15, 5);
    });
  });
  bgScroll(o[3], () => {
    [[48,38],[202,54],[362,34],[472,46]].forEach(([x,h]) => bgRuneGlow(x+5, GY - h*0.5, 5, t, '#FF6A2A'));
  });

  // Rising embers
  bgMotes(16, 9.4, t, {yTop: VH*0.30, yBot: GY, speed: 20, swayAmp: 7, rMin:0.6, rMax:1.6, alpha:0.65, color:'#FF8A3C', glow:6});
}

// ─── dispatch table ──────────────────────────────────────────────────────────
const BG_FN = {
  BG_01: drawBG_01,
  BG_02: drawBG_02,
  BG_03: drawBG_03,
  BG_04: drawBG_04,
};
