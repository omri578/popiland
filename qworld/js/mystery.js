// ===== קיו וורלד – חידת איקיו החודשית והמקום הסודי =====
G.Speak = {
  tts: null, ready: false,
  async init() { try { if (!window.claude || !window.claude.use) return; this.tts = await Promise.race([window.claude.use('tts'), new Promise(r => setTimeout(() => r(null), 10000))]); } catch (e) { this.tts = null; } },
  available() { return !!this.tts || ('speechSynthesis' in window); },
  async say(lines, onLine) {
    this.stop();
    if (this.tts) {
      try { if (onLine) this._off = this.tts.onLine && this.tts.onLine(({ line }) => onLine(line)); await this.tts.speak(lines.map(t => ({ text: t, language: 'he', voice: 'airy' }))); return true; } catch (e) { /* נמשיך לגיבוי */ }
    }
    if ('speechSynthesis' in window) {
      const vs = speechSynthesis.getVoices(); const v = vs.find(x => /^he|iw/i.test(x.lang));
      lines.forEach((t, i) => { const u = new SpeechSynthesisUtterance(t); u.lang = 'he-IL'; if (v) u.voice = v; u.rate = 0.95; u.onstart = () => onLine && onLine(i); speechSynthesis.speak(u); });
      return true;
    }
    return false;
  },
  stop() { try { if (this.tts) this.tts.stop(); } catch (e) { } try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } },
};

G.Mystery = (() => {
  const U = G.U, S = G.Scn, $ = U.$;
  const M = {};
  const PRIZE = 1500;

  M.CASES = [{
    id: 'party', title: 'המסיבה שנעלמה', narrator: 'נויה',
    narratorLook: { skin: '#f7cfa6', hairStyle: 'pigtails', hairColor: '#9a5530', eyes: 'big', eyeColor: '#2e9e5b', shirt: 'dress_lilac', pants: 'pants_black', shoes: 'boots_pink', hat: 'party_hat', glasses: null, bag: 'satchel', acc: 'necklace' },
    story: [
      'היי! אני נויה, ואני כל כך שמחה שבאתם.',
      'הכנתי כאן, במקום הסודי, מסיבת יום הולדת מפתיעה לחבר הכי טוב שלי. הכול היה מוכן: בלונים צבעוניים, עוגת שוקולד ענקית, ערימת מתנות ורמקול למוזיקה.',
      'יצאתי רק לרגע לקטוף פרחים לשולחן... וכשחזרתי – הכול נעלם! נשאר רק פתק קטן ומוזר שכתוב עליו: "משימה בוצעה – 17:00".',
      'אני צריכה בלשים אמיתיים! חקרו את האי, דברו עם האנשים, השלימו משימות וקבלו רמזים.',
      'גלו מי לקח את ציוד המסיבה, לאן הוא נלקח, ולמה. הבלש הראשון שיפתור נכון יקבל אלף וחמש מאות מטבעות!',
    ],
    who: [['עמית הקוסם', '🎩', 'אוהב להעלים דברים בהופעות'], ['רקסי הכלבה', '🐕', 'אוהבת לחפור ולהחביא דברים'], ['דודה פרלה', '👵', 'טוענת שהעוגות שלה הכי טעימות'], ['ביפ הרובוט', '🤖', 'רובוט ניקיון חרוץ במיוחד']],
    where: [['מגדל המציל בחוף', '🛟'], ['מתחת לעץ בפארק', '🌳'], ['הבית של דודה פרלה', '🏠'], ['המחסן במשחקייה', '🕹️']],
    why: [['רצה לעשות מתיחה', '😜'], ['רצה את העוגה לעצמו', '🍰'], ['תוכנת לנקות את המקום בשעה 17:00', '🧹'], ['רצה להכין מופע הפתעה', '✨']],
    answer: [3, 3, 2],
    clues: [
      { id: 'c1', zone: 'cafe', giver: 'בריסטה ביבי', hint: 'בית הקפה – הבריסטה ראתה משהו', mission: 'math', text: 'בדיוק בחמש שמעתי "ביפ-ביפ!", ואז משהו עבר פה מהר עם עגלה מלאה בלונים ועוגה. אחריו רצה כלבה ונבחה כל הדרך!' },
      { id: 'c2', zone: 'beach', giver: 'החוף', hint: 'החוף – חפשו 3 חפצים נוצצים בחול', mission: 'find', text: 'מצאתם כרזה: "מופע הקסמים של עמית – על הבמה בחוף, בין 16:00 ל-18:00". כל הקהל ראה את עמית על הבמה כל הזמן הזה.' },
      { id: 'c3', zone: 'park', giver: 'ד״ר עלה', hint: 'הפארק – המדענית ד״ר עלה', mission: 'sci', text: 'רקסי חפרה פה בפארק כל אחר הצהריים ומצאה רק עצם ישנה. אבל תראו: שובל של טיפות שמן מכונה מוביל מכאן לכיוון המשחקייה! שמן לא מתערבב עם מים, ולכן רואים אותו יפה בשלוליות.' },
      { id: 'c4', zone: 'residential', giver: 'שכנה רותי', hint: 'שכונת המגורים – השכנה רותי', mission: 'riddle', text: 'דודה פרלה? היא אפתה איתי עוגיות במטבח שלי מהצהריים ועד הערב. היא לא יצאה מהבית אפילו לרגע!' },
      { id: 'c5', zone: 'arcade', giver: 'ג׳וני השרת', hint: 'המשחקייה – השרת ג׳וני', mission: 'game', text: 'ביפ הרובוט? הוא מתוכנת לנקות את המקום הסודי כל יום בשעה 17:00 בדיוק. כל מה שהוא מוצא שם הוא מכניס למחסן שמאחורי מכונות המשחק... אוי, נראה שאף אחד לא עדכן אותו שיש מסיבה!' },
    ],
    solvedText: 'יש! פתרתם את החידה! ביפ הרובוט פשוט עשה את העבודה שלו – הוא תוכנת לנקות בשעה 17:00 והכניס את כל הציוד למחסן במשחקייה. החזרנו הכול, והמסיבה מתחילה! תודה, בלשים!',
  }];
  M.RIDDLES = [['מה המספר הבא בסדרה: 2, 4, 8, 16, ...?', ['32', '20', '24', '18']], ['אם אתמול היה יום שני, איזה יום יהיה מחר?', ['רביעי', 'שלישי', 'חמישי', 'ראשון']], ['לאבא של נועה יש 3 בנות: מאיה, שירה ו...?', ['נועה', 'תמר', 'אין לו עוד בת', 'יעל']]];

  const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  M.key = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1); };
  M.monthName = () => MONTHS[new Date().getMonth()];
  M.case = () => { const d = new Date(); return M.CASES[(d.getFullYear() * 12 + d.getMonth()) % M.CASES.length]; };
  M.eligible = () => G.P && (G.P.grade || 1) >= 4;
  M.st = () => {
    const P = G.P; const k = M.key();
    if (!P.mystery || P.mystery.key !== k) P.mystery = { key: k, clues: {}, items: {}, played: false, solved: false, wrongUntil: 0, heard: false };
    return P.mystery;
  };
  M.active = () => M.eligible() && !M.st().solved;
  M.clueCount = () => Object.keys(M.st().clues).length;
  M.giveClue = (c) => {
    const st = M.st(); if (st.clues[c.id]) return;
    st.clues[c.id] = 1; G.Store.save(G.P); G.Audio.sfx('levelup');
    G.UI.dialog({ title: '🔍 רמז חדש!', color: '#7c5cff', text: `<b>${U.esc(c.giver)}:</b> ${U.esc(c.text)}`, html: `<p class="small">יש לכם ${M.clueCount()} מתוך ${M.case().clues.length} רמזים. את כל הרמזים אפשר לראות בלוח החקירה במקום הסודי.</p>`, buttons: [{ text: 'רשמתי! 📝' }, { text: '🔮 למקום הסודי', fn: () => G.World.go('secret') }] });
    G.Econ.addXP(25);
  };

  // ---------- ציור ----------
  S.eduStand = (ctx, o, t) => {
    const c = o.c;
    U.shadow(ctx, o.x, o.y, 110, 14);
    U.fillRR(ctx, o.x - 100, o.y - 190, 200, 130, 10, '#2f4a3a', '#a8703d', 6);
    o.lines.forEach((l, i) => S.txt(ctx, l, o.x, o.y - 168 + i * 26, i ? 17 : 15, i ? '#ffffff' : '#ffde59', i ? 600 : 700));
    U.fillRR(ctx, o.x - 110, o.y - 52, 220, 52, 8, '#ffffff', c, 3); U.fillRR(ctx, o.x - 116, o.y - 58, 232, 12, 5, c);
    S.txt(ctx, o.title, o.x, o.y - 24, 16, U.shade(c, -0.35), 700);
    U.fillRR(ctx, o.x - 106, o.y - 210, 70, 26, 13, c); S.txt(ctx, o.badge, o.x - 71, o.y - 197, 13, '#fff', 700);
  };
  S.secretDoor = (ctx, o, t) => {
    ctx.save(); ctx.shadowColor = '#c39bff'; ctx.shadowBlur = 20 + Math.sin(t * 3) * 8;
    U.fillRR(ctx, o.x - 34, o.y - 100, 68, 100, 34, '#2a1850', '#c39bff', 4); ctx.restore();
    const g = ctx.createRadialGradient(o.x, o.y - 50, 4, o.x, o.y - 50, 40); g.addColorStop(0, 'rgba(255,158,240,0.9)'); g.addColorStop(1, 'rgba(124,92,255,0.2)'); U.fillRR(ctx, o.x - 26, o.y - 92, 52, 90, 26, g);
    S.txt(ctx, '?', o.x, o.y - 50, 36, '#ffffff', 700);
    for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.6; U.star(ctx, o.x + Math.cos(a) * 44, o.y - 50 + Math.sin(a) * 50, 4, 1.5, 4, '#fff'); }
  };
  S.clueItem = (ctx, o, t) => {
    if (o.gone) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(o.x, o.y - 14, 2, o.x, o.y - 14, 40); g.addColorStop(0, 'rgba(255,230,120,' + (0.5 + Math.sin(t * 5) * 0.2) + ')'); g.addColorStop(1, 'rgba(255,230,120,0)'); U.circ(ctx, o.x, o.y - 14, 40, g); ctx.restore();
    S.txt(ctx, o.emoji, o.x, o.y - 16 + Math.sin(t * 3) * 3, 28, '#000');
    U.star(ctx, o.x + 16, o.y - 34, 5 + Math.sin(t * 6) * 2, 2, 4, '#fff');
  };
  S.mushroom = (ctx, o, t) => { const g = 0.6 + Math.sin(t * 2 + o.x) * 0.3; ctx.save(); ctx.globalCompositeOperation = 'lighter'; U.circ(ctx, o.x, o.y - 24, 40, U.rgba(o.c, 0.18 * g)); ctx.restore(); U.fillRR(ctx, o.x - 6, o.y - 26, 12, 26, 5, '#f2eff9'); ctx.beginPath(); ctx.arc(o.x, o.y - 24, 22, Math.PI, 0); ctx.closePath(); ctx.fillStyle = o.c; ctx.fill(); [-10, 2, 12].forEach((d, i) => U.circ(ctx, o.x + d, o.y - 34 + (i % 2) * 6, 3, 'rgba(255,255,255,0.85)')); };
  S.board = (ctx, o, t) => {
    U.shadow(ctx, o.x, o.y, 100, 12);
    ctx.fillStyle = '#7a4a2c'; ctx.fillRect(o.x - 80, o.y - 40, 8, 40); ctx.fillRect(o.x + 72, o.y - 40, 8, 40);
    U.fillRR(ctx, o.x - 100, o.y - 190, 200, 150, 8, '#c99460', '#7a4a2c', 6);
    const st = G.P ? M.st() : { clues: {} };
    M.case().clues.forEach((c, i) => { const x = o.x - 70 + (i % 3) * 70, y = o.y - 160 + Math.floor(i / 3) * 64; U.fillRR(ctx, x - 26, y, 52, 46, 3, st.clues[c.id] ? '#fff6c2' : 'rgba(255,255,255,0.35)'); U.circ(ctx, x, y + 2, 4, '#e63946'); S.txt(ctx, st.clues[c.id] ? '📝' : '?', x, y + 26, 18, '#3a2d55', 700); });
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x - 70, o.y - 156); ctx.lineTo(o.x, o.y - 156); ctx.lineTo(o.x + 70, o.y - 92); ctx.stroke();
    U.fillRR(ctx, o.x - 90, o.y - 222, 180, 30, 12, '#2a1850', '#c39bff', 2); S.txt(ctx, '🔍 לוח החקירה', o.x, o.y - 207, 15, '#fff', 700);
  };
  S.partyTable = (ctx, o, t) => {
    const solved = G.P && M.st().solved;
    U.shadow(ctx, o.x, o.y, 120, 14);
    U.fillRR(ctx, o.x - 110, o.y - 50, 220, 44, 6, '#ffffff'); ctx.fillStyle = '#ff9ec7'; for (let i = 0; i < 11; i++) { ctx.beginPath(); ctx.arc(o.x - 100 + i * 20, o.y - 6, 10, 0, Math.PI); ctx.fill(); }
    ctx.fillStyle = '#c0a080'; ctx.fillRect(o.x - 100, o.y - 6, 6, 6); ctx.fillRect(o.x + 94, o.y - 6, 6, 6);
    if (solved) {
      U.fillRR(ctx, o.x - 40, o.y - 104, 80, 54, 8, '#7a4a2c'); U.fillRR(ctx, o.x - 44, o.y - 110, 88, 14, 7, '#ffe0f0'); for (let i = 0; i < 5; i++) { ctx.fillStyle = ['#ff7eb6', '#7fd3ff', '#ffde59', '#5fe0b7', '#c39bff'][i]; ctx.fillRect(o.x - 30 + i * 15, o.y - 134, 5, 24); const f = Math.sin(t * 9 + i) * 2; U.ell(ctx, o.x - 27.5 + i * 15, o.y - 140 + f * 0.3, 4, 7, '#ffb300'); }
      [[-80, '#3a7bff'], [70, '#ff5d6c']].forEach(([dx, c]) => { U.fillRR(ctx, o.x + dx - 18, o.y - 84, 36, 34, 4, c); ctx.fillStyle = '#ffde59'; ctx.fillRect(o.x + dx - 3, o.y - 84, 6, 34); ctx.fillRect(o.x + dx - 18, o.y - 70, 36, 6); });
    } else { S.txt(ctx, '📝', o.x + 20, o.y - 62, 22, '#000'); U.fillRR(ctx, o.x - 50, o.y - 64, 30, 14, 3, 'rgba(0,0,0,0.12)'); }
  };
  S.banner = (ctx, o, t) => {
    const solved = G.P && M.st().solved;
    ctx.fillStyle = '#7a4a2c'; ctx.fillRect(o.x - 200, o.y - 200, 8, 200); ctx.fillRect(o.x + 192, o.y - 200, 8, 200);
    if (solved) {
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x - 196, o.y - 196); ctx.quadraticCurveTo(o.x, o.y - 150, o.x + 196, o.y - 196); ctx.stroke();
      const txt = 'יום הולדת שמח!'; for (let i = 0; i < 9; i++) { const x = o.x - 170 + i * 42, y = o.y - 190 + Math.sin((i / 8) * Math.PI) * 38; ctx.fillStyle = ['#ff7eb6', '#ffde59', '#7fd3ff', '#5fe0b7', '#c39bff'][i % 5]; ctx.beginPath(); ctx.moveTo(x - 16, y); ctx.lineTo(x + 16, y); ctx.lineTo(x, y + 30); ctx.fill(); }
      S.txt(ctx, '🎉 ' + txt + ' 🎉', o.x, o.y - 110, 24, '#ffffff', 700, '#7c5cff');
    } else {
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x - 196, o.y - 196); ctx.lineTo(o.x - 40, o.y - 120); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(o.x + 196, o.y - 196); ctx.lineTo(o.x + 160, o.y - 30); ctx.stroke();
      S.txt(ctx, '❓', o.x, o.y - 120, 40, '#000');
    }
  };
  S.balloonsP = (ctx, o, t) => { if (G.P && M.st().solved) S.balloons(ctx, o, t); };

  G.Zones.secret = {
    name: 'המקום הסודי', icon: '🔮', w: 1800, h: 1200, mood: 'home', minY: 430, bots: 0, night: true,
    ground(ctx) {
      ctx.fillStyle = U.vgrad(ctx, 0, this.h, '#1a0f3a', '#2f1d5c'); ctx.fillRect(0, 0, this.w, this.h);
      const r = U.rng(66); for (let i = 0; i < 120; i++) U.circ(ctx, r() * this.w, r() * 380, r() * 1.6 + 0.3, 'rgba(255,255,255,' + (0.3 + r() * 0.6) + ')');
      ctx.fillStyle = U.vgrad(ctx, 400, this.h, '#2a5a4a', '#1d3f38'); ctx.beginPath(); ctx.moveTo(0, 420); for (let x = 0; x <= this.w; x += 60) ctx.lineTo(x, 410 + Math.sin(x * 0.01) * 16); ctx.lineTo(this.w, this.h); ctx.lineTo(0, this.h); ctx.fill();
      for (let i = 0; i < 400; i++) { const x = r() * this.w, y = 430 + r() * 760; ctx.fillStyle = 'rgba(120,220,170,0.12)'; ctx.fillRect(x, y, 2, 6); }
      U.ell(ctx, 900, 760, 420, 170, 'rgba(195,155,255,0.12)'); U.ell(ctx, 900, 760, 420, 170, null, 'rgba(195,155,255,0.35)', 3);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; U.ell(ctx, 900 + Math.cos(a) * 420, 760 + Math.sin(a) * 170, 18, 10, '#6b6d85'); }
    },
    dyn(ctx, t) { for (let i = 0; i < 30; i++) { const x = (i * 211 + Math.sin(t * 0.5 + i) * 60) % this.w, y = 450 + (i * 97) % 700 + Math.sin(t + i) * 20; const g = 0.4 + Math.sin(t * 3 + i) * 0.4; U.circ(ctx, x, y, 3, `rgba(255,240,140,${g})`); } },
    objects: [
      { t: 'banner', x: 900, y: 560, sortY: 380 },
      { t: 'partyTable', x: 900, y: 700 },
      { t: 'board', x: 1350, y: 640, act: 'board', label: 'לוח החקירה' },
      { t: 'balloonsP', x: 620, y: 700 }, { t: 'balloonsP', x: 1180, y: 700 },
      { t: 'tree', x: 120, y: 520, c: '#5b3fd1', keep: 1 }, { t: 'tree', x: 1680, y: 520, c: '#7c5cff', keep: 1 }, { t: 'tree', x: 250, y: 1050, c: '#4a2fa8', keep: 1 }, { t: 'tree', x: 1560, y: 1060, c: '#5b3fd1', keep: 1 },
      { t: 'mushroom', x: 420, y: 640, c: '#ff9ef0' }, { t: 'mushroom', x: 1400, y: 900, c: '#7fe8ff' }, { t: 'mushroom', x: 600, y: 980, c: '#ffde59' }, { t: 'mushroom', x: 1200, y: 1000, c: '#ff9ef0' }, { t: 'mushroom', x: 300, y: 820, c: '#7fe8ff' }, { t: 'mushroom', x: 1650, y: 760, c: '#ffde59' },
      { t: 'gate', x: 900, y: 1160, w: 110, text: '🏙️ לכיכר', c: '#c39bff' },
    ],
    portals: [{ r: [830, 1170, 970, 1200], to: 'plaza' }], arrivals: { plaza: [900, 990] }, spawn: [900, 990],
  };
  G.Zones.secret.staff = [{ name: 'נויה', x: 760, y: 820, act: 'mystery', label: 'לדבר עם נויה', look: M.CASES[0].narratorLook }];

  // ---------- אובייקטים נוספים לפי אזור ----------
  M.extraObjects = function (zoneId) {
    const out = [];
    if (!M.active()) return out;
    const st = M.st();
    if (zoneId === 'beach' && !st.clues.c2) [[520, 420, '🃏'], [1720, 780, '📜'], [2220, 300, '🎀']].forEach(([x, y, e], i) => { if (!st.items['b' + i]) out.push({ t: 'clueItem', x, y, emoji: e, act: 'clueItem', label: 'לבדוק חפץ נוצץ', idx: i }); });
    if (zoneId === 'park') out.push({ t: 'secretDoor', x: 110, y: 720, act: 'secretDoor', label: 'דלת מסתורית…' });
    return out;
  };

  // ---------- יירוט פעולות של נותני רמזים ----------
  const GIVER_ACT = { coffee: 'c1', science: 'c3', neighbor: 'c4', janitor: 'c5' };
  M.intercept = function (act, tgt) {
    if (act === 'mystery') { M.talkNoya(); return true; }
    if (act === 'board') { M.openBoard(); return true; }
    if (act === 'secretDoor') { G.World.go('secret'); return true; }
    if (act === 'clueItem') { M.foundItem(tgt); return true; }
    const cid = GIVER_ACT[act];
    if (!cid || !M.active() || M.st().clues[cid]) return false;
    const c = M.case().clues.find(x => x.id === cid);
    const def = { coffee: () => G.UI.cafeMenu(), science: () => G.Edu.quiz('sci', 6), neighbor: () => M.neighborTalk(), janitor: () => M.janitorTalk() }[act];
    G.UI.dialog({ title: '🔍 ' + c.giver, avatar: tgt && tgt.look ? tgt : null, color: '#7c5cff', text: 'שמעתי שאתם בלשים שחוקרים את המסיבה שנעלמה... אולי אני יודע/ת משהו!', buttons: [{ text: '🔍 יש לך רמז בשבילנו?', fn: () => M.mission(c, tgt) }, { text: act === 'coffee' ? '☕ להזמין משקה' : act === 'science' ? '🔬 מעבדת המדע' : 'סתם לדבר', fn: def }] });
    return true;
  };
  M.mission = function (c, tgt) {
    const st = M.st();
    if (c.mission === 'math') G.UI.dialog({ title: '☕ ' + c.giver, avatar: tgt, text: 'אני אספר לכם מה ראיתי... אבל קודם תעזרו לי עם החשבון של הקופה! פתרו 3 תרגילים (לפחות 2 נכון).', buttons: [{ text: '🧮 בואו נפתור!', fn: () => G.Edu.quiz('math', 3, { title: 'עזרה בקופה של בית הקפה', need: 2, coinsPer: 4, noBonus: true, onDone: (ok, n, pass) => { if (pass) setTimeout(() => M.giveClue(c), 400); } }) }] });
    else if (c.mission === 'sci') G.UI.dialog({ title: '🔬 ' + c.giver, avatar: tgt, color: '#2fbf71', text: 'בלשים טובים הם גם מדענים טובים! ענו נכון על לפחות 2 מתוך 3 שאלות מדע ואראה לכם מה מצאתי.', buttons: [{ text: '🔬 אני מוכן/ה!', fn: () => G.Edu.quiz('sci', 3, { title: 'מבחן הבלשים של ד״ר עלה', need: 2, coinsPer: 4, noBonus: true, onDone: (ok, n, pass) => { if (pass) setTimeout(() => M.giveClue(c), 400); } }) }] });
    else if (c.mission === 'riddle') M.riddle(c, tgt);
    else if (c.mission === 'game') {
      if (st.played) M.giveClue(c);
      else G.UI.dialog({ title: '🧹 ' + c.giver, avatar: tgt, text: 'רמז? אני עסוק מאוד! שחקו משחק אחד באחת המכונות כאן, ואז חזרו אליי ואספר לכם משהו מעניין.', buttons: [{ text: 'בסדר! 🕹️' }] });
    }
    else if (c.mission === 'find') G.UI.toast('🔎 חפשו 3 חפצים נוצצים בחוף!');
  };
  M.riddle = function (c, tgt) {
    const [q, ans] = U.pick(M.RIDDLES); const opts = U.shuffle(ans);
    const html = `<div class="menu-grid">${opts.map((o, i) => `<button class="menu-item" data-i="${i}"><b>${U.esc(o)}</b></button>`).join('')}</div>`;
    const m = G.UI.dialog({ title: '🏡 ' + c.giver, avatar: tgt, color: '#ff8a3d', text: `אני אוהבת חידות! פתרו את החידה שלי ואספר לכם מה אני יודעת:<br><b>${U.esc(q)}</b>`, html, buttons: [{ text: 'אחר כך' }] });
    U.$$('.menu-item', m).forEach(b => b.onclick = () => { if (opts[+b.dataset.i] === ans[0]) { G.Audio.sfx('good'); m.close(); setTimeout(() => M.giveClue(c), 300); } else { G.Audio.sfx('bad'); b.classList.add('wrong'); b.disabled = true; G.UI.toast('לא בדיוק... נסו שוב! 🤔'); } });
  };
  M.foundItem = function (o) {
    const st = M.st(); if (o.gone) return;
    o.gone = true; st.items['b' + o.idx] = 1; G.World.burst(o.x, o.y - 14, '#ffde59', 18); G.Audio.sfx('coins');
    const n = Object.keys(st.items).length;
    G.UI.toast(`🔎 מצאתם חפץ נוצץ! (${n}/3)`, 'ok'); G.Store.save(G.P);
    if (n >= 3) setTimeout(() => M.giveClue(M.case().clues.find(c => c.id === 'c2')), 500);
  };
  M.neighborTalk = () => G.UI.dialog({ title: '🏡 שכנה רותי', avatar: G.World.staff.find(s => s.act === 'neighbor'), text: U.pick(['שלום חמודים! השכונה שלנו הכי שקטה באי 🌸', 'אני אופה עוגיות כמעט כל יום. ריח טוב, נכון? 🍪', 'ראיתם את הבית החדש בסוף הרחוב? מהמם!']), buttons: [{ text: 'להתראות! 👋' }] });
  M.janitorTalk = () => G.UI.dialog({ title: '🧹 ג׳וני השרת', avatar: G.World.staff.find(s => s.act === 'janitor'), text: U.pick(['שומר על המשחקייה נקייה ומבריקה! ✨', 'טיפ: בגשם פירות – כוכבי הזהב שווים 5 נקודות!', 'בפופ מהיר – אם לא מפספסים, הקומבו מכפיל את הנקודות 🔥']), buttons: [{ text: 'תודה ג׳וני!' }] });

  // ---------- נויה והסיפור ----------
  M.talkNoya = function () {
    const P = G.P, C = M.case();
    if (!M.eligible()) { G.UI.dialog({ title: '🔮 נויה', avatar: G.World.staff[0], text: 'היי! המקום הסודי פתוח לבלשים מכיתה ד׳ ומעלה. כשתגדלו – תחכה לכם כאן חידה מסקרנת! 🕵️', buttons: [{ text: 'אוקיי!' }] }); return; }
    const st = M.st();
    if (st.solved) { G.UI.dialog({ title: '🎉 נויה', avatar: G.World.staff[0], color: '#ff7eb6', text: 'תודה שהצלתם את המסיבה! תחזרו בחודש הבא – תחכה לכם חידה חדשה 💜', buttons: [{ text: 'בכיף! 🥳', fn: () => G.World.emote('dance') }] }); return; }
    const body = U.el(`<div class="story"><img class="npc-face" src="${G.Avatar.portrait(C.narratorLook, 110)}"><div class="story-text">${C.story.map((l, i) => `<p data-i="${i}">${U.esc(l)}</p>`).join('')}</div></div>`);
    const tools = U.el(`<div class="row"><button class="btn secondary listen">🔊 הקשיבו לנויה</button><button class="btn primary go">🔍 לוח החקירה</button></div>`);
    body.appendChild(tools);
    const m = G.UI.modal({ title: `חידת איקיו של ${M.monthName()}: ${C.title}`, icon: '🕵️', color: '#7c5cff', body, cls: 'mid', onClose: () => G.Speak.stop() });
    const ps = U.$$('.story-text p', body);
    const hl = i => ps.forEach((p, j) => p.classList.toggle('on', j === i));
    $('.listen', body).onclick = async () => { G.Audio.init(); const ok = await G.Speak.say(C.story, hl); if (!ok) G.UI.toast('ההקראה לא זמינה בדפדפן הזה – אפשר לקרוא את הסיפור 📖'); };
    if (!G.Speak.available()) $('.listen', body).style.display = 'none';
    $('.go', body).onclick = () => { m.close(); M.openBoard(); };
    st.heard = true; G.Store.save(P);
  };

  // ---------- לוח החקירה ----------
  M.openBoard = function () {
    if (!M.eligible()) { G.UI.toast('🔒 לוח החקירה פתוח מכיתה ד׳ ומעלה'); return; }
    const C = M.case(), st = M.st();
    const n = M.clueCount();
    const body = U.el(`<div class="inv-board">
      <div class="ib-head"><div><b>${C.title}</b><span>הפרס לבלש הראשון שפותר: 🪙 ${U.fmt(PRIZE)}</span></div><div class="ib-count">${n}/${C.clues.length} רמזים</div></div>
      <div class="ib-clues">${C.clues.map(c => `<div class="clue ${st.clues[c.id] ? 'got' : ''}"><span>${st.clues[c.id] ? '📝' : '❔'}</span><div>${st.clues[c.id] ? `<b>${U.esc(c.giver)}:</b> ${U.esc(c.text)}` : `<b>רמז נעול</b> – ${U.esc(c.hint)}`}</div></div>`).join('')}</div>
      <h4>החשודים</h4><div class="ib-sus">${C.who.map(w => `<div><span>${w[1]}</span><b>${w[0]}</b><small>${w[2]}</small></div>`).join('')}</div>
      <div class="ib-winners"></div>
      <div class="row">${st.solved ? '<span class="ok-chip">✔ פתרתם את החידה!</span>' : `<button class="btn primary big solve" ${n < 3 ? 'disabled' : ''}>🕵️ אני יודע/ת את הפתרון!</button>`}</div>
      ${!st.solved && n < 3 ? '<p class="hint center">אספו לפחות 3 רמזים כדי לנסות לפתור.</p>' : ''}</div>`);
    const m = G.UI.modal({ title: 'לוח החקירה', icon: '🔍', color: '#7c5cff', body, cls: 'mid' });
    const sb = $('.solve', body); if (sb) sb.onclick = () => { m.close(); M.openSolve(); };
    M.winners().then(w => { const el = $('.ib-winners', body); if (!el || !w) return; el.innerHTML = w.winner ? `<div class="winner">🏆 הבלש הראשון שפתר החודש: <b>${U.esc(w.winner)}</b>${w.solvers && w.solvers.length > 1 ? ` • פתרו עד עכשיו: ${w.solvers.length}` : ''}</div>` : '<div class="winner open">🏆 אף אחד עוד לא פתר את החידה החודש – אולי זה יהיה אתם?</div>'; });
  };
  M.openSolve = function () {
    const C = M.case(), st = M.st();
    if (st.wrongUntil > Date.now()) { G.UI.toast(`⏳ חכו עוד ${Math.ceil((st.wrongUntil - Date.now()) / 1000)} שניות לפני ניסיון נוסף – בינתיים חפשו עוד רמזים!`, 'err'); return; }
    const pick = [-1, -1, -1];
    const grp = (k, title, arr) => `<h4>${title}</h4><div class="solve-grp" data-k="${k}">${arr.map((x, i) => `<button data-i="${i}"><span>${x[1]}</span>${x[0]}</button>`).join('')}</div>`;
    const body = U.el(`<div class="solve">${grp(0, '1. מי לקח את ציוד המסיבה?', C.who)}${grp(1, '2. לאן הוא נלקח?', C.where)}${grp(2, '3. למה?', C.why)}<div class="row"><button class="btn primary big send" disabled>📨 שליחת הפתרון</button></div></div>`);
    const m = G.UI.modal({ title: 'פתרון החידה', icon: '🕵️', color: '#7c5cff', body, cls: 'mid' });
    U.$$('.solve-grp', body).forEach(g => U.$$('button', g).forEach(b => b.onclick = () => { pick[+g.dataset.k] = +b.dataset.i; U.$$('button', g).forEach(x => x.classList.toggle('on', x === b)); G.Audio.sfx('click'); $('.send', body).disabled = pick.includes(-1); }));
    $('.send', body).onclick = async () => {
      const ok = pick.every((v, i) => v === C.answer[i]);
      m.close();
      if (!ok) {
        const right = pick.filter((v, i) => v === C.answer[i]).length;
        st.wrongUntil = Date.now() + 60000; G.Store.save(G.P); G.Audio.sfx('bad');
        G.UI.dialog({ title: '🤔 עוד לא...', avatar: { look: C.narratorLook }, text: `${right} מתוך 3 חלקים נכונים. אל תוותרו! חפשו עוד רמזים ונסו שוב בעוד דקה.`, buttons: [{ text: 'נמשיך לחקור 🔍' }] });
        return;
      }
      st.solved = true; G.Store.save(G.P);
      const first = await M.claim();
      G.Audio.sfx('levelup'); G.UI.confetti(4);
      const prize = first ? PRIZE : 300;
      G.P.stats.mysteries = (G.P.stats.mysteries || 0) + 1;
      G.UI.dialog({ title: first ? '🏆 אתם הבלשים הראשונים!' : '🎉 פתרתם את החידה!', avatar: { look: C.narratorLook }, color: '#ffb300', text: C.solvedText, html: `<div class="reward-row"><span class="reward-chip">🪙 +${U.fmt(prize)}</span><span class="reward-chip xp">⭐ +200 XP</span></div>${first ? '' : '<p class="small">מישהו אחר פתר קודם החודש, אבל קיבלתם פרס בלשים! בחודש הבא – תהיו מהירים יותר 😉</p>'}`, buttons: [{ text: 'למסיבה! 🥳', fn: () => { G.World.emote('dance'); } }] });
      G.Econ.addCoins(prize); G.Econ.addXP(200); G.Econ.checkAch();
      if (G.World.zoneId === 'secret') { G.World.burst(900, 600, null, 40); }
    };
  };
  // ---------- הפותר הראשון (משותף לכל השחקנים כשיש חיבור) ----------
  M.docRef = () => { try { return G.Store.db ? G.Store.db.doc('mystery/' + M.key()) : null; } catch (e) { return null; } };
  M.winners = async function () {
    const ref = M.docRef();
    if (ref) { try { const s = await ref.get(); return s.exists ? s.data() : {}; } catch (e) { } }
    try { return JSON.parse(localStorage.getItem('qworld_mystery_' + M.key()) || '{}'); } catch (e) { return {}; }
  };
  M.claim = async function () {
    const name = G.P.name, now = Date.now(), ref = M.docRef();
    if (ref) {
      try {
        for (let tries = 0; tries < 4; tries++) {
          const lease = await ref.acquire({ holder: name + ':' + now, ttlMs: 4000 });
          if (!lease.acquired) { await new Promise(r => setTimeout(r, 1200)); continue; }
          const s = await ref.get(); const d = s.exists ? Object.assign({}, s.data()) : {};
          const solvers = Array.isArray(d.solvers) ? d.solvers.slice(0, 200) : [];
          if (!solvers.some(x => x.n === name)) solvers.push({ n: name, at: now });
          const first = !d.winner;
          await ref.set({ winner: d.winner || name, at: d.at || now, solvers });
          return first;
        }
      } catch (e) { /* נמשיך במצב מקומי */ }
    }
    let d = {}; try { d = JSON.parse(localStorage.getItem('qworld_mystery_' + M.key()) || '{}'); } catch (e) { }
    const first = !d.winner;
    d.winner = d.winner || name; d.solvers = (d.solvers || []).concat([{ n: name, at: now }]);
    try { localStorage.setItem('qworld_mystery_' + M.key(), JSON.stringify(d)); } catch (e) { }
    return first;
  };

  M.announce = function () {
    if (!M.active() || M.st().heard) return;
    G.UI.dialog({ title: '📜 חידת איקיו של ' + M.monthName() + '!', avatar: { look: M.case().narratorLook }, color: '#7c5cff', text: `משהו מסתורי קרה במקום הסודי... ${U.esc(M.case().narrator)} צריכה בלשים! הבלש הראשון שיפתור את החידה יזכה ב-🪙 ${U.fmt(PRIZE)}.`, buttons: [{ text: '🔮 קחו אותי למקום הסודי!', fn: () => G.World.go('secret') }, { text: 'אחר כך' }] });
  };
  G.bus.on('gameEnd', () => { if (M.active()) { const st = M.st(); if (!st.played) { st.played = true; G.Store.save(G.P); } } });
  return M;
})();
