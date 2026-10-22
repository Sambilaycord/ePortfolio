"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { readTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";

const OPTIONS: { theme: Theme; label: string; Icon: LucideIcon }[] = [
  { theme: "light", label: "Daylight theme", Icon: Sun },
  { theme: "dark", label: "Lamplight theme", Icon: Moon },
  { theme: "system", label: "Match system theme", Icon: Monitor },
];

// The server cannot see the visitor's choice; "system" is what the head script assumes too.
const serverTheme = (): Theme => "system";

export function ThemeToggle() {
  const activeTheme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);

  return (
    <div role="group" aria-label="Colour theme" className="flex items-center gap-0.5 rounded-full border border-brand-line bg-brand-surface/60 p-0.5">
      {OPTIONS.map(({ theme, label, Icon }) => (
        <button
          key={theme}
          type="button"
          aria-label={label}
          aria-pressed={activeTheme === theme}
          onClick={() => setTheme(theme)}
          className="grid size-7 place-items-center rounded-full text-brand-muted transition-colors hover:text-brand-fg aria-pressed:bg-brand-tint aria-pressed:text-brand-tint-fg"
        >
          <Icon aria-hidden="true" className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
