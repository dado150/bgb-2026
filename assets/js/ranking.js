/* Ranking explorer — filter, sort, search, list/grid views, detail drawer */
window.initRanking = function ({ gsap, reduce, lenis }) {
  const root = document.getElementById('tiles');
  if (!root) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const brands = BGB.brands;
  const maxVal = brands[0].value;
  const badge = (b) => b.riser ? Bloom.bigSVG('riser') : b.entrant ? Bloom.bigSVG('entrant') : '';
  const chg = (b) => b.change === null ? 'NEW' : (b.change > 0 ? '+' : '') + b.change + '%';
  const pad = (n) => String(n).padStart(2, '0');

  root.innerHTML = brands.map((b) => {
    const mag = b.change === null ? 100 : Math.min(100, 18 + Math.abs(b.change) / 71 * 82);
    const col = b.change === null ? 'var(--blue)' : b.change < 0 ? 'var(--red)' : b.change === 0 ? 'var(--cream)' : 'var(--teal-l)';
    return `<button class="tile" data-rank="${b.rank}" style="--h:${mag}%;--c:${col}" aria-label="${b.rank}. ${b.name}, ${chg(b)}, $${b.value}B">
      <span class="tile__fill"></span>
      <span><span class="tile__rank">${pad(b.rank)}</span><br><span class="tile__name">${b.name}</span></span>
      <span class="tile__lbar"><i style="transform:scaleX(${b.value / maxVal})"></i></span>
      <span class="tile__foot"><span>${b.change === null ? '' : chg(b) + '<br>'}${b.value.toFixed(1)} $B</span></span>
      ${b.riser || b.entrant ? `<span class="tile__badge">${badge(b)}</span><span class="tile__badge-l">${b.riser ? 'TOP RISER' : 'NEW ENTRANT'}</span>` : ''}
    </button>`;
  }).join('');

  const tiles = $$('.tile', root);
  const byRank = Object.fromEntries(tiles.map((t) => [t.dataset.rank, t]));
  const state = { filter: 'all', sort: 'rank', q: '' };
  const count = $('#rk-count'), empty = $('.empty');

  // intro
  if (!reduce) gsap.from(tiles.slice(0, 40), { opacity: 0, y: 30, scale: 0.94, duration: 0.8, ease: 'expo.out', stagger: { each: 0.012, grid: 'auto', from: 'start' }, delay: 0.3 });

  function apply(animate = true) {
    const flipState = animate && window.Flip && !reduce ? Flip.getState(tiles) : null;
    const q = state.q.trim().toLowerCase();
    let list = brands.filter((b) => {
      if (state.filter === 'riser' && !b.riser) return false;
      if (state.filter === 'entrant' && !b.entrant) return false;
      if (state.filter === 'up' && !(b.change > 0)) return false;
      if (state.filter === 'down' && !(b.change < 0)) return false;
      if (q && !b.name.toLowerCase().includes(q) && String(b.rank) !== q) return false;
      return true;
    });
    if (state.filter === 'riser' && state.sort === 'rank') list = BGB.topRisers.map((r) => brands[r - 1]);
    if (state.sort === 'growth') list = [...list].sort((a, b) => (b.change ?? 999) - (a.change ?? 999));
    if (state.sort === 'decline') list = [...list].sort((a, b) => (a.change ?? 999) - (b.change ?? 999));
    if (state.sort === 'value') list = [...list].sort((a, b) => b.value - a.value);
    const show = new Set(list.map((b) => b.rank));
    tiles.forEach((t) => t.classList.toggle('is-hidden', !show.has(+t.dataset.rank)));
    list.forEach((b) => root.appendChild(byRank[b.rank]));
    count.textContent = list.length === 100 ? '1—100' : `${list.length} / 100`;
    empty.style.display = list.length ? 'none' : 'block';
    if (flipState) Flip.from(flipState, { duration: 0.75, ease: 'expo.inOut', stagger: 0.006, absolute: false, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.4 }) });
  }

  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    state.filter = b.dataset.filter;
    $$('[data-filter]').forEach((o) => o.classList.toggle('on', o === b));
    apply();
  }));
  $$('[data-sort]').forEach((b) => b.addEventListener('click', () => {
    state.sort = b.dataset.sort;
    $$('[data-sort]').forEach((o) => o.classList.toggle('on', o === b));
    apply();
  }));
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => {
    const fs = window.Flip && !reduce ? Flip.getState(tiles.filter((t) => !t.classList.contains('is-hidden')).slice(0, 40)) : null;
    document.body.classList.toggle('view-list', b.dataset.view === 'list');
    $$('[data-view]').forEach((o) => o.classList.toggle('on', o === b));
    if (fs) Flip.from(fs, { duration: 0.7, ease: 'expo.inOut', stagger: 0.008 });
    if (b.dataset.view === 'list' && !reduce) gsap.from($$('.tile__lbar i', root), { scaleX: 0, duration: 1, ease: 'expo.out', stagger: 0.008 });
  }));
  let tmr;
  $('#rk-q').addEventListener('input', (e) => { state.q = e.target.value; clearTimeout(tmr); tmr = setTimeout(() => apply(false), 120); });

  // Deep links: ranking.html#risers / #entrants
  const hash = location.hash.replace('#', '');
  const pre = { risers: 'riser', entrants: 'entrant' }[hash];
  if (pre) { const btn = $(`[data-filter="${pre}"]`); if (btn) btn.click(); }

  /* Drawer */
  const drawer = $('.drawer'), scrim = $('.scrim');
  let current = 1;
  function open(rank) {
    current = rank;
    const b = brands[rank - 1];
    $('.drawer__rank', drawer).textContent = pad(b.rank);
    $('.drawer__name', drawer).textContent = b.name;
    $('[data-d="value"]', drawer).textContent = '$' + b.value.toFixed(1) + 'B';
    $('[data-d="chg"]', drawer).textContent = chg(b);
    $('[data-d="flag"]', drawer).textContent = b.riser ? 'Top Riser 2026' : b.entrant ? 'New Entrant 2026' : b.change < 0 ? 'Declined in value' : 'Held or grew value';
    const share = b.value / 3866 * 100;
    $('[data-d="share"]', drawer).textContent = share.toFixed(2) + '%';
    const prev = b.change ? b.value / (1 + b.change / 100) : null;
    $('[data-d="prev"]', drawer).textContent = prev ? '≈ $' + prev.toFixed(1) + 'B' : '—';
    const rows = [[`#${b.rank} ${b.name}`, b.value], ['#1 Apple', 514.6], ['#50 Tesla', 18.3], ['#100 Nissan', 7.2]];
    $('.drawer__cmp', drawer).innerHTML = '<div class="small" style="margin-bottom:6px">Brand value vs. the ranking</div>' + rows.map(([l, v]) =>
      `<div class="row"><span>${l}</span><span class="trk"><i style="width:${Math.max(0.6, v / 514.6 * 100)}%"></i></span><span>$${v}B</span></div>`).join('');
    $('.drawer__glyph', drawer).innerHTML = b.riser ? Bloom.bigSVG('riser') : b.entrant ? Bloom.bigSVG('entrant') : Bloom.smallSVG(Bloom.pick(Bloom.SMALL_KEYS), ['#000', '#fff']);
    drawer.classList.add('open'); scrim.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    if (!reduce) {
      gsap.fromTo('.drawer__rank', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.15 });
      gsap.from('.drawer__cmp .trk i', { width: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.25 });
      gsap.from('.drawer__glyph .bp, .drawer__glyph circle, .drawer__glyph path', { scale: 0, rotate: -90, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)', stagger: 0.04, delay: 0.3 });
    }
  }
  function close() { drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); }
  root.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) open(+t.dataset.rank); });
  $('.drawer__close').addEventListener('click', close);
  scrim.addEventListener('click', close);
  addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') open(Math.min(100, current + 1));
    if (e.key === 'ArrowLeft') open(Math.max(1, current - 1));
  });
  $('[data-dnav="prev"]').addEventListener('click', () => open(Math.max(1, current - 1)));
  $('[data-dnav="next"]').addEventListener('click', () => open(Math.min(100, current + 1)));
};
