"use client";

import { Coffee } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { journey } from "@/lib/site";
import { cssVars } from "@/lib/utils";

const TILTS = [-3, 2, -1.5];

/**
 * The red string's path through the pins, measured from where the pins actually sit, in the
 * board's own pixels. Measuring keeps it meeting the pins at any screen size, and drawing in
 * real pixels lets the dash-offset draw-on work without the stroke being stretched.
 */
function stringThroughPins(board: HTMLElement, svg: SVGSVGElement, path: SVGPathElement) {
  const frame = board.getBoundingClientRect();
  const pins = Array.from(board.querySelectorAll<HTMLElement>("[data-string-pin]"))
    .map((pin) => pin.getBoundingClientRect())
    .filter((box) => box.width > 0)
    .map((box) => [box.left + box.width / 2 - frame.left, box.top + box.height / 2 - frame.top]);
  svg.setAttribute("viewBox", `0 0 ${frame.width} ${frame.height}`);
  if (pins.length < 2) {
    path.setAttribute("d", "");
    return;
  }
  const [[startX, startY], ...rest] = pins;
  // A gentle sag between pins, like string pulled not quite taut.
  const curves = rest.map(([x, y], index) => {
    const [previousX, previousY] = pins[index];
    return `Q${(previousX + x) / 2} ${Math.max(previousY, y) + 60} ${x} ${y}`;
  });
  path.setAttribute("d", `M${startX} ${startY} ${curves.join(" ")}`);
}

/**
 * The cork board above the desk, close up: how I got here, pinned up as photos with notes,
 * joined by a red string that draws itself from one to the next as the scene scrolls.
 * `--string` on the scene is how far along it is; each stop pops up as the string reaches it.
 * On a phone there is room for one stop at a time, so the one just reached fills the board.
 */
export function JourneyBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!board || !svg || !path) return;
    const measure = () => stringThroughPins(board, svg, path);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boardRef} className="board absolute inset-0 flex flex-col px-[5%] pt-22 pb-[4svh] sm:pt-24">
      <div className="board-title relative -rotate-1 self-center sm:self-start">
        <span aria-hidden="true" className="board-pin" />
        <p className="text-label text-brand-accent">02 · How I got here</p>
        <h2 className="text-display mt-1 text-[clamp(1.4rem,min(3.2vw,5.5svh),2.75rem)] text-[#3a2a21]">
          From a brand-new student society to <span className="text-hand text-[1.15em] text-brand-accent">shipping every week.</span>
        </h2>
      </div>

      <svg ref={svgRef} aria-hidden="true" className="board-string pointer-events-none absolute inset-0 z-1 size-full">
        <path ref={pathRef} pathLength="1" />
      </svg>

      <ol className="board-stops mt-[2.5svh] grid flex-1 items-start gap-x-[3vw]">
        {journey.map((stop, index) => (
          <li key={stop.place} data-stop={index} className="board-stop relative" style={cssVars({ "--i": String(index), "--tilt": `${TILTS[index]}deg` })}>
            <figure className="board-polaroid relative">
              <span aria-hidden="true" data-string-pin="" className="board-pin" />
              <div className="board-photo relative overflow-hidden bg-brand-tint">
                {stop.image ? (
                  <Image src={stop.image.src} alt={stop.image.alt} fill loading="eager" sizes="(min-width: 768px) 30vw, 80vw" className="object-cover" style={{ objectPosition: stop.image.focus ?? "top" }} />
                ) : (
                  <div className="grid size-full place-items-center bg-brand-cocoa text-brand-accent-3">
                    <Coffee aria-hidden="true" className="size-16" strokeWidth={1.25} />
                  </div>
                )}
              </div>
              <figcaption className="text-hand mt-2 text-center text-2xl leading-tight text-[#3a2a21] sm:text-[1.7rem]">{stop.when}</figcaption>
            </figure>
            <div className="board-note">
              <h3 className="text-display text-2xl text-[#3a2a21] sm:text-[1.9rem]">{stop.role}</h3>
              <p className="mt-0.5 text-sm font-bold text-[#7a5a48]">{stop.place}</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[#5a4336]">{stop.story}</p>
              <p className="text-hand mt-2 text-xl leading-tight text-[#c4473b] sm:text-2xl">✦ {stop.highlight}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
