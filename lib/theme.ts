const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_CHANGE_EVENT = "cozy:themechange";

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    // Storage throws when site data is blocked; following the OS is the right default then.
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark" || (theme === "system" && matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Without storage the choice still applies to this page view; it just won't be remembered.
  }
  applyTheme(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** Keeps the page in step with OS changes (for "system") and with choices made in other tabs. */
export function subscribeTheme(onChange: () => void): () => void {
  const media = matchMedia(DARK_QUERY);
  const resync = () => {
    applyTheme(readTheme());
    onChange();
  };

  media.addEventListener("change", resync);
  window.addEventListener("storage", resync);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", resync);
    window.removeEventListener("storage", resync);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

/**
 * Runs in <head> before first paint. Applying the class from React would render one
 * frame in the wrong theme, which is a visible white flash on a dark-mode visit.
 */
export const THEME_INIT_SCRIPT = `(function () {
  var theme = "system";
  try { theme = localStorage.getItem(${JSON.stringify(STORAGE_KEY)}) || "system"; } catch (error) {}
  var isDark = theme === "dark" || (theme !== "light" && matchMedia(${JSON.stringify(DARK_QUERY)}).matches);
  document.documentElement.classList.toggle("dark", isDark);
})();`;
