// ===== קיו וורלד – כלכלה, רמות, משימות והישגים =====
G.Econ = {
  need(l) { return 100 + (l - 1) * 70; },
  addCoins(n, src, fromXY) {
    const P = G.P; if (!P || !n) return;
    n = Math.round(n);
    P.coins += n;
    if (n > 0) {
      P.stats.earned = (P.stats.earned || 0) + n;
      this.track('earn', n);
      G.UI.flyCoins(n, fromXY);
      G.Audio.sfx(n >= 30 ? 'coins' : 'coin');
    }
    G.UI.updateHud();
    this.checkAch(); G.Store.save(P);
  },
  spend(n) {
    const P = G.P; if (P.coins < n) { G.UI.toast('אין מספיק מטבעות 😕', 'err'); G.Audio.sfx('error'); return false; }
    P.coins -= n; G.UI.updateHud(); G.Store.save(P); return true;
  },
  addXP(n) {
    const P = G.P; if (!P || !n) return;
    P.xp += n;
    let leveled = false;
    while (P.xp >= this.need(P.level)) { P.xp -= this.need(P.level); P.level++; leveled = true; }
    G.UI.updateHud();
    if (leveled) {
      const reward = 40 * P.level;
      setTimeout(() => { G.UI.levelUp(P.level, reward); P.coins += reward; G.UI.updateHud(); G.Store.save(P); this.checkAch(); }, 400);
    }
    G.Store.save(P);
  },

  // ---------- משימות ----------
  ensureQuests() {
    const P = G.P, Q = P.quests, D = G.DATA, U = G.U;
    const today = U.today(), wk = U.week();
    if (!Q.daily || Q.daily.date !== today) {
      const r = U.rng(U.hash(P.name + today));
      const pool = D.QUEST_POOL.daily.slice(); const list = [];
      while (list.length < 4) { const q = pool.splice(Math.floor(r() * pool.length), 1)[0]; list.push({ id: q.id, prog: 0, claimed: false }); }
      Q.daily = { date: today, list };
    }
    if (!Q.weekly || Q.weekly.week !== wk) {
      const r = U.rng(U.hash(P.name + wk));
      const pool = D.QUEST_POOL.weekly.slice(); const list = [];
      while (list.length < 3) { const q = pool.splice(Math.floor(r() * pool.length), 1)[0]; list.push({ id: q.id, prog: 0, claimed: false }); }
      Q.weekly = { week: wk, list };
    }
  },
  qdef(id) { return G.DATA.QUEST_POOL.daily.concat(G.DATA.QUEST_POOL.weekly).find(q => q.id === id); },
  track(type, n) {
    const P = G.P; if (!P) return;
    this.ensureQuests();
    n = n || 1;
    let completed = [];
    ['daily', 'weekly'].forEach(k => P.quests[k].list.forEach(q => {
      const d = this.qdef(q.id); if (!d || d.type !== type || q.prog >= d.n) return;
      q.prog = Math.min(d.n, q.prog + n);
      if (q.prog >= d.n) completed.push(d);
    }));
    completed.forEach(d => { G.UI.toast('✅ משימה הושלמה: ' + d.text + ' – אספו את הפרס!', 'ok'); G.Audio.sfx('good'); });
    if (completed.length) G.UI.badge('quests', true);
    G.Store.save(P);
  },
  claim(kind, idx) {
    const P = G.P, q = P.quests[kind].list[idx], d = this.qdef(q.id);
    if (!d || q.claimed || q.prog < d.n) return;
    q.claimed = true;
    this.addCoins(d.coins, 'quest'); this.addXP(d.xp);
    G.UI.toast(`🎁 קיבלתם ${d.coins} מטבעות ו-${d.xp} XP`, 'ok');
    this.refreshBadge();
  },
  refreshBadge() {
    const P = G.P; this.ensureQuests();
    const can = ['daily', 'weekly'].some(k => P.quests[k].list.some(q => { const d = this.qdef(q.id); return d && !q.claimed && q.prog >= d.n; }))
      || G.DATA.ACHIEVEMENTS.some(a => P.ach[a.id] === 1);
    G.UI.badge('quests', can);
  },

  // ---------- הישגים ----------
  statVal(stat) {
    const P = G.P;
    switch (stat) {
      case 'coinsHeld': return P.coins;
      case 'clothes': return Object.keys(P.inv).filter(id => { const it = G.DATA.ITEMS[id]; return it && it.cat !== 'furn' && it.cat !== 'pet' && P.inv[id] > 0; }).length;
      case 'placedNow': return P.house.items.length;
      case 'friends': return P.friends.length;
      case 'zones': return Object.keys(P.stats.zones || {}).length;
      case 'level': return P.level;
      case 'houseLvl': return P.house.lvl;
      case 'pets': return Object.keys(P.inv).filter(id => G.DATA.ITEMS[id] && G.DATA.ITEMS[id].cat === 'pet').length;
      default: return P.stats[stat] || 0;
    }
  },
  checkAch() {
    const P = G.P; if (!P) return;
    G.DATA.ACHIEVEMENTS.forEach(a => {
      if (P.ach[a.id]) return;
      if (this.statVal(a.stat) >= a.n) { P.ach[a.id] = 1; G.UI.achievement(a); this.refreshBadge(); }
    });
  },
  claimAch(id) {
    const P = G.P, a = G.DATA.ACHIEVEMENTS.find(x => x.id === id);
    if (!a || P.ach[id] !== 1) return;
    P.ach[id] = 2; this.addCoins(a.coins, 'ach'); this.addXP(50);
    this.refreshBadge();
  },

  // ---------- פרס כניסה יומי ----------
  dailyState() {
    const P = G.P, today = G.U.today();
    if (P.daily.last === today) return { claimed: true, day: P.daily.streak };
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yStr = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    const streak = P.daily.last === yStr ? P.daily.streak + 1 : 1;
    return { claimed: false, day: ((streak - 1) % 7) + 1, streak };
  },
  claimDaily() {
    const P = G.P, st = this.dailyState(); if (st.claimed) return 0;
    P.daily.last = G.U.today(); P.daily.streak = st.streak;
    P.stats.loginDays = (P.stats.loginDays || 0) + 1;
    const amt = G.DATA.DAILY_REWARDS[st.day - 1];
    this.addCoins(amt, 'daily'); this.addXP(20 + st.day * 5);
    this.track('login', 1);
    return amt;
  },

  // ---------- קניות ----------
  owned(id) { return (G.P.inv[id] || 0) > 0; },
  buy(id, fromXY) {
    const P = G.P, it = G.DATA.ITEMS[id];
    if (!it) return false;
    if (it.lvl && P.level < it.lvl) { G.UI.toast(`הפריט נפתח ברמה ${it.lvl}`, 'err'); G.Audio.sfx('error'); return false; }
    if (it.cat !== 'furn' && this.owned(id)) { G.UI.toast('כבר יש לכם את הפריט הזה', 'err'); return false; }
    if (!this.spend(it.price)) return false;
    P.inv[id] = (P.inv[id] || 0) + 1;
    P.stats.bought = (P.stats.bought || 0) + 1;
    this.track('buy', 1); this.addXP(Math.max(10, Math.round(it.price / 10)));
    G.Audio.sfx('buy'); G.UI.purchaseFx(id, fromXY);
    this.checkAch(); G.Store.save(P);
    return true;
  },
};
