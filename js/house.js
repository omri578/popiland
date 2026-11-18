// ===== קיו וורלד – בית אישי ועיצוב =====
G.House = (() => {
  const U = G.U, D = G.DATA, $ = U.$;
  const H = { edit: false, sel: null, guests: [] };
  const WALL_H = 190;
  const SEATS = { sofa: 1, armchair: 1, chair: 1, beanbag: 1, throne: 1 };

  H.dataFor = function (owner) {
    const P = G.P;
    if (P && owner === P.name) return P.house;
    const remote = G.Net.findByName(owner);
    if (remote && remote.house) return remote.house;
    // בית של בוט – נוצר באופן קבוע מהשם
    const r = U.rng(U.hash(owner + 'home'));
    const lvl = Math.floor(r() * 4), L = D.HOUSE_LEVELS[lvl];
    const furn = D.ITEM_LIST.filter(i => i.cat === 'furn');
    const items = [];
    const n = 6 + Math.floor(r() * 5) + lvl * 2;
    const rug = furn.filter(i => G.Furn.SIZE[i.style].flat);
    items.push({ id: rug[Math.floor(r() * rug.length)].id, x: L.w / 2, y: WALL_H + (L.h - WALL_H) * 0.62 });
    const solid = furn.filter(i => !G.Furn.SIZE[i.style].flat);
    for (let i = 0; i < n; i++) {
      const it = solid[Math.floor(r() * solid.length)];
      const along = i % 2 === 0;
      const x = 90 + r() * (L.w - 180), y = along ? WALL_H + 50 + r() * 30 : WALL_H + 120 + r() * (L.h - WALL_H - 220);
      items.push({ id: it.id, x: Math.round(x), y: Math.round(y), f: r() < 0.5 });
    }
    return { lvl, wall: Math.floor(r() * D.WALLS.length), floor: Math.floor(r() * D.FLOORS.length), items, bot: true };
  };

  H.buildZone = function (owner) {
    const data = H.dataFor(owner), L = D.HOUSE_LEVELS[data.lvl] || D.HOUSE_LEVELS[0];
    const mine = G.P && owner === G.P.name;
    const Z = {
      name: mine ? 'הבית שלי' : 'הבית של ' + owner, icon: '🏠', w: L.w, h: L.h, mood: 'home', minY: WALL_H + 8, indoor: true,
      owner, mine, data,
      ground(ctx) {
        const wc = D.WALLS[data.wall] || D.WALLS[0], fl = D.FLOORS[data.floor] || D.FLOORS[0];
        G.Zones.GR.wall(ctx, this.w, WALL_H, wc, U.shade(wc, -0.3));
        // טפט
        ctx.fillStyle = U.rgba(U.shade(wc, -0.4), 0.08); for (let x = 20; x < this.w; x += 46) for (let y = 20; y < WALL_H - 30; y += 46) U.star(ctx, x + (y / 46 % 2) * 23, y, 5, 2, 4, U.rgba(U.shade(wc, -0.4), 0.1));
        // חלונות
        const nw = Math.max(2, Math.floor(this.w / 360));
        for (let i = 0; i < nw; i++) { const x = (i + 0.5) * this.w / nw; U.fillRR(ctx, x - 70, 34, 140, 104, 10, '#bfe6ff', '#ffffff', 8); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 3, 34, 6, 104); ctx.fillRect(x - 70, 82, 140, 6); U.circ(ctx, x + 36, 60, 12, '#fff6c2'); U.fillRR(ctx, x - 84, 30, 30, 120, 8, U.rgba('#ff7eb6', 0.8)); U.fillRR(ctx, x + 54, 30, 30, 120, 8, U.rgba('#ff7eb6', 0.8)); }
        // רצפה
        const fy = WALL_H, fh = this.h - WALL_H;
        if (fl.id === 'wood' || fl.id === 'pinkwood') G.Zones.GR.wood(ctx, 0, fy, this.w, fh, fl.c1, fl.c2);
        else if (fl.id === 'grass') G.Zones.GR.grass.call(null, ctx, this.w, this.h, fl.c1, fl.c2, 5), ctx.fillStyle = U.vgrad(ctx, 0, WALL_H, U.shade(wc, 0.1), wc), G.Zones.GR.wall(ctx, this.w, WALL_H, wc, U.shade(wc, -0.3));
        else G.Zones.GR.tiles(ctx, 0, fy, this.w, fh, fl.c1, fl.c2, fl.id === 'carpet' ? 40 : 64);
        ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, fy, this.w, 8);
        // דלת
        U.fillRR(ctx, this.w / 2 - 70, this.h - 30, 140, 30, 10, '#7c5cff'); G.Scn.txt(ctx, '⬇ יציאה לשכונה', this.w / 2, this.h - 15, 14, '#fff');
      },
      objects: [],
      portals: [{ r: [L.w / 2 - 70, L.h - 24, L.w / 2 + 70, L.h], to: 'residential' }],
      arrivals: {}, spawn: [L.w / 2, L.h - 70],
    };
    Z.objects = data.items.map((f, i) => H.furnObj(f, i)).filter(Boolean);
    return Z;
  };
  H.furnObj = function (f, i) {
    const it = D.ITEMS[f.id]; if (!it) return null;
    const sz = G.Furn.SIZE[it.style];
    const o = { t: 'furn', furn: it, x: f.x, y: f.y, flip: !!f.f, ref: f, _i: i, flat: !!sz.flat };
    if (!sz.flat) o.box = [f.x - sz.w / 2 + 6, f.y - sz.d, f.x + sz.w / 2 - 6, f.y];
    if (SEATS[it.style]) { o.act = 'sit'; o.label = 'לשבת'; o.sitFurn = true; }
    if (it.style === 'piano') { o.act = 'piano'; o.label = 'לנגן בפסנתר'; }
    if (it.style === 'jukebox') { o.act = 'jukebox'; o.label = 'להפעיל מוזיקה'; }
    if (it.style === 'arcade') { o.act = 'game:' + U.pick(['coins', 'race', 'jump', 'catch']); o.label = 'לשחק'; }
    return o;
  };
  H.boxOf = (o) => o.box || null;

  H.populate = function (W) {
    const Z = W.zone;
    if (!Z.mine) {
      const b = W.bots.find(x => x.name === Z.owner);
      if (b) { const c = W.mkChar({ name: b.name, look: b.look, x: Z.w / 2 + 60, y: Z.h - 160, kind: 'bot', lvl: b.lvl }); c.bot = b; c.idle = 2; c.chatT = 4; W.chars.push(c); setTimeout(() => { if (c && !c.gone) { W.say(c, `ברוכים הבאים לבית שלי, ${G.P.name}! 🏡`); W.emote('wave', c); } }, 900); }
    } else {
      H.guests.forEach(name => { const b = W.bots.find(x => x.name === name); if (!b) return; const p = W.randomSpot(); const c = W.mkChar({ name: b.name, look: b.look, x: p[0], y: p[1], kind: 'bot', lvl: b.lvl }); c.bot = b; c.idle = 2; c.chatT = 3 + Math.random() * 8; W.chars.push(c); });
    }
  };

  H.goHome = function (edit) {
    const P = G.P;
    if (G.World.zoneId === 'house' && G.World.zone.mine) { if (edit !== false) H.openEditor(); return; }
    G.World.go('house', { owner: P.name });
    if (edit) setTimeout(() => H.openEditor(), 900);
  };
  H.visit = function (name) {
    if (name === G.P.name) return H.goHome();
    const isBot = G.World.bots.some(b => b.name === name);
    const remote = G.Net.findByName(name);
    if (!isBot && !(remote && remote.house)) { G.UI.toast('אי אפשר לבקר בבית הזה כרגע'); return; }
    if (G.World.zoneId !== 'residential' && G.World.zoneId !== 'house') G.UI.toast('🚶 יוצאים לשכונת הדובדבן...');
    G.World.go('house', { owner: name });
  };

  // ---------- אינטראקציות בבית ----------
  const actsRun = G.Acts.run.bind(G.Acts);
  G.Acts.run = function (act, tgt) {
    if (act === 'piano') { const notes = [72, 76, 79, 84, 79, 76, 72, 74, 77, 81]; notes.forEach((n, i) => setTimeout(() => G.Audio.ctx && G.Audio.note(n, G.Audio.ctx.currentTime, 0.4, 'triangle', 0.2), i * 140)); G.World.emote('happy'); G.World.floatText(tgt.x, tgt.y - 110, '🎵🎶'); return; }
    if (act === 'jukebox') { G.Audio.setMood(G.Audio.mood === 'party' ? 'home' : 'party'); G.World.emote('dance'); G.UI.toast(G.Audio.mood === 'party' ? '🎶 מסיבה בבית!' : '🎵 מוזיקה רגועה'); return; }
    return actsRun(act, tgt);
  };

  // ---------- עורך הבית ----------
  H.openEditor = function () {
    const W = G.World, P = G.P;
    if (!(W.zoneId === 'house' && W.zone.mine)) return;
    if (H.edit) return;
    H.edit = true; H.sel = null; W.standUp(W.player); document.body.classList.add('editing');
    const bar = U.el(`<div id="houseBar">
      <div class="hb-head"><b>🏠 עיצוב הבית</b><span class="hb-lvl"></span><div class="hb-tabs"><button data-t="furn" class="on">🛋️ רהיטים</button><button data-t="walls">🎨 קירות ורצפה</button><button data-t="up">⬆️ שדרוג</button><button data-t="inv">💌 הזמנת חברים</button></div><button class="btn primary sm done">✔ סיום</button></div>
      <div class="hb-body"></div><div class="hb-sel"></div></div>`);
    document.body.appendChild(bar);
    let tab = 'furn';
    U.$$('.hb-tabs button', bar).forEach(b => b.onclick = () => { tab = b.dataset.t; U.$$('.hb-tabs button', bar).forEach(x => x.classList.toggle('on', x === b)); render(); });
    $('.done', bar).onclick = () => H.closeEditor();
    H.bar = bar;
    const rebuild = () => { const pos = [W.player.x, W.player.y]; W.zone.objects = P.house.items.map((f, i) => H.furnObj(f, i)).filter(Boolean); W.objs = W.zone.objects.map(o => Object.assign(o, { key: 'house:' + o._i })); W.boxes = W.objs.map(o => o.box).filter(Boolean); W.player.x = pos[0]; W.player.y = pos[1]; };
    H.rebuild = rebuild;
    const rebuildGround = () => { const z = G.House.buildZone(P.name); W.zone.ground = z.ground; W.zone.data = P.house; const gc = W.ground; const g2 = document.createElement('canvas'); g2.width = W.zone.w; g2.height = W.zone.h; W.zone.ground.call(W.zone, g2.getContext('2d')); W.ground = g2; };
    function render() {
      const body = $('.hb-body', bar);
      $('.hb-lvl', bar).textContent = D.HOUSE_LEVELS[P.house.lvl].name + ' • ' + P.house.items.length + ' רהיטים';
      if (tab === 'furn') {
        const items = D.ITEM_LIST.filter(i => i.cat === 'furn' && (P.inv[i.id] || 0) > 0);
        body.innerHTML = items.length ? `<div class="hb-items">${items.map(it => `<button class="hb-item" data-id="${it.id}" title="${it.name}"><img src="${G.Avatar.icon(it.id)}"><i>×${P.inv[it.id]}</i><small>${it.name}</small></button>`).join('')}</div><p class="hb-hint">לחצו על רהיט כדי להניח אותו, ואז גררו אותו בבית למקום הרצוי.</p>` : `<p class="hb-hint">אין רהיטים בתיק. קנו רהיטים בחנות "בית ונוי" שבקניון 🛋️ • לחצו על רהיט בבית כדי להזיז אותו.</p>`;
        U.$$('.hb-item', body).forEach(b => b.onclick = () => {
          const id = b.dataset.id; if (!(P.inv[id] > 0)) return;
          P.inv[id]--; const cx = U.clamp(W.cam.x + W.w / W.zoom / 2, 100, W.zone.w - 100), cy = U.clamp(W.cam.y + W.h / W.zoom / 2 + 40, WALL_H + 60, W.zone.h - 60);
          const f = { id, x: Math.round(U.clamp(cx + U.rand(-180, 180), 100, W.zone.w - 100)), y: Math.round(U.clamp(cy + U.rand(-60, 80), WALL_H + 70, W.zone.h - 60)), f: false };
          P.house.items.push(f); rebuild(); H.sel = f; G.Audio.sfx('pop'); W.burst(f.x, f.y - 30);
          P.stats.placed = (P.stats.placed || 0) + 1; G.Econ.track('place'); G.Econ.checkAch(); G.Store.save(P); render(); renderSel();
        });
      } else if (tab === 'walls') {
        body.innerHTML = `<div class="hb-row"><b>צבע קירות:</b>${D.WALLS.map((c, i) => `<button class="sw ${P.house.wall === i ? 'on' : ''}" style="--c:${c}" data-w="${i}"></button>`).join('')}</div><div class="hb-row"><b>רצפה:</b>${D.FLOORS.map((f, i) => `<button class="chip ${P.house.floor === i ? 'on' : ''}" data-f="${i}"><i style="background:linear-gradient(135deg,${f.c1} 50%,${f.c2} 50%)"></i>${f.name}</button>`).join('')}</div>`;
        U.$$('[data-w]', body).forEach(b => b.onclick = () => { P.house.wall = +b.dataset.w; rebuildGround(); G.Store.save(P); G.Audio.sfx('click'); render(); });
        U.$$('[data-f]', body).forEach(b => b.onclick = () => { P.house.floor = +b.dataset.f; rebuildGround(); G.Store.save(P); G.Audio.sfx('click'); render(); });
      } else if (tab === 'up') {
        const cur = P.house.lvl, next = D.HOUSE_LEVELS[cur + 1];
        body.innerHTML = `<div class="hb-levels">${D.HOUSE_LEVELS.map((l, i) => `<div class="hl ${i <= cur ? 'got' : ''} ${i === cur + 1 ? 'next' : ''}"><span>${['🏠', '🏡', '🏘️', '🏰'][i]}</span><b>${l.name}</b><small>${l.w}×${l.h}</small>${i === 0 ? '<em>חינם</em>' : `<em>🪙 ${U.fmt(l.price)}</em>`}</div>`).join('')}</div>${next ? `<button class="btn primary up">שדרוג ל${next.name} – 🪙 ${U.fmt(next.price)}</button>` : '<p class="hb-hint">🏰 יש לכם את הבית הכי גדול בקיו וורלד!</p>'}`;
        const ub = $('.up', body);
        if (ub) ub.onclick = () => { if (!G.Econ.spend(next.price)) return; P.house.lvl++; G.Econ.addXP(120); G.Econ.checkAch(); G.Store.save(P); G.Audio.sfx('levelup'); G.UI.confetti(2); G.UI.toast(`🏡 הבית שודרג ל${next.name}!`, 'ok'); H.closeEditor(); W.enterZone('house', { owner: P.name }); setTimeout(() => H.openEditor(), 300); };
      } else if (tab === 'inv') {
        const fr = P.friends.filter(n => W.bots.some(b => b.name === n));
        body.innerHTML = fr.length ? `<div class="hb-items">${fr.map(n => { const b = W.bots.find(x => x.name === n); return `<button class="hb-item inv ${H.guests.includes(n) ? 'on' : ''}" data-n="${U.esc(n)}"><img src="${G.Avatar.portrait(b.look, 64)}"><small>${U.esc(n)}</small>${H.guests.includes(n) ? '<i>✔</i>' : ''}</button>`; }).join('')}</div><p class="hb-hint">בחרו חברים להזמין – הם יגיעו לביקור בבית שלכם.</p>` : '<p class="hb-hint">עוד אין לכם חברים להזמין. הוסיפו חברים מתפריט "חברים" 👫</p>';
        U.$$('[data-n]', body).forEach(b => b.onclick = () => {
          const n = b.dataset.n;
          if (H.guests.includes(n)) { H.guests = H.guests.filter(x => x !== n); const c = W.chars.find(c => c.name === n); if (c) c.gone = true; }
          else { H.guests.push(n); const bt = W.bots.find(x => x.name === n); const c = W.mkChar({ name: bt.name, look: bt.look, x: W.zone.w / 2, y: W.zone.h - 60, kind: 'bot', lvl: bt.lvl }); c.bot = bt; c.idle = 0.5; c.chatT = 2; W.chars.push(c); setTimeout(() => { W.say(c, U.pick(['וואו איזה בית יפה! 😍', 'תודה על ההזמנה! 💜', 'איזה רהיטים מגניבים!'])); W.emote('love', c); }, 1200); G.UI.toast(`💌 ${n} בדרך אליכם!`); }
          render();
        });
      }
    }
    function renderSel() {
      const s = $('.hb-sel', bar);
      if (!H.sel) { s.innerHTML = ''; s.classList.remove('on'); return; }
      const it = D.ITEMS[H.sel.id];
      s.classList.add('on');
      s.innerHTML = `<img src="${G.Avatar.icon(it.id)}"><b>${it.name}</b><button class="btn sm" data-a="flip">↔ היפוך</button><button class="btn sm" data-a="back">🎒 החזרה לתיק</button><button class="btn sm ghost" data-a="x">✕</button>`;
      U.$$('[data-a]', s).forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        if (a === 'flip') { H.sel.f = !H.sel.f; rebuild(); }
        if (a === 'back') { P.house.items = P.house.items.filter(f => f !== H.sel); P.inv[H.sel.id] = (P.inv[H.sel.id] || 0) + 1; H.sel = null; rebuild(); render(); }
        if (a === 'x') H.sel = null;
        G.Store.save(P); renderSel();
      });
    }
    H.renderSel = renderSel;
    render();
    // גרירה
    let drag = null;
    W.editHook = (e) => {
      const p = W.toWorld(e.offsetX, e.offsetY);
      let hit = null;
      for (let i = W.objs.length - 1; i >= 0; i--) { const o = W.objs[i]; const sz = G.Furn.SIZE[o.furn.style]; const h = sz.flat ? sz.h : sz.h; if (p.x > o.x - sz.w / 2 && p.x < o.x + sz.w / 2 && p.y > o.y - h && p.y < o.y + 6) { if (!hit || (!o.flat && (hit.flat || o.y > hit.y))) hit = o; } }
      if (hit) { H.sel = hit.ref; drag = { dx: hit.x - p.x, dy: hit.y - p.y }; G.Audio.sfx('click'); }
      else H.sel = null;
      renderSel();
      return true;
    };
    H._move = (e) => {
      if (!drag || !H.sel) return;
      const r = W.canvas.getBoundingClientRect(); const p = W.toWorld(e.clientX - r.left, e.clientY - r.top);
      const sz = G.Furn.SIZE[D.ITEMS[H.sel.id].style];
      H.sel.x = Math.round(U.clamp(p.x + drag.dx, sz.w / 2 + 10, W.zone.w - sz.w / 2 - 10));
      H.sel.y = Math.round(U.clamp(p.y + drag.dy, WALL_H + (sz.flat ? sz.d : 40), W.zone.h - 40));
      const o = W.objs.find(o => o.ref === H.sel); if (o) { o.x = H.sel.x; o.y = H.sel.y; }
    };
    H._up = () => { if (drag) { drag = null; rebuild(); G.Store.save(P); } };
    window.addEventListener('pointermove', H._move); window.addEventListener('pointerup', H._up);
    W.editDraw = (ctx, t) => {
      if (!H.sel) return;
      const sz = G.Furn.SIZE[D.ITEMS[H.sel.id].style];
      ctx.save(); ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 30;
      U.fillRR(ctx, H.sel.x - sz.w / 2 - 8, H.sel.y - (sz.flat ? sz.d : sz.h) - 8, sz.w + 16, (sz.flat ? sz.d : sz.h) + 16, 10, 'rgba(124,92,255,0.08)', '#7c5cff', 2.5);
      ctx.restore();
      G.Scn.txt(ctx, '✥ גררו להזזה', H.sel.x, H.sel.y + 22, 12, '#7c5cff', 700, '#ffffff');
    };
    G.Audio.sfx('open');
  };
  H.closeEditor = function () {
    const W = G.World;
    if (!H.edit) return;
    H.edit = false; H.sel = null; document.body.classList.remove('editing'); W.editHook = null; W.editDraw = null;
    window.removeEventListener('pointermove', H._move); window.removeEventListener('pointerup', H._up);
    if (H.bar) H.bar.remove(); H.bar = null;
    G.Store.save(G.P); G.Econ.checkAch();
  };
  G.bus.on('zone', id => { if (H.edit) H.closeEditor(); if (id === 'house' && G.World.zone.mine) H.showHomeBtn(); else H.hideHomeBtn(); });
  H.showHomeBtn = function () {
    H.hideHomeBtn();
    const b = U.el('<button id="editHomeBtn" class="btn primary">🎨 עיצוב הבית</button>');
    b.onclick = () => H.openEditor(); document.getElementById('hud').appendChild(b);
  };
  H.hideHomeBtn = function () { const b = document.getElementById('editHomeBtn'); if (b) b.remove(); };
  return H;
})();
