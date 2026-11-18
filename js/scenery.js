// ===== פופילנד – אובייקטים בעולם =====
G.Scn = (() => {
  const U = G.U;
  const S = {};
  const txt = (ctx, s, x, y, size, col, weight, stroke) => {
    ctx.font = `${weight || 700} ${size}px Fredoka, Rubik, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (stroke) { ctx.lineWidth = 4; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    ctx.fillStyle = col; ctx.fillText(s, x, y);
  };
  S.txt = txt;

  // ---------- טבע ----------
  S.tree = (ctx, o, t) => {
    const s = o.s || 1, c = o.c || '#3cc06a', sway = Math.sin(t * 1.2 + o.x * 0.01) * 2;
    U.shadow(ctx, o.x, o.y, 36 * s, 11 * s);
    U.fillRR(ctx, o.x - 7 * s, o.y - 46 * s, 14 * s, 46 * s, 5, '#8a5a36');
    ctx.fillStyle = '#6e4529'; ctx.fillRect(o.x + 1 * s, o.y - 44 * s, 5 * s, 42 * s);
    const cx = o.x + sway, cy = o.y - 78 * s;
    U.circ(ctx, cx - 22 * s, cy + 10 * s, 24 * s, U.shade(c, -0.18));
    U.circ(ctx, cx + 22 * s, cy + 10 * s, 24 * s, U.shade(c, -0.12));
    U.circ(ctx, cx, cy - 14 * s, 30 * s, c);
    U.circ(ctx, cx, cy + 12 * s, 28 * s, U.shade(c, -0.06));
    U.circ(ctx, cx - 9 * s, cy - 22 * s, 11 * s, U.shade(c, 0.22));
    if (o.fruit) for (let i = 0; i < 5; i++) U.circ(ctx, cx + Math.cos(i * 2.3) * 22 * s, cy + Math.sin(i * 2.3) * 18 * s, 4 * s, o.fruit);
  };
  S.pine = (ctx, o, t) => {
    const s = o.s || 1, c = o.c || '#2e9e6a';
    U.shadow(ctx, o.x, o.y, 28 * s, 9 * s);
    U.fillRR(ctx, o.x - 6 * s, o.y - 26 * s, 12 * s, 26 * s, 3, '#7a4a2c');
    for (let i = 0; i < 3; i++) { const w = (38 - i * 9) * s, yy = o.y - 20 * s - i * 26 * s; ctx.beginPath(); ctx.moveTo(o.x - w, yy); ctx.lineTo(o.x, yy - 46 * s); ctx.lineTo(o.x + w, yy); ctx.closePath(); ctx.fillStyle = i % 2 ? U.shade(c, 0.1) : c; ctx.fill(); }
    if (o.lights) for (let i = 0; i < 8; i++) U.circ(ctx, o.x + Math.sin(i * 1.9) * 22 * s * (1 - i / 10), o.y - 30 * s - i * 9 * s, 3, `hsl(${(i * 50 + t * 80) % 360},90%,65%)`);
  };
  S.palm = (ctx, o, t) => {
    const s = o.s || 1, sway = Math.sin(t * 1.4 + o.x) * 3;
    U.shadow(ctx, o.x + 10, o.y, 34 * s, 9 * s);
    ctx.strokeStyle = '#b5874f'; ctx.lineWidth = 11 * s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.quadraticCurveTo(o.x + 18 * s, o.y - 60 * s, o.x + 8 * s + sway, o.y - 120 * s); ctx.stroke();
    ctx.strokeStyle = '#9a6f3c'; ctx.lineWidth = 2; for (let i = 1; i < 8; i++) { const yy = o.y - i * 15 * s; ctx.beginPath(); ctx.moveTo(o.x + 4 * s + i * 1.2 - 5, yy); ctx.lineTo(o.x + 4 * s + i * 1.2 + 5, yy + 2); ctx.stroke(); }
    const tx = o.x + 8 * s + sway, ty = o.y - 122 * s;
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.55 + Math.sin(t * 1.3 + i) * 0.05; ctx.save(); ctx.translate(tx, ty); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(28 * s, -14 * s, 56 * s, 12 * s); ctx.quadraticCurveTo(26 * s, 2 * s, 0, 0); ctx.fillStyle = i % 2 ? '#2fb36a' : '#3fcf7c'; ctx.fill(); ctx.restore(); }
    U.circ(ctx, tx - 5, ty + 6, 6 * s, '#7a4a2c'); U.circ(ctx, tx + 6, ty + 7, 6 * s, '#6e4529');
  };
  S.bush = (ctx, o) => {
    const s = o.s || 1, c = o.c || '#43c26b';
    U.shadow(ctx, o.x, o.y, 30 * s, 8 * s);
    U.circ(ctx, o.x - 16 * s, o.y - 14 * s, 15 * s, U.shade(c, -0.15)); U.circ(ctx, o.x + 16 * s, o.y - 14 * s, 15 * s, U.shade(c, -0.1)); U.circ(ctx, o.x, o.y - 22 * s, 19 * s, c);
    if (o.flowers) for (let i = 0; i < 6; i++) U.circ(ctx, o.x + Math.cos(i * 2.1) * 20 * s, o.y - 20 * s + Math.sin(i * 2.1) * 10 * s, 3.5 * s, o.flowers);
  };
  S.flowers = (ctx, o, t) => {
    const r = U.rng(Math.floor(o.x * 7 + o.y));
    for (let i = 0; i < (o.n || 9); i++) {
      const fx = o.x + (r() - 0.5) * (o.w || 70), fy = o.y + (r() - 0.5) * 24, col = ['#ff7eb6', '#ffde59', '#ffffff', '#c39bff', '#ff8a3d'][Math.floor(r() * 5)];
      ctx.strokeStyle = '#3a9e55'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.sin(t * 2 + i) * 1.5, fy - 9); ctx.stroke();
      for (let k = 0; k < 5; k++) U.circ(ctx, fx + Math.sin(t * 2 + i) * 1.5 + Math.cos(k * 1.26) * 3, fy - 10 + Math.sin(k * 1.26) * 3, 2.4, col);
      U.circ(ctx, fx + Math.sin(t * 2 + i) * 1.5, fy - 10, 1.6, '#ffcf3c');
    }
  };
  S.pickflower = (ctx, o, t) => {
    if (o.gone) return;
    const col = o.c || '#ff7eb6', bob = Math.sin(t * 2 + o.x) * 2;
    U.shadow(ctx, o.x, o.y, 9, 3);
    ctx.strokeStyle = '#3a9e55'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x, o.y - 20 + bob); ctx.stroke();
    U.ell(ctx, o.x + 5, o.y - 9, 5, 2.5, '#4cc06a');
    for (let k = 0; k < 6; k++) U.circ(ctx, o.x + Math.cos(k * 1.05 + t) * 5.5, o.y - 22 + bob + Math.sin(k * 1.05 + t) * 5.5, 4.2, col);
    U.circ(ctx, o.x, o.y - 22 + bob, 3.4, '#ffcf3c');
    if (Math.sin(t * 3 + o.x) > 0.7) U.star(ctx, o.x + 10, o.y - 32, 4, 1.5, 4, '#fffbe0');
  };
  S.rock = (ctx, o) => { const s = o.s || 1; U.shadow(ctx, o.x, o.y, 22 * s, 6 * s); U.ell(ctx, o.x, o.y - 10 * s, 22 * s, 14 * s, '#a7a3b5'); U.ell(ctx, o.x - 5 * s, o.y - 15 * s, 10 * s, 6 * s, '#c3bfd0'); };

  // ---------- ריהוט רחוב ----------
  S.bench = (ctx, o) => {
    const f = o.flip ? -1 : 1; U.shadow(ctx, o.x, o.y, 44, 8);
    ctx.fillStyle = '#4b4b5c'; ctx.fillRect(o.x - 36, o.y - 18, 5, 18); ctx.fillRect(o.x + 31, o.y - 18, 5, 18);
    U.fillRR(ctx, o.x - 42, o.y - 24, 84, 9, 3, '#c98a4d'); U.fillRR(ctx, o.x - 42, o.y - 46, 84, 8, 3, '#b77a40'); U.fillRR(ctx, o.x - 42, o.y - 36, 84, 8, 3, '#c98a4d');
  };
  S.lamp = (ctx, o, t, night) => {
    U.shadow(ctx, o.x, o.y, 12, 4);
    U.fillRR(ctx, o.x - 3, o.y - 92, 6, 92, 3, '#3a3d55'); U.fillRR(ctx, o.x - 8, o.y - 8, 16, 8, 3, '#3a3d55');
    U.fillRR(ctx, o.x - 11, o.y - 110, 22, 20, 8, '#3a3d55'); U.fillRR(ctx, o.x - 8, o.y - 106, 16, 13, 5, night ? '#fff3a8' : '#fff9dd');
    if (night) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(o.x, o.y - 100, 4, o.x, o.y - 100, 90); g.addColorStop(0, 'rgba(255,230,140,0.45)'); g.addColorStop(1, 'rgba(255,230,140,0)'); U.circ(ctx, o.x, o.y - 100, 90, g); ctx.restore(); }
  };
  S.fountain = (ctx, o, t) => {
    const x = o.x, y = o.y;
    U.shadow(ctx, x, y + 6, 130, 40, 0.18);
    U.ell(ctx, x, y - 12, 126, 46, '#cfc8e2'); U.ell(ctx, x, y - 20, 126, 46, '#e9e4f5');
    U.ell(ctx, x, y - 22, 110, 38, '#4ab8e8'); U.ell(ctx, x, y - 24, 104, 34, '#68d0ff');
    for (let i = 0; i < 3; i++) { const r = ((t * 30 + i * 35) % 100); U.ell(ctx, x, y - 26, r, r * 0.33, null, U.rgba('#ffffff', 0.5 * (1 - r / 100)), 2); }
    U.fillRR(ctx, x - 16, y - 90, 32, 70, 8, '#d9d3ea'); U.ell(ctx, x, y - 90, 42, 14, '#e9e4f5'); U.ell(ctx, x, y - 92, 36, 11, '#68d0ff');
    U.fillRR(ctx, x - 7, y - 130, 14, 42, 6, '#d9d3ea');
    ctx.save(); ctx.globalAlpha = 0.85;
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, ph = (t * 1.5 + i * 0.13) % 1; const px = x + Math.cos(a) * 40 * ph, py = y - 132 - Math.sin(ph * Math.PI) * 30 + ph * 40; U.circ(ctx, px, py, 3.5 * (1 - ph * 0.5), '#bfeaff'); }
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, ph = (t * 1.2 + i * 0.07) % 1; const px = x + Math.cos(a) * (40 + 55 * ph), py = y - 90 - Math.sin(ph * Math.PI) * 26 + ph * 66 + Math.sin(a) * 18 * ph; U.circ(ctx, px, py, 3 * (1 - ph * 0.4), '#d6f3ff'); }
    ctx.restore();
  };
  S.sign = (ctx, o) => {
    U.shadow(ctx, o.x, o.y, 16, 5);
    U.fillRR(ctx, o.x - 4, o.y - 70, 8, 70, 3, '#8a5a36');
    ctx.font = '700 15px Fredoka, Rubik'; const w = Math.max(90, ctx.measureText(o.text).width + 30);
    U.fillRR(ctx, o.x - w / 2, o.y - 92, w, 32, 9, o.c || '#ffffff', U.shade(o.c || '#ffffff', -0.2), 2);
    txt(ctx, o.text, o.x, o.y - 76, 15, '#3a2d55');
  };
  S.gate = (ctx, o, t) => { // שער מעבר בין אזורים
    const c = o.c || '#7c5cff', x = o.x, y = o.y, w = o.w || 120;
    U.shadow(ctx, x, y, w * 0.6, 10);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y - 10, 5, x, y - 10, w * 0.6); g.addColorStop(0, U.rgba(c, 0.35 + Math.sin(t * 3) * 0.1)); g.addColorStop(1, U.rgba(c, 0)); U.ell(ctx, x, y - 6, w * 0.6, 26, g); ctx.restore();
    U.fillRR(ctx, x - w / 2 - 8, y - 110, 16, 110, 6, U.shade(c, -0.2)); U.fillRR(ctx, x + w / 2 - 8, y - 110, 16, 110, 6, U.shade(c, -0.2));
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 14, y - 104); ctx.quadraticCurveTo(x, y - 160, x + w / 2 + 14, y - 104); ctx.lineTo(x + w / 2 + 14, y - 88); ctx.quadraticCurveTo(x, y - 140, x - w / 2 - 14, y - 88); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    ctx.font = '700 16px Fredoka, Rubik'; const tw = ctx.measureText(o.text).width + 34;
    U.fillRR(ctx, x - tw / 2, y - 150, tw, 30, 15, '#ffffff', c, 3); txt(ctx, o.text, x, y - 135, 16, U.shade(c, -0.35));
    for (let i = 0; i < 3; i++) { const a = (t * 2 + i * 2.1); U.star(ctx, x + Math.cos(a) * w * 0.35, y - 50 + Math.sin(a * 1.3) * 20, 4, 1.6, 4, U.rgba('#ffffff', 0.85)); }
  };

  // ---------- בניינים ----------
  S.building = (ctx, o, t, night) => {
    const { x, y, w, h } = o, c = o.c, k = o.kind;
    U.shadow(ctx, x, y + 2, w * 0.55, 18, 0.2);
    // קיר
    U.fillRR(ctx, x - w / 2, y - h, w, h, 10, c); ctx.fillStyle = U.shade(c, -0.08); ctx.fillRect(x - w / 2, y - 22, w, 22);
    // גג
    if (k === 'cafe') { for (let i = 0; i < Math.ceil(w / 30); i++) { ctx.fillStyle = i % 2 ? '#ffffff' : '#ff6b81'; ctx.beginPath(); const sx = x - w / 2 - 10 + i * 30; ctx.moveTo(sx, y - h + 24); ctx.lineTo(sx + 30, y - h + 24); ctx.lineTo(sx + 30, y - h + 64); ctx.quadraticCurveTo(sx + 15, y - h + 76, sx, y - h + 64); ctx.fill(); } }
    else U.fillRR(ctx, x - w / 2 - 12, y - h - 14, w + 24, 30, 10, o.roof || U.shade(c, -0.3));
    // חלונות
    const win = night ? '#ffe9a8' : '#bfe6ff';
    const cols = Math.floor((w - 140) / 70);
    for (let i = 0; i < cols; i++) for (let side = -1; side <= 1; side += 2) {
      const wx = x + side * (70 + i * 64) - 22; if (Math.abs(wx + 22 - x) > w / 2 - 20) continue;
      U.fillRR(ctx, wx, y - h + 86, 44, 52, 6, win, U.shade(c, -0.3), 3);
      ctx.fillStyle = U.rgba('#ffffff', 0.5); ctx.beginPath(); ctx.moveTo(wx + 6, y - h + 128); ctx.lineTo(wx + 22, y - h + 92); ctx.lineTo(wx + 30, y - h + 92); ctx.lineTo(wx + 14, y - h + 128); ctx.fill();
    }
    // דלת
    U.fillRR(ctx, x - 32, y - 92, 64, 92, 10, U.shade(c, -0.35)); U.fillRR(ctx, x - 26, y - 86, 52, 86, 8, o.door || '#7a4a2c');
    if (k === 'mall' || k === 'arcade') { U.fillRR(ctx, x - 24, y - 84, 23, 84, 4, U.rgba('#bfe6ff', 0.85)); U.fillRR(ctx, x + 1, y - 84, 23, 84, 4, U.rgba('#bfe6ff', 0.85)); }
    U.circ(ctx, x + 16, y - 44, 3.5, '#ffcf3c');
    // מחצלת
    U.fillRR(ctx, x - 40, y - 4, 80, 12, 5, U.shade(c, -0.4));
    // שלט
    const sw = Math.max(170, w * 0.55), sy = y - h + (k === 'cafe' ? 2 : 30);
    if (k === 'cinema') {
      U.fillRR(ctx, x - sw / 2 - 10, sy - 6, sw + 20, 54, 10, '#2b1d3a');
      for (let i = 0; i < 18; i++) U.circ(ctx, x - sw / 2 - 4 + i * (sw + 8) / 17, sy - 2, 3, (Math.floor(t * 4) + i) % 2 ? '#ffde59' : '#ff9a3d');
      for (let i = 0; i < 18; i++) U.circ(ctx, x - sw / 2 - 4 + i * (sw + 8) / 17, sy + 44, 3, (Math.floor(t * 4) + i + 1) % 2 ? '#ffde59' : '#ff9a3d');
      txt(ctx, o.sign, x, sy + 21, 24, '#ffde59', 700);
    } else if (k === 'arcade') {
      ctx.save(); ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 18 + Math.sin(t * 5) * 6;
      U.fillRR(ctx, x - sw / 2, sy, sw, 44, 22, '#1d1240', '#00e5ff', 3); ctx.restore();
      ctx.save(); ctx.shadowColor = '#ff3df0'; ctx.shadowBlur = 12; txt(ctx, o.sign, x, sy + 23, 24, '#ffffff', 700); ctx.restore();
    } else {
      U.fillRR(ctx, x - sw / 2, sy, sw, 44, 14, '#ffffff', U.shade(c, -0.3), 3);
      txt(ctx, o.sign, x, sy + 23, 22, U.shade(c, -0.45), 700);
    }
    if (o.icon) { ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.icon, x - sw / 2 - 2, sy + 22); ctx.fillText(o.icon, x + sw / 2 + 2, sy + 22); }
    // עציצים ליד הדלת
    [-1, 1].forEach(s => { U.fillRR(ctx, x + s * 52 - 12, y - 26, 24, 26, 5, '#e07a4f'); U.circ(ctx, x + s * 52, y - 34, 15, '#3cc06a'); U.circ(ctx, x + s * 52 - 5, y - 40, 5, '#ff7eb6'); });
  };
  S.house = (ctx, o, t, night) => {
    const lvl = o.lvl || 0, w = 170 + lvl * 34, h = 150 + lvl * 26, x = o.x, y = o.y, c = o.c || '#ffd6a5', roof = o.roof || '#e85d6c';
    U.shadow(ctx, x, y + 2, w * 0.58, 16);
    U.fillRR(ctx, x - w / 2, y - h, w, h, 6, c);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 18, y - h + 6); ctx.lineTo(x, y - h - 70 - lvl * 8); ctx.lineTo(x + w / 2 + 18, y - h + 6); ctx.closePath(); ctx.fillStyle = roof; ctx.fill();
    ctx.strokeStyle = U.shade(roof, -0.2); ctx.lineWidth = 3; ctx.stroke();
    if (lvl >= 2) { U.fillRR(ctx, x + w / 4, y - h - 60, 20, 40, 3, '#b5654a'); }
    const win = night ? '#ffe9a8' : '#bfe6ff';
    [-1, 1].forEach(s => { U.fillRR(ctx, x + s * (w / 4 + 6) - 20, y - h + 34, 40, 38, 5, win, '#ffffff', 4); ctx.fillStyle = '#ffffff'; ctx.fillRect(x + s * (w / 4 + 6) - 2, y - h + 34, 4, 38); U.fillRR(ctx, x + s * (w / 4 + 6) - 24, y - h + 72, 48, 8, 3, '#3cc06a'); });
    if (lvl >= 1) U.circ(ctx, x, y - h - 18, 14, win, '#ffffff', 4);
    U.fillRR(ctx, x - 22, y - 70, 44, 70, 18, o.door || '#7a4a2c'); U.circ(ctx, x + 12, y - 34, 3, '#ffcf3c');
    U.fillRR(ctx, x - 30, y - 4, 60, 10, 4, '#cfc8e2');
    // שלט שם
    const label = o.label || o.owner;
    ctx.font = '700 14px Fredoka, Rubik'; const tw = ctx.measureText(label).width + 26;
    U.fillRR(ctx, x - tw / 2, y - h - 18 - (lvl >= 1 ? 26 : 0) - 10, tw, 26, 13, o.mine ? '#ffde59' : '#ffffff', U.shade(roof, -0.1), 2);
    txt(ctx, label, x, y - h - 15 - (lvl >= 1 ? 26 : 0), 14, '#3a2d55');
    // תיבת דואר
    U.fillRR(ctx, x + w / 2 + 14, y - 46, 6, 46, 2, '#7a4a2c'); U.fillRR(ctx, x + w / 2 + 4, y - 62, 26, 18, 8, o.mine ? '#3a7bff' : '#ff5d6c');
    if (o.mine && Math.sin(t * 3) > 0) U.fillRR(ctx, x + w / 2 + 26, y - 74, 4, 14, 1, '#ffde59');
  };
  S.fence = (ctx, o) => {
    const n = Math.floor(o.w / 22);
    for (let i = 0; i <= n; i++) U.fillRR(ctx, o.x - o.w / 2 + i * 22 - 4, o.y - 34, 9, 34, 4, '#ffffff', '#d8d3e6', 1);
    ctx.fillStyle = '#f2eff9'; ctx.fillRect(o.x - o.w / 2, o.y - 26, o.w, 5); ctx.fillRect(o.x - o.w / 2, o.y - 14, o.w, 5);
  };

  // ---------- חוף ----------
  S.umbrella = (ctx, o, t) => {
    const c = o.c || '#ff5d6c';
    U.ell(ctx, o.x + 20, o.y + 2, 54, 16, 'rgba(60,40,20,0.18)');
    ctx.fillStyle = '#f2efe9'; ctx.fillRect(o.x - 2, o.y - 96, 4, 96);
    ctx.beginPath(); ctx.moveTo(o.x - 62, o.y - 82); ctx.quadraticCurveTo(o.x, o.y - 140, o.x + 62, o.y - 82); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(o.x - 62 + i * 41 + 14, o.y - 82); ctx.quadraticCurveTo(o.x - 41 + i * 41 + 14, o.y - 130 + Math.abs(i - 1) * 12, o.x - 62 + i * 41 + 28, o.y - 82); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill(); }
  };
  S.towel = (ctx, o) => { ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.r || 0); U.fillRR(ctx, -26, -50, 52, 90, 6, o.c || '#3cc9ff'); ctx.fillStyle = U.rgba('#ffffff', 0.7); for (let i = 0; i < 4; i++) ctx.fillRect(-26, -40 + i * 22, 52, 7); ctx.restore(); };
  S.sandcastle = (ctx, o) => {
    U.shadow(ctx, o.x, o.y, 40, 9); const sc = '#f0cf8a', dk = '#d9b46c';
    U.fillRR(ctx, o.x - 38, o.y - 30, 76, 30, 4, sc); U.fillRR(ctx, o.x - 18, o.y - 62, 36, 34, 3, sc);
    [-38, -18, 2, 22].forEach(dx => U.fillRR(ctx, o.x + dx, o.y - 36, 14, 8, 2, sc));
    [-30, 22].forEach(dx => U.fillRR(ctx, o.x + dx, o.y - 50, 14, 22, 2, dk));
    U.fillRR(ctx, o.x - 7, o.y - 18, 14, 18, 7, dk);
    ctx.fillStyle = '#7a4a2c'; ctx.fillRect(o.x - 1, o.y - 88, 2, 28); ctx.fillStyle = '#ff5d6c'; ctx.beginPath(); ctx.moveTo(o.x + 1, o.y - 88); ctx.lineTo(o.x + 18, o.y - 81); ctx.lineTo(o.x + 1, o.y - 74); ctx.fill();
  };
  S.beachball = (ctx, o, t) => { const b = Math.abs(Math.sin(t * 2 + o.x)) * 6; U.shadow(ctx, o.x, o.y, 13, 4); const cols = ['#ff5d6c', '#ffffff', '#3a7bff', '#ffde59', '#ffffff', '#3cc98a']; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(o.x, o.y - 14 - b); ctx.arc(o.x, o.y - 14 - b, 14, i * Math.PI / 3 + t, (i + 1) * Math.PI / 3 + t); ctx.fillStyle = cols[i]; ctx.fill(); } };
  S.lifeguard = (ctx, o) => {
    U.shadow(ctx, o.x, o.y, 40, 9); ctx.strokeStyle = '#f2efe9'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(o.x - 32, o.y); ctx.lineTo(o.x - 22, o.y - 80); ctx.moveTo(o.x + 32, o.y); ctx.lineTo(o.x + 22, o.y - 80); ctx.moveTo(o.x - 28, o.y - 40); ctx.lineTo(o.x + 28, o.y - 40); ctx.stroke();
    U.fillRR(ctx, o.x - 34, o.y - 100, 68, 24, 5, '#ff5d6c'); U.fillRR(ctx, o.x - 40, o.y - 136, 80, 12, 5, '#ffffff'); ctx.fillStyle = '#ffffff'; ctx.fillRect(o.x - 34, o.y - 126, 4, 28); ctx.fillRect(o.x + 30, o.y - 126, 4, 28);
    txt(ctx, '🛟', o.x, o.y - 88, 16, '#fff');
  };
  S.shell = (ctx, o, t) => {
    if (o.gone) return;
    const c = o.c || '#ffb3cf', sh = Math.sin(t * 4 + o.x) > 0.85;
    U.shadow(ctx, o.x, o.y, 9, 3);
    ctx.save(); ctx.translate(o.x, o.y - 6);
    ctx.beginPath(); ctx.moveTo(0, 6); for (let i = 0; i <= 6; i++) { const a = Math.PI + i * Math.PI / 6; ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 9); } ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    ctx.strokeStyle = U.shade(c, -0.25); ctx.lineWidth = 1; for (let i = 1; i < 6; i++) { const a = Math.PI + i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 8); ctx.stroke(); }
    ctx.restore();
    if (sh) U.star(ctx, o.x + 8, o.y - 16, 5, 1.8, 4, '#ffffff');
  };
  S.cart = (ctx, o, t) => { // עגלת גלידה / פופקורן
    const c = o.c || '#ff7eb6';
    U.shadow(ctx, o.x, o.y, 50, 10);
    U.fillRR(ctx, o.x - 44, o.y - 56, 88, 46, 8, '#ffffff', c, 3); txt(ctx, o.emoji || '🍦', o.x, o.y - 34, 24, '#000');
    U.circ(ctx, o.x - 28, o.y - 8, 9, '#4b4b5c'); U.circ(ctx, o.x + 28, o.y - 8, 9, '#4b4b5c'); U.circ(ctx, o.x - 28, o.y - 8, 3, '#ccc'); U.circ(ctx, o.x + 28, o.y - 8, 3, '#ccc');
    ctx.fillStyle = '#d9d3ea'; ctx.fillRect(o.x - 40, o.y - 104, 4, 50); ctx.fillRect(o.x + 36, o.y - 104, 4, 50);
    ctx.beginPath(); ctx.moveTo(o.x - 54, o.y - 98); ctx.quadraticCurveTo(o.x, o.y - 132, o.x + 54, o.y - 98); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? c : '#ffffff'; ctx.beginPath(); ctx.arc(o.x - 44 + i * 22, o.y - 98, 11, 0, Math.PI); ctx.fill(); }
  };

  // ---------- פנים ----------
  S.cafeTable = (ctx, o) => {
    U.shadow(ctx, o.x, o.y, 44, 10);
    [-1, 1].forEach(s => { U.fillRR(ctx, o.x + s * 42 - 12, o.y - 40, 24, 22, 6, '#c0392b'); U.fillRR(ctx, o.x + s * 42 - 13, o.y - 22, 26, 8, 4, '#e85d6c'); ctx.fillStyle = '#5a3d27'; ctx.fillRect(o.x + s * 42 - 10, o.y - 14, 3, 14); ctx.fillRect(o.x + s * 42 + 7, o.y - 14, 3, 14); });
    ctx.fillStyle = '#5a3d27'; ctx.fillRect(o.x - 3, o.y - 34, 6, 34); U.ell(ctx, o.x, o.y - 36, 26, 10, '#7a4a2c'); U.ell(ctx, o.x, o.y - 38, 26, 10, '#a8703d');
    U.fillRR(ctx, o.x - 6, o.y - 50, 10, 11, 3, '#ffffff'); U.ell(ctx, o.x - 1, o.y - 50, 5, 2, '#6e4529');
    U.circ(ctx, o.x + 12, o.y - 42, 5, '#ffd6e8');
  };
  S.counter = (ctx, o, t) => {
    const w = o.w || 300;
    U.shadow(ctx, o.x, o.y, w * 0.55, 10);
    U.fillRR(ctx, o.x - w / 2, o.y - 56, w, 56, 8, o.c || '#a8703d'); U.fillRR(ctx, o.x - w / 2 - 6, o.y - 62, w + 12, 12, 5, o.top || '#f2efe9');
    for (let i = 0; i < Math.floor(w / 60); i++) U.fillRR(ctx, o.x - w / 2 + 14 + i * 60, o.y - 44, 44, 34, 5, U.shade(o.c || '#a8703d', -0.1));
    if (o.items) o.items.forEach((e, i) => txt(ctx, e, o.x - w / 2 + 40 + i * ((w - 60) / (o.items.length - 1 || 1)), o.y - 76, 24, '#000'));
    if (o.machine) { U.fillRR(ctx, o.x + w / 2 - 70, o.y - 118, 50, 56, 6, '#4b4b5c'); U.fillRR(ctx, o.x + w / 2 - 64, o.y - 110, 38, 18, 3, '#d9d3ea'); for (let i = 0; i < 3; i++) U.circ(ctx, o.x + w / 2 - 50 + Math.sin(t * 2 + i) * 4, o.y - 126 - ((t * 20 + i * 8) % 24), 3, U.rgba('#ffffff', 0.5)); }
  };
  S.menuBoard = (ctx, o) => {
    U.fillRR(ctx, o.x - 70, o.y - 150, 140, 100, 8, '#2f3a33', '#a8703d', 5);
    txt(ctx, 'תפריט', o.x, o.y - 134, 16, '#ffde59'); ['☕ קפה ...... 15', '🍫 שוקו ...... 12', '🍰 עוגה ...... 20'].forEach((l, i) => txt(ctx, l, o.x, o.y - 110 + i * 20, 12, '#ffffff', 500));
  };
  S.arcadeMachine = (ctx, o, t) => {
    const c = o.c || '#7c5cff', x = o.x, y = o.y;
    U.shadow(ctx, x, y, 40, 9);
    ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 16 + Math.sin(t * 4 + x) * 6;
    U.fillRR(ctx, x - 34, y - 140, 68, 140, 8, U.shade(c, -0.35)); ctx.restore();
    U.fillRR(ctx, x - 34, y - 140, 68, 26, 8, c); txt(ctx, o.name, x, y - 127, 12, '#ffffff', 700);
    U.fillRR(ctx, x - 27, y - 108, 54, 46, 5, '#0b0b18');
    txt(ctx, o.emoji, x, y - 86 + Math.sin(t * 3 + x) * 3, 26, '#fff');
    U.fillRR(ctx, x - 32, y - 58, 64, 18, 4, U.shade(c, -0.15)); U.circ(ctx, x - 14, y - 49, 5, '#ff4d7a'); U.circ(ctx, x + 4, y - 49, 4, '#ffde59'); U.circ(ctx, x + 17, y - 49, 4, '#5fe0b7');
    U.fillRR(ctx, x - 10, y - 30, 20, 5, 2, '#000');
  };
  S.seat = (ctx, o) => {
    const c = o.c || '#c0392b';
    U.fillRR(ctx, o.x - 20, o.y - 44, 40, 34, 8, U.shade(c, -0.15)); U.fillRR(ctx, o.x - 21, o.y - 16, 42, 14, 6, c);
    U.fillRR(ctx, o.x - 24, o.y - 30, 6, 28, 3, '#3a2d40'); U.fillRR(ctx, o.x + 18, o.y - 30, 6, 28, 3, '#3a2d40');
  };
  S.kioskBack = (ctx, o, t) => {
    const c = o.c, x = o.x, y = o.y;
    U.fillRR(ctx, x - 100, y - 170, 200, 110, 8, U.shade(c, 0.75), U.shade(c, 0.4), 3);
    (o.items || []).forEach((id, i) => { const im = G.Scn.img(id); if (im) ctx.drawImage(im, x - 94 + (i % 4) * 48, y - 166 + Math.floor(i / 4) * 52, 44, 44); });
    ctx.fillStyle = U.shade(c, 0.3); ctx.fillRect(x - 104, y - 176, 8, 120); ctx.fillRect(x + 96, y - 176, 8, 120);
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#ffffff' : c; ctx.beginPath(); const sx = x - 120 + i * 30; ctx.moveTo(sx, y - 196); ctx.lineTo(sx + 30, y - 196); ctx.lineTo(sx + 30, y - 176); ctx.quadraticCurveTo(sx + 15, y - 166, sx, y - 176); ctx.fill(); }
    U.fillRR(ctx, x - 90, y - 226, 180, 34, 12, '#ffffff', c, 3); txt(ctx, o.icon + ' ' + o.name, x, y - 209, 16, U.shade(c, -0.4));
  };
  S.kiosk = (ctx, o, t) => {
    const c = o.c, x = o.x, y = o.y;
    U.shadow(ctx, x, y, 110, 14);
    U.fillRR(ctx, x - 110, y - 52, 220, 52, 8, '#ffffff', U.shade(c, -0.1), 3); U.fillRR(ctx, x - 116, y - 58, 232, 12, 5, c);
    for (let i = 0; i < 5; i++) U.circ(ctx, x - 80 + i * 40, y - 26, 6, U.rgba(c, 0.5));
  };
  S.screen = (ctx, o, t) => { // מסך קולנוע
    const { x, y, w, h } = o;
    U.fillRR(ctx, x - w / 2 - 20, y - h - 20, w + 40, h + 40, 8, '#2b1d2a');
    ctx.save(); U.rr(ctx, x - w / 2, y - h, w, h, 4); ctx.clip();
    const sc = Math.floor(t / 7) % 3, lt = t % 7;
    const sky = ctx.createLinearGradient(0, y - h, 0, y); sky.addColorStop(0, ['#7fd3ff', '#ffb38a', '#1d1d4a'][sc]); sky.addColorStop(1, ['#d4f1ff', '#ffe0b0', '#523a8a'][sc]); ctx.fillStyle = sky; ctx.fillRect(x - w / 2, y - h, w, h);
    if (sc === 2) for (let i = 0; i < 20; i++) U.circ(ctx, x - w / 2 + (i * 97) % w, y - h + (i * 53) % (h * 0.6), 1.5, '#fff');
    else U.circ(ctx, x + w * 0.3, y - h * 0.7, 26, sc ? '#ff7a59' : '#ffe066');
    U.ell(ctx, x - w * 0.25, y, w * 0.4, h * 0.35, ['#4cc06a', '#d98a4d', '#2a2a5a'][sc]); U.ell(ctx, x + w * 0.3, y + 10, w * 0.45, h * 0.3, ['#3aa85a', '#c27740', '#232350'][sc]);
    // גיבור הסרט
    const hx = x - w / 2 + ((lt / 7) * (w + 80)) - 40, hy = y - h * 0.32 - Math.abs(Math.sin(t * 5)) * 22;
    if (sc === 1) { U.ell(ctx, hx, hy, 22, 14, '#ff7eb6'); U.circ(ctx, hx + 18, hy - 8, 10, '#ff7eb6'); U.circ(ctx, hx + 21, hy - 10, 2.5, '#000'); [-1, 1].forEach(k => U.ell(ctx, hx - 4, hy - 14 + k * 4, 14, 6, U.rgba('#ffffff', 0.8))); }
    else { U.circ(ctx, hx, hy, 18, sc === 2 ? '#c9b0ff' : '#ffb35c'); U.circ(ctx, hx + 6, hy - 4, 3, '#000'); U.circ(ctx, hx - 6, hy - 4, 3, '#000'); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx, hy + 3, 6, 0.2, Math.PI - 0.2); ctx.stroke(); }
    if (lt < 2) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(x - w / 2, y - h, w, h); txt(ctx, '🎬 ' + G.DATA.MOVIES[Math.floor(t / 21) % G.DATA.MOVIES.length], x, y - h / 2, 30, '#ffffff', 700, '#000'); }
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y, 0, y + 260); g.addColorStop(0, 'rgba(160,190,255,0.12)'); g.addColorStop(1, 'rgba(160,190,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w / 2 + 100, y + 260); ctx.lineTo(x - w / 2 - 100, y + 260); ctx.fill(); ctx.restore();
    // וילונות
    [-1, 1].forEach(s => { for (let i = 0; i < 4; i++) U.fillRR(ctx, x + s * (w / 2 + 16) - 14 + s * i * 9, y - h - 30, 22, h + 60, 10, i % 2 ? '#b0213a' : '#d42f4f'); });
  };
  S.stage = (ctx, o, t) => {
    const { x, y, w } = o;
    U.fillRR(ctx, x - w / 2, y - 60, w, 60, 6, '#2b1d3a'); U.fillRR(ctx, x - w / 2 - 6, y - 66, w + 12, 12, 4, '#4a3570');
    for (let i = 0; i < 10; i++) U.circ(ctx, x - w / 2 + 20 + i * (w - 40) / 9, y - 30, 4, `hsl(${(i * 36 + t * 200) % 360},90%,65%)`);
    // רקע במה
    U.fillRR(ctx, x - w / 2 + 20, y - 260, w - 40, 196, 10, '#1d1240', '#7c5cff', 4);
    for (let i = 0; i < 12; i++) { const h = Math.abs(Math.sin(t * 4 + i * 0.7)) * 120 + 10; ctx.fillStyle = `hsla(${(i * 30 + t * 60) % 360},90%,62%,0.85)`; U.fillRR(ctx, x - w / 2 + 50 + i * (w - 100) / 12, y - 80 - h, (w - 100) / 12 - 8, h, 4, ctx.fillStyle); }
    ctx.save(); ctx.shadowColor = '#ff3df0'; ctx.shadowBlur = 14; txt(ctx, '🎉 מסיבת פופי 🎉', x, y - 230, 28, '#ffffff', 700); ctx.restore();
  };
  S.speaker = (ctx, o, t) => { const p = 1 + Math.abs(Math.sin(t * 8.27)) * 0.08; U.shadow(ctx, o.x, o.y, 32, 8); U.fillRR(ctx, o.x - 28, o.y - 110, 56, 110, 6, '#20202c'); U.circ(ctx, o.x, o.y - 76, 18 * p, '#3a3d55'); U.circ(ctx, o.x, o.y - 76, 8 * p, '#15151f'); U.circ(ctx, o.x, o.y - 30, 14 * p, '#3a3d55'); U.circ(ctx, o.x, o.y - 30, 6, '#15151f'); };
  S.djBooth = (ctx, o, t) => {
    U.shadow(ctx, o.x, o.y, 70, 10); U.fillRR(ctx, o.x - 66, o.y - 60, 132, 60, 8, '#2b2d3a', '#ff3df0', 3);
    [-1, 1].forEach(s => { U.circ(ctx, o.x + s * 34, o.y - 64, 18, '#15151f'); ctx.save(); ctx.translate(o.x + s * 34, o.y - 64); ctx.rotate(t * 4 * s); ctx.fillStyle = '#ff3df0'; ctx.fillRect(-1, -16, 2, 10); ctx.restore(); });
    txt(ctx, 'DJ', o.x, o.y - 30, 18, '#00e5ff', 700);
  };
  S.chest = (ctx, o, t) => {
    const open = o.opened, x = o.x, y = o.y;
    U.shadow(ctx, x, y, 34, 8);
    if (!open) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y - 30, 4, x, y - 30, 70); g.addColorStop(0, 'rgba(255,220,90,' + (0.35 + Math.sin(t * 3) * 0.12) + ')'); g.addColorStop(1, 'rgba(255,220,90,0)'); U.circ(ctx, x, y - 30, 70, g); ctx.restore(); }
    U.fillRR(ctx, x - 32, y - 38, 64, 38, 5, '#a8703d', '#6e4529', 3);
    if (open) { U.fillRR(ctx, x - 32, y - 66, 64, 18, 6, '#8a5a36', '#6e4529', 3); U.ell(ctx, x, y - 38, 26, 6, '#ffde59'); }
    else { ctx.beginPath(); ctx.moveTo(x - 32, y - 38); ctx.quadraticCurveTo(x, y - 66, x + 32, y - 38); ctx.closePath(); ctx.fillStyle = '#8a5a36'; ctx.fill(); ctx.strokeStyle = '#6e4529'; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.fillStyle = '#ffcf3c'; ctx.fillRect(x - 32, y - 26, 64, 6); U.fillRR(ctx, x - 7, y - 34, 14, 16, 3, '#ffcf3c');
    if (!open && Math.sin(t * 4) > 0.5) U.star(ctx, x + 26, y - 56, 6, 2, 4, '#ffffff');
  };
  S.duck = (ctx, o, t) => {
    const dx = Math.sin(t * 0.4 + o.ph) * o.rx, dy = Math.cos(t * 0.3 + o.ph) * o.ry, dir = Math.cos(t * 0.4 + o.ph) > 0 ? 1 : -1;
    const x = o.x + dx, y = o.y + dy;
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    U.ell(ctx, 0, 0, 18, 5, 'rgba(255,255,255,0.35)');
    U.ell(ctx, 0, -6, 14, 9, o.c || '#ffffff'); U.circ(ctx, 10, -16, 7, o.c || '#ffffff'); U.ell(ctx, 18, -15, 5, 2.5, '#ff9a3d'); U.circ(ctx, 12, -18, 1.6, '#000');
    U.ell(ctx, -3, -8, 7, 4, U.shade(o.c || '#ffffff', -0.08));
    ctx.restore();
  };
  S.balloons = (ctx, o, t) => {
    const cols = ['#ff5d6c', '#ffde59', '#3cc9ff', '#9b6bff', '#5fe0b7'];
    for (let i = 0; i < 5; i++) { const bx = o.x + (i - 2) * 10 + Math.sin(t * 1.5 + i) * 4, by = o.y - 110 - (i % 2) * 18 + Math.sin(t * 2 + i) * 3; ctx.strokeStyle = 'rgba(80,80,80,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(o.x, o.y - 4); ctx.lineTo(bx, by + 16); ctx.stroke(); U.ell(ctx, bx, by, 13, 16, cols[i]); U.ell(ctx, bx - 4, by - 6, 3, 5, U.rgba('#ffffff', 0.55)); }
    U.fillRR(ctx, o.x - 8, o.y - 8, 16, 8, 3, '#7a4a2c');
  };
  S.planter = (ctx, o) => { U.shadow(ctx, o.x, o.y, 28, 7); U.fillRR(ctx, o.x - 24, o.y - 26, 48, 26, 6, o.c || '#e07a4f'); U.circ(ctx, o.x - 10, o.y - 34, 13, '#3cc06a'); U.circ(ctx, o.x + 10, o.y - 34, 13, '#34b062'); U.circ(ctx, o.x, o.y - 44, 13, '#45cf73'); [-10, 6, 0].forEach((d, i) => U.circ(ctx, o.x + d, o.y - 38 - i * 4, 4, ['#ff7eb6', '#ffde59', '#ffffff'][i])); };
  S.poster = (ctx, o) => { U.fillRR(ctx, o.x - 40, o.y - 56, 80, 112, 4, '#ffffff', '#3a2d40', 4); U.fillRR(ctx, o.x - 34, o.y - 50, 68, 70, 2, o.c || '#ff7eb6'); txt(ctx, o.emoji || '⭐', o.x, o.y - 16, 30, '#000'); txt(ctx, o.text || '', o.x, o.y + 36, 11, '#3a2d40', 700); };
  S.fridge = (ctx, o, t) => { U.shadow(ctx, o.x, o.y, 36, 8); U.fillRR(ctx, o.x - 32, o.y - 116, 64, 116, 8, '#e8f6ff', '#9fc4dd', 2); U.fillRR(ctx, o.x - 26, o.y - 108, 52, 70, 4, U.rgba('#bfe6ff', 0.8)); ['🥤', '🧃', '🍩'].forEach((e, i) => txt(ctx, e, o.x - 14 + i * 14, o.y - 90 + (i % 2) * 22, 14, '#000')); };

  // ---------- סדר ציור וקופסאות התנגשות ----------
  S.box = (o) => {
    switch (o.t) {
      case 'tree': return [o.x - 14 * (o.s || 1), o.y - 12, o.x + 14 * (o.s || 1), o.y + 4];
      case 'pine': return [o.x - 12, o.y - 10, o.x + 12, o.y + 4];
      case 'palm': return [o.x - 10, o.y - 8, o.x + 10, o.y + 4];
      case 'bush': return [o.x - 28 * (o.s || 1), o.y - 14, o.x + 28 * (o.s || 1), o.y + 2];
      case 'rock': return [o.x - 20, o.y - 12, o.x + 20, o.y + 2];
      case 'bench': return [o.x - 42, o.y - 22, o.x + 42, o.y + 2];
      case 'lamp': return [o.x - 8, o.y - 8, o.x + 8, o.y + 2];
      case 'fountain': return [o.x - 124, o.y - 56, o.x + 124, o.y + 18];
      case 'sign': return [o.x - 6, o.y - 6, o.x + 6, o.y + 2];
      case 'building': return [o.x - o.w / 2, o.y - 60, o.x + o.w / 2, o.y - 6];
      case 'house': { const w = 170 + (o.lvl || 0) * 34; return [o.x - w / 2, o.y - 60, o.x + w / 2 + 30, o.y - 6]; }
      case 'fence': return [o.x - o.w / 2, o.y - 10, o.x + o.w / 2, o.y + 2];
      case 'umbrella': return [o.x - 6, o.y - 6, o.x + 6, o.y + 4];
      case 'sandcastle': return [o.x - 38, o.y - 18, o.x + 38, o.y + 2];
      case 'lifeguard': return [o.x - 36, o.y - 14, o.x + 36, o.y + 2];
      case 'cart': return [o.x - 50, o.y - 22, o.x + 50, o.y + 2];
      case 'cafeTable': return [o.x - 56, o.y - 22, o.x + 56, o.y + 2];
      case 'counter': return [o.x - (o.w || 300) / 2, o.y - 40, o.x + (o.w || 300) / 2, o.y + 2];
      case 'arcadeMachine': return [o.x - 34, o.y - 26, o.x + 34, o.y + 2];
      case 'kiosk': return [o.x - 112, o.y - 60, o.x + 112, o.y + 2];
      case 'stage': return [o.x - o.w / 2, o.y - 66, o.x + o.w / 2, o.y + 2];
      case 'speaker': return [o.x - 28, o.y - 20, o.x + 28, o.y + 2];
      case 'djBooth': return [o.x - 66, o.y - 30, o.x + 66, o.y + 2];
      case 'chest': return [o.x - 32, o.y - 20, o.x + 32, o.y + 2];
      case 'planter': return [o.x - 24, o.y - 16, o.x + 24, o.y + 2];
      case 'fridge': return [o.x - 32, o.y - 20, o.x + 32, o.y + 2];
    }
    return null;
  };
  S.flat = { flowers: 1, towel: 1, poster: 1 };

  // תמונות אייקונים לשימוש בקנבס
  const imgCache = {};
  S.img = (id) => {
    if (imgCache[id]) return imgCache[id].complete ? imgCache[id] : null;
    const im = new Image(); im.src = G.Avatar.icon(id, 96); imgCache[id] = im; return null;
  };
  return S;
})();
