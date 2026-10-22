import { dolly } from "@/lib/camera";

/** The parts of the desk a camera can fly into. */
export type DeskTarget = "screen" | "board" | "shelf" | "window";

/** How to frame one part of the desk: scale it around its centre until it fills the stage, and carry that centre to the stage's. */
export type Framing = { originX: number; originY: number; shiftX: number; shiftY: number; fill: number };

const TARGET_SELECTOR: Record<DeskTarget, string> = {
  screen: "[data-laptop-screen]",
  board: '[data-camera="board"]',
  shelf: '[data-camera="shelf"]',
  window: '[data-camera="window"]',
};

export const DESK_TARGETS = Object.keys(TARGET_SELECTOR) as DeskTarget[];

/** The desk's size when the whole of it is in view, shared by the room and the nav's trips so both see the same desk. */
export const DESK_WORLD = "w-[min(94vw,calc((100svh-6rem)*1.4),68rem)] pt-10";

/** Measures how to frame `target`; the world must be at rest (untransformed) while it is measured. */
export function frameTarget(stage: HTMLElement, world: HTMLElement, target: DeskTarget): Framing | null {
  const element = world.querySelector(TARGET_SELECTOR[target]);
  if (!element) return null;
  const stageBox = stage.getBoundingClientRect();
  const worldBox = world.getBoundingClientRect();
  const box = element.getBoundingClientRect();
  const centreX = box.left + box.width / 2;
  const centreY = box.top + box.height / 2;
  return {
    originX: centreX - worldBox.left,
    originY: centreY - worldBox.top,
    shiftX: stageBox.left + stageBox.width / 2 - centreX,
    shiftY: stageBox.top + stageBox.height / 2 - centreY,
    // The same 4% overshoot as the hero's zoom and `.lock-frame`, so a full close-up on the laptop is exactly that frame.
    fill: Math.max(stageBox.width / box.width, stageBox.height / box.height) * 1.04,
  };
}

/** Puts the camera `depth` of the way into a framing: 0 is the whole desk, 1 the part filling the stage. */
export function placeWorld(world: HTMLElement, framing: Framing | null | undefined, depth: number) {
  if (!framing || depth <= 0) {
    world.style.transform = "none";
    return;
  }
  const { scale, shift } = dolly(framing.fill, depth);
  world.style.transformOrigin = `${framing.originX}px ${framing.originY}px`;
  world.style.transform = `translate(${framing.shiftX * shift}px, ${framing.shiftY * shift}px) scale(${scale})`;
}
