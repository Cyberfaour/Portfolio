/* Optional explanation; the closed, static drawing is the default experience. */
(() => {
  'use strict';
  const blueprint = document.querySelector('[data-hero-blueprint]');
  if (!blueprint || blueprint.hasAttribute('data-blueprint-ready')) return;
  const hero = blueprint.closest('.hero');
  const disclosure = blueprint.querySelector('[data-blueprint-disclosure]');
  const summary = blueprint.querySelector('[data-blueprint-summary]');
  const controls = blueprint.querySelector('[data-blueprint-controls]');
  const buttons = [...blueprint.querySelectorAll('[data-blueprint-layer]')];
  const panels = [...blueprint.querySelectorAll('[data-blueprint-panel]')];
  if (!hero || !disclosure || !controls || buttons.length !== panels.length || !buttons.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forced = window.matchMedia('(forced-colors: active)');
  let selected = 'field';
  let started = false;
  let building = false;
  let observer = null;

  function updateState() {
    if (disclosure.open) {
      if (hero.dataset.blueprintActive !== 'exploring') hero.dataset.blueprintActive = 'exploring';
      blueprint.dataset.activeLayer = selected;
    } else {
      delete blueprint.dataset.activeLayer;
      if (building) {
        if (hero.dataset.blueprintActive !== 'building') hero.dataset.blueprintActive = 'building';
      } else if (hero.hasAttribute('data-blueprint-active')) delete hero.dataset.blueprintActive;
    }
    if (summary) summary.textContent = disclosure.open ? 'Close the connections' : 'Explore the connections';
  }

  function settle() {
    building = false;
    blueprint.classList.remove('is-constructing');
    updateState();
    if (started && observer) observer.disconnect();
  }

  function choose(layer) {
    if (!panels.some(panel => panel.dataset.blueprintPanel === layer)) return;
    selected = layer;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.blueprintLayer === layer)));
    panels.forEach(panel => { panel.hidden = panel.dataset.blueprintPanel !== layer; });
    updateState();
  }

  function construct() {
    if (started) return;
    started = true;
    if (reduced.matches || forced.matches || disclosure.open || document.hidden ||
        hero.dataset.motionPaused === 'true' || !window.CSS?.supports('animation-name', 'blueprint-construct')) return;
    building = true;
    updateState();
    blueprint.classList.add('is-constructing');
    const finalStroke = blueprint.querySelector('.blueprint-routes .blueprint-draw');
    if (!finalStroke || !window.getComputedStyle(finalStroke).animationName.includes('blueprint-construct')) settle();
  }

  buttons.forEach(button => button.addEventListener('click', () => choose(button.dataset.blueprintLayer)));
  disclosure.addEventListener('toggle', () => {
    if (disclosure.open) settle();
    else updateState();
  });
  blueprint.addEventListener('animationend', event => {
    if (event.animationName === 'blueprint-construct' && event.target.closest('.blueprint-routes')) settle();
  });
  const stopForPreference = () => { if (reduced.matches || forced.matches) settle(); };
  for (const preference of [reduced, forced]) {
    if (preference.addEventListener) preference.addEventListener('change', stopForPreference);
    else if (preference.addListener) preference.addListener(stopForPreference);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  if ('MutationObserver' in window) {
    new MutationObserver(() => { if (hero.dataset.motionPaused === 'true') settle(); })
      .observe(hero, { attributes: true, attributeFilter: ['data-motion-paused'] });
  }

  blueprint.setAttribute('data-blueprint-ready', '');
  controls.hidden = false;
  choose(selected);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) construct();
      else if (building) settle();
      if (started && !building) observer.disconnect();
    }, { threshold: .35 });
    observer.observe(blueprint);
  } else construct();
})();
