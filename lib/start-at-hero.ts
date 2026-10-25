/**
 * Every visit opens on the hero, however the last one ended.
 *
 * Browsers put a reloaded or reopened page back where it was scrolled, and a URL still carrying a
 * section's hash (the nav pushes one) jumps straight to that section. This turns scroll restoration
 * off, and on a reload or a return through history drops the hash before the body parses. A fresh
 * visit keeps its hash, so a shared link to a section still opens there. Back and forward between
 * sections within a visit are SmoothScroll's job.
 */
export const START_AT_HERO_SCRIPT = `(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) return;
  var entry = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  var returning = entry && (entry.type === "reload" || entry.type === "back_forward");
  if (returning) history.replaceState(history.state, "", location.pathname + location.search);
})();`;
