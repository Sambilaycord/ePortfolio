"use client";

import { useEffect, useRef, useState } from "react";

import { easeInOutSine, setLandingAtOnce } from "@/lib/camera";
import { NAV_TRIP_EVENT, prefersReducedMotion, type NavTripRequest } from "@/lib/motion";
import { clamp } from "@/lib/utils";

import { CozyDesk } from "./cozy-desk";
import { DESK_WORLD, frameTarget, placeWorld, type DeskTarget } from "./desk-camera";
import { elementAtMidline } from "./site-nav";

/** Where on the desk each stop of the page lives; "desk" is the whole desk, where the page begins. */
type Place = DeskTarget | "desk";

const PLACE_OF: Record<string, Place> = {
  "#top": "desk",
  "#about": "screen",
  "#projects": "screen",
  "#journey": "board",
  "#toolbox": "shelf",
  "#contact": "window",
};

/** What the laptop shows on the way: its lock screen by the hero and the about page, the desktop's wallpaper elsewhere. */
function screenOf(hash: string | null): "lock" | "wallpaper" {
  return hash === "#top" || hash === "#about" ? "lock" : "wallpaper";
}

/** The stop the visitor is at, judged as the nav does. */
function hashInView(): string | null {
  const stops = Object.keys(PLACE_OF).flatMap((hash) => document.getElementById(hash.slice(1)) ?? []);
  const stop = elementAtMidline(stops);
  return stop ? `#${stop.id}` : null;
}

/** The trip's beats, in milliseconds: fading onto the desk, pulling back, a breath on the whole desk, flying in, fading off. */
const FADE_MS = 180;
const OUT_MS = 520;
const HOLD_MS = 90;
const IN_MS = 620;

type Trip = { from: Place; to: Place; request: NavTripRequest };

/**
 * Going somewhere from the nav. Gliding there would play every scene in between, and jumping
 * would teleport, so the nav takes the desk's way round instead: the view fades to the part of
 * the desk it is in (the laptop for the about page and the projects, the cork board, the shelf,
 * the window), pulls back to the whole desk, and flies into the part the link is for, the way
 * the room's own camera does. The page jumps while the whole desk is in view, so it is already
 * in place, and its scenes settled, when the view fades back to it.
 */
export function NavTrip() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [screen, setScreen] = useState<"lock" | "wallpaper">("wallpaper");
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  // The trip under way, if any. It outlives any one run of the effect below, which development's
  // double-mounting restarts, so handing the scroll back is tied to the trip, not to the effect.
  const activeRef = useRef<NavTripRequest | null>(null);

  // Should the overlay go away mid-trip, the page is handed back rather than left frozen.
  useEffect(
    () => () => {
      if (!activeRef.current) return;
      setLandingAtOnce(false);
      activeRef.current.finish();
      activeRef.current = null;
    },
    [],
  );

  useEffect(() => {
    const takeTrip = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const request = event.detail as NavTripRequest;
      // One trip at a time; a click during one is simply let go.
      if (activeRef.current) {
        event.preventDefault();
        request.ignore();
        return;
      }
      const to = PLACE_OF[request.hash];
      const fromHash = hashInView();
      const from = fromHash ? PLACE_OF[fromHash] : "desk";
      // Between two stops on the same part of the desk (the about page and the projects), a glide says it better.
      if (!to || from === to || prefersReducedMotion()) return;
      event.preventDefault();
      activeRef.current = request;
      setScreen(screenOf(fromHash));
      setTrip({ from, to, request });
    };
    window.addEventListener(NAV_TRIP_EVENT, takeTrip);
    return () => window.removeEventListener(NAV_TRIP_EVENT, takeTrip);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!trip || !overlay || !stage || !world) return;

    const { from, to, request } = trip;
    const fromFraming = from === "desk" ? null : frameTarget(stage, world, from);
    const toFraming = to === "desk" ? null : frameTarget(stage, world, to);
    const outMs = fromFraming ? OUT_MS : 0;
    const inMs = toFraming ? IN_MS : 0;
    const jumpAt = FADE_MS + outMs;
    const flyInAt = jumpAt + HOLD_MS;
    const fadeOutAt = flyInAt + inMs;
    const endAt = fadeOutAt + FADE_MS;

    let frame = 0;
    let jumped = false;
    const start = performance.now();

    // Hands the scroll back once the view starts fading to the page; only the first call for this trip counts.
    const handBack = () => {
      if (activeRef.current !== request) return;
      activeRef.current = null;
      setLandingAtOnce(false);
      request.finish();
    };

    const tick = (now: number) => {
      const time = now - start;
      overlay.style.opacity = String(time < FADE_MS ? time / FADE_MS : 1 - clamp((time - fadeOutAt) / FADE_MS, 0, 1));
      if (time < jumpAt) {
        placeWorld(world, fromFraming, outMs ? 1 - easeInOutSine(clamp((time - FADE_MS) / outMs, 0, 1)) : 0);
      } else {
        if (!jumped) {
          jumped = true;
          // Out of sight behind the whole desk: the page moves, and every scene lands where it belongs at once.
          setLandingAtOnce(true);
          request.jump();
          setScreen(screenOf(request.hash));
        }
        placeWorld(world, toFraming, inMs ? easeInOutSine(clamp((time - flyInAt) / inMs, 0, 1)) : 0);
      }
      if (time >= fadeOutAt) handBack();
      if (time < endAt) frame = requestAnimationFrame(tick);
      else setTrip(null);
    };

    placeWorld(world, fromFraming, fromFraming ? 1 : 0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [trip]);

  if (!trip) return null;
  return (
    // Under the header, so the nav stays put through the trip; it takes the clicks meanwhile, so nothing below is hit mid-flight.
    // Inert as well as hidden: the desk's lamp chain is a button, and must not take focus mid-flight.
    <div ref={overlayRef} aria-hidden="true" inert className="fixed inset-0 z-30 bg-brand-bg opacity-0">
      <div ref={stageRef} className="grid size-full place-items-center overflow-hidden">
        <div ref={worldRef} className={DESK_WORLD}>
          <CozyDesk screen={screen} />
        </div>
      </div>
    </div>
  );
}
