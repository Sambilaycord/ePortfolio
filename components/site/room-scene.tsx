"use client";

import { useEffect, useRef } from "react";

import { easeInOutSine, followScroll } from "@/lib/camera";
import { pantryJarCount } from "@/lib/pantry";
import { journey } from "@/lib/site";
import { segment, useSceneProgress } from "@/lib/use-scene-progress";
import { cssVars } from "@/lib/utils";

import { EveningSky } from "./contact";
import { CozyDesk } from "./cozy-desk";
import { DESK_TARGETS, DESK_WORLD, frameTarget, placeWorld, type DeskTarget, type Framing } from "./desk-camera";
import { OsWallpaper } from "./os-wallpaper";
import { JourneyBoard } from "./journey-board";
import { PantryShelves } from "./pantry-shelves";

type Target = DeskTarget;

const SCENE_SCREENS = 12;
const TRAVEL_SCREENS = SCENE_SCREENS - 1;

/** A point in the scene, given in screens of scroll from its start, as scene progress. */
function at(screens: number): number {
  return screens / TRAVEL_SCREENS;
}

/** Screens of scroll over which the jars are set down, one after another, and how long the full shelves then stay to be read. */
const STOCKING_SCREENS = 2.1;
const FULL_SHELF_SCREENS = 0.8;

/** When the camera has arrived at the board, and when it leaves, in screens. */
const BOARD_ARRIVED = 2.16;
const BOARD_LEAVES = 4.41;

const SHELF_ARRIVED = 6.3;
const JARS_START = 6.48;
const JARS_DONE = JARS_START + STOCKING_SCREENS;
const SHELF_LEAVES = JARS_DONE + FULL_SHELF_SCREENS;

/** The camera's route through the scene, in scene progress. Each move goes between the whole desk and one close-up. */
const MOVES: { start: number; end: number; target: Target; zoomingIn: boolean }[] = [
  { start: at(0), end: at(0.81), target: "screen", zoomingIn: false },
  { start: at(1.17), end: at(BOARD_ARRIVED), target: "board", zoomingIn: true },
  { start: at(BOARD_LEAVES), end: at(5.22), target: "board", zoomingIn: false },
  { start: at(5.49), end: at(SHELF_ARRIVED), target: "shelf", zoomingIn: true },
  { start: at(SHELF_LEAVES), end: at(SHELF_LEAVES + 0.54), target: "shelf", zoomingIn: false },
  { start: at(SHELF_LEAVES + 0.72), end: at(TRAVEL_SCREENS), target: "window", zoomingIn: true },
];

/** Where the camera is held on a close-up between moves. */
const HOLDS: { start: number; end: number; target: Target }[] = [
  { start: at(BOARD_ARRIVED), end: at(BOARD_LEAVES), target: "board" },
  { start: at(SHELF_ARRIVED), end: at(SHELF_LEAVES), target: "shelf" },
];

/** The camera's target and how far into it, 0 (whole desk) to 1 (filling the stage). */
function cameraAt(progress: number): { target: Target; depth: number } | null {
  const hold = HOLDS.find((stretch) => progress >= stretch.start && progress <= stretch.end);
  if (hold) return { target: hold.target, depth: 1 };
  const move = MOVES.find((stretch) => progress >= stretch.start && progress <= stretch.end);
  if (!move) return null;
  const through = easeInOutSine(segment(progress, move.start, move.end));
  return { target: move.target, depth: move.zoomingIn ? through : 1 - through };
}

/**
 * Back at the desk after the projects. The camera pulls back from the laptop to the whole room,
 * then visits its corners: it flies into the cork board, which becomes how I got here, back out,
 * into the little jars on the shelf, which become the pantry of tools, and last out through the
 * window as night falls, into the sky the contact scene is set on.
 */
export function RoomScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const framingsRef = useRef<Partial<Record<Target, Framing>>>({});
  const followRef = useRef<ReturnType<typeof followScroll> | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;
    const measure = () => {
      const transform = world.style.transform;
      world.style.transform = "none";
      for (const target of DESK_TARGETS) {
        const framing = frameTarget(stage, world, target);
        if (framing) framingsRef.current[target] = framing;
      }
      world.style.transform = transform;
      followRef.current?.refresh();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Everything in the room reads the smoothed progress, so the close-ups stay in step with the camera that frames them.
  function placeRoom(progress: number) {
    const scene = sceneRef.current;
    const world = worldRef.current;
    if (!scene || !world) return;

    const camera = cameraAt(progress);
    placeWorld(world, camera && framingsRef.current[camera.target], camera?.depth ?? 0);

    scene.style.setProperty("--wake", (1 - segment(progress, 0, at(0.18))).toFixed(4));
    scene.style.setProperty("--night", segment(progress, at(TRAVEL_SCREENS - 0.45), at(TRAVEL_SCREENS - 0.045)).toFixed(4));
    const string = segment(progress, at(2.34), at(4.05));
    const board = segment(progress, at(1.98), at(2.25)) - segment(progress, at(4.23), at(4.5));
    const pantry = segment(progress, at(SHELF_ARRIVED - 0.09), at(JARS_START)) - segment(progress, at(SHELF_LEAVES - 0.18), at(SHELF_LEAVES + 0.09));
    scene.style.setProperty("--board", board.toFixed(4));
    scene.style.setProperty("--string", string.toFixed(4));
    scene.style.setProperty("--pantry", pantry.toFixed(4));
    // A close-up only takes clicks and hovers while it is actually on screen.
    scene.toggleAttribute("data-board", board > 0);
    scene.toggleAttribute("data-pantry", pantry > 0);
    scene.style.setProperty("--stock", (segment(progress, at(JARS_START), at(JARS_DONE)) * (pantryJarCount + 1)).toFixed(3));
    // The stop just reached, for phones, where only its note is shown.
    const reached = journey.filter((_, index) => string >= index * 0.3).length - 1;
    scene.dataset.stop = String(Math.max(0, reached));
  }

  useSceneProgress(sceneRef, (progress) => {
    // Each camera move (about a tenth of the scene) takes at least a quarter of a second, however fast the scroll.
    followRef.current ??= followScroll(placeRoom, 0.4);
    followRef.current.set(progress);
  });

  useEffect(() => () => followRef.current?.dispose(), []);

  return (
    <section ref={sceneRef} className="scene scene--handoff room-scene" data-shows-room="" style={{ height: `${SCENE_SCREENS * 100}svh` }}>
      {/*
        Anchors for the two close-ups, so links can land on them and the nav can mark them. Each
        spans the stretch of scroll its close-up is on screen, pushed down half a screen because
        the nav judges a section by what crosses the middle of the viewport.
      */}
      <span id="journey" aria-hidden="true" className="absolute inset-x-0" style={{ top: `calc(${BOARD_ARRIVED * 100}svh + 50svh)`, height: `${(BOARD_LEAVES - BOARD_ARRIVED) * 100}svh` }} />
      <span id="toolbox" aria-hidden="true" className="absolute inset-x-0" style={{ top: `calc(${SHELF_ARRIVED * 100}svh + 50svh)`, height: `${(SHELF_LEAVES - SHELF_ARRIVED) * 100}svh` }} />

      <div ref={stageRef} className="scene-stage grid place-items-center">
        <div ref={worldRef} className={`room-world ${DESK_WORLD}`}>
          <CozyDesk screen="wallpaper" />
        </div>
        {/* The wallpaper the projects chapter ends on, filling the screen, gone by the time the camera has pulled back. */}
        <div aria-hidden="true" className="room-wake absolute inset-0" style={cssVars({ "--p": "1" })}>
          <div className="lock-frame">
            <OsWallpaper />
          </div>
        </div>
        <div className="room-close-up room-close-up--board">
          <JourneyBoard />
        </div>
        <div className="room-close-up room-close-up--pantry">
          <PantryShelves />
        </div>
        {/* The evening coming in through the window as the camera flies out of it: the sky the contact scene takes over on. */}
        <div className="room-night night-palette absolute inset-0">
          <EveningSky />
        </div>
      </div>
    </section>
  );
}
