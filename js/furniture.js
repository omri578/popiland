// ===== פופילנד – רהיטים =====
G.Furn = (() => {
  const U = G.U;
  // w = רוחב, d = עומק בסיס (להתנגשות), h = גובה (לבחירה)
  const SIZE = {
    sofa: { w: 120, d: 40, h: 70 }, armchair: { w: 64, d: 36, h: 66 }, bed: { w: 92, d: 70, h: 80 }, table: { w: 74, d: 30, h: 50 },
    chair: { w: 36, d: 20, h: 58 }, desk: { w: 100, d: 30, h: 80 }, lamp: { w: 30, d: 14, h: 110 }, plant: { w: 34, d: 16, h: 48 },
    bigplant: { w: 60, d: 22, h: 100 }, tv: { w: 100, d: 26, h: 86 }, rug: { w: 150, d: 70, h: 70, flat: 1 }, rugrect: { w: 170, d: 90, h: 90, flat: 1 },
    rugrainbow: { w: 180, d: 90, h: 90, flat: 1 }, bookshelf: { w: 84, d: 26, h: 120 }, aquarium: { w: 110, d: 32, h: 90 }, piano: { w: 110, d: 34, h: 90 },
    fireplace: { w: 110, d: 26, h: 100 }, beanbag: { w: 56, d: 30, h: 40 }, easel: { w: 50, d: 18, h: 96 }, throne: { w: 76, d: 36, h: 120 },
    statue: { w: 54, d: 30, h: 120 }, jukebox: { w: 62, d: 28, h: 104 }, arcade: { w: 60, d: 30, h: 116 },
  };

  function draw(ctx, it, x, y, t, flip) {
    const c1 = it.c1, c2 = it.c2, st = it.style, dk = U.shade(c1, -0.22), lt = U.shade(c1, 0.25);
    ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
    const sz = SIZE[st] || { w: 40, d: 20 };
    if (!sz.flat) U.shadow(ctx, 0, 0, sz.w * 0.52, Math.max(6, sz.d * 0.35), 0.18);
    switch (st) {
      case 'sofa':
        U.fillRR(ctx, -58, -66, 116, 40, 14, dk); U.fillRR(ctx, -54, -40, 108, 30, 10, c1);
        U.fillRR(ctx, -50, -62, 46, 28, 10, lt); U.fillRR(ctx, 4, -62, 46, 28, 10, lt);
        U.fillRR(ctx, -64, -50, 16, 44, 8, dk); U.fillRR(ctx, 48, -50, 16, 44, 8, dk);
        U.fillRR(ctx, -12, -58, 24, 18, 6, c2); break;
      case 'armchair':
        U.fillRR(ctx, -28, -64, 56, 38, 14, dk); U.fillRR(ctx, -26, -38, 52, 28, 9, c1); U.fillRR(ctx, -34, -46, 13, 40, 6, dk); U.fillRR(ctx, 21, -46, 13, 40, 6, dk); U.fillRR(ctx, -10, -56, 20, 16, 5, c2); break;
      case 'bed':
        U.fillRR(ctx, -46, -78, 92, 28, 8, U.shade('#a8703d', -0.1)); U.fillRR(ctx, -44, -58, 88, 56, 8, '#ffffff');
        U.fillRR(ctx, -36, -56, 72, 16, 7, c2, '#e2e2ec', 1.5); U.fillRR(ctx, -44, -38, 88, 36, 8, c1);
        ctx.fillStyle = lt; ctx.fillRect(-44, -38, 88, 5); break;
      case 'table':
        U.fillRR(ctx, -5, -38, 10, 36, 3, c2); U.ell(ctx, 0, -3, 18, 5, c2); U.ell(ctx, 0, -42, 37, 13, dk); U.ell(ctx, 0, -46, 37, 13, c1); U.ell(ctx, -8, -49, 14, 4, U.rgba('#ffffff', 0.25)); break;
      case 'chair':
        U.fillRR(ctx, -15, -58, 30, 30, 6, dk); U.fillRR(ctx, -16, -30, 32, 9, 4, c1); ctx.fillStyle = c2; ctx.fillRect(-14, -22, 4, 22); ctx.fillRect(10, -22, 4, 22); break;
      case 'desk':
        U.fillRR(ctx, -50, -46, 100, 10, 4, c1); ctx.fillStyle = U.shade(c1, -0.2); ctx.fillRect(-46, -36, 6, 36); ctx.fillRect(40, -36, 6, 36); U.fillRR(ctx, 10, -36, 30, 24, 3, U.shade(c1, -0.08));
        U.fillRR(ctx, -24, -82, 48, 34, 4, '#23232f'); U.fillRR(ctx, -21, -79, 42, 27, 2, c2);
        ctx.fillStyle = U.rgba('#ffffff', 0.5); for (let i = 0; i < 3; i++) ctx.fillRect(-17, -75 + i * 7, 18 + ((t * 20 + i * 9) % 14), 3);
        ctx.fillStyle = '#23232f'; ctx.fillRect(-3, -48, 6, 4); U.fillRR(ctx, -20, -50, 30, 4, 2, '#d9d9e3'); break;
      case 'lamp':
        U.ell(ctx, 0, -2, 12, 4, c2); ctx.fillStyle = c2; ctx.fillRect(-2, -88, 4, 86);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -88, 2, 0, -88, 60); g.addColorStop(0, U.rgba(c1, 0.35)); g.addColorStop(1, U.rgba(c1, 0)); U.circ(ctx, 0, -88, 60, g); ctx.restore();
        ctx.beginPath(); ctx.moveTo(-10, -108); ctx.lineTo(10, -108); ctx.lineTo(17, -84); ctx.lineTo(-17, -84); ctx.closePath(); ctx.fillStyle = c1; ctx.fill(); break;
      case 'plant':
        for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.45 + Math.sin(t * 1.5 + i) * 0.04; ctx.save(); ctx.translate(0, -22); ctx.rotate(a + Math.PI / 2); U.ell(ctx, 0, -14, 5, 13, i % 2 ? it.c1 : U.shade(it.c1, -0.15)); ctx.restore(); }
        ctx.beginPath(); ctx.moveTo(-14, -24); ctx.lineTo(14, -24); ctx.lineTo(10, 0); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fillStyle = c2; ctx.fill(); U.fillRR(ctx, -15, -27, 30, 6, 3, U.shade(c2, -0.12)); break;
      case 'bigplant':
        for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.35 + Math.sin(t + i) * 0.03; ctx.save(); ctx.translate(0, -34); ctx.rotate(a + Math.PI / 2); ctx.strokeStyle = U.shade(c1, -0.3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -30 - (i % 3) * 8); ctx.stroke(); U.ell(ctx, 0, -38 - (i % 3) * 8, 14, 11, i % 2 ? c1 : U.shade(c1, 0.15)); ctx.restore(); }
        U.fillRR(ctx, -20, -36, 40, 36, 8, c2, '#d4d0c8', 1.5); break;
      case 'tv':
        U.fillRR(ctx, -46, -30, 92, 28, 5, '#6d4a2f'); U.fillRR(ctx, -42, -26, 40, 20, 3, '#5a3d27'); U.fillRR(ctx, 2, -26, 40, 20, 3, '#5a3d27');
        U.fillRR(ctx, -48, -88, 96, 58, 5, c1); { const g = ctx.createLinearGradient(-44, -84, 44, -36); const h = (t * 40) % 360; g.addColorStop(0, `hsl(${h},80%,60%)`); g.addColorStop(1, `hsl(${(h + 120) % 360},80%,55%)`); U.fillRR(ctx, -44, -84, 88, 50, 3, g); }
        U.circ(ctx, -10 + Math.sin(t * 2) * 20, -60, 8, U.rgba('#ffffff', 0.5)); break;
      case 'rug': U.ell(ctx, 0, -35, 75, 35, c1); U.ell(ctx, 0, -35, 58, 26, null, c2, 5); U.ell(ctx, 0, -35, 30, 13, c2); break;
      case 'rugrect': U.fillRR(ctx, -85, -90, 170, 90, 10, c1); U.fillRR(ctx, -72, -78, 144, 66, 6, null, c2, 4); for (let i = -2; i <= 2; i++) U.star(ctx, i * 26, -45, 7, 3, 4, U.rgba('#ffffff', 0.6)); break;
      case 'rugrainbow': { const cols = ['#ff5d6c', '#ff9a3d', '#ffde59', '#5fe0b7', '#3cc9ff', '#9b6bff']; for (let i = 0; i < 6; i++) U.ell(ctx, 0, -45, 90 - i * 14, 45 - i * 7, cols[i]); break; }
      case 'bookshelf':
        U.fillRR(ctx, -42, -120, 84, 120, 5, c1); U.fillRR(ctx, -36, -114, 72, 108, 3, dk);
        for (let r = 0; r < 4; r++) { let bx = -34; let k = 0; while (bx < 30) { const bw = 6 + ((r * 7 + k * 3) % 5); const bh = 18 + ((r + k) % 3) * 3; ctx.fillStyle = ['#ff5d6c', '#3a7bff', '#ffde59', '#3cc98a', '#9b6bff', '#ff9a3d'][(r * 2 + k) % 6]; ctx.fillRect(bx, -88 + r * 27 - bh + 0, bw, bh); bx += bw + 1; k++; } ctx.fillStyle = c1; ctx.fillRect(-36, -88 + r * 27, 72, 4); }
        break;
      case 'aquarium':
        U.fillRR(ctx, -54, -36, 108, 34, 4, c2); U.fillRR(ctx, -54, -92, 108, 58, 6, U.rgba(c1, 0.75), '#cfefff', 2);
        U.fillRR(ctx, -50, -46, 100, 10, 3, '#f1d79a');
        for (let i = 0; i < 4; i++) { const fx = ((t * (20 + i * 7) + i * 40) % 110) - 55; const fy = -80 + i * 9 + Math.sin(t * 2 + i) * 3; const dirn = Math.floor((t * (20 + i * 7) + i * 40) / 110) % 2 ? -1 : 1; ctx.save(); ctx.translate(dirn > 0 ? fx : -fx, fy); ctx.scale(dirn, 1); U.ell(ctx, 0, 0, 6, 3.5, ['#ff9a3d', '#ffde59', '#ff7eb6', '#ff5d6c'][i]); ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-10, -4); ctx.lineTo(-10, 4); ctx.fill(); ctx.restore(); }
        for (let i = 0; i < 3; i++) U.circ(ctx, -30 + i * 25, -50 - ((t * 25 + i * 15) % 40), 2, U.rgba('#ffffff', 0.6));
        ctx.strokeStyle = '#3cc98a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(35, -46); ctx.quadraticCurveTo(40 + Math.sin(t * 2) * 4, -62, 34, -76); ctx.stroke(); break;
      case 'piano':
        U.fillRR(ctx, -55, -90, 110, 70, 6, c1); U.fillRR(ctx, -55, -42, 110, 14, 3, U.shade(c1, 0.1));
        for (let i = 0; i < 14; i++) { ctx.fillStyle = '#ffffff'; ctx.fillRect(-52 + i * 7.4, -40, 6.6, 10); }
        for (let i = 0; i < 13; i++) if (i % 7 !== 2 && i % 7 !== 6) { ctx.fillStyle = '#15151f'; ctx.fillRect(-47 + i * 7.4, -40, 4, 6); }
        ctx.fillStyle = c1; ctx.fillRect(-50, -28, 6, 28); ctx.fillRect(44, -28, 6, 28); U.fillRR(ctx, -20, -80, 40, 18, 3, '#f7f0dc'); break;
      case 'fireplace':
        U.fillRR(ctx, -55, -100, 110, 100, 6, c1); ctx.fillStyle = U.shade(c1, -0.1); for (let r = 0; r < 6; r++) for (let k = 0; k < 5; k++) ctx.fillRect(-52 + k * 22 + (r % 2) * 11, -96 + r * 16, 20, 14);
        U.fillRR(ctx, -62, -104, 124, 12, 4, '#f2efe9'); U.fillRR(ctx, -32, -60, 64, 58, 30, '#2a1a14');
        for (let i = 0; i < 5; i++) { const fh = 22 + Math.sin(t * 9 + i * 1.7) * 7; ctx.beginPath(); ctx.moveTo(-20 + i * 10 - 7, -8); ctx.quadraticCurveTo(-20 + i * 10, -8 - fh * 1.6, -20 + i * 10 + 7, -8); ctx.fillStyle = i % 2 ? '#ff9a3d' : '#ffde59'; ctx.fill(); }
        U.fillRR(ctx, -26, -10, 52, 7, 3, '#7a4a2c'); break;
      case 'beanbag': U.ell(ctx, 0, -16, 28, 18, c1); U.ell(ctx, -4, -22, 16, 9, c2); break;
      case 'easel':
        ctx.strokeStyle = c1; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(0, -94); ctx.lineTo(18, 0); ctx.moveTo(0, -94); ctx.lineTo(0, -10); ctx.stroke();
        U.fillRR(ctx, -24, -84, 48, 44, 2, '#ffffff', c1, 3); U.circ(ctx, -8, -66, 8, '#ffde59'); ctx.fillStyle = '#3cc98a'; ctx.beginPath(); ctx.moveTo(-22, -42); ctx.lineTo(-4, -62); ctx.lineTo(10, -48); ctx.lineTo(22, -58); ctx.lineTo(22, -42); ctx.fill(); U.fillRR(ctx, -24, -40, 48, 4, 2, c1); break;
      case 'throne':
        U.fillRR(ctx, -32, -120, 64, 90, 18, c1, U.shade(c1, -0.25), 2); U.fillRR(ctx, -24, -110, 48, 72, 14, c2);
        U.star(ctx, 0, -124, 10, 5, 5, c1); U.fillRR(ctx, -38, -48, 76, 20, 6, c1); U.fillRR(ctx, -32, -42, 64, 12, 5, U.shade(c2, 0.15));
        U.fillRR(ctx, -40, -62, 12, 40, 5, U.shade(c1, -0.1)); U.fillRR(ctx, 28, -62, 12, 40, 5, U.shade(c1, -0.1)); ctx.fillStyle = U.shade(c1, -0.2); ctx.fillRect(-34, -28, 8, 28); ctx.fillRect(26, -28, 8, 28); break;
      case 'statue':
        U.fillRR(ctx, -26, -30, 52, 30, 4, '#e9e4f2'); U.fillRR(ctx, -30, -34, 60, 8, 3, '#f7f4fb');
        ctx.save(); ctx.shadowColor = c2; ctx.shadowBlur = 16; U.star(ctx, 0, -78, 36, 16, 5, c1, U.shade(c1, -0.25)); ctx.restore(); U.star(ctx, -6, -84, 10, 5, 5, U.rgba('#ffffff', 0.5));
        if (Math.sin(t * 3) > 0.6) U.star(ctx, 22, -100, 5, 2, 4, '#ffffff'); break;
      case 'jukebox': {
        U.fillRR(ctx, -30, -104, 60, 104, 28, c1); U.fillRR(ctx, -24, -96, 48, 46, 22, '#2b1d3a');
        for (let i = 0; i < 5; i++) { const h = (t * 120 + i * 60) % 360; ctx.fillStyle = `hsl(${h},90%,65%)`; ctx.fillRect(-18 + i * 8, -60 - Math.abs(Math.sin(t * 6 + i)) * 26, 5, Math.abs(Math.sin(t * 6 + i)) * 26 + 4); }
        U.fillRR(ctx, -22, -46, 44, 30, 4, c2); for (let i = 0; i < 4; i++) U.circ(ctx, -12 + i * 8, -32, 2.5, '#ff4d7a'); break;
      }
      case 'arcade':
        U.fillRR(ctx, -30, -116, 60, 116, 6, c1); U.fillRR(ctx, -30, -116, 60, 18, 5, U.shade(c1, 0.15));
        ctx.fillStyle = c2; ctx.font = 'bold 9px Rubik'; ctx.textAlign = 'center'; ctx.fillText('ARCADE', 0, -103);
        U.fillRR(ctx, -24, -94, 48, 40, 4, '#0b0b18'); for (let i = 0; i < 3; i++) U.circ(ctx, -12 + ((t * 30 + i * 16) % 36), -82 + i * 11, 3, ['#ffde59', '#ff4d7a', '#5fe0b7'][i]);
        U.fillRR(ctx, -28, -52, 56, 14, 3, U.shade(c1, -0.2)); U.circ(ctx, -12, -46, 4, '#ff4d7a'); U.circ(ctx, 6, -46, 3.5, '#ffde59'); U.circ(ctx, 16, -46, 3.5, '#5fe0b7'); break;
    }
    ctx.restore();
  }
  function icon(ctx, it) {
    const sz = SIZE[it.style] || { w: 60, h: 60 };
    const k = Math.min(80 / sz.w, 76 / (sz.h + 10), 1.4);
    ctx.save(); ctx.translate(48, 48 + (sz.flat ? sz.d * k * 0.5 : sz.h * k * 0.5)); ctx.scale(k, k);
    draw(ctx, it, 0, 0, 0.6, false);
    ctx.restore();
  }
  return { draw, icon, SIZE };
})();
