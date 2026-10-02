// Preserve bookmarked fragments and query strings on legacy portfolio URLs.
(() => {
  const target = document.body.dataset.redirect;
  if (!target) return;
  const destination = new URL(target, window.location.href);
  destination.search = window.location.search;
  destination.hash = window.location.hash;
  window.location.replace(destination.href);
})();
