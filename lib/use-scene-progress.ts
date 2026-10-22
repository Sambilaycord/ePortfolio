"use client";

import { useEffect, useRef, type RefObject } from "react";

import { prefersReducedMotion, SMOOTH_SCROLL_EVENT } from "@/lib/motion";
import { clamp } from "@/lib/utils";

/**
 * Drives a pinned scene from the scroll. While the scene's tall section passes, its sticky
 * stage stays put and `--p` on the section runs from 0 to 1; CSS reads it for everything
 * that only depends on progress, and `onProgress` handles what needs measuring.
 *
 * Visitors who prefer reduced motion get the scene's finished state: the stylesheet unpins
 * it, and progress is never written.
 */
export function useSceneProgress(sceneRef: RefObject<HTMLElement | null>, onProgress?: (progress: number) => void) {
  // Kept in a ref so a new callback each render does not tear down the scroll listener.
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || prefersReducedMotion()) return;

    let frame = 0;
    let lastProgress = NaN;
    const paint = () => {
      frame = 0;
      const { top, height } = scene.getBoundingClientRect();
      const travel = Math.max(1, height - window.innerHeight);
      const progress = clamp(-top / travel, 0, 1);
      // A scene that takes over from the one before it stays out of sight until it reaches the top.
      scene.toggleAttribute("data-ahead", top > 0);
      // And the one handing over goes out of sight at that same moment, rather than scrolling away
      // behind the new scene, which would show through wherever the new scene is see-through.
      const handsOver = scene.nextElementSibling?.classList.contains("scene--handoff") ?? false;
      scene.toggleAttribute("data-handed-over", handsOver && top + height < window.innerHeight);
      // Off screen, or still waiting to take over, a scene pauses its little loops: each tick of an
      // animation anywhere on the page costs a repaint, and together they cost every frame.
      scene.toggleAttribute("data-idle", top >= window.innerHeight || top + height <= 0 || (top > 0 && scene.classList.contains("scene--handoff")));
      // A scene parked before or after its run sees the same progress on every scroll; nothing to redo.
      if (progress === lastProgress) return;
      lastProgress = progress;
      scene.style.setProperty("--p", progress.toFixed(4));
      onProgressRef.current?.(progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    // Lenis has just moved the page in this frame; painting now, not next frame, keeps the scene in step with it.
    const paintNow = () => {
      cancelAnimationFrame(frame);
      paint();
    };

    paint();
    window.addEventListener(SMOOTH_SCROLL_EVENT, paintNow);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(SMOOTH_SCROLL_EVENT, paintNow);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sceneRef]);
}

/** The share of a scene's progress spent inside one stretch of it: 0 before `start`, 1 after `end`. */
export function segment(progress: number, start: number, end: number): number {
  return clamp((progress - start) / (end - start), 0, 1);
}
