/* Bloom system — the report's floral geometry, rendered to canvas and SVG */
(function () {
  const C = {
    yellow: '#FFEC3B', pink: '#FF66A8', pinkL: '#FF93C9', red: '#F0302A',
    teal: '#07C69A', tealL: '#55E0C2', blue: '#1E6BFF', cream: '#EFE6D2'
  };
  const PALETTE = [C.yellow, C.pinkL, C.red, C.tealL, C.blue, C.cream, C.pink];

  // Primitives in a -50..50 box: c = circle(x,y,r), d = diamond(x,y,halfDiagonal)
  // colour slot: 0 = main, 1 = accent
  const ring = (n, rad, r, slot = 0, type = 'c') =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return [type, Math.cos(a) * rad, Math.sin(a) * rad, r, slot];
    });
  const plus = (d, r, slot = 0, type = 'c') => [[type, 0, -d, r, slot], [type, d, 0, r, slot], [type, 0, d, r, slot], [type, -d, 0, r, slot]];
  const corners = (d, r, slot = 0, type = 'c') => [[type, -d, -d, r, slot], [type, d, -d, r, slot], [type, d, d, r, slot], [type, -d, d, r, slot]];

  const SMALL = {
    dot: [['c', 0, 0, 34, 0]],
    dotS: [['c', 0, 0, 16, 0]],
    flower: [...plus(17, 19), ['c', 0, 0, 18, 0]],
    flowerC: [...plus(17, 19), ['c', 0, 0, 18, 0], ['c', 0, 0, 11, 1]],
    flowerD: [...plus(17, 19), ['c', 0, 0, 18, 0], ['d', 0, 0, 12, 1]],
    diamond: [['d', 0, 0, 24, 0]],
    diamondS: [['d', 0, 0, 13, 0]],
    xdia: corners(15, 15, 0, 'd'),
    xdiaC: [...corners(15, 15, 0, 'd'), ['c', 0, 0, 10, 1]],
    ring: ring(8, 30, 5),
    ringC: [...ring(8, 30, 5), ['c', 0, 0, 12, 1]],
    cross5: [...plus(26, 9, 0, 'd'), ['d', 0, 0, 9, 1]],
    dotsX: [...corners(18, 7), ['d', 0, 0, 8, 1]],
    quad: corners(15, 15),
    quadS: [...corners(15, 15), ['d', 0, 0, 7, 1]],
    clover: [...plus(16, 18), ['c', 0, 0, 18, 0], ['c', 0, 0, 15, 1], ...corners(28, 7, 1, 'd')],
    sun: [['c', 0, 0, 16, 0], ...ring(8, 32, 5, 1)]
  };
  const SMALL_KEYS = Object.keys(SMALL);

  // Large signature compositions from the report
  const BIG = {
    helm: [...corners(25, 25, 0, 'd'), ...corners(25, 8, 1), ...plus(41, 8, 1)].map(withCols(C.yellow, C.pink)),
    blue: [...corners(25, 25), ...corners(25, 8, 1), ...plus(37, 8, 1)].map(withCols(C.blue, C.yellow)),
    pink: [...plus(23, 27), ['c', 0, 0, 26, 0], ...plus(36, 12, 1)].map(withCols(C.pink, C.red)),
    principles: [...corners(24, 24, 0, 'd'), ...plus(31, 11, 1), ['d', 0, 0, 33, 2]].map(withCols(C.teal, C.pink, C.cream)),
    sunflower: [...corners(35, 15, 0, 'd'), ...plus(21, 25, 1), ['c', 0, 0, 25, 1]].map(withCols(C.teal, C.yellow)),
    teal: [['c', 0, 0, 46, 0], ...plus(35, 12, 1), ...corners(35, 15, 2, 'd'), ['d', 0, 0, 16, 2]].map(withCols(C.teal, C.pink, C.red)),
    riser: [...plus(20, 22), ['c', 0, 0, 22, 0], ['c', 0, 0, 25, 1], ['d', 0, 0, 16, 2], ...corners(30, 8, 3, 'd')].map(withCols(C.yellow, C.red, C.cream, C.pinkL)),
    entrant: [...plus(38, 10, 0), ...corners(28, 9, 1, 'd'), ['c', 0, 0, 24, 2], ['c', 0, 0, 10, 3]].map(withCols(C.blue, C.tealL, C.yellow, C.red)),
    method: [...corners(24, 26), ...plus(22, 24, 1), ['c', 0, 0, 24, 1]].map(withCols(C.blue, C.cream))
  };
  function withCols(...cols) { return (p) => [p[0], p[1], p[2], p[3], cols[p[4]]]; }

  /* ---------- SVG ---------- */
  function svgPrim(p, cls = '') {
    const [t, x, y, r, col] = p;
    if (t === 'c') return `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
    return `<path class="${cls}" d="M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z" fill="${col}"/>`;
  }
  function bigSVG(type, label) {
    const parts = BIG[type] || BIG.blue;
    let inner = parts.map((p) => svgPrim(p, 'bp')).join('');
    if (label) inner += `<text x="0" y="1.6" text-anchor="middle" class="bp-label">${label}</text>`;
    return `<svg class="big-bloom" viewBox="-52 -52 104 104" aria-hidden="true">${inner}</svg>`;
  }
  function smallSVG(key, colors) {
    const prims = SMALL[key] || SMALL.dot;
    const inner = prims.map((p) => svgPrim([p[0], p[1], p[2], p[3], colors[p[4]] || colors[0]])).join('');
    return `<svg viewBox="-50 -50 100 100" aria-hidden="true">${inner}</svg>`;
  }

  /* ---------- Canvas ---------- */
  function drawPrims(ctx, prims, colors) {
    for (const [t, x, y, r, slot] of prims) {
      ctx.fillStyle = colors[slot] || colors[0];
      ctx.beginPath();
      if (t === 'c') ctx.arc(x, y, r, 0, Math.PI * 2);
      else { ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); }
      ctx.fill();
    }
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  function randomColors() {
    const a = pick(PALETTE);
    let b = pick(PALETTE);
    while (b === a) b = pick(PALETTE);
    return [a, b];
  }

  /**
   * BloomField — a grid of floral glyphs on a canvas that react to the pointer.
   * opts.density 0..1, opts.mask(x01, y01) → probability multiplier
   */
  class BloomField {
    constructor(canvas, opts = {}) {
      this.cv = canvas; this.ctx = canvas.getContext('2d');
      this.opts = Object.assign({ cell: 54, density: 0.32, mask: null, interactive: true }, opts);
      this.items = []; this.mouse = { x: -9999, y: -9999 }; this.t0 = performance.now();
      this.progress = 0; // external scroll progress for scattering
      this.resize = this.resize.bind(this); this.loop = this.loop.bind(this);
      window.addEventListener('resize', this.resize);
      if (this.opts.interactive) {
        const host = canvas.parentElement;
        host.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); this.mouse.x = e.clientX - r.left; this.mouse.y = e.clientY - r.top; });
        host.addEventListener('pointerleave', () => { this.mouse.x = this.mouse.y = -9999; });
        host.addEventListener('click', (e) => { const r = canvas.getBoundingClientRect(); this.burst(e.clientX - r.left, e.clientY - r.top); });
      }
      this.resize();
      this.visible = true;
      new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; if (this.visible) requestAnimationFrame(this.loop); }).observe(canvas);
      requestAnimationFrame(this.loop);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.cv.clientWidth, h = this.cv.clientHeight;
      this.cv.width = w * dpr; this.cv.height = h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
      const cell = w < 700 ? this.opts.cell * 0.78 : this.opts.cell;
      this.cell = cell;
      const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
      this.items = [];
      // clustered noise: a few attractor points make blooms grow in clumps, like the cover
      const seeds = Array.from({ length: 6 }, () => [Math.random(), Math.random(), rand(0.12, 0.28)]);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x01 = (i + 0.5) / cols, y01 = (j + 0.5) / rows;
        let p = 0;
        for (const [sx, sy, sr] of seeds) { const d = Math.hypot(x01 - sx, (y01 - sy) * (h / w)); p = Math.max(p, 1 - d / sr); }
        p = p * 1.4 * this.opts.density + this.opts.density * 0.15;
        if (this.opts.mask) p *= this.opts.mask(x01, y01);
        if (Math.random() < p) this.items.push(this.makeItem((i + 0.5) * cell, (j + 0.5) * cell));
      }
    }
    makeItem(x, y, born) {
      return {
        x, y, key: pick(SMALL_KEYS), colors: randomColors(),
        delay: born != null ? 0 : rand(0, 1400) + (y / this.h) * 600,
        born: born != null ? born : this.t0,
        s: 0, rot: pick([0, 0, 0, Math.PI / 4]), spin: 0,
        vx: rand(-1, 1), vy: rand(-1, 1), temp: born != null
      };
    }
    burst(x, y) {
      const now = performance.now();
      const n = 10;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + rand(-0.2, 0.2), d = rand(20, 120);
        const it = this.makeItem(x + Math.cos(a) * d, y + Math.sin(a) * d, now + k * 30);
        it.life = 2600; this.items.push(it);
      }
    }
    loop(now) {
      if (!this.visible) return;
      const { ctx, cell } = this;
      ctx.clearRect(0, 0, this.w, this.h);
      const R = cell * 2.6;
      const sc = this.progress;
      this.items = this.items.filter((it) => !it.life || now - it.born < it.life);
      for (const it of this.items) {
        const age = now - it.born - it.delay;
        if (age < 0) continue;
        let grow = Math.min(1, age / 700); grow = 1 - Math.pow(1 - grow, 3);
        let fade = 1;
        if (it.life) { const rem = it.life - (now - it.born); if (rem < 600) fade = rem / 600; }
        const dx = it.x - this.mouse.x, dy = it.y - this.mouse.y, d = Math.hypot(dx, dy);
        const near = d < R ? 1 - d / R : 0;
        it.spin += (near * Math.PI / 2 - it.spin) * 0.08;
        const push = near * 14;
        const px = it.x + (d ? (dx / d) * push : 0) + it.vx * sc * 260;
        const py = it.y + (d ? (dy / d) * push : 0) + it.vy * sc * 260 - sc * 120;
        const size = (cell * 0.46) * grow * (1 + near * 0.55) * fade * (1 - sc * 0.5);
        if (size <= 0.2) continue;
        ctx.save();
        ctx.globalAlpha = fade * (1 - sc);
        ctx.translate(px, py); ctx.rotate(it.rot + it.spin + (1 - grow) * -1.2); ctx.scale(size / 50, size / 50);
        drawPrims(ctx, SMALL[it.key], it.colors);
        ctx.restore();
      }
      requestAnimationFrame(this.loop);
    }
  }

  window.Bloom = { C, PALETTE, SMALL, SMALL_KEYS, BIG, bigSVG, smallSVG, BloomField, randomColors, pick };
})();
