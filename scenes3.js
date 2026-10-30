// Tempat: Pantai.

SCENES.beach = (() => {
  const S = {
    id: 'beach', place: 'beach', outdoor: true, walk: [6, 102, 314, 176], spawn: [20, 140],
    blocks: [[224, 130, 5, 8], [20, 122, 10, 8], [296, 158, 10, 8]], objs: [], lights: [],
  };
  S.bg = c => {
    for (let y = 0; y < 34; y++) { const k = y / 34; px(c, 0, y, W, 1, G.night ? `rgb(${28 + k * 20},${36 + k * 20},${78 + k * 30})` : `rgb(${150 + k * 60},${212 + k * 26},${245})`); }
    px(c, 0, 34, W, 62, G.night ? '#2a4f7a' : '#3f9fd6');
    for (let y = 37; y < 96; y += 6) for (let x = (y * 7) % 23; x < W; x += 23) px(c, x, y, 8, 1, G.night ? '#3a6a9a' : '#5fb3e0');
    px(c, 0, 34, W, 1, G.night ? '#5a7aa8' : '#bfe6fa');
    px(c, 0, 96, W, 10, '#d9c28a');
    px(c, 0, 106, W, 74, '#f2dca0');
    const r = rng(15);
    for (let i = 0; i < 260; i++) px(c, Math.floor(r() * W), 106 + Math.floor(r() * 74), 1, 1, r() < 0.5 ? '#e3c47a' : '#fbecc4');
    px(c, 212, 134, 28, 12, '#4f86e0'); for (let x = 214; x < 240; x += 6) px(c, x, 134, 2, 12, '#ffffff');
  };

  // ombak di tepi laut
  S.objs.push({ flat: true, y: 0, i: 0, hit: [0, 34, W, 64], get go() { return [G.boy.x, 104]; },
    draw(c, t) {
      const off = Math.round(Math.sin(t * 1.3) * 3);
      for (let x = 0; x < W; x += 2) { const yy = 96 + off + Math.round(Math.sin(x / 9 + t * 2) * 1.5); px(c, x, yy, 2, 2, '#ffffff'); px(c, x, yy + 2, 2, 1, 'rgba(255,255,255,0.5)'); }
      for (let k = 0; k < 8; k++) if ((Math.floor(t * 3) + k) % 4) px(c, (k * 41 + Math.floor(t * 6)) % W, 44 + k * 6, 2, 1, '#e3f5fc');
    },
    tap() { this.i++; say([{ k: this.i % 2 ? 'sea' : 'wave' }]); sfx('splash'); },
    arrive() { fx('splash', G.boy.x, 100, 5); } });
  S.objs.push({ flat: true, y: 0, i: 0, hit: [256, 0, 32, 30], go: [272, 104],
    draw(c) { if (G.night) { disc(c, 272, 14, 7, '#fff2c0'); disc(c, 275, 12, 6, '#2c3a6e'); } else { disc(c, 272, 14, 8, '#ffd84a'); disc(c, 272, 14, 5, '#fff2a8'); } },
    tap() { this.i++; say([{ k: G.night ? (this.i % 2 ? 'moon' : 'star') : 'sun' }]); } });
  S.objs.push({ x: 120, y: 76, dir: 1, top: true, get hit() { return [this.x - 42, this.y - 28, 86, 30]; },
    draw(c, t) { drawDragonBoat(c, this.x, this.y, this.dir, t); },
    update(dt) { this.x += this.dir * 5 * dt; if (this.x > 260) this.dir = -1; if (this.x < 60) this.dir = 1; },
    tap() { say([{ k: 'dragonboat' }, { k: 'dragon' }]); sfx('splash'); } });

  for (let i = 0; i < 2; i++) S.objs.push({ x: 80 + i * 120, y: 22, t0: i * 3, top: true, get hidden() { return G.night; },
    get hit() { return [this.x - 9, this.y - 6, 18, 12]; },
    draw(c, t) { drawSeagull(c, this.x, this.y, t + i, true); },
    update(dt) { this.t0 += dt; this.x = 160 + Math.sin(this.t0 * 0.35 + i * 2) * 130; this.y = 18 + i * 8 + Math.sin(this.t0 * 1.2) * 4; },
    tap() { say([{ k: 'seagull' }]); fx('note', this.x, this.y - 5, 1); } });
  S.objs.push({ x: 180, y: 112, dir: 1, wait: 1, tx: 200, get hit() { return [this.x - 7, this.y - 12, 14, 12]; }, get go() { return [this.x - 12, this.y + 2]; },
    draw(c, t) { drawSeagull(c, this.x, this.y, t, false); },
    update(dt) { if (this.wait > 0) { this.wait -= dt; return; } const d = this.tx - this.x; if (Math.abs(d) < 1) { this.tx = rand(150, 290); this.wait = rand(1, 3); return; } this.x += Math.sign(d) * 10 * dt; },
    tap() { say([{ k: 'seagull' }]); this.tx = this.x + (Math.random() < 0.5 ? -40 : 40); this.wait = 0; } });

  S.objs.push({ x: 24, y: 128, hit: [14, 92, 30, 38], go: [40, 134], draw(c, t) { drawPalm(c, 24, 128, t); }, tap() { say([{ k: 'palm' }]); sfx('shake'); } });
  S.objs.push({ x: 300, y: 166, hit: [290, 130, 30, 38], go: [284, 170], draw(c, t) { drawPalm(c, 300, 166, t); }, tap() { say([{ k: 'palm' }]); sfx('shake'); } });
  S.objs.push({ x: 226, y: 138, hit: [208, 94, 36, 20], go: [226, 148], draw(c) { drawParasol(c, 226, 138); }, tap() { say([{ k: 'parasol' }]); } });

  // istana pasir: diketuk = dibangun makin tinggi
  S.objs.push({ x: 150, y: 162, lvl: 1, hit: [136, 130, 28, 34], go: [150, 172], draw(c) { drawSandcastle(c, 150, 162, this.lvl); },
    tap() { sfx('tap'); },
    arrive() {
      G.boy.dir = 'down'; doAct(G.boy, 'wash', 1);
      this.lvl = this.lvl % 3 + 1; sfx('plant'); fx('dust', 150, 156, 4);
      say(this.lvl === 3 ? [{ k: 'sandcastle' }, { k: 'great' }] : [{ k: 'sandcastle' }]);
    } });

  // kepiting jalan menyamping
  S.objs.push({ x: 90, y: 160, tx: 120, wait: 0, fast: 0, get hit() { return [this.x - 11, this.y - 13, 22, 14]; }, get go() { return [this.x, this.y - 10]; },
    draw(c, t) { drawCrab(c, this.x, this.y, this.wait > 0 ? 0 : t); },
    update(dt) {
      if (this.fast > 0) this.fast -= dt;
      if (this.wait > 0) { this.wait -= dt; return; }
      const d = this.tx - this.x;
      if (Math.abs(d) < 1) { this.tx = rand(50, 200); this.wait = rand(0.8, 2.5); return; }
      this.x += Math.sign(d) * (this.fast > 0 ? 50 : 14) * dt;
    },
    tap() { say([{ k: 'crab' }]); this.fast = 1.2; this.tx = this.x + (G.boy.x < this.x ? 50 : -50); this.tx = Math.max(30, Math.min(290, this.tx)); this.wait = 0; } });

  [['shell', 92, 122], ['shell', 186, 126], ['shell', 262, 174], ['starfish', 128, 136], ['starfish', 60, 172]].forEach(([k, x, y]) => S.objs.push(pickup(k, x, y, { respawn: 20 })));

  S.objs.push(npc('auntie', 90, 118, 'right', { path: [[90, 118], [200, 118]], sp: 11,
    lines: [[{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'q_sea', by: 'np' }, { k: 'a_like', by: 'me' }], [{ k: 'q_tired', by: 'np' }, { k: 'a_tired', by: 'me' }]] }));

  // keluarga ikut ke pantai: Ayah mengajak berenang, Ibu membawa air, kakak bermain pasir
  familyTrip(S, { mom: [246, 152, 'left'], gege: [174, 166, 'left'], dad: [270, 124, 'left'] }, {
    dadQ: 'q_swim',
    dadDo() {
      walkTo(G.boy.x, 104, () => {
        G.boy.dir = 'down'; sfx('splash'); fx('splash', G.boy.x, 100, 8);
        say([{ k: 'swim' }, { k: 'cool', by: G.boy }]);
      });
    },
    gegeLine: [{ k: 'sandcastle', by: 'np' }, { k: 'great', by: 'me' }],
  });

  S.exits = [{ hit: [0, 120, 26, 40], arrow: [12, 140, 'left'], go: [6, 140], to: 'village', at: [230, 132] }];
  return S;
})();

// ================= RUANG KELAS =================
SCENES.classroom = (() => {
  const DESKS = [[110, 112], [170, 112], [230, 112], [110, 150], [170, 150], [230, 150]];
  const TAKEN = [0, 2, 3, 5]; // kursi teman sekelas; dua kursi tengah untuk Russel
  const S = {
    id: 'classroom', place: 'classroom', outdoor: false, walk: [8, 60, 312, 174], spawn: [160, 160],
    blocks: DESKS.map(([x, y]) => [x - 14, y - 12, 28, 13]).concat([[12, 66, 50, 30]]), objs: [], lights: [[160, 60, 120]],
  };
  S.bg = c => {
    px(c, 0, 0, W, 52, '#fbe9b8'); for (let x = 6; x < W; x += 12) px(c, x, 0, 2, 46, '#f6dfa6');
    px(c, 0, 46, W, 6, '#c08a52'); px(c, 0, 45, W, 1, '#a8743c');
    px(c, 0, 52, W, 128, '#d9a86c');
    for (let r = 0, y = 52; y < H; y += 8, r++) { px(c, 0, y + 7, W, 1, '#c4935a'); for (let x = (r % 2) * 20; x < W; x += 40) px(c, x, y, 1, 7, '#c4935a'); }
    px(c, 0, 0, 4, H, '#8a5a35'); px(c, 316, 0, 4, H, '#8a5a35');
    px(c, 0, 176, 144, 4, '#8a5a35'); px(c, 176, 176, 144, 4, '#8a5a35');
    px(c, 146, 168, 28, 10, '#4f86e0'); px(c, 148, 170, 24, 6, '#7aa4ea');
    // papan tulis besar
    px(c, 96, 5, 128, 38, PAL.woodD); px(c, 98, 7, 124, 33, '#2f5a46');
    [1, 2, 3, 4, 5].forEach((d, i) => drawDigit(c, 106 + i * 10, 12, d, '#f4f0e0'));
    for (let i = 0; i < 5; i++) for (let k = 0; k <= i; k++) disc(c, 107 + i * 10, 24 + k * 3, 1, ['#ffd84a', '#f39ac0', '#8fd0f2', '#bfe3a0', '#ffffff'][i]);
    px(c, 170, 14, 40, 1, '#f4f0e0'); px(c, 170, 20, 30, 1, '#f4f0e0'); disc(c, 196, 30, 4, '#ffd84a');
    px(c, 96, 40, 128, 3, PAL.wood); px(c, 110, 39, 5, 1, '#ffffff'); px(c, 118, 39, 4, 1, '#f39ac0');
    // poster bentuk
    px(c, 240, 8, 52, 30, '#ffffff'); px(c, 240, 8, 52, 1, '#c9a873');
    disc(c, 252, 22, 5, '#e2483d'); for (let k = 0; k < 9; k++) px(c, 266 - Math.round(k / 2), 17 + k, k + 1, 1, '#f4cf3a'); px(c, 278, 17, 9, 9, '#4f86e0');
    drawClock(c, 86, 14, 0);
  };

  // jendela (langit ikut siang/malam)
  S.objs.push({ flat: true, y: 0, hit: [12, 6, 64, 36], go: [44, 100],
    draw(c, t) {
      px(c, 12, 6, 64, 36, PAL.woodD); px(c, 14, 8, 60, 32, G.night ? '#26305e' : '#8fd0f2');
      if (G.night) { disc(c, 60, 16, 4, '#fff2c0'); px(c, 24, 14, 1, 1, '#ffffff'); px(c, 40, 30, 1, 1, '#ffffff'); }
      else { oval(c, 34 + Math.round(Math.sin(t * 0.3) * 4), 18, 9, 3, '#ffffff'); disc(c, 62, 14, 4, '#ffd84a'); }
      px(c, 43, 8, 2, 32, PAL.woodD); px(c, 14, 23, 60, 2, PAL.woodD); px(c, 10, 40, 68, 3, PAL.wood);
    },
    tap() { say([{ k: 'window' }]); } });
  // papan tulis → permainan berhitung
  S.objs.push({ flat: true, y: 0, hit: [96, 4, 128, 40], go: [160, 66], draw() {},
    tap() { say([{ k: 'board' }, { k: 'q_count', by: teacher }]); }, arrive() { openPanel('count'); } });
  S.objs.push({ flat: true, y: 0, hit: [238, 6, 56, 34], go: [266, 66], draw() {}, tap() { say([{ k: 'red' }, { k: 'yellow' }, { k: 'blue' }]); } });

  // piano: diketuk = nada pentatonik
  S.objs.push({ x: 38, y: 96, hit: [12, 62, 52, 36], go: [40, 106],
    draw(c) {
      shadow(c, 38, 96, 24);
      px(c, 14, 66, 48, 28, '#2a1d18'); px(c, 14, 66, 48, 2, '#4a3a30'); px(c, 16, 70, 44, 2, '#5a4a40');
      px(c, 16, 80, 44, 7, '#ffffff'); for (let k = 0; k < 11; k++) px(c, 19 + k * 4, 80, 1, 7, '#c9c6c0');
      for (const k of [0, 1, 3, 4, 5, 7, 8, 10]) px(c, 20 + k * 4, 80, 2, 4, '#2a1d18');
      px(c, 16, 92, 3, 4, '#2a1d18'); px(c, 57, 92, 3, 4, '#2a1d18');
    },
    tap() { say([{ k: 'piano' }]); },
    arrive() { G.boy.dir = 'down'; doAct(G.boy, 'wash', 1.2); fx('note', 38, 62, 3); openPanel('piano'); } });
  // drum: diketuk = permainan drum
  S.blocks.push([272, 84, 36, 16]);
  S.objs.push({ x: 292, y: 98, hit: [270, 66, 40, 34], go: [266, 102], hitT: 0,
    draw(c, t) { drawDrumKit(c, 292, 98, t, this.hitT); },
    update(dt) { if (this.hitT > 0) this.hitT -= dt; },
    tap() { say([{ k: 'drum' }]); },
    arrive() { G.boy.dir = 'right'; this.hitT = 0.3; drumHit(0); openPanel('drum'); } });

  // meja, kursi di belakang meja (duduk menghadap depan), pensil & krayon di atas meja
  DESKS.forEach(([x, y], i) => {
    S.objs.push({ x, y: y - 9, hit: [x - 7, y - 22, 14, 11], get go() { return [x + 18, y + 2]; },
      draw(c) { px(c, x - 6, y - 16, 12, 2, '#a8743c'); px(c, x - 6, y - 14, 2, 6, '#7d5230'); px(c, x + 4, y - 14, 2, 6, '#7d5230'); px(c, x - 7, y - 18, 14, 3, '#c08a52'); },
      tap() { say([{ k: 'chair' }]); },
      arrive() {
        const b = G.boy; if (b.ride || TAKEN.includes(i)) return;
        b.dir = 'down';
        b.ride = () => { b.x = x; b.y = y - 4; b.frame = 0; };
        b.rideEnd = () => { b.x = x + 18; b.y = y + 4; };
        say([{ k: 'chair' }, { k: 'sitdown' }]);
      } });
    S.objs.push({ x, y, hit: [x - 14, y - 12, 28, 12], go: [x, y + 10],
      draw(c) {
        shadow(c, x, y, 13);
        px(c, x - 14, y - 12, 28, 7, '#e8c08a'); px(c, x - 14, y - 12, 28, 1, '#f4d8a8'); px(c, x - 14, y - 5, 28, 3, '#b8844f');
        px(c, x - 13, y - 2, 2, 2, '#8a5a35'); px(c, x + 11, y - 2, 2, 2, '#8a5a35');
      },
      tap() { say([{ k: 'desk' }]); } });
    const type = i % 2 ? 'crayon' : 'pencil';
    S.objs.push({ x, y: y + 0.5, gone: 0, get hidden() { return this.gone > 0; }, hit: [x + 1, y - 13, 12, 8], go: [x, y + 10],
      draw(c) { drawItem(c, x + 7, y - 6, type); },
      update(dt) { if (this.gone > 0) this.gone -= dt; },
      tap() { say([{ k: type }]); },
      arrive() { if (bagAdd(type, x + 7, y - 8)) this.gone = 30; } });
  });
  // teman sekelas: setiap Russel masuk, mereka berjalan dari pintu ke kursinya lalu duduk
  const students = TAKEN.map((di, k) => {
    const [dx, dy] = DESKS[di];
    return npc('kid' + (k + 1), 160, 178, 'up', {
      seat: [dx, dy - 4], aisle: dx < 170 ? 140 : 200, wp: [], delay: 0,
      lines: [
        [{ k: 'classmate', zh: '同学，你好！', by: 'me' }, { k: 'hello', zh: CHILD + '，你好！', by: 'np' }],
        [{ k: 'q_study', by: 'np' }, { k: 'a_like', by: 'me' }],
        [{ k: 'q_color', by: 'np' }, { k: 'red', zh: '我喜欢红色！', by: 'me' }],
      ],
      update(dt) {
        if (this.act) { this.actT += dt; if (this.actT > this.actDur) this.act = null; }
        if (this.delay > 0) { this.delay -= dt; return; }
        if (!this.wp.length) { this.frame = 0; if (this.talkT > 0) this.talkT -= dt; else this.dir = 'down'; return; }
        const [tx, ty] = this.wp[0], ddx = tx - this.x, ddy = ty - this.y, d = Math.hypot(ddx, ddy);
        if (d < 1) { this.wp.shift(); return; }
        const st = Math.min(d, 36 * dt);
        this.x += ddx / d * st; this.y += ddy / d * st;
        this.dir = Math.abs(ddx) > Math.abs(ddy) ? (ddx > 0 ? 'right' : 'left') : (ddy > 0 ? 'down' : 'up');
        this.ft += dt; this.frame = [1, 0, 2, 0][Math.floor(this.ft * 8) % 4];
      },
    });
  });
  students.forEach(s => S.objs.push(s));
  S.enter = () => students.forEach((s, k) => {
    s.x = 156 + k * 3; s.y = 178; s.delay = 0.6 + k * 0.9; s.dir = 'up'; s.talkT = 0;
    s.wp = [[160, 166], [s.aisle, 166], [s.aisle, s.seat[1]], s.seat];
  });

  const teacher = SCENES.school.teacher;
  teacher.x = 238; teacher.y = 76; teacher.dir = 'down'; teacher.go = [238, 90];
  S.objs.push(teacher);

  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'school', at: [160, 72] }];
  return S;
})();

// ================= RUMAH HEWAN (kandang) =================
SCENES.barn = (() => {
  const S = {
    id: 'barn', place: 'barn', outdoor: false, walk: [8, 64, 312, 174], spawn: [160, 164],
    blocks: [[38, 88, 50, 18], [143, 86, 34, 16], [186, 82, 32, 12]], objs: [], lights: [[160, 60, 120]],
  };
  S.bg = c => {
    px(c, 0, 0, W, 56, '#b27a45');
    for (let y = 0; y < 56; y += 7) { px(c, 0, y + 6, W, 1, '#8a5a35'); for (let x = (Math.floor(y / 7) % 2) * 12; x < W; x += 24) px(c, x, y, 1, 6, '#8a5a35'); }
    px(c, 0, 0, W, 10, '#7d5230');
    for (let x = 8; x < W; x += 30) { px(c, x, 2, 22, 8, '#e3c46a'); px(c, x, 4, 22, 1, '#c9a24a'); px(c, x, 7, 22, 1, '#c9a24a'); }
    px(c, 120, 16, 50, 26, PAL.woodD); px(c, 122, 18, 46, 22, G.night ? '#26305e' : '#8fd0f2');
    disc(c, 156, 25, 3, G.night ? '#fff2c0' : '#ffd84a'); px(c, 144, 18, 2, 22, PAL.woodD); px(c, 122, 28, 46, 2, PAL.woodD);
    px(c, 196, 22, 2, 9, '#a9a6a0'); px(c, 200, 22, 2, 9, '#a9a6a0'); disc(c, 197, 33, 2, '#e2483d'); disc(c, 201, 33, 2, '#e2483d');
    px(c, 0, 52, W, 4, '#6b4226');
    px(c, 0, 56, W, 124, '#d9b06a');
    const r = rng(41);
    for (let i = 0; i < 300; i++) px(c, Math.floor(r() * W), 56 + Math.floor(r() * 124), 2, 1, r() < 0.5 ? '#e8c47a' : '#c9a24a');
    px(c, 8, 60, 3, 50, PAL.woodD); px(c, 8, 70, 100, 2, PAL.wood); px(c, 8, 82, 100, 2, PAL.wood); px(c, 106, 60, 3, 50, PAL.woodD);
    px(c, 240, 30, 72, 3, PAL.woodD); px(c, 240, 52, 72, 3, PAL.woodD);
    for (let x = 242; x < 310; x += 23) { px(c, x, 33, 20, 19, '#8a5a35'); oval(c, x + 10, 48, 8, 3, '#e3c46a'); }
    px(c, 0, 176, 144, 4, '#6b4226'); px(c, 176, 176, 144, 4, '#6b4226'); px(c, 146, 168, 28, 10, '#c9a24a');
  };

  // sapi: perah susu
  const cow = { x: 60, y: 104, dir: 1, milkT: 0, busy: 0, hit: [38, 70, 54, 36], go: [100, 108],
    draw(c, t) { drawCowBig(c, this.x, this.y, this.dir, t); },
    update(dt) { if (this.milkT > 0) this.milkT -= dt; if (this.busy > 0) this.busy -= dt; },
    tap() { say([{ k: 'cow' }]); },
    arrive() {
      if (this.busy > 0) return;
      if (this.milkT > 0) { say([{ k: 'nomilk' }, { k: 'moo', zh: '哞——' }]); return; }
      G.boy.dir = 'left'; doAct(G.boy, 'wash', 1.6); this.busy = 1.8; sfx('water');
      say([{ k: 'milkcow' }]);
      setTimeout(() => {
        if (G.scene !== S) return;
        if (bagAdd('milk', 92, 100, true)) { this.milkT = 25; say([{ k: 'milk' }, { k: 'moo', zh: '哞——' }]); fx('heart', 70, 72, 2); }
      }, 1500);
    },
    receive: animalReceive('moo') };
  S.objs.push(cow);
  S.objs.push({ x: 90, y: 112, get hidden() { return cow.busy <= 0; }, draw(c, t) {
    px(c, 84, 104, 12, 8, '#a9b6c4'); px(c, 83, 103, 14, 2, '#c9d4e0'); px(c, 85, 105, 10, 2, '#ffffff');
    if (Math.floor(t * 8) % 2) px(c, 89, 98, 1, 4, '#ffffff');
  } });

  // domba: cukur bulu
  const sheep = { x: 160, y: 100, dir: -1, t0: 0, shorn: 0, busy: 0, get hit() { return [this.x - 15, this.y - 24, 30, 24]; }, go: [186, 106],
    draw(c, t) { drawSheepBig(c, this.x, this.y, this.dir, t, this.shorn > 0); },
    update(dt) { this.t0 += dt; if (this.shorn > 0) this.shorn -= dt; if (this.busy > 0) this.busy -= dt; else this.x = 160 + Math.round(Math.sin(this.t0 * 0.4) * 4); },
    tap() { say([{ k: 'sheep' }]); },
    arrive() {
      if (this.busy > 0) return;
      if (this.shorn > 0) { say([{ k: 'sheep' }, { k: 'baa', zh: '咩——' }]); return; }
      G.boy.dir = 'left'; doAct(G.boy, 'wash', 1.4); this.busy = 1.6; sfx('shake');
      say([{ k: 'shear' }]);
      const fluff = setInterval(() => fx('bubble', this.x, this.y - 14, 2), 250);
      setTimeout(() => {
        clearInterval(fluff);
        if (G.scene !== S) return;
        this.shorn = 40;
        if (bagAdd('wool', this.x, this.y - 8, true)) say([{ k: 'wool' }, { k: 'baa', zh: '咩——' }]);
      }, 1300);
    },
    receive: animalReceive('baa') };
  S.objs.push(sheep);

  // tempat minum & jerami
  S.objs.push({ x: 202, y: 92, hit: [186, 80, 32, 14], go: [202, 102], draw(c) {
    px(c, 186, 82, 32, 10, PAL.woodD); px(c, 188, 83, 28, 5, PAL.water); px(c, 190, 83, 8, 1, PAL.waterL);
  }, tap() { say([{ k: 'water' }]); } });
  [[30, 150], [54, 162], [290, 150]].forEach(([x, y]) => S.objs.push({ x, y, hit: [x - 12, y - 14, 24, 15], go: [x, y + 6], draw(c) {
    shadow(c, x, y, 12); px(c, x - 11, y - 12, 22, 12, '#e3c46a'); px(c, x - 11, y - 12, 22, 2, '#f0d684'); px(c, x - 11, y - 7, 22, 1, '#c9a24a'); px(c, x - 3, y - 12, 2, 12, '#a8743c');
  }, tap() { say([{ k: 'hay' }]); } }));

  // ayam & telur di rak
  for (let i = 0; i < 3; i++) S.objs.push({
    x: 210 + i * 30, y: 130 + i * 10, dir: 1, f: 0, peck: false, tx: 240, ty: 140, wait: i, ft: 0,
    get hit() { return [this.x - 6, this.y - 13, 12, 13]; }, get go() { return [this.x - 10, this.y + 2]; },
    draw(c) { drawChicken(c, this.x, this.y, this.dir, this.f, this.peck); },
    update(dt) {
      if (this.wait > 0) { this.wait -= dt; this.f = 0; return; }
      const dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy);
      if (d < 1) { this.tx = rand(200, 300); this.ty = rand(110, 170); this.wait = rand(0.8, 3); this.peck = Math.random() < 0.5; return; }
      this.peck = false; this.dir = dx > 0 ? 1 : -1;
      this.x += dx / d * 14 * dt; this.y += dy / d * 14 * dt;
      this.ft += dt; this.f = Math.floor(this.ft * 8) % 2 ? 1 : 0;
    },
    tap() { say([{ k: 'chicken' }, { k: 'cluck' }]); this.wait = 1.5; fx('note', this.x, this.y - 14, 1); },
    receive: animalReceive('cluck'),
  });
  S.objs.push({ flat: true, y: 0, eggs: 3, timer: 0, hit: [240, 30, 72, 26], go: [276, 72],
    draw(c) { for (let k = 0; k < this.eggs; k++) drawFood(c, 252 + k * 23, 48, 'eggraw'); },
    update(dt) { this.timer += dt; if (this.timer > 8 && this.eggs < 3) { this.eggs++; this.timer = 0; } },
    tap() { say([{ k: 'egg' }]); },
    arrive() {
      if (!this.eggs) { say([{ k: 'chicken' }, { k: 'cluck' }]); return; }
      if (!bagAdd('egg', 276, 46, true)) return;
      this.eggs--; this.timer = 0; G.eggCount = G.eggCount % 10 + 1;
      sayCount(G.eggCount, 'egg', '个', 'gè'); sfx('egg');
    } });

  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'farm', at: [249, 108] }];
  return S;
})();
