const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function subscribeReducedMotion(onChange: () => void): () => void {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Fired the moment Lenis moves the page, inside its own animation frame. The native scroll
 * event for that move only arrives on the next frame, so anything that must change in step
 * with the scroll (a scene hiding itself, say) listens for this instead and stays in sync.
 */
export const SMOOTH_SCROLL_EVENT = "cozy:smoothscroll";

/**
 * Fired (cancelable) when a link asks to go a long way down or up the page. A listener that takes
 * the trip cancels it, calls `jump` to move the page there at once while it is out of sight, and
 * `finish` when it is done; one that is busy with another trip cancels it and calls `ignore`, and
 * the click comes to nothing. If nobody cancels it, the page glides there instead.
 */
export const NAV_TRIP_EVENT = "cozy:navtrip";

export type NavTripRequest = { hash: string; jump: () => void; finish: () => void; ignore: () => void };
