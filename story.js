// Cerita pendek dalam bentuk video: adegan berjalan sendiri, tokoh bergerak, kamera perlahan mendekat,
// narasi Mandarin + teks pinyin & arti. Tombol: putar/jeda, ulang, kembali ke daftar.
// Aktor: ['p', look, x, y, dir, mood, opsi{to, act, umbrella}] | ['dog', x, y, state, dir, opsi{to}]
//        ['item', jenis, x, y, opsi{to}] | ['crab', x, y] | ['heart', x, y] | ['rainbow', cx, cy, r]

const STORIES = [
  { title: { zh: '豆豆去哪里了？', py: 'dòu dou qù nǎ lǐ le', id: 'Ke mana Dòudou?', en: 'Where is Doudou?' }, pages: [
    { scene: 'farm', a: [['p', 'me', 40, 112, 'right', 'sad', { to: [110, 108] }]], zh: '豆豆去哪里了？', py: 'dòu dou qù nǎ lǐ le', id: 'Ke mana Dòudou?', en: 'Where is Doudou?' },
    { scene: 'school', a: [['p', 'me', 50, 150, 'right', 'sad', { to: [150, 146] }]], zh: '豆豆在学校吗？不在。', py: 'dòu dou zài xué xiào ma bú zài', id: 'Apakah Dòudou di sekolah? Tidak ada.', en: 'Is Doudou at school? No.' },
    { scene: 'beach', a: [['p', 'me', 20, 140, 'right', 'scared', { to: [72, 146] }], ['dog', 120, 150, 'happy', -1], ['crab', 142, 156]], zh: '豆豆在海边！', py: 'dòu dou zài hǎi biān', id: 'Dòudou ada di pantai!', en: 'Doudou is at the beach!' },
    { scene: 'beach', a: [['p', 'me', 76, 150, 'right', 'happy', { to: [110, 150] }], ['dog', 128, 152, 'happy', -1], ['heart', 118, 126, { to: [118, 100] }], ['heart', 104, 120, { to: [104, 92] }]], zh: '我找到你了！', py: 'wǒ zhǎo dào nǐ le', id: 'Aku menemukanmu!', en: 'I found you!' },
    { scene: 'home', night: 1, a: [['p', 'me', 150, 150, 'down', 'sleepy'], ['dog', 168, 152, 'sit', -1], ['heart', 160, 130, { to: [160, 112] }]], zh: '晚安，豆豆。', py: 'wǎn ān dòu dou', id: 'Selamat tidur, Dòudou.', en: 'Good night, Doudou.' },
  ] },
  { title: { zh: '红红的苹果', py: 'hóng hóng de píng guǒ', id: 'Apel yang merah', en: 'Red, Red Apples' }, pages: [
    { scene: 'farm', a: [['p', 'me', 110, 104, 'right', 'happy', { to: [150, 86] }], ['dog', 96, 106, 'walk', 1, { to: [134, 90] }]], zh: '树上有很多苹果。', py: 'shù shàng yǒu hěn duō píng guǒ', id: 'Ada banyak apel di pohon.', en: 'There are many apples on the tree.' },
    { scene: 'farm', a: [['p', 'me', 150, 86, 'down', 'happy', { act: 'wave' }], ['item', 'apple', 158, 42, { to: [158, 70] }]], zh: '我摘一个苹果。', py: 'wǒ zhāi yí gè píng guǒ', id: 'Aku memetik satu apel.', en: 'I pick an apple.' },
    { scene: 'home', a: [['p', 'me', 150, 100, 'left', 'happy', { to: [112, 84] }], ['item', 'apple', 158, 82, { to: [101, 66] }], ['heart', 92, 50, { to: [92, 34] }]], zh: '给妈妈一个。', py: 'gěi mā ma yí gè', id: 'Satu untuk Ibu.', en: 'One for Mommy.' },
    { scene: 'home', a: [['p', 'me', 130, 166, 'left', 'happy', { to: [70, 166] }], ['item', 'apple', 52, 124], ['item', 'apple', 84, 140]], zh: '给爷爷奶奶。', py: 'gěi yé ye nǎi nai', id: 'Untuk Kakek dan Nenek.', en: 'And for Grandpa and Grandma.' },
    { scene: 'home', a: [['p', 'me', 160, 140, 'down', 'happy', { act: 'wave' }], ['heart', 120, 70, { to: [120, 50] }], ['heart', 200, 80, { to: [200, 58] }], ['heart', 60, 130, { to: [60, 110] }]], zh: '大家都很开心！', py: 'dà jiā dōu hěn kāi xīn', id: 'Semuanya senang!', en: 'Everyone is happy!' },
  ] },
  { title: { zh: '下雨了', py: 'xià yǔ le', id: 'Hujan turun', en: "It's Raining" }, pages: [
    { scene: 'village', weather: 'rain', a: [['p', 'me', 40, 126, 'right', 'scared', { to: [150, 126] }]], zh: '下雨了！', py: 'xià yǔ le', id: 'Hujan turun!', en: "It's raining!" },
    { scene: 'village', weather: 'rain', a: [['p', 'me', 150, 126, 'right', 'happy', { umbrella: true, to: [210, 126] }], ['dog', 132, 128, 'walk', 1, { to: [192, 128] }]], zh: '我有雨伞。', py: 'wǒ yǒu yǔ sǎn', id: 'Aku punya payung.', en: 'I have an umbrella.' },
    { scene: 'village', weather: 'rain', a: [['p', 'me', 200, 132, 'left', 'happy', { umbrella: true }]], zh: '小鸭子很开心。', py: 'xiǎo yā zi hěn kāi xīn', id: 'Bebek kecil senang.', en: 'The little duck is happy.' },
    { scene: 'mountain', a: [['rainbow', 210, 64, 58], ['p', 'me', 290, 146, 'left', 'happy', { to: [250, 146] }], ['dog', 304, 148, 'happy', -1, { to: [266, 148] }]], zh: '雨停了，有彩虹！', py: 'yǔ tíng le yǒu cǎi hóng', id: 'Hujan berhenti, ada pelangi!', en: 'The rain stopped. A rainbow!' },
    { scene: 'mountain', a: [['rainbow', 210, 64, 58], ['p', 'meimei', 226, 150, 'down', 'happy', { act: 'wave' }], ['p', 'me', 250, 148, 'down', 'happy', { act: 'wave' }], ['p', 'lele', 274, 150, 'down', 'happy', { act: 'wave' }]], zh: '真漂亮！', py: 'zhēn piào liang', id: 'Indah sekali!', en: 'So pretty!' },
  ] },
];
// Teks Jepang setiap cerita: [judul, halaman 1, 2, ...], masing-masing [kana, romaji]
[
  [['ドウドウは どこ？', 'Dōdō wa doko?'], ['ドウドウは どこ？', 'Dōdō wa doko?'], ['がっこうに いるかな？ いないね。', 'gakkō ni iru kana? inai ne.'],
    ['ドウドウは うみに いた！', 'Dōdō wa umi ni ita!'], ['みつけた！', 'mitsuketa!'], ['おやすみ、ドウドウ。', 'oyasumi, Dōdō.']],
  [['あかい りんご', 'akai ringo'], ['きに りんごが たくさん。', 'ki ni ringo ga takusan.'], ['りんごを ひとつ とるよ。', 'ringo o hitotsu toru yo.'],
    ['ママに ひとつ。', 'mama ni hitotsu.'], ['おじいちゃんと おばあちゃんにも。', 'ojīchan to obāchan ni mo.'], ['みんな にこにこ！', 'minna nikoniko!']],
  [['あめが ふってきた', 'ame ga futte kita'], ['あめだ！', 'ame da!'], ['かさが あるよ。', 'kasa ga aru yo.'],
    ['アヒルさんも うれしそう。', 'ahiru-san mo ureshisō.'], ['あめが やんだ。 にじだ！', 'ame ga yanda. niji da!'], ['きれいだね！', 'kirei da ne!']],
].forEach((ja, i) => { STORIES[i].title.ja = ja[0]; STORIES[i].pages.forEach((p, j) => { p.ja = ja[j + 1]; }); });

const STO = { s: 0, page: 0, pt: 0, playing: false, last: 0, dur: 5, bgKey: '', lo: document.createElement('canvas'), bg: document.createElement('canvas') };
STO.lo.width = W; STO.lo.height = H; STO.bg.width = W; STO.bg.height = H;
STO.lctx = STO.lo.getContext('2d', { willReadFrequently: true });
STO.bctx = STO.bg.getContext('2d');
const vcv = $('story-cv'), vctx = vcv.getContext('2d');
const vImg = vctx.createImageData(W * 2, H * 2), v32 = new Uint32Array(vImg.data.buffer);
const vMid = document.createElement('canvas'); vMid.width = W * 2; vMid.height = H * 2;
const vMidCtx = vMid.getContext('2d');
PANELS.story = $('p-story');
PANELS.story.addEventListener('pointerdown', e => { if (e.target === PANELS.story) closePanel(); });

const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);
const lerp = (a, b, k) => a + (b - a) * k;

// satu bingkai adegan (k = 0..1 sepanjang halaman)
function storyFrameDraw(page, k, c) {
  const keep = { scene: G.scene, night: G.night, weather: G.weather };
  const sc = SCENES[page.scene], t = G.t;
  G.scene = sc; G.night = !!page.night; G.weather = page.weather || 'sun';
  const key = page.scene + G.night + G.weather;
  if (STO.bgKey !== key) { STO.bctx.clearRect(0, 0, W, H); sc.bg(STO.bctx); STO.bgKey = key; }
  c.drawImage(STO.bg, 0, 0);
  sc.objs.forEach(o => { if (o.flat && !o.hidden) o.draw(c, t); });
  const list = sc.objs.filter(o => !o.flat && !o.hidden && !o.top).map(o => ({ y: o.y || 0, draw: () => o.draw(c, t) }));
  const kk = ease(k / 0.75);
  page.a.forEach(a => {
    const kind = a[0], opt = (kind === 'p' ? a[6] : kind === 'dog' ? a[5] : kind === 'item' ? a[4] : a[3]) || {};
    const bx = kind === 'p' || kind === 'item' ? a[2] : a[1], by = kind === 'p' || kind === 'item' ? a[3] : a[2];
    const x = opt.to ? lerp(bx, opt.to[0], kk) : bx, y = opt.to ? lerp(by, opt.to[1], kk) : by;
    const moving = opt.to && kk < 1, frame = moving ? [1, 0, 2, 0][Math.floor(t * 8) % 4] : 0;
    if (kind === 'p') list.push({ y, draw: () => drawPerson(c, x, y, { look: a[1], dir: a[4], mood: a[5], frame, act: moving ? null : opt.act, actT: t, umbrella: opt.umbrella, outfit: a[1] === 'me' ? mirrorOutfit() : null }) });
    if (kind === 'dog') list.push({ y, draw: () => drawDogTrick(c, x, y, a[4] || 1, frame, moving ? 'walk' : a[3], t) });
    if (kind === 'crab') list.push({ y, draw: () => drawCrab(c, x, y, t) });
    if (kind === 'item') list.push({ y: 999, draw: () => drawItem(c, x, y, a[1]) });
    if (kind === 'heart') list.push({ y: 999, draw: () => drawHeart(c, Math.round(x), Math.round(y)) });
    if (kind === 'rainbow') list.push({ y: -1, draw: () => drawRainbow(c, a[1], a[2], a[3]) });
  });
  list.sort((p, q) => p.y - q.y).forEach(o => o.draw());
  sc.objs.forEach(o => { if (o.top && !o.hidden) o.draw(c, t); });
  if (G.weather === 'rain') for (let i = 0; i < 70; i++) px(c, (i * 47 + t * 40) % W, (i * 31 + t * 160) % H, 1, 3, 'rgba(220,238,255,0.8)');
  drawTint(c);
  G.scene = keep.scene; G.night = keep.night; G.weather = keep.weather;
}

// tampilkan: haluskan 2× lalu zoom perlahan ke tokoh utama, dengan fade antar adegan
function storyPresent(page, k) {
  storyFrameDraw(page, k, STO.lctx);
  epx(new Uint32Array(STO.lctx.getImageData(0, 0, W, H).data.buffer), v32, W, H);
  vMidCtx.putImageData(vImg, 0, 0);
  const hero = page.a.find(a => a[0] === 'p');
  const fx = hero ? (hero[6] && hero[6].to ? lerp(hero[2], hero[6].to[0], ease(k / 0.75)) : hero[2]) * 2 : W, fy = hero ? (hero[3] - 20) * 2 : H;
  const z = 1 + 0.12 * k, sw = W * 2 / z, sh = H * 2 / z;
  const sx = Math.max(0, Math.min(W * 2 - sw, fx - sw / 2)), sy = Math.max(0, Math.min(H * 2 - sh, fy - sh / 2));
  vctx.imageSmoothingEnabled = false;
  vctx.drawImage(vMid, sx, sy, sw, sh, 0, 0, vcv.width, vcv.height);
  const fade = Math.max(0, 1 - STO.pt / 0.35, 1 - (STO.dur - STO.pt) / 0.35);
  if (fade > 0) { vctx.fillStyle = `rgba(20,16,30,${Math.min(1, fade)})`; vctx.fillRect(0, 0, vcv.width, vcv.height); }
}

function storyStartPage() {
  const pg = txt(STORIES[STO.s].pages[STO.page]);
  STO.pt = 0; STO.dur = Math.max(5, 2.6 + [...pg.zh].length * { zh: 0.45, en: 0.11, ja: 0.25 }[LANG]);
  $('story-zh').innerHTML = rubyHTML(pg.zh, pg.py); $('story-id').textContent = pg.id;
  setTimeout(() => { if (STO.playing && G.panel === 'story') Talk.say([{ zh: pg.zh, id: pg.id }]); }, 400);
}
function storyFrame(now) {
  if (G.panel !== 'story' || $('story-view').hidden) return;
  const dt = Math.min(0.05, (now - STO.last) / 1000); STO.last = now;
  const st = STORIES[STO.s];
  if (STO.playing) {
    STO.pt += dt;
    if (STO.pt >= STO.dur) {
      if (STO.page + 1 < st.pages.length) { STO.page++; storyStartPage(); }
      else { STO.playing = false; STO.pt = STO.dur; setPlayIcon(); sfx('sparkle'); say([{ k: 'great' }]); }
    }
  }
  storyPresent(st.pages[STO.page], Math.min(1, STO.pt / STO.dur));
  $('story-progress').style.width = ((STO.page + Math.min(1, STO.pt / STO.dur)) / st.pages.length * 100) + '%';
  requestAnimationFrame(storyFrame);
}
function setPlayIcon() {
  $('story-play').innerHTML = STO.playing
    ? '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="2" y="1.5" width="2.2" height="7" fill="#fff"/><rect x="5.8" y="1.5" width="2.2" height="7" fill="#fff"/></svg>'
    : '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.5L8.5 5 2.5 8.5z" fill="#fff"/></svg>';
  $('story-play').setAttribute('aria-label', STO.playing ? 'Jeda' : 'Putar');
}
function storyPlay(i) {
  STO.s = i; STO.page = 0; STO.playing = true; STO.last = performance.now();
  $('story-list').hidden = true; $('story-view').hidden = false;
  const ti = txt(STORIES[i].title);
  $('story-title').innerHTML = rubyHTML(ti.zh, ti.py);
  setPlayIcon(); storyStartPage();
  requestAnimationFrame(storyFrame);
}
function storyList() {
  STO.playing = false; Talk.cancel();
  $('story-view').hidden = true; $('story-list').hidden = false;
  const box = $('story-list'); box.innerHTML = '';
  STORIES.forEach((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'story-cover';
    const cvs = document.createElement('canvas'); cvs.width = 640; cvs.height = 360;
    storyFrameDraw(s.pages[0], 0.6, STO.lctx);
    cvs.getContext('2d').drawImage(upscale4(STO.lo), 0, 0, 640, 360);
    b.appendChild(cvs);
    const ti = txt(s.title);
    b.insertAdjacentHTML('beforeend', `<span class="play-badge" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M3 2l5 3-5 3z" fill="#fff"/></svg></span><span class="story-title">${rubyHTML(ti.zh, ti.py)}</span><small>${ti.id}</small>`);
    b.addEventListener('click', () => { sfx('pop'); storyPlay(i); });
    box.appendChild(b);
  });
}
$('story-play').addEventListener('click', () => {
  sfx('tap');
  if (!STO.playing && STO.page === STORIES[STO.s].pages.length - 1 && STO.pt >= STO.dur) { storyPlay(STO.s); return; }
  STO.playing = !STO.playing; setPlayIcon();
  if (STO.playing) { STO.last = performance.now(); const pg = txt(STORIES[STO.s].pages[STO.page]); Talk.say([{ zh: pg.zh, id: pg.id }]); } else Talk.cancel();
});
$('story-replay').addEventListener('click', () => { sfx('tap'); storyPlay(STO.s); });
$('story-back').addEventListener('click', () => { sfx('tap'); storyList(); });
$('btn-story').addEventListener('click', () => { if (!G.started) return; Snd.init(); openPanel('story'); storyList(); say([{ k: 'story' }]); });
