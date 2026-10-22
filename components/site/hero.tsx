"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";

import { dolly, easeInOutSine, followScroll } from "@/lib/camera";
import { owner } from "@/lib/site";
import { segment, useSceneProgress } from "@/lib/use-scene-progress";

import { CozyDesk } from "./cozy-desk";
import { frameTarget } from "./desk-camera";

/**
 * Where the camera has to go to fill the stage with the laptop's screen, measured with the desk
 * at rest. The numbers go on the stage, so the desk and the lock screen riding on it both read them.
 */
function aimAtScreen(stage: HTMLElement, desk: HTMLElement): number {
  const transform = desk.style.transform;
  desk.style.transform = "none";
  const framing = frameTarget(stage, desk, "screen");
  desk.style.transform = transform;
  if (!framing) return 1;

  stage.style.setProperty("--ox", `${framing.originX}px`);
  stage.style.setProperty("--oy", `${framing.originY}px`);
  stage.style.setProperty("--dx", `${framing.shiftX}px`);
  stage.style.setProperty("--dy", `${framing.shiftY}px`);
  return framing.fill;
}

/**
 * The opening scene: just the desk, centred, and a nudge to scroll. Scrolling leans in until
 * the laptop's screen fills the view, and the screen becomes its lock screen, where the about
 * scene picks up.
 *
 * The desk zooms as one ordinary element holding nothing that animates on a layer of its own.
 * Promoted layers (the desk itself, a lock screen riding on its screen, or a little looping
 * animation inside it) get rebuilt as the scale changes, and for a frame they go missing, which
 * showed as parts of the desk blinking out. The laptop's lock screen is part of the desk, and at
 * full zoom it is exactly the lock screen the about scene starts on.
 */
export function Hero() {
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef(1);
  const cameraRef = useRef<ReturnType<typeof followScroll> | null>(null);

  // The camera, from its smoothed progress: it follows the scroll rather than jumping with it.
  function placeCamera(progress: number) {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;
    const { scale, shift } = dolly(fillRef.current, easeInOutSine(segment(progress, 0.08, 0.8)));
    stage.style.setProperty("--scale", scale.toFixed(4));
    stage.style.setProperty("--shift", shift.toFixed(4));
  }

  useSceneProgress(sceneRef, (progress) => {
    sceneRef.current?.style.setProperty("--copy", segment(progress, 0, 0.12).toFixed(4));
    // The whole zoom (0.08 to 0.8 of the scene) takes at least about half a second, however fast the scroll.
    cameraRef.current ??= followScroll(placeCamera, 1.3);
    cameraRef.current.set(progress);
  });

  useEffect(() => () => cameraRef.current?.dispose(), []);

  useEffect(() => {
    const stage = stageRef.current;
    const desk = deskRef.current;
    if (!stage || !desk) return;
    const aim = () => {
      fillRef.current = aimAtScreen(stage, desk);
      cameraRef.current?.refresh();
    };
    aim();
    const observer = new ResizeObserver(aim);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="top" ref={sceneRef} className="scene hero-scene" data-shows-room="" style={{ height: "260svh" }}>
      <h1 className="sr-only">
        {owner.name}: the portfolio of {owner.fullName}, full-stack developer and technical project manager in the Philippines
      </h1>
      <div ref={stageRef} className="scene-stage flex flex-col items-center justify-center px-5 pt-16 pb-6">
        <div ref={deskRef} className="hero-desk w-[min(92vw,64rem,calc((100svh-12rem)*1.4))]">
          <CozyDesk screen="lock" />
        </div>

        <p className="hero-copy text-hand mt-2 flex flex-col items-center text-2xl text-brand-muted">
          scroll down
          <ArrowDown aria-hidden="true" className="mt-1 size-6 animate-bounce" />
        </p>

      </div>
    </section>
  );
}
