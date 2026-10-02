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
    if (themeColor) themeColor.content = value === 'dark' ? '#060606' : '#f7f4ee';
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('ali-portfolio-theme'); } catch (_) { /* Theme still works when storage is unavailable. */ }
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  if (themeButton) {
    // A blurred header creates a containing block; keep the floating control at body level.
    document.body.append(themeButton);
    themeButton.insertAdjacentHTML('afterbegin', '<svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/></svg><svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M20.5 14.2A8.8 8.8 0 0 1 9.8 3.5a8.8 8.8 0 1 0 10.7 10.7Z"/></svg>');
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

  // The clock displays local time only; it does not imply a live telemetry feed.
  const localTime = document.querySelector('[data-local-time]');
  if (localTime && window.Intl) {
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      });
      const updateClock = () => {
        const now = new Date();
        localTime.textContent = formatter.format(now);
        localTime.dateTime = now.toISOString();
        localTime.hidden = false;
        const fallback = document.querySelector('[data-clock-fallback]');
        if (fallback) fallback.hidden = true;
      };
      updateClock();
      window.setInterval(() => { if (!document.hidden) updateClock(); }, 60000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); });
    } catch (_) { /* The static UTC+04 label remains available. */ }
  }

  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  let scrollFrame = null;
  const updateScroll = () => {
    scrollFrame = null;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    if (header) {
      const threshold = header.hasAttribute('data-compact') ? 20 : 80;
      header.toggleAttribute('data-compact', window.scrollY > threshold);
    }
    if (window.scrollY < 150 && navigation) {
      navigation.querySelectorAll('[aria-current]').forEach(link => link.removeAttribute('aria-current'));
    }
  };
  const scheduleScroll = () => {
    if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateScroll);
  };
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  if (document.fonts?.ready) document.fonts.ready.then(scheduleScroll);
  updateScroll();

  if ('IntersectionObserver' in window) {
    const sectionLinks = [...(navigation?.querySelectorAll('a[href^="#"]') || [])];
    const markCurrentSection = entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        sectionLinks.forEach(link => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    };
    let sectionObserver;
    const observeSections = () => {
      if (sectionObserver) sectionObserver.disconnect();
      const top = Math.round(window.innerHeight * .15);
      const bottom = Math.round(window.innerHeight * .65);
      sectionObserver = new IntersectionObserver(markCurrentSection, {
        rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0
      });
      sectionLinks.forEach(link => {
        const section = document.getElementById(link.getAttribute('href').slice(1));
        if (section) sectionObserver.observe(section);
      });
    };
    observeSections();
    window.addEventListener('resize', observeSections);

    // Content is visible before observation; an unavailable API never hides it.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealing');
          revealObserver.unobserve(entry.target);
        }
      }, { threshold: .12 });
      document.querySelectorAll('.section-heading').forEach(heading => revealObserver.observe(heading));
    }
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
