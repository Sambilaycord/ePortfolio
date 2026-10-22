"use client";

import { ArrowUpRight, BatteryMedium, ChartColumn, Clapperboard, Clock, Coffee, FileText, Flower2, Folder, Mail, Sailboat, Sparkles, Target, Wifi, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useRef, useSyncExternalStore } from "react";

import { currentMinute, minuteOnServer, subscribeMinute } from "@/lib/clock";
import { allProjects, projectGroups, type Demo, type Project } from "@/lib/projects";
import { owner } from "@/lib/site";
import { followScroll } from "@/lib/camera";
import { segment, useSceneProgress } from "@/lib/use-scene-progress";
import { clamp, cssVars, padNumber } from "@/lib/utils";

import { scrollPageTo } from "../smooth-scroll";
import { BootTerminal } from "./boot-terminal";
import { OsWallpaper } from "./os-wallpaper";
import { DemoContent } from "./project-demos";

const APP_ICONS: Record<Demo, LucideIcon> = {
  studio: Clapperboard,
  chart: ChartColumn,
  boat: Sailboat,
  leads: Target,
  thumbnail: Sparkles,
  clock: Clock,
  flower: Flower2,
};

const APP_COUNT = allProjects.length;
/** Screens of scroll per app, from its icon bouncing to the window going back into the dock. */
const SCREENS_PER_APP = 1.05;
/** In apps: the start-up and welcome note come before the first, and the desktop clearing after the last. */
const TIMELINE_START = -1.4;
const TIMELINE_END = APP_COUNT + 0.4;

const shortTime = new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", timeZone: owner.timeZone });

/** Where the scene is, in apps: −1.4 is the start-up terminal, 0 the first app opening, and so on. */
function appPosition(progress: number): number {
  return TIMELINE_START + progress * (TIMELINE_END - TIMELINE_START);
}

/** The scene progress at which an app's window is open and read in. */
function progressForApp(index: number): number {
  return (index + 0.45 - TIMELINE_START) / (TIMELINE_END - TIMELINE_START);
}

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

function MenuBarClock() {
  const minute = useSyncExternalStore(subscribeMinute, currentMinute, minuteOnServer);
  return <time suppressHydrationWarning>{minute === null ? "" : shortTime.format(minute * 60_000)}</time>;
}

/** Each word of a name sits in its own mask and rises out of it in turn. */
function RisingWords({ text }: { text: string }) {
  // The space sits between the masks: inside an inline-block it would collapse away.
  return text.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className="zen-word-mask">
        <span className="zen-word" style={cssVars({ "--k": String(index) })}>
          {word}
        </span>
      </span>
    </Fragment>
  ));
}

function TrafficLights() {
  return (
    <span aria-hidden="true" className="flex gap-1.5">
      <span className="size-3 rounded-full bg-[#ef6b5e]" />
      <span className="size-3 rounded-full bg-[#f4bf4f]" />
      <span className="size-3 rounded-full bg-[#61c454]" />
    </span>
  );
}

/** What the window's left pane shows: the real thing when there is a screenshot, the drawn demo otherwise. */
function AppPreview({ project }: { project: Project }) {
  if (!project.image) return <DemoContent demo={project.demo} />;
  return (
    <div className="relative grid h-full place-items-center bg-white p-3">
      <Image
        src={project.image.src}
        alt={project.image.alt}
        width={project.image.width}
        height={project.image.height}
        sizes="(min-width: 768px) 32rem, 92vw"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

function AppWindow({ project, index }: { project: Project; index: number }) {
  // The note, stack and links reveal after however many contributions came before them.
  const afterContributions = 2 + project.contributions.length;
  return (
    <article data-os-window={index} style={cssVars({ "--hue-base": project.hue })} className="os-window">
      <header className="relative flex items-center border-b border-brand-on-cocoa/10 px-4 py-3">
        <TrafficLights />
        {/* Kept clear of the traffic lights, and cut short rather than running into them on a narrow window. */}
        <p className="absolute inset-x-0 truncate px-20 text-center text-xs font-bold text-brand-on-cocoa/60">
          {project.name} <span className="hidden font-normal sm:inline">— {project.kind}</span>
        </p>
      </header>
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="os-window__demo h-[min(11rem,24svh)] shrink-0 border-b border-brand-on-cocoa/10 sm:h-[min(14rem,28svh)] md:h-auto md:border-r md:border-b-0">
          <AppPreview project={project} />
        </div>
        {/* Where a small screen cannot fit it all, the text scrolls on its own under a finger. */}
        <div className="min-h-0 overflow-y-auto p-5 landscape-phone:py-3 sm:px-8 sm:py-6">
          <p className="zen-reveal flex items-center gap-3" style={cssVars({ "--k": "0" })}>
            <span className="font-mono text-sm text-(--hue)">{padNumber(index + 1)}</span>
            <span className="h-px w-6 bg-(--hue) opacity-50" />
            <span className="text-label text-brand-on-cocoa/55">{project.kind}</span>
          </p>
          <h3 className="text-display mt-1.5 text-[clamp(1.6rem,3.4vw,3.1rem)]">
            <RisingWords text={project.name} />
          </h3>
          <p className="zen-reveal mt-2 text-[0.95rem] leading-relaxed text-brand-on-cocoa/70 sm:text-base" style={cssVars({ "--k": "1" })}>
            {project.summary}
          </p>
          <ul className="mt-3 hidden space-y-1.5 text-sm leading-snug text-brand-on-cocoa/85 md:block">
            {project.contributions.map((contribution, contributionIndex) => (
              <li key={contribution} className="zen-reveal flex gap-2.5" style={cssVars({ "--k": String(2 + contributionIndex) })}>
                <span aria-hidden="true" className="text-(--hue)">✦</span>
                {contribution}
              </li>
            ))}
          </ul>
          <p className="zen-reveal text-hand mt-3 text-lg leading-snug sm:text-xl text-(--hue)" style={cssVars({ "--k": String(afterContributions) })}>
            “{project.note}”
          </p>
          <ul aria-label="Built with" className="zen-reveal mt-3 flex flex-wrap gap-1.5" style={cssVars({ "--k": String(afterContributions + 1) })}>
            {project.stack.map((tool) => (
              <li key={tool} className="rounded-full bg-brand-on-cocoa/[0.07] px-2.5 py-0.5 text-xs font-semibold text-brand-on-cocoa/80">
                {tool}
              </li>
            ))}
          </ul>
          {project.links && (
            <p className="zen-reveal mt-3 flex flex-wrap gap-x-5 gap-y-2" style={cssVars({ "--k": String(afterContributions + 2) })}>
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-sm font-bold text-(--hue) hover:underline">
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** The navbar's other stops, as things on the desktop, in the navbar's order. Projects is the desktop itself. */
const SHORTCUTS = [
  { label: "about-me.txt", href: "#about", Icon: FileText },
  { label: "journey", href: "#journey", Icon: Folder },
  { label: "pantry", href: "#toolbox", Icon: Folder },
  { label: "say-hi.eml", href: "#contact", Icon: Mail },
];

/**
 * Projects, inside the laptop: a little desktop. It boots, says hello, then opens every
 * project one app at a time, in the dock's order. Each app's icon bounces and its window
 * zooms out of it; once read, the window squeezes back into its icon and the next one
 * opens. When the last is put away the desktop clears to its wallpaper, which is where the
 * next scene picks up.
 */
export function ProjectsChapter() {
  const sceneRef = useRef<HTMLElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLOListElement>(null);
  const activeAppRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(-2);
  const followRef = useRef<ReturnType<typeof followScroll> | null>(null);
  const windowsRef = useRef<HTMLElement[] | null>(null);

  function markActive(index: number) {
    if (index === activeRef.current) return;
    activeRef.current = index;
    dockRef.current?.querySelectorAll("button").forEach((icon, iconIndex) => {
      if (iconIndex === index) icon.setAttribute("aria-current", "true");
      else icon.removeAttribute("aria-current");
    });
    if (activeAppRef.current) activeAppRef.current.textContent = index < 0 ? "Finder" : allProjects[index].name;
  }

  // Each window zooms out of, and back into, its own dock icon: its transform origin is that icon's centre.
  useEffect(() => {
    const desktop = desktopRef.current;
    const dock = dockRef.current;
    if (!desktop || !dock) return;

    const aimAtIcons = () => {
      const icons = dock.querySelectorAll("button");
      desktop.querySelectorAll<HTMLElement>("[data-os-window]").forEach((appWindow) => {
        const icon = icons[Number(appWindow.dataset.osWindow)];
        if (!icon) return;
        const transform = appWindow.style.transform;
        appWindow.style.transform = "none";
        const box = appWindow.getBoundingClientRect();
        const iconBox = icon.getBoundingClientRect();
        appWindow.style.transform = transform;
        appWindow.style.setProperty("--ox", `${iconBox.left + iconBox.width / 2 - box.left}px`);
        appWindow.style.setProperty("--oy", `${iconBox.top + iconBox.height / 2 - box.top}px`);
      });
    };
    aimAtIcons();
    const observer = new ResizeObserver(aimAtIcons);
    observer.observe(desktop);
    return () => observer.disconnect();
  }, []);

  // The desktop, from its smoothed progress, so a fast scroll never opens and shuts a window within a frame.
  function placeDesktop(progress: number) {
    const scene = sceneRef.current;
    const desktop = desktopRef.current;
    if (!scene || !desktop) return;

    const position = appPosition(progress);
    // The terminal prints its output a line at a time, then dissolves into the desktop.
    for (let line = 0; line < 4; line++) {
      scene.style.setProperty(`--line-${line}`, segment(position, -1.4 + line * 0.09, -1.33 + line * 0.09).toFixed(4));
    }
    scene.style.setProperty("--boot", (1 - segment(position, -1.0, -0.8)).toFixed(4));
    scene.style.setProperty("--note", (segment(position, -0.85, -0.6) - segment(position, -0.3, 0)).toFixed(4));
    // Once the last app is put away, the menu bar, dock and shortcuts clear, leaving just the wallpaper.
    scene.style.setProperty("--clear", segment(position, APP_COUNT + 0.05, APP_COUNT + 0.3).toFixed(4));

    // The windows never change once rendered, so they are looked up once rather than every frame.
    windowsRef.current ??= [...desktop.querySelectorAll<HTMLElement>("[data-os-window]")];
    windowsRef.current.forEach((appWindow) => {
      const slot = Number(appWindow.dataset.osWindow);
      const opened = easeOutCubic(segment(position, slot - 0.25, slot + 0.1));
      const minimised = segment(position, slot + 0.7, slot + 1);
      // Going back into the dock it narrows faster than it shortens, which reads as the window being drawn in.
      const scale = 0.04 + 0.96 * opened;
      appWindow.style.setProperty("--sx", (scale * (1 - 0.96 * minimised ** 0.55)).toFixed(4));
      appWindow.style.setProperty("--sy", (scale * (1 - 0.96 * minimised)).toFixed(4));
      appWindow.style.setProperty("--o", (Math.min(1, opened * 3) * (1 - segment(minimised, 0.75, 1))).toFixed(4));
      appWindow.style.setProperty("--show", segment(position, slot + 0.02, slot + 0.45).toFixed(4));
      appWindow.toggleAttribute("data-live", opened > 0 && minimised < 1);
    });

    markActive(position < -0.3 || position > APP_COUNT - 0.1 ? -1 : clamp(Math.round(position), 0, APP_COUNT - 1));
  }

  useSceneProgress(sceneRef, (progress) => {
    // At most about two and a half apps' worth per second: each window still visibly opens and closes.
    followRef.current ??= followScroll(placeDesktop, 2.5 / (TIMELINE_END - TIMELINE_START));
    followRef.current.set(progress);
  });

  useEffect(() => () => followRef.current?.dispose(), []);

  function openApp(index: number) {
    const scene = sceneRef.current;
    if (!scene) return;
    scrollPageTo(scene.offsetTop + progressForApp(index) * (scene.offsetHeight - window.innerHeight));
  }

  let dockIndex = 0;

  return (
    <section
      id="projects"
      ref={sceneRef}
      className="scene scene--handoff zen-scene relative"
      style={{ height: `${(TIMELINE_END - TIMELINE_START) * SCREENS_PER_APP * 100 + 100}svh` }}
    >
      <div className="scene-stage">
        {/* Framed in the laptop screen's shape, so the room's laptop, zoomed in, shows exactly this picture. */}
        <div className="lock-frame">
          <OsWallpaper />
        </div>

        <div className="os-menubar os-chrome absolute inset-x-0 top-15 z-20 flex h-7 items-center justify-between px-4 text-xs font-semibold text-brand-fg">
          <p className="flex min-w-0 items-center gap-4 whitespace-nowrap">
            <Coffee aria-hidden="true" className="size-3.5 shrink-0 text-brand-accent" />
            <span className="hidden font-bold sm:inline">sambilaycord OS</span>
            <span ref={activeAppRef} className="truncate font-bold text-brand-accent">Finder</span>
            <span className="hidden gap-4 text-brand-fg/70 sm:flex" aria-hidden="true">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Window</span>
            </span>
          </p>
          <p className="flex shrink-0 items-center gap-3">
            <Wifi aria-hidden="true" className="size-3.5" />
            <BatteryMedium aria-hidden="true" className="size-4" />
            <MenuBarClock />
          </p>
        </div>

        <h2 className="sr-only">Projects</h2>
        <ul className="os-chrome absolute top-28 left-5 z-10 hidden flex-col gap-5 landscape-phone:hidden md:flex">
          {SHORTCUTS.map(({ label, href, Icon }) => (
            <li key={href}>
              <a href={href} className="os-shortcut group flex w-20 flex-col items-center gap-1 text-center">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-surface/70 text-brand-accent shadow-md backdrop-blur-sm transition-transform group-hover:-translate-y-0.5">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="rounded px-1 text-xs font-semibold text-brand-fg">{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div ref={desktopRef} data-desktop="" className="absolute inset-0">
          <div className="os-note">
            <header className="flex items-center border-b border-brand-line px-4 py-3">
              <TrafficLights />
              <p className="flex-1 pr-10 text-center text-xs font-bold text-brand-muted">welcome.txt</p>
            </header>
            <div className="p-6 sm:p-8">
              <p className="text-label text-brand-accent">01 · Projects</p>
              <p className="text-display mt-3 text-[clamp(2rem,5vw,3.5rem)] text-brand-fg">
                Things I&apos;ve <span className="text-hand text-[1.15em] text-brand-accent">built.</span>
              </p>
              <p className="mt-4 leading-relaxed text-brand-muted">
                Lately at Zen Companies, one small team in the Philippines building and running its own software, and before
                that at school. Scroll to open each app, or tap one in the dock.
              </p>
            </div>
          </div>

          {allProjects.map((project, index) => (
            <AppWindow key={project.slug} project={project} index={index} />
          ))}
        </div>

        <ol ref={dockRef} aria-label="Apps" className="os-dock os-chrome absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-end gap-1.5 rounded-2xl p-2 landscape-phone:bottom-2 landscape-phone:p-1.5 sm:gap-2">
          {projectGroups.map((group, groupIndex) => (
            <Fragment key={group.name}>
              {groupIndex > 0 && <li aria-hidden="true" className="mx-1 h-10 w-px self-center bg-brand-fg/15" />}
              {group.projects.map((project) => {
                const index = dockIndex++;
                const Icon = APP_ICONS[project.demo];
                return (
                  <li key={project.slug}>
                    <button
                      type="button"
                      onClick={() => openApp(index)}
                      aria-label={`Open ${project.name}, ${group.name}`}
                      className="os-dock-icon"
                      style={cssVars({ "--hue": project.hue })}
                    >
                      <Icon aria-hidden="true" className="size-5 sm:size-6" />
                      <span className="os-dock-icon__name">{project.name}</span>
                    </button>
                  </li>
                );
              })}
            </Fragment>
          ))}
        </ol>

        {/* The second half of the start-up the about scene began: the command's output, then the desktop. */}
        <div aria-hidden="true" className="os-boot absolute inset-0 z-30 grid place-items-center bg-brand-cocoa text-brand-on-cocoa">
          <div className="boot-frame">
            <BootTerminal withOutput />
          </div>
        </div>
      </div>
    </section>
  );
}
