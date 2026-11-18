// ===== פופילנד – מרובה משתתפים (שחקנים אמיתיים שפתחו את העולם עכשיו) =====
// משתמש ביכולת "room" של העמוד כשהיא זמינה. בלעדיה העולם עובד במצב יחיד עם בוטים.
G.Net = {
  room: null, on: false, players: {}, myPeer: null, sendT: 0, lastSent: '', dirty: true, lastDM: {}, lastMsgT: {},

  async init() {
    try {
      if (!window.claude || !window.claude.use) return;
      const room = await Promise.race([window.claude.use('room'), new Promise(r => setTimeout(() => r(null), 10000))]);
      if (!room) return;
      this.room = room;
      room.onPeers(ch => this.onPeers(ch), () => { this.on = false; this.players = {}; });
      room.onConnection(c => { this.on = c; G.bus.emit('netStatus', c); }, () => { this.on = false; });
      this.dirty = true;
    } catch (e) { this.room = null; }
  },
  onPeers(ch) {
    const seen = {};
    ch.peers.forEach(p => {
      if (p.sameTab) { this.myPeer = p.peer; return; }
      if (p.kind !== 'viewer' || p.isMe) return;
      const s = p.presence || {};
      if (!s.n || typeof s.n !== 'string' || !s.lk) return;
      seen[p.peer] = 1;
      let r = this.players[p.peer];
      const look = this.cleanLook(s.lk);
      if (!r) { r = this.players[p.peer] = G.World.mkChar({ name: String(s.n).slice(0, 18), look, x: +s.x || 0, y: +s.y || 0, kind: 'remote', lvl: +s.lv || 1 }); r.peer = p.peer; r.rx = r.x; r.ry = r.y; }
      r.name = String(s.n).slice(0, 18); r.look = look; r.zone = String(s.z || ''); r.tx = +s.x || 0; r.ty = +s.y || 0; r.dir = ['up', 'down', 'left', 'right'].includes(s.d) ? s.d : 'down';
      r.lvl = Math.max(1, Math.min(99, +s.lv || 1)); r.houseOwner = s.ho || null;
      r.house = s.hs && typeof s.hs === 'object' ? this.cleanHouse(s.hs) : null;
      if (s.e && s.et && s.et !== r._et) { r._et = s.et; if (G.DATA.EMOTES.some(e => e.id === s.e)) r.emote = { id: s.e, t: 0, dur: s.e === 'dance' ? 4 : 2.6 }; }
      if (s.m && s.mt && s.mt !== this.lastMsgT[p.peer]) {
        this.lastMsgT[p.peer] = s.mt;
        const txt = String(s.m).slice(0, 80);
        if (r.zone === G.World.zoneId && Date.now() - s.mt < 15000) { G.World.say(r, txt); G.UI.chatLine(r.name, txt, 'remote'); }
      }
      if (s.dm && s.dm.to === (G.P && G.P.name) && s.dm.t && s.dm.t !== this.lastDM[p.peer]) {
        this.lastDM[p.peer] = s.dm.t;
        if (Date.now() - s.dm.t < 60000) G.UI.receiveDM(r.name, String(s.dm.text || '').slice(0, 120));
      }
    });
    Object.keys(this.players).forEach(k => { if (!seen[k]) delete this.players[k]; });
    if (ch.joined && ch.joined.length) this.dirty = true;
  },
  cleanLook(lk) {
    const L = G.Avatar.defaultLook(), I = G.DATA.ITEMS;
    if (!lk || typeof lk !== 'object') return L;
    const hex = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : null;
    L.skin = hex(lk.skin) || L.skin; L.hairColor = hex(lk.hairColor) || L.hairColor; L.eyeColor = hex(lk.eyeColor) || L.eyeColor;
    if (G.DATA.HAIR_STYLES.some(h => h.id === lk.hairStyle)) L.hairStyle = lk.hairStyle;
    if (G.DATA.EYES.some(h => h.id === lk.eyes)) L.eyes = lk.eyes;
    ['shirt', 'pants', 'shoes', 'hat', 'glasses', 'bag', 'acc', 'pet'].forEach(c => { const v = lk[c]; if (v && I[v] && I[v].cat === c) L[c] = v; else if (!['shirt', 'pants', 'shoes'].includes(c)) L[c] = null; });
    return L;
  },
  cleanHouse(h) {
    const lvl = Math.max(0, Math.min(3, +h.l || 0));
    const items = Array.isArray(h.i) ? h.i.slice(0, 40).filter(a => Array.isArray(a) && G.DATA.ITEMS[a[0]] && G.DATA.ITEMS[a[0]].cat === 'furn').map(a => ({ id: a[0], x: +a[1] || 100, y: +a[2] || 300, f: !!a[3] })) : [];
    return { lvl, wall: Math.max(0, Math.min(G.DATA.WALLS.length - 1, +h.w || 0)), floor: Math.max(0, Math.min(G.DATA.FLOORS.length - 1, +h.f || 0)), items };
  },
  update(dt) {
    // החלקת תנועה של שחקנים אחרים
    Object.values(this.players).forEach(r => {
      const dx = r.tx - r.x, dy = r.ty - r.y, d = Math.hypot(dx, dy);
      if (d > 400) { r.x = r.tx; r.y = r.ty; }
      else if (d > 1) { const k = Math.min(1, dt * 8); r.x += dx * k; r.y += dy * k; }
      r.moving = d > 3; if (r.moving) r.walk += dt * 11;
      if (r.emote) { r.emote.t += dt; if (r.emote.t > r.emote.dur) r.emote = null; }
      if (r.bubble) { r.bubble.t += dt; if (r.bubble.t > r.bubble.dur) r.bubble = null; }
    });
    if (!this.room || !G.P || G.World.mode !== 'play') return;
    this.sendT -= dt;
    if (this.sendT > 0) return;
    this.sendT = 0.1;
    const W = G.World, p = W.player; if (!p) return;
    const L = G.P.look;
    const st = { n: G.P.name, z: W.zoneId, ho: W.zoneId === 'house' ? W.houseOwner : null, x: Math.round(p.x), y: Math.round(p.y), d: p.dir, lv: G.P.level,
      lk: { skin: L.skin, hairStyle: L.hairStyle, hairColor: L.hairColor, eyes: L.eyes, eyeColor: L.eyeColor, shirt: L.shirt, pants: L.pants, shoes: L.shoes, hat: L.hat, glasses: L.glasses, bag: L.bag, acc: L.acc, pet: L.pet } };
    const key = JSON.stringify(st);
    if (key === this.lastSent && !this.dirty) return;
    this.lastSent = key; this.dirty = false;
    st.hs = { l: G.P.house.lvl, w: G.P.house.wall, f: G.P.house.floor, i: G.P.house.items.slice(0, 40).map(f => [f.id, f.x, f.y, f.f ? 1 : 0]) };
    if (p.emote) { st.e = p.emote.id; st.et = this._et || 0; }
    this.room.presence(st).catch(() => { });
  },
  chat(text) { if (!this.room) return; this.room.presence({ m: text, mt: Date.now() }).catch(() => { }); },
  dm(to, text) { if (!this.room) return; this.room.presence({ dm: { to, text, t: Date.now() } }).catch(() => { }); },
  friendNotice(name) { this.dm(name, '🤝 הוסיף/ה אותך לחברים!'); },
  visible() {
    const W = G.World;
    return Object.values(this.players).filter(r => r.zone === W.zoneId && (W.zoneId !== 'house' || r.houseOwner === W.houseOwner));
  },
  list() { return Object.values(this.players); },
  countIn(z) { return Object.values(this.players).filter(r => r.zone === z).length; },
  findByName(n) { return Object.values(this.players).find(r => r.name === n) || null; },
};
G.bus.on('selfEmote', () => { G.Net._et = Date.now(); G.Net.dirty = true; });
