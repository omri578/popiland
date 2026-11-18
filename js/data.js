// ===== קיו וורלד – נתוני המשחק =====
G.DATA = {};
const D = G.DATA;

D.SKINS = ['#ffe3cc', '#f7cfa6', '#e9b48a', '#cf9467', '#a86c45', '#7a4a2c', '#5a3520', '#ffd3e6', '#cde9ff', '#d7f5c8'];
D.HAIR_COLORS = ['#2b1d16', '#5a3825', '#9a5530', '#e3b75f', '#f6e7b9', '#d9412b', '#ff7eb6', '#8a63ff', '#38b6ff', '#33d29a', '#f4f4f4', '#3a4152'];
D.EYE_COLORS = ['#3b2a20', '#2f6fd6', '#2e9e5b', '#7c4dff', '#c0392b', '#1d1d2c', '#e67e22', '#e84393'];
D.HAIR_STYLES = [
  { id: 'short', name: 'קצר' }, { id: 'spiky', name: 'קוצים' }, { id: 'long', name: 'ארוך' }, { id: 'bob', name: 'קארה' },
  { id: 'curly', name: 'מתולתל' }, { id: 'bun', name: 'קוקו גולגול' }, { id: 'ponytail', name: 'קוקו' }, { id: 'pigtails', name: 'שתי קוקיות' },
  { id: 'mohawk', name: 'מוהוק' }, { id: 'buzz', name: 'קצוץ' },
];
D.EYES = [
  { id: 'round', name: 'עגולות' }, { id: 'big', name: 'נוצצות' }, { id: 'happy', name: 'שמחות' },
  { id: 'sleepy', name: 'רגועות' }, { id: 'wink', name: 'קריצה' }, { id: 'star', name: 'כוכבים' },
];

// ---- פריטים ----
// cat: shirt, pants, shoes, hat, glasses, bag, acc, pet, furn
const I = [];
const add = (id, cat, name, price, style, c1, c2, extra) => I.push(Object.assign({ id, cat, name, price, style, c1, c2 }, extra || {}));

// בגדים התחלתיים (חינם)
add('tee_red', 'shirt', 'חולצה אדומה', 0, 'tee', '#ff5d6c', '#fff', { starter: 1 });
add('tee_blue', 'shirt', 'חולצה כחולה', 0, 'tee', '#4d8dff', '#fff', { starter: 1 });
add('tee_green', 'shirt', 'חולצה ירוקה', 0, 'tee', '#3cc98a', '#fff', { starter: 1 });
add('tee_yellow', 'shirt', 'חולצה צהובה', 0, 'tee', '#ffc93c', '#fff', { starter: 1 });
add('tee_purple', 'shirt', 'חולצה סגולה', 0, 'tee', '#9b6bff', '#fff', { starter: 1 });
add('pants_jeans', 'pants', 'ג׳ינס', 0, 'jeans', '#3f63b5', '#2c4a8c', { starter: 1 });
add('pants_black', 'pants', 'מכנסיים שחורים', 0, 'pants', '#2d2f3d', '#1d1f2a', { starter: 1 });
add('skirt_pink', 'pants', 'חצאית ורודה', 0, 'skirt', '#ff8fc1', '#ff6aa9', { starter: 1 });
add('shorts_khaki', 'pants', 'מכנסונים', 0, 'shorts', '#c9a86a', '#a8884e', { starter: 1 });
add('shoes_white', 'shoes', 'סניקרס לבנות', 0, 'sneaker', '#f4f4f8', '#ff5d6c', { starter: 1 });
add('shoes_black', 'shoes', 'נעליים שחורות', 0, 'sneaker', '#2d2f3d', '#ffffff', { starter: 1 });

// חנות בגדים
add('stripe_navy', 'shirt', 'חולצת פסים ימית', 60, 'stripe', '#2c3e8f', '#ffffff');
add('stripe_candy', 'shirt', 'חולצת פסי סוכריה', 70, 'stripe', '#ff8fc1', '#ffffff');
add('hoodie_orange', 'shirt', 'קפוצ׳ון כתום', 120, 'hoodie', '#ff8a3d', '#ffd2b0');
add('hoodie_mint', 'shirt', 'קפוצ׳ון מנטה', 120, 'hoodie', '#5fe0b7', '#d4fff0');
add('hoodie_black', 'shirt', 'קפוצ׳ון שחור', 140, 'hoodie', '#2b2d3a', '#ff5d6c');
add('star_tee', 'shirt', 'חולצת כוכב', 90, 'star', '#20233a', '#ffd84d');
add('heart_tee', 'shirt', 'חולצת לב', 90, 'heart', '#ffffff', '#ff4d7a');
add('sport_jersey', 'shirt', 'גופיית ספורט', 110, 'sport', '#ffd23f', '#1d3a8a');
add('dress_sun', 'shirt', 'שמלת קיץ', 160, 'dress', '#ffb347', '#fff2c6');
add('dress_lilac', 'shirt', 'שמלת לילך', 180, 'dress', '#c39bff', '#f0e4ff');
add('jacket_denim', 'shirt', 'ג׳קט ג׳ינס', 200, 'jacket', '#5578c4', '#ffffff');
add('jacket_leather', 'shirt', 'ז׳קט עור', 260, 'jacket', '#3a2a24', '#ff5d6c');
add('suit_blue', 'shirt', 'חליפה אלגנטית', 320, 'suit', '#25336b', '#e63946', { lvl: 3 });
add('pants_cargo', 'pants', 'מכנסי דגמ״ח', 80, 'cargo', '#6b7a4f', '#55623d');
add('pants_sweat', 'pants', 'מכנסי טרנינג', 70, 'sweat', '#9aa3b5', '#ffffff');
add('pants_red', 'pants', 'מכנסיים אדומים', 90, 'pants', '#d63a4a', '#a82a38');
add('skirt_denim', 'pants', 'חצאית ג׳ינס', 80, 'skirt', '#4a6fc0', '#36559a');
add('shorts_beach', 'pants', 'מכנסי חוף', 60, 'shorts', '#2ec4d6', '#ffde59');
add('shoes_red', 'shoes', 'סניקרס אדומות', 70, 'sneaker', '#ff4d5e', '#ffffff');
add('shoes_rainbow', 'shoes', 'נעלי קשת', 150, 'sneaker', '#9b6bff', '#ffde59');
add('boots_brown', 'shoes', 'מגפיים חומים', 130, 'boot', '#7a4a2c', '#5a341d');
add('boots_pink', 'shoes', 'מגפי גומי ורודים', 110, 'boot', '#ff8fc1', '#e05f9a');
add('sandals', 'shoes', 'סנדלים', 50, 'sandal', '#c08a4d', '#8d5f2e');

// חנות אביזרים
add('cap_red', 'hat', 'כובע מצחייה אדום', 60, 'cap', '#ff4d5e', '#ffffff');
add('cap_blue', 'hat', 'כובע מצחייה כחול', 60, 'cap', '#3a7bff', '#ffde59');
add('beanie_yellow', 'hat', 'כובע גרב', 70, 'beanie', '#ffcb3c', '#ff6b6b');
add('cowboy', 'hat', 'כובע בוקרים', 150, 'cowboy', '#a8703d', '#5a3a1d');
add('tophat', 'hat', 'מגבעת', 180, 'tophat', '#23232f', '#e63946');
add('bunny_ears', 'hat', 'אוזני ארנב', 120, 'bunny', '#ffffff', '#ffb3cf');
add('cat_ears', 'hat', 'אוזני חתול', 120, 'cat', '#3a3340', '#ff9ec7');
add('flower_crown', 'hat', 'זר פרחים', 140, 'flowers', '#ff7eb6', '#ffe066');
add('headphones', 'hat', 'אוזניות', 160, 'phones', '#7c5cff', '#2b2d3a');
add('party_hat', 'hat', 'כובע מסיבה', 50, 'party', '#3cc9ff', '#ffde59');
add('glasses_round', 'glasses', 'משקפיים עגולים', 50, 'round', '#3a2a20', '#bfe6ff');
add('glasses_sun', 'glasses', 'משקפי שמש', 80, 'sun', '#1d1d2a', '#6a7cff');
add('glasses_heart', 'glasses', 'משקפי לב', 100, 'heart', '#ff4d7a', '#ffb3cf');
add('glasses_star', 'glasses', 'משקפי כוכב', 100, 'star', '#ffcb3c', '#fff3b0');
add('backpack_blue', 'bag', 'תיק גב כחול', 90, 'backpack', '#3a7bff', '#ffde59');
add('backpack_pink', 'bag', 'תיק גב ורוד', 90, 'backpack', '#ff7eb6', '#ffffff');
add('satchel', 'bag', 'תיק צד', 110, 'satchel', '#a8703d', '#ffcb3c');
add('scarf_red', 'acc', 'צעיף אדום', 60, 'scarf', '#e63946', '#ffffff');
add('scarf_mint', 'acc', 'צעיף מנטה', 60, 'scarf', '#5fe0b7', '#ffffff');
add('necklace', 'acc', 'שרשרת זהב', 150, 'necklace', '#ffcb3c', '#ff4d7a');
add('bowtie', 'acc', 'פפיון', 70, 'bowtie', '#e63946', '#ffffff');

// חנות נדירים
add('crown', 'hat', 'כתר מלכותי', 900, 'crown', '#ffcb3c', '#e63946', { rare: 1, lvl: 4 });
add('halo', 'hat', 'הילה זוהרת', 700, 'halo', '#fff3a0', '#ffffff', { rare: 1, lvl: 3 });
add('glasses_cyber', 'glasses', 'משקפי סייבר', 450, 'cyber', '#00e5ff', '#ff3df0', { rare: 1, lvl: 2 });
add('wings_angel', 'acc', 'כנפי מלאך', 1200, 'wings', '#ffffff', '#dfe9ff', { rare: 1, lvl: 5 });
add('wings_fairy', 'acc', 'כנפי פרפר', 1000, 'fairy', '#ff9ef0', '#8fe3ff', { rare: 1, lvl: 4 });
add('cape_royal', 'acc', 'גלימה מלכותית', 650, 'cape', '#7b2ff7', '#ffcb3c', { rare: 1, lvl: 3 });
add('aura_rainbow', 'acc', 'הילת קשת', 1500, 'aura', '#ff7eb6', '#7c5cff', { rare: 1, lvl: 6 });
add('pet_cat', 'pet', 'חתלתול', 600, 'cat', '#ffb35c', '#ffffff', { rare: 1, lvl: 2 });
add('pet_dog', 'pet', 'כלבלב', 600, 'dog', '#c08a4d', '#ffffff', { rare: 1, lvl: 2 });
add('pet_slime', 'pet', 'סליימי', 500, 'slime', '#5fe0b7', '#d4fff0', { rare: 1, lvl: 1 });
add('pet_bunny', 'pet', 'ארנבון', 650, 'bunny', '#ffffff', '#ffb3cf', { rare: 1, lvl: 3 });
add('pet_dragon', 'pet', 'דרקון קטן', 2500, 'dragon', '#7c5cff', '#ffcb3c', { rare: 1, lvl: 7 });
add('throne', 'furn', 'כס מלכות', 1800, 'throne', '#ffcb3c', '#c0392b', { rare: 1, lvl: 5 });
add('statue_star', 'furn', 'פסל כוכב זהב', 1200, 'statue', '#ffcb3c', '#fff3a0', { rare: 1, lvl: 4 });
add('rug_rainbow', 'furn', 'שטיח קשת', 700, 'rugrainbow', '#ff7eb6', '#7c5cff', { rare: 1, lvl: 2 });
add('jukebox', 'furn', 'ג׳וקבוקס', 1100, 'jukebox', '#ff4d7a', '#ffcb3c', { rare: 1, lvl: 3 });
add('arcade_cab', 'furn', 'מכונת ארקייד', 1300, 'arcade', '#3a2a7a', '#00e5ff', { rare: 1, lvl: 4 });

// חנות רהיטים
add('sofa_red', 'furn', 'ספה אדומה', 220, 'sofa', '#e85d6c', '#ffd2d7');
add('sofa_teal', 'furn', 'ספה טורקיז', 220, 'sofa', '#2ab3a6', '#c9f5ef');
add('armchair', 'furn', 'כורסה', 140, 'armchair', '#ffb347', '#fff2c6');
add('bed_blue', 'furn', 'מיטה כחולה', 260, 'bed', '#4d8dff', '#ffffff');
add('bed_pink', 'furn', 'מיטה ורודה', 260, 'bed', '#ff8fc1', '#ffffff');
add('table_round', 'furn', 'שולחן עגול', 120, 'table', '#c08a4d', '#8d5f2e');
add('chair_wood', 'furn', 'כיסא עץ', 60, 'chair', '#c08a4d', '#8d5f2e');
add('desk_pc', 'furn', 'שולחן מחשב', 300, 'desk', '#e8e3f0', '#3a7bff');
add('lamp_floor', 'furn', 'מנורה עומדת', 90, 'lamp', '#ffde59', '#3a3340');
add('plant_small', 'furn', 'עציץ קטן', 40, 'plant', '#3cc98a', '#e07a4f');
add('plant_big', 'furn', 'מונסטרה', 110, 'bigplant', '#2e9e5b', '#f2efe9');
add('tv', 'furn', 'טלוויזיה', 350, 'tv', '#23232f', '#3a7bff');
add('rug_round', 'furn', 'שטיח עגול', 90, 'rug', '#ffb3cf', '#ff7eb6');
add('rug_blue', 'furn', 'שטיח מלבני', 100, 'rugrect', '#7fb2ff', '#3a7bff');
add('bookshelf', 'furn', 'כוננית ספרים', 180, 'bookshelf', '#a8703d', '#7a4a2c');
add('aquarium', 'furn', 'אקווריום', 420, 'aquarium', '#7fdcff', '#2a5a8a', { lvl: 2 });
add('piano', 'furn', 'פסנתר', 520, 'piano', '#23232f', '#ffffff', { lvl: 3 });
add('fireplace', 'furn', 'אח מבוערת', 480, 'fireplace', '#b5654a', '#8a4632', { lvl: 2 });
add('beanbag', 'furn', 'פוף', 80, 'beanbag', '#9b6bff', '#c9b0ff');
add('easel', 'furn', 'כן ציור', 150, 'easel', '#c08a4d', '#7fdcff');

D.ITEMS = {}; I.forEach(it => D.ITEMS[it.id] = it);
D.ITEM_LIST = I;

D.SHOPS = {
  clothes: { name: 'בוטיק פופי', icon: '👕', keeper: 'שלי המעצבת', color: '#ff7eb6', filter: it => !it.rare && !it.starter && ['shirt', 'pants', 'shoes'].includes(it.cat), tabs: [['shirt', 'חולצות ושמלות'], ['pants', 'מכנסיים וחצאיות'], ['shoes', 'נעליים']] },
  accessories: { name: 'אביזרי נוצץ', icon: '🎩', keeper: 'נוני', color: '#7c5cff', filter: it => !it.rare && ['hat', 'glasses', 'bag', 'acc'].includes(it.cat), tabs: [['hat', 'כובעים'], ['glasses', 'משקפיים'], ['bag', 'תיקים'], ['acc', 'תכשיטים ועוד']] },
  furniture: { name: 'בית ונוי', icon: '🛋️', keeper: 'דודו הנגר', color: '#ff9a3d', filter: it => !it.rare && it.cat === 'furn', tabs: [['furn', 'רהיטים']] },
  rare: { name: 'אוצרות נדירים', icon: '💎', keeper: 'הקוסם זוהר', color: '#00c2d6', filter: it => !!it.rare, tabs: [['wear', 'לבוש נדיר'], ['pet', 'חיות מחמד'], ['furn', 'רהיטי פאר']] },
};

D.CAT_NAMES = { shirt: 'חולצה', pants: 'מכנסיים', shoes: 'נעליים', hat: 'כובע', glasses: 'משקפיים', bag: 'תיק', acc: 'אביזר', pet: 'חיית מחמד', furn: 'רהיט' };

D.HOUSE_LEVELS = [
  { name: 'דירונת', price: 0, w: 760, h: 520 },
  { name: 'בית נעים', price: 600, w: 960, h: 600 },
  { name: 'בית משפחה', price: 1800, w: 1160, h: 680 },
  { name: 'וילה מפוארת', price: 4500, w: 1400, h: 780 },
];
D.WALLS = ['#ffe9d6', '#ffd6e8', '#d8ecff', '#dff7e6', '#efe3ff', '#fff4c2', '#2f3350', '#ffcfb0'];
D.FLOORS = [
  { id: 'wood', name: 'פרקט', c1: '#d9a46a', c2: '#c48f56' },
  { id: 'tiles', name: 'אריחים', c1: '#f1eef6', c2: '#dcd6e8' },
  { id: 'carpet', name: 'שטיח מקיר לקיר', c1: '#8fb8ff', c2: '#7aa6f0' },
  { id: 'checker', name: 'משבצות', c1: '#ffffff', c2: '#2f3350' },
  { id: 'pinkwood', name: 'עץ ורוד', c1: '#f5b6c8', c2: '#e8a0b5' },
  { id: 'grass', name: 'דשא מקורה', c1: '#7ed67a', c2: '#6cc468' },
];

// ---- בוטים (שחקנים מדומים) ----
D.BOT_NAMES = ['שקד_הגיבורה', 'אריאל_מהיר', 'הדר_בלונים', 'יונתן_שוקו', 'רוני_רקטה', 'נגה_צבעונית', 'נועה_כוכבית', 'איתי_המהיר', 'מאיה123', 'יובל_גיימר', 'שירה_פרפר', 'דניאל_קול', 'תמר_שמש', 'עומר_נינג׳ה',
  'ליה_לבבות', 'אורי_פיצה', 'הילה_ירח', 'רון_גלגליות', 'אלה_קשת', 'גיא_הדרקון', 'מיקה_פופ', 'בן_הגל', 'אגם_מים', 'עדי_קסם'];
D.BOT_LINES = {
  any: ['היי לכולם! 👋', 'מישהו רוצה לבוא למשחקייה?', 'קניתי כובע חדש!!', 'וואו איזה בגדים יפים פה', 'אני חוסך לדרקון 🐉', 'בואו לבקר אותי בבית!', 'חחח', 'שיא חדש במרוץ המכוניות! 🏎️', 'יש פה מישהו מהכיתה שלי?', 'מי בא למסיבה ברחבת האירועים? 🎉', 'קיו וורלד הכי כיף 💜', 'עכשיו עשיתי את כל המשימות היומיות', 'מישהו ראה את החתלתול שלי?'],
  beach: ['המים פה מושלמים 🌊', 'אספתי כבר 10 צדפים!', 'מי רוצה גלידה? 🍦', 'שיזוף מקסים היום ☀️'],
  cafe: ['הקקאו פה הכי טוב ☕', 'מישהו רוצה לשבת איתי?', 'אני מזמין עוגה 🍰'],
  park: ['הברווזים כאלה חמודים 🦆', 'יש פה פרחים מטורפים 🌸', 'מצאתי את תיבת האוצר!'],
  arcade: ['עוד סיבוב אחד!', 'הטריוויה קשה היום 🤯', 'פופ מהיר זה ממכר'],
  events: ['איזה DJ!! 🎧', 'כולם לרקוד! 💃', 'המסיבה הכי טובה בעיר'],
  cinema: ['שששש הסרט מתחיל 🎬', 'פופקורן מישהו? 🍿'],
  mall: ['תראו את השמלה הזאת!', 'אני צריך עוד מטבעות 😅', 'החנות הנדירה מטורפת 💎'],
  plaza: ['המזרקה כל כך יפה ✨', 'נפגשים בכיכר!', 'לאן הולכים היום?'],
  residential: ['הבית שלי בסוף הרחוב 🏡', 'שדרגתי את הבית!'],
};
D.BOT_DM = ['היי! מה נשמע? 😊', 'בוא נשחק ביחד במשחקייה!', 'ראית את הפריטים החדשים בחנות הנדירה?', 'אני ברחבת האירועים, בוא!', 'תודה על ההודעה 💜', 'חחח אתה מצחיק', 'נתראה בכיכר!', 'איזה כיף שאנחנו חברים 🤝'];

// ---- משימות ----
D.QUEST_POOL = {
  daily: [
    { id: 'd_play2', type: 'play_game', n: 2, text: 'שחקו 2 משחקים במשחקייה', coins: 60, xp: 40 },
    { id: 'd_earn150', type: 'earn', n: 150, text: 'הרוויחו 150 מטבעות', coins: 50, xp: 40 },
    { id: 'd_beach', type: 'visit_beach', n: 1, text: 'בקרו בחוף הים', coins: 30, xp: 20 },
    { id: 'd_park', type: 'visit_park', n: 1, text: 'טיילו בפארק', coins: 30, xp: 20 },
    { id: 'd_shell5', type: 'shell', n: 5, text: 'אספו 5 צדפים בחוף', coins: 60, xp: 40 },
    { id: 'd_chat3', type: 'chat', n: 3, text: 'שלחו 3 הודעות בצ׳אט', coins: 30, xp: 25 },
    { id: 'd_emote3', type: 'emote', n: 3, text: 'הביעו 3 רגשות', coins: 30, xp: 25 },
    { id: 'd_buy1', type: 'buy', n: 1, text: 'קנו פריט בחנות', coins: 40, xp: 35 },
    { id: 'd_coffee', type: 'coffee', n: 1, text: 'הזמינו משקה בבית הקפה', coins: 35, xp: 25 },
    { id: 'd_movie', type: 'movie', n: 1, text: 'צפו בסרט בקולנוע', coins: 40, xp: 30 },
    { id: 'd_dance', type: 'dance', n: 1, text: 'רקדו ברחבת האירועים', coins: 35, xp: 25 },
    { id: 'd_flower5', type: 'flower', n: 5, text: 'קטפו 5 פרחים בפארק', coins: 50, xp: 35 },
    { id: 'd_trivia5', type: 'trivia_correct', n: 5, text: 'ענו נכון על 5 שאלות טריוויה', coins: 60, xp: 45 },
    { id: 'd_math5', type: 'math_correct', n: 5, text: 'פתרו 5 תרגילי חשבון בדוכן החשבון בקניון', coins: 70, xp: 50 },
    { id: 'd_math8', type: 'math_correct', n: 8, text: 'פתרו 8 תרגילי חשבון בקניון', coins: 90, xp: 60 },
    { id: 'd_sci4', type: 'science_correct', n: 4, text: 'ענו נכון על 4 שאלות במעבדת המדע בפארק', coins: 70, xp: 50 },
    { id: 'd_ride', type: 'ride', n: 1, text: 'עלו על האטרקציה המיוחדת של האי', coins: 40, xp: 30 },
  ],
  weekly: [
    { id: 'w_play15', type: 'play_game', n: 15, text: 'שחקו 15 משחקים', coins: 400, xp: 250 },
    { id: 'w_earn1500', type: 'earn', n: 1500, text: 'הרוויחו 1,500 מטבעות', coins: 350, xp: 250 },
    { id: 'w_buy5', type: 'buy', n: 5, text: 'קנו 5 פריטים', coins: 300, xp: 200 },
    { id: 'w_shell30', type: 'shell', n: 30, text: 'אספו 30 צדפים', coins: 300, xp: 200 },
    { id: 'w_friend2', type: 'friend', n: 2, text: 'הוסיפו 2 חברים חדשים', coins: 250, xp: 180 },
    { id: 'w_place5', type: 'place', n: 5, text: 'סדרו 5 רהיטים בבית', coins: 250, xp: 180 },
    { id: 'w_login4', type: 'login', n: 4, text: 'היכנסו למשחק 4 ימים', coins: 400, xp: 250 },
    { id: 'w_math30', type: 'math_correct', n: 30, text: 'פתרו 30 תרגילי חשבון', coins: 400, xp: 280 },
    { id: 'w_sci20', type: 'science_correct', n: 20, text: 'ענו נכון על 20 שאלות מדע', coins: 400, xp: 280 },
  ],
};
D.ACHIEVEMENTS = [
  { id: 'a_first_game', icon: '🎮', name: 'שחקן מתחיל', text: 'שחקו את המשחק הראשון', stat: 'games', n: 1, coins: 50 },
  { id: 'a_games25', icon: '🕹️', name: 'גיימר אמיתי', text: 'שחקו 25 משחקים', stat: 'games', n: 25, coins: 300 },
  { id: 'a_rich1000', icon: '💰', name: 'קופת חיסכון', text: 'החזיקו 1,000 מטבעות בבת אחת', stat: 'coinsHeld', n: 1000, coins: 100 },
  { id: 'a_rich5000', icon: '🏦', name: 'מיליונר קטן', text: 'החזיקו 5,000 מטבעות בבת אחת', stat: 'coinsHeld', n: 5000, coins: 500 },
  { id: 'a_shop10', icon: '🛍️', name: 'מלך הקניות', text: 'קנו 10 פריטים', stat: 'bought', n: 10, coins: 200 },
  { id: 'a_fashion', icon: '👗', name: 'אייקון אופנה', text: 'החזיקו 25 פריטי לבוש', stat: 'clothes', n: 25, coins: 300 },
  { id: 'a_decor', icon: '🛋️', name: 'מעצב פנים', text: 'סדרו 10 רהיטים בבית', stat: 'placedNow', n: 10, coins: 250 },
  { id: 'a_social', icon: '🤝', name: 'חברותי', text: 'צברו 5 חברים', stat: 'friends', n: 5, coins: 200 },
  { id: 'a_explorer', icon: '🧭', name: 'חוקר העולם', text: 'בקרו בכל 9 האזורים', stat: 'zones', n: 9, coins: 250 },
  { id: 'a_shells100', icon: '🐚', name: 'אספן צדפים', text: 'אספו 100 צדפים', stat: 'shells', n: 100, coins: 300 },
  { id: 'a_trivia', icon: '🧠', name: 'גאון', text: 'ענו נכון על כל השאלות בחידון', stat: 'triviaPerfect', n: 1, coins: 300 },
  { id: 'a_lvl5', icon: '⭐', name: 'כוכב עולה', text: 'הגיעו לרמה 5', stat: 'level', n: 5, coins: 300 },
  { id: 'a_lvl10', icon: '🌟', name: 'סופרסטאר', text: 'הגיעו לרמה 10', stat: 'level', n: 10, coins: 1000 },
  { id: 'a_villa', icon: '🏰', name: 'בעל וילה', text: 'שדרגו את הבית לווילה', stat: 'houseLvl', n: 3, coins: 800 },
  { id: 'a_math', icon: '🧮', name: 'אלוף החשבון', text: 'פתרו נכון 50 תרגילי חשבון', stat: 'math', n: 50, coins: 400 },
  { id: 'a_sci', icon: '🔬', name: 'מדען צעיר', text: 'ענו נכון על 30 שאלות מדע', stat: 'sci', n: 30, coins: 400 },
  { id: 'a_detective', icon: '🕵️', name: 'בלש איקיו', text: 'פתרו חידת איקיו חודשית', stat: 'mysteries', n: 1, coins: 300 },
  { id: 'a_pet', icon: '🐾', name: 'חבר על ארבע', text: 'אמצו חיית מחמד', stat: 'pets', n: 1, coins: 150 },
];
D.DAILY_REWARDS = [50, 75, 100, 125, 150, 200, 400];

D.EMOTES = [
  { id: 'wave', icon: '👋', name: 'שלום' }, { id: 'happy', icon: '😊', name: 'שמחה' }, { id: 'laugh', icon: '😂', name: 'צחוק' },
  { id: 'love', icon: '😍', name: 'אהבה' }, { id: 'dance', icon: '💃', name: 'ריקוד' }, { id: 'cool', icon: '😎', name: 'קול' },
  { id: 'sad', icon: '😢', name: 'עצב' }, { id: 'jump', icon: '🤸', name: 'קפיצה' },
];

D.DANCES = [
  { id: 'dance', icon: '🪩', name: 'דיסקו' }, { id: 'd_robot', icon: '🤖', name: 'רובוט' }, { id: 'd_hip', icon: '🕺', name: 'היפ הופ' }, { id: 'd_spin', icon: '🌀', name: 'סביבונים' },
  { id: 'd_ballet', icon: '🩰', name: 'בלט' }, { id: 'd_wave', icon: '🌊', name: 'גלים' }, { id: 'd_jumpjack', icon: '⭐', name: 'קפיצות כוכב' }, { id: 'd_floss', icon: '🎉', name: 'מסיבה' },
];
D.ALL_MOVES = D.EMOTES.concat(D.DANCES);
D.QUICK = ['שלום! 👋', 'בוא/י נשחק! 🎮', 'כל הכבוד! 👏', 'תודה! 💜', 'איזה כיף! 😄', 'מגניב! 😎', 'בוא/י נרקוד! 💃', 'נתראה! 👋', 'רוצה להיות חבר/ה? 🤝', 'איפה המשחקייה? 🕹️'];

D.TRIVIA = [
  ['מהי בירת צרפת?', ['פריז', 'לונדון', 'רומא', 'מדריד']],
  ['כמה רגליים יש לעכביש?', ['8', '6', '10', '4']],
  ['איזה כוכב לכת הכי קרוב לשמש?', ['כוכב חמה', 'נוגה', 'מאדים', 'צדק']],
  ['איזה צבע מתקבל מערבוב כחול וצהוב?', ['ירוק', 'סגול', 'כתום', 'חום']],
  ['כמה ימים יש בשנה מעוברת?', ['366', '365', '364', '360']],
  ['מהו היונק הגדול בעולם?', ['לווייתן כחול', 'פיל אפריקאי', 'ג׳ירפה', 'כריש לווייתן']],
  ['כמה צלעות יש למשושה?', ['6', '5', '8', '7']],
  ['מהי הנוסחה הכימית של מים?', ['H₂O', 'CO₂', 'O₂', 'NaCl']],
  ['באיזו יבשת נמצאת מצרים?', ['אפריקה', 'אסיה', 'אירופה', 'אוסטרליה']],
  ['מהו האוקיינוס הגדול ביותר?', ['האוקיינוס השקט', 'האוקיינוס האטלנטי', 'האוקיינוס ההודי', 'אוקיינוס הקרח הצפוני']],
  ['מי צייר את המונה ליזה?', ['לאונרדו דה וינצ׳י', 'פבלו פיקאסו', 'וינסנט ואן גוך', 'מיכלאנג׳לו']],
  ['מהו המקום הנמוך ביותר על פני היבשה?', ['ים המלח', 'עמק המוות', 'הכנרת', 'הסהרה']],
  ['כמה שחקנים יש לקבוצת כדורגל על המגרש?', ['11', '9', '10', '12']],
  ['איזו חיה מכונה "מלך החיות"?', ['אריה', 'נמר', 'פיל', 'דוב']],
  ['כמה זה 7 × 8?', ['56', '54', '48', '64']],
  ['איזו שפה מדברים בברזיל?', ['פורטוגזית', 'ספרדית', 'ברזילאית', 'צרפתית']],
  ['כמה צבעים יש בקשת בענן?', ['7', '5', '6', '8']],
  ['מהו ההר הגבוה בעולם?', ['האוורסט', 'הקילימנג׳רו', 'מון בלאן', 'החרמון']],
  ['איזה גז צמחים קולטים מהאוויר?', ['פחמן דו-חמצני', 'חמצן', 'חנקן', 'הליום']],
  ['כמה חודשים יש בשנה?', ['12', '10', '11', '13']],
  ['מהי בירת יפן?', ['טוקיו', 'בייג׳ינג', 'סיאול', 'אוסקה']],
  ['איזה בעל חיים הוא דו-חי?', ['צפרדע', 'נחש', 'לטאה', 'דג']],
  ['מהו המספר הראשוני הקטן ביותר?', ['2', '1', '3', '0']],
  ['מהו הלוויין הטבעי של כדור הארץ?', ['הירח', 'השמש', 'מאדים', 'נוגה']],
  ['כמה רגליים יש לחרק?', ['6', '8', '4', '10']],
  ['מהי היבשת הגדולה ביותר?', ['אסיה', 'אפריקה', 'אמריקה', 'אירופה']],
  ['באיזו עיר נמצא הקולוסיאום?', ['רומא', 'אתונה', 'פריז', 'מדריד']],
  ['כמה זה 100 חלקי 4?', ['25', '20', '40', '24']],
  ['לאיזה כלי נגינה יש קלידים לבנים ושחורים?', ['פסנתר', 'גיטרה', 'חליל', 'תוף']],
  ['מה מודדים במדחום?', ['טמפרטורה', 'משקל', 'גובה', 'מהירות']],
  ['איזה פרי צהוב ומעוקל?', ['בננה', 'תפוח', 'ענב', 'אבטיח']],
  ['כמה שעות יש ביממה?', ['24', '12', '20', '48']],
];

D.MOVIES = ['הרפתקאות בכוכב הסוכריות', 'החתול שרצה לעוף', 'מרוץ הענקים', 'סוד המגדל הסגול'];
