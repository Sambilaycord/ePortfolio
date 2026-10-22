/**
 * How much of the lock screen's width the window actually shows, as `--lock-view` on <html>.
 *
 * The lock screen keeps the laptop screen's landscape shape and covers the stage, so on a phone
 * held upright most of its width is off the sides. Its clock is sized in its own container units
 * (so the copy on the laptop and the full-screen copy match exactly through the zoom), and this
 * share lets both shrink the clock to what is visible. It mirrors `.lock-frame` in globals.css:
 * 104% of the stage wide, or 104% of its height in the screen's 190 × 122 shape, whichever is larger.
 *
 * It runs in the head, before the first paint, so the clock never jumps once the page hydrates.
 */
export const LOCK_VIEW_SCRIPT = `(function () {
  var root = document.documentElement;
  function measure() {
    var width = root.clientWidth;
    var frameWidth = Math.max(1.04 * width, 1.04 * window.innerHeight * 190 / 122);
    root.style.setProperty("--lock-view", (width / frameWidth).toFixed(4));
  }
  measure();
  window.addEventListener("resize", measure);
})();`;
