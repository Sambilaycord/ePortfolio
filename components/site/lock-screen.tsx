"use client";

import { useSyncExternalStore } from "react";

import { currentMinute, minuteOnServer, subscribeMinute } from "@/lib/clock";
import { owner } from "@/lib/site";
import { cn, cssVars } from "@/lib/utils";

import { OsWallpaper } from "./os-wallpaper";

const lockTime = new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", timeZone: owner.timeZone });
const lockDate = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", timeZone: owner.timeZone });

/**
 * The laptop's lock screen: the desktop wallpaper under a soft tint, with the time and date.
 *
 * It is always laid out in the shape of the laptop's screen and sized in container units, and
 * there are two copies: on the laptop itself, which the hero zooms into, and full-screen on the
 * about scene's first frame. With `fullscreen` it sits in a box of that same shape, centred and as
 * large as the camera's zoom leaves the laptop screen, so both are the same picture, pixel for
 * pixel, and handing from one to the other shows nothing. Laid out to fit the window instead, the copies
 * disagree on crop and clock size, and the cross-fade between them shows as a doubled flicker.
 *
 * The hills are pinned at rest (`--p: 0`) because the wallpaper otherwise drifts with its scene.
 */
export function LockBackdrop({ fullscreen = false }: { fullscreen?: boolean }) {
  const minute = useSyncExternalStore(subscribeMinute, currentMinute, minuteOnServer);

  return (
    <div aria-hidden="true" className={cn("lock-backdrop overflow-hidden [container-type:size]", fullscreen ? "lock-frame" : "absolute inset-0")}>
      <div className="lock-wallpaper absolute inset-0" style={cssVars({ "--p": "0" })}>
        <OsWallpaper />
      </div>
      <div className="lock-clock absolute inset-x-0 top-[22%] text-center text-white">
        {/* No wider than the part of the screen the window shows (`--lock-view`), so an upright phone never crops the time. */}
        <p className="text-display text-[length:min(9.9cqw,calc(20cqw*var(--lock-view,1)))] leading-none" suppressHydrationWarning>
          {minute === null ? " " : lockTime.format(minute * 60_000)}
        </p>
        <p className="mt-[min(0.6cqw,calc(1.4cqw*var(--lock-view,1)))] text-[length:min(1.7cqw,calc(3.9cqw*var(--lock-view,1)))] font-semibold" suppressHydrationWarning>
          {minute === null ? " " : lockDate.format(minute * 60_000)}
        </p>
      </div>
    </div>
  );
}
