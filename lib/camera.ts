import { prefersReducedMotion } from "@/lib/motion";

/**
 * A camera that moves toward a point the way a real lens does. Scale is interpolated on a
 * log scale (each step of scroll multiplies the zoom by the same amount), and the target
 * only travels toward the centre as fast as the zoom closes in on it. Interpolating scale
 * and position linearly instead makes the first half of a deep zoom read as a sideways pan.
 *
 * `shift` is how far the target has travelled toward the centre, 0 to 1.
 */
export function dolly(fill: number, progress: number): { scale: number; shift: number } {
  const scale = fill ** progress;
  const shift = Math.abs(fill - 1) < 1e-6 ? progress : (scale - 1) / (fill - 1);
  return { scale, shift };
}

export function easeInOutSine(progress: number): number {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

let landingAtOnce = false;

/**
 * While set, every scene following the scroll lands on it at once instead of easing there: for a
 * jump made out of sight (the nav's trips), after which the scene should simply be in place.
 */
export function setLandingAtOnce(landing: boolean) {
  landingAtOnce = landing;
}

/** How long the camera takes to close half the gap to where the scroll says it should be. */
const CAMERA_HALF_LIFE_MS = 60;

/**
 * Lets a scene follow the scroll instead of being bolted to it. A fast flick moves the scroll a
 * whole zoom's worth, or several app windows' worth, in two or three frames, and a scene tied
 * straight to it jumps through all of it at once: a zoom leaps six times bigger per frame, and
 * windows open and shut within a frame or two, which reads as strobing. Following eases toward
 * the scroll, and `maxSpeed` (progress per second) caps how fast it may go, so however hard the
 * page is flung, every move still plays as motion. `apply` gets the smoothed value each frame.
 */
export function followScroll(apply: (value: number) => void, maxSpeed = Number.POSITIVE_INFINITY) {
  let current = Number.NaN;
  let target = 0;
  let frame = 0;
  let last = 0;

  const step = (now: number) => {
    const elapsed = Math.min(now - last, 100);
    last = now;
    const eased = (target - current) * (1 - 2 ** (-elapsed / CAMERA_HALF_LIFE_MS));
    const limit = (maxSpeed * elapsed) / 1000;
    current += Math.max(-limit, Math.min(limit, eased));
    if (Math.abs(target - current) < 1e-4) current = target;
    apply(current);
    frame = current === target ? 0 : requestAnimationFrame(step);
  };

  return {
    set(next: number) {
      target = next;
      // The first reading, any reading for visitors who prefer less motion, and any made during a jump land at once.
      if (Number.isNaN(current) || prefersReducedMotion() || landingAtOnce) {
        cancelAnimationFrame(frame);
        frame = 0;
        current = target;
        apply(current);
        return;
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    },
    /** Applies the current value again, for when what it is applied to has been re-measured. */
    refresh() {
      if (!Number.isNaN(current)) apply(current);
    },
    dispose() {
      cancelAnimationFrame(frame);
    },
  };
}
