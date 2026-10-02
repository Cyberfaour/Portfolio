/* Decorative signal choreography. The portfolio remains complete without it. */
(() => {
  'use strict';

  function init() {
    const hero = document.querySelector('.hero');
    if (!hero || hero.dataset.motionReady || !window.requestAnimationFrame) return;

    const canvas = document.createElement('canvas');
    let context;
    try { context = canvas.getContext('2d', { alpha: true }); } catch (_) { return; }
    if (!context) return;

    const button = hero.querySelector('[data-motion-toggle]');
    const label = button?.querySelector('[data-motion-label]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    const root = document.documentElement;
    const TAU = Math.PI * 2;
    let width = 0;
    let height = 0;
    let routes = [];
    let fragments = [];
    let field = null;
    let trailPaint = null;
    let light = root.dataset.theme === 'light';
    let amber = light ? '147,76,22' : '232,137,58';
    let visible = false;
    let paused = !button;
    let pageActive = true;
    let frame = 0;
    let resizeFrame = 0;
    let previous = 0;
    let lastPaint = 0;
    let elapsed = 0;

    canvas.className = 'hero-signal-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    hero.dataset.motionReady = 'true';

    const clamp = value => Math.max(0, Math.min(1, value));
    const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
    const mix = (a, b, t) => a + (b - a) * t;
    // Stable geometry: resizing never generates a different random composition.
    const noise = seed => { const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
    const ink = alpha => `rgba(${amber},${alpha})`;

    function updateControl() {
      if (!button) return;
      button.hidden = !width || !height || reducedMotion.matches || forcedColors.matches;
      button.setAttribute('aria-pressed', String(!paused));
      button.setAttribute('aria-label', paused ? 'Play hero animation' : 'Pause hero animation');
      if (label) label.textContent = paused ? 'Play motion' : 'Pause motion';
    }

    function makePaint() {
      light = root.dataset.theme === 'light';
      amber = light ? '147,76,22' : '232,137,58';
      field = context.createRadialGradient(width * .83, height * .19, 0,
        width * .83, height * .19, Math.max(width * .41, height * .32));
      field.addColorStop(0, ink(light ? .035 : .055));
      field.addColorStop(.45, ink(light ? .012 : .022));
      field.addColorStop(1, ink(0));
      trailPaint = context.createLinearGradient(0, 0, width, 0);
      trailPaint.addColorStop(0, ink(0));
      trailPaint.addColorStop(.38, ink(.025));
      trailPaint.addColorStop(.65, ink(light ? .19 : .24));
      trailPaint.addColorStop(1, ink(light ? .30 : .45));
    }

    function sizeScene() {
      const bounds = hero.getBoundingClientRect();
      const nextWidth = Math.round(bounds.width);
      const nextHeight = Math.round(bounds.height);
      if (!nextWidth || !nextHeight) return;
      width = nextWidth;
      height = nextHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = width <= 900;
      const plans = mobile ? [
        [[.04,.59],[.30,.59],[.30,.65],[.93,.65],[.93,.89]],
        [[.07,.96],[.07,.75],[.21,.75],[.21,.70],[.96,.70]],
        [[.02,.87],[.15,.87],[.15,.93],[.85,.93],[.85,.98]],
        [[.76,.56],[.76,.60],[.97,.60],[.97,.96]]
      ] : [
        [[.40,.13],[.63,.13],[.63,.09],[.89,.09],[.89,.36],[.987,.36]],
        [[.51,.25],[.69,.25],[.69,.17],[.96,.17],[.96,.56]],
        [[.54,.43],[.61,.43],[.61,.34],[.80,.34],[.80,.24],[.995,.24]],
        [[.48,.66],[.595,.66],[.595,.53],[.96,.53],[.96,.89]],
        [[.41,.84],[.57,.84],[.57,.92],[.86,.92],[.86,.98]],
        [[.73,.015],[.73,.075],[.94,.075],[.94,.71],[.985,.71]],
        [[.995,.98],[.985,.98],[.985,.09],[.82,.09],[.82,.025]]
      ];
      fragments = [];
      routes = plans.map((plan, routeIndex) => {
        const points = plan.map(([x, y]) => ({ x: x * width, y: y * height }));
        let length = 0;
        const segments = points.slice(1).map((to, index) => {
          const from = points[index];
          const span = Math.hypot(to.x - from.x, to.y - from.y);
          const start = length;
          length += span;
          const seed = routeIndex * 11 + index + 1;
          const x = width * (mobile ? .08 + noise(seed) * .84 : .43 + noise(seed) * .55);
          const y = height * (mobile ? .57 + noise(seed + 40) * .40 : .05 + noise(seed + 40) * .89);
          const angle = Math.round(noise(seed + 91) * 7) * Math.PI / 4;
          const reach = 7 + noise(seed + 32) * 17;
          fragments.push({ from, to, x, y,
            dx: Math.cos(angle) * reach, dy: Math.sin(angle) * reach,
            delay: noise(seed + 15) * .65, alpha: .08 + noise(seed + 5) * .16 });
          return { from, to, length: span, start };
        });
        return { points, segments, length, offset: routeIndex * .12 };
      });
      makePaint();
      render();
    }

    function pointAt(route, distance) {
      const at = Math.max(0, Math.min(route.length, distance));
      for (const segment of route.segments) {
        if (at <= segment.start + segment.length) {
          const t = segment.length ? (at - segment.start) / segment.length : 0;
          return { x: mix(segment.from.x, segment.to.x, t), y: mix(segment.from.y, segment.to.y, t) };
        }
      }
      return route.points[route.points.length - 1];
    }

    function drawSection(route, from, to) {
      const start = pointAt(route, from);
      context.beginPath();
      context.moveTo(start.x, start.y);
      for (const segment of route.segments) {
        const end = segment.start + segment.length;
        if (end > from && end < to) context.lineTo(segment.to.x, segment.to.y);
      }
      const finish = pointAt(route, to);
      context.lineTo(finish.x, finish.y);
      context.stroke();
    }

    function render() {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      if (forcedColors.matches) return;
      const staticScene = reducedMotion.matches || !button;
      const age = staticScene ? 5 : elapsed / 1000;
      context.globalAlpha = 1;
      context.fillStyle = field;
      context.fillRect(0, 0, width, height);
      context.lineWidth = .75;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      // The fragments settle into the routes once; subsequent motion follows them.
      for (const fragment of fragments) {
        const settle = ease((age - fragment.delay) / 2.6);
        context.strokeStyle = ink(fragment.alpha * (light ? .75 : 1));
        context.beginPath();
        context.moveTo(mix(fragment.x, fragment.from.x, settle), mix(fragment.y, fragment.from.y, settle));
        context.lineTo(mix(fragment.x + fragment.dx, fragment.to.x, settle),
          mix(fragment.y + fragment.dy, fragment.to.y, settle));
        context.stroke();
      }

      const connected = ease((age - 1.6) / 1.8);
      for (const route of routes) {
        // Quiet square terminals make the assembled scene read as infrastructure.
        context.fillStyle = ink(connected * (light ? .26 : .38));
        for (const point of [route.points[0], route.points[route.points.length - 1]]) {
          context.fillRect(point.x - 1.5, point.y - 1.5, 3, 3);
        }
        if (staticScene || age < 2.6) continue;
        const cycle = ((age - 2.6) / 8 + route.offset) % 1;
        const head = cycle * (route.length + 150);
        const tail = Math.max(0, head - 150);
        if (tail >= route.length) continue;
        const end = Math.min(head, route.length);
        const opacity = connected * ease(cycle / .08) * (1 - ease((cycle - .88) / .12));
        context.globalAlpha = opacity;
        context.strokeStyle = trailPaint;
        context.lineWidth = 1.2;
        drawSection(route, tail, end);

        const point = pointAt(route, end);
        const rightWeight = width <= 900 ? .55 : clamp((point.x / width - .38) / .4);
        context.fillStyle = ink(.055 * rightWeight);
        context.beginPath();
        context.arc(point.x, point.y, 10, 0, TAU);
        context.fill();
        context.fillStyle = ink(.14 * rightWeight);
        context.beginPath();
        context.arc(point.x, point.y, 4.2, 0, TAU);
        context.fill();
        context.fillStyle = ink((light ? .6 : .85) * rightWeight);
        context.beginPath();
        context.arc(point.x, point.y, 1.7, 0, TAU);
        context.fill();
        context.globalAlpha = 1;
      }
      context.globalAlpha = 1;
    }

    function shouldRun() {
      return pageActive && visible && !document.hidden && !paused && !reducedMotion.matches && !forcedColors.matches;
    }

    function tick(now) {
      frame = 0;
      if (!shouldRun()) { previous = 0; return; }
      // Rendering at 30fps is sufficient for these slow, fine movements.
      if (!previous) previous = now;
      elapsed += Math.min(now - previous, 100);
      previous = now;
      if (now - lastPaint >= 1000 / 30) {
        lastPaint = now;
        render();
      }
      frame = window.requestAnimationFrame(tick);
    }

    function reconcile() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      lastPaint = 0;
      if (reducedMotion.matches) elapsed = Math.max(elapsed, 4000);
      updateControl();
      render();
      if (shouldRun()) frame = window.requestAnimationFrame(tick);
    }

    function scheduleResize() {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        sizeScene();
        if (!('IntersectionObserver' in window)) checkVisibility();
      });
    }

    function checkVisibility() {
      const bounds = hero.getBoundingClientRect();
      const next = bounds.bottom > 0 && bounds.top < window.innerHeight;
      if (next !== visible) { visible = next; reconcile(); }
    }

    button?.addEventListener('click', () => { paused = !paused; reconcile(); });
    document.addEventListener('visibilitychange', reconcile);
    window.addEventListener('pagehide', () => {
      pageActive = false;
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = 0;
      reconcile();
    });
    window.addEventListener('pageshow', () => { pageActive = true; scheduleResize(); reconcile(); });
    for (const preference of [reducedMotion, forcedColors]) {
      if (preference.addEventListener) preference.addEventListener('change', reconcile);
      else if (preference.addListener) preference.addListener(reconcile);
    }
    if ('MutationObserver' in window) {
      new MutationObserver(() => { makePaint(); render(); })
        .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
    if ('ResizeObserver' in window) new ResizeObserver(scheduleResize).observe(hero);
    window.addEventListener('resize', scheduleResize, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        reconcile();
      }, { threshold: 0 }).observe(hero);
    } else {
      window.addEventListener('scroll', checkVisibility, { passive: true });
    }

    sizeScene();
    checkVisibility();
    reconcile();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
