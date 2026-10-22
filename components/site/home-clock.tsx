"use client";

import { useSyncExternalStore } from "react";

import { currentMinute, minuteOnServer, subscribeMinute } from "@/lib/clock";
import { owner } from "@/lib/site";

const homeTime = new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", timeZone: owner.timeZone });

/** What time it is at Sambilaycord's desk, so a visitor knows whether a reply is coming tonight or tomorrow. */
export function HomeClock() {
  const minute = useSyncExternalStore(subscribeMinute, currentMinute, minuteOnServer);

  return (
    <p className="text-hand text-xl text-brand-fg">
      it&apos;s{" "}
      <time className="text-brand-accent" suppressHydrationWarning>
        {minute === null ? "…" : homeTime.format(minute * 60_000)}
      </time>{" "}
      here
    </p>
  );
}
