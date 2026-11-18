// ===== פופילנד – מסכי פתיחה והפעלת המשחק =====
(() => {
  const U = G.U, D = G.DATA, $ = U.$;
  const scr = () => $('#screens');

  function show(html) { const s = scr(); s.innerHTML = ''; const el = U.el(html); s.appendChild(el); s.classList.add('on'); return el; }

  // ---------- מסך פתיחה ----------
  function title() {
    G.World.mode = 'title';
    const letters = 'פופילנד'.split('').map((c, i) => `<span style="--i:${i}">${c}</span>`).join('');
    const saved = Object.values(G.Store.accounts).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0)).slice(0, 4);
    const el = show(`<div class="title-screen">
      <div class="logo"><div class="logo-word">${letters}</div><div class="logo-sub">העולם הווירטואלי שלך ✨</div></div>
      <div class="title-card">
        <button class="btn primary huge new">🌟 משחק חדש</button>
        <button class="btn secondary huge login">🔑 התחברות</button>
        ${saved.length ? `<div class="saved"><small>שחקנים שמורים במכשיר הזה:</small><div class="saved-list">${saved.map(p => `<button class="saved-p" data-n="${U.esc(p.name)}"><img src="${G.Avatar.portrait(p.look, 64)}"><b>${U.esc(p.name)}</b><span>רמה ${p.level}</span></button>`).join('')}</div></div>` : ''}
        <div class="cloud-st">${G.Store.cloudReady ? '☁️ שמירה בענן פעילה' : '💾 ההתקדמות נשמרת בדפדפן'}</div>
      </div>
      <div class="title-foot">🎮 7 משחקים • 🛍️ 4 חנויות • 🏠 בית אישי • 👫 חברים וצ׳אט</div>
    </div>`);
    $('.new', el).onclick = () => { G.Audio.init(); G.Audio.sfx('click'); signup(); };
    $('.login', el).onclick = () => { G.Audio.init(); G.Audio.sfx('click'); login(); };
    U.$$('.saved-p', el).forEach(b => b.onclick = () => { G.Audio.init(); login(b.dataset.n); });
  }
  G.bus.on('cloudLoaded', () => { if (G.World.mode === 'title' && $('.title-screen')) title(); });
  G.bus.on('cloudStatus', () => { const c = $('.cloud-st'); if (c) c.textContent = '☁️ שמירה בענן פעילה'; });

  // ---------- התחברות ----------
  function login(name) {
    const el = show(`<div class="auth-screen"><form class="auth-card">
      <button type="button" class="back-link">→ חזרה</button>
      <h2>🔑 התחברות</h2><p>ברוכים השבים לפופילנד!</p>
      <label>שם משתמש<input name="u" maxlength="14" autocomplete="username" value="${U.esc(name || G.Store.lastName())}"></label>
      <label>סיסמה<input name="p" type="password" maxlength="30" autocomplete="current-password"></label>
      <div class="err"></div>
      <button class="btn primary huge">כניסה לעולם 🚀</button>
      <p class="small">אין לכם עדיין דמות? <a href="#" class="to-new">צרו משחק חדש</a></p></form></div>`);
    const f = $('form', el);
    setTimeout(() => (f.u.value ? f.p : f.u).focus(), 50);
    $('.back-link', el).onclick = title;
    $('.to-new', el).onclick = e => { e.preventDefault(); signup(); };
    f.onsubmit = async e => {
      e.preventDefault();
      const r = await G.Store.login(f.u.value.trim(), f.p.value);
      if (r.err) { $('.err', el).textContent = r.err; G.Audio.sfx('error'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); return; }
      enterGame(r.p);
    };
  }

  // ---------- הרשמה ----------
  function signup() {
    const el = show(`<div class="auth-screen"><form class="auth-card">
      <button type="button" class="back-link">→ חזרה</button>
      <div class="steps"><span class="on">1</span><i></i><span>2</span></div>
      <h2>🌟 משחק חדש</h2><p>בחרו שם וסיסמה לדמות שלכם</p>
      <label>שם משתמש<input name="u" maxlength="14" placeholder="לדוגמה: כוכב_הים" autocomplete="username"></label>
      <label>סיסמה<input name="p" type="password" maxlength="30" placeholder="לפחות 4 תווים" autocomplete="new-password"></label>
      <label>אימות סיסמה<input name="p2" type="password" maxlength="30" autocomplete="new-password"></label>
      <div class="err"></div>
      <button class="btn primary huge">המשך לעיצוב הדמות ←</button>
      <p class="small">🔒 החשבון נשמר אצלכם. אל תשתמשו בסיסמה שאתם משתמשים בה באתרים אחרים.</p></form></div>`);
    const f = $('form', el); setTimeout(() => f.u.focus(), 50);
    $('.back-link', el).onclick = title;
    f.onsubmit = e => {
      e.preventDefault();
      const u = f.u.value.trim(), p = f.p.value, err = $('.err', el);
      let msg = '';
      if (u.length < 2) msg = 'השם צריך להכיל לפחות 2 תווים';
      else if (!/^[֐-׿a-zA-Z0-9_ ]+$/.test(u)) msg = 'אפשר להשתמש באותיות, מספרים ו-_ בלבד';
      else if (G.Store.exists(u) || D.BOT_NAMES.includes(u)) msg = 'השם הזה כבר תפוס, נסו שם אחר';
      else if (p.length < 4) msg = 'הסיסמה צריכה להכיל לפחות 4 תווים';
      else if (p !== f.p2.value) msg = 'הסיסמאות לא תואמות';
      if (msg) { err.textContent = msg; G.Audio.sfx('error'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); return; }
      G.Audio.sfx('good'); creator(u, p);
    };
  }

  // ---------- עיצוב דמות ----------
  function creator(name, pass) {
    const look = G.Avatar.defaultLook();
    look.hairStyle = U.pick(['short', 'long', 'bob', 'curly', 'ponytail', 'spiky']); look.hairColor = U.pick(D.HAIR_COLORS.slice(0, 6)); look.shirt = U.pick(['tee_red', 'tee_blue', 'tee_green', 'tee_yellow', 'tee_purple']);
    const starters = cat => D.ITEM_LIST.filter(i => i.starter && i.cat === cat);
    const el = show(`<div class="create-screen"><div class="create-card">
      <div class="create-preview"><div class="steps"><span class="done">✓</span><i></i><span class="on">2</span></div><h2>עצבו את ${U.esc(name)}</h2>
        <canvas width="320" height="380"></canvas>
        <div class="pv-ctrl"><button class="btn sm" data-r="-1">⟲ סיבוב</button><button class="btn sm rnd">🎲 אקראי</button><button class="btn sm" data-r="1">סיבוב ⟳</button></div>
        <div class="emo-try">${D.EMOTES.slice(0, 5).map(e => `<button data-e="${e.id}" title="${e.name}">${e.icon}</button>`).join('')}</div>
      </div>
      <div class="create-opts"><div class="tabs"><button data-t="look" class="on">💇 מראה</button><button data-t="clothes">👕 בגדים</button></div><div class="opts-body"></div>
        <button class="btn primary huge go">יוצאים לעולם! 🚀</button></div></div></div>`);
    const pv = G.UI.livePreview($('canvas', el), () => look);
    U.$$('.pv-ctrl [data-r]', el).forEach(b => b.onclick = () => pv.spin(+b.dataset.r));
    U.$$('.emo-try button', el).forEach(b => b.onclick = () => { pv.emote(b.dataset.e); G.Audio.sfx('pop'); });
    let tab = 'look';
    const body = $('.opts-body', el);
    const render = () => {
      U.$$('.tabs button', el).forEach(b => b.classList.toggle('on', b.dataset.t === tab));
      body.innerHTML = '';
      if (tab === 'look') body.appendChild(G.UI.lookEditor(look, () => pv.emote('happy')));
      else {
        const wrap = U.el(`<div class="look-editor">${[['shirt', 'חולצה'], ['pants', 'מכנסיים / חצאית'], ['shoes', 'נעליים']].map(([c, n]) => `<h4>${n}</h4><div class="item-pick" data-c="${c}">${starters(c).map(it => `<button data-v="${it.id}" class="${look[c] === it.id ? 'on' : ''}"><img src="${G.Avatar.icon(it.id, 72)}"><small>${it.name}</small></button>`).join('')}</div>`).join('')}<p class="hint">עוד המון בגדים ואביזרים מחכים בחנויות בקניון! 🛍️</p></div>`);
        U.$$('.item-pick', wrap).forEach(g => U.$$('button', g).forEach(b => b.onclick = () => { look[g.dataset.c] = b.dataset.v; G.Audio.sfx('click'); pv.emote('happy'); render(); }));
        body.appendChild(wrap);
      }
    };
    U.$$('.tabs button', el).forEach(b => b.onclick = () => { tab = b.dataset.t; render(); });
    $('.rnd', el).onclick = () => { const r = G.Avatar.randomLook(); ['skin', 'hairStyle', 'hairColor', 'eyes', 'eyeColor'].forEach(k => look[k] = r[k]); look.shirt = U.pick(starters('shirt')).id; look.pants = U.pick(starters('pants')).id; look.shoes = U.pick(starters('shoes')).id; G.Audio.sfx('pop'); pv.emote('jump'); render(); };
    $('.go', el).onclick = async () => {
      $('.go', el).disabled = true;
      const P = await G.Store.create(name, pass, Object.assign({ hat: null, glasses: null, bag: null, acc: null, pet: null }, look));
      enterGame(P, true);
    };
    render();
  }

  // ---------- כניסה לעולם ----------
  function enterGame(P, isNew) {
    G.P = P;
    // השלמת שדות לגרסאות ישנות
    P.cooldowns = P.cooldowns || {}; P.stats = P.stats || {}; P.best = P.best || {}; P.msgs = P.msgs || {}; P.ach = P.ach || {};
    G.Store.remember(P.name);
    G.Audio.init(); G.Audio.setMusic(P.settings.music); G.Audio.setSfx(P.settings.sfx);
    scr().classList.remove('on'); scr().innerHTML = '';
    G.World.setPlayer(P);
    G.World.mode = 'play';
    $('#hud').classList.remove('hidden');
    G.UI.updateHud(); G.UI.refreshAvatar();
    G.Econ.ensureQuests(); G.Econ.refreshBadge(); G.UI.updateMsgBadge();
    const pos = P.pos && G.Zones[P.pos.zone] ? P.pos : null;
    G.UI.fade(isNew ? 'ברוכים הבאים לפופילנד!' : 'ברוכים השבים, ' + P.name, '✨', () => {
      G.World.enterZone(pos ? pos.zone : 'plaza', pos ? { pos: [pos.x, pos.y] } : {});
      if (pos && G.World.blocked(G.World.player.x, G.World.player.y)) { const s = G.World.zone.spawn || Object.values(G.World.zone.arrivals)[0]; G.World.player.x = s[0]; G.World.player.y = s[1]; G.World.snapCam(); }
      G.UI.chatLine('פופילנד', isNew ? `ברוכים הבאים ${P.name}! לחצו על המדריכה פופה ליד המזרקה לטיפים 💜` : `טוב לראות אותך שוב, ${P.name}!`, 'sys');
      setTimeout(() => {
        if (isNew) { G.UI.toast('🪙 קיבלתם 250 מטבעות מתנה כדי להתחיל!', 'ok'); setTimeout(() => G.UI.guide(() => setTimeout(() => G.UI.dailyPopup(), 500)), 900); }
        else setTimeout(() => G.UI.dailyPopup(), 600);
      }, 700);
    });
    G.Econ.checkAch();
  }

  // ---------- הפעלה ----------
  window.addEventListener('DOMContentLoaded', () => {
    G.Store.load();
    G.World.init($('#world'));
    G.World.enterZone('plaza');
    G.UI.initHud();
    title();
    G.Store.initCloud();
    G.Net.init();
    setInterval(() => { if (G.P) G.Store.save(G.P); }, 15000);
    window.addEventListener('beforeunload', () => { if (G.P) G.Store.save(G.P); });
    document.addEventListener('pointerdown', () => G.Audio.init(), { once: true });
    // פריטי אייקונים מראש לקניון
    setTimeout(() => D.ITEM_LIST.forEach(i => G.Scn.img(i.id)), 200);
  });
  G.Main = { title, enterGame };
})();
