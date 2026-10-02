/* Progressive enhancements; all page content and navigation work without JS. */
(() => {
  'use strict';
  if (document.documentElement.dataset.portfolioReady) return;
  document.documentElement.dataset.portfolioReady = 'true';
  document.documentElement.classList.add('has-js');

  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    const value = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = value;
    const next = value === 'dark' ? 'light' : 'dark';
    if (themeButton) themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
    if (themeLabel) themeLabel.textContent = next === 'light' ? 'Light theme' : 'Dark theme';
    if (themeColor) themeColor.content = value === 'dark' ? '#090c0e' : '#f5f5f1';
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('ali-portfolio-theme'); } catch (_) { /* Theme still works when storage is unavailable. */ }
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  if (themeButton) {
    themeButton.hidden = false;
    themeButton.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('ali-portfolio-theme', next); } catch (_) { /* No persistence is required for this visit. */ }
    });
  }

  const menuButton = document.querySelector('[data-menu-toggle]');
  const navigation = document.getElementById('primary-navigation');
  if (menuButton && navigation) {
    const mobile = window.matchMedia('(max-width: 900px)');
    const setMenu = (open, restoreFocus = false) => {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Close' : 'Menu';
      navigation.toggleAttribute('data-open', open);
      if (restoreFocus) menuButton.focus();
    };
    menuButton.hidden = false;
    setMenu(false);
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open && mobile.matches) navigation.querySelector('a')?.focus();
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a') && mobile.matches) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false, navigation.contains(document.activeElement) || document.activeElement === menuButton);
      }
    });
    const onViewportChange = () => setMenu(false);
    if (mobile.addEventListener) mobile.addEventListener('change', onViewportChange);
    else if (mobile.addListener) mobile.addListener(onViewportChange);
  }

  const form = document.querySelector('[data-contact-form]');
  if (!form || !window.fetch || !window.FormData || !window.AbortController) return;
  const submit = form.querySelector('[type="submit"]');
  const status = form.querySelector('[data-form-status]');
  if (!submit || !status) return;
  let sending = false;

  form.addEventListener('submit', async (event) => {
    // A normal browser submit event is only raised after native constraints pass.
    if (!form.checkValidity()) return;
    event.preventDefault();
    if (sending) return;
    const payload = new FormData(form);
    const editableFields = [...form.querySelectorAll('input, textarea')];
    const readOnlyBefore = editableFields.map((field) => field.readOnly);
    editableFields.forEach((field) => { field.readOnly = true; });
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (response.ok) {
        form.reset();
        status.dataset.state = 'success';
        status.textContent = 'Message sent. Thanks for getting in touch.';
      } else {
        status.dataset.state = 'error';
        status.textContent = 'Your message wasn’t accepted. Your text is still here. Please try again or use the email link below.';
      }
    } catch (_) {
      status.dataset.state = 'error';
      status.textContent = 'We couldn’t confirm delivery. Your text is still here. Please use the email link below to get in touch.';
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      editableFields.forEach((field, index) => { field.readOnly = readOnlyBefore[index]; });
      submit.disabled = false;
      submit.textContent = 'Send message →';
      form.removeAttribute('aria-busy');
      status.focus({ preventScroll: true });
    }
  });
})();
