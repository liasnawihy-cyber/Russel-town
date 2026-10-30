// Drum di ruang kelas: 打一打 (main bebas), 跟我打 (tiru irama), 打几下 (pukul sesuai jumlah).
// Tiga alat: 大鼓 (drum besar), 小鼓 (drum kecil), 铃铛 (lonceng) — sekaligus belajar 大 dan 小.

PANELS.drum = $('p-drum');
PANELS.drum.addEventListener('pointerdown', e => { if (e.target === PANELS.drum) closePanel(); });
const PADS = [
  { k: 'bigdrum', col: '#e2483d', size: 'big' },
  { k: 'smalldrum', col: '#4f86e0', size: 'small' },
  { k: 'bell', col: '#e8b02a', size: 'bell' },
];
const DR = { mode: 'free', seq: [], pos: 0, busy: false, stars: 0, len: 2, target: 0, need: 0, got: 0, timers: [] };

function drumHit(kind) {
  Snd.init();
  const c = Snd.ctx; if (!c) return;
  if (kind === 0) {
    const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.35);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.connect(g); g.connect(Snd.sfxBus); o.start(t); o.stop(t + 0.5);
    Snd.noise(0.08, { type: 'lowpass', f: 400, gain: 0.4 });
  } else if (kind === 1) {
    Snd.noise(0.18, { type: 'bandpass', f: 1800, q: 0.6, gain: 0.5 });
    Snd.tone(220, 0.12, { to: 160, gain: 0.25, type: 'triangle' });
  } else {
    Snd.tone(1320, 0.7, { gain: 0.12, type: 'triangle' }); Snd.tone(1980, 0.5, { gain: 0.06 });
  }
}
const padEl = i => $('drum-pads').children[i];
function flashPad(i, cls = 'lit', ms = 260) { const el = padEl(i); el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms); }
function drumLater(fn, ms) { DR.timers.push(setTimeout(() => { if (G.panel === 'drum') fn(); }, ms)); }
function clearDrumTimers() { DR.timers.forEach(clearTimeout); DR.timers = []; }

(function buildPads() {
  const box = $('drum-pads');
  PADS.forEach((p, i) => {
    const w = word(p.k), b = document.createElement('button');
    b.type = 'button'; b.className = 'pad pad-' + p.size; b.style.setProperty('--k', p.col);
    b.innerHTML = `<span>${rubyHTML(w.zh, w.py)}</span>`;
    b.setAttribute('aria-label', w.id);
    b.addEventListener('pointerdown', e => { e.preventDefault(); hitPad(i); });
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hitPad(i); } });
    box.appendChild(b);
  });
})();

function drawDrumStars() {
  $('drum-stars').innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="fstar${i < DR.stars ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('drum-stars').setAttribute('aria-label', DR.stars + ' dari 5 bintang');
}
function drumStar(next) {
  DR.busy = true; DR.stars++; drawDrumStars(); sfx('sparkle');
  const fin = DR.stars >= 5;
  say(fin ? [{ k: 'right' }, { k: 'great' }] : [{ k: 'right' }]);
  drumLater(() => { if (fin) { DR.stars = 0; DR.len = 2; drawDrumStars(); } next(); }, fin ? 3200 : 1900);
}

// ---------- 跟节奏: not jatuh ke garis, pukul tepat waktu (lagu 两只老虎 sebagai iringan) ----------
const RH = { notes: [], t0: 0, run: false, score: 0, combo: 0, fb: null, end: 0 };
const RH_LEAD = 2.2, RH_SPB = 60 / 76;
const RH_CHART = (() => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 16.5, 17, 17.5, 18, 19, 20, 20.5, 21, 21.5, 22, 23, 24, 25, 26, 28, 29, 30];
  const tones = [1, 2, 3, 1, 1, 2, 3, 1, 3, 4, 5, 3, 4, 5, 5, 6, 5, 4, 3, 1, 5, 6, 5, 4, 3, 1, 1, 0, 1, 1, 0, 1];
  return beats.map((b, i) => ({ b, n: tones[i], lane: tones[i] <= 1 ? 0 : tones[i] <= 4 ? 1 : 2 }));
})();
const rcv = $('rhythm-cv'), rctx = rcv.getContext('2d');
function rhythmStart() {
  $('rhythm-start').hidden = true;
  RH.notes = RH_CHART.map(c => Object.assign({ t: c.b * RH_SPB, judged: false, played: false, res: null }, c));
  RH.t0 = performance.now() / 1000 + RH_LEAD + 1; RH.score = 0; RH.combo = 0; RH.fb = null;
  RH.end = RH.notes[RH.notes.length - 1].t + 1.6;
  say([{ k: 'start' }]);
  if (!RH.run) { RH.run = true; requestAnimationFrame(rhythmFrame); }
}
function rhythmJudge(n, res) {
  n.judged = true; n.res = res;
  if (res === 'miss') { RH.combo = 0; RH.fb = { k: 'again', col: '#b8bcc8', at: performance.now() }; return; }
  RH.combo++; RH.score += res === 'perfect' ? 2 : 1;
  RH.fb = { k: res, col: res === 'perfect' ? '#ffd84a' : '#8fe07a', at: performance.now() };
}
function laneX(i) {
  const pr = padEl(i).getBoundingClientRect(), cr = rcv.getBoundingClientRect();
  return (pr.left + pr.width / 2 - cr.left) / cr.width * rcv.width;
}
function rhythmFrame() {
  if (G.panel !== 'drum' || DR.mode !== 'rhythm') { RH.run = false; return; }
  const st = performance.now() / 1000 - RH.t0, c = rctx, Wc = rcv.width, Hc = rcv.height, hitY = Hc - 26;
  RH.notes.forEach(n => {
    if (!n.played && st >= n.t) { n.played = true; pianoTone(KEYS[n.n].f); }
    if (!n.judged && st > n.t + 0.32) rhythmJudge(n, 'miss');
  });
  c.fillStyle = '#26304a'; c.fillRect(0, 0, Wc, Hc);
  const xs = [0, 1, 2].map(laneX);
  xs.forEach((x, i) => {
    c.fillStyle = 'rgba(255,255,255,0.06)'; c.fillRect(x - 26, 0, 52, Hc);
    c.lineWidth = 4; c.strokeStyle = PADS[i].col; c.beginPath(); c.arc(x, hitY, 22, 0, Math.PI * 2); c.stroke();
  });
  c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(0, hitY - 1, Wc, 2);
  RH.notes.forEach(n => {
    if (n.res && n.res !== 'miss') return;
    const dtn = n.t - st; if (dtn > RH_LEAD || dtn < -0.4) return;
    const y = hitY - dtn / RH_LEAD * (hitY - 14), x = xs[n.lane];
    c.globalAlpha = n.res === 'miss' ? 0.35 : 1;
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x, y, 19, 0, Math.PI * 2); c.fill();
    c.fillStyle = PADS[n.lane].col; c.beginPath(); c.arc(x, y, 15, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  });
  if (st < 0 && st > -1) { c.fillStyle = '#ffffff'; c.font = 'bold 54px ' + getComputedStyle(document.body).getPropertyValue('--zh'); c.textAlign = 'center'; const cd = Math.ceil(-st * 3); c.fillText((LANG !== 'zh' ? String(cd) : NUM_ZH[cd]) || '', Wc / 2, Hc / 2 + 18); }
  if (RH.fb && performance.now() - RH.fb.at < 700) {
    const w = WORDS[RH.fb.k];
    c.textAlign = 'center'; c.fillStyle = RH.fb.col; c.font = '40px "ZCOOL KuaiLe", sans-serif'; c.fillText(w[0], Wc / 2, 54);
    c.font = 'bold 16px Andika, sans-serif'; c.fillText(w[1] + (RH.combo > 1 ? '   ×' + RH.combo : ''), Wc / 2, 78);
  }
  const done = RH.notes.filter(n => n.judged).length;
  c.fillStyle = '#8fd06a'; c.fillRect(0, 0, Wc * done / RH.notes.length, 5);
  if (st > RH.end) {
    RH.run = false;
    const pct = RH.score / (RH.notes.length * 2);
    DR.stars = Math.max(1, Math.round(pct * 5)); drawDrumStars(); sfx('sparkle');
    say(pct > 0.5 ? [{ k: 'perfect' }, { k: 'great' }] : [{ k: 'good' }, { k: 'again' }]);
    $('rhythm-start').hidden = false;
    return;
  }
  requestAnimationFrame(rhythmFrame);
}
$('rhythm-start').addEventListener('click', () => { Snd.init(); rhythmStart(); });

function hitPad(i) {
  drumHit(i); flashPad(i);
  if (DR.mode === 'rhythm' && RH.run) {
    const st = performance.now() / 1000 - RH.t0;
    let best = null, bd = 0.32;
    RH.notes.forEach(n => { if (!n.judged && n.lane === i && Math.abs(st - n.t) < bd) { bd = Math.abs(st - n.t); best = n; } });
    if (best) rhythmJudge(best, bd < 0.15 ? 'perfect' : 'good');
    return;
  }
  if (DR.mode === 'follow' && !DR.busy) {
    if (i === DR.seq[DR.pos]) { DR.pos++; if (DR.pos === DR.seq.length) { DR.len = Math.min(6, DR.len + 1); drumStar(newRhythm); } }
    else { DR.busy = true; say([{ k: 'listenagain' }]); drumLater(playRhythm, 1600); }
  }
  if (DR.mode === 'count' && !DR.busy) {
    if (i !== DR.target) { say([{ k: PADS[DR.target].k }]); return; }
    DR.got++;
    say([{ k: 'n' + DR.got }]);
    if (DR.got === DR.need) { DR.busy = true; drumLater(() => drumStar(newCount), 700); }
  }
}

// 跟我打: dengarkan irama lalu tiru
function newRhythm() { DR.seq = Array.from({ length: DR.len }, () => Math.floor(Math.random() * 3)); playRhythm(); }
function playRhythm() {
  clearDrumTimers(); DR.busy = true; DR.pos = 0;
  DR.seq.forEach((n, k) => drumLater(() => { drumHit(n); flashPad(n, 'show', 380); }, 500 + k * 560));
  drumLater(() => { DR.busy = false; say([{ k: 'yourturn' }]); }, 500 + DR.seq.length * 560);
}
// 打几下: "打三下大鼓" → pukul drum besar tiga kali
function newCount() {
  DR.busy = false; DR.got = 0; DR.need = 1 + Math.floor(Math.random() * 5); DR.target = Math.floor(Math.random() * 3);
  const w = WORDS[PADS[DR.target].k], n = DR.need;
  const nz = n === 2 ? '两' : NUM_ZH[n], np = n === 2 ? 'liǎng' : NUM_PY[n];
  const times = n === 1 ? 'once' : n === 2 ? 'twice' : NUM_EN[n] + ' times';
  const jw = WORDS_JA[PADS[DR.target].k];
  say([{ card: langCard('打' + nz + '下' + w[0], 'dǎ ' + np + ' xià ' + w[1], 'pukul ' + w[2] + ' ' + NUM_ID[n] + ' kali', 'Hit the ' + WORDS_EN[PADS[DR.target].k] + ' ' + times,
    [jw[0] + 'を ' + TIMES_JA[n][0] + ' たたこう', jw[1] + ' o ' + TIMES_JA[n][1] + ' tatakō']) }]);
}

function drumMode(m) {
  DR.mode = m; clearDrumTimers(); DR.busy = false;
  document.querySelectorAll('#p-drum [data-dmode]').forEach(b => b.setAttribute('aria-selected', b.dataset.dmode === m ? 'true' : 'false'));
  $('drum-stars').hidden = m === 'free';
  $('rhythm').hidden = m !== 'rhythm';
  PANELS.drum.classList.toggle('rhythm-on', m === 'rhythm');
  RH.run = false; $('rhythm-start').hidden = false;
  if (m !== 'free') { DR.stars = 0; DR.len = 2; drawDrumStars(); }
  if (m === 'free') say([{ k: 'playdrum' }]);
  if (m === 'rhythm') {
    say([{ k: 'followrhythm' }]);
    const c = rctx; c.fillStyle = '#26304a'; c.fillRect(0, 0, rcv.width, rcv.height);
  }
  if (m === 'follow') { say([{ k: 'followdrum' }]); drumLater(newRhythm, 1300); }
  if (m === 'count') { DR.busy = true; say([{ k: 'hits' }]); drumLater(newCount, 1300); }
}
function drumOpen() { drumMode(DR.mode); }
document.querySelectorAll('#p-drum [data-dmode]').forEach(b => b.addEventListener('click', () => { sfx('tap'); drumMode(b.dataset.dmode); }));
