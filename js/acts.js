// ===== קיו וורלד – פעולות בעולם =====
G.Acts = {
  run(act, tgt) {
    const W = G.World, P = G.P, U = G.U;
    if (G.Mystery && G.Mystery.intercept(act, tgt)) return;
    const [kind, arg] = act.split(':');
    switch (kind) {
      case 'treat': { const pr = act.split(':'); this.treat(+pr[1], pr[2], pr[3], pr[4]); break; }
      case 'mathstand': G.Edu.quiz('math', 8); break;
      case 'science': G.Edu.quiz('sci', 6); break;
      case 'neighbor': G.Mystery.neighborTalk(); break;
      case 'janitor': G.Mystery.janitorTalk(); break;
      case 'ride': W.startRide(tgt.t === 'pier' ? W.objs.find(o => o.t === 'ship') : tgt); break;
      case 'attrInfo': this.attrInfo(tgt); break;
      case 'gumdrop': this.collect(tgt, 'gumdrop'); break;
      case 'treasure': this.collect(tgt, 'treasure'); break;
      case 'fossil': this.fact(tgt, '🦴 מצאתם מאובן!', G.Isl.FOSSILS[tgt.k % G.Isl.FOSSILS.length], true); break;
      case 'planet': this.fact(tgt, '🪐 ' + G.Isl.PLANETS[tgt.k][0], G.Isl.PLANETS[tgt.k][3]); break;
      case 'creature': this.fact(tgt, G.Isl.CREATURES[tgt.k][1] + ' ' + G.Isl.CREATURES[tgt.k][0], G.Isl.CREATURES[tgt.k][2]); break;
      case 'hover': W.player.hoverUntil = W.t + 25; G.Audio.sfx('levelup'); G.UI.toast('🛹 גלשן ריחוף! 25 שניות של מהירות-על'); break;
      case 'shop': G.UI.openShop(arg); break;
      case 'game': G.Games.open(arg); break;
      case 'sit': W.sitOn(tgt); break;
      case 'movie': W.sitOn(tgt); break;
      case 'coffee': G.UI.cafeMenu(); break;
      case 'guide': G.UI.guide(); break;
      case 'dj': this.dj(); break;
      case 'shell': case 'flower': this.collect(tgt, kind); break;
      case 'chest': this.chest(tgt); break;
      case 'icecream': this.treat(10, '🍦', 'love', 'יאמי! גלידת תות-וניל 🍦'); break;
      case 'popcorn': this.treat(5, '🍿', 'happy', 'פופקורן חם וטרי! 🍿'); break;
      case 'drink': this.treat(8, '🥤', 'dance', 'שייק אנרגיה! ⚡'); break;
    }
  },
  treat(cost, icon, emote, msg) {
    if (!G.Econ.spend(cost)) return;
    const W = G.World;
    W.emote(emote); W.floatText(W.player.x, W.player.y - 110, icon, '#ffffff');
    G.Econ.addXP(8); G.UI.toast(msg); G.Audio.sfx('good');
  },
  attrInfo(s) {
    const Z = G.World.zone;
    G.UI.dialog({ title: (Z.icon || '⭐') + ' ' + s.name, avatar: s, color: G.Isl.cur.color, text: G.U.esc(Z.info || ''), buttons: [{ text: '🎢 לעלות על האטרקציה!', fn: () => { const o = G.World.objs.find(x => x.act === 'ride'); if (o) G.World.startRide(o.t === 'pier' ? G.World.objs.find(x => x.t === 'ship') : o); } }, { text: 'תודה!' }] });
  },
  fact(o, title, text, dig) {
    const W = G.World, P = G.P, U = G.U, key = 'fact_' + W.zoneId + '_' + (o.k || 0);
    if (dig) { if (o.gone) return; o.gone = true; W.collect[o.key] = W.t + 90; W.burst(o.x, o.y - 10, '#f7efe0', 16); }
    const first = !P.cooldowns[key] || P.cooldowns[key] !== U.today();
    P.cooldowns[key] = U.today();
    G.UI.dialog({ title, color: '#2fbf71', text: '🧠 <b>הידעת?</b> ' + U.esc(text), buttons: [{ text: 'וואו! 🤩' }] });
    if (first) { G.Econ.addCoins(5); G.Econ.addXP(8); G.Econ.track('science_correct'); }
  },
  collect(o, kind) {
    const W = G.World, P = G.P;
    if (o.gone) return;
    o.gone = true; W.collect[o.key] = W.t + (kind === 'shell' ? 70 : 60);
    const coins = kind === 'shell' ? 3 : kind === 'treasure' ? G.U.randi(6, 14) : 2;
    if (kind === 'treasure') G.Audio.sfx('coins');
    W.burst(o.x, o.y - 14, kind === 'shell' ? '#ffb3cf' : o.c);
    W.floatText(o.x, o.y - 40, '+' + coins + ' 🪙');
    if (kind === 'shell') { P.stats.shells = (P.stats.shells || 0) + 1; G.Econ.track('shell'); }
    else if (kind === 'flower') { P.stats.flowers = (P.stats.flowers || 0) + 1; G.Econ.track('flower'); }
    G.Econ.addCoins(coins); G.Econ.addXP(3); G.Econ.checkAch();
  },
  chest(o) {
    const P = G.P, U = G.U, W = G.World;
    if (P.cooldowns.chest === U.today()) { G.UI.toast('כבר פתחתם את התיבה היום – חזרו מחר! 🗝️'); return; }
    P.cooldowns.chest = U.today(); o.opened = true;
    const amt = U.randi(60, 160);
    W.burst(o.x, o.y - 40, null, 24);
    G.Econ.addCoins(amt, 'chest', null); G.Econ.addXP(30);
    // לפעמים גם פריט
    const pool = G.DATA.ITEM_LIST.filter(i => !i.rare && !i.starter && i.price <= 120 && !(P.inv[i.id] > 0) && i.cat !== 'furn');
    let extra = '';
    if (pool.length && Math.random() < 0.45) { const it = U.pick(pool); P.inv[it.id] = 1; extra = ` ו-${it.name}!`; }
    G.UI.toast(`🎁 מצאתם ${amt} מטבעות${extra}`, 'ok'); G.Store.save(P);
  },
  dj() {
    const P = G.P, U = G.U;
    const claimed = P.cooldowns.party === U.today();
    G.UI.dialog({
      title: '🎧 DJ זיקו', avatar: G.World.staff.find(s => s.act === 'dj'),
      text: claimed ? 'כבר קיבלת את בונוס המסיבה היום! תמשיכו לרקוד על הרחבה 💃' : 'יו! הערב יש מסיבת קיו! קבלו בונוס מסיבה יומי, ואז עלו לרחבה הצבעונית ותרקדו (מקש 5 או כפתור הרגשות).',
      buttons: claimed ? [{ text: 'בואו נרקוד! 💃', fn: () => G.World.emote('dance') }] : [{ text: '🎉 קבלו 50 מטבעות', fn: () => { P.cooldowns.party = U.today(); G.Econ.addCoins(50); G.Econ.addXP(20); G.World.emote('dance'); } }],
    });
  },
  movieDone() {
    const P = G.P, U = G.U;
    G.Econ.track('movie');
    if (P.cooldowns.movie !== U.today()) { P.cooldowns.movie = U.today(); G.Econ.addCoins(25); G.Econ.addXP(25); G.UI.toast('🎬 צפיתם בסרט! +25 מטבעות', 'ok'); }
    else G.UI.toast('🎬 איזה סרט טוב!');
  },
};
