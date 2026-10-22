"use client";

import { useId, useRef, useSyncExternalStore } from "react";

import { currentMinute, minuteOnServer, subscribeMinute } from "@/lib/clock";
import { skyPhaseAt, type SkyPhase } from "@/lib/sky";
import { setTheme, subscribeTheme } from "@/lib/theme";
import { cn, cssVars } from "@/lib/utils";

import { LockBackdrop } from "./lock-screen";
import { OsWallpaper } from "./os-wallpaper";


/** Where the sun or moon sits in the window for each part of the day, in scene units. */
const SKY_BODY_POSITION: Record<SkyPhase, { x: number; y: number }> = {
  dawn: { x: 95, y: 185 },
  day: { x: 225, y: 78 },
  dusk: { x: 235, y: 180 },
  night: { x: 215, y: 82 },
};

const STARS = [
  [75, 58],
  [118, 92],
  [140, 50],
  [92, 150],
  [190, 160],
  [255, 140],
  [178, 62],
  [258, 205],
  [70, 205],
];

/** What the laptop shows: its lock screen in the hero, or the desktop wallpaper in the room. */
type DeskScreen = "wallpaper" | "lock";

/** Where the laptop's screen sits in the drawing, as shares of the whole, for laying the lock screen over it. */
const SCREEN_BOX = { left: 175 / 760, top: 260 / 540, width: 190 / 760, height: 122 / 540 };

function useSkyPhase(): SkyPhase | null {
  const minute = useSyncExternalStore(subscribeMinute, currentMinute, minuteOnServer);
  return minute === null ? null : skyPhaseAt(new Date(minute * 60_000).getHours());
}

/** Read from the class the theme script maintains, which already resolves "system" to light or dark. */
const isDarkNow = () => document.documentElement.classList.contains("dark");
const isDarkOnServer = () => false;

function useIsLamplit(): boolean {
  return useSyncExternalStore(subscribeTheme, isDarkNow, isDarkOnServer);
}

type DeskIds = { sky: string; pane: string; glow: string; cone: string; beam: string; window: string };

function Window({ phase, ids }: { phase: SkyPhase | null; ids: DeskIds }) {
  const body = SKY_BODY_POSITION[phase ?? "day"];

  return (
    <g className="sky" data-phase={phase ?? "day"}>
      <defs>
        <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="sky-top" />
          <stop offset="1" className="sky-bottom" />
        </linearGradient>
        <clipPath id={ids.pane}>
          <rect x="54" y="34" width="222" height="196" rx="10" />
        </clipPath>
      </defs>

      <rect x="40" y="20" width="250" height="224" rx="18" className="fill-brand-surface stroke-brand-line" strokeWidth="2" />
      <g clipPath={`url(#${ids.pane})`}>
        <rect x="54" y="34" width="222" height="196" fill={`url(#${ids.sky})`} data-camera="window" />
        <g className="sky-stars">
          {STARS.map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 1.8 : 1.2} fill="#fff6dc" className="sky-star" style={cssVars({ "--i": String(index) })} />
          ))}
        </g>
        <g style={{ transform: `translate(${body.x}px, ${body.y}px)`, transition: "transform 1.2s ease" }}>
          <circle r="20" className="sky-body" />
          {/* Laid over the full disc at night, in the sky's own colour, it leaves a crescent. */}
          <circle cx="9" cy="-7" r="17" fill="var(--sky-top)" className="sky-moon-shade" />
        </g>
        <g className="sky-cloud" fill="#fffdf7" opacity="0.85">
          <ellipse cx="60" cy="110" rx="26" ry="9" />
          <ellipse cx="78" cy="104" rx="16" ry="10" />
        </g>
        <g className="sky-cloud" fill="#fffdf7" opacity="0.7">
          <ellipse cx="20" cy="170" rx="22" ry="7" />
          <ellipse cx="34" cy="165" rx="12" ry="8" />
        </g>
      </g>
      <path d="M165 34v196M54 132h222" className="stroke-brand-surface" strokeWidth="8" />

      {/* The sill, with a little succulent sunning itself. */}
      <rect x="30" y="240" width="270" height="12" rx="6" className="wood" />
      <path d="M72 240l3-18h22l3 18z" className="fill-brand-accent" />
      <g className="fill-brand-sage">
        <ellipse cx="80" cy="216" rx="5" ry="10" transform="rotate(-25 80 216)" />
        <ellipse cx="86" cy="212" rx="5" ry="12" />
        <ellipse cx="92" cy="216" rx="5" ry="10" transform="rotate(25 92 216)" />
      </g>

      {/* Curtains, tied back. */}
      <path d="M20 14h290" className="stroke-brand-fg" strokeWidth="4" strokeLinecap="round" />
      <path
        className="fill-brand-blush"
        opacity="0.92"
        d="M24 16h48c-6 40 4 70-6 110 10 40-2 80 4 124H30c-8-46 4-80-4-124 8-40-6-70-2-110z"
      />
      <path
        className="fill-brand-blush"
        opacity="0.92"
        d="M258 16h48c4 40-10 70-2 110-8 44 4 78-4 124h-38c6-44-6-84 4-124-10-40 0-70-8-110z"
      />
    </g>
  );
}

function Shelf() {
  return (
    <g transform="translate(180 0)">
      <rect x="360" y="150" width="210" height="10" rx="4" className="wood" />
      <path d="M380 160v14h10M550 160v14h-10" className="stroke-brand-dim" strokeWidth="4" fill="none" strokeLinecap="round" />

      <rect x="374" y="94" width="16" height="56" rx="3" className="fill-brand-accent" />
      <rect x="392" y="102" width="14" height="48" rx="3" className="fill-brand-sage" />
      <rect x="408" y="88" width="18" height="62" rx="3" className="fill-brand-accent-2" />
      <rect x="432" y="98" width="14" height="52" rx="3" className="fill-brand-blush" transform="rotate(14 446 150)" />

      {/* Three little jars: up close, this is where the tools are kept. */}
      <rect data-camera="shelf" x="440" y="96" width="76" height="58" fill="none" />
      {JAR_TONES.map((tone, index) => (
        <g key={tone} transform={`translate(${460 + index * 18} 0)`}>
          <rect x="-6" y="112" width="12" height="5" rx="1.5" className="fill-brand-accent" />
          <rect x="-7.5" y="117" width="15" height="33" rx="4" className="fill-brand-surface stroke-brand-dim" strokeWidth="1.5" opacity="0.9" />
          <rect x="-4.5" y="128" width="9" height="7" rx="1" className={tone} />
        </g>
      ))}

      <path d="M516 120h38l-4 30h-30z" className="fill-brand-accent" />
      <g className="fill-brand-sage">
        <path d="M524 148c-4 18 2 30-4 46" className="stroke-brand-sage" strokeWidth="2.5" fill="none" />
        <ellipse cx="518" cy="168" rx="5" ry="8" transform="rotate(30 518 168)" />
        <ellipse cx="526" cy="182" rx="5" ry="8" transform="rotate(-30 526 182)" />
        <ellipse cx="519" cy="196" rx="5" ry="8" transform="rotate(20 519 196)" />
        <path d="M548 148c4 14-2 24 3 36" className="stroke-brand-sage" strokeWidth="2.5" fill="none" />
        <ellipse cx="555" cy="164" rx="5" ry="8" transform="rotate(-30 555 164)" />
        <ellipse cx="548" cy="178" rx="5" ry="8" transform="rotate(25 548 178)" />
      </g>
      <g className="fill-brand-sage">
        <ellipse cx="528" cy="112" rx="6" ry="12" transform="rotate(-30 528 112)" />
        <ellipse cx="540" cy="108" rx="6" ry="14" />
        <ellipse cx="551" cy="113" rx="6" ry="12" transform="rotate(30 551 113)" />
      </g>
    </g>
  );
}

const JAR_TONES = ["fill-brand-sage", "fill-brand-accent-2", "fill-brand-blush"];

/** Pins on the cork board, where the red string is tied off. */
const BOARD_PINS = [
  [352, 70],
  [424, 84],
  [500, 72],
  [368, 138],
  [472, 142],
];

/** The cork board between the window and the shelf: photos and notes pinned up, joined by a red string. */
function CorkBoard() {
  return (
    <g>
      <rect x="318" y="34" width="220" height="168" rx="6" className="wood-dark" />
      <rect x="326" y="42" width="204" height="152" rx="3" className="cork" data-camera="board" />
      <path d="M352 70Q392 104 424 84T500 72" fill="none" stroke="#c4473b" strokeWidth="1.5" />
      <g transform="rotate(-6 352 92)">
        <rect x="336" y="66" width="34" height="40" rx="1.5" fill="#fffaf2" />
        <rect x="339" y="69" width="28" height="26" className="fill-brand-sage" />
      </g>
      <g transform="rotate(5 424 104)">
        <rect x="406" y="80" width="36" height="42" rx="1.5" fill="#fffaf2" />
        <rect x="409" y="83" width="30" height="28" className="fill-brand-blush" />
      </g>
      <g transform="rotate(-3 500 92)">
        <rect x="482" y="64" width="34" height="40" rx="1.5" fill="#fffaf2" />
        <rect x="485" y="67" width="28" height="26" className="fill-brand-accent-2" />
      </g>
      <g transform="rotate(-6 368 160)">
        <rect x="338" y="134" width="62" height="50" rx="2" className="fill-brand-accent-3" />
        <text x="369" y="160" textAnchor="middle" className="text-hand" fill="#3a2a21" fontSize="15">
          ship it
        </text>
        <text x="369" y="176" textAnchor="middle" className="fill-brand-accent" fontSize="12">
          ♥
        </text>
      </g>
      <g transform="rotate(4 470 160)">
        <rect x="440" y="138" width="64" height="44" rx="2" fill="#fffaf2" />
        <path d="M448 150h44M448 160h36M448 170h40" stroke="#c9b29d" strokeWidth="2" strokeLinecap="round" />
      </g>
      {BOARD_PINS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="#c4473b" />
      ))}
    </g>
  );
}

/** Dust in the sunbeam: where each mote drifts, as a start point, so the motes never move in step. */
const MOTES = [
  [330, 150], [380, 230], [420, 180], [460, 300], [500, 250], [540, 340], [590, 300], [360, 300],
];

/**
 * Daylight through the window, for the light theme: soft beams across the wall toward the desk,
 * a glow round the window, and dust drifting in the beams. Its colour follows the visitor's sky, warm by day and orange at either end
 * of it, and it is gone at night. Everything here animates by painting (fill opacity and position
 * attributes) rather than on layers of its own, which blinked as the camera scaled the desk.
 */
function Daylight({ ids, part }: { ids: DeskIds; part: "glow" | "beams" }) {
  // The glow sits behind the window, rimming its frame; the beams come in front, from the window's edge into the room.
  if (part === "glow") {
    return (
      <g className="desk-daylight" aria-hidden="true">
        <defs>
          <radialGradient id={ids.window}>
            <stop offset="0" stopColor="var(--beam)" stopOpacity="0.6" />
            <stop offset="1" stopColor="var(--beam)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="165" cy="140" rx="230" ry="190" fill={`url(#${ids.window})`} />
      </g>
    );
  }
  return (
    <g className="desk-daylight" aria-hidden="true">
      <defs>
        <linearGradient id={ids.beam} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--beam)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--beam)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M292 40L720 360V400H440L292 244z" fill={`url(#${ids.beam})`} />
      <path d="M292 120L560 400H470L292 210z" fill={`url(#${ids.beam})`} opacity="0.6" />
      {MOTES.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 2 : 1.4} className="desk-mote" style={cssVars({ "--i": String(index), "--y": `${y}px` })} />
      ))}
    </g>
  );
}

function Laptop({ ids }: { ids: DeskIds }) {
  return (
    <g>
      <ellipse cx="270" cy="330" rx="175" ry="95" className="desk-screen-glow" fill={`url(#${ids.glow})`} />
      <rect x="165" y="250" width="210" height="142" rx="10" className="fill-brand-fg" />
      <rect x="175" y="260" width="190" height="122" rx="4" className="fill-brand-cocoa" data-laptop-screen="" />
      <path d="M140 392h260l-14 12H154z" className="fill-brand-muted" />
      <path d="M248 392h44" className="stroke-brand-dim" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Mug() {
  return (
    <g>
      <g className="stroke-brand-muted" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8">
        <path className="desk-steam" pathLength="1" d="M416 342c-6-8 6-12 0-22" />
        <path className="desk-steam" pathLength="1" d="M428 342c-6-8 6-12 0-22" />
        <path className="desk-steam" pathLength="1" d="M440 342c-6-8 6-12 0-22" />
      </g>
      <path d="M454 362h6a10 10 0 0 1 0 20h-8" className="stroke-brand-accent" strokeWidth="6" fill="none" />
      <path d="M404 350h52v34a16 16 0 0 1-16 16h-20a16 16 0 0 1-16-16z" className="fill-brand-accent" />
      <path d="M430 384c-6-4-9-7-9-10a4 4 0 0 1 9-2 4 4 0 0 1 9 2c0 3-3 6-9 10z" className="fill-brand-surface" />
    </g>
  );
}

function Cat() {
  return (
    <g>
      <ellipse cx="84" cy="400" rx="58" ry="4" className="fill-brand-cocoa" opacity="0.12" />

      {/* Curled up asleep: a round back with soft tabby stripes. */}
      <g>
        <path d="M40 399C28 398 25 383 34 373 45 360 71 355 97 359 122 363 138 376 135 390 134 397 127 399 118 399Z" className="fill-brand-accent-2" />
        <path d="M80 362c3 6 3 12 0 17M96 361c4 7 4 14 1 20M112 366c4 6 4 12 1 17" className="stroke-brand-accent" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M110 398c-2-12 4-22 17-24" className="stroke-brand-accent" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3" />
      </g>

      {/* The tail wraps round to the front, with a cream tip, and a paw is tucked in beside it. */}
      <path d="M128 393c11 2 13 9 4 10-24 2-54 1-74-1" className="stroke-brand-accent-2" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M64 402c-4 0-8 0-11-1" stroke="#fff1dc" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="66" cy="396" rx="8" ry="4.5" fill="#fff1dc" />

      <g>
        <path d="M31 375 30 357q1-4 5-1l9 10z" className="fill-brand-accent-2" />
        <path d="M33 370v-9l7 6z" fill="#f2a7a0" />
        <path d="M50 365l10-10q3-2 4 2l-1 15z" className="fill-brand-accent-2" />
        <path d="M53 366l7-7 1 9z" fill="#f2a7a0" />
        <ellipse cx="46" cy="380" rx="20" ry="16.5" className="fill-brand-accent-2" />
        <path d="M42 366v5M46 365v6M50 366v5" className="stroke-brand-accent" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <ellipse cx="46" cy="387" rx="9.5" ry="6" fill="#fff1dc" />
        <path d="M35 379q4 4 8 0M49 379q4 4 8 0" className="stroke-brand-cocoa" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="385" r="3" fill="#f2a7a0" opacity="0.6" />
        <circle cx="58" cy="385" r="3" fill="#f2a7a0" opacity="0.6" />
        <path d="M44.4 383.6h3.2l-1.6 1.9z" fill="#e2847a" />
        <path d="M43 386.6q1.5 1.6 3 0 1.5 1.6 3 0" className="stroke-brand-cocoa" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M31 386l-8-1M31 388.5l-8 2M61 386l8-1M61 388.5l8 2" className="stroke-brand-cocoa" strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      </g>

      <g className="text-hand fill-brand-muted">
        <text x="56" y="352" className="desk-z" style={cssVars({ "--z-size": "16px" })}>z</text>
        <text x="66" y="340" className="desk-z" style={cssVars({ "--z-size": "20px" })}>z</text>
        <text x="78" y="326" className="desk-z" style={cssVars({ "--z-size": "24px" })}>z</text>
      </g>
    </g>
  );
}

function Lamp({ chainRef, ids }: { chainRef: React.RefObject<SVGGElement | null>; ids: DeskIds }) {
  return (
    <g>
      <defs>
        <linearGradient id={ids.cone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand-glow)" stopOpacity="0.75" />
          <stop offset="1" stopColor="var(--brand-glow)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M472 262h86l46 140H426z" fill={`url(#${ids.cone})`} className="desk-lamp-light" />
      <path d="M515 262v134" className="stroke-brand-fg" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="515" cy="398" rx="30" ry="6" className="fill-brand-fg" />
      <ellipse cx="515" cy="262" rx="36" ry="18" className="desk-lamp-light" fill={`url(#${ids.glow})`} />
      <path d="M470 264h90l-16-50h-58z" className="fill-brand-sage" />
      <path d="M470 264h90" className="stroke-brand-fg" strokeWidth="2" opacity="0.25" />
      <g ref={chainRef} className="desk-chain">
        <path d="M548 264v38" className="stroke-brand-muted" strokeWidth="2" strokeDasharray="2 3" />
        <circle cx="548" cy="306" r="5" className="fill-brand-accent" />
      </g>
    </g>
  );
}

/**
 * Sambilaycord's desk, drawn in the page's own colours: the window shows the visitor's own sky
 * for the time of day, the cat snoozes, and the lamp's chain is a real control that switches the site between daylight and lamplight.
 */
export function CozyDesk({ className, screen }: { className?: string; screen: DeskScreen }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ids: DeskIds = { sky: `${uid}-sky`, pane: `${uid}-pane`, glow: `${uid}-glow`, cone: `${uid}-cone`, beam: `${uid}-beam`, window: `${uid}-window` };
  const phase = useSkyPhase();
  const isLamplit = useIsLamplit();
  const chainRef = useRef<SVGGElement>(null);

  function pullChain() {
    const chain = chainRef.current;
    if (chain) {
      // Removing and re-adding the attribute after a reflow restarts the pull even mid-animation.
      chain.removeAttribute("data-pulled");
      chain.getBoundingClientRect();
      chain.setAttribute("data-pulled", "");
    }
    setTheme(isLamplit ? "light" : "dark");
  }

  return (
    <div className={cn("desk relative", className)} data-phase={phase ?? "day"}>
      <svg viewBox="0 0 760 540" role="img" aria-label="A cozy desk by a window: a cork board of photos and notes, a shelf of jars, a sleeping cat, a laptop, a steaming mug and a desk lamp." className="h-auto w-full overflow-visible">
        <defs>
          {/* A gradient, not a blur filter: a blur is recomputed at every step of the camera's zoom and breaks up into flickering tiles. */}
          <radialGradient id={ids.glow}>
            <stop offset="0" stopColor="var(--brand-glow)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--brand-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="380" cy="528" rx="360" ry="12" className="fill-brand-cocoa" opacity="0.12" />
        <Daylight ids={ids} part="glow" />
        <Window phase={phase} ids={ids} />
        <CorkBoard />
        <Shelf />
        <Daylight ids={ids} part="beams" />
        <rect x="50" y="414" width="14" height="112" rx="5" className="wood-dark" />
        <rect x="696" y="414" width="14" height="112" rx="5" className="wood-dark" />
        <rect x="20" y="400" width="720" height="18" rx="7" className="wood" />
        <Laptop ids={ids} />
        <Cat />
        <g transform="translate(40 0)">
          <Mug />
        </g>
        <g transform="translate(120 0)">
          <Lamp chainRef={chainRef} ids={ids} />
        </g>
      </svg>
      {/* Laid over the screen as part of the desk, so it scales with it as one element: a separate
      layer riding on the screen had to be rebuilt mid-zoom, and showed as blinking for a frame. */}
      <div
        aria-hidden="true"
        className="desk-screen pointer-events-none absolute overflow-hidden rounded-[2%/3%]"
        style={{ left: `${SCREEN_BOX.left * 100}%`, top: `${SCREEN_BOX.top * 100}%`, width: `${SCREEN_BOX.width * 100}%`, height: `${SCREEN_BOX.height * 100}%` }}
      >
        {screen === "lock" ? (
          <LockBackdrop />
        ) : (
          // The wallpaper as the projects scene leaves it: hills at the end of their drift (`--p: 1`).
          <div className="absolute inset-0" style={cssVars({ "--p": "1" })}>
            <OsWallpaper />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={pullChain}
        aria-label={isLamplit ? "Pull the lamp chain to switch to daylight" : "Pull the lamp chain to switch to lamplight"}
        className="desk-chain-button absolute size-11 -translate-1/2 rounded-full"
        style={{ left: `${(668 / 760) * 100}%`, top: `${(300 / 540) * 100}%` }}
      />
    </div>
  );
}
