// ===== פופילנד – ממשק משתמש =====
G.UI = (() => {
  const U = G.U, D = G.DATA, $ = U.$;
  const UI = { stack: [] };

  UI.blocking = () => UI.stack.length > 0 || G.Games.active || document.activeElement === $('#chatInput') || G.World.mode !== 'play';

  // ---------- מודאל כללי ----------
  UI.modal = function (opt) {
    const m = U.el(`<div class="modal-back"><div class="modal ${opt.cls || ''}" style="--accent:${opt.color || '#7c5cff'}">
      <div class="modal-head"><span class="mh-icon">${opt.icon || ''}</span><h2>${opt.title}</h2><button class="x" title="סגירה">✕</button></div>
      <div class="modal-body"></div></div></div>`);
    const body = $('.modal-body', m);
    if (typeof opt.body === 'string') body.innerHTML = opt.body; else if (opt.body) body.appendChild(opt.body);
    const close = () => { if (!m.isConnected) return; m.classList.add('out'); UI.stack = UI.stack.filter(x => x !== m); setTimeout(() => m.remove(), 180); G.Audio.sfx('close'); opt.onClose && opt.onClose(); };
    m.close = close;
    $('.x', m).onclick = close;
    m.addEventListener('pointerdown', e => { if (e.target === m) close(); });
    $('#modals').appendChild(m); UI.stack.push(m); G.Audio.sfx('open');
    return m;
  };
  UI.closeAll = () => UI.stack.slice().forEach(m => m.close());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (UI.stack.length) UI.stack[UI.stack.length - 1].close(); else if (document.activeElement === $('#chatInput')) $('#chatInput').blur(); }
    if (G.World.mode !== 'play' || UI.stack.length || G.Games.active) return;
    if (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === 'Enter') { e.preventDefault(); $('#chatInput').focus(); }
    const k = e.key.toLowerCase();
    if (k === 'm' || k === 'צ') UI.openMap(); if (k === 'i' || k === 'ן') UI.openBag(); if (k === 'q' || k === '/') UI.openQuests(); if (k === 'f' || k === 'כ') UI.openFriends();
  });

  // ---------- טוסטים ואפקטים ----------
  UI.toast = function (text, kind) {
    const t = U.el(`<div class="toast ${kind || ''}">${U.esc(text)}</div>`);
    $('#toasts').appendChild(t); setTimeout(() => t.classList.add('out'), 3200); setTimeout(() => t.remove(), 3600);
    const all = U.$$('.toast'); if (all.length > 4) all[0].remove();
  };
  UI.flyCoins = function (n, from) {
    const pill = $('#hudCoins'); if (!pill) return;
    const r = pill.getBoundingClientRect();
    const fx = from ? from[0] : window.innerWidth / 2, fy = from ? from[1] : window.innerHeight / 2;
    const cnt = Math.min(12, Math.max(3, Math.ceil(n / 10)));
    for (let i = 0; i < cnt; i++) {
      const c = U.el('<div class="fly-coin">🪙</div>');
      c.style.left = (fx + U.rand(-40, 40)) + 'px'; c.style.top = (fy + U.rand(-30, 30)) + 'px';
      $('#fxLayer').appendChild(c);
      setTimeout(() => { c.style.left = (r.left + r.width / 2 - 12) + 'px'; c.style.top = (r.top + r.height / 2 - 12) + 'px'; c.style.transform = 'scale(0.6)'; c.style.opacity = '0.6'; }, 30 + i * 45);
      setTimeout(() => { c.remove(); pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }, 700 + i * 45);
    }
    const plus = U.el(`<div class="coin-plus">+${n}</div>`); plus.style.left = (r.left + 10) + 'px'; plus.style.top = (r.bottom + 4) + 'px';
    $('#fxLayer').appendChild(plus); setTimeout(() => plus.remove(), 1400);
  };
  UI.purchaseFx = function (id, from) {
    const bag = $('[data-act=bag]'); const r = bag ? bag.getBoundingClientRect() : { left: 20, top: 200, width: 40, height: 40 };
    const fx = from ? from[0] : window.innerWidth / 2, fy = from ? from[1] : window.innerHeight / 2;
    const im = U.el(`<img class="fly-item" src="${G.Avatar.icon(id)}">`); im.style.left = fx - 40 + 'px'; im.style.top = fy - 40 + 'px';
    $('#fxLayer').appendChild(im);
    for (let i = 0; i < 14; i++) { const s = U.el('<div class="spark">✦</div>'); s.style.left = fx + 'px'; s.style.top = fy + 'px'; s.style.setProperty('--dx', U.rand(-90, 90) + 'px'); s.style.setProperty('--dy', U.rand(-90, 60) + 'px'); s.style.color = U.pick(['#ffde59', '#ff7eb6', '#5fe0b7', '#8fe3ff']); $('#fxLayer').appendChild(s); setTimeout(() => s.remove(), 800); }
    setTimeout(() => { im.style.left = r.left + r.width / 2 - 20 + 'px'; im.style.top = r.top + r.height / 2 - 20 + 'px'; im.style.width = '40px'; im.style.height = '40px'; im.style.opacity = '0.3'; }, 250);
    setTimeout(() => { im.remove(); if (bag) { bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump'); } }, 1000);
  };
  UI.confetti = function (dur) {
    const c = document.createElement('canvas'); c.className = 'confetti'; c.width = innerWidth; c.height = innerHeight; $('#fxLayer').appendChild(c);
    const ctx = c.getContext('2d'); const ps = [];
    for (let i = 0; i < 160; i++) ps.push({ x: innerWidth / 2 + U.rand(-120, 120), y: innerHeight * 0.45, vx: U.rand(-420, 420), vy: U.rand(-700, -200), r: U.rand(0, 6), vr: U.rand(-8, 8), c: U.pick(['#ff5d6c', '#ffde59', '#5fe0b7', '#3cc9ff', '#9b6bff', '#ff7eb6']), w: U.rand(6, 12), h: U.rand(4, 8) });
    let t0 = performance.now();
    const step = (ts) => {
      const dt = 1 / 60, el = (ts - t0) / 1000; ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.vy += 900 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (el < (dur || 3)) requestAnimationFrame(step); else c.remove();
    };
    requestAnimationFrame(step);
  };
  UI.levelUp = function (lvl, reward) {
    G.Audio.sfx('levelup'); UI.confetti(3.5);
    const unlocked = D.ITEM_LIST.filter(i => i.lvl === lvl);
    const m = UI.modal({ title: 'עליתם רמה!', icon: '⭐', color: '#ffb300', cls: 'celebrate', body: `<div class="lvl-burst"><div class="big-lvl">${lvl}</div><p>כל הכבוד! הגעתם לרמה ${lvl}</p><div class="reward-chip">🪙 +${reward}</div>${unlocked.length ? `<p class="small">נפתחו פריטים חדשים:</p><div class="unlock-row">${unlocked.map(i => `<img src="${G.Avatar.icon(i.id)}" title="${i.name}">`).join('')}</div>` : ''}<button class="btn primary big">יש! 🎉</button></div>` });
    $('.btn', m).onclick = () => m.close();
    if (G.World.player) G.World.player.lvl = lvl;
  };
  UI.achievement = function (a) {
    G.Audio.sfx('levelup');
    const el = U.el(`<div class="ach-pop"><span class="ai">${a.icon}</span><div><small>הישג חדש!</small><b>${a.name}</b><span>${a.text}</span></div></div>`);
    $('#toasts').appendChild(el); setTimeout(() => el.classList.add('out'), 4200); setTimeout(() => el.remove(), 4700);
  };
  UI.fade = function (name, icon, mid) {
    const f = $('#fade'); $('#fadeName').textContent = name; $('#fadeIcon').textContent = icon || '✨';
    f.classList.add('on');
    setTimeout(() => { try { mid(); } catch (e) { console.error(e); } setTimeout(() => f.classList.remove('on'), 380); }, 380);
  };
  UI.badge = function (act, on) { const b = $(`[data-act=${act}]`); if (b) b.classList.toggle('dot', !!on); };

  // ---------- HUD ----------
  UI.initHud = function () {
    U.$$('#hudSide button').forEach(b => b.onclick = () => { G.Audio.init(); G.Audio.sfx('click'); UI.sideAct(b.dataset.act); });
    $('#hudProfile').onclick = () => UI.openBag();
    $('#chatForm').onsubmit = (e) => { e.preventDefault(); const v = $('#chatInput').value.trim(); if (v) UI.sendChat(v); $('#chatInput').value = ''; $('#chatInput').blur(); };
    $('#emoteBtn').onclick = () => UI.emoteMenu();
    G.bus.on('zone', id => { const Z = id === 'house' ? { name: G.World.zone.name, icon: '🏠' } : G.Zones[id]; $('#hudZone').innerHTML = `<span>${Z.icon}</span>${U.esc(Z.name)}`; });
  };
  UI.sideAct = function (a) {
    ({ map: UI.openMap, bag: UI.openBag, quests: UI.openQuests, friends: UI.openFriends, home: () => G.House.goHome(), emote: UI.emoteMenu, settings: UI.openSettings })[a]();
  };
  UI.updateHud = function () {
    const P = G.P; if (!P) return;
    $('#hudName').textContent = P.name; $('#hudLvl').textContent = P.level;
    $('#hudXp').style.width = Math.min(100, P.xp / G.Econ.need(P.level) * 100) + '%';
    $('#hudXpTxt').textContent = `${P.xp}/${G.Econ.need(P.level)} XP`;
    const el = $('#hudCoinsVal'), cur = parseInt(el.dataset.v || '0', 10), target = P.coins;
    if (cur !== target) {
      const start = performance.now(), from = cur;
      cancelAnimationFrame(UI._coinAnim);
      const step = (ts) => { const k = Math.min(1, (ts - start) / 600); const v = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3))); el.textContent = U.fmt(v); if (k < 1) UI._coinAnim = requestAnimationFrame(step); };
      UI._coinAnim = requestAnimationFrame(step); el.dataset.v = target;
    }
  };
  UI.refreshAvatar = function () { if (G.P) $('#hudAvatar').src = G.Avatar.portrait(G.P.look, 96); };

  // ---------- צ'אט ----------
  UI.chatLine = function (name, text, kind) {
    const log = $('#chatlog'); if (!log) return;
    const l = U.el(`<div class="cl ${kind || ''}"><b>${U.esc(name)}:</b> ${U.esc(text)}</div>`);
    log.appendChild(l); while (log.children.length > 7) log.firstChild.remove();
    setTimeout(() => l.classList.add('old'), 14000);
  };
  UI.sendChat = function (text) {
    const W = G.World, P = G.P;
    text = text.slice(0, 80);
    W.say(W.player, text); UI.chatLine(P.name, text, 'me'); G.Audio.sfx('msg');
    G.Econ.track('chat'); G.Net.chat(text);
    // תגובות בוטים
    const nearby = W.chars.filter(c => c.kind === 'bot' && U.dist(c.x, c.y, W.player.x, W.player.y) < 600);
    if (!nearby.length) return;
    const t = text;
    let reply = null;
    if (/שלום|היי|הי\b|אהלן|הלו|בוקר טוב|ערב טוב|hello|hi/i.test(t)) reply = n => U.pick([`היי ${P.name}! 😊`, `אהלן ${P.name}! מה קורה?`, `שלום שלום 👋`, `היי! ברוך הבא לפופילנד ✨`]);
    else if (/מה נשמע|מה קורה|מה המצב/.test(t)) reply = () => U.pick(['מעולה! ואצלך?', 'הכל טוב, משחק פה במשחקייה 😄', 'סבבה! קניתי עכשיו כובע חדש']);
    else if (/חבר|חברים/.test(t)) reply = () => 'בטח! לחצו עליי ושלחו בקשת חברות 🤝';
    else if (/משחק|לשחק|משחקייה/.test(t)) reply = () => U.pick(['המשחקייה בכיכר, ליד הקולנוע! 🕹️', 'אני הכי אוהב את מרוץ פופי 🏎️', 'בואו לשחק בחידון!']);
    else if (/מטבע|כסף|coins/i.test(t)) reply = () => U.pick(['הכי מהר מרוויחים במשחקייה ובמשימות היומיות 💰', 'תאספו צדפים בחוף, זה נותן מטבעות!', 'אל תשכחו את תיבת האוצר בפארק 🗝️']);
    else if (/חחח|lol|😂/.test(t)) reply = () => U.pick(['חחחח', '😂😂', 'הצחקת אותי']);
    else if (Math.random() < 0.3) reply = () => U.pick(['נכון!', 'וואו', 'מגניב 😎', 'אני מסכים', '😄']);
    if (reply) {
      const b = U.pick(nearby);
      setTimeout(() => { if (!b.gone) { const r = reply(); W.say(b, r); UI.chatLine(b.name, r, 'bot'); b.dir = b.x < W.player.x ? 'right' : 'left'; if (Math.random() < 0.4) W.emote(U.pick(['wave', 'happy', 'laugh']), b); } }, 900 + Math.random() * 1400);
    }
  };
  UI.emoteMenu = function () {
    const ex = $('#emoteMenu'); if (ex) { ex.remove(); return; }
    const m = U.el(`<div id="emoteMenu">${D.EMOTES.map((e, i) => `<button data-e="${e.id}" title="${e.name} (${i + 1})"><span>${e.icon}</span><small>${e.name}</small></button>`).join('')}</div>`);
    U.$$('button', m).forEach(b => b.onclick = () => { G.World.emote(b.dataset.e); m.remove(); });
    document.body.appendChild(m);
    setTimeout(() => document.addEventListener('pointerdown', function h(e) { if (!m.contains(e.target) && e.target.id !== 'emoteBtn') { m.remove(); document.removeEventListener('pointerdown', h); } }), 10);
  };

  // ---------- תצוגה חיה של דמות ----------
  UI.livePreview = function (canvas, getLook, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d'); let dirI = 0; const dirs = ['down', 'left', 'up', 'right'];
    let alive = true, t = 0, last = performance.now(), emoteT = 0, em = null;
    canvas.onclick = () => { dirI = (dirI + 1) % 4; };
    const api = { stop() { alive = false; }, spin(d) { dirI = (dirI + d + 4) % 4; }, emote(id) { em = id; emoteT = 0; } };
    const step = (ts) => {
      if (!alive || !canvas.isConnected) return;
      const dt = (ts - last) / 1000; last = ts; t += dt; emoteT += dt;
      const w = canvas.width, h = canvas.height; ctx.clearRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w / 2, h * 0.86, 10, w / 2, h * 0.86, w * 0.5); g.addColorStop(0, 'rgba(124,92,255,0.25)'); g.addColorStop(1, 'rgba(124,92,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      U.ell(ctx, w / 2, h * 0.86, w * 0.3, w * 0.08, 'rgba(255,255,255,0.6)');
      const L = getLook(); const s = opts.scale || (h / 120);
      if (em && emoteT > 2.5) em = null;
      G.Avatar.draw(ctx, L, w / 2 - (L.pet ? 14 * s : 0), h * 0.86, { dir: dirs[dirI], t, scale: s, emote: em ? { id: em, t: emoteT } : null });
      if (L.pet) G.Avatar.drawPet(ctx, L.pet, w / 2 + 34 * s, h * 0.86, t, 'left', s * 0.9);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return api;
  };

  // ---------- חנות ----------
  UI.openShop = function (shopId) {
    const S = D.SHOPS[shopId], P = G.P;
    let tab = S.tabs[0][0], tryLook = Object.assign({}, P.look), tried = null;
    const body = U.el(`<div class="shop">
      <div class="shop-side">
        <div class="keeper"><img src="${G.Avatar.portrait((G.World.staff.find(s => s.act === 'shop:' + shopId) || { look: P.look }).look, 80)}"><div><b>${S.keeper}</b><span>ברוכים הבאים! מה בא לכם היום?</span></div></div>
        <canvas class="preview" width="260" height="300"></canvas>
        <div class="pv-ctrl"><button class="btn sm" data-r="-1">⟲</button><span>מדידה</span><button class="btn sm" data-r="1">⟳</button></div>
        <button class="btn ghost sm reset">↺ חזרה לבגדים שלי</button>
      </div>
      <div class="shop-main"><div class="tabs"></div><div class="grid items"></div></div></div>`);
    const m = UI.modal({ title: S.name, icon: S.icon, color: S.color, body, cls: 'wide' });
    const cv = $('.preview', body); const isFurnShop = shopId === 'furniture';
    let pv;
    if (isFurnShop) { cv.classList.add('furn'); }
    else pv = UI.livePreview(cv, () => tryLook);
    U.$$('.pv-ctrl button', body).forEach(b => b.onclick = () => pv && pv.spin(+b.dataset.r));
    $('.reset', body).onclick = () => { tryLook = Object.assign({}, P.look); tried = null; render(); };
    const tabs = $('.tabs', body);
    tabs.innerHTML = S.tabs.map(t => `<button data-t="${t[0]}">${t[1]}</button>`).join('');
    U.$$('button', tabs).forEach(b => b.onclick = () => { tab = b.dataset.t; G.Audio.sfx('click'); render(); });
    const drawFurnPreview = (id) => {
      const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
      if (!id) { ctx.font = '600 15px Rubik'; ctx.fillStyle = '#7a6f99'; ctx.textAlign = 'center'; ctx.fillText('בחרו רהיט כדי לראות אותו', 130, 150); return; }
      const it = D.ITEMS[id]; const sz = G.Furn.SIZE[it.style];
      U.fillRR(ctx, 20, 40, 220, 200, 16, '#fff3e6'); U.fillRR(ctx, 20, 180, 220, 80, 0, '#e8c398');
      const k = Math.min(1.5, 190 / sz.w, 150 / sz.h);
      ctx.save(); ctx.translate(130, 230); ctx.scale(k, k); G.Furn.draw(ctx, it, 0, 0, performance.now() / 1000, false); ctx.restore();
    };
    if (isFurnShop) { const anim = () => { if (!cv.isConnected) return; drawFurnPreview(tried); requestAnimationFrame(anim); }; anim(); }
    function render() {
      U.$$('button', tabs).forEach(b => b.classList.toggle('on', b.dataset.t === tab));
      let items = D.ITEM_LIST.filter(S.filter);
      if (shopId === 'rare') items = items.filter(i => tab === 'pet' ? i.cat === 'pet' : tab === 'furn' ? i.cat === 'furn' : !['pet', 'furn'].includes(i.cat));
      else items = items.filter(i => i.cat === tab);
      const grid = $('.items', body);
      grid.innerHTML = items.map(it => {
        const own = P.inv[it.id] || 0, locked = it.lvl && P.level < it.lvl, isF = it.cat === 'furn';
        const status = locked ? `<span class="lock">🔒 רמה ${it.lvl}</span>` : (!isF && own) ? `<span class="owned">✔ בבעלותכם</span>` : `<span class="price ${P.coins < it.price ? 'no' : ''}">🪙 ${it.price}</span>`;
        return `<div class="card ${tried === it.id ? 'sel' : ''} ${it.rare ? 'rare' : ''}" data-id="${it.id}">
          ${it.rare ? '<i class="rare-tag">נדיר</i>' : ''}${isF && own ? `<i class="cnt">×${own}</i>` : ''}
          <img src="${G.Avatar.icon(it.id)}"><b>${it.name}</b>${status}
          <div class="row">${isF ? '' : `<button class="btn sm ghost try">מדידה</button>`}<button class="btn sm primary buy" ${locked || (!isF && own) ? 'disabled' : ''}>קנייה</button></div></div>`;
      }).join('');
      U.$$('.card', grid).forEach(card => {
        const id = card.dataset.id, it = D.ITEMS[id];
        const tryOn = () => { tried = id; if (it.cat !== 'furn') tryLook = Object.assign({}, tryLook, { [it.cat]: id }); if (pv) pv.emote('happy'); U.$$('.card', grid).forEach(c => c.classList.toggle('sel', c.dataset.id === id)); };
        card.onclick = (e) => { if (e.target.classList.contains('buy')) return; tryOn(); G.Audio.sfx('click'); };
        const buyBtn = $('.buy', card);
        buyBtn.onclick = (e) => {
          e.stopPropagation();
          const r = card.getBoundingClientRect();
          if (G.Econ.buy(id, [r.left + r.width / 2, r.top + 50])) {
            if (it.cat !== 'furn' && it.cat !== 'pet') UI.dialogSmall(`קניתם ${it.name}! ללבוש עכשיו?`, [{ text: 'כן, ללבוש! ✨', primary: true, fn: () => { G.P.look[it.cat] = id; tryLook[it.cat] = id; UI.applyLook(); } }, { text: 'אחר כך' }]);
            else if (it.cat === 'pet') UI.dialogSmall(`${it.name} מחכה לכם! לקחת אותו לטיול?`, [{ text: 'כן! 🐾', primary: true, fn: () => { G.P.look.pet = id; UI.applyLook(); G.Econ.checkAch(); } }, { text: 'אחר כך' }]);
            else UI.toast('🛋️ הרהיט נשלח לתיק – סדרו אותו בבית!', 'ok');
            render();
          }
        };
        const tb = $('.try', card); if (tb) tb.onclick = (e) => { e.stopPropagation(); tryOn(); };
      });
    }
    render();
  };
  UI.applyLook = function () { G.World.refreshPlayerLook(); UI.refreshAvatar(); G.Store.save(G.P); G.Net.dirty = true; };
  UI.dialogSmall = function (text, buttons) {
    const m = U.el(`<div class="mini-dialog"><p>${U.esc(text)}</p><div class="row">${buttons.map((b, i) => `<button class="btn ${b.primary ? 'primary' : 'ghost'}" data-i="${i}">${b.text}</button>`).join('')}</div></div>`);
    const back = U.el('<div class="modal-back light"></div>'); back.appendChild(m); $('#modals').appendChild(back); UI.stack.push(back);
    back.close = () => { UI.stack = UI.stack.filter(x => x !== back); back.remove(); };
    U.$$('button', m).forEach(b => b.onclick = () => { const fn = buttons[+b.dataset.i].fn; back.close(); fn && fn(); });
  };
  UI.dialog = function (o) {
    const body = U.el(`<div class="npc-dialog">${o.avatar ? `<img class="npc-face" src="${G.Avatar.portrait(o.avatar.look, 110)}">` : ''}<div class="npc-text"><p>${o.text}</p>${o.html || ''}<div class="row">${(o.buttons || []).map((b, i) => `<button class="btn ${i === 0 ? 'primary' : 'ghost'}" data-i="${i}">${b.text}</button>`).join('')}</div></div></div>`);
    const m = UI.modal({ title: o.title, icon: '', color: o.color || '#ff8a3d', body, cls: 'narrow', onClose: o.onClose });
    U.$$('.row button', body).forEach(b => b.onclick = () => { const bt = o.buttons[+b.dataset.i]; if (!bt.keep) m.close(); bt.fn && bt.fn(m); });
    return m;
  };
  UI.cafeMenu = function () {
    const items = [['☕', 'קפה הפוך', 15, 'happy'], ['🍫', 'שוקו חם', 12, 'love'], ['🍰', 'עוגת תותים', 20, 'laugh'], ['🧋', 'שייק בועות', 18, 'cool']];
    const html = `<div class="menu-grid">${items.map((it, i) => `<button class="menu-item" data-i="${i}"><span>${it[0]}</span><b>${it[1]}</b><em>🪙 ${it[2]}</em></button>`).join('')}</div>`;
    const m = UI.dialog({ title: '☕ קפה ענן', avatar: G.World.staff[0], text: 'שלום! מה תרצו להזמין? כל משקה נותן XP ומצב רוח טוב 😊', html, buttons: [{ text: 'אולי אחר כך' }] });
    U.$$('.menu-item', m).forEach(b => b.onclick = () => {
      const it = items[+b.dataset.i]; if (!G.Econ.spend(it[2])) return; m.close();
      G.World.emote(it[3]); G.World.floatText(G.World.player.x, G.World.player.y - 110, it[0]);
      G.Econ.addXP(12); G.Econ.track('coffee'); G.Audio.sfx('good'); UI.toast(`${it[0]} ${it[1]} – בתיאבון!`);
    });
  };
  UI.guide = function (onClose) {
    const tips = [
      ['🕹️', 'במשחקייה יש 7 משחקים אמיתיים – כל משחק מזכה במטבעות לפי הביצועים.'],
      ['⭐', 'בדקו את המשימות היומיות (מקש Q) – הן מתחלפות כל יום ונותנות הרבה מטבעות.'],
      ['🛍️', 'בקניון יש 4 חנויות: בגדים, אביזרים, רהיטים ופריטים נדירים.'],
      ['🏠', 'לכל שחקן יש בית בשכונת הדובדבן. קנו רהיטים וסדרו אותם בבית!'],
      ['🐚', 'בחוף אפשר לאסוף צדפים, בפארק לקטוף פרחים ולפתוח תיבת אוצר יומית.'],
      ['⌨️', 'תנועה: חיצים / WASD או לחיצה על המסך. E – פעולה, Enter – צ׳אט, 1-8 – רגשות, M – מפה.'],
    ];
    UI.dialog({ title: '👋 פופה המדריכה', avatar: G.World.staff[0], color: '#ff7eb6', text: `היי ${U.esc(G.P.name)}! אני פופה, ואני כאן לעזור. הנה כמה טיפים:`, html: `<ul class="tips">${tips.map(t => `<li><span>${t[0]}</span>${t[1]}</li>`).join('')}</ul>`, buttons: [{ text: 'תודה פופה! 💜' }, { text: '🕹️ קחי אותי למשחקייה', fn: () => G.World.go('arcade') }], onClose: typeof onClose === 'function' ? onClose : null });
  };

  // ---------- תיק / ארון בגדים ----------
  UI.openBag = function () {
    const P = G.P;
    const cats = [['shirt', '👕', 'חולצות'], ['pants', '👖', 'מכנסיים'], ['shoes', '👟', 'נעליים'], ['hat', '🧢', 'כובעים'], ['glasses', '🕶️', 'משקפיים'], ['bag', '🎒', 'תיקים'], ['acc', '💍', 'אביזרים'], ['pet', '🐾', 'חיות'], ['furn', '🛋️', 'רהיטים'], ['look', '💇', 'מראה']];
    let tab = 'shirt';
    const body = U.el(`<div class="bag">
      <div class="bag-side"><canvas class="preview" width="260" height="320"></canvas><div class="pv-ctrl"><button class="btn sm" data-r="-1">⟲</button><span>${U.esc(P.name)} • רמה ${P.level}</span><button class="btn sm" data-r="1">⟳</button></div>
      <div class="bag-stats"><div><b>${U.fmt(P.coins)}</b><span>מטבעות</span></div><div><b>${Object.keys(P.inv).filter(k => P.inv[k] > 0).length}</b><span>פריטים</span></div><div><b>${P.friends.length}</b><span>חברים</span></div></div></div>
      <div class="bag-main"><div class="tabs icons">${cats.map(c => `<button data-t="${c[0]}" title="${c[2]}"><span>${c[1]}</span><small>${c[2]}</small></button>`).join('')}</div><div class="bag-content"></div></div></div>`);
    UI.modal({ title: 'התיק שלי', icon: '🎒', color: '#7c5cff', body, cls: 'wide' });
    const pv = UI.livePreview($('.preview', body), () => P.look);
    U.$$('.pv-ctrl button', body).forEach(b => b.onclick = () => pv.spin(+b.dataset.r));
    U.$$('.tabs button', body).forEach(b => b.onclick = () => { tab = b.dataset.t; G.Audio.sfx('click'); render(); });
    function render() {
      U.$$('.tabs button', body).forEach(b => b.classList.toggle('on', b.dataset.t === tab));
      const cont = $('.bag-content', body);
      if (tab === 'look') { cont.innerHTML = ''; cont.appendChild(UI.lookEditor(P.look, () => { UI.applyLook(); })); return; }
      const items = D.ITEM_LIST.filter(i => i.cat === tab && (P.inv[i.id] || 0) > 0);
      const required = ['shirt', 'pants', 'shoes'].includes(tab);
      if (!items.length) { cont.innerHTML = `<div class="empty">אין לכם עדיין פריטים כאן 🙈<br><small>${tab === 'furn' ? 'קנו רהיטים בחנות "בית ונוי" בקניון' : 'בקרו בחנויות בקניון פופי'}</small><br><button class="btn primary go-mall">🛍️ לקניון</button></div>`; $('.go-mall', cont).onclick = () => { UI.closeAll(); G.World.go('mall'); }; return; }
      if (tab === 'furn') {
        cont.innerHTML = `<p class="hint">רהיטים שבתיק מוכנים לסידור. היכנסו לבית ולחצו על "עיצוב הבית".</p><div class="grid items small">${items.map(it => `<div class="card"><i class="cnt">×${P.inv[it.id]}</i><img src="${G.Avatar.icon(it.id)}"><b>${it.name}</b></div>`).join('')}</div><button class="btn primary go-home">🏠 לבית שלי</button>`;
        $('.go-home', cont).onclick = () => { UI.closeAll(); G.House.goHome(true); }; return;
      }
      cont.innerHTML = `${!required ? `<div class="card none ${!P.look[tab] ? 'sel' : ''}" data-id=""><div class="none-ico">🚫</div><b>בלי</b></div>` : ''}${items.map(it => `<div class="card ${P.look[tab] === it.id ? 'sel' : ''}" data-id="${it.id}">${it.rare ? '<i class="rare-tag">נדיר</i>' : ''}<img src="${G.Avatar.icon(it.id)}"><b>${it.name}</b>${P.look[tab] === it.id ? '<span class="owned">✔ לובשים</span>' : ''}</div>`).join('')}`;
      cont.className = 'bag-content grid items';
      U.$$('.card', cont).forEach(c => c.onclick = () => { P.look[tab] = c.dataset.id || null; UI.applyLook(); pv.emote('happy'); G.Audio.sfx('pop'); if (tab === 'pet') G.Econ.checkAch(); render(); });
    }
    render();
  };
  // עורך מראה (משמש גם ביצירת דמות)
  UI.lookEditor = function (look, onChange) {
    const el = U.el(`<div class="look-editor">
      <h4>צבע עור</h4><div class="swatches" data-k="skin">${D.SKINS.map(c => `<button style="--c:${c}" data-v="${c}"></button>`).join('')}</div>
      <h4>תסרוקת</h4><div class="chips" data-k="hairStyle">${D.HAIR_STYLES.map(h => `<button data-v="${h.id}">${h.name}</button>`).join('')}</div>
      <h4>צבע שיער</h4><div class="swatches" data-k="hairColor">${D.HAIR_COLORS.map(c => `<button style="--c:${c}" data-v="${c}"></button>`).join('')}</div>
      <h4>עיניים</h4><div class="chips" data-k="eyes">${D.EYES.map(h => `<button data-v="${h.id}">${h.name}</button>`).join('')}</div>
      <h4>צבע עיניים</h4><div class="swatches" data-k="eyeColor">${D.EYE_COLORS.map(c => `<button style="--c:${c}" data-v="${c}"></button>`).join('')}</div></div>`);
    const sync = () => U.$$('[data-k]', el).forEach(g => U.$$('button', g).forEach(b => b.classList.toggle('on', look[g.dataset.k] === b.dataset.v)));
    U.$$('[data-k]', el).forEach(g => U.$$('button', g).forEach(b => b.onclick = () => { look[g.dataset.k] = b.dataset.v; sync(); G.Audio.sfx('click'); onChange && onChange(); }));
    sync();
    return el;
  };

  // ---------- משימות ----------
  UI.openQuests = function () {
    const P = G.P; G.Econ.ensureQuests();
    let tab = 'daily';
    const body = U.el(`<div class="quests"><div class="daily-strip"></div><div class="tabs"><button data-t="daily">משימות יומיות</button><button data-t="weekly">משימות שבועיות</button><button data-t="ach">הישגים</button></div><div class="qlist"></div></div>`);
    UI.modal({ title: 'משימות והישגים', icon: '⭐', color: '#ffb300', body, cls: 'mid' });
    U.$$('.tabs button', body).forEach(b => b.onclick = () => { tab = b.dataset.t; render(); });
    function render() {
      const ds = G.Econ.dailyState();
      $('.daily-strip', body).innerHTML = `<div class="ds-title">🎁 פרס כניסה יומי</div><div class="days">${D.DAILY_REWARDS.map((r, i) => `<div class="day ${i + 1 < ds.day || (ds.claimed && i + 1 === ds.day) ? 'got' : ''} ${i + 1 === ds.day ? 'cur' : ''}"><small>יום ${i + 1}</small><b>🪙${r}</b></div>`).join('')}</div>${ds.claimed ? '<span class="ok-chip">✔ נאסף היום</span>' : '<button class="btn primary claim-daily">אספו!</button>'}`;
      const cd = $('.claim-daily', body); if (cd) cd.onclick = () => { G.Econ.claimDaily(); UI.confetti(1.5); render(); };
      U.$$('.tabs button', body).forEach(b => b.classList.toggle('on', b.dataset.t === tab));
      const list = $('.qlist', body);
      if (tab === 'ach') {
        list.innerHTML = D.ACHIEVEMENTS.map(a => { const st = P.ach[a.id] || 0, v = Math.min(a.n, G.Econ.statVal(a.stat)); return `<div class="quest ach ${st ? 'done' : ''}"><span class="qi">${a.icon}</span><div class="qt"><b>${a.name}</b><span>${a.text}</span><div class="bar"><i style="width:${v / a.n * 100}%"></i></div><small>${U.fmt(v)} / ${U.fmt(a.n)}</small></div><div class="qr">${st === 2 ? '<span class="ok-chip">✔</span>' : st === 1 ? `<button class="btn primary sm" data-a="${a.id}">🪙 ${a.coins}</button>` : `<span class="rw">🪙 ${a.coins}</span>`}</div></div>`; }).join('');
        U.$$('[data-a]', list).forEach(b => b.onclick = () => { const r = b.getBoundingClientRect(); G.Econ.claimAch(b.dataset.a); render(); });
        return;
      }
      const qs = P.quests[tab].list;
      list.innerHTML = (tab === 'weekly' ? '<p class="hint">משימות שבועיות מתחלפות בתחילת כל שבוע ונותנות פרסים גדולים!</p>' : '<p class="hint">המשימות היומיות מתחלפות בחצות 🌙</p>') + qs.map((q, i) => { const d = G.Econ.qdef(q.id); const done = q.prog >= d.n; return `<div class="quest ${q.claimed ? 'done' : ''}"><span class="qi">${done ? '✅' : '🎯'}</span><div class="qt"><b>${d.text}</b><div class="bar"><i style="width:${q.prog / d.n * 100}%"></i></div><small>${U.fmt(q.prog)} / ${U.fmt(d.n)}</small></div><div class="qr">${q.claimed ? '<span class="ok-chip">✔ נאסף</span>' : done ? `<button class="btn primary sm" data-i="${i}">אספו 🪙${d.coins}</button>` : `<span class="rw">🪙 ${d.coins} • ${d.xp}XP</span>`}</div></div>`; }).join('');
      U.$$('[data-i]', list).forEach(b => b.onclick = () => { G.Econ.claim(tab, +b.dataset.i); render(); });
    }
    render();
  };
  UI.dailyPopup = function () {
    const ds = G.Econ.dailyState(); if (ds.claimed) return;
    const body = U.el(`<div class="daily-pop"><p>ברוכים השבים! זה היום ה-${ds.day} ברצף שלכם 🔥</p><div class="days">${D.DAILY_REWARDS.map((r, i) => `<div class="day ${i + 1 < ds.day ? 'got' : ''} ${i + 1 === ds.day ? 'cur' : ''}"><small>יום ${i + 1}</small><span>${i === 6 ? '🎁' : '🪙'}</span><b>${r}</b></div>`).join('')}</div><button class="btn primary big">אספו ${D.DAILY_REWARDS[ds.day - 1]} מטבעות!</button></div>`);
    const m = UI.modal({ title: 'פרס כניסה יומי', icon: '🎁', color: '#ff7eb6', body, cls: 'mid celebrate' });
    $('.btn', body).onclick = () => { const r = $('.btn', body).getBoundingClientRect(); G.Econ.claimDaily(); UI.confetti(2); m.close(); };
  };

  // ---------- מפה ----------
  UI.openMap = function () {
    const desc = { plaza: 'מזרקה, ספסלים ומפגש חברים', mall: '4 חנויות: בגדים, אביזרים, רהיטים ונדירים', cafe: 'משקאות, עוגות ושולחנות', arcade: '7 משחקים שמזכים במטבעות', cinema: 'סרטים מצוירים ופופקורן', park: 'ברווזים, פרחים ותיבת אוצר', beach: 'צדפים, גלידה וגלים', residential: 'הבית שלכם והבתים של החברים', events: 'מסיבה, DJ ורחבת ריקודים' };
    const count = id => G.World.bots.filter(b => b.zone === id).length + G.Net.countIn(id) + (G.World.zoneId === id ? 1 : 0);
    const body = U.el(`<div class="map"><div class="map-grid">${G.Zones.LIST.map(id => { const Z = G.Zones[id]; return `<button class="zone-card z-${id} ${G.World.zoneId === id ? 'here' : ''}" data-z="${id}"><span class="zi">${Z.icon}</span><b>${Z.name}</b><small>${desc[id]}</small><em>👥 ${count(id)}</em>${G.World.zoneId === id ? '<i class="here-tag">אתם כאן</i>' : ''}</button>`; }).join('')}<button class="zone-card z-home" data-z="home"><span class="zi">🏠</span><b>הבית שלי</b><small>לסדר רהיטים ולהזמין חברים</small><em>${D.HOUSE_LEVELS[G.P.house.lvl].name}</em></button></div></div>`);
    const m = UI.modal({ title: 'מפת פופילנד', icon: '🗺️', color: '#2ec4d6', body, cls: 'wide' });
    U.$$('.zone-card', body).forEach(b => b.onclick = () => { m.close(); if (b.dataset.z === 'home') G.House.goHome(); else if (b.dataset.z !== G.World.zoneId) G.World.go(b.dataset.z); });
  };

  // ---------- חברים ----------
  UI.whereIs = function (name) {
    const b = G.World.bots.find(x => x.name === name); if (b) return { online: true, zone: b.zone, bot: true };
    const r = G.Net.findByName(name); if (r) return { online: true, zone: r.zone, remote: r };
    return { online: false };
  };
  UI.openFriends = function (startTab, chatWith) {
    const P = G.P; let tab = startTab || 'friends', conv = chatWith || null;
    const body = U.el(`<div class="friends"><div class="tabs"><button data-t="friends">החברים שלי</button><button data-t="online">מי מחובר עכשיו</button><button data-t="msgs">הודעות</button></div><div class="flist"></div></div>`);
    const m = UI.modal({ title: 'חברים', icon: '👫', color: '#3cc98a', body, cls: 'mid' });
    U.$$('.tabs button', body).forEach(b => b.onclick = () => { tab = b.dataset.t; conv = null; render(); });
    m.rerender = () => render();
    UI._friendsModal = m;
    function zoneName(z) { return z === 'house' ? 'בבית' : (G.Zones[z] ? G.Zones[z].icon + ' ' + G.Zones[z].name : ''); }
    function row(name, look, info, actions) {
      return `<div class="frow"><img src="${look ? G.Avatar.portrait(look, 64) : ''}"><div class="fi"><b>${U.esc(name)}</b><small>${info}</small></div><div class="fa">${actions}</div></div>`;
    }
    function lookOf(name) { const b = G.World.bots.find(x => x.name === name); if (b) return b.look; const r = G.Net.findByName(name); return r ? r.look : null; }
    function render() {
      U.$$('.tabs button', body).forEach(b => b.classList.toggle('on', b.dataset.t === tab));
      const list = $('.flist', body);
      if (conv) return renderConv(list);
      if (tab === 'friends') {
        if (!P.friends.length) { list.innerHTML = '<div class="empty">עוד אין לכם חברים 🥺<br><small>לחצו על דמות בעולם או עברו ללשונית "מי מחובר" כדי להוסיף חברים</small></div>'; return; }
        list.innerHTML = P.friends.map(n => { const w = UI.whereIs(n); return row(n, lookOf(n), w.online ? `<span class="on-dot"></span>${zoneName(w.zone)}${w.bot ? ' • בוט' : ''}` : '<span class="off-dot"></span>לא מחובר', `<button class="btn sm" data-msg="${U.esc(n)}" title="הודעה">💬</button><button class="btn sm" data-house="${U.esc(n)}" title="ביקור בבית">🏠</button>${w.online ? `<button class="btn sm" data-go="${U.esc(n)}" title="הצטרפות">📍</button>` : ''}`); }).join('');
      } else if (tab === 'online') {
        const people = G.Net.list().map(r => ({ name: r.name, look: r.look, zone: r.zone, lvl: r.lvl, real: true })).concat(G.World.bots.map(b => ({ name: b.name, look: b.look, zone: b.zone, lvl: b.lvl })));
        list.innerHTML = `<p class="hint">${G.Net.on ? '🟢 מחוברים לשרת – שחקנים אמיתיים מסומנים בירוק.' : 'כרגע אין חיבור לשרת מרובה משתתפים, אז העולם מלא בשחקנים מדומים (מסומנים "בוט").'}</p>` +
          people.map(p => row(p.name, p.look, `${p.real ? '<span class="real-tag">שחקן אמיתי</span>' : '<span class="bot-tag">בוט</span>'} רמה ${p.lvl} • ${zoneName(p.zone)}`, P.friends.includes(p.name) ? '<span class="ok-chip">✔ חבר</span>' : `<button class="btn sm primary" data-add="${U.esc(p.name)}">➕ הוספה</button>`)).join('');
      } else {
        const names = Object.keys(P.msgs);
        list.innerHTML = names.length ? names.map(n => { const ms = P.msgs[n], last = ms[ms.length - 1]; return row(n, lookOf(n), U.esc((last.from === P.name ? 'אתם: ' : '') + last.text).slice(0, 50), `${ms.some(x => x.unread) ? '<span class="unread">חדש</span>' : ''}<button class="btn sm" data-msg="${U.esc(n)}">פתיחה</button>`); }).join('') : '<div class="empty">אין הודעות עדיין ✉️</div>';
      }
      U.$$('[data-msg]', list).forEach(b => b.onclick = () => { conv = b.dataset.msg; render(); });
      U.$$('[data-house]', list).forEach(b => b.onclick = () => { m.close(); G.House.visit(b.dataset.house); });
      U.$$('[data-go]', list).forEach(b => b.onclick = () => { const w = UI.whereIs(b.dataset.go); m.close(); if (w.zone && w.zone !== G.World.zoneId && G.Zones[w.zone]) G.World.go(w.zone); });
      U.$$('[data-add]', list).forEach(b => b.onclick = () => { UI.addFriend(b.dataset.add); setTimeout(render, 1600); b.disabled = true; b.textContent = 'נשלח...'; });
    }
    function renderConv(list) {
      const msgs = P.msgs[conv] || [];
      msgs.forEach(x => x.unread = false); UI.updateMsgBadge();
      list.innerHTML = `<div class="conv"><div class="conv-head"><button class="btn sm back">→ חזרה</button><img src="${lookOf(conv) ? G.Avatar.portrait(lookOf(conv), 48) : ''}"><b>${U.esc(conv)}</b></div><div class="conv-body">${msgs.map(x => `<div class="msg ${x.from === P.name ? 'me' : ''}">${U.esc(x.text)}</div>`).join('') || '<div class="empty small">כתבו את ההודעה הראשונה 👋</div>'}</div><form class="conv-form"><input maxlength="120" placeholder="כתבו הודעה..."><button class="btn primary">שליחה</button></form></div>`;
      const cb = $('.conv-body', list); cb.scrollTop = cb.scrollHeight;
      $('.back', list).onclick = () => { conv = null; render(); };
      const f = $('.conv-form', list), inp = $('input', f); setTimeout(() => inp.focus(), 50);
      f.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; UI.sendDM(conv, v); render(); };
    }
    render();
  };
  UI.addFriend = function (name) {
    const P = G.P;
    if (P.friends.includes(name)) return;
    UI.toast(`📨 נשלחה בקשת חברות ל-${name}`);
    const isBot = G.World.bots.some(b => b.name === name);
    setTimeout(() => {
      if (isBot && Math.random() < 0.1) { UI.toast(`${name} עסוק/ה כרגע, נסו שוב מאוחר יותר`); return; }
      if (!P.friends.includes(name)) P.friends.push(name);
      UI.toast(`🤝 ${name} אישר/ה את בקשת החברות!`, 'ok'); G.Audio.sfx('good');
      G.Econ.track('friend'); G.Econ.checkAch(); G.Store.save(P);
      if (!isBot) G.Net.friendNotice(name);
      if (UI._friendsModal && UI._friendsModal.isConnected) UI._friendsModal.rerender();
    }, isBot ? 1300 : 600);
  };
  UI.sendDM = function (to, text) {
    const P = G.P;
    (P.msgs[to] = P.msgs[to] || []).push({ from: P.name, text, t: Date.now() });
    if (P.msgs[to].length > 60) P.msgs[to].shift();
    G.Store.save(P); G.Audio.sfx('msg');
    if (G.World.bots.some(b => b.name === to)) {
      setTimeout(() => UI.receiveDM(to, U.pick(D.BOT_DM)), 1800 + Math.random() * 2500);
    } else G.Net.dm(to, text);
  };
  UI.receiveDM = function (from, text) {
    const P = G.P; if (!P) return;
    (P.msgs[from] = P.msgs[from] || []).push({ from, text, t: Date.now(), unread: true });
    G.Store.save(P); G.Audio.sfx('msg'); UI.toast(`💬 ${from}: ${text}`);
    UI.updateMsgBadge();
    if (UI._friendsModal && UI._friendsModal.isConnected) UI._friendsModal.rerender();
  };
  UI.updateMsgBadge = function () { const P = G.P; UI.badge('friends', Object.values(P.msgs).some(ms => ms.some(x => x.unread))); };

  // ---------- כרטיס פרופיל ----------
  UI.profileCard = function (c) {
    const P = G.P, isFriend = P.friends.includes(c.name);
    const tag = c.kind === 'bot' ? '<span class="bot-tag">בוט – שחקן מדומה</span>' : '<span class="real-tag">שחקן אמיתי • מחובר</span>';
    const body = U.el(`<div class="profile"><canvas width="200" height="230"></canvas><div class="pinfo"><h3>${U.esc(c.name)}</h3>${tag}<p>⭐ רמה ${c.lvl || 1}</p>
      <div class="pbtns"><button class="btn ${isFriend ? 'ghost' : 'primary'}" data-a="friend">${isFriend ? '✔ חברים' : '➕ הוספת חבר'}</button><button class="btn" data-a="msg">💬 הודעה</button><button class="btn" data-a="house">🏠 ביקור בבית</button><button class="btn" data-a="wave">👋 נפנוף</button></div></div></div>`);
    const m = UI.modal({ title: 'פרופיל', icon: '👤', color: '#3cc98a', body, cls: 'narrow' });
    const pv = UI.livePreview($('canvas', body), () => c.look);
    U.$$('[data-a]', body).forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'friend' && !isFriend) { UI.addFriend(c.name); b.disabled = true; b.textContent = 'נשלח...'; }
      if (a === 'msg') { m.close(); UI.openFriends('msgs', c.name); }
      if (a === 'house') { m.close(); G.House.visit(c.name); }
      if (a === 'wave') { m.close(); G.World.emote('wave'); G.World.player.dir = c.x < G.World.player.x ? 'left' : 'right'; if (c.kind === 'bot') setTimeout(() => { G.World.emote('wave', c); c.dir = c.x < G.World.player.x ? 'right' : 'left'; G.World.say(c, `היי ${P.name}! 👋`); }, 700); }
    });
  };

  // ---------- הגדרות ----------
  UI.openSettings = function () {
    const P = G.P;
    const body = U.el(`<div class="settings">
      <label class="tgl"><input type="checkbox" data-s="music" ${P.settings.music ? 'checked' : ''}><span></span>🎵 מוזיקת רקע</label>
      <label class="tgl"><input type="checkbox" data-s="sfx" ${P.settings.sfx ? 'checked' : ''}><span></span>🔊 אפקטים קוליים</label>
      <div class="status-box"><div>${G.Net.on ? '🟢 מחוברים למצב מרובה משתתפים – רואים שחקנים אמיתיים שפתחו את העולם עכשיו.' : '⚪ מצב יחיד: השחקנים בעולם הם בוטים מדומים (מסומנים "בוט"). המערכת מוכנה לשחקנים אמיתיים כשיש חיבור.'}</div>
      <div>${G.Store.cloudReady ? '☁️ ההתקדמות נשמרת גם בענן.' : '💾 ההתקדמות נשמרת בדפדפן הזה.'}</div></div>
      <div class="keys"><b>מקשים:</b> חיצים / WASD – הליכה • E – פעולה • Enter – צ׳אט • 1-8 – רגשות • M – מפה • I – תיק • Q – משימות • F – חברים • Esc – סגירה</div>
      <div class="row"><button class="btn danger logout">🚪 התנתקות</button></div></div>`);
    UI.modal({ title: 'הגדרות', icon: '⚙️', color: '#5b6b8a', body, cls: 'narrow' });
    U.$$('[data-s]', body).forEach(i => i.onchange = () => { P.settings[i.dataset.s] = i.checked; G.Audio.init(); if (i.dataset.s === 'music') G.Audio.setMusic(i.checked); else G.Audio.setSfx(i.checked); G.Store.save(P); });
    $('.logout', body).onclick = () => { G.Store.save(P); location.reload(); };
  };

  return UI;
})();
