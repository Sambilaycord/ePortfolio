"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { NAV_TRIP_EVENT, SMOOTH_SCROLL_EVENT, type NavTripRequest } from "@/lib/motion";

const SECTION_GLIDE_SECONDS = 1.2;
/** Beyond this many screens a link is a trip, not a glide: gliding would run every scene in between. */
const TRIP_SCREENS = 1.5;
/** How much of the remaining distance each frame covers. Lenis defaults to 0.1; lower glides longer and floatier. */
const WHEEL_EASE = 0.07;
const SCROLL_TO_EVENT = "cozy:scrollto";

/** Glides the page to a scroll offset through Lenis, which owns the scroll position while it runs. */
export function scrollPageTo(top: number) {
  window.dispatchEvent(new CustomEvent(SCROLL_TO_EVENT, { detail: top }));
}

/**
 * Lenis drives the native scroll position rather than transforming the page, so
 * sticky cards, IntersectionObservers and CSS scroll timelines keep working as-is.
 * It already stands down for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, stopInertiaOnNavigate: true, lerp: WHEEL_EASE });

    function glideToSamePageSection(event: MouseEvent) {
      const hash = samePageHashOf(event);
      if (!hash) return;

      // Capturing at the window runs before Next's <Link> sees the click, which would otherwise jump there instantly.
      event.preventDefault();
      event.stopPropagation();

      const distance = Math.abs(document.getElementById(decodeURIComponent(hash.slice(1)))?.getBoundingClientRect().top ?? 0);
      const trip = distance > window.innerHeight * TRIP_SCREENS ? offerTrip(hash) : "declined";
      if (trip === "ignored") return;
      if (hash !== window.location.hash) window.history.pushState(null, "", hash);
      if (trip === "taken") return;
      // Lenis's default lerp covers most of a long jump in the first few frames, which reads as a teleport.
      lenis.scrollTo(hash, { duration: SECTION_GLIDE_SECONDS, easing: easeInOutCubic });
    }

    // The page holds still while a trip is under way, and jumps only when the trip says so.
    function offerTrip(hash: string): "taken" | "ignored" | "declined" {
      let ignored = false;
      const request: NavTripRequest = {
        hash,
        jump: () => lenis.scrollTo(hash, { immediate: true, force: true }),
        finish: () => lenis.start(),
        ignore: () => {
          ignored = true;
        },
      };
      const cancelled = !window.dispatchEvent(new CustomEvent(NAV_TRIP_EVENT, { detail: request, cancelable: true }));
      if (!cancelled) return "declined";
      if (ignored) return "ignored";
      lenis.stop();
      return "taken";
    }

    function glideToRequestedOffset(event: Event) {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "number") return;
      lenis.scrollTo(event.detail, { duration: SECTION_GLIDE_SECONDS, easing: easeInOutCubic });
    }

    // Scroll restoration is off (lib/start-at-hero.ts), so back and forward land on their step's section here.
    function jumpToHistoryStep() {
      lenis.scrollTo(window.location.hash || 0, { immediate: true, force: true });
    }

    const announceScroll = () => window.dispatchEvent(new Event(SMOOTH_SCROLL_EVENT));
    lenis.on("scroll", announceScroll);

    window.addEventListener("click", glideToSamePageSection, { capture: true });
    window.addEventListener(SCROLL_TO_EVENT, glideToRequestedOffset);
    window.addEventListener("popstate", jumpToHistoryStep);
    return () => {
      window.removeEventListener("click", glideToSamePageSection, { capture: true });
      window.removeEventListener(SCROLL_TO_EVENT, glideToRequestedOffset);
      window.removeEventListener("popstate", jumpToHistoryStep);
      lenis.off("scroll", announceScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}

function easeInOutCubic(progress: number): number {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

function samePageHashOf(event: MouseEvent): string | null {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  // Keyboard activation (detail 0) keeps the native jump, which also moves focus — the skip link depends on it.
  if (event.detail === 0) return null;
  if (!(event.target instanceof Element)) return null;

  const link = event.target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return null;

  const url = new URL(link.href);
  const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
  if (!isSamePage || !url.hash) return null;

  return document.getElementById(decodeURIComponent(url.hash.slice(1))) ? url.hash : null;
}
