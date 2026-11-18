// ===== פופילנד – מנוע העולם =====
G.World = (() => {
  const U = G.U, S = G.Scn;
  const W = {
    canvas: null, ctx: null, w: 0, h: 0, dpr: 1, zoom: 1, t: 0, last: 0,
    zoneId: null, zone: null, ground: null, objs: [], staff: [], boxes: [],
    player: null, chars: [], bots: [], cam: { x: 0, y: 0 }, keys: {}, mode: 'title',
    target: null, pending: null, near: null, fx: [], collect: {}, hover: null, busy: false, demoT: 0, houseOwner: null,
  };

  // ---------- אתחול ----------
  W.init = function (canvas) {
    W.canvas = canvas; W.ctx = canvas.getContext('2d');
    W.resize(); window.addEventListener('resize', W.resize);
    W.makeBots();
    window.addEventListener('keydown', e => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      W.keys[e.key.toLowerCase()] = true;
      if (W.mode !== 'play' || G.UI.blocking()) return;
      const k = e.key.toLowerCase();
      if (k === 'e' || k === 'ק' || (k === ' ' && W.near)) { if (W.near) W.doAct(W.near); e.preventDefault(); }
      const n = parseInt(e.key, 10); if (n >= 1 && n <= 8) W.emote(G.DATA.EMOTES[n - 1].id);
    });
    window.addEventListener('keyup', e => { W.keys[e.key.toLowerCase()] = false; });
    window.addEventListener('blur', () => { W.keys = {}; });
    canvas.addEventListener('pointerdown', W.onPointer);
    canvas.addEventListener('pointermove', W.onMove);
    requestAnimationFrame(W.loop);
  };
  W.resize = function () {
    W.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W.w = window.innerWidth; W.h = window.innerHeight;
    W.canvas.width = W.w * W.dpr; W.canvas.height = W.h * W.dpr;
    W.canvas.style.width = W.w + 'px'; W.canvas.style.height = W.h + 'px';
    W.zoom = U.clamp(Math.min(W.w / 1300, W.h / 780), 0.62, 1.1);
  };

  // ---------- בוטים ----------
  W.makeBots = function () {
    const D = G.DATA, zones = G.Zones.LIST;
    const weights = [];
    zones.forEach(z => { for (let i = 0; i < G.Zones[z].bots; i++) weights.push(z); });
    W.bots = D.BOT_NAMES.map((name, i) => {
      const r = U.rng(U.hash(name));
      const look = G.Avatar.randomLook(r); look._seed = i * 1.7;
      return { name, look, lvl: 1 + Math.floor(r() * 14), zone: weights[i % weights.length], kind: 'bot', nextZoneT: 20 + r() * 60 };
    });
  };
  W.botZoneTick = function (dt) {
    W.bots.forEach(b => {
      b.nextZoneT -= dt;
      if (b.nextZoneT > 0) return;
      b.nextZoneT = 30 + Math.random() * 70;
      const here = b.zone === W.zoneId;
      if (here && W.chars.find(c => c.bot === b && (c.sit || c.talkLock))) return;
      const nz = U.pick(G.Zones.LIST);
      if (nz === b.zone) return;
      if (here) {
        const c = W.chars.find(c => c.bot === b);
        if (c) { c.leaving = true; const p = W.zone.portals && W.zone.portals[0]; if (p) { c.tx = (p.r[0] + p.r[2]) / 2; c.ty = (p.r[1] + p.r[3]) / 2; } else c.gone = true; }
      }
      b.zone = nz;
      if (nz === W.zoneId) W.spawnBot(b, true);
    });
  };
  W.spawnBot = function (b, atEntrance) {
    let x, y;
    if (atEntrance && W.zone.portals && W.zone.portals[0]) { const a = W.zone.arrivals && Object.values(W.zone.arrivals)[0]; if (a) { x = a[0]; y = a[1]; } }
    if (x == null) { const p = W.randomSpot(); x = p[0]; y = p[1]; }
    const c = W.mkChar({ name: b.name, look: b.look, x, y, kind: 'bot', lvl: b.lvl });
    c.bot = b; c.idle = 1 + Math.random() * 3; c.chatT = 8 + Math.random() * 25;
    W.chars.push(c);
    if (W.zoneId === 'cinema' && Math.random() < 0.7) W.botSit(c);
    return c;
  };
  W.botSit = function (c) {
    const seats = W.objs.filter(o => (o.act === 'movie' || o.act === 'sit') && !o.taken);
    if (!seats.length) return;
    const s = U.pick(seats); const sp = W.seatPos(s, c);
    if (!sp) return;
    c.x = sp.x; c.y = sp.y; c.dir = sp.dir; c.sit = sp; s.taken = c; c.sitT = 15 + Math.random() * 30;
  };

  W.mkChar = function (o) {
    return Object.assign({ x: 0, y: 0, dir: 'down', moving: false, walk: 0, emote: null, bubble: null, speed: 220, pet: null, kind: 'bot', lvl: 1, sit: null }, o);
  };

  // ---------- כניסה לאזור ----------
  W.enterZone = function (id, opt) {
    opt = opt || {};
    W.objs.forEach(o => { o.taken = null; });
    let Z;
    if (id === 'house') { Z = G.House.buildZone(opt.owner); W.houseOwner = opt.owner; }
    else Z = G.Zones[id];
    W.zoneId = id; W.zone = Z;
    // אובייקטים
    W.objs = (Z.objects || []).map((o, i) => Object.assign({ _i: i }, o));
    if (id === 'residential') W.addHouses();
    W.objs.slice().forEach(o => {
      if (o.t === 'kiosk') W.objs.push({ t: 'kioskBack', x: o.x, y: o.y, c: o.c, name: o.name, icon: o.icon, items: o.items, sortY: o.y - 150 });
      if (o.t === 'bench' && !o.act) { o.act = 'sit'; o.label = 'לשבת על הספסל'; }
      const key = id + ':' + o._i;
      if ((o.t === 'shell' || o.t === 'pickflower') && W.collect[key] && W.collect[key] > W.t) o.gone = true;
      o.key = key;
    });
    if (id === 'park') { const ch = W.objs.find(o => o.t === 'chest'); if (ch && G.P && G.P.cooldowns.chest === U.today()) ch.opened = true; }
    W.boxes = [];
    W.objs.forEach(o => { const b = o.box || S.box(o); if (b) W.boxes.push(b); });
    // קרקע
    const gc = document.createElement('canvas'); gc.width = Z.w; gc.height = Z.h;
    Z.ground.call(Z, gc.getContext('2d')); W.ground = gc;
    // דמויות
    W.chars = [];
    W.staff = (Z.staff || []).map(s => { const c = W.mkChar({ name: s.name, look: Object.assign({ _seed: 2 }, s.look), x: s.x, y: s.y, kind: 'staff', act: s.act, label: s.label, dir: 'down' }); return c; });
    W.chars.push(...W.staff);
    if (W.player) {
      let p = opt.pos;
      if (!p && opt.from && Z.arrivals && Z.arrivals[opt.from]) p = Z.arrivals[opt.from];
      if (!p && opt.from === 'house' && opt.houseX) p = [opt.houseX, opt.houseY + 40];
      if (!p) p = Z.spawn || Object.values(Z.arrivals || {})[0] || [Z.w / 2, Z.h / 2];
      W.player.x = p[0]; W.player.y = p[1]; W.player.sit = null; W.player.dir = 'down';
      if (W.player.pet) { W.player.pet.x = p[0] + 30; W.player.pet.y = p[1]; }
      W.chars.push(W.player);
    }
    if (id === 'house') G.House.populate(W);
    else W.bots.filter(b => b.zone === id).forEach(b => W.spawnBot(b));
    W.target = null; W.pending = null;
    G.Audio.setMood(Z.mood || 'plaza');
    if (G.P && id !== 'house') { G.P.stats.zones = G.P.stats.zones || {}; if (!G.P.stats.zones[id]) { G.P.stats.zones[id] = 1; G.Econ.checkAch(); } }
    if (G.P) { if (id === 'beach') G.Econ.track('visit_beach'); if (id === 'park') G.Econ.track('visit_park'); G.P.pos = id === 'house' ? null : { zone: id, x: W.player ? W.player.x : 0, y: W.player ? W.player.y : 0 }; }
    W.snapCam();
    G.bus.emit('zone', id);
  };
  W.addHouses = function () {
    const slots = G.Zones.HOUSE_SLOTS, me = G.P;
    const roofs = ['#e85d6c', '#3a7bff', '#2fbf71', '#9b6bff', '#ff9a3d', '#00b8cc'], walls = ['#ffe3b8', '#ffd6e8', '#d8ecff', '#dff7e6', '#efe3ff', '#fff4c2'];
    let bi = 0;
    slots.forEach((s, i) => {
      let o;
      if (i === 2 && me) o = { t: 'house', x: s.x, y: s.y, owner: me.name, label: '🏠 הבית שלי', mine: true, lvl: me.house.lvl, c: G.DATA.WALLS[me.house.wall] || '#ffe3b8', roof: '#ff7eb6' };
      else { const b = W.bots[bi++ % W.bots.length]; const r = U.rng(U.hash(b.name + 'h')); o = { t: 'house', x: s.x, y: s.y, owner: b.name, label: 'הבית של ' + b.name, lvl: Math.floor(r() * 4), c: walls[Math.floor(r() * walls.length)], roof: roofs[Math.floor(r() * roofs.length)] }; }
      o._i = 100 + i; W.objs.push(o);
      (W.zone.portals = W.zone.portals.filter(p => p.house !== s)).push({ r: [s.x - 24, s.y - 14, s.x + 24, s.y + 8], to: 'house', owner: o.owner, house: s, label: o.label });
    });
  };

  W.randomSpot = function () {
    const Z = W.zone;
    for (let i = 0; i < 60; i++) {
      const x = 60 + Math.random() * (Z.w - 120), y = (Z.minY || 100) + 30 + Math.random() * (Z.h - (Z.minY || 100) - 100);
      if (!W.blocked(x, y) && !W.inPortal(x, y)) return [x, y];
    }
    return [Z.w / 2, Z.h - 120];
  };
  W.blocked = function (x, y) {
    const Z = W.zone;
    if (x < 24 || x > Z.w - 24 || y < (Z.minY || 60) || y > Z.h - 14) return true;
    for (const b of W.boxes) if (x > b[0] - 12 && x < b[2] + 12 && y > b[1] - 6 && y < b[3] + 6) return true;
    if (Z.water) for (const w of Z.water) {
      if (w[4] === 'rect') { if (x > w[0] && x < w[0] + w[2] && y > w[1] - 14 && y < w[1] + w[3]) return true; }
      else if (((x - w[0]) / (w[2] + 14)) ** 2 + ((y - w[1]) / (w[3] + 10)) ** 2 < 1) return true;
    }
    return false;
  };
  W.inPortal = function (x, y) { return (W.zone.portals || []).find(p => x >= p.r[0] - 30 && x <= p.r[2] + 30 && y >= p.r[1] - 30 && y <= p.r[3] + 30); };

  // ---------- שחקן ----------
  W.setPlayer = function (P) {
    const look = Object.assign({}, P.look, { _seed: 0 });
    W.player = W.mkChar({ name: P.name, look, kind: 'player', lvl: P.level, speed: 240 });
    W.player.pet = P.look.pet ? { x: 0, y: 0 } : null;
  };
  W.refreshPlayerLook = function () {
    if (!W.player || !G.P) return;
    W.player.look = Object.assign({}, G.P.look, { _seed: 0 }); W.player.lvl = G.P.level;
    if (G.P.look.pet && !W.player.pet) W.player.pet = { x: W.player.x + 30, y: W.player.y };
    if (!G.P.look.pet) W.player.pet = null;
  };

  W.emote = function (id, who) {
    who = who || W.player; if (!who) return;
    who.emote = { id, t: 0, dur: id === 'dance' ? 4 : 2.6 };
    if (who === W.player) {
      G.Econ.track('emote');
      if (id === 'dance' && W.zoneId === 'events' && W.onDanceFloor(who)) G.Econ.track('dance');
      G.Audio.sfx('pop');
      G.bus.emit('selfEmote', id);
    }
  };
  W.onDanceFloor = (c) => { const f = G.Zones.events.floor; return c.x > f[0] && c.x < f[0] + f[2] && c.y > f[1] && c.y < f[1] + f[3]; };
  W.say = function (who, text) {
    who.bubble = { text, t: 0, dur: Math.min(8, 3 + text.length * 0.08) };
  };

  // ---------- ישיבה ----------
  W.seatPos = function (o, who) {
    if (o.t === 'seat') return { x: o.x, y: o.y - 6, dir: 'up', sort: o.y - 1, obj: o };
    if (o.t === 'bench') { const side = who && who.x > o.x ? 1 : -1; return { x: o.x + side * 20, y: o.y - 12, dir: 'down', sort: o.y + 2, obj: o, bench: 1 }; }
    if (o.t === 'cafeTable') { const side = who && who.x > o.x ? 1 : -1; return { x: o.x + side * 42, y: o.y - 14, dir: side > 0 ? 'left' : 'right', sort: o.y + 2, obj: o, chair: 1 }; }
    if (o.sitFurn) return { x: o.x, y: o.y - 10, dir: 'down', sort: o.y + 2, obj: o, chair: 1 };
    return null;
  };
  W.sitOn = function (o) {
    const p = W.player, sp = W.seatPos(o, p); if (!sp) return;
    if (o.taken && o.taken !== p && o.t !== 'bench' && o.t !== 'cafeTable') { G.UI.toast('המקום תפוס 🙂'); return; }
    W.standUp(p);
    p.x = sp.x; p.y = sp.y; p.dir = sp.dir; p.sit = sp; p.moving = false; o.taken = p;
    W.target = null;
    if (o.act === 'movie') { p.watchT = 0; G.UI.toast('🍿 תהנו מהסרט! (שבו 12 שניות כדי להשלים את המשימה)'); }
  };
  W.standUp = function (c) {
    if (!c.sit) return;
    if (c.sit.obj && c.sit.obj.taken === c) c.sit.obj.taken = null;
    const o = c.sit.obj; c.sit = null;
    if (o) { const b = S.box(o) || G.House.boxOf && G.House.boxOf(o); if (b) { c.y = b[3] + 10; } if (o.t === 'seat') c.y = o.y + 14; }
  };

  // ---------- קלט עכבר ----------
  W.toWorld = (sx, sy) => ({ x: sx / W.zoom + W.cam.x, y: sy / W.zoom + W.cam.y });
  W.hitChar = function (x, y) {
    let best = null;
    const all = W.chars.concat(G.Net.visible());
    for (const c of all) { if (c === W.player) continue; if (x > c.x - 22 && x < c.x + 22 && y > c.y - 88 && y < c.y + 6) { if (!best || c.y > best.y) best = c; } }
    return best;
  };
  W.hitObj = function (x, y) {
    let best = null, bd = 1e9;
    for (const o of W.objs) {
      if (!o.act || o.gone) continue;
      const hy = o.t === 'arcadeMachine' ? o.y - 70 : o.t === 'kiosk' ? o.y - 40 : o.y - 22;
      const rx = o.t === 'kiosk' ? 120 : o.t === 'cafeTable' ? 60 : o.t === 'bench' ? 46 : o.t === 'arcadeMachine' ? 40 : 34;
      const ry = o.t === 'arcadeMachine' ? 75 : o.t === 'kiosk' ? 60 : 34;
      if (Math.abs(x - o.x) < rx && Math.abs(y - hy) < ry) { const d = U.dist(x, y, o.x, hy); if (d < bd) { bd = d; best = o; } }
    }
    return best;
  };
  W.onMove = function (e) {
    if (W.mode !== 'play') return;
    const p = W.toWorld(e.offsetX, e.offsetY);
    const h = W.hitChar(p.x, p.y) || W.hitObj(p.x, p.y);
    W.canvas.style.cursor = h ? 'pointer' : 'default';
    W.hover = h;
  };
  W.onPointer = function (e) {
    G.Audio.init();
    if (W.mode !== 'play' || G.UI.blocking()) return;
    if (W.editHook && W.editHook(e)) return;
    const p = W.toWorld(e.offsetX, e.offsetY);
    const c = W.hitChar(p.x, p.y);
    if (c) {
      if (c.kind === 'staff') { W.walkTo(c.x, c.y + 40, { staff: c }); return; }
      G.UI.profileCard(c); return;
    }
    const o = W.hitObj(p.x, p.y);
    if (o) { const ap = W.approachPoint(o); W.walkTo(ap[0], ap[1], { obj: o }); return; }
    W.walkTo(p.x, p.y);
    W.fx.push({ type: 'ring', x: p.x, y: p.y, life: 0.6, max: 0.6 });
  };
  W.approachPoint = function (o) {
    const b = S.box(o);
    if (o.t === 'seat') return [o.x, o.y + 20];
    if (b) return [U.clamp(W.player.x, b[0] + 10, b[2] - 10), b[3] + 18];
    return [o.x, o.y + 16];
  };
  W.walkTo = function (x, y, pend) {
    const p = W.player; if (!p) return;
    W.standUp(p);
    W.target = { x, y, stuck: 0 }; W.pending = pend || null;
  };

  // ---------- פעולות ----------
  W.findNear = function () {
    const p = W.player; if (!p) return null;
    let best = null, bd = 95;
    for (const o of W.objs) {
      if (!o.act || o.gone) continue;
      const ap = W.approachPoint(o); const d = Math.min(U.dist(p.x, p.y, ap[0], ap[1]), U.dist(p.x, p.y, o.x, o.y + 5));
      if (d < bd) { bd = d; best = { obj: o }; }
    }
    for (const c of W.staff) { const d = U.dist(p.x, p.y, c.x, c.y + 30); if (d < bd + 10) { bd = d; best = { staff: c }; } }
    return best;
  };
  W.doAct = function (n) {
    W.target = null; W.pending = null;
    const act = n.obj ? n.obj.act : n.staff.act;
    if (n.staff) { const s = n.staff; s.dir = 'down'; W.player.dir = 'up'; }
    G.Acts.run(act, n.obj || n.staff);
  };

  // ---------- לולאה ----------
  W.loop = function (ts) {
    const dt = Math.min(0.05, (ts - (W.last || ts)) / 1000); W.last = ts; W.t += dt;
    try { if (W.zone) { W.update(dt); W.render(); } } catch (e) { console.error(e); }
    requestAnimationFrame(W.loop);
  };
  W.update = function (dt) {
    const p = W.player, Z = W.zone;
    // שחקן
    if (W.mode === 'play' && p) {
      let dx = 0, dy = 0;
      if (!G.UI.blocking() && !W.frozen) {
        const k = W.keys;
        if (k['arrowleft'] || k['a'] || k['ש']) dx -= 1; if (k['arrowright'] || k['d'] || k['ג']) dx += 1;
        if (k['arrowup'] || k['w'] || k['\'']) dy -= 1; if (k['arrowdown'] || k['s'] || k['ד']) dy += 1;
      }
      if (dx || dy) { W.target = null; W.pending = null; W.standUp(p); }
      else if (W.target) {
        const tx = W.target.x - p.x, ty = W.target.y - p.y, d = Math.hypot(tx, ty);
        if (d < 6) { W.target = null; }
        else { dx = tx / d; dy = ty / d; }
      }
      if (dx || dy) {
        const l = Math.hypot(dx, dy); dx /= l; dy /= l;
        const sp = p.speed * dt, ox = p.x, oy = p.y;
        if (!W.blocked(p.x + dx * sp, p.y)) p.x += dx * sp;
        if (!W.blocked(p.x, p.y + dy * sp)) p.y += dy * sp;
        const moved = Math.hypot(p.x - ox, p.y - oy);
        p.moving = moved > 0.1; p.walk += dt * 11;
        if (Math.abs(dx) > Math.abs(dy)) p.dir = dx < 0 ? 'left' : 'right'; else p.dir = dy < 0 ? 'up' : 'down';
        if (W.target) { if (moved < sp * 0.25) W.target.stuck += dt; else W.target.stuck = 0; if (W.target.stuck > 0.35) W.target = null; }
        if (p.emote && p.emote.id !== 'wave') p.emote = null;
      } else p.moving = false;
      // הגעה לפעולה ממתינה
      if (W.pending && !W.target) {
        const pd = W.pending; W.pending = null;
        const tgt = pd.obj ? W.approachPoint(pd.obj) : [pd.staff.x, pd.staff.y + 40];
        if (U.dist(p.x, p.y, tgt[0], tgt[1]) < 120) W.doAct(pd.obj ? { obj: pd.obj } : { staff: pd.staff });
      }
      // צפייה בסרט
      if (p.sit && p.sit.obj && p.sit.obj.act === 'movie') {
        p.watchT = (p.watchT || 0) + dt;
        if (p.watchT > 12 && !p.watched) { p.watched = true; G.Acts.movieDone(); }
      } else { p.watchT = 0; p.watched = false; }
      // פורטלים
      if (!W.transitioning) for (const pt of (Z.portals || [])) {
        if (p.x >= pt.r[0] && p.x <= pt.r[2] && p.y >= pt.r[1] && p.y <= pt.r[3]) { W.go(pt.to, { owner: pt.owner, label: pt.label }); break; }
      }
      W.near = (W.target ? null : W.findNear());
      if (G.P) { G.P.pos = W.zoneId === 'house' ? G.P.pos : { zone: W.zoneId, x: Math.round(p.x), y: Math.round(p.y) }; }
    }
    // חיית מחמד
    W.chars.concat(G.Net.visible()).forEach(c => {
      if (!c.look || !c.look.pet) return;
      if (!c.pet) c.pet = { x: c.x + 30, y: c.y };
      const offx = c.dir === 'left' ? 34 : -34;
      const tx = c.x + (c.dir === 'up' || c.dir === 'down' ? 34 : offx), ty = c.y + 4;
      c.pet.x += (tx - c.pet.x) * Math.min(1, dt * 4); c.pet.y += (ty - c.pet.y) * Math.min(1, dt * 4);
      c.pet.dir = tx > c.pet.x + 2 ? 'right' : tx < c.pet.x - 2 ? 'left' : c.pet.dir;
    });
    // בוטים
    W.botZoneTick(dt);
    W.chars.forEach(c => {
      if (c.emote) { c.emote.t += dt; if (c.emote.t > c.emote.dur) c.emote = null; }
      if (c.bubble) { c.bubble.t += dt; if (c.bubble.t > c.bubble.dur) c.bubble = null; }
      if (c.kind === 'staff') { c.dir = p && U.dist(p.x, p.y, c.x, c.y) < 260 ? (p.x < c.x - 40 ? 'left' : p.x > c.x + 40 ? 'right' : 'down') : 'down'; return; }
      if (c.kind !== 'bot' || c.talkLock) return;
      W.updateBot(c, dt);
    });
    W.chars = W.chars.filter(c => !c.gone);
    // אוספים שחוזרים
    W.objs.forEach(o => { if (o.gone && W.collect[o.key] && W.collect[o.key] <= W.t) o.gone = false; });
    // אפקטים
    W.fx.forEach(f => { f.life -= dt; if (f.vx != null) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += (f.g || 0) * dt; } });
    W.fx = W.fx.filter(f => f.life > 0);
    // מצלמה
    if (W.mode === 'play' && p) W.follow(p.x, p.y, dt);
    else { W.demoT += dt * 0.05; W.follow(Z.w / 2 + Math.sin(W.demoT) * Z.w * 0.28, Z.h * 0.58 + Math.cos(W.demoT * 0.7) * 160, dt); }
    G.Net.update(dt);
  };
  W.updateBot = function (c, dt) {
    if (c.sit) { c.sitT -= dt; if (c.sitT < 0) { W.standUp(c); c.idle = 1; } }
    else if (c.tx != null) {
      const tx = c.tx - c.x, ty = c.ty - c.y, d = Math.hypot(tx, ty);
      if (d < 5) { c.tx = null; c.moving = false; c.idle = 2 + Math.random() * 5; if (c.leaving) c.gone = true; if (W.zoneId === 'cafe' && Math.random() < 0.3) W.botSit(c); }
      else {
        const sp = 95 * dt, nx = c.x + tx / d * sp, ny = c.y + ty / d * sp;
        let moved = false;
        if (!W.blocked(nx, c.y) || c.leaving) { c.x = nx; moved = true; }
        if (!W.blocked(c.x, ny) || c.leaving) { c.y = ny; moved = true; }
        if (!moved) { c.tx = null; c.idle = 0.5; }
        c.moving = true; c.walk += dt * 9;
        if (Math.abs(tx) > Math.abs(ty)) c.dir = tx < 0 ? 'left' : 'right'; else c.dir = ty < 0 ? 'up' : 'down';
        if (c.leaving && d < 30) c.gone = true;
      }
    } else {
      c.moving = false; c.idle -= dt;
      if (c.idle <= 0) {
        const r = Math.random();
        if (r < 0.12) W.emote(U.pick(['wave', 'happy', 'laugh', 'dance', 'jump', 'love', 'cool']), c);
        else if (W.zoneId === 'events' && r < 0.4) { const f = G.Zones.events.floor; c.tx = f[0] + 40 + Math.random() * (f[2] - 80); c.ty = f[1] + 40 + Math.random() * (f[3] - 80); }
        else { const s = W.randomSpot(); c.tx = s[0]; c.ty = s[1]; if (U.dist(c.x, c.y, c.tx, c.ty) > 700) { c.tx = c.x + (c.tx - c.x) * 0.4; c.ty = c.y + (c.ty - c.y) * 0.4; } }
        c.idle = 1 + Math.random() * 4;
      }
      if (W.zoneId === 'events' && !c.emote && Math.random() < dt * 0.25 && W.onDanceFloor(c)) W.emote('dance', c);
    }
    c.chatT -= dt;
    if (c.chatT < 0) {
      c.chatT = 18 + Math.random() * 40;
      const lines = G.DATA.BOT_LINES, pool = (lines[W.zoneId] || []).concat(lines.any);
      const txt = U.pick(pool); W.say(c, txt); G.UI.chatLine(c.name, txt, 'bot');
    }
  };
  W.follow = function (x, y, dt) {
    const vw = W.w / W.zoom, vh = W.h / W.zoom, Z = W.zone;
    let cx = x - vw / 2, cy = y - vh / 2 - 30;
    cx = Z.w <= vw ? (Z.w - vw) / 2 : U.clamp(cx, 0, Z.w - vw);
    cy = Z.h <= vh ? (Z.h - vh) / 2 + (G.House && G.House.edit ? Math.min(130, (vh - Z.h) / 2 + 120) : 0) : U.clamp(cy + (G.House && G.House.edit ? 110 : 0), 0, Z.h - vh + (G.House && G.House.edit ? 150 : 0));
    const k = dt ? Math.min(1, dt * 6) : 1;
    W.cam.x += (cx - W.cam.x) * k; W.cam.y += (cy - W.cam.y) * k;
  };
  W.snapCam = function () { const p = W.player; if (W.mode === 'play' && p) W.follow(p.x, p.y, 0); else W.follow(W.zone.w / 2, W.zone.h * 0.6, 0); };

  // ---------- מעבר אזורים ----------
  W.go = function (to, opt) {
    opt = opt || {};
    if (W.transitioning) return;
    W.transitioning = true;
    const from = W.zoneId, houseX = opt.houseX, houseY = opt.houseY;
    let hx = houseX, hy = houseY;
    if (from === 'house' && to === 'residential') { const slot = W.lastHouseSlot; if (slot) { hx = slot.x; hy = slot.y; } }
    if (to === 'house') { const pt = (W.zone.portals || []).find(p => p.owner === opt.owner); W.lastHouseSlot = pt ? pt.house : G.Zones.HOUSE_SLOTS[2]; }
    G.Audio.sfx('whoosh');
    const name = to === 'house' ? (opt.owner === (G.P && G.P.name) ? 'הבית שלי' : 'הבית של ' + opt.owner) : G.Zones[to].name;
    G.UI.fade(name, to === 'house' ? '🏠' : G.Zones[to].icon, () => {
      W.enterZone(to, { from, owner: opt.owner, houseX: hx, houseY: hy, pos: opt.pos });
      W.transitioning = false;
      if (G.P) G.Store.save(G.P);
    });
  };

  // ---------- ציור ----------
  W.render = function () {
    const ctx = W.ctx, Z = W.zone, t = W.t, z = W.zoom;
    ctx.setTransform(W.dpr, 0, 0, W.dpr, 0, 0);
    ctx.fillStyle = Z.night || Z.dark ? '#0d0820' : (Z.indoor ? '#2a2140' : '#6cc464');
    ctx.fillRect(0, 0, W.w, W.h);
    ctx.setTransform(W.dpr * z, 0, 0, W.dpr * z, -W.cam.x * z * W.dpr, -W.cam.y * z * W.dpr);
    const vw = W.w / z, vh = W.h / z;
    const sx = Math.max(0, W.cam.x), sy = Math.max(0, W.cam.y);
    const sw = Math.min(Z.w - sx, vw + 2), sh = Math.min(Z.h - sy, vh + 2);
    if (sw > 0 && sh > 0) ctx.drawImage(W.ground, sx, sy, sw, sh, sx, sy, sw, sh);
    if (Z.dyn) Z.dyn.call(Z, ctx, t);
    // רשימת ציור
    const list = [];
    const inView = (x, y, m) => x > W.cam.x - m && x < W.cam.x + vw + m && y > W.cam.y - 60 && y < W.cam.y + vh + m * 1.5;
    for (const o of W.objs) {
      if (!inView(o.x, o.y, o.w ? o.w : 320)) continue;
      const sy2 = o.sortY != null ? o.sortY : (S.flat[o.t] || (o.flat) ? o.y - 2000 : o.y);
      list.push({ y: sy2, o });
    }
    const chars = W.chars.concat(G.Net.visible());
    for (const c of chars) {
      if (!inView(c.x, c.y, 120)) continue;
      list.push({ y: c.sit ? c.sit.sort : c.y, c });
      if (c.pet && c.look.pet) list.push({ y: c.pet.y, pet: c });
    }
    list.sort((a, b) => a.y - b.y);
    const night = !!Z.night;
    for (const it of list) {
      if (it.o) { const fn = it.o.furn ? null : S[it.o.t]; if (it.o.furn) G.Furn.draw(ctx, it.o.furn, it.o.x, it.o.y, t, it.o.flip); else if (fn) fn(ctx, it.o, t, night); if (W.hover === it.o || (W.near && W.near.obj === it.o)) W.drawHighlight(ctx, it.o); }
      else if (it.pet) G.Avatar.drawPet(ctx, it.pet.look.pet, it.pet.pet.x, it.pet.pet.y, t, it.pet.pet.dir);
      else W.drawChar(ctx, it.c, t);
    }
    if (Z.over) Z.over.call(Z, ctx, t);
    // שכבת עליונה: שמות ובועות
    for (const c of chars) { if (inView(c.x, c.y, 120)) W.drawOverlay(ctx, c, t); }
    if (W.editDraw) W.editDraw(ctx, t);
    // אפקטים
    for (const f of W.fx) {
      const a = U.clamp(f.life / f.max, 0, 1);
      if (f.type === 'ring') U.ell(ctx, f.x, f.y, 18 * (1.4 - a), 7 * (1.4 - a), null, U.rgba('#ffffff', a), 3);
      else if (f.type === 'spark') U.star(ctx, f.x, f.y, 6 * a + 2, 2, 4, U.rgba(f.col || '#ffde59', a));
      else if (f.type === 'text') { S.txt(ctx, f.text, f.x, f.y, 20, U.rgba(f.col || '#ffde59', a), 700, U.rgba('#3a2d55', a * 0.8)); }
    }
    // הנחיית פעולה
    if (W.mode === 'play' && W.near && W.player && !G.UI.blocking()) {
      const n = W.near, o = n.obj || n.staff, label = (n.obj ? n.obj.label : n.staff.label) || 'פעולה';
      const yy = n.staff ? o.y - 120 : (o.t === 'arcadeMachine' ? o.y - 168 : o.t === 'kiosk' ? o.y - 250 : o.t === 'house' ? o.y - 250 : o.y - 70);
      ctx.font = '700 15px Fredoka, Rubik'; const tw = ctx.measureText(label).width + 52, bob = Math.sin(t * 4) * 3;
      U.fillRR(ctx, o.x - tw / 2, yy - 18 + bob, tw, 34, 17, 'rgba(255,255,255,0.96)', '#7c5cff', 2.5);
      U.fillRR(ctx, o.x + tw / 2 - 30, yy - 12 + bob, 22, 22, 6, '#7c5cff'); S.txt(ctx, 'E', o.x + tw / 2 - 19, yy - 1 + bob, 13, '#fff');
      S.txt(ctx, label, o.x - 12, yy - 1 + bob, 15, '#3a2d55');
    }
    ctx.setTransform(W.dpr, 0, 0, W.dpr, 0, 0);
    if (W.mode === 'title') { ctx.fillStyle = 'rgba(30,15,60,0.25)'; ctx.fillRect(0, 0, W.w, W.h); }
  };
  W.drawHighlight = function (ctx, o) {
    const pulse = 0.5 + Math.sin(W.t * 5) * 0.2;
    U.ell(ctx, o.x, o.y + 2, o.t === 'kiosk' ? 120 : o.t === 'cafeTable' ? 66 : 44, 12, null, U.rgba('#ffde59', pulse), 3);
  };
  W.drawChar = function (ctx, c, t) {
    const o = { dir: c.dir, moving: c.moving, walk: c.walk, t, emote: c.emote ? { id: c.emote.id, t: c.emote.t } : null, sit: !!c.sit };
    if (c.sit) {
      ctx.save();
      if (c.sit.bench || c.sit.chair) {
        G.Avatar.draw(ctx, Object.assign({}, c.look, { pants: c.look.pants }), c.x, c.y, Object.assign(o, { noShadow: true, moving: false }));
      } else G.Avatar.draw(ctx, c.look, c.x, c.y, Object.assign(o, { noShadow: true }));
      ctx.restore();
    } else G.Avatar.draw(ctx, c.look, c.x, c.y, o);
    if (c === W.player && !c.moving && !c.sit) { /* טבעת שחקן */ U.ell(ctx, c.x, c.y + 1, 22, 7, null, 'rgba(255,222,89,0.55)', 2); }
  };
  W.drawOverlay = function (ctx, c, t) {
    const hatTall = c.look.hat && ['tophat', 'bunny', 'party', 'crown'].includes((G.DATA.ITEMS[c.look.hat] || {}).style) ? 20 : 0;
    const top = c.y - 98 - hatTall - (c.sit && !c.sit.bench && !c.sit.chair ? 0 : 0);
    // תג שם
    if (c.kind !== 'staff' || true) {
      ctx.font = '600 13px Rubik, sans-serif';
      const tag = c.kind === 'bot' ? 'בוט' : c.kind === 'remote' ? 'אונליין' : c.kind === 'staff' ? 'צוות' : '';
      const nm = c.name;
      const nw = ctx.measureText(nm).width; ctx.font = '700 10px Rubik'; const tgw = tag ? ctx.measureText(tag).width + 12 : 0;
      const w = nw + tgw + 22 + (c.lvl && c.kind !== 'staff' ? 20 : 0);
      const x0 = c.x - w / 2;
      const bg = c === W.player ? 'rgba(124,92,255,0.92)' : c.kind === 'remote' ? 'rgba(20,150,110,0.9)' : c.kind === 'staff' ? 'rgba(255,138,61,0.92)' : 'rgba(40,30,70,0.72)';
      U.fillRR(ctx, x0, top - 11, w, 22, 11, bg);
      let cx = x0 + w - 10;
      if (c.lvl && c.kind !== 'staff') { U.circ(ctx, cx - 7, top, 8, '#ffde59'); S.txt(ctx, String(c.lvl), cx - 7, top + 0.5, 10, '#3a2d55', 700); cx -= 20; }
      ctx.font = '600 13px Rubik'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(nm, cx, top + 1); cx -= nw + 6;
      if (tag) { U.fillRR(ctx, cx - tgw, top - 7, tgw, 14, 7, c.kind === 'bot' ? 'rgba(255,255,255,0.25)' : c.kind === 'remote' ? '#5fe0b7' : 'rgba(255,255,255,0.3)'); ctx.font = '700 10px Rubik'; ctx.fillStyle = c.kind === 'remote' ? '#0b3d2c' : '#fff'; ctx.textAlign = 'center'; ctx.fillText(tag, cx - tgw / 2, top + 0.5); }
    }
    // רגש
    if (c.emote) {
      const e = G.DATA.EMOTES.find(x => x.id === c.emote.id); const a = Math.min(1, (c.emote.dur - c.emote.t) * 3);
      const sc = 1 + Math.max(0, 0.4 - c.emote.t) * 1.5;
      ctx.save(); ctx.globalAlpha = a; ctx.font = `${28 * sc}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(e ? e.icon : '✨', c.x + 30, top - 22 - c.emote.t * 6); ctx.restore();
      if (c.emote.id === 'love' && Math.random() < 0.2) W.fx.push({ type: 'text', text: '💗', x: c.x + U.rand(-15, 15), y: c.y - 70, vx: 0, vy: -30, life: 1, max: 1, col: '#ff7eb6' });
    }
    // בועת דיבור
    if (c.bubble) {
      const b = c.bubble, a = Math.min(1, b.t * 6, (b.dur - b.t) * 2);
      ctx.save(); ctx.globalAlpha = a; ctx.font = '500 14px Rubik';
      const lines = W.wrap(ctx, b.text, 200);
      const lw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 24, lh = lines.length * 18 + 14;
      const by = top - 22 - lh - (c.emote ? 30 : 0);
      U.fillRR(ctx, c.x - lw / 2, by, lw, lh, 12, '#ffffff', c === W.player ? '#7c5cff' : '#d9d3ea', 2);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(c.x - 7, by + lh - 1); ctx.lineTo(c.x + 7, by + lh - 1); ctx.lineTo(c.x, by + lh + 9); ctx.fill();
      ctx.fillStyle = '#2b2440'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      lines.forEach((l, i) => ctx.fillText(l, c.x, by + 16 + i * 18));
      ctx.restore();
    }
  };
  W.wrap = function (ctx, text, max) {
    const words = String(text).split(' '); const lines = []; let cur = '';
    words.forEach(w => { const test = cur ? cur + ' ' + w : w; if (ctx.measureText(test).width > max && cur) { lines.push(cur); cur = w; } else cur = test; });
    if (cur) lines.push(cur); return lines.slice(0, 4);
  };
  W.burst = function (x, y, col, n) { for (let i = 0; i < (n || 12); i++) { const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 120; W.fx.push({ type: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, g: 200, life: 0.9, max: 0.9, col: col || U.pick(['#ffde59', '#ff7eb6', '#5fe0b7', '#8fe3ff']) }); } };
  W.floatText = function (x, y, text, col) { W.fx.push({ type: 'text', text, x, y, vx: 0, vy: -40, life: 1.4, max: 1.4, col }); };

  return W;
})();
