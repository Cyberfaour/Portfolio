/* Shared theme controller (dark default ⇄ light) + parallax for the portfolio + case studies.
   Pages are authored dark with inline styles. The DC runtime re-serializes every inline
   color to spaced rgb()/rgba() form, so this works on PARSED color values (not raw strings):
   each rgb()/rgba() occurrence is parsed, remapped, and rewritten. Reversible by construction.
   Accents (amber, navy, green, red overlays) and photo overlays (rgb 6,6,6 WITH alpha) are kept. */
(function () {
  var KEY = 'af-theme';

  // dark solid (r,g,b) -> light solid css
  var SOLID = {
    '6,6,6': 'rgb(247,244,238)',     // page / card / section bg  (#060606)
    '13,13,13': 'rgb(239,234,225)',  // hover surface             (#0d0d0d)
    '11,11,11': 'rgb(240,235,226)',  // image-panel header        (#0b0b0b)
    '245,245,245': 'rgb(26,22,15)',  // primary text / btn bg     (#f5f5f5)
    '207,207,207': 'rgb(58,53,44)',  // (#cfcfcf)
    '232,232,232': 'rgb(42,38,30)',  // (#e8e8e8)
    '154,154,154': 'rgb(92,86,75)',  // (#9a9a9a)
    '138,138,138': 'rgb(107,100,88)',// (#8a8a8a)
    '122,122,122': 'rgb(131,124,110)',// (#7a7a7a)
    '85,85,85': 'rgb(179,173,160)'   // (#555 arrows)
  };
  // build inverse: light (r,g,b) -> dark css
  var SOLID_INV = {};
  Object.keys(SOLID).forEach(function (k) {
    var lv = SOLID[k].replace(/rgba?\(|\)/g, '').split(',').map(function (s) { return parseFloat(s); });
    SOLID_INV[lv[0] + ',' + lv[1] + ',' + lv[2]] = 'rgb(' + k + ')';
  });

  function xform(match, toLight) {
    var nums = match.replace(/rgba?\(|\)/g, '').split(',').map(function (s) { return parseFloat(s); });
    var r = nums[0], g = nums[1], b = nums[2], a = nums.length > 3 ? nums[3] : null;
    var key = r + ',' + g + ',' + b;
    if (toLight) {
      if (SOLID[key] && a == null) return SOLID[key];               // dark solid -> light solid
      if (r === 255 && g === 255 && b === 255) return 'rgba(0,0,0,' + a + ')'; // white border/overlay -> black
      if (r === 0 && g === 0 && b === 0 && a != null && a >= 0.2) return 'rgba(120,110,90,0.12)'; // dark input bg -> warm tint
      return match;                                                  // accents / photo overlays / mask black: keep
    } else {
      if (SOLID_INV[key] && a == null) return SOLID_INV[key];        // light solid -> dark solid
      if (r === 0 && g === 0 && b === 0 && a != null) return 'rgba(255,255,255,' + a + ')'; // black border -> white
      if (r === 120 && g === 110 && b === 90) return 'rgba(0,0,0,0.3)'; // warm tint -> dark input bg
      return match;
    }
  }

  function remap(str, toLight) {
    if (!str || str.indexOf('rgb') === -1) return str;
    return str.replace(/rgba?\([^)]*\)/g, function (m) { return xform(m, toLight); });
  }

  function applyEl(el, toLight) {
    if (!el || !el.getAttribute) return;
    var s = el.getAttribute('style');
    if (!s) return;
    var n = remap(s, toLight);
    if (n !== s) el.setAttribute('style', n);
  }

  function applyAll(toLight) {
    applyEl(document.body, toLight);
    var els = document.querySelectorAll('[style]');
    for (var i = 0; i < els.length; i++) applyEl(els[i], toLight);
  }

  // recolor with transitions suppressed, so per-element `transition` rules can't
  // fight the swap (cards have `transition: background .4s`).
  function applyAllInstant(toLight) {
    var kill = document.createElement('style');
    kill.textContent = '*{transition:none !important}';
    document.head.appendChild(kill);
    applyAll(toLight);
    void document.body.offsetWidth; // force reflow so the no-transition state commits
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (kill.parentNode) kill.parentNode.removeChild(kill); }); });
  }

  window.__themeLight = (localStorage.getItem(KEY) === 'light');

  function paintBody() {
    document.body.style.background = window.__themeLight ? 'rgb(247,244,238)' : 'rgb(6,6,6)';
    document.body.style.color = window.__themeLight ? 'rgb(26,22,15)' : 'rgb(245,245,245)';
  }

  window.__navBg = function (scrolled) {
    if (window.__themeLight) return scrolled ? 'rgba(247,244,238,0.88)' : 'rgba(247,244,238,0.62)';
    return scrolled ? 'rgba(6,6,6,0.82)' : 'rgba(6,6,6,0.55)';
  };
  function paintNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;
    var y = window.scrollY || window.pageYOffset || 0;
    nav.style.background = window.__navBg(y > 60);
  }

  var btn;
  function makeBtn() {
    if (btn || !document.body) return;
    btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Toggle light / dark theme');
    btn.style.cssText = 'position:fixed;right:22px;bottom:22px;z-index:3000;width:46px;height:46px;border-radius:50%;border:1px solid rgba(120,120,120,0.4);background:rgba(120,120,120,0.14);backdrop-filter:blur(12px);color:#e8893a;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .25s cubic-bezier(.2,0,0,1);';
    btn.onmouseenter = function () { btn.style.transform = 'scale(1.08)'; };
    btn.onmouseleave = function () { btn.style.transform = 'scale(1)'; };
    btn.onclick = toggle;
    document.body.appendChild(btn);
    paintBtn();
  }
  function paintBtn() { if (btn) btn.textContent = window.__themeLight ? '☀' : '☾'; }

  function toggle() {
    var toLight = !window.__themeLight;
    applyAllInstant(toLight);
    window.__themeLight = toLight;
    localStorage.setItem(KEY, toLight ? 'light' : 'dark');
    paintBody();
    paintBtn();
    paintNav();
  }

  // light-mode hover correction: the DC runtime re-applies template (dark) hover styles;
  // re-light the hovered element + ancestors on the next frame.
  function hoverFix(e) {
    if (!window.__themeLight) return;
    var node = e.target;
    requestAnimationFrame(function () {
      var n = node, hops = 0;
      while (n && n !== document.body && hops < 8) { applyEl(n, true); n = n.parentElement; hops++; }
    });
  }

  // parallax
  var parallaxEls = [];
  function collectParallax() { parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]')); }
  function runParallax() {
    var y = window.scrollY || window.pageYOffset || 0;
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var sp = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      el.style.transform = 'translate3d(0,' + (y * sp).toFixed(1) + 'px,0)';
    }
  }

  function init() {
    makeBtn();
    collectParallax();
    if (window.__themeLight) applyAllInstant(true);
    paintBody();
    paintNav();
    runParallax();
  }

  var raf = null;
  var obs = new MutationObserver(function () {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      makeBtn();
      collectParallax();
      if (window.__themeLight) applyAll(true);
      paintNav();
    });
  });

  function start() {
    init();
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('scroll', function () { runParallax(); paintNav(); }, { passive: true });
    window.addEventListener('resize', function () { runParallax(); paintNav(); }, { passive: true });
    document.addEventListener('mouseover', hoverFix, true);
    document.addEventListener('mouseout', hoverFix, true);
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
