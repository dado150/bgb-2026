/* Best Global Brands 2026 — Back in Bloom · shared behaviour */
(function () {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  if (window.Flip) gsap.registerPlugin(window.Flip);
  document.documentElement.classList.add('js');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page;

  const PAGES = [
    { id: 'home', href: 'index.html', num: '', title: 'Back in Bloom', glyph: 'flowerC' },
    { id: 'foreword', href: 'foreword.html', num: '00', title: 'Welcome', glyph: 'ringC' },
    { id: 'wisdom', href: 'wisdom.html', num: '01', title: 'Wisdom is the helm', glyph: 'xdiaC' },
    { id: 'constitution', href: 'constitution.html', num: '02', title: 'Brand as the constitution', glyph: 'quadS' },
    { id: 'leaders', href: 'leaders.html', num: '03', title: 'What this means for leaders', glyph: 'clover' },
    { id: 'ranking', href: 'ranking.html', num: '04', title: 'The Ranking', glyph: 'sun' },
    { id: 'methodology', href: 'methodology.html', num: '05', title: 'Methodology', glyph: 'flowerD' }
  ];

  /* ---------- Shell: nav, menu, folio, curtain, cursor ---------- */
  function shell() {
    const cur = PAGES.find((p) => p.id === page) || PAGES[0];
    const nav = document.createElement('header');
    nav.className = 'nav';
    nav.innerHTML = `
      <a class="nav__logo" href="index.html" data-link>Best Global<br>Brands 2026</a>
      <div class="nav__right">
        <a class="nav__link" href="ranking.html" data-link ${page === 'ranking' ? 'aria-current="page"' : ''}>Ranking</a>
        <button class="menu-btn" aria-expanded="false" aria-controls="menu"><span class="menu-btn__icon"><i></i><i></i><i></i><i></i></span><span class="menu-btn__txt">Menu</span></button>
      </div>`;
    document.body.prepend(nav);

    const menu = document.createElement('nav');
    menu.className = 'menu'; menu.id = 'menu';
    menu.innerHTML = `<ul class="menu__list">${PAGES.map((p, i) => `
      <li class="menu__item"><a href="${p.href}" data-link ${p.id === page ? 'aria-current="page"' : ''}>
        <span class="menu__num">${p.num || '—'}</span><span class="menu__title">${p.title}</span>
        <span class="menu__glyph">${Bloom.smallSVG(p.glyph, [Bloom.PALETTE[i % 7], Bloom.PALETTE[(i + 3) % 7]])}</span></a></li>`).join('')}
      </ul><div class="menu__foot"><span>Interbrand Best Global Brands 2026</span><span>Back in Bloom</span><span>Interactive edition</span></div>`;
    document.body.appendChild(menu);

    const folio = document.createElement('div');
    folio.className = 'folio';
    folio.innerHTML = `<div class="folio__l"><span class="folio__n">${cur.num || '—'}</span><span>Interbrand Best Global Brands</span></div><div class="folio__r"><span>Back in Bloom</span><span class="folio__s">${cur.title}</span></div>`;
    document.body.appendChild(folio);

    const prog = document.createElement('div'); prog.className = 'progress'; document.body.appendChild(prog);
    gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // menu
    const btn = $('.menu-btn'), txt = $('.menu-btn__txt');
    const tl = gsap.timeline({ paused: true })
      .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
      .fromTo($$('.menu__title', menu), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.7, ease: 'expo.out' }, '-=0.35');
    btn.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open); txt.textContent = open ? 'Close' : 'Menu';
      open ? (tl.play(), lenis && lenis.stop()) : (tl.reverse(), lenis && lenis.start());
    });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) btn.click(); });

    // curtain transition
    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.innerHTML = Array.from({ length: 6 }, () => '<i></i>').join('') + Bloom.bigSVG('riser');
    document.body.appendChild(curtain);
    const cols = $$('i', curtain), glyph = $('svg', curtain);
    const colours = ['#000', '#FFEC3B', '#000', '#FF66A8', '#000', '#1E6BFF'];
    cols.forEach((c, i) => c.style.setProperty('--c', colours[i]));

    if (sessionStorage.getItem('bgb-t') && !reduce) {
      sessionStorage.removeItem('bgb-t');
      gsap.set(cols, { scaleY: 1 });
      gsap.timeline()
        .set(cols, { transformOrigin: 'top' })
        .to(glyph, { scale: 0, rotate: 90, duration: 0.4, ease: 'power2.in' }, 0)
        .to(cols, { scaleY: 0, duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 0.1);
    }
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link]');
      if (!a || e.metaKey || e.ctrlKey || a.target === '_blank') return;
      const url = a.getAttribute('href');
      if (!url || url.startsWith('#')) return;
      e.preventDefault();
      if (reduce) { location.href = url; return; }
      sessionStorage.setItem('bgb-t', '1');
      gsap.timeline({ onComplete: () => { location.href = url; } })
        .set(cols, { transformOrigin: 'bottom' })
        .to(cols, { scaleY: 1, duration: 0.7, stagger: 0.05, ease: 'expo.inOut' })
        .fromTo(glyph, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.35');
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(cols, { scaleY: 0 }); });

    // cursor
    if (matchMedia('(hover: hover)').matches) {
      const dot = document.createElement('div'); dot.className = 'cursor';
      document.body.appendChild(dot);
      const xTo = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3' });
      const yTo = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3' });
      addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });
      document.addEventListener('pointerover', (e) => {
        dot.classList.toggle('is-hover', !!e.target.closest('a, button, .tile, .bar, [data-hover], input, .watch-tile, .bloom-box'));
      });
    }
  }

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  function smooth() {
    if (reduce || !window.Lenis) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -40, duration: 1.4 }); }
    });
  }

  /* ---------- Word split ---------- */
  function split(el) {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = p; w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return $$('.w > span', el);
  }

  function reveals() {
    $$('[data-split]').forEach((el) => {
      const words = split(el);
      if (reduce) return;
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.from(words, {
        yPercent: 115, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay,
        scrollTrigger: el.hasAttribute('data-now') ? null : { trigger: el, start: 'top 88%' }
      });
    });
    $$('[data-reveal]').forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    $$('[data-stagger]').forEach((el) => {
      if (reduce) return;
      gsap.from(el.children, { opacity: 0, y: 30, duration: 0.9, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  }

  /* ---------- Counters ---------- */
  const fmt = (v, dec) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  function counters() {
    $$('[data-count]').forEach((el) => {
      const to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || 0, 10);
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const o = { v: 0 };
      el.textContent = pre + fmt(reduce ? to : 0, dec) + suf;
      if (reduce) return;
      gsap.to(o, { v: to, duration: 2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: () => { el.textContent = pre + fmt(o.v, dec) + suf; } });
    });
    $$('.perf__bar i').forEach((el) => {
      const s = parseFloat(el.dataset.w) / 40;
      if (reduce) { el.style.transform = `scaleX(${s})`; return; }
      gsap.to(el, { scaleX: s, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
    });
  }

  /* ---------- Theme switching ---------- */
  function themes() {
    const secs = $$('[data-theme]').filter((s) => s !== document.body);
    if (!secs.length) return;
    // the section crossing 55% of the viewport owns the page colour
    const pick = () => {
      const line = innerHeight * 0.55;
      const s = secs.find((el) => { const r = el.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
      if (s && document.body.dataset.theme !== s.dataset.theme) document.body.dataset.theme = s.dataset.theme;
    };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: pick, onRefresh: pick });
    pick();
  }

  /* ---------- Blooms ---------- */
  function blooms() {
    $$('[data-glyph]').forEach((el) => {
      const cols = el.dataset.colors ? el.dataset.colors.split(',') : Bloom.randomColors();
      el.innerHTML = Bloom.smallSVG(el.dataset.glyph, cols);
    });

    $$('[data-bloom]').forEach((el) => {
      el.innerHTML = Bloom.bigSVG(el.dataset.bloom, el.dataset.label);
      const parts = $$('.bp', el);
      if (reduce) return;
      gsap.set(parts, { transformOrigin: '50% 50%' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', end: 'center 45%', scrub: 1 } });
      tl.from(parts, { scale: 0, rotate: -120, opacity: 0, stagger: { each: 0.06, from: 'random' }, ease: 'back.out(1.6)' });
      if (el.dataset.spin !== undefined) {
        gsap.to($('svg', el), { rotate: 45, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      }
      // hover: petals open
      if (!el.hasAttribute('data-static')) {
        el.classList.add('bloom-box');
        el.addEventListener('pointerenter', () => parts.forEach((p) => {
          const b = p.getBBox(); const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
          gsap.to(p, { x: cx * 0.16, y: cy * 0.16, duration: 0.7, ease: 'expo.out', overwrite: 'auto' });
        }));
        el.addEventListener('pointerleave', () => gsap.to(parts, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,.5)', overwrite: 'auto' }));
        el.addEventListener('click', () => gsap.fromTo($('svg', el), { rotate: 0 }, { rotate: 90, duration: 1, ease: 'expo.inOut' }));
      }
    });

    $$('[data-field]').forEach((host) => {
      const cv = document.createElement('canvas');
      host.prepend(cv);
      const f = new Bloom.BloomField(cv, { density: parseFloat(host.dataset.field || 0.3) });
      host._field = f;
    });
  }

  /* ---------- Vertical words / parallax ---------- */
  function parallax() {
    if (reduce) return;
    $$('[data-vword] span').forEach((s) => {
      gsap.fromTo(s, { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: s.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-parallax]').forEach((el) => {
      const a = parseFloat(el.dataset.parallax);
      gsap.fromTo(el, { yPercent: -a }, { yPercent: a, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Home hero ---------- */
  function hero() {
    const h = $('.hero');
    if (!h) return;
    const f = h._field;
    if (reduce) return;
    ScrollTrigger.create({
      trigger: h, start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (s) => { if (f) f.progress = s.progress; }
    });
    gsap.to('.hero__title', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: h, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__bloom', { scale: 1.25, opacity: 0, transformOrigin: 'left bottom', ease: 'none', scrollTrigger: { trigger: h, start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- "core." ---------- */
  function core() {
    const p = $('.pin-core');
    if (!p || reduce) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tl.from('.core__word', { scale: 0.18, ease: 'power2.inOut' })
      .from('.core__word', { yPercent: 40, ease: 'power2.out' }, 0);
  }

  /* ---------- Chart ---------- */
  function chart() {
    const root = $('#chart');
    if (!root) return;
    const data = BGB.cumulative, max = 4000;
    const bars = $('.chart__bars', root), years = $('.chart__years', root), tip = $('.chart__tip', root);
    bars.innerHTML = data.map((d) => `<div class="bar" style="--h:${(d.value / max) * 100}%"><div class="bar__fill" style="height:${(d.value / max) * 100}%"></div><span class="bar__val">${d.value.toLocaleString('en-US')}</span></div>`).join('');
    years.innerHTML = data.map((d) => `<span>${d.year}</span>`).join('');
    const barEls = $$('.bar', bars);
    barEls.forEach((b, i) => {
      b.addEventListener('pointerenter', () => {
        const d = data[i], prev = data[i - 1];
        const yoy = prev ? ((d.value / prev.value - 1) * 100) : null;
        tip.innerHTML = `${d.year}<b>$${d.value.toLocaleString('en-US')}B</b>${yoy !== null ? `${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}% vs ${prev.year}` : 'First ranking year'}`;
        const r = b.getBoundingClientRect(), rr = root.getBoundingClientRect();
        tip.style.left = Math.min(Math.max(r.left - rr.left + r.width / 2, 70), rr.width - 70) + 'px';
        tip.style.top = (r.bottom - rr.top - b.querySelector('.bar__fill').offsetHeight) + 'px';
        tip.style.opacity = 1;
        barEls.forEach((o) => o.classList.toggle('is-active', o === b));
      });
    });
    bars.addEventListener('pointerleave', () => { tip.style.opacity = 0; barEls.forEach((o) => o.classList.remove('is-active')); });
    if (reduce) return;
    gsap.from($$('.bar__fill', bars), { scaleY: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035, scrollTrigger: { trigger: root, start: 'top 75%' } });
    gsap.from($$('.bar__val', bars), { opacity: 0, duration: 0.6, stagger: 0.035, delay: 0.4, scrollTrigger: { trigger: root, start: 'top 75%' } });
  }

  /* ---------- Logic flip ---------- */
  function flip() {
    const root = $('#flip');
    if (!root) return;
    const states = {
      before: { comp: [86, 'Hard'], phil: [30, 'Soft'] },
      after: { comp: [30, 'Cheaper'], phil: [90, 'Pricier'] }
    };
    const set = (k) => {
      const s = states[k];
      $('[data-f="comp"] .flip__fill', root).style.width = s.comp[0] + '%';
      $('[data-f="comp"] .flip__val', root).textContent = s.comp[1];
      $('[data-f="phil"] .flip__fill', root).style.width = s.phil[0] + '%';
      $('[data-f="phil"] .flip__val', root).textContent = s.phil[1];
      $$('.flip__toggle button', root).forEach((b) => b.classList.toggle('on', b.dataset.k === k));
    };
    $$('.flip__toggle button', root).forEach((b) => b.addEventListener('click', () => set(b.dataset.k)));
    set('before');
    ScrollTrigger.create({ trigger: root, start: 'top 60%', once: true, onEnter: () => setTimeout(() => set('after'), 900) });
  }

  /* ---------- Four dimensions ---------- */
  function dims() {
    const root = $('#dims');
    if (!root) return;
    const parts = $$('.bp', root);
    const lines = $$('.dim-line'), wrap = $('.dim-lines');
    const labs = $$('.dims__lab', root);
    const keys = ['identifiers', 'structures', 'experiences', 'ecosystem'];
    const on = (k) => {
      const i = keys.indexOf(k);
      parts.forEach((p, j) => {
        if (j < 4) { p.style.transform = j === i ? 'scale(1.12)' : ''; p.style.opacity = i < 0 || j === i ? 1 : 0.35; }
      });
      labs.forEach((l) => l.classList.toggle('on', l.dataset.k === k));
      lines.forEach((l) => l.classList.toggle('on', l.dataset.k === k));
      if (wrap) wrap.classList.toggle('has-active', i >= 0);
    };
    [...labs, ...lines].forEach((el) => {
      el.addEventListener('pointerenter', () => on(el.dataset.k));
      el.addEventListener('pointerleave', () => on(null));
      el.addEventListener('click', () => on(el.dataset.k));
    });
  }

  /* ---------- Causation simulator ---------- */
  function sim() {
    const root = $('#sim');
    if (!root) return;
    const range = $('input', root), a = $('[data-a]', root), b = $('[data-b]', root), note = $('[data-note]', root);
    const upd = () => {
      const v = parseFloat(range.value);
      a.textContent = (v % 1 ? v.toFixed(1) : v) + '%';
      b.textContent = (v * 0.8).toFixed(v * 0.8 % 1 ? 1 : 0) + '%';
      const apple = 514.6 * v / 100;
      note.innerHTML = `For Apple, #1 at $514.6B, a ${a.textContent} rise is <b>+$${apple.toFixed(1)}B</b> of brand value — and, on average, a <b>${b.textContent}</b> share price lift the following year.`;
    };
    range.addEventListener('input', upd); upd();
  }

  /* ---------- Playbook horizontal ---------- */
  function playbook() {
    const root = $('.pb');
    if (!root || reduce) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 701px)', () => {
      const track = $('.pb__track', root);
      const dist = () => track.scrollWidth - innerWidth + 40;
      gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root, pin: $('.pb__pin', root), start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true } });
      $$('.pb-card__glyph', root).forEach((g) => gsap.from(g, { rotate: -180, scale: 0, scrollTrigger: { trigger: root, start: 'top top', end: () => '+=' + dist(), scrub: 1 } }));
    });
  }

  /* ---------- Methodology flower ---------- */
  function mflower() {
    const root = $('#mflower');
    if (!root) return;
    const parts = $$('.bp', root); // 0-3 blue corners, 4-7 cream petals (top,right,bottom,left), 8 centre
    const labs = $$('.mflower__lab', root);
    const map = { strength: 4, financial: 5, role: 6, management: 7 };
    const tabs = $$('.mtab');
    labs.forEach((l) => {
      l.addEventListener('pointerenter', () => { l.classList.add('on'); const p = parts[map[l.dataset.k]]; if (p) p.style.transform = 'scale(1.12)'; });
      l.addEventListener('pointerleave', () => { l.classList.remove('on'); parts.forEach((p) => (p.style.transform = '')); });
    });
    tabs.forEach((t) => t.addEventListener('click', () => { tabs.forEach((o) => o.classList.toggle('on', o === t && !t.classList.contains('on'))); }));
  }

  /* ---------- Brands to watch (touch) ---------- */
  function watch() {
    $$('.watch-tile').forEach((t) => t.addEventListener('click', () => t.classList.toggle('on')));
  }

  /* ---------- Init ---------- */
  shell();
  smooth();
  blooms();
  reveals();
  counters();
  themes();
  parallax();
  hero();
  core();
  chart();
  flip();
  dims();
  sim();
  playbook();
  mflower();
  watch();
  if (window.initRanking) window.initRanking({ gsap, ScrollTrigger, reduce, lenis });
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
