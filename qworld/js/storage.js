// ===== קיו וורלד – חשבונות ושמירה =====
// שמירה מקומית בדפדפן (localStorage) + גיבוי בענן לכל משתמש מחובר כשהעמוד מאפשר זאת.
G.Store = {
  KEY: 'popiland_accounts_v1', SKEY: 'popiland_session_v1',
  accounts: {}, cloud: null, cloudReady: false, saving: false, dirty: false, saveTimer: null,

  load() {
    try { this.accounts = JSON.parse(localStorage.getItem(this.KEY) || '{}') || {}; } catch (e) { this.accounts = {}; }
  },
  persistLocal() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.accounts)); } catch (e) { }
  },
  async hash(name, pass) {
    const s = 'popiland:' + name.toLowerCase() + ':' + pass;
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { return 'h' + G.U.hash(s).toString(16); }
  },
  exists(name) { return !!this.accounts[name.toLowerCase()]; },
  async create(name, pass, look) {
    const key = name.toLowerCase();
    const p = {
      name, passHash: await this.hash(name, pass), created: Date.now(), savedAt: Date.now(),
      look, coins: 250, xp: 0, level: 1,
      inv: {}, house: { lvl: 0, wall: 0, floor: 0, items: [] },
      friends: [], msgs: {}, quests: {}, ach: {}, stats: { games: 0, bought: 0, shells: 0, flowers: 0, zones: {}, earned: 0, triviaPerfect: 0, loginDays: 0 },
      best: {}, daily: { last: null, streak: 0 }, settings: { music: true, sfx: true }, pos: null, cooldowns: {},
    };
    G.DATA.ITEM_LIST.filter(i => i.starter).forEach(i => p.inv[i.id] = 1);
    ['plant_small', 'chair_wood', 'table_round'].forEach(id => p.inv[id] = 1);
    ['shirt', 'pants', 'shoes'].forEach(c => { if (look[c]) p.inv[look[c]] = 1; });
    this.accounts[key] = p; this.persistLocal(); this.queueCloud();
    return p;
  },
  async login(name, pass) {
    const p = this.accounts[name.toLowerCase()];
    if (!p) return { err: 'לא נמצא משתמש בשם הזה' };
    if (p.passHash !== await this.hash(p.name, pass)) return { err: 'הסיסמה לא נכונה' };
    return { p };
  },
  save(p) {
    if (!p) return;
    p.savedAt = Date.now();
    this.accounts[p.name.toLowerCase()] = p;
    this.persistLocal(); this.queueCloud();
  },
  remember(name) { try { localStorage.setItem(this.SKEY, name); } catch (e) { } },
  lastName() { try { return localStorage.getItem(this.SKEY) || ''; } catch (e) { return ''; } },

  // ----- ענן -----
  async initCloud() {
    try {
      if (!window.claude || !window.claude.use) return;
      const timeout = new Promise(r => setTimeout(() => r(null), 10000));
      const db = await Promise.race([window.claude.use('db'), timeout]);
      const user = await Promise.race([window.claude.use('user'), timeout]);
      if (db) this.db = db;
      if (!db || !user) return;
      const id = await user.id(); if (!id) return;
      this.uid = id;
      this.cloud = db.doc('data/users/' + id + '/popiland');
      const snap = await this.cloud.get();
      if (snap.exists) {
        const remote = (snap.data() || {}).accounts || {};
        let changed = false;
        Object.keys(remote).forEach(k => { const r = remote[k], l = this.accounts[k]; if (!l || (r.savedAt || 0) > (l.savedAt || 0)) { this.accounts[k] = JSON.parse(JSON.stringify(r)); changed = true; } });
        if (changed) { this.persistLocal(); G.bus.emit('cloudLoaded'); }
      }
      this.cloudReady = true; G.bus.emit('cloudStatus', true);
      if (Object.keys(this.accounts).length) this.queueCloud();
    } catch (e) { this.cloud = null; }
  },
  queueCloud() {
    if (!this.cloud) return;
    this.dirty = true;
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flushCloud(), 4000);
  },
  async flushCloud() {
    if (!this.cloud || this.saving || !this.dirty) return;
    this.saving = true; this.dirty = false;
    try { await this.cloud.set({ accounts: JSON.parse(JSON.stringify(this.accounts)), at: Date.now() }); }
    catch (e) { if (e && (e.code === 'invalid_argument' || e.code === 'revoked')) this.cloud = null; }
    this.saving = false;
    if (this.dirty) this.queueCloud();
  },
};
