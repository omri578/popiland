// ===== קיו וורלד – ציור דמויות, חיות מחמד ואייקונים =====
G.Avatar = (() => {
  const U = G.U;
  const IT = (id) => id ? G.DATA.ITEMS[id] : null;
  const HEAD_Y = -62, HEAD_R = 19;

  function defaultLook() {
    return { skin: '#f7cfa6', hairStyle: 'short', hairColor: '#5a3825', eyes: 'round', eyeColor: '#3b2a20', shirt: 'tee_blue', pants: 'pants_jeans', shoes: 'shoes_white', hat: null, glasses: null, bag: null, acc: null, pet: null };
  }
  function randomLook(rand) {
    rand = rand || Math.random;
    const D = G.DATA, pick = a => a[Math.floor(rand() * a.length)];
    const wear = cat => D.ITEM_LIST.filter(i => i.cat === cat && !i.rare);
    const L = {
      skin: pick(D.SKINS.slice(0, 7)), hairStyle: pick(D.HAIR_STYLES).id, hairColor: pick(D.HAIR_COLORS), eyes: pick(D.EYES).id, eyeColor: pick(D.EYE_COLORS),
      shirt: pick(wear('shirt')).id, pants: pick(wear('pants')).id, shoes: pick(wear('shoes')).id,
      hat: rand() < 0.45 ? pick(wear('hat')).id : null, glasses: rand() < 0.25 ? pick(wear('glasses')).id : null,
      bag: rand() < 0.3 ? pick(wear('bag')).id : null, acc: rand() < 0.25 ? pick(wear('acc')).id : null, pet: null,
    };
    if (rand() < 0.12) { const r = D.ITEM_LIST.filter(i => i.rare && ['hat', 'acc', 'pet'].includes(i.cat)); const it = pick(r); L[it.cat] = it.id; }
    return L;
  }

  // ---------- חלקים ----------
  function drawHairBack(ctx, L, dir) {
    const hc = L.hairColor, st = L.hairStyle, dk = U.shade(hc, -0.2);
    ctx.fillStyle = hc;
    if (st === 'long') { U.fillRR(ctx, -21, HEAD_Y - 6, 42, 42, 14, hc); }
    if (st === 'bob' && dir === 'up') { U.fillRR(ctx, -21, HEAD_Y - 4, 42, 26, 12, hc); }
    if (st === 'ponytail') {
      const side = dir === 'left' ? 1 : dir === 'right' ? -1 : 0;
      ctx.save(); ctx.translate(side * 16, HEAD_Y - 4);
      ctx.beginPath(); ctx.moveTo(-6, -4); ctx.quadraticCurveTo(side * 14 + 0.1, 12, side * 4, 30); ctx.quadraticCurveTo(-side * 4, 14, 6, -4); ctx.closePath();
      ctx.fillStyle = hc; ctx.fill(); ctx.restore();
      if (dir === 'down') { U.ell(ctx, 0, HEAD_Y + 18, 7, 12, dk); }
    }
    if (st === 'pigtails') {
      [-1, 1].forEach(s => { U.ell(ctx, s * 22, HEAD_Y + 6, 7, 14, hc); U.circ(ctx, s * 19, HEAD_Y - 6, 4, '#ff7eb6'); });
    }
  }
  function capPath(ctx, fr) {
    ctx.beginPath();
    ctx.arc(0, HEAD_Y, HEAD_R + 1.5, Math.PI * 0.98, Math.PI * 2.02);
    ctx.lineTo(HEAD_R + 1, HEAD_Y + fr * 0.5);
    ctx.quadraticCurveTo(10, HEAD_Y - 2 + fr, 4, HEAD_Y - 7 + fr);
    ctx.quadraticCurveTo(-2, HEAD_Y - 2 + fr, -8, HEAD_Y - 6 + fr);
    ctx.quadraticCurveTo(-15, HEAD_Y - 1 + fr, -HEAD_R - 1, HEAD_Y + fr * 0.6);
    ctx.closePath();
  }
  function drawHairFront(ctx, L, dir, fx) {
    const hc = L.hairColor, st = L.hairStyle, dk = U.shade(hc, -0.22), lt = U.shade(hc, 0.25);
    if (dir === 'up') {
      if (st === 'buzz') { U.circ(ctx, 0, HEAD_Y, HEAD_R, U.rgba(hc, 0.75)); return; }
      ctx.beginPath(); ctx.arc(0, HEAD_Y - 1, HEAD_R + 1.5, Math.PI * 0.9, Math.PI * 2.1); ctx.lineTo(HEAD_R, HEAD_Y + 12); ctx.quadraticCurveTo(0, HEAD_Y + 18, -HEAD_R, HEAD_Y + 12); ctx.closePath();
      ctx.fillStyle = hc; ctx.fill();
      if (st === 'long') U.fillRR(ctx, -20, HEAD_Y, 40, 38, 14, hc);
      if (st === 'bun') { U.circ(ctx, 0, HEAD_Y - 20, 9, hc); U.circ(ctx, -2, HEAD_Y - 22, 3, lt); }
      if (st === 'spiky') for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 8 - 5, HEAD_Y - 14); ctx.lineTo(i * 8, HEAD_Y - 28 + Math.abs(i) * 3); ctx.lineTo(i * 8 + 5, HEAD_Y - 14); ctx.fillStyle = hc; ctx.fill(); }
      if (st === 'mohawk') U.fillRR(ctx, -4, HEAD_Y - 30, 8, 30, 4, hc);
      if (st === 'curly') for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; U.circ(ctx, Math.cos(a) * 19, HEAD_Y + Math.sin(a) * 19, 6.5, hc); }
      ctx.strokeStyle = dk; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, HEAD_Y - 18); ctx.quadraticCurveTo(3, HEAD_Y, 0, HEAD_Y + 12); ctx.stroke();
      return;
    }
    ctx.save(); ctx.translate(fx * 0.5, 0);
    switch (st) {
      case 'buzz':
        ctx.beginPath(); ctx.arc(0, HEAD_Y, HEAD_R + 0.5, Math.PI * 1.02, Math.PI * 1.98); ctx.quadraticCurveTo(0, HEAD_Y - 10, -HEAD_R, HEAD_Y - 3); ctx.fillStyle = U.rgba(hc, 0.85); ctx.fill(); break;
      case 'spiky':
        capPath(ctx, 0); ctx.fillStyle = hc; ctx.fill();
        for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 8 - 6, HEAD_Y - 14); ctx.lineTo(i * 9, HEAD_Y - 31 + Math.abs(i) * 3); ctx.lineTo(i * 8 + 6, HEAD_Y - 14); ctx.fillStyle = hc; ctx.fill(); }
        break;
      case 'mohawk':
        ctx.beginPath(); ctx.arc(0, HEAD_Y, HEAD_R + 0.5, Math.PI * 1.05, Math.PI * 1.95); ctx.quadraticCurveTo(0, HEAD_Y - 12, -HEAD_R, HEAD_Y - 4); ctx.fillStyle = U.rgba(hc, 0.6); ctx.fill();
        U.fillRR(ctx, -5, HEAD_Y - 33, 10, 22, 5, hc); break;
      case 'curly':
        for (let i = 0; i < 11; i++) { const a = Math.PI * 0.95 + i * Math.PI * 1.1 / 10; U.circ(ctx, Math.cos(a) * 18, HEAD_Y - 2 + Math.sin(a) * 18, 7, i % 2 ? hc : U.shade(hc, 0.08)); }
        U.circ(ctx, -6, HEAD_Y - 12, 6, hc); U.circ(ctx, 6, HEAD_Y - 12, 6, hc); break;
      case 'bob':
        capPath(ctx, 4); ctx.fillStyle = hc; ctx.fill();
        U.fillRR(ctx, -23, HEAD_Y - 6, 9, 26, 5, hc); U.fillRR(ctx, 14, HEAD_Y - 6, 9, 26, 5, hc); break;
      case 'long':
        capPath(ctx, 3); ctx.fillStyle = hc; ctx.fill();
        U.fillRR(ctx, -23, HEAD_Y - 6, 9, 38, 5, hc); U.fillRR(ctx, 14, HEAD_Y - 6, 9, 38, 5, hc); break;
      case 'bun':
        U.circ(ctx, 0, HEAD_Y - 21, 9, hc); capPath(ctx, 1); ctx.fillStyle = hc; ctx.fill(); U.circ(ctx, -3, HEAD_Y - 24, 3, lt); break;
      default:
        capPath(ctx, 0); ctx.fillStyle = hc; ctx.fill();
    }
    // ברק
    if (st !== 'buzz' && st !== 'curly') { ctx.strokeStyle = U.rgba('#ffffff', 0.35); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, HEAD_Y, HEAD_R - 3, Math.PI * 1.25, Math.PI * 1.45); ctx.stroke(); }
    ctx.restore();
  }

  function drawEyes(ctx, L, fx, t, emote) {
    const ec = L.eyeColor, y = HEAD_Y + 1;
    const blink = ((t + (L._seed || 0)) % 4.2) < 0.12;
    const em = emote && emote.id;
    let type = L.eyes;
    if (em === 'happy' || em === 'laugh' || em === 'dance') type = 'happy';
    if (em === 'love') type = 'heart';
    ctx.lineCap = 'round';
    [-1, 1].forEach(s => {
      const ex = fx + s * 7.5;
      if (em === 'cool') { return; }
      if (blink && type !== 'happy' && type !== 'heart') { ctx.strokeStyle = '#2a1d1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex - 3.5, y); ctx.lineTo(ex + 3.5, y); ctx.stroke(); return; }
      switch (type) {
        case 'happy': ctx.strokeStyle = '#2a1d1a'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(ex, y + 2, 4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); break;
        case 'heart': U.heart(ctx, ex, y + 1, 5.5, '#ff3d6e'); break;
        case 'sleepy': ctx.strokeStyle = '#2a1d1a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, y - 1, 4, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); break;
        case 'wink':
          if (s === 1) { ctx.strokeStyle = '#2a1d1a'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ex - 4, y - 2); ctx.lineTo(ex + 3, y); ctx.lineTo(ex - 4, y + 2); ctx.stroke(); }
          else { U.ell(ctx, ex, y, 3.6, 4.8, ec); U.circ(ctx, ex + 1.2, y - 1.6, 1.4, '#fff'); }
          break;
        case 'star': U.star(ctx, ex, y, 5.5, 2.4, 5, ec); U.circ(ctx, ex + 1, y - 1, 1, '#fff'); break;
        case 'big': U.ell(ctx, ex, y, 4.8, 6, '#ffffff', '#2a1d1a', 1); U.ell(ctx, ex, y + 0.8, 3.6, 4.6, ec); U.circ(ctx, ex, y + 1, 1.8, '#1a1020'); U.circ(ctx, ex + 1.5, y - 1.8, 1.6, '#fff'); U.circ(ctx, ex - 1.4, y + 2.2, 0.8, '#fff'); break;
        default: U.ell(ctx, ex, y, 3.4, 4.6, ec); U.circ(ctx, ex + 1.2, y - 1.6, 1.4, '#fff');
      }
    });
    if (em === 'cool') { U.fillRR(ctx, fx - 14, y - 4, 12, 7, 3, '#15151f'); U.fillRR(ctx, fx + 2, y - 4, 12, 7, 3, '#15151f'); ctx.fillStyle = '#15151f'; ctx.fillRect(fx - 3, y - 3, 6, 2); }
    // גבות בעצב
    if (em === 'sad') { ctx.strokeStyle = '#2a1d1a'; ctx.lineWidth = 1.6; [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(fx + s * 4, y - 7); ctx.lineTo(fx + s * 10, y - 9); ctx.stroke(); }); }
  }
  function drawMouth(ctx, fx, emote) {
    const y = HEAD_Y + 10, em = emote && emote.id;
    ctx.lineCap = 'round';
    if (em === 'laugh' || em === 'jump') { ctx.beginPath(); ctx.moveTo(fx - 5, y - 1); ctx.quadraticCurveTo(fx, y + 9, fx + 5, y - 1); ctx.closePath(); ctx.fillStyle = '#b83a4b'; ctx.fill(); U.ell(ctx, fx, y + 3.5, 2.5, 1.5, '#ff8fa3'); }
    else if (em === 'sad') { ctx.strokeStyle = '#7a3b35'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(fx, y + 4, 4, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); U.ell(ctx, fx + 9, HEAD_Y + 6, 1.6, 2.6, '#7fd0ff'); }
    else if (em === 'love') { U.ell(ctx, fx, y + 1, 2.2, 2.6, '#b83a4b'); }
    else if (em === 'cool') { ctx.strokeStyle = '#7a3b35'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(fx - 4, y + 1); ctx.quadraticCurveTo(fx + 1, y + 3, fx + 5, y - 1); ctx.stroke(); }
    else { ctx.strokeStyle = '#7a3b35'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(fx, y - 1, 3.6, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
  }

  function drawHat(ctx, it, dir, fx, t) {
    if (!it) return;
    const c1 = it.c1, c2 = it.c2, y = HEAD_Y, back = dir === 'up';
    ctx.save(); ctx.translate(back ? 0 : fx * 0.4, 0);
    switch (it.style) {
      case 'cap':
        ctx.beginPath(); ctx.arc(0, y - 4, 20, Math.PI, 0); ctx.closePath(); ctx.fillStyle = c1; ctx.fill();
        if (!back) { const bx = dir === 'left' ? -14 : dir === 'right' ? 14 : 0; U.ell(ctx, bx, y - 4, 18, 5, U.shade(c1, -0.15)); U.circ(ctx, 0, y - 14, 4, c2); }
        else U.fillRR(ctx, -8, y - 4, 16, 4, 2, U.shade(c1, -0.2));
        U.circ(ctx, 0, y - 24, 2.5, U.shade(c1, -0.2)); break;
      case 'beanie':
        ctx.beginPath(); ctx.arc(0, y - 4, 20.5, Math.PI, 0); ctx.closePath(); ctx.fillStyle = c1; ctx.fill();
        U.fillRR(ctx, -21, y - 8, 42, 9, 4, U.shade(c1, -0.12));
        U.circ(ctx, 0, y - 26, 6, c2); break;
      case 'cowboy':
        U.ell(ctx, 0, y - 10, 32, 8, U.shade(c1, -0.1)); U.fillRR(ctx, -15, y - 32, 30, 24, 10, c1); U.fillRR(ctx, -15, y - 15, 30, 5, 2, c2); break;
      case 'tophat':
        U.ell(ctx, 0, y - 14, 24, 6, c1); U.fillRR(ctx, -14, y - 46, 28, 33, 4, c1); U.fillRR(ctx, -14, y - 22, 28, 6, 1, c2); U.fillRR(ctx, -10, y - 44, 4, 20, 2, U.rgba('#ffffff', 0.15)); break;
      case 'bunny':
        [-1, 1].forEach(s => { ctx.save(); ctx.translate(s * 9, y - 16); ctx.rotate(s * 0.15 + Math.sin(t * 3) * 0.04 * s); U.ell(ctx, 0, -16, 6.5, 17, c1, U.shade(c1, -0.1), 1); U.ell(ctx, 0, -14, 3.5, 12, c2); ctx.restore(); });
        U.fillRR(ctx, -18, y - 18, 36, 5, 3, '#ff7eb6'); break;
      case 'cat':
        [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(s * 18, y - 8); ctx.lineTo(s * 15, y - 30); ctx.lineTo(s * 4, y - 17); ctx.closePath(); ctx.fillStyle = c1; ctx.fill(); ctx.beginPath(); ctx.moveTo(s * 15, y - 12); ctx.lineTo(s * 14, y - 25); ctx.lineTo(s * 8, y - 17); ctx.closePath(); ctx.fillStyle = c2; ctx.fill(); });
        break;
      case 'flowers':
        for (let i = 0; i < 7; i++) { const a = Math.PI * 1.05 + i * Math.PI * 0.9 / 6; const px = Math.cos(a) * 20, py = y - 2 + Math.sin(a) * 15; const col = ['#ff7eb6', '#ffe066', '#8fe3ff', '#c39bff'][i % 4]; for (let k = 0; k < 5; k++) U.circ(ctx, px + Math.cos(k * 1.26) * 3.4, py + Math.sin(k * 1.26) * 3.4, 2.8, col); U.circ(ctx, px, py, 2, '#fff3a0'); }
        break;
      case 'phones':
        ctx.strokeStyle = c2; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, y - 2, 22, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
        if (!back || true) { U.fillRR(ctx, -26, y - 8, 9, 16, 4, c1); U.fillRR(ctx, 17, y - 8, 9, 16, 4, c1); }
        break;
      case 'party':
        ctx.beginPath(); ctx.moveTo(-12, y - 14); ctx.lineTo(0, y - 46); ctx.lineTo(12, y - 14); ctx.closePath(); ctx.fillStyle = c1; ctx.fill();
        ctx.strokeStyle = c2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-8, y - 22); ctx.lineTo(5, y - 32); ctx.moveTo(-4, y - 16); ctx.lineTo(9, y - 24); ctx.stroke();
        U.circ(ctx, 0, y - 47, 4, '#ff7eb6'); break;
      case 'crown':
        ctx.beginPath(); ctx.moveTo(-15, y - 14); ctx.lineTo(-17, y - 34); ctx.lineTo(-8, y - 24); ctx.lineTo(0, y - 38); ctx.lineTo(8, y - 24); ctx.lineTo(17, y - 34); ctx.lineTo(15, y - 14); ctx.closePath();
        ctx.fillStyle = c1; ctx.fill(); ctx.strokeStyle = U.shade(c1, -0.25); ctx.lineWidth = 1.5; ctx.stroke();
        U.circ(ctx, 0, y - 20, 3, c2); U.circ(ctx, -9, y - 18, 2, '#3a7bff'); U.circ(ctx, 9, y - 18, 2, '#3cc98a');
        U.circ(ctx, 0, y - 38, 2.2, '#fff'); break;
      case 'halo':
        ctx.save(); ctx.shadowColor = '#fff6a0'; ctx.shadowBlur = 12; U.ell(ctx, 0, y - 30 + Math.sin(t * 2.5) * 2, 15, 5, null, c1, 4); ctx.restore(); break;
    }
    ctx.restore();
  }
  function drawGlasses(ctx, it, fx) {
    if (!it) return;
    const y = HEAD_Y + 1, c1 = it.c1, c2 = it.c2;
    ctx.save(); ctx.translate(fx, 0);
    switch (it.style) {
      case 'round': [-1, 1].forEach(s => U.circ(ctx, s * 7.5, y, 6, U.rgba(c2, 0.35), c1, 1.8)); ctx.strokeStyle = c1; ctx.beginPath(); ctx.moveTo(-1.5, y); ctx.lineTo(1.5, y); ctx.stroke(); break;
      case 'sun': [-1, 1].forEach(s => { U.fillRR(ctx, s * 7.5 - 6.5, y - 4.5, 13, 9, 4, c1); U.fillRR(ctx, s * 7.5 - 4, y - 3, 4, 2, 1, U.rgba(c2, 0.8)); }); ctx.fillStyle = c1; ctx.fillRect(-2, y - 2, 4, 2); break;
      case 'heart': [-1, 1].forEach(s => U.heart(ctx, s * 7.5, y + 1.5, 8, U.rgba(c1, 0.85))); break;
      case 'star': [-1, 1].forEach(s => U.star(ctx, s * 7.5, y, 8, 4, 5, U.rgba(c2, 0.6), c1)); break;
      case 'cyber': { const g = ctx.createLinearGradient(-16, 0, 16, 0); g.addColorStop(0, c1); g.addColorStop(1, c2); U.fillRR(ctx, -16, y - 4, 32, 8, 3, g); U.fillRR(ctx, -12, y - 2, 24, 2, 1, U.rgba('#ffffff', 0.7)); break; }
    }
    ctx.restore();
  }

  function drawWings(ctx, it, t, front) {
    const flap = Math.sin(t * 4) * 0.12;
    [-1, 1].forEach(s => {
      ctx.save(); ctx.translate(s * 8, -40); ctx.rotate(s * (0.25 + flap));
      if (it.style === 'wings') {
        for (let k = 0; k < 3; k++) { U.ell(ctx, s * (16 + k * 4), -6 + k * 8, 18 - k * 3, 8, k % 2 ? it.c2 : it.c1, U.rgba('#9fb4d8', 0.6), 1); }
      } else {
        U.ell(ctx, s * 18, -10, 17, 13, U.rgba(it.c1, 0.85), U.rgba('#ffffff', 0.9), 1.5);
        U.ell(ctx, s * 14, 10, 11, 9, U.rgba(it.c2, 0.85), U.rgba('#ffffff', 0.9), 1.5);
        U.circ(ctx, s * 20, -12, 4, U.rgba('#ffffff', 0.6));
      }
      ctx.restore();
    });
  }

  function drawShirt(ctx, it, L, dir) {
    const c1 = it ? it.c1 : '#cccccc', c2 = it ? it.c2 : '#fff', st = it ? it.style : 'tee';
    const top = -45, bot = -17;
    if (st === 'dress') {
      ctx.beginPath(); ctx.moveTo(-12, top + 2); ctx.lineTo(12, top + 2); ctx.lineTo(19, -9); ctx.quadraticCurveTo(0, -5, -19, -9); ctx.closePath();
      ctx.fillStyle = c1; ctx.fill();
      ctx.strokeStyle = c2; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-18, -11); ctx.quadraticCurveTo(0, -7, 18, -11); ctx.stroke();
      U.fillRR(ctx, -13, top, 26, 10, 6, c1);
      if (dir !== 'up') U.circ(ctx, 0, top + 12, 2.5, c2);
      return;
    }
    U.fillRR(ctx, -14, top, 28, bot - top + 2, 9, c1);
    ctx.save(); U.rr(ctx, -14, top, 28, bot - top + 2, 9); ctx.clip();
    const front = dir !== 'up';
    switch (st) {
      case 'stripe': ctx.fillStyle = c2; for (let y = top + 4; y < bot; y += 7) ctx.fillRect(-14, y, 28, 3); break;
      case 'hoodie':
        if (front) { U.fillRR(ctx, -9, -27, 18, 8, 3, U.shade(c1, -0.12)); ctx.strokeStyle = c2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-3, top + 3); ctx.lineTo(-3, top + 12); ctx.moveTo(3, top + 3); ctx.lineTo(3, top + 12); ctx.stroke(); }
        else { U.fillRR(ctx, -11, top - 1, 22, 12, 6, U.shade(c1, -0.15)); }
        break;
      case 'star': if (front) U.star(ctx, 0, -31, 8, 3.5, 5, c2); break;
      case 'heart': if (front) U.heart(ctx, 0, -29, 9, c2); break;
      case 'sport': ctx.fillStyle = c2; ctx.fillRect(-14, top, 4, 30); ctx.fillRect(10, top, 4, 30); if (front || true) { ctx.fillStyle = c2; ctx.font = 'bold 11px Rubik, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('7', 0, -26); } break;
      case 'jacket': if (front) { ctx.fillStyle = c2; ctx.fillRect(-4, top, 8, 30); ctx.strokeStyle = U.shade(c1, -0.25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-4, top); ctx.lineTo(-4, bot); ctx.moveTo(4, top); ctx.lineTo(4, bot); ctx.stroke(); } break;
      case 'suit': if (front) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-6, top); ctx.lineTo(0, top + 14); ctx.lineTo(6, top); ctx.fill(); ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(-2, top + 2); ctx.lineTo(2, top + 2); ctx.lineTo(3, top + 14); ctx.lineTo(0, top + 18); ctx.lineTo(-3, top + 14); ctx.closePath(); ctx.fill(); } break;
    }
    // הצללה
    { const sg = ctx.createLinearGradient(-14, 0, 14, 0); sg.addColorStop(0.55, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,0.1)'); ctx.fillStyle = sg; ctx.fillRect(-14, top, 28, 40); }
    ctx.restore();
    if (front && st !== 'hoodie' && st !== 'suit') { ctx.strokeStyle = U.shade(c1, -0.2); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, top, 5, 0.2, Math.PI - 0.2); ctx.stroke(); }
  }
  function drawLegs(ctx, L, swing, dir) {
    const p = IT(L.pants), sh = IT(L.shoes);
    const pc = p ? p.c1 : '#3f63b5', st = p ? p.style : 'pants';
    const skin = L.skin;
    [-1, 1].forEach(s => {
      const off = s * swing;
      const x = s * 6.5, ly = off * 0.35;
      // רגל
      const bare = st === 'shorts' || st === 'skirt';
      U.fillRR(ctx, x - 4.5, -21 + ly, 9, 20, 4, bare ? skin : pc);
      if (st === 'shorts') U.fillRR(ctx, x - 5, -21 + ly, 10, 10, 3, pc);
      if (st === 'cargo') U.fillRR(ctx, x + (s > 0 ? -1 : -4), -14 + ly, 5, 5, 1.5, p.c2);
      if (st === 'sweat') { ctx.fillStyle = p.c2; ctx.fillRect(x + s * 3, -20 + ly, 1.5, 18); }
      if (st === 'jeans') { ctx.strokeStyle = p.c2; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, -18 + ly); ctx.lineTo(x, -3 + ly); ctx.stroke(); }
      // נעל
      const sc = sh ? sh.c1 : '#2d2f3d', sst = sh ? sh.style : 'sneaker';
      const fy = -2 + ly;
      if (sst === 'boot') { U.fillRR(ctx, x - 5.5, fy - 9, 11, 11, 4, sc); U.fillRR(ctx, x - 5.5, fy - 9, 11, 3, 2, sh.c2); }
      else if (sst === 'sandal') { U.ell(ctx, x, fy + 1, 6, 3, sc); ctx.strokeStyle = sh.c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 4, fy - 2); ctx.lineTo(x + 4, fy - 2); ctx.stroke(); }
      else { U.fillRR(ctx, x - 6, fy - 4, 12, 7, 3.5, sc); U.fillRR(ctx, x - 6, fy + 1, 12, 2.5, 1.2, '#ffffff'); if (sh) U.circ(ctx, x, fy - 1.5, 1.4, sh.c2); }
    });
    if (st === 'skirt') { ctx.beginPath(); ctx.moveTo(-13, -22); ctx.lineTo(13, -22); ctx.lineTo(17, -10); ctx.quadraticCurveTo(0, -7, -17, -10); ctx.closePath(); ctx.fillStyle = pc; ctx.fill(); ctx.strokeStyle = p.c2; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  function drawArm(ctx, L, side, swing, raise, shirt, rr) {
    const sc = shirt ? shirt.c1 : '#ccc';
    ctx.save(); ctx.translate(side * 15, -41);
    let ang = swing * 0.05 * side;
    if (raise) ang = side * (-2.4 + Math.sin(raise) * 0.35);
    if (rr != null) ang = -side * rr;
    ctx.rotate(ang);
    const short = shirt && ['tee', 'stripe', 'star', 'heart', 'sport', 'dress'].includes(shirt.style);
    U.fillRR(ctx, -3.8, 0, 7.6, 19, 3.8, L.skin);
    U.fillRR(ctx, -4.2, -1, 8.4, short ? 9 : 17, 4, sc);
    U.circ(ctx, 0, 19, 3.9, L.skin);
    ctx.restore();
  }
  function drawBag(ctx, it, dir) {
    if (!it) return;
    if (dir === 'up') {
      if (it.style === 'backpack') { U.fillRR(ctx, -12, -44, 24, 24, 7, it.c1, U.shade(it.c1, -0.25), 1.5); U.fillRR(ctx, -8, -32, 16, 10, 4, U.shade(it.c1, -0.12)); U.circ(ctx, 0, -40, 2, it.c2); }
      else { U.fillRR(ctx, 8, -26, 13, 11, 3, it.c1); }
    } else {
      if (it.style === 'backpack') { ctx.strokeStyle = U.shade(it.c1, -0.2); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-8, -45); ctx.lineTo(-8, -28); ctx.moveTo(8, -45); ctx.lineTo(8, -28); ctx.stroke(); }
      else { ctx.strokeStyle = U.shade(it.c1, -0.2); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-11, -44); ctx.lineTo(12, -22); ctx.stroke(); U.fillRR(ctx, 9, -26, 13, 12, 3, it.c1); U.circ(ctx, 15.5, -21, 1.8, it.c2); }
    }
  }
  function drawAccFront(ctx, it, dir, t) {
    if (!it) return;
    switch (it.style) {
      case 'scarf': U.fillRR(ctx, -14, -48, 28, 7, 3.5, it.c1); if (dir !== 'up') { U.fillRR(ctx, 4, -45, 6, 14, 3, it.c1); ctx.fillStyle = it.c2; ctx.fillRect(4, -35, 6, 2); } break;
      case 'necklace': if (dir !== 'up') { ctx.strokeStyle = it.c1; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, -46, 8, 0.3, Math.PI - 0.3); ctx.stroke(); U.heart(ctx, 0, -36, 4, it.c2); } break;
      case 'bowtie': if (dir !== 'up') { ctx.fillStyle = it.c1; ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(-7, -48); ctx.lineTo(-7, -40); ctx.closePath(); ctx.moveTo(0, -44); ctx.lineTo(7, -48); ctx.lineTo(7, -40); ctx.closePath(); ctx.fill(); U.circ(ctx, 0, -44, 2, U.shade(it.c1, -0.2)); } break;
      case 'cape': if (dir === 'up') { ctx.beginPath(); ctx.moveTo(-14, -46); ctx.lineTo(14, -46); ctx.lineTo(19, -4 + Math.sin(t * 3) * 2); ctx.lineTo(-19, -4 - Math.sin(t * 3) * 2); ctx.closePath(); ctx.fillStyle = it.c1; ctx.fill(); ctx.strokeStyle = it.c2; ctx.lineWidth = 2; ctx.stroke(); } else { U.fillRR(ctx, -15, -48, 30, 5, 2.5, it.c2); } break;
      case 'wings': case 'fairy': if (dir === 'up') drawWings(ctx, it, t); break;
    }
  }
  function drawAccBack(ctx, it, dir, t) {
    if (!it) return;
    if ((it.style === 'wings' || it.style === 'fairy') && dir !== 'up') drawWings(ctx, it, t);
    if (it.style === 'cape' && dir !== 'up') { ctx.beginPath(); ctx.moveTo(-14, -46); ctx.lineTo(14, -46); ctx.lineTo(20, -5); ctx.lineTo(-20, -5); ctx.closePath(); ctx.fillStyle = U.shade(it.c1, -0.15); ctx.fill(); }
  }
  function drawAura(ctx, it, t) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const a = t * 1.5 + i * Math.PI / 3, r = 24;
      const col = ['#ff7eb6', '#ffde59', '#5fe0b7', '#3cc9ff', '#9b6bff', '#ff8a3d'][i];
      U.circ(ctx, Math.cos(a) * r, -4 + Math.sin(a) * 7 - (Math.sin(t * 3 + i) + 1) * 6, 3, U.rgba(col, 0.75));
    }
    const g = ctx.createRadialGradient(0, -2, 4, 0, -2, 30); g.addColorStop(0, 'rgba(255,126,182,0.35)'); g.addColorStop(1, 'rgba(124,92,255,0)');
    U.ell(ctx, 0, -2, 30, 10, g);
    ctx.restore();
  }

  // ---------- הדמות המלאה ----------
  function draw(ctx, L, x, y, o) {
    o = o || {};
    const t = o.t || 0, s = o.scale || 1; let dir = o.dir || 'down';
    const moving = !!o.moving, emote = o.emote;
    let walk = moving ? (o.walk || 0) : 0;
    let by = moving ? -Math.abs(Math.sin(walk)) * 2.5 : Math.sin(t * 2.2 + (L._seed || 0)) * 0.6;
    let tilt = 0, raise = 0, arms = null, ox = 0;
    const DIRS = ['down', 'right', 'up', 'left'];
    if (emote) {
      const et = emote.t || 0;
      switch (emote.id) {
        case 'dance': arms = [0.4, 2.6 + Math.sin(et * 8) * 0.3]; break;
        case 'd_robot': { const q = Math.floor(et * 3) % 4; arms = [[1.57, 0], [0, 1.57], [1.57, 1.57], [0.3, 0.3]][q]; by -= (q % 2) * 2; break; }
        case 'd_spin': dir = DIRS[Math.floor(et * 8) % 4]; by -= Math.abs(Math.sin(et * 8)) * 3; arms = [1.2, 1.2]; break;
        case 'd_hip': { const k = Math.sin(et * 7); by -= Math.abs(k) * 6; ox = Math.sin(et * 3.5) * 6; arms = k > 0 ? [2.4, 0.4] : [0.4, 2.4]; walk = et * 7; break; }
        case 'd_ballet': by -= 5 + Math.sin(et * 2) * 2; arms = [2.9, 2.9]; dir = DIRS[Math.floor(et * 2) % 4]; tilt = Math.sin(et * 2) * 0.05; break;
        case 'd_wave': arms = [1.57 + Math.sin(et * 5) * 0.6, 1.57 + Math.sin(et * 5 + Math.PI) * 0.6]; tilt = Math.sin(et * 2.5) * 0.1; ox = Math.sin(et * 2.5) * 4; break;
        case 'd_jumpjack': { const ph = (Math.sin(et * 6) + 1) / 2; by -= ph * 14; arms = [0.3 + ph * 2.5, 0.3 + ph * 2.5]; break; }
        case 'd_floss': { const k = Math.sin(et * 8); arms = [1.0 + k * 0.6, 1.0 - k * 0.6]; ox = -k * 4; by -= Math.abs(k) * 2; break; }
      }
      if (emote.id === 'jump') by -= Math.abs(Math.sin(et * 6)) * 16;
      if (emote.id === 'dance') { tilt = Math.sin(et * 8) * 0.12; by -= Math.abs(Math.sin(et * 8)) * 5; walk = et * 8; }
      if (emote.id === 'wave') raise = et * 10;
      if (emote.id === 'laugh') by -= Math.abs(Math.sin(et * 12)) * 2;
      if (emote.id === 'love') by -= Math.abs(Math.sin(et * 4)) * 3;
    }
    const swing = Math.sin(walk) * (moving || (emote && (emote.id === 'dance' || emote.id === 'd_hip')) ? 7 : 0);
    const fx = dir === 'left' ? -5 : dir === 'right' ? 5 : 0;
    const shirt = IT(L.shirt), acc = IT(L.acc);

    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (!o.noShadow) U.shadow(ctx, 0, 1, 17 - Math.min(6, -by * 0.3), 5);
    if (acc && acc.style === 'aura') drawAura(ctx, acc, t);
    ctx.translate(ox, by); ctx.rotate(tilt);

    if (o.sit) { ctx.save(); ctx.scale(1, 0.55); drawLegs(ctx, L, 0, dir); ctx.restore(); ctx.translate(0, 9); }
    drawAccBack(ctx, acc, dir, t);
    if (dir !== 'up') drawHairBack(ctx, L, dir);
    if (!o.sit) drawLegs(ctx, L, swing, dir);
    // זרועות מאחור בהליכה צידית
    drawArm(ctx, L, -1, swing, 0, shirt, arms ? arms[0] : null);
    drawShirt(ctx, shirt, L, dir);
    drawBag(ctx, IT(L.bag), dir);
    drawAccFront(ctx, acc, dir, t);
    drawArm(ctx, L, 1, -swing, raise, shirt, arms ? arms[1] : null);
    if (o.noHead) { ctx.restore(); return; }
    // ראש
    U.circ(ctx, 0, HEAD_Y, HEAD_R, L.skin);
    ctx.save(); ctx.beginPath(); ctx.arc(0, HEAD_Y, HEAD_R, 0, Math.PI * 2); ctx.clip(); U.circ(ctx, 9, HEAD_Y + 6, HEAD_R, 'rgba(0,0,0,0.06)'); ctx.restore();
    if (dir !== 'up') {
      // אוזניים
      if (dir === 'down') { U.circ(ctx, -HEAD_R + 1, HEAD_Y + 2, 4, L.skin); U.circ(ctx, HEAD_R - 1, HEAD_Y + 2, 4, L.skin); }
      U.ell(ctx, fx - 11, HEAD_Y + 7, 4, 2.6, 'rgba(255,110,140,0.35)');
      U.ell(ctx, fx + 11, HEAD_Y + 7, 4, 2.6, 'rgba(255,110,140,0.35)');
      drawEyes(ctx, L, fx, t, emote);
      drawMouth(ctx, fx, emote);
    }
    drawHairFront(ctx, L, dir, fx);
    if (dir !== 'up') drawGlasses(ctx, IT(L.glasses), fx);
    drawHat(ctx, IT(L.hat), dir, fx, t);
    ctx.restore();
  }

  // ---------- חיות מחמד ----------
  function drawPet(ctx, id, x, y, t, dir, scale) {
    const it = IT(id); if (!it) return;
    const c1 = it.c1, c2 = it.c2, s = scale || 1;
    const fly = it.style === 'dragon';
    const hop = fly ? Math.sin(t * 3) * 4 - 22 : -Math.abs(Math.sin(t * 6)) * 2;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (dir === 'right' ? -1 : 1), s);
    U.shadow(ctx, 0, 1, fly ? 9 : 12, 3.5, fly ? 0.12 : 0.2);
    ctx.translate(0, hop);
    const eye = (ex, ey) => { U.circ(ctx, ex, ey, 2.3, '#241a28'); U.circ(ctx, ex + 0.8, ey - 0.8, 0.8, '#fff'); };
    switch (it.style) {
      case 'cat':
        ctx.strokeStyle = c1; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(9, -6); ctx.quadraticCurveTo(18, -10 + Math.sin(t * 4) * 3, 15, -20); ctx.stroke();
        U.ell(ctx, 2, -7, 10, 7, c1); U.circ(ctx, -6, -16, 8.5, c1);
        [-1, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(-6 + k * 7, -19); ctx.lineTo(-6 + k * 6, -28); ctx.lineTo(-6 + k * 1, -22); ctx.fillStyle = c1; ctx.fill(); });
        U.ell(ctx, -6, -13, 4.5, 3, c2); eye(-9, -17); eye(-3, -17); U.circ(ctx, -6, -14, 1.2, '#ff7e9a'); break;
      case 'dog':
        U.ell(ctx, 2, -8, 11, 7.5, c1); U.circ(ctx, -7, -17, 8.5, c1); U.ell(ctx, -13, -15, 3.5, 7, U.shade(c1, -0.25)); U.ell(ctx, -1, -15, 3.5, 7, U.shade(c1, -0.25));
        U.ell(ctx, -7, -13, 4.5, 3.4, c2); eye(-10, -18); eye(-4, -18); U.circ(ctx, -7, -14, 1.8, '#241a28');
        ctx.strokeStyle = c1; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(12, -10); ctx.lineTo(17, -16 + Math.sin(t * 12) * 3); ctx.stroke(); break;
      case 'slime': {
        const sq = 1 + Math.sin(t * 6) * 0.08;
        ctx.save(); ctx.scale(1 / sq, sq); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-13, -20, 0, -20); ctx.quadraticCurveTo(13, -20, 12, 0); ctx.closePath();
        ctx.fillStyle = U.rgba(c1, 0.9); ctx.fill(); U.ell(ctx, -5, -14, 3, 2, U.rgba(c2, 0.9)); ctx.restore(); eye(-4, -9); eye(4, -9); break;
      }
      case 'bunny':
        U.ell(ctx, 2, -7, 10, 7, c1, '#eadde6', 1); U.circ(ctx, -6, -15, 8, c1);
        [-1, 1].forEach(k => { U.ell(ctx, -6 + k * 4, -29, 3, 9, c1, '#eadde6', 1); U.ell(ctx, -6 + k * 4, -28, 1.5, 6, c2); });
        U.circ(ctx, 11, -8, 4, '#fff'); eye(-9, -16); eye(-3, -16); U.circ(ctx, -6, -12, 1.2, '#ff7e9a'); break;
      case 'dragon':
        [-1, 1].forEach(k => { ctx.save(); ctx.translate(2, -12); ctx.rotate(k * (0.5 + Math.sin(t * 8) * 0.4)); U.ell(ctx, 0, -9, 4, 10, U.rgba(c2, 0.9)); ctx.restore(); });
        U.ell(ctx, 2, -8, 10, 8, c1); U.circ(ctx, -8, -16, 8, c1); U.ell(ctx, -13, -13, 4, 3, U.shade(c1, 0.2));
        ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(-10, -23); ctx.lineTo(-12, -30); ctx.lineTo(-7, -24); ctx.fill(); ctx.beginPath(); ctx.moveTo(-5, -23); ctx.lineTo(-3, -30); ctx.lineTo(-2, -22); ctx.fill();
        eye(-9, -18); ctx.strokeStyle = c1; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(11, -6); ctx.quadraticCurveTo(20, -4, 18, -12); ctx.stroke();
        if (Math.sin(t * 1.3) > 0.93) { U.circ(ctx, -20, -13, 3, '#ff8a3d'); U.circ(ctx, -25, -14, 2, '#ffde59'); }
        break;
    }
    ctx.restore();
  }

  // ---------- אייקונים ----------
  const iconCache = {};
  const MANNEQUIN = { skin: '#f7d6bd', hairStyle: 'short', hairColor: '#7a5a48', eyes: 'round', eyeColor: '#3b2a20', shirt: null, pants: null, shoes: null, _seed: 1 };
  function icon(id, size) {
    size = size || 96;
    const key = id + '@' + size; if (iconCache[key]) return iconCache[key];
    const it = IT(id); const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'); const k = size / 96;
    ctx.scale(k, k);
    if (it.cat === 'furn') { G.Furn.icon(ctx, it); }
    else if (it.cat === 'pet') { if (it.style === 'dragon') drawPet(ctx, id, 50, 100, 0.3, 'down', 1.9); else drawPet(ctx, id, 48, 78, 0.3, 'down', 2.3); }
    else {
      const L = Object.assign({}, MANNEQUIN, { shirt: 'tee_purple', pants: 'pants_black', shoes: 'shoes_black' });
      if (['shirt', 'pants', 'shoes'].includes(it.cat)) L[it.cat] = id;
      else L[it.cat] = id;
      const zoom = { hat: [2.0, -60], glasses: [2.6, -61], shirt: [2.2, -30], pants: [2.6, -12], shoes: [3.4, -4], bag: [1.4, -38], acc: [1.25, -40] }[it.cat] || [1.3, -40];
      const dir = it.cat === 'bag' && it.style === 'backpack' ? 'up' : (it.style === 'cape' ? 'up' : 'down');
      ctx.translate(48, 50); ctx.scale(zoom[0], zoom[0]); ctx.translate(0, -zoom[1]);
      draw(ctx, L, 0, 0, { dir, t: 0.5, noShadow: true, noHead: ['shirt', 'pants', 'shoes'].includes(it.cat) });
    }
    const url = c.toDataURL();
    iconCache[key] = url; return url;
  }
  function portrait(L, size, dir) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'); const k = size / 80;
    ctx.scale(k, k); ctx.translate(40, 40); ctx.scale(1.3, 1.3); ctx.translate(0, 70);
    draw(ctx, L, 0, 0, { dir: dir || 'down', t: 0.5, noShadow: true });
    return c.toDataURL();
  }

  return { draw, drawPet, defaultLook, randomLook, icon, portrait };
})();
