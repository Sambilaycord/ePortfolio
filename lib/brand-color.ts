type Rgb = [number, number, number];

type BrandToken = "bg" | "bg-2" | "glow";

/** Used only when the stylesheet has not loaded or a token is missing. */
const FALLBACKS: Record<BrandToken, Rgb> = {
  bg: [0.969, 0.941, 0.898],
  "bg-2": [0.937, 0.89, 0.812],
  glow: [1, 0.843, 0.604],
};

/**
 * Calls `onChange` whenever the brand tokens may have changed: the theme class on
 * <html> flips, or dev hot-reload swaps stylesheets under a mounted page. A canvas
 * that read its colours at mount would otherwise keep painting the old palette.
 */
export function watchBrandColors(onChange: () => void): () => void {
  const stylesheetObserver = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLLinkElement) {
          // A new <link> has not applied yet; wait for it rather than reading stale values.
          node.addEventListener("load", onChange, { once: true });
          return;
        }
        if (node instanceof HTMLStyleElement) {
          onChange();
          return;
        }
      }
    }
  });
  stylesheetObserver.observe(document.head, { childList: true, subtree: true });

  const themeObserver = new MutationObserver(onChange);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  return () => {
    stylesheetObserver.disconnect();
    themeObserver.disconnect();
  };
}

/**
 * Resolves a brand token to RGB for a shader uniform.
 *
 * Canvas 2D performs the colour conversion, which keeps globals.css the single
 * source of truth for colour instead of duplicating values in GLSL.
 */
export function readBrandColor(token: BrandToken): Rgb {
  const fallback = FALLBACKS[token];
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--brand-${token}`).trim();
  if (!raw) return fallback;

  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });
  if (!context) return fallback;

  context.fillStyle = "#000000";
  context.fillStyle = raw;
  // An unparseable value leaves fillStyle untouched, which would paint the surface black.
  if (context.fillStyle === "#000000") return fallback;

  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}
