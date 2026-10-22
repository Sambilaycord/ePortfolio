import type { SimpleIcon } from "simple-icons";

import { pantryShelves } from "@/lib/pantry";
import { cssVars } from "@/lib/utils";

/** Pure black or white marks would vanish on one of the two themes, so those keep the room's ink. */
function markColourOf(tool: SimpleIcon): string {
  return tool.hex === "000000" || tool.hex === "FFFFFF" ? "var(--brand-fg)" : `#${tool.hex}`;
}

/** A glass jar with the tool's mark inside and its name on a paper label; it wiggles and pops its lid on hover. */
function Jar({ tool, order }: { tool: SimpleIcon; order: number }) {
  return (
    <li className="jar group relative flex w-10 shrink-0 flex-col items-center short-phone:w-9 landscape-phone:w-8 sm:w-12 lg:w-20" style={cssVars({ "--j": String(order) })}>
      <svg viewBox="0 0 100 120" aria-hidden="true" className="h-auto w-full overflow-visible">
        <g className="jar__lid">
          <rect x="22" y="4" width="56" height="16" rx="5" className="fill-brand-accent" />
          <path d="M30 12h40" className="stroke-brand-on-accent" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        </g>
        <path
          d="M26 22h48v6c10 4 16 12 16 24v48a16 16 0 0 1-16 16H26a16 16 0 0 1-16-16V52c0-12 6-20 16-24z"
          className="fill-brand-surface/55 stroke-brand-dim"
          strokeWidth="2.5"
        />
        <path d="M20 54v40" className="stroke-brand-surface" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <svg x="32" y="44" width="36" height="36" viewBox="0 0 24 24" className="fill-brand-fg transition-[fill] duration-300 group-hover:fill-(--jar-colour)" style={cssVars({ "--jar-colour": markColourOf(tool) })}>
          <path d={tool.path} />
        </svg>
      </svg>
      {/* A tag tied low on the glass, hanging toward the shelf: below the mark, and never lifting the jar off the plank. */}
      <span className="jar__label text-hand absolute top-[80%] left-1/2 z-10 w-max max-w-16 -translate-x-1/2 -rotate-3 rounded-sm bg-brand-accent-3 px-1.5 py-0.5 text-center text-xs leading-none text-balance text-brand-cocoa shadow-sm group-hover:rotate-2 sm:max-w-none sm:text-sm sm:whitespace-nowrap lg:text-base">
        {tool.title}
      </span>
    </li>
  );
}

/**
 * The shelf above the desk, close up: the tools I reach for, kept like a pantry. Each jar
 * is set down on its shelf in turn as the scene scrolls (`--stock` against its `--j`).
 */
export function PantryShelves() {
  let order = 0;
  return (
    <div className="pantry flex h-full flex-col justify-center gap-3 px-5 pt-20 pb-6 short-phone:gap-2 short-phone:pt-18 short-phone:pb-3 landscape-phone:gap-1 landscape-phone:pt-16 landscape-phone:pb-2 sm:gap-6 sm:px-10 sm:pt-24 sm:pb-8">
      <div className="pantry-title mx-auto text-center">
        <p className="text-label text-brand-accent">03 · What&apos;s in my pantry</p>
        <h2 className="text-display mt-2 text-[clamp(1.35rem,min(4vw,6svh),3.25rem)] landscape-phone:mt-0">
          The ingredients I cook with, <span className="text-hand text-[1.15em] text-brand-accent">most days.</span>
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-1 landscape-phone:grid-cols-2 landscape-phone:gap-x-8 landscape-phone:gap-y-0 sm:gap-y-2 lg:grid-cols-2 lg:gap-y-4">
        {pantryShelves.map((shelf) => (
          <div key={shelf.name}>
            <div className="mb-1 flex items-baseline justify-between gap-4 px-1">
              <h3 className="text-display text-sm sm:text-base lg:text-lg">{shelf.name}</h3>
              <p className="text-hand hidden text-base text-brand-muted sm:block">{shelf.note}</p>
            </div>
            <ul className="flex items-end justify-evenly gap-2">
              {shelf.tools.map((tool) => (
                <Jar key={tool.slug} tool={tool} order={order++} />
              ))}
            </ul>
            {/* Room under the plank for the tags that hang over its edge. */}
            <div aria-hidden="true" className="shelf-plank mt-0.5 mb-3 h-2.5 rounded-full short-phone:mb-2.5 landscape-phone:mb-2 sm:h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
