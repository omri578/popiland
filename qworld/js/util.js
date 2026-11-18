// ===== קיו וורלד – כלי עזר כלליים =====
window.G = window.G || {};

G.U = {
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  dist: (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by),
  rand: (a, b) => a + Math.random() * (b - a),
  randi: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; },
  rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 100000) / 100000; }; },
  today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); },
  week() { const d = new Date(); const start = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + 'w' + Math.floor(((d - start) / 86400000 + start.getDay()) / 7); },
  fmt: (n) => Math.floor(n).toLocaleString('he-IL'),
  esc: (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  uid: () => Math.random().toString(36).slice(2, 10),

  shade(hex, amt) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    if (amt > 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
    else { r *= 1 + amt; g *= 1 + amt; b *= 1 + amt; }
    const h = v => ('0' + Math.round(G.U.clamp(v, 0, 255)).toString(16)).slice(-2);
    return '#' + h(r) + h(g) + h(b);
  },
  rgba(hex, a) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    return `rgba(${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)},${a})`;
  },

  // ציור
  rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  },
  fillRR(ctx, x, y, w, h, r, fill, stroke, lw) {
    G.U.rr(ctx, x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); }
  },
  ell(ctx, x, y, rx, ry, fill, stroke, lw) {
    ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); }
  },
  circ(ctx, x, y, r, fill, stroke, lw) { G.U.ell(ctx, x, y, r, r, fill, stroke, lw); },
  star(ctx, x, y, r1, r2, n, fill, stroke) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? r2 : r1, a = -Math.PI / 2 + i * Math.PI / n;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  },
  heart(ctx, x, y, s, fill) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.45, y - s, x, y - s * 0.45);
    ctx.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
    ctx.fillStyle = fill; ctx.fill();
  },
  shadow(ctx, x, y, rx, ry, a) { G.U.ell(ctx, x, y, rx, ry, `rgba(20,10,40,${a == null ? 0.22 : a})`); },
  vgrad(ctx, y0, y1, c0, c1) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; },

  el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; },
  $(sel, root) { return (root || document).querySelector(sel); },
  $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); },
};

// מערכת אירועים פשוטה
G.bus = {
  h: {},
  on(ev, fn) { (this.h[ev] = this.h[ev] || []).push(fn); },
  emit(ev, ...a) { (this.h[ev] || []).forEach(f => { try { f(...a); } catch (e) { console.error(e); } }); },
};
