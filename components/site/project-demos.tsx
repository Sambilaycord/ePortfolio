import type { ReactNode } from "react";

import type { Demo } from "@/lib/projects";
import { cssVars } from "@/lib/utils";

/**
 * What each app shows when it opens: a little scene of the product doing the thing it is for,
 * with a joke in it. Everything is drawn in the project's own `--hue` and loops on CSS alone,
 * so a window costs nothing once it has painted. They are illustrations, not screenshots, and
 * hidden from assistive tech.
 */
export function DemoContent({ demo }: { demo: Demo }) {
  return <div aria-hidden="true" className="relative h-full overflow-hidden p-5 sm:p-7">{DEMOS[demo]}</div>;
}

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`rounded-full bg-[color-mix(in_srgb,var(--hue)_18%,transparent)] px-3 py-1 text-xs font-bold text-(--hue) ${className ?? ""}`}>{children}</span>;
}

/** An odometer digit: 0 to 9 and round again, one step at a time. */
function Roller({ seconds }: { seconds: number }) {
  return (
    <span className="inline-block h-[1em] overflow-hidden align-top">
      <span className="demo-roll block" style={cssVars({ "--d": `${seconds}s` })}>
        {"01234567890".split("").map((digit, index) => (
          <span key={index} className="block h-[1em]">
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ----- The Content Lab: lights, camera, clap ----- */

const PIPELINE = ["Book", "Shoot", "Ingest", "Edit", "QC", "Review", "Deliver"];

function StudioDemo() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[0.65rem] font-black tracking-widest text-brand-on-cocoa/60">
          <span className="demo-blink size-2 rounded-full bg-[#ef4444]" />
          REC
        </span>
        <span className="demo-sticker rotate-6 rounded-md bg-(--hue) px-2 py-1 text-[0.65rem] font-black text-brand-surface shadow-md">✓ email verified</span>
      </div>

      <svg viewBox="0 0 120 100" className="mx-auto min-h-0 w-auto flex-1">
        <rect x="10" y="40" width="100" height="54" rx="6" fill="currentColor" fillOpacity="0.88" />
        <rect x="10" y="40" width="100" height="9" fill="var(--hue)" />
        <text x="18" y="66" fontSize="8" fontWeight="800" fill="var(--brand-surface)" fontFamily="var(--font-mono)">
          SCENE 01
        </text>
        <text x="18" y="82" fontSize="8" fontWeight="800" fill="var(--brand-surface)" fontFamily="var(--font-mono)">
          TAKE 3
        </text>
        <text x="80" y="82" fontSize="10" fontWeight="900" fill="var(--hue)">
          TCL
        </text>
        <g className="demo-clap">
          <rect x="10" y="26" width="100" height="12" rx="2" fill="currentColor" fillOpacity="0.88" />
          {[0, 1, 2, 3, 4].map((stripe) => (
            <path key={stripe} d={`M${20 + stripe * 20} 26h9l-7 12h-9z`} fill="var(--hue)" />
          ))}
        </g>
        <circle cx="13" cy="38" r="3" fill="var(--hue)" />
      </svg>

      {/* The client's whole cycle rolls by on a strip of film. */}
      <div className="relative -mx-5 overflow-hidden bg-brand-on-cocoa/85 py-2 text-brand-surface sm:-mx-7">
        <span className="absolute inset-x-0 top-0.5 h-1 bg-[repeating-linear-gradient(90deg,var(--brand-surface)_0_4px,transparent_4px_10px)] opacity-40" />
        <span className="absolute inset-x-0 bottom-0.5 h-1 bg-[repeating-linear-gradient(90deg,var(--brand-surface)_0_4px,transparent_4px_10px)] opacity-40" />
        <div className="demo-strip flex w-max">
          {[...PIPELINE, ...PIPELINE].map((step, index) => (
            <span key={index} className="mx-1 rounded-sm bg-brand-surface/15 px-3 py-1 text-[0.6rem] font-black tracking-wider uppercase">
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----- Zenalytics: number go up ----- */

const BARS = [45, 62, 38, 80, 70, 95];
const CONFETTI = [
  { x: "-34px", y: "-30px", color: "var(--hue)" },
  { x: "-18px", y: "-46px", color: "var(--brand-accent)" },
  { x: "0px", y: "-54px", color: "var(--brand-accent-2)" },
  { x: "18px", y: "-44px", color: "var(--brand-sage)" },
  { x: "32px", y: "-26px", color: "var(--hue)" },
  { x: "-26px", y: "-12px", color: "var(--brand-accent-2)" },
  { x: "26px", y: "-10px", color: "var(--brand-accent)" },
];

function ChartDemo() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_srgb,var(--hue)_28%,transparent)_1px,transparent_1.5px)] bg-size-[14px_14px] opacity-70" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-label text-brand-on-cocoa/50">Signups this week</p>
            <p className="text-display text-3xl leading-none sm:text-4xl">
              3,4<Roller seconds={10} />
              <Roller seconds={1} />
              <span className="ml-1 text-base text-(--hue)">↑</span>
            </p>
          </div>
          {/* The light, dark and system toggle, flipping on its own. */}
          <span className="relative flex h-6 w-12 shrink-0 items-center justify-between rounded-full bg-brand-on-cocoa/10 px-1.5 text-[0.65rem]">
            <span>☀</span>
            <span>☾</span>
            <span className="demo-toggle absolute top-1 left-1 size-4 rounded-full bg-(--hue) shadow" />
          </span>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 items-end gap-2">
          {BARS.map((height, index) => (
            <span key={index} className="relative flex h-full flex-1 items-end">
              <span className="bar-grow block w-full rounded-t-md bg-(--hue)" style={{ height: `${height}%`, opacity: 0.45 + index * 0.1, ...cssVars({ "--line": String(index) }) }} />
              {index === BARS.length - 1 &&
                CONFETTI.map((piece, pieceIndex) => (
                  <span
                    key={pieceIndex}
                    className="demo-confetti absolute left-1/2 h-2 w-1 rounded-sm"
                    style={{ bottom: `${height}%`, background: piece.color, ...cssVars({ "--x": piece.x, "--y": piece.y, "--line": String(index) }) }}
                  />
                ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ----- Zen Marine Charters: set sail ----- */

function Gull({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 10" className={`absolute w-5 ${className}`}>
      <path className="demo-flap" d="M1 7Q6 1 12 7Q18 1 23 7" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const WAVE = "M0 12" + " q8.75 -8 17.5 0 t17.5 0".repeat(8) + " V30 H0z";

function BoatDemo() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-between text-[0.65rem] font-bold tracking-wider text-brand-on-cocoa/50 uppercase">
        <span className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-brand-on-cocoa/10" />
        <span className="demo-step absolute top-1/2 left-3 h-0.5 -translate-y-1/2 bg-(--hue)" />
        {["Trip", "Guests", "Pay"].map((step) => (
          <span key={step} className="relative rounded-full border border-(--hue) bg-brand-surface px-2.5 py-1 text-(--hue)">
            {step}
          </span>
        ))}
      </div>

      <div className="relative mt-3 min-h-0 flex-1">
        <span className="demo-sun absolute top-1 right-6 size-9 rounded-full bg-brand-accent-2 sm:size-12" />
        <Gull className="demo-glide top-4 left-[18%]" />
        <Gull className="demo-glide demo-glide--late top-9 left-[34%] scale-75" />
        <span className="demo-wiggle absolute top-14 right-3 rounded-full bg-[#e0b84c] px-3 py-1 text-[0.65rem] font-black text-[#3a2a21] shadow-md sm:top-20">☎ Call us</span>

        <div className="demo-sail absolute inset-x-0 bottom-5">
          <svg viewBox="0 0 140 70" className="w-24 sm:w-32">
            <g className="demo-bob">
              <path d="M30 44h80l-10 12H40z" fill="var(--hue)" />
              <path d="M70 44V8l24 30H70z" fill="currentColor" fillOpacity="0.85" />
              <path d="M68 14L50 40h18z" fill="var(--hue)" fillOpacity="0.6" />
              <path d="M70 8l10 -4v6z" fill="#ef4444" />
            </g>
          </svg>
        </div>
        <svg viewBox="0 0 140 30" preserveAspectRatio="none" className="demo-waves demo-waves--slow absolute -bottom-1 left-0 h-10 w-[200%]">
          <path d={WAVE} fill="var(--hue)" fillOpacity="0.3" />
        </svg>
        <svg viewBox="0 0 140 30" preserveAspectRatio="none" className="demo-waves absolute -bottom-3 left-0 h-9 w-[200%]">
          <path d={WAVE} fill="var(--hue)" fillOpacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

/* ----- Zen Intent: the lead radar ----- */

const RADAR_SECONDS = 4;
const BLIPS = [
  { x: 68, y: 28 },
  { x: 78, y: 62 },
  { x: 40, y: 74 },
  { x: 24, y: 40 },
  { x: 54, y: 46 },
];
const LEAD_CARDS = [
  { initial: "A", intent: 92, width: "w-16" },
  { initial: "N", intent: 87, width: "w-12" },
  { initial: "K", intent: 74, width: "w-20" },
];

/** How far into a sweep the beam reaches a point, measured clockwise from twelve o'clock. */
function sweepDelay({ x, y }: { x: number; y: number }) {
  const angle = (Math.atan2(x - 50, 50 - y) * 180) / Math.PI;
  return `${(((angle + 360) % 360) / 360) * RADAR_SECONDS}s`;
}

function LeadsDemo() {
  return (
    <div className="flex h-full items-center gap-4 sm:gap-6">
      <div className="relative aspect-square h-full max-h-60 shrink-0 overflow-hidden rounded-full border border-brand-on-cocoa/15 bg-[color-mix(in_srgb,var(--hue)_6%,transparent)]">
        <span className="absolute inset-[18%] rounded-full border border-brand-on-cocoa/10" />
        <span className="absolute inset-[36%] rounded-full border border-brand-on-cocoa/10" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-brand-on-cocoa/10" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-brand-on-cocoa/10" />
        <span
          className="demo-sweep absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(transparent 0deg, transparent 260deg, color-mix(in srgb, var(--hue) 55%, transparent) 360deg)" }}
        />
        {BLIPS.map((blip, index) => (
          <span key={index} className="absolute" style={{ left: `${blip.x}%`, top: `${blip.y}%` }}>
            <span className="demo-ping absolute -top-1 -left-1 size-2 rounded-full border-2 border-(--hue)" style={cssVars({ "--delay": sweepDelay(blip) })} />
            <span className="demo-blip absolute -top-1 -left-1 size-2 rounded-full bg-(--hue)" style={cssVars({ "--delay": sweepDelay(blip) })} />
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <Pill className="demo-pulse">Scanning…</Pill>
        <ul className="mt-3 space-y-2">
          {LEAD_CARDS.map((lead, index) => (
            <li key={lead.initial} className="demo-card flex items-center gap-2 rounded-lg bg-brand-on-cocoa/5 p-2" style={cssVars({ "--i": String(index) })}>
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-(--hue) text-[0.65rem] font-black text-brand-surface">{lead.initial}</span>
              <span className="min-w-0 flex-1">
                <span className={`block h-1.5 rounded-full bg-brand-on-cocoa/25 ${lead.width}`} />
                <span className="mt-1 block truncate text-[0.6rem] font-bold text-(--hue)">✓ {lead.intent}% intent</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ----- ViralTube Exploder: you won't believe this thumbnail ----- */

const TITLES = [
  ["I tried it", "for 30 days"],
  ["This changed", "everything"],
  ["Don't press", "this button"],
];

function ShockedFace() {
  return (
    <svg viewBox="0 0 100 100" className="demo-face absolute right-2 -bottom-2 h-[72%]">
      <circle cx="50" cy="52" r="40" fill="#ffd166" stroke="#3a2a21" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M26 30l14 4M74 30l-14 4" stroke="#3a2a21" strokeWidth="4" strokeLinecap="round" />
      <circle cx="36" cy="46" r="10" fill="white" />
      <circle cx="64" cy="46" r="10" fill="white" />
      <g className="demo-look">
        <circle cx="36" cy="46" r="4.5" fill="#3a2a21" />
        <circle cx="64" cy="46" r="4.5" fill="#3a2a21" />
      </g>
      <ellipse className="demo-gasp" cx="50" cy="74" rx="8" ry="11" fill="#3a2a21" />
    </svg>
  );
}

function ThumbnailDemo() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div
        className="relative min-h-0 flex-1 overflow-hidden rounded-lg"
        style={{ background: "linear-gradient(135deg, var(--hue), color-mix(in srgb, var(--hue) 35%, var(--brand-cocoa)))" }}
      >
        <span className="demo-rays absolute -inset-1/2" style={{ background: "repeating-conic-gradient(rgb(255 255 255 / 0.13) 0 10deg, transparent 10deg 20deg)" }} />
        <p className="text-display absolute top-3 left-3 h-[2em] overflow-hidden text-lg leading-none font-black text-white uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.35)] sm:text-3xl">
          <span className="demo-titles block">
            {[...TITLES, TITLES[0]].map(([first, second], index) => (
              <span key={index} className="block h-[2em]">
                {first}
                <br />
                <span className="text-[#ffe066]">{second}</span>
              </span>
            ))}
          </span>
        </p>
        <svg viewBox="0 0 60 30" className="demo-arrow absolute right-[38%] bottom-[22%] w-12 sm:w-16">
          <path d="M2 15h40M34 5l14 10-14 10" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 15h40M34 5l14 10-14 10" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <ShockedFace />
        <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1 font-mono text-[0.6rem] font-bold text-white">12:04</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold">
        <Pill>MrBeast</Pill>
        <span className="rounded-full px-2 py-1 text-brand-on-cocoa/45">Cinematic</span>
        <span className="hidden rounded-full px-2 py-1 text-brand-on-cocoa/45 sm:inline">Hyper Neon</span>
        <span className="relative ml-auto">
          <span className="demo-press inline-block rounded-full bg-(--hue) px-3 py-1 text-xs font-black text-brand-surface">Generate ✦</span>
          <svg viewBox="0 0 16 20" className="demo-cursor absolute top-1/2 left-1/2 w-4 drop-shadow">
            <path d="M1 1v16l4.5-4 3 6 3-1.5-3-6H14z" fill="white" stroke="#3a2a21" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ----- Zenith: clocked in, and Slack has things to say ----- */

const TOASTS = [
  { icon: "🎂", channel: "#general", text: "Birthday today, say hi!" },
  { icon: "📸", channel: "#selfie-wednesday", text: "Smile, it's Wednesday" },
  { icon: "☕", channel: "#attendance", text: "That break's running long" },
];

function ClockDemo() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 items-center gap-5 sm:gap-7">
        <div className="relative h-full max-h-36 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--hue)" strokeWidth="10" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="demo-ring" />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-2xl sm:text-3xl">
            <span className="relative">
              ☕
              <span className="demo-steam absolute -top-2 left-[35%] h-2.5 w-0.5 rounded-full bg-brand-on-cocoa/40" />
              <span className="demo-steam demo-steam--late absolute -top-2 left-[60%] h-2.5 w-0.5 rounded-full bg-brand-on-cocoa/40" />
            </span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-label text-brand-on-cocoa/50">Clocked in · 8:57 AM</p>
          <p className="text-display mt-1 text-3xl leading-none sm:text-4xl">
            4h <span className="text-(--hue)">1<Roller seconds={20} />m</span>
          </p>
          <p className="mt-1 text-xs text-brand-on-cocoa/50">estimated end · 5:57 PM</p>
          <div className="mt-3 flex -space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className="relative size-6 rounded-full border-2 border-brand-surface bg-[color-mix(in_srgb,var(--hue)_40%,var(--brand-surface))]">
                <span className="demo-presence absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-[#7fb77e]" style={cssVars({ "--i": String(index) })} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-3 h-12 shrink-0">
        {TOASTS.map((toast, index) => (
          <div
            key={toast.channel}
            className="demo-toast absolute inset-x-0 bottom-0 flex items-center gap-2.5 rounded-xl border border-brand-line bg-brand-surface px-3 py-2 shadow-md"
            style={cssVars({ "--i": String(index) })}
          >
            <span className="text-lg">{toast.icon}</span>
            <span className="min-w-0 text-xs leading-tight">
              <span className="block font-bold text-brand-on-cocoa/50">{toast.channel}</span>
              <span className="block truncate">{toast.text}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowerDemo() {
  return (
    <svg viewBox="-60 -60 120 120" className="mx-auto h-full">
      {[0, 1, 2, 3, 4, 5].map((petal) => (
        <path key={petal} d="M0 -4C12 -18 12 -42 0 -54-12 -42-12 -18 0 -4Z" fill="var(--hue)" fillOpacity={petal % 2 ? 0.45 : 0.9} transform={`rotate(${petal * 60})`} />
      ))}
      <circle r="7" className="fill-brand-accent-2" />
    </svg>
  );
}

const DEMOS: Record<Demo, ReactNode> = {
  studio: <StudioDemo />,
  chart: <ChartDemo />,
  boat: <BoatDemo />,
  leads: <LeadsDemo />,
  thumbnail: <ThumbnailDemo />,
  clock: <ClockDemo />,
  flower: <FlowerDemo />,
};
