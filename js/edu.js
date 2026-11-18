// ===== קיו וורלד – למידה: חשבון בקניון, מדע בפארק (לפי כיתה) =====
G.Edu = (() => {
  const U = G.U, $ = U.$;
  const E = {};
  const ri = U.randi;
  const L = s => `<bdi dir="ltr" class="eq">${s}</bdi>`;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (n, d) => { const g = gcd(n, d); return (n / g) + '/' + (d / g); };

  // ---------- מחולל תרגילי חשבון ----------
  const names = ['נועה', 'איתי', 'מאיה', 'יובל', 'שירה', 'דניאל', 'תמר', 'עומר'];
  const things = [['תפוחים', '🍎'], ['כדורים', '⚽'], ['מדבקות', '⭐'], ['עפרונות', '✏️'], ['עוגיות', '🍪'], ['בלונים', '🎈']];
  E.makeMath = function (grade) {
    const nm = U.pick(names), th = U.pick(things);
    const T = [];
    if (grade === 1) {
      T.push(() => { const a = ri(1, 10), b = ri(1, 10); return { q: L(`${a} + ${b} = ?`), a: a + b, how: `${a} + ${b} = ${a + b}` }; });
      T.push(() => { const a = ri(5, 20), b = ri(1, a); return { q: L(`${a} − ${b} = ?`), a: a - b, how: `${a} − ${b} = ${a - b}` }; });
      T.push(() => { const a = ri(1, 9), c = ri(a + 1, 15); return { q: L(`${a} + ? = ${c}`), a: c - a, how: `${c} − ${a} = ${c - a}` }; });
      T.push(() => { const a = ri(2, 8), b = ri(1, 6); return { q: `ל${nm} יש ${a} ${th[0]} ${th[1]}. אחר כך נוספו עוד ${b}. כמה ${th[0]} יש עכשיו?`, a: a + b, how: `${a} + ${b} = ${a + b}` }; });
      T.push(() => { const a = ri(3, 19); return { q: `איזה מספר בא אחרי ${L(a)}?`, a: a + 1, how: `${a} + 1 = ${a + 1}` }; });
    } else if (grade === 2) {
      T.push(() => { const a = ri(11, 60), b = ri(10, 39); return { q: L(`${a} + ${b} = ?`), a: a + b, how: `${a} + ${b} = ${a + b}` }; });
      T.push(() => { const a = ri(30, 99), b = ri(10, a - 5); return { q: L(`${a} − ${b} = ?`), a: a - b, how: `${a} − ${b} = ${a - b}` }; });
      T.push(() => { const m = U.pick([2, 5, 10]), b = ri(1, 10); return { q: L(`${m} × ${b} = ?`), a: m * b, how: `${m} × ${b} = ${m * b}` }; });
      T.push(() => { const p = ri(5, 40), q = ri(5, 40); return { q: `ב${'חנות'} מחברת עולה ${p} ₪ ועט עולה ${q} ₪. כמה עולים שניהם יחד?`, a: p + q, how: `${p} + ${q} = ${p + q} ₪` }; });
      T.push(() => { const n = ri(2, 5), b = U.pick([2, 5, 10]); return { q: `בכל קופסה יש ${b} ${th[0]}. כמה ${th[0]} יש ב-${n} קופסאות?`, a: n * b, how: `${n} × ${b} = ${n * b}` }; });
    } else if (grade === 3) {
      T.push(() => { const a = ri(2, 10), b = ri(2, 10); return { q: L(`${a} × ${b} = ?`), a: a * b, how: `${a} × ${b} = ${a * b}` }; });
      T.push(() => { const b = ri(2, 10), c = ri(2, 10); return { q: L(`${b * c} ÷ ${b} = ?`), a: c, how: `${b} × ${c} = ${b * c}, ולכן ${b * c} ÷ ${b} = ${c}` }; });
      T.push(() => { const a = ri(120, 600), b = ri(50, 350); return { q: L(`${a} + ${b} = ?`), a: a + b, how: `${a} + ${b} = ${a + b}` }; });
      T.push(() => { const a = ri(300, 900), b = ri(50, 290); return { q: L(`${a} − ${b} = ?`), a: a - b, how: `${a} − ${b} = ${a - b}` }; });
      T.push(() => { const k = ri(3, 8), each = ri(3, 9); return { q: `${k} חברים חילקו ביניהם ${k * each} ${th[0]} באופן שווה. כמה קיבל כל אחד?`, a: each, how: `${k * each} ÷ ${k} = ${each}` }; });
    } else if (grade === 4) {
      T.push(() => { const a = ri(12, 99), b = ri(3, 9); return { q: L(`${a} × ${b} = ?`), a: a * b, how: `${a} × ${b} = ${a * b}` }; });
      T.push(() => { const b = ri(3, 9), c = ri(12, 40); return { q: L(`${b * c} ÷ ${b} = ?`), a: c, how: `${b} × ${c} = ${b * c}` }; });
      T.push(() => { const d = U.pick([2, 3, 4, 5]), n = d * ri(3, 12); return { q: `כמה זה ${L('1/' + d)} מתוך ${L(n)}?`, a: n / d, how: `${n} ÷ ${d} = ${n / d}` }; });
      T.push(() => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); return { q: L(`${a} + ${b} × ${c} = ?`), a: a + b * c, how: `קודם כפל: ${b} × ${c} = ${b * c}, ואז ${a} + ${b * c} = ${a + b * c}` }; });
      T.push(() => { const w = ri(3, 12), h = ri(3, 12); return { q: `מה ההיקף של מלבן שאורכו ${w} ס״מ ורוחבו ${h} ס״מ?`, a: 2 * (w + h), how: `(${w} + ${h}) × 2 = ${2 * (w + h)} ס״מ` }; });
    } else if (grade === 5) {
      T.push(() => { const a = ri(11, 40), b = ri(11, 30); return { q: L(`${a} × ${b} = ?`), a: a * b, how: `${a} × ${b} = ${a * b}` }; });
      T.push(() => { const d = U.pick([5, 7, 8, 9, 11]), a = ri(1, d - 2), b = ri(1, d - 1 - a); return { q: L(`${a}/${d} + ${b}/${d} = ?`), a: `${a + b}/${d}`, s: 1, how: `המכנה נשאר ${d}: ${a} + ${b} = ${a + b}, ולכן ${a + b}/${d}`, alt: [`${a + b}/${2 * d}`, `${a * b}/${d}`, `${a + b + 1}/${d}`] }; });
      T.push(() => { const a = Math.round((ri(1, 9) + ri(1, 9) / 10) * 10) / 10, b = Math.round((ri(1, 9) + ri(1, 9) / 10) * 10) / 10; const s = Math.round((a + b) * 10) / 10; return { q: L(`${a} + ${b} = ?`), a: s, how: `${a} + ${b} = ${s}` }; });
      T.push(() => { const p = U.pick([10, 50]), n = U.pick([20, 40, 60, 80, 120, 200, 300]); return { q: `כמה זה ${L(p + '%')} מתוך ${L(n)}?`, a: n * p / 100, how: `${p}% = ${p === 10 ? '1/10' : '1/2'}, ולכן ${n * p / 100}` }; });
      T.push(() => { const w = ri(4, 15), h = ri(3, 12); return { q: `מה השטח של מלבן שאורכו ${w} מ׳ ורוחבו ${h} מ׳ (במ״ר)?`, a: w * h, how: `${w} × ${h} = ${w * h} מ״ר` }; });
    } else {
      T.push(() => { const p = U.pick([20, 25, 75, 30]), n = U.pick([40, 80, 120, 200, 400]); return { q: `כמה זה ${L(p + '%')} מתוך ${L(n)}?`, a: n * p / 100, how: `${n} × ${p}/100 = ${n * p / 100}` }; });
      T.push(() => { const a = ri(11, 99) / 10, m = U.pick([10, 100]); const r = Math.round(a * m * 100) / 100; return { q: L(`${a} × ${m} = ?`), a: r, how: `כפל ב-${m} מזיז את הנקודה ${m === 10 ? 'ספרה אחת' : 'שתי ספרות'} ימינה: ${r}` }; });
      T.push(() => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 6); return { q: L(`(${a} + ${b}) × ${c} = ?`), a: (a + b) * c, how: `קודם הסוגריים: ${a + b}, ואז × ${c} = ${(a + b) * c}` }; });
      T.push(() => { const pairs = [[2, 4, 1, 1], [2, 4, 1, 3], [3, 6, 1, 1], [2, 6, 1, 1], [4, 8, 1, 3]]; const [d1, d2, n1, n2] = U.pick(pairs); const num = n1 * (d2 / d1) + n2; const ans = frac(num, d2); return { q: L(`${n1}/${d1} + ${n2}/${d2} = ?`), a: ans, s: 1, how: `${n1}/${d1} = ${n1 * d2 / d1}/${d2}, ולכן ${n1 * d2 / d1}/${d2} + ${n2}/${d2} = ${ans}`, alt: [`${n1 + n2}/${d1 + d2}`, `${n1 + n2}/${d2}`, `${num + 1}/${d2}`] }; });
      T.push(() => { const n = [ri(4, 20), ri(4, 20)]; const third = ri(4, 20); let sum = n[0] + n[1] + third; const fix = (3 - sum % 3) % 3; const c = third + fix; sum += fix; return { q: `מה הממוצע של ${L(n[0] + ', ' + n[1] + ', ' + c)}?`, a: sum / 3, how: `(${n[0]} + ${n[1]} + ${c}) ÷ 3 = ${sum} ÷ 3 = ${sum / 3}` }; });
      T.push(() => { const r = ri(2, 5), k = ri(3, 9); return { q: `בכיתה יש ${L(r)} בנות על כל בן אחד. אם יש ${k} בנים, כמה בנות יש?`, a: r * k, how: `${k} × ${r} = ${r * k}` }; });
    }
    const p = U.pick(T)();
    let opts;
    if (p.s) opts = [p.a].concat(p.alt.filter(x => x !== p.a)).slice(0, 4);
    else {
      const set = new Set([p.a]); const isDec = !Number.isInteger(p.a);
      const cands = isDec ? [p.a + 0.1, p.a - 0.1, p.a + 1, p.a * 10, p.a / 10, p.a + 0.5] : [p.a + 1, p.a - 1, p.a + 2, p.a - 2, p.a + 10, p.a - 10, p.a * 2, Math.round(p.a / 2)];
      U.shuffle(cands).forEach(v => { v = Math.round(v * 100) / 100; if (set.size < 4 && v >= 0 && !set.has(v)) set.add(v); });
      let k = 3; while (set.size < 4) set.add(p.a + k++);
      opts = Array.from(set);
    }
    return { q: p.q, opts: U.shuffle(opts).map(String), a: String(p.a), how: p.how };
  };

  // ---------- מאגר שאלות מדע ----------
  E.SCI = {
    1: [
      ['מה צמח צריך כדי לגדול?', ['מים, אור ואוויר', 'רק סוכר', 'רק חושך', 'רק חול'], 'צמחים מייצרים לעצמם מזון בעזרת אור השמש, מים ואוויר.'],
      ['איזה בעל חיים בוקע מביצה?', ['תרנגולת', 'כלב', 'פרה', 'חתול'], 'ציפורים, זוחלים ורוב הדגים בוקעים מביצים.'],
      ['כמה עונות יש בשנה?', ['4', '2', '3', '6'], 'בשנה יש ארבע עונות: סתיו, חורף, אביב וקיץ.'],
      ['מה קורה למים כשמקפיאים אותם?', ['הם הופכים לקרח', 'הם הופכים לאדים', 'הם נעלמים', 'הם הופכים לחול'], 'כשמים מתקררים מאוד הם הופכים למוצק – קרח.'],
      ['במה אנחנו משתמשים כדי לשמוע?', ['אוזניים', 'עיניים', 'אף', 'ידיים'], 'האוזניים קולטות צלילים ושולחות אותם למוח.'],
      ['מאיפה מגיע האור ביום?', ['מהשמש', 'מהירח', 'מהעננים', 'מהים'], 'השמש היא כוכב ענק שמאיר ומחמם את כדור הארץ.'],
      ['למה הופך הזחל?', ['לפרפר', 'לדבורה', 'לעכביש', 'לציפור'], 'הזחל בונה גולם, ובתוכו הוא משתנה והופך לפרפר.'],
      ['איזה בעל חיים נושם בזימים מתחת למים?', ['דג', 'כלב', 'ציפור', 'ארנב'], 'הזימים עוזרים לדגים לקחת חמצן מהמים.'],
      ['באיזו עונה יורד בישראל הכי הרבה גשם?', ['חורף', 'קיץ', 'אביב', 'סתיו'], 'בישראל רוב הגשם יורד בחורף.'],
      ['איזה חוש עובד בעזרת הלשון?', ['טעם', 'ריח', 'ראייה', 'שמיעה'], 'על הלשון יש בלוטות טעם שמזהות מתוק, מלוח, חמוץ ומר.'],
      ['איזה צבע יש לעלים של רוב הצמחים?', ['ירוק', 'כחול', 'שחור', 'סגול'], 'החומר הירוק בעלים – כלורופיל – עוזר לצמח לקלוט אור.'],
      ['מי מהם הוא יונק?', ['לווייתן', 'כריש', 'תנין', 'צב'], 'לווייתנים נושמים אוויר ומניקים את הגורים שלהם בחלב – הם יונקים!'],
    ],
    3: [
      ['מהם שלושת מצבי הצבירה של החומר?', ['מוצק, נוזל וגז', 'חם, קר ופושר', 'גדול, בינוני וקטן', 'אור, צל וחושך'], 'למשל מים: קרח (מוצק), מים (נוזל) ואדים (גז).'],
      ['איזה כוכב לכת נקרא "הכוכב האדום"?', ['מאדים', 'צדק', 'שבתאי', 'נוגה'], 'האבק על מאדים מכיל ברזל חלוד, ולכן הוא נראה אדום.'],
      ['מה תפקיד הלב?', ['להזרים דם בכל הגוף', 'לעכל מזון', 'לחשוב', 'לשמוע'], 'הלב הוא שריר שפועם ודוחף דם לכל חלקי הגוף.'],
      ['מה מקור האנרגיה העיקרי בשרשרת המזון?', ['השמש', 'הירח', 'הרוח', 'האדמה'], 'צמחים קולטים את אנרגיית השמש, ובעלי החיים אוכלים צמחים או בעלי חיים אחרים.'],
      ['איזה חומר נמשך למגנט?', ['ברזל', 'עץ', 'פלסטיק', 'זכוכית'], 'מגנטים מושכים מתכות כמו ברזל וניקל.'],
      ['כמה זמן לוקח לכדור הארץ להקיף את השמש?', ['שנה', 'יום', 'חודש', 'שבוע'], 'סיבוב אחד סביב השמש לוקח בערך 365 ימים – שנה.'],
      ['מה גורם ליום וללילה?', ['כדור הארץ מסתובב סביב עצמו', 'הירח מסתיר את השמש', 'השמש נכבית', 'העננים מכסים את השמש'], 'הצד של כדור הארץ שפונה לשמש נמצא ביום, והצד השני בלילה.'],
      ['באיזה איבר אנחנו נושמים?', ['ריאות', 'קיבה', 'כבד', 'כליות'], 'הריאות קולטות חמצן מהאוויר ומוציאות פחמן דו-חמצני.'],
      ['מה קורה לרוב החומרים כשמחממים אותם?', ['הם מתפשטים', 'הם תמיד מתכווצים', 'הם נעלמים', 'הם נהיים מגנטיים'], 'החלקיקים זזים מהר יותר ותופסים יותר מקום.'],
      ['מהו מחזור המים?', ['התאדות, התעבות וירידת גשם', 'רק גשם', 'רק ים', 'רק קרח'], 'המים מתאדים, יוצרים עננים, יורדים כגשם וחוזר חלילה.'],
      ['מי מאביק פרחים?', ['דבורה', 'נחש', 'דג', 'עכבר'], 'הדבורה מעבירה אבקה מפרח לפרח, וכך נוצרים פירות וזרעים.'],
      ['איזה כוח מושך חפצים כלפי מטה?', ['כוח המשיכה', 'כוח המגנט', 'כוח הרוח', 'כוח החשמל'], 'כוח המשיכה של כדור הארץ מושך הכול אל הקרקע.'],
    ],
    5: [
      ['מהי יחידת המבנה הבסיסית של כל יצור חי?', ['תא', 'איבר', 'רקמה', 'עצם'], 'כל יצור חי בנוי מתאים – יש יצורים שבנויים מתא אחד בלבד!'],
      ['מהי פוטוסינתזה?', ['תהליך שבו צמחים מייצרים מזון בעזרת אור', 'נשימה של בעלי חיים', 'פירוק של סלעים', 'התאדות של מים'], 'בפוטוסינתזה הצמח משתמש באור, מים ופחמן דו-חמצני ומפיק סוכר וחמצן.'],
      ['איזה גז יש יותר באוויר שאנחנו נושפים מאשר באוויר שאנחנו שואפים?', ['פחמן דו-חמצני', 'חמצן', 'הליום', 'מימן'], 'הגוף משתמש בחמצן ומוציא פחמן דו-חמצני כפסולת.'],
      ['מהי בערך מהירות האור?', ['כ-300,000 ק״מ בשנייה', 'כ-300 ק״מ בשעה', 'כ-3,000 ק״מ בשנייה', 'כ-30 ק״מ בשנייה'], 'האור הוא הדבר המהיר ביותר ביקום.'],
      ['מהו כוכב הלכת הגדול ביותר במערכת השמש?', ['צדק', 'שבתאי', 'כדור הארץ', 'נפטון'], 'צדק כל כך גדול שאפשר להכניס לתוכו יותר מאלף כדורי ארץ.'],
      ['מה ההבדל בין מזג אוויר לאקלים?', ['מזג אוויר הוא לטווח קצר, אקלים הוא ממוצע של שנים רבות', 'אין שום הבדל', 'אקלים משתנה כל שעה', 'מזג אוויר קיים רק בחורף'], 'מזג האוויר הוא מה שקורה היום; האקלים מתאר את מה שקורה בדרך כלל באזור.'],
      ['מהו מעגל חשמלי סגור?', ['מסלול רציף שבו זרם חשמלי יכול לזרום', 'חוט חתוך', 'סוללה ריקה', 'מתג פתוח'], 'רק כשהמעגל סגור לגמרי – הנורה נדלקת.'],
      ['מה מהבאים הוא מקור אנרגיה מתחדשת?', ['אנרגיית שמש', 'נפט', 'פחם', 'גז טבעי'], 'שמש ורוח לא נגמרות, בניגוד לדלקים מחצביים.'],
      ['איפה מתחיל עיכול המזון?', ['בפה', 'בקיבה', 'במעי הגס', 'בכבד'], 'הלעיסה והרוק בפה הם השלב הראשון בעיכול.'],
      ['למה הירח נראה מואר בלילה?', ['הוא מחזיר את אור השמש', 'הוא מייצר אור בעצמו', 'יש עליו נורות', 'הוא עשוי מאש'], 'לירח אין אור משלו – אנחנו רואים אור שמש שפוגע בו ומוחזר.'],
      ['מה התפקיד של מערכת החיסון?', ['להגן על הגוף מפני חיידקים ונגיפים', 'להזיז את השרירים', 'לעכל מזון', 'לראות'], 'תאי דם לבנים נלחמים במחוללי מחלות.'],
      ['מה קורה לצליל בחלל הריק?', ['הוא לא עובר, כי אין אוויר', 'הוא נהיה מהיר יותר', 'הוא נהיה חזק יותר', 'הוא הופך לאור'], 'צליל צריך חומר כמו אוויר או מים כדי לעבור.'],
    ],
  };
  E.makeSci = function (grade) {
    const band = grade <= 2 ? 1 : grade <= 4 ? 3 : 5;
    const [q, ans, ex] = U.pick(E.SCI[band]);
    return { q, opts: U.shuffle(ans), a: ans[0], how: ex };
  };

  // ---------- חלון תרגול ----------
  // kind: 'math' | 'sci'; n: מספר שאלות; onDone(correct, total)
  E.quiz = function (kind, n, opts) {
    opts = opts || {};
    const P = G.P, g = P.grade || 1, isMath = kind === 'math';
    const title = opts.title || (isMath ? 'דוכן החשבון של פרופסור פלוס' : 'מעבדת הטבע של ד״ר עלה');
    const color = isMath ? '#ff9a3d' : '#2fbf71';
    let i = 0, correct = 0, streak = 0, used = new Set();
    const body = U.el(`<div class="edu"><div class="edu-top"><span class="edu-g">${G.Isl.gradeName(g)}</span><div class="edu-dots">${Array.from({ length: n }, () => '<i></i>').join('')}</div><span class="edu-score">✅ 0</span></div><div class="edu-card"></div></div>`);
    const m = G.UI.modal({ title, icon: isMath ? '🧮' : '🔬', color, body, cls: 'mid edu-modal', onClose: () => { if (!finished && opts.onClose) opts.onClose(); } });
    let finished = false;
    const next = () => {
      if (i >= n) return finish();
      let it, tries = 0; do { it = isMath ? E.makeMath(g) : E.makeSci(g); tries++; } while (used.has(it.q) && tries < 10); used.add(it.q);
      const card = $('.edu-card', body);
      card.innerHTML = `<div class="edu-q">${isMath ? '' : '🔬 '}${it.q}</div><div class="edu-opts">${it.opts.map((o, k) => `<button data-k="${k}"><em>${k + 1}</em><span>${isMath ? L(o) : U.esc(o)}</span></button>`).join('')}</div><div class="edu-fb"></div>`;
      card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
      U.$$('.edu-opts button', card).forEach(b => b.onclick = () => answer(+b.dataset.k));
      const answer = (k) => {
        const btns = U.$$('.edu-opts button', card); if (btns[0].disabled) return;
        const ok = it.opts[k] === it.a;
        btns.forEach((b, j) => { b.disabled = true; if (it.opts[j] === it.a) b.classList.add('ok'); else if (j === k) b.classList.add('bad'); });
        const dots = U.$$('.edu-dots i', body); dots[i].className = ok ? 'ok' : 'bad';
        if (ok) { correct++; streak++; G.Audio.sfx('good'); G.Econ.track(isMath ? 'math_correct' : 'science_correct'); P.stats[isMath ? 'math' : 'sci'] = (P.stats[isMath ? 'math' : 'sci'] || 0) + 1; }
        else { streak = 0; G.Audio.sfx('bad'); }
        $('.edu-score', body).textContent = '✅ ' + correct + (streak >= 3 ? '  🔥' + streak : '');
        const howHtml = isMath ? U.esc(it.how).replace(/[\d(][\d\s+\-−×÷=().\/%]*[\d)%]/g, m => /[+\-−×÷=]/.test(m) ? L(m.trim()) : m) : U.esc(it.how);
        $('.edu-fb', card).innerHTML = `<div class="${ok ? 'fb-ok' : 'fb-bad'}"><b>${ok ? U.pick(['מעולה! 🌟', 'נכון מאוד! 🎉', 'כל הכבוד! 💪', 'אלופים! ⭐']) : 'כמעט! התשובה הנכונה מסומנת בירוק'}</b><span>${isMath ? '💡 ' + howHtml : '🧠 הידעת? ' + howHtml}</span></div><button class="btn primary next">${i + 1 >= n ? 'לסיכום 🏁' : 'לשאלה הבאה ←'}</button>`;
        $('.next', card).onclick = () => { i++; next(); };
      };
      card._answer = answer;
    };
    const kd = e => { if (!body.isConnected) return document.removeEventListener('keydown', kd); const card = $('.edu-card', body); const k = parseInt(e.key, 10); if (k >= 1 && k <= 4 && card._answer) card._answer(k - 1); if (e.key === 'Enter') { const nb = $('.next', card); if (nb) nb.click(); } };
    document.addEventListener('keydown', kd);
    const finish = () => {
      finished = true;
      const per = opts.coinsPer != null ? opts.coinsPer : (isMath ? 6 : 7);
      const coins = correct * per + (correct === n && !opts.noBonus ? 15 : 0), xp = correct * 8 + 5;
      const pass = !opts.need || correct >= opts.need;
      $('.edu-card', body).innerHTML = `<div class="edu-done"><div class="big-ico">${correct === n ? '🏆' : correct >= n / 2 ? '🌟' : '📚'}</div><h3>${correct} מתוך ${n} נכונות!</h3><p>${correct === n ? 'מושלם! אתם גאונים אמיתיים 🤓' : correct >= n / 2 ? 'עבודה יפה מאוד! תמשיכו להתאמן 💪' : 'כל תרגול מחזק את המוח – נסו שוב!'}</p>${opts.need && !pass ? `<p class="need">כדי לקבל את הרמז צריך לפחות ${opts.need} תשובות נכונות. נסו שוב!</p>` : ''}<div class="reward-row">${coins ? `<span class="reward-chip">🪙 +${coins}</span>` : ''}<span class="reward-chip xp">⭐ +${xp} XP</span></div><div class="row"><button class="btn primary big again">🔄 עוד סבב</button><button class="btn ghost big close">סיום</button></div></div>`;
      if (coins) G.Econ.addCoins(coins); G.Econ.addXP(xp); G.Econ.checkAch();
      if (correct === n) G.UI.confetti(1.4);
      $('.again', body).onclick = () => { m.close(); E.quiz(kind, n, opts); };
      $('.close', body).onclick = () => m.close();
      opts.onDone && opts.onDone(correct, n, pass);
    };
    next();
    return m;
  };
  return E;
})();
