// ===== פופילנד – מוזיקה ואפקטים (WebAudio, ללא קבצים חיצוניים) =====
G.Audio = {
  ctx: null, master: null, musicGain: null, sfxGain: null,
  musicOn: true, sfxOn: true, mood: 'plaza', playing: false, nextT: 0, step: 0, timer: null,

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => { }); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.8; this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = this.musicOn ? 0.22 : 0; this.musicGain.connect(this.master);
      this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = this.sfxOn ? 0.5 : 0; this.sfxGain.connect(this.master);
      this.startMusic();
    } catch (e) { this.ctx = null; }
  },
  setMusic(on) { this.musicOn = on; if (this.musicGain) this.musicGain.gain.setTargetAtTime(on ? 0.22 : 0, this.ctx.currentTime, 0.1); },
  setSfx(on) { this.sfxOn = on; if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(on ? 0.5 : 0, this.ctx.currentTime, 0.05); },
  setMood(m) { this.mood = m; },

  MOODS: {
    plaza: { bpm: 104, prog: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]], scale: [72, 74, 76, 79, 81, 84], lead: 'triangle', drums: 1 },
    park: { bpm: 92, prog: [[53, 57, 60], [55, 59, 62], [60, 64, 67], [57, 60, 64]], scale: [72, 74, 77, 79, 81], lead: 'sine', drums: 0 },
    beach: { bpm: 112, prog: [[57, 61, 64], [62, 66, 69], [64, 68, 71], [62, 66, 69]], scale: [69, 71, 73, 76, 78, 81], lead: 'triangle', drums: 1 },
    indoor: { bpm: 96, prog: [[62, 65, 69], [60, 64, 67], [58, 62, 65], [57, 61, 64]], scale: [74, 76, 77, 81, 84], lead: 'sine', drums: 1 },
    party: { bpm: 124, prog: [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]], scale: [69, 72, 74, 76, 79, 81], lead: 'square', drums: 2 },
    home: { bpm: 84, prog: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], scale: [72, 74, 76, 79], lead: 'sine', drums: 0 },
  },
  freq: (m) => 440 * Math.pow(2, (m - 69) / 12),

  startMusic() {
    if (!this.ctx || this.timer) return;
    this.nextT = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 60);
  },
  schedule() {
    const c = this.ctx; if (!c || c.state !== 'running') return;
    const M = this.MOODS[this.mood] || this.MOODS.plaza;
    const s16 = 60 / M.bpm / 4;
    while (this.nextT < c.currentTime + 0.25) {
      const st = this.step, t = this.nextT;
      const bar = Math.floor(st / 16) % 4, chord = M.prog[bar];
      if (st % 16 === 0) chord.forEach(n => this.note(n, t, s16 * 15, 'triangle', 0.045, this.musicGain, 0.3));
      if (st % 4 === 0) this.note(chord[0] - 24, t, s16 * 3, 'sine', 0.16, this.musicGain, 0.01);
      if (st % 8 === 6 && M.drums) this.note(chord[0] - 12, t, s16 * 1.5, 'sine', 0.08, this.musicGain, 0.01);
      if (st % 2 === 0 && Math.random() < 0.55) {
        const opts = M.scale.filter(n => chord.some(cn => (n - cn) % 12 === 0) || Math.random() < 0.4);
        const n = opts[Math.floor(Math.random() * opts.length)] || M.scale[0];
        this.note(n, t, s16 * (Math.random() < 0.3 ? 3 : 1.6), M.lead, M.lead === 'square' ? 0.025 : 0.05, this.musicGain, 0.01);
      }
      if (M.drums === 2 && st % 4 === 0) this.kick(t);
      if (M.drums && st % 4 === 2) this.hat(t, M.drums === 2 ? 0.05 : 0.025);
      this.step++; this.nextT += s16;
    }
  },
  note(m, t, dur, type, vol, dest, att) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = this.freq(m);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (att || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.sfxGain); o.start(t); o.stop(t + dur + 0.05);
  },
  kick(t) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g); g.connect(this.musicGain); o.start(t); o.stop(t + 0.25);
  },
  hat(t, v) {
    const c = this.ctx; if (!this.noiseBuf) { const b = c.createBuffer(1, c.sampleRate * 0.1, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noiseBuf = b; }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(this.musicGain); s.start(t); s.stop(t + 0.06);
  },

  sfx(name) {
    const c = this.ctx; if (!c || !this.sfxOn) return;
    const t = c.currentTime;
    const seq = (notes, type, gap, vol, dur) => notes.forEach((n, i) => this.note(n, t + i * gap, dur || gap * 1.8, type, vol || 0.2));
    switch (name) {
      case 'coin': seq([88, 95], 'square', 0.06, 0.08); break;
      case 'coins': seq([84, 88, 91, 96], 'square', 0.05, 0.07); break;
      case 'buy': seq([72, 76, 79, 84, 88], 'triangle', 0.06, 0.2); break;
      case 'click': this.note(84, t, 0.05, 'sine', 0.12); break;
      case 'open': seq([72, 79], 'sine', 0.05, 0.12); break;
      case 'close': seq([79, 72], 'sine', 0.05, 0.1); break;
      case 'error': seq([52, 48], 'square', 0.09, 0.07); break;
      case 'levelup': seq([72, 76, 79, 84, 79, 84, 88], 'triangle', 0.09, 0.22, 0.25); break;
      case 'jump': { const o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.12); g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15); o.connect(g); g.connect(this.sfxGain); o.start(t); o.stop(t + 0.16); break; }
      case 'pop': seq([91], 'sine', 0.04, 0.2, 0.08); break;
      case 'hit': seq([45, 40], 'sawtooth', 0.07, 0.1); break;
      case 'whoosh': seq([60, 67, 72], 'sine', 0.04, 0.08); break;
      case 'msg': seq([81, 86], 'sine', 0.07, 0.1); break;
      case 'good': seq([79, 84], 'triangle', 0.07, 0.18); break;
      case 'bad': seq([55, 51], 'triangle', 0.1, 0.15); break;
      case 'flip': this.note(76, t, 0.06, 'triangle', 0.1); break;
    }
  },
};
