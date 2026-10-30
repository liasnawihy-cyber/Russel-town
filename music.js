// Piano di ruang kelas: 弹一弹 (main bebas), 跟我弹 (tiru nada), 唱歌 (lagu 两只老虎).
// Tuts diberi angka not ala Tiongkok (简谱): 1 = do, 2 = re, ...; titik di bawah = nada rendah, di atas = nada tinggi.

PANELS.piano = $('p-piano');
PANELS.piano.addEventListener('pointerdown', e => { if (e.target === PANELS.piano) closePanel(); });
const KEYS = [
  { n: '5', low: 1, f: 196.00, col: '#9b6bd6', s: 'sol' },
  { n: '1', f: 261.63, col: '#e2483d', s: 'do' },
  { n: '2', f: 293.66, col: '#f08a32', s: 're' },
  { n: '3', f: 329.63, col: '#e8b02a', s: 'mi' },
  { n: '4', f: 349.23, col: '#58a84a', s: 'fa' },
  { n: '5', f: 392.00, col: '#3fa0b8', s: 'sol' },
  { n: '6', f: 440.00, col: '#4f86e0', s: 'la' },
  { n: '7', f: 493.88, col: '#8f62c9', s: 'si' },
  { n: '1', high: 1, f: 523.25, col: '#e2483d', s: 'do' },
];
// Lagu rakyat 两只老虎: satu suku kata = satu nada (indeks KEYS).
// Mode English memakai lagu rakyat dengan nada yang sama, "Are You Sleeping" (en: suku kata dipisah spasi/tanda hubung).
const SONG_EN = [
  { en: 'Are you sleep-ing', id: 'apakah kamu tidur' }, { en: 'Are you sleep-ing', id: 'apakah kamu tidur' },
  { en: 'Bro-ther John', id: 'Kak John' }, { en: 'Bro-ther John', id: 'Kak John' },
  { en: 'Morn-ing bells are ring-ing', id: 'lonceng pagi berbunyi' }, { en: 'Morn-ing bells are ring-ing', id: 'lonceng pagi berbunyi' },
  { en: 'Ding, dang, dong', id: 'ding dang dong' }, { en: 'Ding, dang, dong', id: 'ding dang dong' },
];
// Mode Jepang: lirik buatan sendiri dengan nada yang sama; satu kana = satu nada (sy = romaji per kana)
const SONG_JA = [
  { zh: 'いぬさん', py: 'inu-san', sy: 'i nu sa n', id: 'anjing' }, { zh: 'ねこさん', py: 'neko-san', sy: 'ne ko sa n', id: 'kucing' },
  { zh: 'あそぼ', py: 'asobo', sy: 'a so bo', id: 'ayo main' }, { zh: 'あそぼ', py: 'asobo', sy: 'a so bo', id: 'ayo main' },
  { zh: 'あかいおはな', py: 'akai ohana', sy: 'a ka i o ha na', id: 'bunga merah' }, { zh: 'あおいおはな', py: 'aoi ohana', sy: 'a o i o ha na', id: 'bunga biru' },
  { zh: 'きれい', py: 'kirei', sy: 'ki re i', id: 'cantik' }, { zh: 'きれい', py: 'kirei', sy: 'ki re i', id: 'cantik' },
];
const SONG = [
  { zh: '两只老虎', py: 'liǎng zhī lǎo hǔ', id: 'dua ekor harimau', n: [1, 2, 3, 1] },
  { zh: '两只老虎', py: 'liǎng zhī lǎo hǔ', id: 'dua ekor harimau', n: [1, 2, 3, 1] },
  { zh: '跑得快', py: 'pǎo de kuài', id: 'larinya cepat', n: [3, 4, 5] },
  { zh: '跑得快', py: 'pǎo de kuài', id: 'larinya cepat', n: [3, 4, 5] },
  { zh: '一只没有眼睛', py: 'yì zhī méi yǒu yǎn jing', id: 'seekor tidak punya mata', n: [5, 6, 5, 4, 3, 1] },
  { zh: '一只没有尾巴', py: 'yì zhī méi yǒu wěi ba', id: 'seekor tidak punya ekor', n: [5, 6, 5, 4, 3, 1] },
  { zh: '真奇怪', py: 'zhēn qí guài', id: 'aneh sekali', n: [1, 0, 1] },
  { zh: '真奇怪', py: 'zhēn qí guài', id: 'aneh sekali', n: [1, 0, 1] },
].map((l, i) => LANG === 'en' ? { zh: SONG_EN[i].en.replace(/-/g, ''), py: '', id: SONG_EN[i].id, n: l.n, syl: SONG_EN[i].en.match(/[^ -]+[ -]?/g) }
  : LANG === 'ja' ? Object.assign({ n: l.n }, SONG_JA[i]) : l);
const SONG_TITLE = () => langCard('两只老虎', 'liǎng zhī lǎo hǔ', 'lagu Dua Harimau', 'Are You Sleeping?', ['いぬさん ねこさん', 'inu-san neko-san']);
const PN = { mode: 'free', seq: [], pos: 0, busy: false, stars: 0, len: 2, line: 0, idx: 0, timers: [] };

function pianoTone(f) {
  Snd.init();
  const c = Snd.ctx; if (!c) return;
  const t = c.currentTime;
  const o1 = c.createOscillator(); o1.type = 'triangle'; o1.frequency.value = f;
  const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
  const g = c.createGain(), g2 = c.createGain(); g2.gain.value = 0.22;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(Snd.sfxBus);
  o1.start(t); o2.start(t); o1.stop(t + 1.5); o2.stop(t + 1.5);
}
const keyEl = i => $('piano-keys').children[i];
function flashKey(i, cls = 'lit', ms = 380) { const el = keyEl(i); el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms); }
function later(fn, ms) { PN.timers.push(setTimeout(() => { if (G.panel === 'piano') fn(); }, ms)); }
function clearPianoTimers() { PN.timers.forEach(clearTimeout); PN.timers = []; }

(function buildKeys() {
  const box = $('piano-keys');
  KEYS.forEach((k, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pkey'; b.style.setProperty('--k', k.col);
    b.innerHTML = `<span class="pn">${k.high ? '<i class="dot"></i>' : ''}${k.n}${k.low ? '<i class="dot"></i>' : ''}</span><small>${k.s}</small>`;
    b.setAttribute('aria-label', 'Nada ' + k.s + (k.low ? ' rendah' : k.high ? ' tinggi' : ''));
    b.addEventListener('pointerdown', e => { e.preventDefault(); pressKey(i); });
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pressKey(i); } });
    box.appendChild(b);
  });
})();

function drawPianoStars() {
  $('piano-stars').innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="fstar${i < PN.stars ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('piano-stars').setAttribute('aria-label', PN.stars + ' dari 5 bintang');
}
function renderLyric() {
  const el = $('piano-lyric');
  el.hidden = PN.mode !== 'song';
  if (PN.mode === 'song') {
    const line = SONG[Math.min(PN.line, SONG.length - 1)], cls = i => (i < PN.idx ? 'done' : i === PN.idx ? 'now' : '');
    if (line.syl) el.innerHTML = line.syl.map((s, i) => `<span class="${cls(i)}">${s}</span>`).join('');
    else {
      const ch = [...line.zh], sy = (line.sy || line.py).split(' ');
      el.innerHTML = ch.map((c, i) => `<ruby class="${cls(i)}">${c}<rt class="t${toneOf(sy[i])}">${sy[i]}</rt></ruby>`).join('');
    }
  }
  [...$('piano-keys').children].forEach((k, i) => k.classList.toggle('next', PN.mode === 'song' && !!SONG[PN.line] && SONG[PN.line].n[PN.idx] === i));
}

function pressKey(i) {
  pianoTone(KEYS[i].f); flashKey(i);
  if (PN.mode === 'follow' && !PN.busy) {
    if (i === PN.seq[PN.pos]) { PN.pos++; if (PN.pos === PN.seq.length) followWin(); }
    else { PN.busy = true; say([{ k: 'listenagain' }]); later(playSeq, 1600); }
  }
  if (PN.mode === 'song') {
    const line = SONG[PN.line];
    if (!line || i !== line.n[PN.idx]) return;
    PN.idx++;
    if (PN.idx >= line.n.length) {
      say([{ card: { zh: line.zh, py: line.py, id: line.id } }]);
      PN.line++; PN.idx = 0;
      if (PN.line >= SONG.length) later(() => { sfx('sparkle'); say([{ k: 'great' }]); PN.line = 0; renderLyric(); }, 1200);
    }
    renderLyric();
  }
}

// 跟我弹: piano memainkan beberapa nada, anak menirunya
function newSeq() { PN.seq = Array.from({ length: PN.len }, () => 1 + Math.floor(Math.random() * 6)); playSeq(); }
function playSeq() {
  clearPianoTimers(); PN.busy = true; PN.pos = 0;
  PN.seq.forEach((n, k) => later(() => { pianoTone(KEYS[n].f); flashKey(n, 'show', 460); }, 500 + k * 680));
  later(() => { PN.busy = false; say([{ k: 'yourturn' }]); }, 500 + PN.seq.length * 680);
}
function followWin() {
  PN.busy = true; PN.stars++; drawPianoStars(); sfx('sparkle');
  const fin = PN.stars >= 5;
  say(fin ? [{ k: 'right' }, { k: 'great' }] : [{ k: 'right' }]);
  PN.len = Math.min(6, PN.len + 1);
  later(() => { if (fin) { PN.stars = 0; PN.len = 2; drawPianoStars(); } newSeq(); }, fin ? 3200 : 1900);
}

function pianoMode(m) {
  PN.mode = m; clearPianoTimers(); PN.busy = false;
  document.querySelectorAll('#p-piano [data-pmode]').forEach(b => b.setAttribute('aria-selected', b.dataset.pmode === m ? 'true' : 'false'));
  $('piano-stars').hidden = m !== 'follow';
  if (m === 'free') say([{ k: 'playpiano' }]);
  if (m === 'follow') { PN.stars = 0; PN.len = 2; drawPianoStars(); say([{ k: 'follow' }]); later(newSeq, 1300); }
  if (m === 'song') { PN.line = 0; PN.idx = 0; say([{ k: 'sing' }, { card: SONG_TITLE() }]); }
  renderLyric();
}
function pianoOpen() { pianoMode(PN.mode); }
document.querySelectorAll('#p-piano [data-pmode]').forEach(b => b.addEventListener('click', () => { sfx('tap'); pianoMode(b.dataset.pmode); }));
