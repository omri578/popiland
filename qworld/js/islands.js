// ===== קיו וורלד – איי איקיו (אי לכל כיתה) =====
G.Isl = (() => {
  const U = G.U, S = G.Scn;
  const LETTERS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
  const I = { LETTERS };

  // ---------- עצים מיוחדים ----------
  const pickC = (o, arr) => arr[Math.floor(Math.abs(o.x * 7 + o.y * 3)) % arr.length];
  S.t_lollipop = (ctx, o, t) => {
    const s = o.s || 1, c = pickC(o, I.T.treeColors), sw = Math.sin(t * 1.5 + o.x) * 0.04;
    U.shadow(ctx, o.x, o.y, 22 * s, 7 * s);
    U.fillRR(ctx, o.x - 4 * s, o.y - 70 * s, 8 * s, 70 * s, 4, '#ffffff', '#e8dff0', 1);
    ctx.save(); ctx.translate(o.x, o.y - 96 * s); ctx.rotate(sw + t * 0.3);
    U.circ(ctx, 0, 0, 34 * s, c);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 6 * s;
    ctx.beginPath(); for (let a = 0; a < 12; a += 0.2) { const r = a * 2.6 * s; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.stroke();
    ctx.restore(); U.ell(ctx, o.x - 12 * s, o.y - 110 * s, 8 * s, 5 * s, 'rgba(255,255,255,0.6)');
  };
  S.t_jungle = (ctx, o, t) => {
    const s = (o.s || 1) * 1.1, c = pickC(o, I.T.treeColors);
    U.shadow(ctx, o.x, o.y, 40 * s, 12 * s);
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 14 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.quadraticCurveTo(o.x - 10 * s, o.y - 50 * s, o.x + 4 * s, o.y - 96 * s); ctx.stroke();
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42 + Math.sin(t + i) * 0.04; ctx.save(); ctx.translate(o.x + 4 * s, o.y - 96 * s); ctx.rotate(a + Math.PI / 2); U.ell(ctx, 0, -32 * s, 15 * s, 36 * s, i % 2 ? c : U.shade(c, -0.15)); ctx.strokeStyle = U.shade(c, -0.3); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -64 * s); ctx.stroke(); ctx.restore(); }
    ctx.strokeStyle = '#3a9e4f'; ctx.lineWidth = 2.5; for (let k = -1; k <= 1; k += 2) { ctx.beginPath(); ctx.moveTo(o.x + k * 20 * s, o.y - 90 * s); ctx.quadraticCurveTo(o.x + k * 26 * s, o.y - 50 * s, o.x + k * 18 * s + Math.sin(t + k) * 3, o.y - 30 * s); ctx.stroke(); U.circ(ctx, o.x + k * 18 * s, o.y - 30 * s, 4, '#ff7eb6'); }
  };
  S.t_crystal = (ctx, o, t) => {
    const s = o.s || 1, c = pickC(o, I.T.treeColors), glow = 0.5 + Math.sin(t * 2 + o.x) * 0.2;
    U.shadow(ctx, o.x, o.y, 30 * s, 9 * s);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(o.x, o.y - 60 * s, 4, o.x, o.y - 60 * s, 80 * s); g.addColorStop(0, U.rgba(c, 0.35 * glow)); g.addColorStop(1, U.rgba(c, 0)); U.circ(ctx, o.x, o.y - 60 * s, 80 * s, g); ctx.restore();
    [[-16, 70, -0.25], [14, 60, 0.3], [0, 100, 0], [-28, 40, -0.5], [26, 38, 0.5]].forEach(([dx, h, r], i) => {
      ctx.save(); ctx.translate(o.x + dx * s, o.y); ctx.rotate(r);
      ctx.beginPath(); ctx.moveTo(-9 * s, 0); ctx.lineTo(-9 * s, -h * s * 0.8); ctx.lineTo(0, -h * s); ctx.lineTo(9 * s, -h * s * 0.8); ctx.lineTo(9 * s, 0); ctx.closePath();
      ctx.fillStyle = U.rgba(i % 2 ? U.shade(c, 0.2) : c, 0.9); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-6 * s, -h * s * 0.75, 3 * s, h * s * 0.6); ctx.restore();
    });
    if (Math.sin(t * 3 + o.y) > 0.7) U.star(ctx, o.x + 18 * s, o.y - 96 * s, 6, 2, 4, '#ffffff');
  };
  S.t_coral = (ctx, o, t) => {
    const s = o.s || 1, c = pickC(o, I.T.treeColors);
    U.shadow(ctx, o.x, o.y, 30 * s, 8 * s);
    ctx.strokeStyle = c; ctx.lineCap = 'round';
    const br = (x, y, a, len, w, d) => { if (d > 4) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); U.circ(ctx, x2, y2, w * 0.55, U.shade(c, 0.2)); br(x2, y2, a - 0.45 + Math.sin(t + d) * 0.03, len * 0.72, w * 0.72, d + 1); br(x2, y2, a + 0.5, len * 0.7, w * 0.7, d + 1); };
    br(o.x, o.y, -Math.PI / 2, 40 * s, 12 * s, 0);
    for (let i = 0; i < 3; i++) U.circ(ctx, o.x + Math.sin(t * 2 + i * 2) * 20, o.y - 120 - ((t * 30 + i * 40) % 120), 3, 'rgba(255,255,255,0.6)');
  };
  S.t_neon = (ctx, o, t) => {
    const s = o.s || 1, c = pickC(o, I.T.treeColors), p = 0.6 + Math.sin(t * 3 + o.x) * 0.25;
    U.shadow(ctx, o.x, o.y, 26 * s, 8 * s, 0.4);
    ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 18;
    ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x, o.y - 60 * s); ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.globalAlpha = p; ctx.beginPath(); ctx.moveTo(o.x - (34 - i * 7) * s, o.y - (50 + i * 22) * s); ctx.lineTo(o.x, o.y - (80 + i * 22) * s); ctx.lineTo(o.x + (34 - i * 7) * s, o.y - (50 + i * 22) * s); ctx.stroke(); }
    ctx.globalAlpha = 1; U.circ(ctx, o.x, o.y - 150 * s, 6, '#ffffff'); ctx.restore();
  };

  // ---------- עיטורי קרקע ----------
  const decor = {
    sprinkles(ctx, w, h, r) { for (let i = 0; i < w * h / 2500; i++) { ctx.save(); ctx.translate(r() * w, r() * h); ctx.rotate(r() * 3); ctx.fillStyle = ['#ff7eb6', '#7fd3ff', '#ffde59', '#c39bff', '#5fe0b7'][Math.floor(r() * 5)]; U.rr(ctx, -5, -1.5, 10, 3, 1.5); ctx.fill(); ctx.restore(); } },
    jungle(ctx, w, h, r) { for (let i = 0; i < w * h / 9000; i++) { const x = r() * w, y = r() * h; for (let k = 0; k < 5; k++) { ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2 + (k - 2) * 0.5); U.ell(ctx, 0, -9, 3, 9, 'rgba(30,110,40,0.35)'); ctx.restore(); } } },
    sand(ctx, w, h, r) { for (let i = 0; i < w * h / 60000; i++) U.ell(ctx, r() * w, r() * h, 60 + r() * 80, 26 + r() * 30, 'rgba(255,230,170,0.55)'); for (let i = 0; i < w * h / 25000; i++) U.star(ctx, r() * w, r() * h, 6, 3, 5, 'rgba(255,150,120,0.6)'); },
    space(ctx, w, h, r) { for (let i = 0; i < w * h / 40000; i++) { const x = r() * w, y = r() * h, rr = 12 + r() * 26; U.ell(ctx, x, y, rr, rr * 0.45, 'rgba(30,10,80,0.25)'); U.ell(ctx, x, y - 2, rr * 0.8, rr * 0.33, 'rgba(20,5,60,0.25)'); } for (let i = 0; i < w * h / 3000; i++) U.circ(ctx, r() * w, r() * h, 1.2 + r() * 1.5, ['rgba(127,232,255,0.7)', 'rgba(255,158,240,0.7)', 'rgba(255,255,255,0.6)'][Math.floor(r() * 3)]); },
    ocean(ctx, w, h, r) { for (let i = 0; i < w * h / 20000; i++) U.star(ctx, r() * w, r() * h, 7, 3.5, 5, 'rgba(255,140,120,0.55)'); for (let i = 0; i < w * h / 6000; i++) U.circ(ctx, r() * w, r() * h, 2 + r() * 3, null, 'rgba(255,255,255,0.4)', 1.5); },
    neon(ctx, w, h, r) { ctx.strokeStyle = 'rgba(0,229,255,0.16)'; ctx.lineWidth = 2; for (let x = 0; x < w; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y < h; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } for (let i = 0; i < w * h / 20000; i++) U.circ(ctx, Math.floor(r() * w / 80) * 80, Math.floor(r() * h / 80) * 80, 3, ['#ff3df0', '#00e5ff', '#ffde59'][Math.floor(r() * 3)]); },
  };

  // ---------- רשימת האיים ----------
  I.LIST = [
    { id: 'i1', grade: 1, sub: 'אי הממתקים', icon: '🍭', color: '#ff7eb6', blurb: 'סוכריות על מקל ענקיות, נהר שוקולד וקרוסלה קסומה!',
      theme: { grass: ['#c9f7e4', '#a6ebcf'], treeStyle: 'lollipop', treeColors: ['#ff7eb6', '#7fd3ff', '#ffde59', '#c39bff'], decor: 'sprinkles', sky: ['#ffd6ec', '#bdf0ff'] }, attr: 'candy' },
    { id: 'i2', grade: 2, sub: 'אי הג׳ונגל', icon: '🦕', color: '#2fbf71', blurb: 'עמק דינוזאורים אמיתי, הר געש מעשן וחפירת מאובנים!',
      theme: { grass: ['#74d66a', '#52bb52'], treeStyle: 'jungle', treeColors: ['#2e9e4f', '#3fbf5f', '#28a06a'], decor: 'jungle', sky: ['#bff5c9', '#7fe0b0'] }, attr: 'dino' },
    { id: 'i3', grade: 3, sub: 'אי הפיראטים', icon: '🏴‍☠️', color: '#ff9a3d', blurb: 'ספינת פיראטים שמפליגה באמת ואוצרות קבורים בחול!',
      theme: { grass: ['#b9ea8c', '#9ad874'], treeStyle: 'palm', treeColors: ['#3fcf7c'], decor: 'sand', sky: ['#ffe6b0', '#7fd3ff'] }, attr: 'pirate' },
    { id: 'i4', grade: 4, sub: 'אי החלל', icon: '🚀', color: '#7c5cff', blurb: 'שיגור טיל לחלל, עצי קריסטל זוהרים וכל כוכבי הלכת!',
      theme: { grass: ['#7062d8', '#4d3cab'], treeStyle: 'crystal', treeColors: ['#7fe8ff', '#c39bff', '#ff9ef0'], decor: 'space', night: true, tint: 'rgba(40,10,110,0.16)', sky: ['#1d1250', '#5b3fd1'] }, attr: 'space' },
    { id: 'i5', grade: 5, sub: 'אי האוקיינוס', icon: '🐬', color: '#00b8cc', blurb: 'עיר שלמה מתחת למים, צוללת אמיתית ותמנונים חכמים!',
      theme: { grass: ['#86e8d4', '#5ccfb9'], treeStyle: 'coral', treeColors: ['#ff8fa3', '#ffb36b', '#c39bff', '#ff7eb6'], decor: 'ocean', sky: ['#8fe3ff', '#1f8fd1'] }, attr: 'ocean' },
    { id: 'i6', grade: 6, sub: 'עיר העתיד', icon: '🎢', color: '#00c2d6', blurb: 'רכבת הרים ניאון, ריחוף על גלשני אוויר ומופע רחפנים!',
      theme: { grass: ['#211b45', '#140f30'], treeStyle: 'neon', treeColors: ['#00e5ff', '#ff3df0', '#ffde59', '#5fe0b7'], decor: 'neon', night: true, sky: ['#0b0820', '#3a1d8a'] }, attr: 'future' },
  ];
  I.LIST.forEach((x, i) => { x.name = 'איקיו ' + LETTERS[i] + '׳'; x.letter = LETTERS[i]; });
  I.gradeName = g => 'כיתה ' + LETTERS[g - 1] + '׳';
  I.get = id => I.LIST.find(x => x.id === id) || I.LIST[0];
  I.cur = I.LIST[0]; I.T = I.cur.theme;
  I.set = function (id) {
    I.cur = I.get(id); I.T = I.cur.theme;
    G.Zones.attr = I.ATTR[I.cur.attr]();
    G.Zones.plaza.objects.forEach(o => { if (o.t === 'sign' && o.welcome) o.text = 'ברוכים הבאים ל' + I.cur.name + ' ✨'; });
    G.World.makeBots();
  };
  I.decorate = (ctx, w, h, seed) => { const d = decor[I.T.decor]; if (d) d(ctx, w, h, U.rng(seed || 9)); };
  I.canEnter = (isl, grade) => isl.grade <= grade;

  // ---------- טקסט על קרקע ----------
  const exitGate = (w, h, c) => ({ t: 'gate', x: w / 2, y: h - 40, w: 110, text: '🏙️ לכיכר', c: c || '#7c5cff' });
  const exitPortal = (w, h) => [{ r: [w / 2 - 70, h - 30, w / 2 + 70, h], to: 'plaza' }];

  // ---------- רכיבה ----------
  // ridePos(o, tGlobal, tLocal) => {x, y, sort, dir, hidden}
  S.rideAnchor = () => { };

  // ===== 1. ארץ הממתקים – קרוסלה =====
  S.carousel = (ctx, o, t) => {
    const { x, y } = o, rot = t * 0.7;
    U.shadow(ctx, x, y + 6, 190, 50, 0.2);
    U.ell(ctx, x, y, 180, 60, '#ffb3d9'); U.ell(ctx, x, y - 8, 180, 60, '#ffd6ec'); U.ell(ctx, x, y - 8, 150, 48, null, '#ff7eb6', 4);
    const horses = [];
    for (let k = 0; k < 6; k++) { const a = rot + k * Math.PI / 3; horses.push({ a, k, x: x + Math.cos(a) * 140, y: y - 8 + Math.sin(a) * 46, bob: Math.sin(t * 3 + k) * 10 }); }
    const drawHorse = h => {
      const hx = h.x, hy = h.y - 60 + h.bob, col = ['#ffffff', '#ffde59', '#c39bff', '#7fd3ff', '#ff9ef0', '#5fe0b7'][h.k];
      ctx.fillStyle = '#ffd84d'; ctx.fillRect(hx - 2, y - 236 + Math.sin(h.a) * 20, 4, h.y - (y - 236) - 20);
      const f = Math.cos(h.a) > 0 ? -1 : 1;
      ctx.save(); ctx.translate(hx, hy); ctx.scale(f, 1);
      U.ell(ctx, 0, 0, 30, 15, col, U.shade(col, -0.2), 2); U.ell(ctx, 26, -14, 11, 16, col); U.ell(ctx, 34, -24, 10, 8, col, U.shade(col, -0.2), 1.5);
      U.circ(ctx, 36, -26, 2, '#2b2440'); ctx.fillStyle = '#ff7eb6'; for (let i = 0; i < 4; i++) U.circ(ctx, 18 - i * 3, -26 + i * 4, 5, '#ff7eb6');
      ctx.fillStyle = U.shade(col, -0.1); ctx.fillRect(-20, 10, 5, 22); ctx.fillRect(14, 10, 5, 22);
      U.fillRR(ctx, -12, -18, 24, 8, 4, '#ff5d6c'); ctx.restore();
    };
    horses.filter(h => Math.sin(h.a) <= 0).forEach(drawHorse);
    U.fillRR(ctx, x - 14, y - 250, 28, 240, 8, '#ff7eb6'); ctx.fillStyle = '#ffffff'; for (let i = 0; i < 8; i++) ctx.fillRect(x - 14, y - 240 + i * 28, 28, 8);
    horses.filter(h => Math.sin(h.a) > 0).forEach(drawHorse);
    // גג
    ctx.beginPath(); ctx.moveTo(x - 200, y - 230); ctx.lineTo(x, y - 330); ctx.lineTo(x + 200, y - 230); ctx.closePath(); ctx.fillStyle = '#ff7eb6'; ctx.fill();
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(x, y - 330); ctx.lineTo(x - 200 + i * 40, y - 230); ctx.lineTo(x - 180 + i * 40, y - 230); ctx.closePath(); ctx.fillStyle = i % 2 ? '#ffffff' : '#ffb3d9'; ctx.fill(); }
    for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? '#ffde59' : '#7fd3ff'; ctx.beginPath(); ctx.arc(x - 180 + i * 40, y - 230, 20, 0, Math.PI); ctx.fill(); }
    for (let i = 0; i < 11; i++) U.circ(ctx, x - 200 + i * 40, y - 228, 4, (Math.floor(t * 4) + i) % 2 ? '#fff6c2' : '#ffffff');
    U.circ(ctx, x, y - 336, 12, '#ffde59'); U.star(ctx, x, y - 356, 12, 5, 5, '#ffde59');
  };
  S.cupcake = (ctx, o, t) => {
    const s = o.s || 1, c = o.c || '#ff9ef0';
    U.shadow(ctx, o.x, o.y, 50 * s, 12 * s);
    ctx.beginPath(); ctx.moveTo(o.x - 46 * s, o.y - 70 * s); ctx.lineTo(o.x + 46 * s, o.y - 70 * s); ctx.lineTo(o.x + 34 * s, o.y); ctx.lineTo(o.x - 34 * s, o.y); ctx.closePath(); ctx.fillStyle = '#ffd08a'; ctx.fill();
    ctx.strokeStyle = '#e8aa5c'; ctx.lineWidth = 3; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(o.x + i * 13 * s, o.y - 70 * s); ctx.lineTo(o.x + i * 9.5 * s, o.y); ctx.stroke(); }
    U.circ(ctx, o.x - 26 * s, o.y - 82 * s, 26 * s, c); U.circ(ctx, o.x + 26 * s, o.y - 82 * s, 26 * s, c); U.circ(ctx, o.x, o.y - 102 * s, 32 * s, U.shade(c, 0.1)); U.circ(ctx, o.x, o.y - 130 * s, 18 * s, U.shade(c, 0.2));
    U.circ(ctx, o.x, o.y - 156 * s, 12 * s, '#ff3d5e'); ctx.strokeStyle = '#3a9e55'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x, o.y - 166 * s); ctx.quadraticCurveTo(o.x + 6, o.y - 180 * s, o.x + 12, o.y - 182 * s); ctx.stroke();
    const r = U.rng(o.x | 0); for (let i = 0; i < 14; i++) { ctx.save(); ctx.translate(o.x + (r() - 0.5) * 80 * s, o.y - 80 * s - r() * 60 * s); ctx.rotate(r() * 3); ctx.fillStyle = ['#ffde59', '#7fd3ff', '#5fe0b7', '#ffffff'][i % 4]; ctx.fillRect(-4, -1.5, 8, 3); ctx.restore(); }
  };
  S.candycane = (ctx, o) => {
    U.shadow(ctx, o.x, o.y, 16, 5);
    ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x, o.y - 120); ctx.arc(o.x + 26, o.y - 120, 26, Math.PI, 0); ctx.stroke();
    ctx.lineWidth = 16; ctx.strokeStyle = '#ff3d5e'; ctx.setLineDash([12, 14]); ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x, o.y - 120); ctx.arc(o.x + 26, o.y - 120, 26, Math.PI, 0); ctx.stroke(); ctx.setLineDash([]);
  };
  S.gumdrop = (ctx, o, t) => {
    if (o.gone) return; const b = Math.sin(t * 3 + o.x) * 3;
    U.shadow(ctx, o.x, o.y, 12, 4);
    ctx.beginPath(); ctx.moveTo(o.x - 13, o.y - 2 + b); ctx.quadraticCurveTo(o.x - 14, o.y - 26 + b, o.x, o.y - 28 + b); ctx.quadraticCurveTo(o.x + 14, o.y - 26 + b, o.x + 13, o.y - 2 + b); ctx.closePath(); ctx.fillStyle = o.c; ctx.fill();
    U.ell(ctx, o.x - 4, o.y - 20 + b, 3, 5, 'rgba(255,255,255,0.7)'); for (let i = 0; i < 5; i++) U.circ(ctx, o.x - 8 + i * 4, o.y - 10 + b + (i % 2) * 6, 1.3, 'rgba(255,255,255,0.8)');
  };

  // ===== 2. עמק הדינוזאורים =====
  S.volcano = (ctx, o, t) => {
    const { x, y } = o;
    ctx.beginPath(); ctx.moveTo(x - 260, y); ctx.lineTo(x - 70, y - 260); ctx.lineTo(x + 70, y - 260); ctx.lineTo(x + 260, y); ctx.closePath(); ctx.fillStyle = '#8a5a46'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 70, y - 260); ctx.lineTo(x + 70, y - 260); ctx.lineTo(x + 40, y - 200); ctx.quadraticCurveTo(x, y - 180, x - 50, y - 210); ctx.closePath(); ctx.fillStyle = '#ff6a3d'; ctx.fill();
    ctx.strokeStyle = '#ff9a3d'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x + 30, y - 220); ctx.quadraticCurveTo(x + 60, y - 150, x + 40, y - 80); ctx.stroke();
    for (let i = 0; i < 6; i++) { const p = ((t * 0.25 + i / 6) % 1); U.circ(ctx, x + Math.sin(i * 2 + t) * 20 + p * 60, y - 270 - p * 220, 20 + p * 40, `rgba(200,190,200,${0.6 * (1 - p)})`); }
  };
  const dinoPos = (o, t) => { const a = t * (o.sp || 0.12) + (o.ph || 0); return { x: o.cx + Math.cos(a) * o.rx, y: o.cy + Math.sin(a) * o.ry, dir: -Math.sin(a) > 0 ? 1 : -1, a }; };
  S.dino = (ctx, o, t) => {
    const p = dinoPos(o, t); o.x = p.x; o.y = p.y;
    const c = o.c, step = Math.sin(t * 5 + o.ph) * 6;
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.dir * (o.s || 1), o.s || 1);
    U.shadow(ctx, 0, 2, 90, 18);
    if (o.kind === 'brachio') {
      ctx.fillStyle = U.shade(c, -0.15); [[-46, step], [-20, -step], [24, step], [50, -step]].forEach(([lx, s2]) => U.fillRR(ctx, lx - 9, -50, 18, 50 + 0 * s2, 8, U.shade(c, -0.15)));
      ctx.beginPath(); ctx.moveTo(-70, -60); ctx.quadraticCurveTo(-130, -60, -150, -20); ctx.quadraticCurveTo(-110, -50, -70, -40); ctx.fillStyle = c; ctx.fill();
      U.ell(ctx, 0, -70, 80, 42, c);
      ctx.strokeStyle = c; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(50, -90); ctx.quadraticCurveTo(90, -170, 110, -230); ctx.stroke();
      U.ell(ctx, 124, -238, 28, 18, c); U.circ(ctx, 132, -244, 4, '#2b2440'); ctx.strokeStyle = '#2b2440'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(134, -232, 7, 0.2, 1.4); ctx.stroke();
      for (let i = 0; i < 6; i++) U.circ(ctx, -40 + i * 16, -100 + Math.abs(i - 2.5) * 3, 6, U.shade(c, 0.2));
      U.fillRR(ctx, -26, -118, 52, 12, 5, '#ff5d6c');
    } else if (o.kind === 'tri') {
      [[-30, step], [-10, -step], [22, step], [38, -step]].forEach(([lx]) => U.fillRR(ctx, lx - 8, -34, 16, 34, 7, U.shade(c, -0.15)));
      ctx.beginPath(); ctx.moveTo(-50, -40); ctx.lineTo(-90, -24); ctx.lineTo(-50, -28); ctx.fillStyle = c; ctx.fill();
      U.ell(ctx, 0, -46, 56, 28, c); U.ell(ctx, 58, -56, 26, 34, U.shade(c, 0.25)); U.ell(ctx, 66, -42, 22, 18, c);
      ctx.fillStyle = '#fff6e0'; [[60, -72, 74, -96], [76, -66, 96, -82], [80, -40, 98, -40]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a - 4, b); ctx.lineTo(c2, d); ctx.lineTo(a + 4, b + 4); ctx.fill(); });
      U.circ(ctx, 72, -50, 3.5, '#2b2440');
    } else {
      [[-8, step], [12, -step]].forEach(([lx]) => U.fillRR(ctx, lx - 6, -30, 12, 30, 5, U.shade(c, -0.15)));
      ctx.beginPath(); ctx.moveTo(-26, -40); ctx.lineTo(-70, -54); ctx.lineTo(-26, -30); ctx.fillStyle = c; ctx.fill();
      U.ell(ctx, 0, -44, 32, 20, c); U.ell(ctx, 32, -66, 20, 15, c); U.circ(ctx, 38, -70, 3, '#2b2440'); ctx.strokeStyle = '#2b2440'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, -58); ctx.lineTo(48, -60); ctx.stroke();
      U.fillRR(ctx, 18, -48, 14, 5, 2, U.shade(c, -0.1));
    }
    ctx.restore();
  };
  S.fossil = (ctx, o, t) => {
    if (o.gone) return;
    U.ell(ctx, o.x, o.y - 4, 34, 13, '#b98a5a'); U.ell(ctx, o.x, o.y - 6, 28, 10, '#a47448');
    ctx.strokeStyle = '#f7efe0'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(o.x - 16, o.y - 6); ctx.lineTo(o.x + 14, o.y - 8); ctx.stroke(); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(o.x + i * 6, o.y - 12); ctx.lineTo(o.x + i * 6, o.y - 2); ctx.stroke(); }
    if (Math.sin(t * 3 + o.x) > 0.6) U.star(ctx, o.x + 18, o.y - 22, 5, 2, 4, '#ffffff');
    S.txt(ctx, '⛏️', o.x - 22, o.y - 26, 16, '#000');
  };

  // ===== 3. מפרץ הפיראטים =====
  const shipPos = (o, tl, riding) => {
    const t = riding ? tl : 0; const span = 560;
    const ph = riding ? Math.min(1, t / 12) : 0;
    const x = o.x + Math.sin(ph * Math.PI * 2) * span * (riding ? 1 : 0);
    return { x, y: o.y + Math.sin(G.World.t * 1.3) * 4, rock: Math.sin(G.World.t * 1.5) * 0.05, dir: Math.cos(ph * Math.PI * 2) >= 0 ? 1 : -1 };
  };
  S.ship = (ctx, o, t) => {
    const riding = G.World.ride && G.World.ride.o === o; const p = shipPos(o, riding ? G.World.t - G.World.ride.t0 : 0, riding);
    o.sx = p.x; o.sy = p.y;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rock); ctx.scale(p.dir, 1);
    U.ell(ctx, 0, 6, 200, 24, 'rgba(255,255,255,0.35)');
    ctx.beginPath(); ctx.moveTo(-190, -70); ctx.lineTo(190, -70); ctx.lineTo(150, 0); ctx.lineTo(-160, 0); ctx.closePath(); ctx.fillStyle = '#7a4a2c'; ctx.fill();
    ctx.fillStyle = '#5a341d'; for (let i = 0; i < 4; i++) ctx.fillRect(-170, -60 + i * 16, 340, 3);
    for (let i = 0; i < 5; i++) U.circ(ctx, -110 + i * 55, -36, 8, '#2b2440');
    U.fillRR(ctx, 120, -120, 70, 54, 6, '#8a5a36'); U.fillRR(ctx, -196, -84, 392, 14, 4, '#a8703d');
    ctx.fillStyle = '#5a341d'; ctx.fillRect(-6, -330, 12, 260); ctx.fillRect(-80, -330 + 0, 4, 0);
    ctx.beginPath(); ctx.moveTo(-100, -310); ctx.quadraticCurveTo(0, -270 + Math.sin(t * 2) * 10, 100, -310); ctx.lineTo(90, -130); ctx.quadraticCurveTo(0, -100, -90, -130); ctx.closePath(); ctx.fillStyle = '#f7f0dc'; ctx.fill();
    S.txt(ctx, '☠️', 0, -210, 54, '#000');
    ctx.fillStyle = '#2b2440'; ctx.beginPath(); ctx.moveTo(6, -330); ctx.lineTo(60, -316 + Math.sin(t * 6) * 4); ctx.lineTo(6, -300); ctx.fill();
    ctx.restore();
  };
  S.treasure = (ctx, o, t) => {
    if (o.gone) { U.ell(ctx, o.x, o.y - 4, 22, 8, 'rgba(120,80,40,0.35)'); return; }
    ctx.strokeStyle = '#d6334a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(o.x - 16, o.y - 18); ctx.lineTo(o.x + 16, o.y + 2); ctx.moveTo(o.x + 16, o.y - 18); ctx.lineTo(o.x - 16, o.y + 2); ctx.stroke();
    if (Math.sin(t * 4 + o.x) > 0.5) U.star(ctx, o.x + 20, o.y - 26, 5, 2, 4, '#ffde59');
  };
  S.barrel = (ctx, o) => { U.shadow(ctx, o.x, o.y, 22, 6); U.fillRR(ctx, o.x - 20, o.y - 48, 40, 48, 12, '#a8703d'); ctx.fillStyle = '#5a5a6a'; ctx.fillRect(o.x - 20, o.y - 40, 40, 4); ctx.fillRect(o.x - 20, o.y - 12, 40, 4); };
  S.parrot = (ctx, o, t) => {
    U.fillRR(ctx, o.x - 3, o.y - 90, 6, 90, 3, '#7a4a2c'); ctx.fillStyle = '#7a4a2c'; ctx.fillRect(o.x - 24, o.y - 92, 48, 6);
    const b = Math.sin(t * 2) * 2; U.ell(ctx, o.x, o.y - 112 + b, 13, 20, '#ff4d5e'); U.circ(ctx, o.x + 2, o.y - 132 + b, 11, '#ff4d5e');
    U.ell(ctx, o.x - 7, o.y - 108 + b, 7, 15, '#3a7bff'); ctx.fillStyle = '#ffde59'; ctx.beginPath(); ctx.moveTo(o.x + 10, o.y - 134 + b); ctx.lineTo(o.x + 20, o.y - 128 + b); ctx.lineTo(o.x + 9, o.y - 124 + b); ctx.fill(); U.circ(ctx, o.x + 5, o.y - 135 + b, 2, '#000');
  };
  S.pier = (ctx, o) => { G.Zones.GR.wood(ctx, o.x - 60, o.y - 200, 120, 200, '#b88350', '#a8703d'); for (let i = 0; i < 4; i++) { ctx.fillStyle = '#7a4a2c'; ctx.fillRect(o.x - 66, o.y - 196 + i * 60, 10, 30); ctx.fillRect(o.x + 56, o.y - 196 + i * 60, 10, 30); } };

  // ===== 4. תחנת החלל =====
  const rocketPos = (o, tl) => {
    let lift = 0; let shake = 0;
    if (tl < 3) shake = Math.sin(tl * 60) * 2 * (tl / 3);
    else if (tl < 7) lift = Math.pow((tl - 3) / 4, 2) * 900;
    else if (tl < 10) lift = 900 + Math.sin((tl - 7) * 2) * 20;
    else if (tl < 14) lift = 900 * (1 - (tl - 10) / 4);
    return { x: o.x + shake, y: o.y - lift, lift };
  };
  S.rocket = (ctx, o, t) => {
    const riding = G.World.ride && G.World.ride.o === o, tl = riding ? G.World.t - G.World.ride.t0 : 0;
    const p = rocketPos(o, tl); o.rx = p.x; o.ry = p.y;
    // מגדל שיגור
    U.fillRR(ctx, o.x - 140, o.y - 340, 26, 340, 4, '#8a8fa8'); ctx.strokeStyle = '#6b708a'; ctx.lineWidth = 3; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(o.x - 140, o.y - i * 34); ctx.lineTo(o.x - 114, o.y - i * 34 - 30); ctx.stroke(); }
    U.fillRR(ctx, o.x - 120, o.y - 280, 50, 8, 3, '#8a8fa8');
    U.ell(ctx, o.x, o.y, 120, 30, '#5b6078'); U.ell(ctx, o.x, o.y - 6, 110, 26, '#7a809b');
    if (riding && tl > 2 && tl < 14) { for (let i = 0; i < 10; i++) { const k = Math.random(); U.circ(ctx, p.x + (Math.random() - 0.5) * 40, p.y + 10 + k * 80, 16 + k * 20, `rgba(255,${150 + k * 100 | 0},60,${0.8 - k * 0.6})`); } for (let i = 0; i < 6; i++) U.circ(ctx, o.x + (Math.random() - 0.5) * 220, o.y - Math.random() * 40, 20 + Math.random() * 30, 'rgba(220,220,235,0.5)'); }
    ctx.save(); ctx.translate(p.x, p.y);
    [-1, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(k * 30, -60); ctx.lineTo(k * 62, 0); ctx.lineTo(k * 30, -10); ctx.closePath(); ctx.fillStyle = '#ff4d5e'; ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(-32, -10); ctx.lineTo(-32, -200); ctx.quadraticCurveTo(0, -300, 32, -200); ctx.lineTo(32, -10); ctx.closePath(); ctx.fillStyle = '#f2f4fb'; ctx.fill(); ctx.strokeStyle = '#c5c9db'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-26, -220); ctx.quadraticCurveTo(0, -300, 26, -220); ctx.closePath(); ctx.fillStyle = '#ff4d5e'; ctx.fill();
    U.circ(ctx, 0, -150, 18, '#7fd3ff', '#8a8fa8', 5); U.ell(ctx, -5, -155, 6, 4, 'rgba(255,255,255,0.8)');
    if (riding) { ctx.save(); ctx.beginPath(); ctx.arc(0, -150, 15, 0, Math.PI * 2); ctx.clip(); ctx.translate(0, -112); ctx.scale(0.45, 0.45); G.Avatar.draw(ctx, G.P.look, 0, 0, { dir: 'down', t, noShadow: true, emote: { id: 'happy', t: 0 } }); ctx.restore(); }
    S.txt(ctx, 'Q', 0, -80, 26, '#7c5cff', 700); U.fillRR(ctx, -32, -30, 64, 8, 2, '#7c5cff');
    ctx.restore();
  };
  const PLANETS = [['שמש', '#ffcf3c', 54, 'השמש היא כוכב! היא כדור ענק של גזים לוהטים, ואור השמש מגיע אלינו בתוך כ-8 דקות.'], ['כוכב חמה', '#b5a89a', 14, 'כוכב חמה הוא כוכב הלכת הקרוב ביותר לשמש והקטן ביותר במערכת השמש.'], ['נוגה', '#ffd08a', 20, 'נוגה הוא כוכב הלכת החם ביותר, כי האטמוספרה העבה שלו לוכדת את החום.'], ['כדור הארץ', '#4d8dff', 21, 'כדור הארץ הוא כוכב הלכת היחיד שידוע לנו שיש עליו חיים, ורוב פני השטח שלו מכוסים במים.'], ['מאדים', '#e2633a', 16, 'מאדים נקרא "הכוכב האדום" בגלל אבק עשיר בברזל חלוד שמכסה אותו.'], ['צדק', '#d9a46a', 40, 'צדק הוא כוכב הלכת הגדול ביותר. יש לו סופה ענקית שנקראת "הכתם האדום הגדול".'], ['שבתאי', '#f0d08a', 34, 'לשבתאי יש טבעות מרהיבות שעשויות בעיקר מגושי קרח וסלע.']];
  S.planet = (ctx, o, t) => {
    const [name, c, r] = PLANETS[o.k];
    U.fillRR(ctx, o.x - 26, o.y - 40, 52, 40, 6, '#5b6078'); U.fillRR(ctx, o.x - 32, o.y - 46, 64, 10, 4, '#7a809b');
    const py = o.y - 70 - r + Math.sin(t * 1.5 + o.k) * 5;
    if (o.k === 0) { ctx.save(); ctx.shadowColor = '#ffcf3c'; ctx.shadowBlur = 30; U.circ(ctx, o.x, py, r, c); ctx.restore(); }
    else { if (o.k === 6) U.ell(ctx, o.x, py, r * 1.9, r * 0.5, null, '#e8c78a', 5); U.circ(ctx, o.x, py, r, c); ctx.save(); ctx.beginPath(); ctx.arc(o.x, py, r, 0, Math.PI * 2); ctx.clip(); U.circ(ctx, o.x + r * 0.4, py + r * 0.3, r, 'rgba(0,0,0,0.18)'); if (o.k === 3) { U.ell(ctx, o.x - 6, py - 4, 8, 6, '#3fbf6a'); U.ell(ctx, o.x + 8, py + 6, 6, 4, '#3fbf6a'); } if (o.k === 5) { ctx.fillStyle = 'rgba(160,100,60,0.4)'; for (let i = -2; i <= 2; i++) ctx.fillRect(o.x - r, py + i * 10, r * 2, 4); U.ell(ctx, o.x + 10, py + 8, 7, 4, '#c0392b'); } ctx.restore(); if (o.k === 6) { ctx.save(); ctx.beginPath(); ctx.rect(o.x - r * 2, py, r * 4, r); ctx.clip(); U.ell(ctx, o.x, py, r * 1.9, r * 0.5, null, '#e8c78a', 5); ctx.restore(); } }
    S.txt(ctx, name, o.x, o.y - 20, 13, '#ffffff', 700);
  };
  S.astroBg = (ctx, o, t) => { };

  // ===== 5. העיר שמתחת למים =====
  const subPos = (o, tl) => { const a = tl * 0.45; return { x: o.cx + Math.sin(a) * 520, y: o.cy - 120 + Math.sin(a * 2) * 90 - Math.sin(Math.min(1, tl / 2) * Math.PI / 2) * 60, dir: Math.cos(a) >= 0 ? 1 : -1 }; };
  S.sub = (ctx, o, t) => {
    const riding = G.World.ride && G.World.ride.o === o, tl = riding ? G.World.t - G.World.ride.t0 : 0;
    const p = riding ? subPos(o, tl) : { x: o.cx, y: o.cy + Math.sin(t * 1.2) * 6, dir: 1 }; o.px = p.x; o.py = p.y;
    if (!riding) { U.ell(ctx, o.cx, o.cy + 30, 130, 22, 'rgba(255,255,255,0.25)'); U.fillRR(ctx, o.cx - 120, o.cy + 20, 240, 18, 6, '#8a8fa8'); }
    ctx.save(); ctx.translate(p.x, p.y - 30); ctx.scale(p.dir, 1);
    U.ell(ctx, 0, 0, 96, 44, '#ffcf3c'); U.fillRR(ctx, -24, -70, 54, 36, 14, '#ffcf3c'); ctx.fillStyle = '#e0a800'; ctx.fillRect(10, -96, 6, 28); ctx.fillRect(10, -96, 22, 6);
    [-40, 0, 40].forEach(dx => { U.circ(ctx, dx, -4, 13, '#7fd3ff', '#e0a800', 4); });
    if (riding) { ctx.save(); ctx.beginPath(); ctx.arc(0, -4, 11, 0, Math.PI * 2); ctx.clip(); ctx.translate(0, 26); ctx.scale(0.4, 0.4); G.Avatar.draw(ctx, G.P.look, 0, 0, { dir: 'down', t, noShadow: true, emote: { id: 'happy', t: 0 } }); ctx.restore(); }
    ctx.save(); ctx.translate(-96, 0); ctx.rotate(t * 10); ctx.fillStyle = '#8a8fa8'; ctx.fillRect(-3, -18, 6, 36); ctx.restore();
    ctx.restore();
    for (let i = 0; i < 4; i++) U.circ(ctx, p.x - p.dir * 110 - i * 12 * p.dir, p.y - 30 - ((t * 40 + i * 10) % 40), 3 + i, 'rgba(255,255,255,0.5)');
  };
  const CREATURES = [['תמנון', '🐙', 'לתמנון יש שלושה לבבות ודם בצבע כחול! הוא גם יכול לשנות צבע כדי להסוות את עצמו.'], ['דולפין', '🐬', 'הדולפין הוא יונק – הוא נושם אוויר דרך נקב בראש שלו, ולא בזימים כמו דג.'], ['צב ים', '🐢', 'צבות ים נוהגות לחזור לחוף שבו בקעו כדי להטיל שם ביצים בחול.'], ['כריש לווייתן', '🦈', 'כריש הלווייתן הוא הדג הגדול בעולם, אבל הוא אוכל בעיקר יצורים זעירים שנקראים פלנקטון.'], ['מדוזה', '🪼', 'למדוזה אין מוח ואין עצמות, וגופה בנוי בעיקר ממים.'], ['אלמוגים', '🪸', 'אלמוגים נראים כמו צמחים, אבל הם בעלי חיים זעירים שבונים שוניות ענקיות יחד.']];
  S.creature = (ctx, o, t) => {
    const c = CREATURES[o.k];
    U.fillRR(ctx, o.x - 36, o.y - 30, 72, 30, 8, 'rgba(255,255,255,0.85)', '#00b8cc', 2); S.txt(ctx, c[0], o.x, o.y - 15, 13, '#0b5c6a', 700);
    S.txt(ctx, c[1], o.x + Math.sin(t * 1.5 + o.k) * 10, o.y - 70 + Math.sin(t * 2 + o.k) * 6, 46, '#000');
  };
  S.seaweed = (ctx, o, t) => { ctx.strokeStyle = o.c || '#2fbf71'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(o.x + k * 10, o.y); for (let i = 1; i <= 6; i++) ctx.lineTo(o.x + k * 10 + Math.sin(t * 1.6 + i * 0.7 + k) * 8, o.y - i * 20); ctx.stroke(); } };
  S.dome = (ctx, o, t) => { };

  // ===== 6. פארק העתיד – רכבת הרים =====
  const track = (o, a) => { const x = o.x + Math.cos(a) * o.rx, base = o.y + Math.sin(a) * o.ry, h = 90 + Math.sin(a * 2) * 70 + Math.max(0, Math.sin(a * 3 + 1)) * 60; return { x, y: base, h }; };
  S.coaster = (ctx, o, t) => {
    // תומכים
    for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, p = track(o, a); if (Math.sin(a) > 0) continue; ctx.strokeStyle = 'rgba(0,229,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - p.h); ctx.stroke(); }
    const drawRail = (front) => {
      ctx.save(); ctx.shadowColor = '#ff3df0'; ctx.shadowBlur = 12; ctx.strokeStyle = '#ff3df0'; ctx.lineWidth = 6; ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 200; i++) { const a = i / 200 * Math.PI * 2; const p = track(o, a); const f = Math.sin(a) > 0; if (f !== front) { started = false; continue; } if (!started) { ctx.moveTo(p.x, p.y - p.h); started = true; } else ctx.lineTo(p.x, p.y - p.h); }
      ctx.stroke(); ctx.restore();
    };
    drawRail(false);
    const riding = G.World.ride && G.World.ride.o === o;
    const speed = 0.6;
    for (let k = 0; k < 4; k++) {
      const a = (t * speed) - k * 0.09, p = track(o, a), p2 = track(o, a + 0.02), ang = Math.atan2((p2.y - p2.h) - (p.y - p.h), p2.x - p.x);
      ctx.save(); ctx.translate(p.x, p.y - p.h); ctx.rotate(ang);
      U.fillRR(ctx, -22, -22, 44, 22, 6, ['#00e5ff', '#ffde59', '#5fe0b7', '#ff3df0'][k]); U.circ(ctx, -12, 0, 5, '#2b2440'); U.circ(ctx, 12, 0, 5, '#2b2440');
      if (k === 0 && riding) { ctx.translate(0, -12); ctx.rotate(-ang); ctx.scale(0.55, 0.55); G.Avatar.draw(ctx, G.P.look, 0, 0, { dir: 'down', t, noShadow: true, emote: { id: 'laugh', t: t % 1 } }); }
      ctx.restore();
    }
    drawRail(true);
    for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, p = track(o, a); if (Math.sin(a) <= 0) continue; ctx.strokeStyle = 'rgba(0,229,255,0.55)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - p.h); ctx.stroke(); }
    // תחנה
    U.fillRR(ctx, o.x - 80, o.y + o.ry - 10, 160, 40, 8, '#2b2160', '#00e5ff', 3); S.txt(ctx, '🎢 תחנת עלייה', o.x, o.y + o.ry + 10, 14, '#00e5ff', 700);
  };
  S.hoverpad = (ctx, o, t) => {
    ctx.save(); ctx.shadowColor = '#5fe0b7'; ctx.shadowBlur = 20 + Math.sin(t * 4) * 8;
    U.ell(ctx, o.x, o.y, 54, 20, '#1d1240', '#5fe0b7', 4); ctx.restore();
    for (let i = 0; i < 3; i++) { const r = ((t * 30 + i * 18) % 54); U.ell(ctx, o.x, o.y, r, r * 0.37, null, U.rgba('#5fe0b7', 1 - r / 54), 2); }
    S.txt(ctx, '🛹 גלשן ריחוף', o.x, o.y - 30, 13, '#5fe0b7', 700);
  };
  S.holo = (ctx, o, t) => {
    U.ell(ctx, o.x, o.y, 70, 22, '#2b2160', '#00e5ff', 3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, o.y, 0, o.y - 220); g.addColorStop(0, 'rgba(0,229,255,0.35)'); g.addColorStop(1, 'rgba(0,229,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(o.x - 60, o.y); ctx.lineTo(o.x - 30, o.y - 220); ctx.lineTo(o.x + 30, o.y - 220); ctx.lineTo(o.x + 60, o.y); ctx.fill();
    ctx.globalAlpha = 0.75 + Math.sin(t * 8) * 0.1; ctx.save(); ctx.translate(o.x, o.y - 130); ctx.rotate(t); U.star(ctx, 0, 0, 44, 18, 5, 'rgba(255,61,240,0.6)', '#ff3df0'); ctx.restore();
    S.txt(ctx, 'Q', o.x, o.y - 130, 40, '#ffffff', 700); ctx.restore();
  };

  // ---------- הגדרות אזורי האטרקציות ----------
  const GR = () => G.Zones.GR;
  I.ATTR = {
    candy: () => ({
      name: 'ארץ הממתקים', icon: '🎠', w: 1800, h: 1250, mood: 'plaza', minY: 360, bots: 3,
      water: [[0, 160, 1800, 170, 'rect']],
      ground(ctx) {
        ctx.fillStyle = U.vgrad(ctx, 0, this.h, '#ffe0f0', '#c9f7e4'); ctx.fillRect(0, 0, this.w, this.h); I.decorate(ctx, this.w, this.h, 4);
        ctx.fillStyle = '#ffd6ec'; ctx.fillRect(0, 0, this.w, 160);
        ctx.fillStyle = U.vgrad(ctx, 160, 330, '#8a4a2c', '#6e3a20'); ctx.fillRect(0, 160, this.w, 170);
        for (let i = 0; i < 30; i++) U.ell(ctx, (i * 97) % this.w, 190 + (i * 41) % 120, 26, 6, 'rgba(255,255,255,0.18)');
        U.ell(ctx, 900, 720, 260, 90, 'rgba(255,126,182,0.25)');
        for (let x = 0; x < this.w; x += 70) { U.circ(ctx, x + 35, 345, 22, ['#ff7eb6', '#7fd3ff', '#ffde59', '#c39bff'][(x / 70) % 4]); }
      },
      objects: [
        { t: 'carousel', x: 900, y: 700, act: 'ride', label: 'לעלות על הקרוסלה', box: [740, 660, 1060, 740] },
        { t: 'cupcake', x: 300, y: 600, c: '#ff9ef0' }, { t: 'cupcake', x: 1500, y: 620, c: '#7fd3ff', s: 1.15 }, { t: 'cupcake', x: 1450, y: 1060, c: '#ffde59', s: 0.85 },
        { t: 'candycane', x: 520, y: 470 }, { t: 'candycane', x: 1280, y: 470 }, { t: 'candycane', x: 160, y: 1000 }, { t: 'candycane', x: 1650, y: 900 },
        { t: 'tree', x: 600, y: 1000 }, { t: 'tree', x: 1180, y: 1000 }, { t: 'tree', x: 90, y: 520 }, { t: 'tree', x: 1730, y: 520 },
        { t: 'cart', x: 380, y: 950, c: '#ff9ef0', emoji: '🍭', act: 'treat:6:🍭:love:סוכריה על מקל ענקית!', label: 'סוכריה (6 מטבעות)' },
        { t: 'balloons', x: 700, y: 520 }, { t: 'balloons', x: 1100, y: 520 },
        exitGate(1800, 1250, '#ff7eb6'),
      ].concat(Array.from({ length: 10 }, (_, i) => ({ t: 'gumdrop', x: 150 + (i * 167) % 1500, y: 430 + (i * 113) % 680, c: ['#ff5d6c', '#5fe0b7', '#ffde59', '#c39bff', '#7fd3ff'][i % 5], act: 'gumdrop', label: 'לאסוף סוכריית ג׳לי' }))),
      staff: [{ name: 'סבתא סוכריה', x: 640, y: 780, act: 'attrInfo', label: 'לדבר עם סבתא סוכריה', look: { skin: '#ffe3cc', hairStyle: 'bun', hairColor: '#f4f4f4', eyes: 'happy', eyeColor: '#3b2a20', shirt: 'dress_sun', pants: 'skirt_pink', shoes: 'boots_pink', hat: 'flower_crown', glasses: 'glasses_round', bag: null, acc: 'necklace' } }],
      info: 'ברוכים הבאים לארץ הממתקים! עלו על הקרוסלה הקסומה, ואספו סוכריות ג׳לי – כל אחת שווה מטבעות.',
      ride: { dur: 12, pos(o, t, tl) { const a = t * 0.7; return { x: o.x + Math.cos(a) * 140, y: o.y - 8 + Math.sin(a) * 46 - 28 + Math.sin(t * 3) * 10, sort: Math.sin(a) > 0 ? o.y + 80 : o.y - 80, dir: Math.cos(a) > 0 ? 'left' : 'right' }; } },
      portals: exitPortal(1800, 1250), arrivals: { plaza: [900, 1030] },
    }),
    dino: () => ({
      name: 'עמק הדינוזאורים', icon: '🦕', w: 2000, h: 1350, mood: 'park', minY: 380, bots: 3,
      ground(ctx) {
        GR().grass(ctx, this.w, this.h, null, null, 31);
        ctx.fillStyle = U.vgrad(ctx, 0, 360, '#ffcfa0', '#ff9a6b'); ctx.fillRect(0, 0, this.w, 360);
        ctx.strokeStyle = '#d9b38a'; ctx.lineWidth = 80; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(100, 1250); ctx.bezierCurveTo(600, 900, 1400, 1100, 1900, 700); ctx.stroke();
        ctx.strokeStyle = '#e8c79a'; ctx.lineWidth = 64; ctx.stroke();
        U.ell(ctx, 1000, 760, 470, 200, 'rgba(255,255,255,0.12)');
      },
      objects: [
        { t: 'volcano', x: 1000, y: 380, sortY: 0 },
        { t: 'dino', kind: 'brachio', c: '#7fc8a9', cx: 1000, cy: 780, rx: 380, ry: 140, sp: 0.12, ph: 0, dyn: 1, act: 'ride', label: 'לרכוב על הברכיוזאורוס' },
        { t: 'dino', kind: 'tri', c: '#ff9a6b', cx: 500, cy: 1050, rx: 200, ry: 70, sp: 0.2, ph: 1, dyn: 1, s: 0.9 },
        { t: 'dino', kind: 'raptor', c: '#c39bff', cx: 1500, cy: 1080, rx: 160, ry: 60, sp: 0.35, ph: 2, dyn: 1 },
        { t: 'tree', x: 120, y: 520 }, { t: 'tree', x: 1880, y: 520 }, { t: 'tree', x: 330, y: 700 }, { t: 'tree', x: 1700, y: 760 }, { t: 'tree', x: 220, y: 1250 }, { t: 'tree', x: 1820, y: 1250 },
        { t: 'rock', x: 700, y: 470, s: 1.4 }, { t: 'rock', x: 1350, y: 480, s: 1.2 }, { t: 'bush', x: 900, y: 1230, flowers: '#ff7eb6' },
        exitGate(2000, 1350, '#2fbf71'),
      ].concat([[260, 900], [760, 1180], [1240, 1220], [1640, 950], [600, 560], [1450, 580]].map(([x, y], i) => ({ t: 'fossil', x, y, k: i, act: 'fossil', label: 'לחפור מאובן' }))),
      staff: [{ name: 'ד״ר מאובן', x: 860, y: 470, act: 'attrInfo', label: 'לדבר עם הפליאונטולוג', look: { skin: '#cf9467', hairStyle: 'short', hairColor: '#5a3825', eyes: 'round', eyeColor: '#3b2a20', shirt: 'jacket_denim', pants: 'shorts_khaki', shoes: 'boots_brown', hat: 'cowboy', glasses: 'glasses_round', bag: 'satchel', acc: null } }],
      info: 'אני חוקר דינוזאורים – פליאונטולוג! חפרו מאובנים בעמק כדי ללמוד עובדות מדהימות, ותוכלו גם לרכוב על הברכיוזאורוס החביב.',
      ride: { dur: 14, pos(o, t) { const a = t * o.sp + o.ph; const x = o.cx + Math.cos(a) * o.rx, y = o.cy + Math.sin(a) * o.ry; const dir = -Math.sin(a) > 0 ? 1 : -1; return { x: x + dir * 10, y: y - 112, sort: y + 1, dir: dir > 0 ? 'right' : 'left' }; } },
      portals: exitPortal(2000, 1350), arrivals: { plaza: [1000, 1140] },
    }),
    pirate: () => ({
      name: 'מפרץ הפיראטים', icon: '🏴‍☠️', w: 2000, h: 1300, mood: 'beach', minY: 560, bots: 3,
      water: [[0, 0, 2000, 560, 'rect']],
      ground(ctx) {
        ctx.fillStyle = U.vgrad(ctx, 0, 560, '#1f8fd1', '#5fd3f0'); ctx.fillRect(0, 0, this.w, 560);
        ctx.fillStyle = U.vgrad(ctx, 560, this.h, '#ffe7b0', '#f0cf8a'); ctx.fillRect(0, 560, this.w, this.h - 560); I.decorate(ctx, this.w, this.h - 560, 12);
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(0, 548, this.w, 16);
      },
      dyn(ctx, t) { ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 3; for (let i = 0; i < 22; i++) { const x = (i * 173 + t * 25) % (this.w + 100) - 50, y = 40 + (i * 61) % 480; ctx.beginPath(); ctx.arc(x, y, 16, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } },
      objects: [
        { t: 'ship', x: 1000, y: 420, sortY: 400 },
        { t: 'pier', x: 1000, y: 660, sortY: 0, act: 'ride', label: 'לעלות לספינה ולהפליג', ride: 1 },
        { t: 'barrel', x: 860, y: 680 }, { t: 'barrel', x: 1140, y: 690 }, { t: 'barrel', x: 1170, y: 730 },
        { t: 'parrot', x: 1300, y: 760 },
        { t: 'palm', x: 150, y: 700 }, { t: 'palm', x: 1850, y: 700, s: 1.1 }, { t: 'palm', x: 400, y: 1150 }, { t: 'palm', x: 1650, y: 1180 },
        { t: 'sandcastle', x: 600, y: 1000 }, { t: 'umbrella', x: 1500, y: 900, c: '#2b2440' },
        exitGate(2000, 1300, '#ff9a3d'),
      ].concat([[300, 850], [700, 760], [520, 1180], [1300, 1100], [1700, 900], [1000, 1150]].map(([x, y]) => ({ t: 'treasure', x, y, act: 'treasure', label: 'לחפור אוצר' }))),
      staff: [{ name: 'קפטן גל', x: 800, y: 780, act: 'attrInfo', label: 'לדבר עם הקפטן', look: { skin: '#e9b48a', hairStyle: 'long', hairColor: '#2b1d16', eyes: 'wink', eyeColor: '#3b2a20', shirt: 'stripe_navy', pants: 'pants_red', shoes: 'boots_brown', hat: 'tophat', glasses: null, bag: null, acc: 'scarf_red' } }],
      info: 'אהוי, מלחים! עלו על הספינה דרך המזח כדי להפליג, וחפשו את סימני ה-X האדומים בחול – מתחתיהם קבורים אוצרות!',
      ride: { dur: 12, pos(o, t, tl) { const ship = G.World.objs.find(x => x.t === 'ship'); const x = ship.sx || 1000, y = ship.sy || 420; return { x: x + 60, y: y - 74, sort: 401, dir: 'down' }; } },
      portals: exitPortal(2000, 1300), arrivals: { plaza: [1000, 1090] },
    }),
    space: () => ({
      name: 'תחנת החלל', icon: '🚀', w: 1900, h: 1700, mood: 'party', minY: 1000, bots: 3, night: true,
      ground(ctx) {
        ctx.fillStyle = U.vgrad(ctx, 0, 1000, '#05031a', '#2a1a6a'); ctx.fillRect(0, 0, this.w, 1000);
        const r = U.rng(8); for (let i = 0; i < 400; i++) U.circ(ctx, r() * this.w, r() * 960, r() * 1.8 + 0.3, 'rgba(255,255,255,' + (0.4 + r() * 0.6) + ')');
        U.circ(ctx, 1500, 260, 90, '#4d8dff'); U.ell(ctx, 1480, 240, 40, 26, '#3fbf6a'); U.ell(ctx, 1530, 300, 30, 16, '#3fbf6a');
        U.circ(ctx, 350, 380, 40, '#e2633a'); U.ell(ctx, 600, 160, 70, 18, null, 'rgba(240,208,138,0.7)', 4); U.circ(ctx, 600, 160, 30, '#f0d08a');
        ctx.fillStyle = U.vgrad(ctx, 980, this.h, '#8d8fa6', '#6b6d85'); ctx.beginPath(); ctx.moveTo(0, 1000); for (let x = 0; x <= this.w; x += 50) ctx.lineTo(x, 990 + Math.sin(x * 0.01) * 14); ctx.lineTo(this.w, this.h); ctx.lineTo(0, this.h); ctx.fill();
        I.decorate(ctx, this.w, this.h, 18); ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.restore();
        for (let i = 0; i < 18; i++) { const x = r() * this.w, y = 1060 + r() * 600, rr = 20 + r() * 40; U.ell(ctx, x, y, rr, rr * 0.35, '#7a7c94'); U.ell(ctx, x, y - 3, rr * 0.8, rr * 0.26, '#5f6178'); }
      },
      dyn(ctx, t) { for (let i = 0; i < 3; i++) { const x = (t * (30 + i * 15) + i * 600) % (this.w + 200) - 100, y = 120 + i * 220; ctx.save(); ctx.translate(x, y); U.fillRR(ctx, -14, -8, 28, 16, 3, '#c5c9db'); ctx.fillStyle = '#3a7bff'; ctx.fillRect(-46, -5, 28, 10); ctx.fillRect(18, -5, 28, 10); ctx.restore(); } },
      objects: [
        { t: 'rocket', x: 950, y: 1260, act: 'ride', label: 'לשגר את הטיל! 🚀', box: [900, 1230, 1000, 1270] },
        ...[0, 1, 2, 3, 4, 5, 6].map(k => ({ t: 'planet', k, x: 260 + k * 230, y: 1520, act: 'planet', label: 'ללמוד על ' + PLANETS[k][0] })),
        { t: 'tree', x: 150, y: 1150 }, { t: 'tree', x: 1750, y: 1150 }, { t: 'tree', x: 1600, y: 1350, s: 0.8 }, { t: 'tree', x: 300, y: 1330, s: 0.8 },
        { t: 'lamp', x: 650, y: 1200 }, { t: 'lamp', x: 1250, y: 1200 },
        exitGate(1900, 1700, '#7c5cff'),
      ],
      staff: [{ name: 'אסטרונאוטית נוגה', x: 700, y: 1330, act: 'attrInfo', label: 'לדבר עם האסטרונאוטית', look: { skin: '#a86c45', hairStyle: 'bun', hairColor: '#2b1d16', eyes: 'big', eyeColor: '#2f6fd6', shirt: 'suit_blue', pants: 'pants_sweat', shoes: 'shoes_white', hat: 'headphones', glasses: 'glasses_cyber', bag: 'backpack_blue', acc: null } }],
      info: 'ברוכים הבאים לתחנת החלל! לחצו על הטיל כדי לטוס לחלל, ובקרו בתצוגת כוכבי הלכת כדי ללמוד על מערכת השמש.',
      ride: { dur: 14, hide: true, pos(o, t, tl) { const p = rocketPos(o, tl); return { x: p.x, y: p.y - 150, sort: o.y, dir: 'down' }; } },
      portals: exitPortal(1900, 1700), arrivals: { plaza: [950, 1470] },
    }),
    ocean: () => ({
      name: 'העיר שמתחת למים', icon: '🐠', w: 2000, h: 1300, mood: 'home', minY: 420, bots: 3, indoor: true,
      ground(ctx) {
        ctx.fillStyle = U.vgrad(ctx, 0, this.h, '#0a4f8a', '#1fa3d6'); ctx.fillRect(0, 0, this.w, this.h);
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * 280, 0); ctx.lineTo(i * 280 + 120, 0); ctx.lineTo(i * 280 + 40, 900); ctx.lineTo(i * 280 - 60, 900); ctx.fill(); }
        ctx.fillStyle = U.vgrad(ctx, 400, this.h, '#f2dfae', '#d9bf85'); ctx.beginPath(); ctx.moveTo(0, 420); for (let x = 0; x <= this.w; x += 60) ctx.lineTo(x, 410 + Math.sin(x * 0.008) * 20); ctx.lineTo(this.w, this.h); ctx.lineTo(0, this.h); ctx.fill();
        I.decorate(ctx, this.w, this.h, 22);
        ctx.strokeStyle = 'rgba(191,230,255,0.4)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(1000, 1300, 1050, 1000, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 2; for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(1000 + Math.cos(Math.PI + i * Math.PI / 8) * 1050, 1300 + Math.sin(Math.PI + i * Math.PI / 8) * 1000); ctx.lineTo(1000, 1300); ctx.stroke(); }
      },
      dyn(ctx, t) {
        for (let s = 0; s < 3; s++) for (let i = 0; i < 7; i++) { const x = ((t * (50 + s * 20) + i * 22 + s * 700) % (this.w + 300)) - 150, y = 120 + s * 90 + Math.sin(t * 2 + i) * 10 + (i % 3) * 14; ctx.save(); ctx.translate(x, y); U.ell(ctx, 0, 0, 10, 6, ['#ffde59', '#ff9a3d', '#ff7eb6'][s]); ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-16, -6); ctx.lineTo(-16, 6); ctx.fill(); ctx.restore(); }
        for (let i = 0; i < 20; i++) U.circ(ctx, (i * 131) % this.w + Math.sin(t + i) * 8, this.h - ((t * 40 + i * 70) % this.h), 3 + (i % 3), 'rgba(255,255,255,0.35)');
      },
      objects: [
        { t: 'sub', cx: 1000, cy: 620, x: 1000, y: 650, act: 'ride', label: 'לצלול בצוללת', box: [900, 600, 1100, 660] },
        ...[0, 1, 2, 3, 4, 5].map(k => ({ t: 'creature', k, x: 260 + k * 300, y: k % 2 ? 1120 : 900, act: 'creature', label: 'ללמוד על ' + CREATURES[k][0] })),
        { t: 'tree', x: 120, y: 600 }, { t: 'tree', x: 1880, y: 620 }, { t: 'tree', x: 520, y: 760, s: 0.8 }, { t: 'tree', x: 1500, y: 760, s: 0.9 }, { t: 'tree', x: 200, y: 1200 }, { t: 'tree', x: 1820, y: 1220 },
        { t: 'seaweed', x: 400, y: 540, c: '#2fbf71' }, { t: 'seaweed', x: 1600, y: 540, c: '#3fcf7c' }, { t: 'seaweed', x: 800, y: 1250 }, { t: 'seaweed', x: 1200, y: 1250, c: '#3fcf7c' },
        exitGate(2000, 1300, '#00b8cc'),
      ],
      staff: [{ name: 'חוקרת הים מרינה', x: 760, y: 760, act: 'attrInfo', label: 'לדבר עם חוקרת הים', look: { skin: '#f7cfa6', hairStyle: 'ponytail', hairColor: '#d9412b', eyes: 'big', eyeColor: '#2e9e5b', shirt: 'hoodie_mint', pants: 'shorts_beach', shoes: 'sandals', hat: null, glasses: 'glasses_sun', bag: 'backpack_blue', acc: null } }],
      info: 'אנחנו בעיר שמתחת למים! צללו בצוללת הצהובה, והכירו את יצורי הים – לחצו על כל יצור כדי לגלות עליו עובדה מפתיעה.',
      ride: { dur: 14, hide: true, pos(o, t, tl) { const p = subPos(o, tl); return { x: p.x, y: p.y, sort: o.cy, dir: 'down' }; } },
      portals: exitPortal(2000, 1300), arrivals: { plaza: [1000, 1090] },
    }),
    future: () => ({
      name: 'פארק העתיד', icon: '🎢', w: 2200, h: 1400, mood: 'party', minY: 300, bots: 4, night: true,
      ground(ctx) {
        ctx.fillStyle = U.vgrad(ctx, 0, this.h, '#0b0820', '#1d1250'); ctx.fillRect(0, 0, this.w, this.h); I.decorate(ctx, this.w, this.h, 40);
        for (let i = 0; i < 9; i++) { const x = 60 + i * 250, h = 120 + (i * 53) % 140; U.fillRR(ctx, x, 260 - h, 120, h, 6, '#1a1440'); for (let r = 0; r < h / 24 - 1; r++) for (let c = 0; c < 4; c++) if ((r * 7 + c * 3 + i) % 3) { ctx.fillStyle = ['rgba(0,229,255,0.6)', 'rgba(255,61,240,0.6)', 'rgba(255,222,89,0.6)'][(r + c + i) % 3]; ctx.fillRect(x + 12 + c * 26, 270 - h + r * 24, 14, 10); } }
      },
      dyn(ctx, t) { for (let i = 0; i < 24; i++) { const a = t * 0.5 + i * 0.26; const x = 1100 + Math.cos(a * (i % 2 ? 1 : -1)) * (200 + (i % 4) * 60), y = 120 + Math.sin(a * 1.3) * 60; U.circ(ctx, x, y, 4, `hsl(${(i * 30 + t * 80) % 360},100%,65%)`); } },
      objects: [
        { t: 'coaster', x: 1100, y: 700, rx: 650, ry: 190, act: 'ride', label: 'לעלות על רכבת ההרים! 🎢', sortY: 520, box: [1020, 880, 1180, 930] },
        { t: 'hoverpad', x: 360, y: 1180, act: 'hover', label: 'לקחת גלשן ריחוף', sortY: 0 }, { t: 'hoverpad', x: 1840, y: 1180, act: 'hover', label: 'לקחת גלשן ריחוף', sortY: 0 },
        { t: 'holo', x: 1100, y: 1150 },
        { t: 'tree', x: 150, y: 600 }, { t: 'tree', x: 2050, y: 600 }, { t: 'tree', x: 600, y: 1250 }, { t: 'tree', x: 1600, y: 1250 }, { t: 'tree', x: 150, y: 1000 }, { t: 'tree', x: 2050, y: 1000 },
        { t: 'lamp', x: 800, y: 1080 }, { t: 'lamp', x: 1400, y: 1080 },
        exitGate(2200, 1400, '#00c2d6'),
      ],
      staff: [{ name: 'רובוטית נובה', x: 950, y: 1030, act: 'attrInfo', label: 'לדבר עם נובה', look: { skin: '#cde9ff', hairStyle: 'bob', hairColor: '#38b6ff', eyes: 'star', eyeColor: '#7c4dff', shirt: 'jacket_leather', pants: 'pants_black', shoes: 'shoes_rainbow', hat: 'halo', glasses: 'glasses_cyber', bag: null, acc: 'aura_rainbow' } }],
      info: 'ברוכים הבאים לעתיד! עלו על רכבת ההרים הזוהרת, קחו גלשן ריחוף כדי לטוס מהר בכל האי, וצפו במופע הרחפנים בשמיים.',
      ride: { dur: 13, pos(o, t) { const a = t * 0.6, rx = o.rx, ry = o.ry; const x = o.x + Math.cos(a) * rx, base = o.y + Math.sin(a) * ry, h = 90 + Math.sin(a * 2) * 70 + Math.max(0, Math.sin(a * 3 + 1)) * 60; return { x, y: base - h - 6, sort: 99999, dir: 'down', hideSelf: true }; } },
      portals: exitPortal(2200, 1400), arrivals: { plaza: [1100, 1190] },
    }),
  };
  I.dinoPos = dinoPos; I.PLANETS = PLANETS; I.CREATURES = CREATURES;
  I.FOSSILS = ['טירנוזאורוס רקס היה אחד הטורפים הגדולים ביותר שחיו על היבשה. השיניים שלו היו באורך של בננה!', 'הדינוזאורים נכחדו לפני כ-66 מיליון שנה, ככל הנראה אחרי שאסטרואיד ענק פגע בכדור הארץ.', 'מאובן נוצר כששרידים של יצור חי נקברים בשכבות של בוץ וחול, ולאורך מיליוני שנים הופכים לאבן.', 'ציפורים הן צאצאים של דינוזאורים! לכן אפשר להגיד שדינוזאורים עדיין חיים בינינו.', 'הברכיוזאורוס היה צמחוני, וצווארו הארוך עזר לו להגיע לעלים בצמרות העצים.', 'לטריצרטופס היו שלוש קרניים וצווארון עצם גדול שעזר לו להתגונן.'];

  // ---------- תצוגה מקדימה לבחירת אי ----------
  I.preview = function (isl, w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d');
    const T = isl.theme, prev = I.T; I.T = T;
    ctx.fillStyle = U.vgrad(ctx, 0, h, T.sky[0], T.sky[1]); ctx.fillRect(0, 0, w, h);
    if (T.night) { const r = U.rng(isl.grade); for (let i = 0; i < 40; i++) U.circ(ctx, r() * w, r() * h * 0.5, r() * 1.4 + 0.3, '#fff'); }
    else { U.circ(ctx, w * 0.82, h * 0.2, 18, '#fff6c2'); U.ell(ctx, w * 0.25, h * 0.18, 30, 10, 'rgba(255,255,255,0.85)'); }
    ctx.fillStyle = isl.attr === 'ocean' ? '#1f8fd1' : isl.attr === 'future' ? '#120c33' : '#4ab8e8'; ctx.fillRect(0, h * 0.62, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; for (let i = 0; i < 8; i++) ctx.fillRect((i * 47) % w, h * 0.7 + (i * 13) % (h * 0.25), 20, 2);
    ctx.save(); ctx.beginPath(); ctx.ellipse(w / 2, h * 0.68, w * 0.42, h * 0.2, 0, 0, Math.PI * 2); ctx.fillStyle = '#f0d08a'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.64, w * 0.38, h * 0.17, 0, 0, Math.PI * 2); ctx.fillStyle = U.vgrad(ctx, h * 0.5, h * 0.8, T.grass[0], T.grass[1]); ctx.fill(); ctx.clip();
    decor[T.decor] && decor[T.decor](ctx, w, h, U.rng(3)); ctx.restore();
    const tstyle = T.treeStyle === 'palm' ? 'palm' : 't_' + T.treeStyle;
    [[0.24, 0.66, 0.45], [0.76, 0.68, 0.5], [0.36, 0.76, 0.35]].forEach(([x, y, s]) => (S[tstyle] || S.tree)(ctx, { x: w * x, y: h * y, s }, 0.5, T.night));
    ctx.font = `${h * 0.32}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(isl.icon, w / 2, h * 0.5);
    I.T = prev;
    return c.toDataURL();
  };
  G.Zones.attr = I.ATTR[I.cur.attr]();
  return I;
})();
