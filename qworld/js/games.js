// ===== קיו וורלד – משחקייה: 7 משחקים קטנים =====
G.Games = (() => {
  const U = G.U, $ = U.$;
  const GW = 760, GH = 460;
  const M = { active: null };
  const emo = (ctx, e, x, y, s) => { ctx.font = `${s}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y); };
  const hud = (ctx, items) => { items.forEach((it, i) => { const x = GW - 14 - i * 150; U.fillRR(ctx, x - 136, 10, 136, 36, 18, 'rgba(20,10,50,0.55)'); G.Scn.txt(ctx, it, x - 68, 29, 17, '#ffffff', 700); }); };
  const sky = (ctx, c1, c2) => { ctx.fillStyle = U.vgrad(ctx, 0, GH, c1, c2); ctx.fillRect(0, 0, GW, GH); };

  const coin = (ctx, x, y, r) => { U.circ(ctx, x, y + 2, r, '#d99a00'); U.circ(ctx, x, y, r, '#ffd84d'); U.circ(ctx, x, y, r * 0.68, null, '#f0b400', 2); G.Scn.txt(ctx, '$', x, y + 1, r * 1.05, '#e0a000', 700); U.ell(ctx, x - r * 0.35, y - r * 0.4, r * 0.25, r * 0.15, 'rgba(255,255,255,0.8)'); };
  const gem = (ctx, x, y, r) => { ctx.beginPath(); ctx.moveTo(x - r, y - r * 0.3); ctx.lineTo(x - r * 0.5, y - r * 0.8); ctx.lineTo(x + r * 0.5, y - r * 0.8); ctx.lineTo(x + r, y - r * 0.3); ctx.lineTo(x, y + r); ctx.closePath(); ctx.fillStyle = '#5fd3ff'; ctx.fill(); ctx.strokeStyle = '#2a9fd6'; ctx.lineWidth = 2; ctx.stroke(); U.ell(ctx, x - r * 0.3, y - r * 0.45, r * 0.25, r * 0.12, 'rgba(255,255,255,0.85)'); };
  const bomb = (ctx, x, y, r, t) => { U.circ(ctx, x, y + 2, r, '#2b2d3a'); U.circ(ctx, x - r * 0.3, y - r * 0.2, r * 0.25, 'rgba(255,255,255,0.35)'); U.fillRR(ctx, x - 4, y - r - 6, 8, 8, 2, '#555'); ctx.strokeStyle = '#a8703d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - r - 6); ctx.quadraticCurveTo(x + 8, y - r - 14, x + 10, y - r - 10); ctx.stroke(); U.star(ctx, x + 11, y - r - 11, 5 + Math.sin((t || 0) * 20) * 2, 2, 5, '#ffb300'); };
  const DEFS = {};

  // ---------- 1. קדחת המטבעות ----------
  DEFS.coins = {
    name: 'קדחת המטבעות', icon: '🪙', color: '#ffb300',
    howto: ['אספו כמה שיותר מטבעות תוך 40 שניות!', '🪙 מטבע = נקודה, 💎 יהלום = 5 נקודות', '💣 פצצה מורידה 5 נקודות – היזהרו!'], controls: 'חיצים / WASD, או החזיקו את העכבר והדמות תלך אחריו',
    reward: s => Math.min(150, Math.round(s * 1.1)),
    init(g) { g.px = GW / 2; g.py = GH / 2; g.items = []; g.spawn = 0; g.time = 40; g.dir = 'down'; g.walk = 0; },
    update(g, dt) {
      g.time -= dt; if (g.time <= 0) return g.end();
      let dx = 0, dy = 0; const k = g.keys;
      if (k.arrowleft || k.a) dx--; if (k.arrowright || k.d) dx++; if (k.arrowup || k.w) dy--; if (k.arrowdown || k.s) dy++;
      if (!dx && !dy && g.pdown) { const tx = g.mx - g.px, ty = g.my - g.py, d = Math.hypot(tx, ty); if (d > 8) { dx = tx / d; dy = ty / d; } }
      g.moving = !!(dx || dy);
      if (g.moving) { const l = Math.hypot(dx, dy); g.px = U.clamp(g.px + dx / l * 300 * dt, 24, GW - 24); g.py = U.clamp(g.py + dy / l * 300 * dt, 80, GH - 10); g.walk += dt * 12; g.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); }
      g.spawn -= dt; if (g.spawn <= 0) { g.spawn = Math.max(0.22, 0.5 - (40 - g.time) * 0.006); const r = Math.random(); g.items.push({ x: U.rand(40, GW - 40), y: U.rand(100, GH - 30), k: r < 0.68 ? 'coin' : r < 0.78 ? 'gem' : 'bomb', life: 5, t: 0 }); }
      g.items.forEach(it => { it.life -= dt; it.t += dt; if (U.dist(it.x, it.y, g.px, g.py - 20) < 34) { it.life = -1; if (it.k === 'coin') { g.score += 1; G.Audio.sfx('coin'); } else if (it.k === 'gem') { g.score += 5; G.Audio.sfx('coins'); } else { g.score = Math.max(0, g.score - 5); g.flash = 0.4; G.Audio.sfx('hit'); } g.pops.push({ x: it.x, y: it.y, t: 0.7, txt: it.k === 'bomb' ? '-5' : it.k === 'gem' ? '+5' : '+1' }); } });
      g.items = g.items.filter(i => i.life > 0);
    },
    draw(g, ctx) {
      sky(ctx, '#9be88a', '#6cc464');
      for (let i = 0; i < 30; i++) U.circ(ctx, (i * 97) % GW, 80 + (i * 53) % (GH - 80), 3, 'rgba(255,255,255,0.25)');
      g.items.forEach(it => { if (it.life < 1.2 && Math.floor(it.life * 8) % 2) return; const b = Math.sin(it.t * 6) * 3; U.shadow(ctx, it.x, it.y + 14, 12, 4); if (it.k === 'coin') coin(ctx, it.x, it.y + b, 14); else if (it.k === 'gem') gem(ctx, it.x, it.y + b, 15); else bomb(ctx, it.x, it.y + b, 14, g.t); });
      G.Avatar.draw(ctx, G.P.look, g.px, g.py, { dir: g.dir, moving: g.moving, walk: g.walk, t: g.t, scale: 0.85 });
      if (g.flash > 0) { ctx.fillStyle = `rgba(255,60,60,${g.flash})`; ctx.fillRect(0, 0, GW, GH); }
      hud(ctx, [`🪙 ${g.score}`, `⏱ ${Math.ceil(g.time)}`]);
    },
  };

  // ---------- 2. מרוץ פופי ----------
  DEFS.race = {
    name: 'מרוץ פופי', icon: '🏎️', color: '#ff4d5e',
    howto: ['התחמקו מהמכוניות בכביש!', 'אספו 🪙 לבונוס של 10 נקודות', 'יש לכם 3 לבבות – המהירות עולה עם הזמן'], controls: 'חיצים ימינה/שמאלה, או לחיצה על צד המסך',
    reward: s => Math.min(150, Math.round(s / 4)),
    init(g) { g.lane = 1; g.cx = GW / 2; g.objs = []; g.speed = 320; g.dist = 0; g.lives = 3; g.inv = 0; g.spawn = 1; g.road = 0; },
    lx: l => GW / 2 + (l - 1) * 110,
    key(g, k) { if (k === 'arrowleft' || k === 'a') g.lane = Math.max(0, g.lane - 1); if (k === 'arrowright' || k === 'd') g.lane = Math.min(2, g.lane + 1); },
    pointer(g, x) { if (x < GW / 2) g.lane = Math.max(0, g.lane - 1); else g.lane = Math.min(2, g.lane + 1); },
    update(g, dt) {
      g.speed += dt * 9; g.dist += g.speed * dt; g.road = (g.road + g.speed * dt) % 80; g.score = Math.floor(g.dist / 40) + g.bonus;
      g.cx += (this.lx(g.lane) - g.cx) * Math.min(1, dt * 12); g.inv -= dt;
      g.spawn -= dt;
      if (g.spawn <= 0) { g.spawn = Math.max(0.45, 1.2 - g.speed / 1400); const lane = U.randi(0, 2); g.objs.push({ lane, y: -60, k: Math.random() < 0.3 ? 'coin' : 'car', c: U.pick(['#3a7bff', '#2fbf71', '#ffcb3c', '#9b6bff', '#ff8a3d']) }); }
      g.objs.forEach(o => { o.y += (o.k === 'car' ? g.speed * 0.6 : g.speed) * dt; const ox = this.lx(o.lane); if (Math.abs(ox - g.cx) < 50 && Math.abs(o.y - 380) < 60) { if (o.k === 'coin') { o.dead = true; g.bonus += 10; G.Audio.sfx('coin'); g.pops.push({ x: ox, y: o.y, t: 0.7, txt: '+10' }); } else if (g.inv <= 0) { g.lives--; g.inv = 1.5; G.Audio.sfx('hit'); g.flash = 0.5; if (g.lives <= 0) g.end(); } } });
      g.objs = g.objs.filter(o => !o.dead && o.y < GH + 80);
    },
    car(ctx, x, y, c, me) {
      U.shadow(ctx, x, y + 34, 30, 8); U.fillRR(ctx, x - 28, y - 46, 56, 92, 16, c); U.fillRR(ctx, x - 22, y - 28, 44, 26, 8, '#bfe6ff'); U.fillRR(ctx, x - 22, y + 12, 44, 18, 6, U.shade(c, -0.2));
      [[-30, -26], [26, -26], [-30, 22], [26, 22]].forEach(([dx, dy]) => U.fillRR(ctx, x + dx, y + dy, 8, 18, 3, '#20202c'));
      U.circ(ctx, x - 16, y + (me ? -44 : 44), 4, me ? '#fff6c2' : '#ff5d6c'); U.circ(ctx, x + 16, y + (me ? -44 : 44), 4, me ? '#fff6c2' : '#ff5d6c');
    },
    draw(g, ctx) {
      ctx.fillStyle = '#5cc95a'; ctx.fillRect(0, 0, GW, GH);
      for (let i = 0; i < 8; i++) { const y = ((i * 90 + g.road * 1.5) % (GH + 90)) - 45; U.circ(ctx, 90, y, 26, '#3fae4b'); U.circ(ctx, GW - 90, y + 40, 26, '#3fae4b'); }
      ctx.fillStyle = '#4b4e63'; ctx.fillRect(GW / 2 - 175, 0, 350, GH); ctx.fillStyle = '#ffffff'; ctx.fillRect(GW / 2 - 175, 0, 6, GH); ctx.fillRect(GW / 2 + 169, 0, 6, GH);
      ctx.fillStyle = '#ffde59'; for (let y = -80 + g.road; y < GH; y += 80) { ctx.fillRect(GW / 2 - 58, y, 6, 44); ctx.fillRect(GW / 2 + 52, y, 6, 44); }
      g.objs.forEach(o => { const x = this.lx(o.lane); if (o.k === 'car') this.car(ctx, x, o.y, o.c); else coin(ctx, x, o.y, 16); });
      if (!(g.inv > 0 && Math.floor(g.inv * 10) % 2)) { this.car(ctx, g.cx, 380, '#ff4d5e', true); G.Avatar.draw(ctx, G.P.look, g.cx, 378, { dir: 'up', t: g.t, scale: 0.42, noShadow: true }); }
      if (g.flash > 0) { ctx.fillStyle = `rgba(255,60,60,${g.flash})`; ctx.fillRect(0, 0, GW, GH); }
      hud(ctx, [`🏁 ${g.score}`, '❤️'.repeat(Math.max(0, g.lives)) || '💔']);
    },
  };

  // ---------- 3. קפיצה גבוהה ----------
  DEFS.jump = {
    name: 'קפיצה גבוהה', icon: '🦘', color: '#2fbf71',
    howto: ['רוצו כמה שיותר רחוק!', 'קפצו מעל מכשולים – אפשר גם קפיצה כפולה באוויר', 'אספו 🪙 לבונוס של 5 נקודות'], controls: 'רווח / חץ למעלה / לחיצה = קפיצה',
    reward: s => Math.min(150, Math.round(s / 5)),
    init(g) { g.y = 380; g.vy = 0; g.jumps = 0; g.speed = 320; g.obs = []; g.spawn = 1.2; g.dist = 0; g.bg = 0; },
    jump(g) { if (g.jumps < 2) { g.vy = g.jumps ? -560 : -650; g.jumps++; G.Audio.sfx('jump'); } },
    key(g, k) { if (k === ' ' || k === 'arrowup' || k === 'w') this.jump(g); },
    pointer(g) { this.jump(g); },
    update(g, dt) {
      g.speed += dt * 10; g.dist += g.speed * dt; g.bg += g.speed * dt; g.score = Math.floor(g.dist / 30) + g.bonus;
      g.vy += 1900 * dt; g.y += g.vy * dt; if (g.y >= 380) { g.y = 380; g.vy = 0; g.jumps = 0; }
      g.spawn -= dt;
      if (g.spawn <= 0) { g.spawn = U.rand(0.8, 1.6) * (360 / g.speed) + 0.35; const r = Math.random(); const o = r < 0.4 ? { k: 'box', w: 40, h: 40 } : r < 0.65 ? { k: 'tall', w: 32, h: 72 } : r < 0.85 ? { k: 'bird', w: 44, h: 30, fy: 300 } : { k: 'coin', w: 30, h: 30, fy: U.rand(220, 330) }; o.x = GW + 40; g.obs.push(o); }
      g.obs.forEach(o => { o.x -= g.speed * dt; const top = o.fy ? o.fy - o.h / 2 : 380 - o.h, bot = o.fy ? o.fy + o.h / 2 : 380; const px0 = 140 - 14, px1 = 140 + 14, py0 = g.y - 70, py1 = g.y; if (px1 > o.x - o.w / 2 && px0 < o.x + o.w / 2 && py1 > top + 4 && py0 < bot) { if (o.k === 'coin') { o.dead = true; g.bonus += 5; G.Audio.sfx('coin'); g.pops.push({ x: o.x, y: top, t: 0.7, txt: '+5' }); } else { G.Audio.sfx('hit'); g.end(); } } });
      g.obs = g.obs.filter(o => !o.dead && o.x > -60);
    },
    draw(g, ctx) {
      sky(ctx, '#8fd8ff', '#e3f6ff');
      for (let i = 0; i < 5; i++) { const x = ((i * 220 - g.bg * 0.2) % (GW + 200) + GW + 200) % (GW + 200) - 100; U.ell(ctx, x, 80 + (i % 2) * 40, 50, 18, 'rgba(255,255,255,0.9)'); U.ell(ctx, x + 30, 70 + (i % 2) * 40, 34, 16, 'rgba(255,255,255,0.9)'); }
      for (let i = 0; i < 6; i++) { const x = ((i * 180 - g.bg * 0.5) % (GW + 180) + GW + 180) % (GW + 180) - 90; U.ell(ctx, x, 380, 120, 90, '#7fd67a'); }
      ctx.fillStyle = '#c9905a'; ctx.fillRect(0, 380, GW, 80); ctx.fillStyle = '#5cc95a'; ctx.fillRect(0, 380, GW, 14);
      ctx.fillStyle = 'rgba(0,0,0,0.08)'; for (let x = -((g.bg) % 40); x < GW; x += 40) ctx.fillRect(x, 400, 20, 6);
      g.obs.forEach(o => {
        if (o.k === 'box') { U.fillRR(ctx, o.x - 20, 340, 40, 40, 4, '#c08a4d', '#7a4a2c', 3); ctx.strokeStyle = '#7a4a2c'; ctx.beginPath(); ctx.moveTo(o.x - 18, 342); ctx.lineTo(o.x + 18, 378); ctx.moveTo(o.x + 18, 342); ctx.lineTo(o.x - 18, 378); ctx.stroke(); }
        else if (o.k === 'tall') { U.fillRR(ctx, o.x - 16, 308, 32, 72, 14, '#3fae4b'); U.fillRR(ctx, o.x - 28, 330, 14, 26, 7, '#3fae4b'); U.fillRR(ctx, o.x + 14, 320, 14, 26, 7, '#3fae4b'); }
        else if (o.k === 'bird') { const f = Math.sin(g.t * 16) * 8; U.ell(ctx, o.x, o.fy, 18, 12, '#ff7eb6'); U.ell(ctx, o.x + 2, o.fy - 6 + f, 14, 6, '#ff9ec7'); U.circ(ctx, o.x - 12, o.fy - 4, 7, '#ff7eb6'); U.circ(ctx, o.x - 14, o.fy - 6, 2, '#000'); ctx.fillStyle = '#ffb300'; ctx.beginPath(); ctx.moveTo(o.x - 19, o.fy - 4); ctx.lineTo(o.x - 27, o.fy - 1); ctx.lineTo(o.x - 19, o.fy + 1); ctx.fill(); }
        else coin(ctx, o.x, o.fy, 14);
      });
      G.Avatar.draw(ctx, G.P.look, 140, g.y, { dir: 'right', moving: g.y >= 380, walk: g.t * 14, t: g.t, scale: 0.85 });
      hud(ctx, [`🏃 ${g.score}`]);
    },
  };

  // ---------- 4. זיכרון קסום ----------
  DEFS.memory = {
    name: 'זיכרון קסום', icon: '🃏', color: '#7c5cff',
    howto: ['מצאו את כל 8 הזוגות!', 'פחות ניסיונות ופחות זמן = יותר נקודות'], controls: 'לחיצה על הקלפים',
    reward: s => Math.min(150, Math.round(s / 2)),
    init(g) {
      const e = U.shuffle(['🦄', '🐙', '🍩', '🚀', '🌈', '🐸', '🍉', '⭐', '🎈', '🦊', '🍭', '🐧']).slice(0, 8);
      g.cards = U.shuffle(e.concat(e)).map((s, i) => ({ s, i, open: false, done: false, flip: 0 }));
      g.first = null; g.lock = 0; g.moves = 0; g.elapsed = 0; g.found = 0;
    },
    pos(i) { const c = i % 4, r = Math.floor(i / 4); return [GW / 2 - 2 * 98 + c * 98 + 49 - 0, 70 + r * 96 + 44]; },
    pointer(g, x, y) {
      if (g.lock > 0) return;
      for (const c of g.cards) { const [cx, cy] = this.pos(c.i); if (Math.abs(x - cx) < 42 && Math.abs(y - cy) < 42 && !c.open && !c.done) {
        c.open = true; G.Audio.sfx('flip');
        if (!g.first) g.first = c;
        else { g.moves++; const a = g.first; g.first = null; if (a.s === c.s) { a.done = c.done = true; g.found++; G.Audio.sfx('good'); g.pops.push({ x: cx, y: cy - 30, t: 0.8, txt: '✨' }); if (g.found === 8) { g.score = Math.max(20, 300 - g.moves * 8 - Math.floor(g.elapsed) * 2); setTimeout(() => g.end(), 600); } } else { g.lock = 0.8; g.pending = [a, c]; } }
        break; } }
    },
    update(g, dt) {
      if (g.found < 8) g.elapsed += dt;
      if (g.lock > 0) { g.lock -= dt; if (g.lock <= 0 && g.pending) { g.pending.forEach(c => c.open = false); g.pending = null; G.Audio.sfx('bad'); } }
      g.cards.forEach(c => { const tgt = c.open || c.done ? 1 : 0; c.flip += (tgt - c.flip) * Math.min(1, dt * 12); });
    },
    draw(g, ctx) {
      sky(ctx, '#3a2a7a', '#7c5cff');
      for (let i = 0; i < 40; i++) U.star(ctx, (i * 137) % GW, (i * 71) % GH, 2.5, 1, 4, 'rgba(255,255,255,0.35)');
      g.cards.forEach(c => {
        const [x, y] = this.pos(c.i), w = 84 * Math.abs(c.flip * 2 - 1), front = c.flip > 0.5;
        ctx.save(); ctx.translate(x, y);
        if (front) { U.fillRR(ctx, -w / 2, -42, w, 84, 12, c.done ? '#e9fff4' : '#ffffff', c.done ? '#5fe0b7' : '#c9b0ff', 4); ctx.scale(w / 84 || 0.01, 1); emo(ctx, c.s, 0, 2, 44); }
        else { U.fillRR(ctx, -w / 2, -42, w, 84, 12, '#ff7eb6', '#ffffff', 4); ctx.scale(w / 84 || 0.01, 1); G.Scn.txt(ctx, '?', 0, 2, 36, '#ffffff', 700); }
        ctx.restore();
      });
      hud(ctx, [`🔁 ${g.moves}`, `⏱ ${Math.floor(g.elapsed)}`, `✨ ${g.found}/8`]);
    },
  };

  // ---------- 5. גשם פירות ----------
  DEFS.catch = {
    name: 'גשם פירות', icon: '🍓', color: '#ff5fa8',
    howto: ['תפסו פירות בסל! 🍎 = נקודה', '⭐ כוכב זהב = 5 נקודות', '💣 פצצה מורידה לב – יש 3 לבבות'], controls: 'הזיזו את העכבר או השתמשו בחיצים',
    reward: s => Math.min(150, Math.round(s * 1.3)),
    init(g) { g.bx = GW / 2; g.items = []; g.spawn = 0.6; g.lives = 3; g.el = 0; },
    update(g, dt) {
      g.el += dt;
      if (g.keys.arrowleft || g.keys.a) g.bx -= 420 * dt; if (g.keys.arrowright || g.keys.d) g.bx += 420 * dt;
      if (g.mx != null && g.mouseMoved) g.bx += (g.mx - g.bx) * Math.min(1, dt * 14);
      g.bx = U.clamp(g.bx, 50, GW - 50);
      g.spawn -= dt;
      if (g.spawn <= 0) { g.spawn = Math.max(0.28, 0.75 - g.el * 0.008); const r = Math.random(); g.items.push({ x: U.rand(30, GW - 30), y: -20, v: 160 + g.el * 4 + U.rand(0, 80), k: r < 0.72 ? U.pick(['🍎', '🍌', '🍇', '🍓', '🍊', '🍑']) : r < 0.82 ? '⭐' : '💣', r: U.rand(-2, 2) }); }
      g.items.forEach(it => { it.y += it.v * dt; if (it.y > 380 && it.y < 410 && Math.abs(it.x - g.bx) < 52) { it.dead = true; if (it.k === '💣') { g.lives--; G.Audio.sfx('hit'); g.flash = 0.5; if (g.lives <= 0) g.end(); } else { const p = it.k === '⭐' ? 5 : 1; g.score += p; G.Audio.sfx(p > 1 ? 'coins' : 'pop'); g.pops.push({ x: it.x, y: 360, t: 0.7, txt: '+' + p }); } } });
      g.items = g.items.filter(i => !i.dead && i.y < GH + 30);
    },
    draw(g, ctx) {
      sky(ctx, '#ffd6e8', '#fff3e6');
      U.ell(ctx, 120, 470, 220, 90, '#9be88a'); U.ell(ctx, 640, 480, 260, 100, '#8fdc7f');
      g.items.forEach(it => emo(ctx, it.k, it.x, it.y, 34));
      const x = g.bx;
      U.shadow(ctx, x, 432, 56, 8);
      ctx.fillStyle = '#c08a4d'; ctx.beginPath(); ctx.moveTo(x - 56, 384); ctx.lineTo(x + 56, 384); ctx.lineTo(x + 44, 428); ctx.lineTo(x - 44, 428); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#8a5a36'; ctx.lineWidth = 3; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 20, 386); ctx.lineTo(x + i * 16, 426); ctx.stroke(); }
      U.fillRR(ctx, x - 60, 378, 120, 10, 5, '#a8703d');
      if (g.flash > 0) { ctx.fillStyle = `rgba(255,60,60,${g.flash})`; ctx.fillRect(0, 0, GW, GH); }
      hud(ctx, [`🧺 ${g.score}`, '❤️'.repeat(Math.max(0, g.lives)) || '💔']);
    },
  };

  // ---------- 6. חידון פופי ----------
  DEFS.trivia = {
    name: 'חידון פופי', icon: '🧠', color: '#3a7bff', dom: true,
    howto: ['8 שאלות טריוויה – 15 שניות לכל שאלה', 'כל תשובה נכונה = 10 נקודות + בונוס מהירות', 'ענו נכון על הכל וקבלו בונוס גאונים!'], controls: 'לחיצה על התשובה (או מקשים 1-4)',
    reward: s => Math.min(150, Math.round(s * 1.1)),
    init(g) { g.qs = U.shuffle(G.DATA.TRIVIA).slice(0, 8); g.qi = -1; g.correct = 0; this.next(g); },
    next(g) {
      g.qi++; if (g.qi >= g.qs.length) { if (g.correct === 8) { g.score += 30; G.P.stats.triviaPerfect = 1; G.Econ.checkAch(); } return g.end(); }
      const [q, ans] = g.qs[g.qi]; g.right = ans[0]; g.opts = U.shuffle(ans); g.qt = 15; g.answered = false;
      g.stage.innerHTML = `<div class="trivia"><div class="tq-top"><span>שאלה ${g.qi + 1} מתוך 8</span><span>✅ ${g.correct}</span><span>⭐ ${g.score}</span></div><div class="tbar"><i></i></div><h3>${U.esc(q)}</h3><div class="tans">${g.opts.map((o, i) => `<button data-i="${i}"><em>${i + 1}</em>${U.esc(o)}</button>`).join('')}</div></div>`;
      U.$$('.tans button', g.stage).forEach(b => b.onclick = () => this.answer(g, +b.dataset.i));
    },
    answer(g, i) {
      if (g.answered) return; g.answered = true;
      const btns = U.$$('.tans button', g.stage), ok = i >= 0 && g.opts[i] === g.right;
      btns.forEach((b, j) => { if (g.opts[j] === g.right) b.classList.add('ok'); else if (j === i) b.classList.add('bad'); b.disabled = true; });
      if (ok) { g.correct++; g.score += 10 + Math.ceil(g.qt / 3); G.Audio.sfx('good'); G.Econ.track('trivia_correct'); } else G.Audio.sfx('bad');
      setTimeout(() => { if (M.active === g) this.next(g); }, 1100);
    },
    key(g, k) { const n = parseInt(k, 10); if (n >= 1 && n <= 4) this.answer(g, n - 1); },
    update(g, dt) { if (g.answered || g.qi >= g.qs.length) return; g.qt -= dt; const bar = $('.tbar i', g.stage); if (bar) bar.style.width = Math.max(0, g.qt / 15 * 100) + '%'; if (g.qt <= 0) this.answer(g, -1); },
    draw() { },
  };

  // ---------- 7. פופ מהיר ----------
  DEFS.reaction = {
    name: 'פופ מהיר', icon: '🎯', color: '#00b8cc',
    howto: ['פוצצו בועות לפני שהן נעלמות!', 'פיצוצים ברצף נותנים בונוס קומבו 🔥', '5 בועות שפוספסו – המשחק נגמר (או אחרי 35 שניות)'], controls: 'לחיצה על הבועות',
    reward: s => Math.min(150, Math.round(s / 6)),
    init(g) { g.bub = []; g.spawn = 0.3; g.miss = 0; g.combo = 0; g.time = 35; },
    pointer(g, x, y) {
      let hit = false;
      for (let i = g.bub.length - 1; i >= 0; i--) { const b = g.bub[i]; if (U.dist(x, y, b.x, b.y) < b.r) { g.bub.splice(i, 1); g.combo++; const p = 10 + Math.min(20, g.combo * 2); g.score += p; G.Audio.sfx('pop'); g.pops.push({ x: b.x, y: b.y, t: 0.6, txt: '+' + p }); for (let k = 0; k < 8; k++) g.parts.push({ x: b.x, y: b.y, vx: U.rand(-200, 200), vy: U.rand(-200, 200), t: 0.5, c: b.c }); hit = true; break; } }
      if (!hit) g.combo = 0;
    },
    update(g, dt) {
      g.time -= dt; if (g.time <= 0) return g.end();
      g.spawn -= dt;
      if (g.spawn <= 0) { g.spawn = Math.max(0.32, 0.75 - (35 - g.time) * 0.012); g.bub.push({ x: U.rand(50, GW - 50), y: U.rand(80, GH - 40), t: 0, life: Math.max(1.1, 2 - (35 - g.time) * 0.025), c: U.pick(['#ff7eb6', '#5fe0b7', '#ffde59', '#8fe3ff', '#c39bff']), r: 0 }); }
      g.bub.forEach(b => { b.t += dt; const k = b.t / b.life; b.r = 38 * Math.sin(Math.min(1, k) * Math.PI) + 8; if (k >= 1) { b.dead = true; g.miss++; g.combo = 0; G.Audio.sfx('bad'); if (g.miss >= 5) g.end(); } });
      g.bub = g.bub.filter(b => !b.dead);
      g.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.t -= dt; }); g.parts = g.parts.filter(p => p.t > 0);
    },
    draw(g, ctx) {
      sky(ctx, '#0b2a4a', '#155f86');
      for (let i = 0; i < 25; i++) U.circ(ctx, (i * 131) % GW, (GH - ((g.t * 30 + i * 47) % GH)), 3, 'rgba(255,255,255,0.15)');
      g.bub.forEach(b => { const gr = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 2, b.x, b.y, b.r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.35, U.rgba(b.c, 0.9)); gr.addColorStop(1, U.rgba(b.c, 0.5)); U.circ(ctx, b.x, b.y, b.r, gr, 'rgba(255,255,255,0.8)', 2); });
      g.parts.forEach(p => U.circ(ctx, p.x, p.y, 4 * p.t * 2, p.c));
      hud(ctx, [`🎯 ${g.score}`, `⏱ ${Math.ceil(g.time)}`, `❌ ${g.miss}/5`]);
      if (g.combo >= 3) G.Scn.txt(ctx, `🔥 קומבו ×${g.combo}`, 90, 30, 18, '#ffde59', 700);
    },
  };

  // ---------- מסגרת משחק ----------
  M.open = function (id) {
    const def = DEFS[id]; if (!def) return;
    const best = G.P.best[id] || 0;
    const ov = U.el(`<div id="gameOverlay"><div class="game-box" style="--accent:${def.color}">
      <div class="game-head"><span class="gi">${def.icon}</span><h2>${def.name}</h2><span class="gbest">🏆 שיא: ${best}</span><button class="x">✕</button></div>
      <div class="game-stage"><canvas width="${GW}" height="${GH}"></canvas><div class="game-dom"></div><div class="game-screen"></div></div></div></div>`);
    document.body.appendChild(ov);
    const cv = $('canvas', ov), ctx = cv.getContext('2d'), stage = $('.game-dom', ov), screen = $('.game-screen', ov);
    const g = { def, id, ctx, stage, ov, keys: {}, pops: [], parts: [], score: 0, bonus: 0, t: 0, running: false, flash: 0 };
    M.active = g;
    G.Audio.sfx('open');
    const close = () => { if (!ov.isConnected) return; g.running = false; M.active = null; ov.remove(); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); G.Audio.setMood(G.World.zone.mood); };
    $('.x', ov).onclick = close;
    const kd = e => { const k = e.key.toLowerCase(); if (k === 'escape') return close(); if (!g.running) { if (k === 'enter' || k === ' ') { const b = $('.start', screen); if (b) { e.preventDefault(); b.click(); } } return; } g.keys[k] = true; def.key && def.key(g, k); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault(); };
    const ku = e => { g.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    const toLocal = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * GW / r.width, (e.clientY - r.top) * GH / r.height]; };
    cv.addEventListener('pointerdown', e => { if (!g.running) return; const [x, y] = toLocal(e); g.pdown = true; g.mx = x; g.my = y; def.pointer && def.pointer(g, x, y); });
    cv.addEventListener('pointermove', e => { const [x, y] = toLocal(e); g.mx = x; g.my = y; g.mouseMoved = true; });
    window.addEventListener('pointerup', () => { g.pdown = false; });

    const intro = () => {
      screen.className = 'game-screen on';
      screen.innerHTML = `<div class="gs-card"><div class="gs-icon">${def.icon}</div><h3>${def.name}</h3><ul>${def.howto.map(h => `<li>${h}</li>`).join('')}</ul><p class="ctrl">🎮 ${def.controls}</p><p class="rw">🪙 מרוויחים מטבעות לפי הניקוד (עד 150 למשחק)</p><button class="btn primary big start">▶ התחלה</button></div>`;
      $('.start', screen).onclick = start;
    };
    const start = () => {
      G.Audio.init(); G.Audio.sfx('click'); G.Audio.setMood('party');
      Object.assign(g, { pops: [], parts: [], score: 0, bonus: 0, t: 0, flash: 0, over: false, keys: {} });
      stage.innerHTML = ''; stage.classList.toggle('on', !!def.dom);
      def.init(g);
      screen.className = 'game-screen'; screen.innerHTML = '';
      g.running = true; g.last = performance.now();
      countdown = def.dom ? 0 : 1.2;
      requestAnimationFrame(frame);
    };
    let countdown = 0;
    g.end = () => {
      if (g.over) return; g.over = true; g.running = false;
      const P = G.P, prev = P.best[id] || 0, rec = g.score > prev;
      if (rec) P.best[id] = g.score;
      const coins = def.reward(g.score), xp = Math.max(10, Math.round(coins / 2) + 10);
      P.stats.games = (P.stats.games || 0) + 1;
      G.Econ.track('play_game'); G.bus.emit('gameEnd', id);
      setTimeout(() => {
        screen.className = 'game-screen on';
        screen.innerHTML = `<div class="gs-card result"><div class="gs-icon">${rec && g.score > 0 ? '🏆' : '🎮'}</div><h3>${rec && g.score > 0 ? 'שיא חדש!' : 'סוף המשחק'}</h3><div class="score-big">${g.score}</div><p>נקודות • השיא שלכם: ${Math.max(prev, g.score)}</p><div class="reward-row"><span class="reward-chip">🪙 +${coins}</span><span class="reward-chip xp">⭐ +${xp} XP</span></div><div class="row"><button class="btn primary big start">🔄 שוב</button><button class="btn ghost big back">🌍 חזרה לעולם</button></div></div>`;
        $('.start', screen).onclick = start; $('.back', screen).onclick = close;
        $('.gbest', ov).textContent = '🏆 שיא: ' + Math.max(prev, g.score);
        const r = $('.reward-chip', screen).getBoundingClientRect();
        G.Econ.addCoins(coins, 'game', [r.left + r.width / 2, r.top]); G.Econ.addXP(xp); G.Econ.checkAch();
        if (rec && g.score > 0) G.UI.confetti(1.6);
        G.Store.save(P);
      }, 450);
    };
    const frame = (ts) => {
      if (!ov.isConnected) return;
      const dt = Math.min(0.05, (ts - g.last) / 1000); g.last = ts;
      if (g.running) {
        if (countdown > 0) { countdown -= dt; }
        else { g.t += dt; def.update(g, dt); }
        g.flash = Math.max(0, g.flash - dt);
        g.pops.forEach(p => p.t -= dt); g.pops = g.pops.filter(p => p.t > 0);
      }
      if (!def.dom) {
        ctx.save(); def.draw(g, ctx);
        g.pops.forEach(p => G.Scn.txt(ctx, p.txt, p.x, p.y - (0.7 - p.t) * 50, 22, '#ffffff', 700, 'rgba(40,20,80,0.7)'));
        if (g.running && countdown > 0) { ctx.fillStyle = 'rgba(20,10,50,0.35)'; ctx.fillRect(0, 0, GW, GH); G.Scn.txt(ctx, countdown > 0.6 ? 'היכון...' : 'צא! 🚀', GW / 2, GH / 2, 56, '#ffffff', 700, '#3a2d55'); }
        ctx.restore();
      }
      if (g.running || g.over) requestAnimationFrame(frame);
    };
    // תמונת פתיחה
    def.init(g); if (!def.dom) def.draw(g, ctx); else { ctx.fillStyle = U.vgrad(ctx, 0, GH, '#3a7bff', '#7c5cff'); ctx.fillRect(0, 0, GW, GH); }
    intro();
  };
  M.DEFS = DEFS;
  return M;
})();
