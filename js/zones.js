// ===== קיו וורלד – הגדרת האזורים =====
G.Zones = (() => {
  const U = G.U;

  // ---------- צובעי קרקע ----------
  const GR = {
    grass(ctx, w, h, c1, c2, seed) {
      const T = G.Isl && G.Isl.T; if (T && T.grass) { c1 = T.grass[0]; c2 = T.grass[1]; }
      ctx.fillStyle = U.vgrad(ctx, 0, h, c1 || '#8fe07e', c2 || '#74cf6b'); ctx.fillRect(0, 0, w, h);
      const r = U.rng(seed || 7);
      for (let i = 0; i < w * h / 900; i++) { const x = r() * w, y = r() * h; ctx.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.10)' : 'rgba(30,90,30,0.10)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y - 7); ctx.lineTo(x + 4, y); ctx.fill(); }
      for (let i = 0; i < w * h / 30000; i++) { const x = r() * w, y = r() * h; for (let k = 0; k < 5; k++) U.circ(ctx, x + Math.cos(k * 1.26) * 2.5, y + Math.sin(k * 1.26) * 2.5, 2, r() < 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,230,120,0.8)'); }
      if (G.Isl) G.Isl.decorate(ctx, w, h, seed);
    },
    stone(ctx, x, y, w, h, c) {
      U.fillRR(ctx, x, y, w, h, 18, c || '#ece3d6');
      ctx.save(); U.rr(ctx, x, y, w, h, 18); ctx.clip(); ctx.strokeStyle = 'rgba(160,140,120,0.22)'; ctx.lineWidth = 2;
      for (let yy = y; yy < y + h; yy += 36) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); for (let xx = x + ((yy / 36) % 2) * 30; xx < x + w; xx += 60) { ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 36); ctx.stroke(); } }
      ctx.restore();
    },
    plazaCircle(ctx, x, y, rx, ry) {
      U.ell(ctx, x, y + 8, rx + 14, ry + 10, '#d8ccb9'); U.ell(ctx, x, y, rx, ry, '#f1e9dd');
      for (let k = 1; k < 6; k++) U.ell(ctx, x, y, rx * k / 6, ry * k / 6, null, 'rgba(170,150,130,0.25)', 2);
      ctx.strokeStyle = 'rgba(170,150,130,0.2)'; ctx.lineWidth = 2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) { ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * rx / 6, y + Math.sin(a) * ry / 6); ctx.lineTo(x + Math.cos(a) * rx, y + Math.sin(a) * ry); ctx.stroke(); }
      U.ell(ctx, x, y, rx * 0.66, ry * 0.66, null, 'rgba(255,126,182,0.35)', 6);
    },
    tiles(ctx, x0, y0, w, h, c1, c2, sz) {
      sz = sz || 60;
      for (let y = y0; y < y0 + h; y += sz) for (let x = x0; x < x0 + w; x += sz) { ctx.fillStyle = ((x - x0) / sz + (y - y0) / sz) % 2 ? c1 : c2; ctx.fillRect(x, y, sz, sz); }
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 1; for (let y = y0; y < y0 + h; y += sz) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke(); }
    },
    wood(ctx, x0, y0, w, h, c1, c2) {
      ctx.fillStyle = c1; ctx.fillRect(x0, y0, w, h);
      const r = U.rng(99);
      for (let y = y0; y < y0 + h; y += 26) { ctx.fillStyle = U.shade(r() < 0.5 ? c1 : c2, (r() - 0.5) * 0.08); ctx.fillRect(x0, y, w, 25); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(x0, y + 25, w, 1); for (let x = x0 + r() * 200; x < x0 + w; x += 160 + r() * 120) ctx.fillRect(x, y, 1.5, 25); }
    },
    wall(ctx, w, top, c, trim) {
      ctx.fillStyle = U.vgrad(ctx, 0, top, U.shade(c, 0.1), c); ctx.fillRect(0, 0, w, top);
      ctx.fillStyle = trim || U.shade(c, -0.25); ctx.fillRect(0, top - 18, w, 18); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, top, w, 10);
    },
    mat(ctx, x, y) { U.fillRR(ctx, x - 70, y - 18, 140, 36, 10, '#7c5cff'); U.fillRR(ctx, x - 62, y - 12, 124, 24, 7, null, '#c9b0ff', 2); G.Scn.txt(ctx, '⬇ יציאה', x, y, 14, '#ffffff'); },
  };

  const Z = {};

  // ===================== כיכר העיר =====================
  Z.plaza = {
    name: 'כיכר העיר', icon: '🏙️', w: 2400, h: 1500, mood: 'plaza', minY: 470, bots: 7,
    spawn: [1200, 1100],
    ground(ctx) {
      GR.grass(ctx, this.w, this.h, '#93e383', '#7cd472', 3);
      GR.stone(ctx, 140, 440, 2120, 120, '#e8dfd2');
      GR.stone(ctx, 0, 850, 2400, 110, '#ece3d6');
      GR.stone(ctx, 1140, 900, 120, 600, '#ece3d6');
      GR.stone(ctx, 1910, 900, 120, 600, '#ece3d6');
      [420, 930, 1440, 1990].forEach(x => GR.stone(ctx, x - 60, 540, 120, 330, '#ece3d6'));
      GR.plazaCircle(ctx, 1200, 900, 520, 300);
    },
    objects: [
      { t: 'building', kind: 'mall', x: 420, y: 470, w: 460, h: 310, c: '#ffb3cf', roof: '#e0609a', sign: 'קניון קיו', icon: '🛍️' },
      { t: 'building', kind: 'cafe', x: 930, y: 470, w: 330, h: 250, c: '#ffe3b8', sign: 'קפה ענן', icon: '☕', door: '#c0392b' },
      { t: 'building', kind: 'cinema', x: 1440, y: 470, w: 390, h: 310, c: '#c9b0ff', roof: '#7b4fd6', sign: 'קולנוע כוכב', icon: '🎬' },
      { t: 'building', kind: 'arcade', x: 1990, y: 470, w: 430, h: 290, c: '#5b3fd1', roof: '#2b1d6a', sign: 'המשחקייה', icon: '🕹️', door: '#2b1d6a' },
      { t: 'fountain', x: 1200, y: 900 },
      { t: 'bench', x: 880, y: 1080 }, { t: 'bench', x: 1520, y: 1080 }, { t: 'bench', x: 860, y: 740 }, { t: 'bench', x: 1540, y: 740 },
      { t: 'lamp', x: 680, y: 575 }, { t: 'lamp', x: 1185, y: 575 }, { t: 'lamp', x: 1715, y: 575 }, { t: 'lamp', x: 760, y: 1180 }, { t: 'lamp', x: 1640, y: 1180 }, { t: 'lamp', x: 300, y: 980 }, { t: 'lamp', x: 2100, y: 980 },
      { t: 'tree', x: 120, y: 690 }, { t: 'tree', x: 300, y: 1230, c: '#4cc06a' }, { t: 'tree', x: 560, y: 1370, s: 1.1 }, { t: 'tree', x: 1600, y: 1390, c: '#ff9ec7', s: 0.9 }, { t: 'tree', x: 2300, y: 1260, c: '#4cc06a' },
      { t: 'tree', x: 2290, y: 690, c: '#ff9ec7' }, { t: 'tree', x: 110, y: 1390, s: 0.9 }, { t: 'tree', x: 820, y: 1390, c: '#ffcf5c' }, { t: 'tree', x: 2200, y: 1430, s: 0.8 }, { t: 'pine', x: 640, y: 1210 }, { t: 'pine', x: 1780, y: 1230 },
      { t: 'bush', x: 220, y: 600, flowers: '#ff7eb6' }, { t: 'bush', x: 2180, y: 600, flowers: '#ffde59' }, { t: 'bush', x: 680, y: 790, flowers: '#ffffff' }, { t: 'bush', x: 1720, y: 790, flowers: '#c39bff' },
      { t: 'flowers', x: 450, y: 1100, w: 160, n: 16 }, { t: 'flowers', x: 1950, y: 1150, w: 130, n: 12 }, { t: 'flowers', x: 1400, y: 1300, w: 120, n: 10 }, { t: 'flowers', x: 1000, y: 1300, w: 120, n: 10 },
      { t: 'planter', x: 680, y: 640 }, { t: 'planter', x: 1715, y: 640 },
      { t: 'balloons', x: 1010, y: 1180 }, { t: 'balloons', x: 1390, y: 1180 },
      { t: 'sign', x: 1040, y: 640, text: 'ברוכים הבאים לאיקיו א׳ ✨', c: '#fff3b0', welcome: 1 },
      { t: 'gate', x: 110, y: 950, w: 110, text: '🌳 לפארק', c: '#3cc06a' },
      { t: 'gate', x: 2290, y: 950, w: 110, text: '🏡 לשכונה', c: '#ff8a3d' },
      { t: 'gate', x: 1200, y: 1450, w: 110, text: '🏖️ לחוף', c: '#2ec4d6' },
      { t: 'gate', x: 1970, y: 1450, w: 110, text: '🎉 לרחבה', c: '#ff3df0' },
    ],
    portals: [
      { r: [384, 450, 456, 480], to: 'mall', label: 'קניון קיו' },
      { r: [894, 450, 966, 480], to: 'cafe', label: 'קפה ענן' },
      { r: [1404, 450, 1476, 480], to: 'cinema', label: 'קולנוע כוכב' },
      { r: [1954, 450, 2026, 480], to: 'arcade', label: 'המשחקייה' },
      { r: [0, 840, 40, 980], to: 'park', label: 'פארק' },
      { r: [2360, 840, 2400, 980], to: 'residential', label: 'שכונה' },
      { r: [1130, 1470, 1270, 1500], to: 'beach', label: 'חוף' },
      { r: [1900, 1470, 2040, 1500], to: 'events', label: 'רחבת אירועים' },
    ],
    arrivals: { mall: [420, 560], cafe: [930, 560], cinema: [1440, 560], arcade: [1990, 560], park: [190, 910], residential: [2210, 910], beach: [1200, 1290], events: [1970, 1290] },
    staff: [{ name: 'פופה המדריכה', x: 1330, y: 660, act: 'guide', label: 'דברו עם המדריכה', look: { skin: '#f7cfa6', hairStyle: 'ponytail', hairColor: '#ff7eb6', eyes: 'big', eyeColor: '#7c4dff', shirt: 'heart_tee', pants: 'skirt_denim', shoes: 'boots_pink', hat: 'flower_crown', glasses: null, bag: 'satchel', acc: null } }],
  };

  // ===================== קניון =====================
  Z.mall = {
    name: 'קניון קיו', icon: '🛍️', w: 1500, h: 860, mood: 'indoor', minY: 250, bots: 3, indoor: true,
    ground(ctx) {
      GR.wall(ctx, this.w, 230, '#ffe6f1', '#e0609a');
      for (let i = 0; i < 6; i++) { U.fillRR(ctx, 80 + i * 240, 30, 180, 120, 14, 'rgba(191,230,255,0.85)', '#ffffff', 6); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.moveTo(100 + i * 240, 140); ctx.lineTo(160 + i * 240, 40); ctx.lineTo(190 + i * 240, 40); ctx.lineTo(130 + i * 240, 140); ctx.fill(); }
      GR.tiles(ctx, 0, 230, this.w, this.h - 230, '#fff7fb', '#ffe9f3', 70);
      U.ell(ctx, 750, 640, 210, 70, 'rgba(255,126,182,0.18)');
      GR.mat(ctx, 750, 835);
    },
    objects: [
      { t: 'kiosk', x: 230, y: 470, c: '#ff7eb6', name: 'בוטיק פופי', icon: '👕', act: 'shop:clothes', label: 'לחנות', items: ['hoodie_orange', 'dress_lilac', 'jacket_denim', 'star_tee', 'pants_cargo', 'skirt_denim', 'boots_brown', 'shoes_rainbow'] },
      { t: 'kiosk', x: 590, y: 470, c: '#7c5cff', name: 'אביזרי נוצץ', icon: '🎩', act: 'shop:accessories', label: 'לחנות', items: ['tophat', 'bunny_ears', 'glasses_heart', 'headphones', 'backpack_pink', 'cowboy', 'necklace', 'cat_ears'] },
      { t: 'kiosk', x: 950, y: 470, c: '#ff9a3d', name: 'בית ונוי', icon: '🛋️', act: 'shop:furniture', label: 'לחנות', items: ['sofa_red', 'bed_blue', 'lamp_floor', 'plant_big', 'tv', 'bookshelf', 'aquarium', 'piano'] },
      { t: 'kiosk', x: 1300, y: 470, c: '#00c2d6', name: 'אוצרות נדירים', icon: '💎', act: 'shop:rare', label: 'לחנות', items: ['crown', 'wings_angel', 'pet_dragon', 'throne', 'pet_cat', 'aura_rainbow', 'halo', 'jukebox'] },
      { t: 'bench', x: 640, y: 700 }, { t: 'bench', x: 1000, y: 700 },
      { t: 'eduStand', x: 260, y: 760, c: '#ff9a3d', title: '🧮 דוכן החשבון', badge: 'לומדים!', lines: ['תרגילים לפי הכיתה שלך', '7 × 8 = ?', '½ + ¼ = ?'], act: 'mathstand', label: 'לפתור תרגילים ולהרוויח' },
      { t: 'planter', x: 820, y: 640, c: '#ff7eb6' }, { t: 'planter', x: 90, y: 700 }, { t: 'planter', x: 1410, y: 700 },
      { t: 'balloons', x: 820, y: 560 },
    ],
    staff: [
      { name: 'שלי המעצבת', x: 230, y: 445, act: 'shop:clothes', label: 'בוטיק פופי', look: { skin: '#e9b48a', hairStyle: 'bob', hairColor: '#2b1d16', eyes: 'big', eyeColor: '#3b2a20', shirt: 'dress_sun', pants: 'pants_black', shoes: 'shoes_red', hat: null, glasses: 'glasses_round', bag: null, acc: 'necklace' } },
      { name: 'נוני', x: 590, y: 445, act: 'shop:accessories', label: 'אביזרי נוצץ', look: { skin: '#ffe3cc', hairStyle: 'spiky', hairColor: '#8a63ff', eyes: 'star', eyeColor: '#7c4dff', shirt: 'stripe_candy', pants: 'pants_sweat', shoes: 'shoes_white', hat: 'tophat', glasses: 'glasses_star', bag: null, acc: 'bowtie' } },
      { name: 'דודו הנגר', x: 950, y: 445, act: 'shop:furniture', label: 'בית ונוי', look: { skin: '#cf9467', hairStyle: 'buzz', hairColor: '#5a3825', eyes: 'happy', eyeColor: '#3b2a20', shirt: 'jacket_denim', pants: 'pants_cargo', shoes: 'boots_brown', hat: 'cap_red', glasses: null, bag: null, acc: null } },
      { name: 'פרופסור פלוס', x: 400, y: 770, act: 'mathstand', label: 'לדבר עם פרופסור פלוס', look: { skin: '#ffe3cc', hairStyle: 'curly', hairColor: '#f4f4f4', eyes: 'round', eyeColor: '#2f6fd6', shirt: 'suit_blue', pants: 'pants_black', shoes: 'shoes_black', hat: null, glasses: 'glasses_round', bag: null, acc: 'bowtie' } },
      { name: 'הקוסם זוהר', x: 1300, y: 445, act: 'shop:rare', label: 'אוצרות נדירים', look: { skin: '#cde9ff', hairStyle: 'long', hairColor: '#f4f4f4', eyes: 'big', eyeColor: '#2f6fd6', shirt: 'suit_blue', pants: 'pants_black', shoes: 'shoes_black', hat: 'crown', glasses: null, bag: null, acc: 'cape_royal' } },
    ],
    portals: [{ r: [680, 830, 820, 860], to: 'plaza' }], arrivals: { plaza: [750, 760] },
  };

  // ===================== בית קפה =====================
  Z.cafe = {
    name: 'קפה ענן', icon: '☕', w: 1200, h: 820, mood: 'indoor', minY: 300, bots: 3, indoor: true,
    ground(ctx) {
      GR.wall(ctx, this.w, 270, '#fff0d9', '#a8703d');
      ctx.fillStyle = 'rgba(168,112,61,0.12)'; for (let x = 0; x < this.w; x += 40) ctx.fillRect(x, 0, 20, 252);
      [180, 1020].forEach(x => { U.fillRR(ctx, x - 80, 50, 160, 130, 12, '#bfe6ff', '#ffffff', 8); U.circ(ctx, x + 30, 90, 22, '#fff6c2'); U.ell(ctx, x - 20, 150, 50, 16, '#ffffff'); });
      GR.wood(ctx, 0, 270, this.w, this.h - 270, '#d8a571', '#c99460');
      U.ell(ctx, 600, 600, 330, 120, 'rgba(255,107,129,0.14)');
      GR.mat(ctx, 600, 795);
    },
    objects: [
      { t: 'counter', x: 600, y: 380, w: 440, machine: true, items: ['🥐', '🍰', '🧁', '🍪'], c: '#8a5a36' },
      { t: 'menuBoard', x: 600, y: 200 },
      { t: 'cafeTable', x: 230, y: 540, act: 'sit', label: 'לשבת' }, { t: 'cafeTable', x: 970, y: 540, act: 'sit', label: 'לשבת' },
      { t: 'cafeTable', x: 380, y: 700, act: 'sit', label: 'לשבת' }, { t: 'cafeTable', x: 820, y: 700, act: 'sit', label: 'לשבת' },
      { t: 'planter', x: 60, y: 760 }, { t: 'planter', x: 1140, y: 760 }, { t: 'planter', x: 60, y: 360 }, { t: 'planter', x: 1140, y: 360 },
    ],
    staff: [{ name: 'בריסטה ביבי', x: 560, y: 360, act: 'coffee', label: 'להזמין משקה', look: { skin: '#a86c45', hairStyle: 'curly', hairColor: '#2b1d16', eyes: 'happy', eyeColor: '#3b2a20', shirt: 'stripe_navy', pants: 'pants_black', shoes: 'shoes_black', hat: 'beanie_yellow', glasses: null, bag: null, acc: 'scarf_red' } }],
    portals: [{ r: [530, 790, 670, 820], to: 'plaza' }], arrivals: { plaza: [600, 740] },
  };

  // ===================== משחקייה =====================
  const GAMES = [['coins', 'קדחת המטבעות', '🪙', '#ffb300'], ['race', 'מרוץ פופי', '🏎️', '#ff4d5e'], ['jump', 'קפיצה גבוהה', '🦘', '#2fbf71'], ['memory', 'זיכרון קסום', '🃏', '#7c5cff'], ['catch', 'גשם פירות', '🍓', '#ff5fa8'], ['trivia', 'חידון פופי', '🧠', '#3a7bff'], ['reaction', 'פופ מהיר', '🎯', '#00b8cc']];
  Z.arcade = {
    name: 'המשחקייה', icon: '🕹️', w: 1400, h: 860, mood: 'party', minY: 330, bots: 3, indoor: true,
    ground(ctx) {
      GR.wall(ctx, this.w, 280, '#2a1d5e', '#120b33');
      for (let i = 0; i < 40; i++) U.star(ctx, (i * 137) % this.w, 20 + (i * 61) % 220, 3, 1.2, 4, 'rgba(255,255,255,0.5)');
      ctx.fillStyle = '#1b1240'; ctx.fillRect(0, 280, this.w, this.h - 280);
      const cols = ['#ff3df0', '#00e5ff', '#ffde59', '#5fe0b7'];
      for (let i = 0; i < 70; i++) { const x = (i * 211) % this.w, y = 300 + (i * 97) % (this.h - 320); ctx.strokeStyle = U.rgba(cols[i % 4], 0.3); ctx.lineWidth = 3; ctx.beginPath(); if (i % 3 === 0) ctx.arc(x, y, 10, 0, Math.PI * 2); else if (i % 3 === 1) { ctx.moveTo(x - 10, y); ctx.lineTo(x, y - 12); ctx.lineTo(x + 10, y); ctx.closePath(); } else { ctx.moveTo(x - 10, y - 6); ctx.lineTo(x + 10, y + 6); } ctx.stroke(); }
      ctx.save(); ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 20; G.Scn.txt(ctx, '★ המשחקייה ★', this.w / 2, 120, 54, '#ffffff', 700); ctx.restore();
      G.Scn.txt(ctx, 'גשו למכונה ולחצו כדי לשחק ולהרוויח מטבעות', this.w / 2, 190, 20, '#c9b0ff', 500);
      GR.mat(ctx, 700, 835);
    },
    objects: GAMES.map((g, i) => ({ t: 'arcadeMachine', x: 160 + i * 180, y: 420, game: g[0], name: g[1], emoji: g[2], c: g[3], act: 'game:' + g[0], label: 'לשחק ב' + g[1] }))
      .concat([{ t: 'planter', x: 60, y: 760, c: '#7c5cff' }, { t: 'planter', x: 1340, y: 760, c: '#7c5cff' }, { t: 'fridge', x: 1250, y: 640 }, { t: 'bench', x: 400, y: 680 }, { t: 'bench', x: 1000, y: 680 }]),
    portals: [{ r: [630, 830, 770, 860], to: 'plaza' }], arrivals: { plaza: [700, 770] },
    staff: [{ name: 'ג׳וני השרת', x: 1130, y: 560, act: 'janitor', label: 'לדבר עם ג׳וני', look: { skin: '#7a4a2c', hairStyle: 'buzz', hairColor: '#2b1d16', eyes: 'round', eyeColor: '#1d1d2c', shirt: 'sport_jersey', pants: 'pants_cargo', shoes: 'shoes_black', hat: 'cap_blue', glasses: null, bag: null, acc: null } }],
  };
  Z.GAMES = GAMES;

  // ===================== קולנוע =====================
  const seats = [];
  [540, 640, 740].forEach((y, r) => { for (let i = 0; i < 12; i++) { const x = 230 + i * 74 + (i >= 6 ? 80 : 0); seats.push({ t: 'seat', x, y, act: 'movie', label: 'לשבת ולצפות', c: r === 0 ? '#d42f4f' : '#b0213a' }); } });
  Z.cinema = {
    name: 'קולנוע כוכב', icon: '🎬', w: 1300, h: 950, mood: 'home', minY: 420, bots: 3, indoor: true, dark: true,
    ground(ctx) {
      GR.wall(ctx, this.w, 400, '#2b1430', '#14081a');
      ctx.fillStyle = '#5a1828'; ctx.fillRect(0, 400, this.w, this.h - 400);
      for (let y = 400; y < this.h; y += 40) for (let x = (y / 40 % 2) * 20; x < this.w; x += 40) U.circ(ctx, x, y, 3, 'rgba(255,200,90,0.12)');
      ctx.fillStyle = '#7a2238'; ctx.fillRect(610, 400, 80, this.h - 400);
      GR.mat(ctx, 650, 925);
    },
    objects: [{ t: 'screen', x: 650, y: 360, w: 760, h: 270, sortY: 0 }, { t: 'cart', x: 1150, y: 860, c: '#ff4d5e', emoji: '🍿', act: 'popcorn', label: 'פופקורן (5 מטבעות)' }].concat(seats),
    portals: [{ r: [580, 900, 720, 950], to: 'plaza' }], arrivals: { plaza: [650, 860] },
  };

  // ===================== פארק =====================
  const pflowers = [];
  { const r = U.rng(42); for (let i = 0; i < 16; i++) pflowers.push({ t: 'pickflower', x: 150 + r() * 1900, y: 300 + r() * 1100, c: ['#ff7eb6', '#ffde59', '#c39bff', '#ff8a3d', '#8fe3ff'][i % 5], act: 'flower', label: 'לקטוף פרח' }); }
  Z.park = {
    name: 'פארק הפרפרים', icon: '🌳', w: 2200, h: 1500, mood: 'park', minY: 160, bots: 4,
    water: [[1400, 820, 300, 160]],
    ground(ctx) {
      GR.grass(ctx, this.w, this.h, '#9be88a', '#78d070', 11);
      ctx.strokeStyle = '#e8d4ac'; ctx.lineWidth = 70; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(2200, 760); ctx.bezierCurveTo(1800, 700, 1700, 450, 1200, 420); ctx.bezierCurveTo(700, 390, 500, 700, 300, 900); ctx.bezierCurveTo(150, 1050, 400, 1300, 900, 1250); ctx.bezierCurveTo(1200, 1220, 1300, 1150, 1500, 1100); ctx.stroke();
      ctx.strokeStyle = '#f2e2c0'; ctx.lineWidth = 56; ctx.stroke();
      U.ell(ctx, 1400, 830, 318, 178, '#cbb592'); U.ell(ctx, 1400, 820, 300, 160, '#4ab8e8'); U.ell(ctx, 1400, 812, 280, 142, '#62c9f2');
      for (let i = 0; i < 6; i++) { U.ell(ctx, 1250 + i * 55, 780 + (i % 2) * 70, 16, 8, '#3fbf6a'); U.circ(ctx, 1255 + i * 55, 778 + (i % 2) * 70, 4, '#ff9ec7'); }
      U.fillRR(ctx, 330, 560, 190, 130, 14, '#ff8fa3'); for (let i = 0; i < 4; i++) { ctx.fillStyle = '#ffffff'; ctx.fillRect(330 + i * 50, 560, 22, 130); } ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(330, 560, 190, 130);
    },
    dyn(ctx, t) { for (let i = 0; i < 3; i++) { const r = ((t * 22 + i * 40) % 120); U.ell(ctx, 1400, 812, 140 + r, 70 + r * 0.55, null, U.rgba('#ffffff', 0.25 * (1 - r / 120)), 2); } },
    objects: [
      { t: 'chest', x: 600, y: 330, act: 'chest', label: 'תיבת אוצר יומית' },
      { t: 'eduStand', x: 1300, y: 420, c: '#2fbf71', title: '🔬 מעבדת הטבע', badge: 'מדע!', lines: ['שאלות מדע לפי הכיתה', '🌱 ☀️ 💧 🧲 🪐', 'גלו עובדות מדהימות'], act: 'science', label: 'להיכנס למעבדת המדע' },
      { t: 'duck', x: 1350, y: 800, rx: 150, ry: 60, ph: 0, sortY: 640 }, { t: 'duck', x: 1450, y: 840, rx: 120, ry: 50, ph: 2, c: '#ffde59', sortY: 640 }, { t: 'duck', x: 1400, y: 790, rx: 90, ry: 40, ph: 4, sortY: 640 },
      { t: 'bench', x: 1150, y: 560 }, { t: 'bench', x: 1700, y: 1080 }, { t: 'bench', x: 700, y: 1180 },
      { t: 'lamp', x: 1000, y: 470 }, { t: 'lamp', x: 1850, y: 640 }, { t: 'lamp', x: 450, y: 1100 },
      { t: 'tree', x: 120, y: 260, c: '#ff9ec7' }, { t: 'tree', x: 420, y: 300 }, { t: 'tree', x: 900, y: 260, c: '#ffcf5c', fruit: '#ff5d6c' }, { t: 'tree', x: 1600, y: 300, c: '#ff9ec7' }, { t: 'tree', x: 2050, y: 300 },
      { t: 'tree', x: 130, y: 1350, c: '#4cc06a' }, { t: 'tree', x: 1100, y: 1420, s: 1.1 }, { t: 'tree', x: 2050, y: 1350, c: '#ff9ec7' }, { t: 'tree', x: 820, y: 860, fruit: '#ffde59' }, { t: 'tree', x: 1900, y: 950 },
      { t: 'pine', x: 300, y: 1080 }, { t: 'pine', x: 1650, y: 1350 }, { t: 'pine', x: 2100, y: 1100 },
      { t: 'bush', x: 700, y: 560, flowers: '#ff7eb6' }, { t: 'bush', x: 1000, y: 1000, flowers: '#ffde59' }, { t: 'bush', x: 1950, y: 500 }, { t: 'rock', x: 1720, y: 860 }, { t: 'rock', x: 1060, y: 760, s: 0.8 },
      { t: 'flowers', x: 600, y: 900, w: 200, n: 20 }, { t: 'flowers', x: 1300, y: 1250, w: 200, n: 18 }, { t: 'flowers', x: 1700, y: 450, w: 160, n: 14 },
      { t: 'gate', x: 2110, y: 820, w: 110, text: '🏙️ לכיכר', c: '#7c5cff' },
    ].concat(pflowers),
    portals: [{ r: [2160, 700, 2200, 860], to: 'plaza' }], arrivals: { plaza: [2030, 780], secret: [200, 780] },
    staff: [{ name: 'ד״ר עלה', x: 1440, y: 440, act: 'science', label: 'לדבר עם ד״ר עלה', look: { skin: '#a86c45', hairStyle: 'bun', hairColor: '#2b1d16', eyes: 'big', eyeColor: '#2e9e5b', shirt: 'hoodie_mint', pants: 'pants_cargo', shoes: 'boots_brown', hat: 'flower_crown', glasses: 'glasses_round', bag: 'satchel', acc: null } }],
  };

  // ===================== חוף =====================
  const shells = [];
  { const r = U.rng(77); for (let i = 0; i < 14; i++) shells.push({ t: 'shell', x: 120 + r() * 2160, y: 700 + r() * 220, c: ['#ffb3cf', '#ffe0b0', '#c9b0ff', '#bfe6ff'][i % 4], act: 'shell', label: 'לאסוף צדף' }); }
  Z.beach = {
    name: 'חוף הזהב', icon: '🏖️', w: 2400, h: 1400, mood: 'beach', minY: 150, bots: 5,
    water: [[0, 960, 2400, 440, 'rect']],
    ground(ctx) {
      ctx.fillStyle = U.vgrad(ctx, 0, 1000, '#ffe7b0', '#f6d48d'); ctx.fillRect(0, 0, this.w, this.h);
      const r = U.rng(5); for (let i = 0; i < 1600; i++) { ctx.fillStyle = r() < 0.5 ? 'rgba(200,150,80,0.18)' : 'rgba(255,255,255,0.3)'; ctx.fillRect(r() * this.w, r() * 1000, 2, 2); }
      GR.wood(ctx, 0, 0, this.w, 130, '#c99460', '#b88350');
      ctx.fillStyle = '#9a6f3c'; for (let x = 20; x < this.w; x += 120) ctx.fillRect(x, 0, 8, 140);
      ctx.fillStyle = U.vgrad(ctx, 940, 1400, '#5fd3f0', '#1f8fd1'); ctx.fillRect(0, 960, this.w, 440);
      ctx.fillStyle = '#e8c78a'; ctx.fillRect(0, 930, this.w, 40);
    },
    dyn(ctx, t) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.moveTo(0, 1400);
      for (let x = 0; x <= this.w; x += 40) ctx.lineTo(x, 958 + Math.sin(x * 0.02 + t * 2) * 8 + Math.sin(t * 0.8) * 10);
      ctx.lineTo(this.w, 1400); ctx.closePath(); ctx.fill();
      ctx.fillStyle = U.vgrad(ctx, 960, 1400, '#5fd3f0', '#1f8fd1'); ctx.beginPath(); ctx.moveTo(0, 1400);
      for (let x = 0; x <= this.w; x += 40) ctx.lineTo(x, 968 + Math.sin(x * 0.02 + t * 2) * 8 + Math.sin(t * 0.8) * 10);
      ctx.lineTo(this.w, 1400); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3;
      for (let i = 0; i < 18; i++) { const x = (i * 173 + t * 30) % (this.w + 200) - 100, y = 1040 + (i * 67) % 320; ctx.beginPath(); ctx.arc(x, y, 18, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      [[500, 1180, '#ff5d6c'], [1700, 1260, '#ffde59']].forEach(([bx, by, c], i) => { const x = bx + Math.sin(t * 0.3 + i) * 120, y = by + Math.sin(t * 1.5 + i) * 6; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.5 + i) * 0.05); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.lineTo(36, 22); ctx.lineTo(-36, 22); ctx.fill(); ctx.fillStyle = c; ctx.fillRect(-50, 0, 100, 6); ctx.fillStyle = '#7a4a2c'; ctx.fillRect(-2, -80, 4, 80); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(2, -78); ctx.lineTo(40, -10); ctx.lineTo(2, -10); ctx.fill(); ctx.restore(); });
    },
    objects: [
      { t: 'palm', x: 160, y: 300 }, { t: 'palm', x: 620, y: 260, s: 1.1 }, { t: 'palm', x: 1650, y: 280 }, { t: 'palm', x: 2250, y: 320, s: 1.15 }, { t: 'palm', x: 1100, y: 640, s: 0.9 }, { t: 'palm', x: 2000, y: 700 },
      { t: 'umbrella', x: 380, y: 560, c: '#ff5d6c' }, { t: 'umbrella', x: 880, y: 760, c: '#3a7bff' }, { t: 'umbrella', x: 1480, y: 600, c: '#ffcb3c' }, { t: 'umbrella', x: 1880, y: 470, c: '#3cc98a' },
      { t: 'towel', x: 420, y: 640, c: '#ff7eb6', r: 0.2 }, { t: 'towel', x: 920, y: 830, c: '#3cc9ff', r: -0.15 }, { t: 'towel', x: 1520, y: 680, c: '#ffde59', r: 0.1 }, { t: 'towel', x: 1910, y: 550, c: '#9b6bff', r: -0.2 },
      { t: 'sandcastle', x: 1250, y: 860 }, { t: 'beachball', x: 700, y: 520 }, { t: 'beachball', x: 2150, y: 860 },
      { t: 'lifeguard', x: 2150, y: 610 },
      { t: 'cart', x: 1000, y: 330, c: '#ff7eb6', emoji: '🍦', act: 'icecream', label: 'גלידה (10 מטבעות)' },
      { t: 'gate', x: 1200, y: 150, w: 110, text: '🏙️ לכיכר', c: '#7c5cff' },
    ].concat(shells),
    portals: [{ r: [1130, 100, 1270, 140], to: 'plaza' }], arrivals: { plaza: [1200, 230] },
  };

  // ===================== שכונת מגורים =====================
  const houseObjs = [];
  const tops = [300, 750, 1200, 1650, 2100], bots = [520, 970, 1420, 1870, 2320];
  const roofs = ['#e85d6c', '#3a7bff', '#2fbf71', '#9b6bff', '#ff9a3d'], walls = ['#ffe3b8', '#ffd6e8', '#d8ecff', '#dff7e6', '#efe3ff', '#fff4c2'];
  Z.HOUSE_SLOTS = [];
  tops.forEach((x, i) => Z.HOUSE_SLOTS.push({ x, y: 560 }));
  bots.forEach((x, i) => Z.HOUSE_SLOTS.push({ x, y: 1160 }));
  Z.residential = {
    name: 'שכונת הדובדבן', icon: '🏡', w: 2600, h: 1300, mood: 'home', minY: 250, bots: 3,
    ground(ctx) {
      GR.grass(ctx, this.w, this.h, '#a2ea8f', '#86d97c', 21);
      ctx.fillStyle = '#d9d3ea'; ctx.fillRect(0, 620, this.w, 50); ctx.fillRect(0, 870, this.w, 50);
      ctx.fillStyle = '#5b5e74'; ctx.fillRect(0, 670, this.w, 200);
      ctx.fillStyle = '#ffffff'; for (let x = 20; x < this.w; x += 110) U.fillRR(ctx, x, 764, 60, 10, 5, '#fff3b0');
      Z.HOUSE_SLOTS.forEach(s => { GR.stone(ctx, s.x - 26, s.y - 2, 52, s.y < 800 ? 70 : -0, '#e8dfd2'); });
      Z.HOUSE_SLOTS.filter(s => s.y > 800).forEach(s => GR.stone(ctx, s.x - 26, 918, 52, s.y - 918, '#e8dfd2'));
    },
    objects: [
      { t: 'gate', x: 90, y: 770, w: 110, text: '🏙️ לכיכר', c: '#7c5cff' },
      { t: 'tree', x: 70, y: 300 }, { t: 'tree', x: 530, y: 330, c: '#ff9ec7' }, { t: 'tree', x: 980, y: 330 }, { t: 'tree', x: 1430, y: 330, c: '#ffcf5c' }, { t: 'tree', x: 1880, y: 330 }, { t: 'tree', x: 2420, y: 330, c: '#ff9ec7' },
      { t: 'lamp', x: 520, y: 640 }, { t: 'lamp', x: 1430, y: 640 }, { t: 'lamp', x: 2340, y: 640 }, { t: 'lamp', x: 750, y: 900 }, { t: 'lamp', x: 1650, y: 900 },
      { t: 'bush', x: 2500, y: 1100, flowers: '#ff7eb6' }, { t: 'bush', x: 120, y: 1150, flowers: '#ffde59' }, { t: 'flowers', x: 1200, y: 1240, w: 300, n: 20 },
    ],
    portals: [{ r: [0, 690, 40, 850], to: 'plaza' }], arrivals: { plaza: [170, 770] },
    staff: [{ name: 'שכנה רותי', x: 1480, y: 650, act: 'neighbor', label: 'לדבר עם השכנה רותי', look: { skin: '#e9b48a', hairStyle: 'bob', hairColor: '#d9412b', eyes: 'happy', eyeColor: '#3b2a20', shirt: 'stripe_candy', pants: 'skirt_denim', shoes: 'sandals', hat: null, glasses: 'glasses_round', bag: null, acc: 'scarf_mint' } }],
  };

  // ===================== רחבת אירועים =====================
  Z.events = {
    name: 'רחבת האירועים', icon: '🎉', w: 2000, h: 1300, mood: 'party', minY: 520, bots: 6, night: true,
    floor: [560, 640, 880, 360],
    ground(ctx) {
      ctx.fillStyle = U.vgrad(ctx, 0, this.h, '#2a1850', '#160c2e'); ctx.fillRect(0, 0, this.w, this.h);
      const r = U.rng(3); for (let i = 0; i < 160; i++) U.circ(ctx, r() * this.w, r() * 380, r() * 1.8 + 0.4, 'rgba(255,255,255,' + (0.3 + r() * 0.6) + ')');
      U.circ(ctx, 1700, 130, 46, '#fff6d8'); U.circ(ctx, 1685, 120, 46, '#2a1850');
      GR.stone(ctx, 0, 500, this.w, this.h - 500, '#3a2a60');
    },
    dyn(ctx, t) {
      const [fx, fy, fw, fh] = this.floor, n = 11, m = 6, cw = fw / n, ch = fh / m;
      for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const h = ((i * 37 + j * 71) + Math.floor(t * 3) * 47) % 360; ctx.fillStyle = `hsla(${h},85%,${55 + ((i + j + Math.floor(t * 3)) % 2) * 12}%,0.85)`; ctx.fillRect(fx + i * cw + 2, fy + j * ch + 2, cw - 4, ch - 4); }
    },
    over(ctx, t) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) { const a = Math.sin(t * 0.9 + i * 1.6) * 0.5, x0 = 700 + i * 200; const g = ctx.createLinearGradient(x0, 230, x0 + Math.sin(a) * 600, 1100); const col = ['#ff3df0', '#00e5ff', '#ffde59', '#5fe0b7'][i]; g.addColorStop(0, U.rgba(col, 0.35)); g.addColorStop(1, U.rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - 10, 230); ctx.lineTo(x0 + 10, 230); ctx.lineTo(x0 + Math.sin(a) * 700 + 130, 1150); ctx.lineTo(x0 + Math.sin(a) * 700 - 130, 1150); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    },
    objects: [
      { t: 'stage', x: 1000, y: 540, w: 760, sortY: 470 }, { t: 'djBooth', x: 1000, y: 545, sortY: 545, act: 'dj', label: 'לדבר עם ה-DJ' },
      { t: 'speaker', x: 560, y: 600 }, { t: 'speaker', x: 1440, y: 600 },
      { t: 'lamp', x: 300, y: 700 }, { t: 'lamp', x: 1700, y: 700 }, { t: 'lamp', x: 300, y: 1100 }, { t: 'lamp', x: 1700, y: 1100 },
      { t: 'balloons', x: 420, y: 900 }, { t: 'balloons', x: 1580, y: 900 }, { t: 'balloons', x: 200, y: 600 }, { t: 'balloons', x: 1800, y: 600 },
      { t: 'cart', x: 1720, y: 1000, c: '#9b6bff', emoji: '🥤', act: 'drink', label: 'שייק (8 מטבעות)' },
      { t: 'pine', x: 120, y: 860, c: '#2e9e6a', lights: true }, { t: 'pine', x: 1880, y: 860, c: '#2e9e6a', lights: true },
      { t: 'gate', x: 1000, y: 1260, w: 110, text: '🏙️ לכיכר', c: '#7c5cff' },
    ],
    staff: [{ name: 'DJ זיקו', x: 1000, y: 505, act: 'dj', label: 'לדבר עם ה-DJ', look: { skin: '#7a4a2c', hairStyle: 'mohawk', hairColor: '#33d29a', eyes: 'round', eyeColor: '#1d1d2c', shirt: 'hoodie_black', pants: 'pants_cargo', shoes: 'shoes_rainbow', hat: 'headphones', glasses: 'glasses_sun', bag: null, acc: 'necklace' } }],
    portals: [{ r: [930, 1270, 1070, 1300], to: 'plaza' }], arrivals: { plaza: [1000, 1080] },
  };

  Z.LIST = ['plaza', 'mall', 'cafe', 'arcade', 'cinema', 'park', 'beach', 'residential', 'events', 'attr'];
  Z.GR = GR;
  return Z;
})();
