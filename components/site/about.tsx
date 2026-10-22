"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { owner } from "@/lib/site";
import { followScroll } from "@/lib/camera";
import { segment, useSceneProgress } from "@/lib/use-scene-progress";
import { cssVars } from "@/lib/utils";

import { BootTerminal } from "./boot-terminal";
import { LockBackdrop } from "./lock-screen";
import { RunningHead } from "./section";

type Passage = { text: string; emphasis?: string; className: string };

const PASSAGES: Passage[] = [
  {
    text: "I like owning a product end to end, from the client's first call to the database row to the hover state.",
    emphasis: "hover state.",
    className: "text-display text-[clamp(1.6rem,min(7.5vw,5.3svh),2.2rem)] text-brand-fg sm:text-[clamp(1.6rem,min(3vw,5.3svh),2.8rem)] landscape-phone:text-[clamp(1.3rem,5.3svh,2.8rem)]",
  },
  {
    text: `I'm ${owner.firstName}, a technical project manager at Zen Companies who never stopped coding. I graduated Cum Laude in Computer Science from USTP in Cagayan de Oro, where I wandered happily between machine-learning research, a flower marketplace and game jams.`,
    className: "mt-5 text-[clamp(1rem,2.6svh,1.125rem)] leading-relaxed text-brand-fg landscape-phone:mt-3 landscape-phone:text-[0.9rem] landscape-phone:leading-normal sm:text-[clamp(0.9rem,2.1svh,1.125rem)]",
  },
  {
    text: "These days I run delivery for our team across six products, from client calls and PRDs to code review and release. I still ship full-stack across them too: Laravel and Supabase back ends, Stripe booking flows, role-based auth, Slack integrations and React front ends down to the WebGL on our company site. This portfolio is where I get to play, just for me.",
    className: "mt-3 text-[clamp(1rem,2.6svh,1.125rem)] leading-relaxed text-brand-fg landscape-phone:text-[0.9rem] landscape-phone:leading-normal sm:text-[clamp(0.9rem,2.1svh,1.125rem)]",
  },
];

/** The share of the scene's scroll at which the about text has fully read itself in. */
const ABOUT_LANDING = 0.46;

const WORD_COUNTS = PASSAGES.map((passage) => passage.text.split(" ").length);
const WORD_COUNT = WORD_COUNTS.reduce((total, count) => total + count, 0);
const PASSWORD_DOTS = 8;

/**
 * On a phone the passages take the panel one at a time, as pages: where each starts in the
 * reading (`--read`), by its length, with the big-type headline counted double since it reads slower.
 */
const PAGE_WEIGHTS = WORD_COUNTS.map((count, index) => (index === 0 ? count * 2 : count));
const PAGE_STARTS = PAGE_WEIGHTS.map((_, index) => PAGE_WEIGHTS.slice(0, index).reduce((total, weight) => total + weight, 0) / PAGE_WEIGHTS.reduce((total, weight) => total + weight, 0));
/** Of each page's stretch, the share its words take to light up; the rest it holds, fully read, before the next. */
const PAGE_READING = 0.75;

/**
 * A page's place in the reading, as the custom properties the stylesheet pages it with:
 * `--from`/`--to` when it is on the panel (the first already showing, the last staying), and
 * `--start`/`--span` for its words to light up across.
 */
function pageVars(index: number) {
  const start = PAGE_STARTS[index];
  const end = PAGE_STARTS[index + 1] ?? 1;
  return {
    "--from": String(index === 0 ? -1 : start),
    "--to": String(index === PASSAGES.length - 1 ? 2 : end),
    "--start": start.toFixed(4),
    "--span": ((end - start) * PAGE_READING).toFixed(4),
  };
}

/**
 * The passages, split into words that each know their place in the whole (`--w`) and in their
 * own passage (`--wp`). A word lights up from faint to full as the scroll passes its place, so
 * the text reads itself in: across the whole panel on a wide screen, page by page on a phone.
 */
function LitPassages() {
  let wordIndex = 0;
  return (
    <div className="about-passages">
      {PASSAGES.map((passage, passageIndex) => {
        const emphasisFrom = passage.emphasis ? passage.text.lastIndexOf(passage.emphasis) : -1;
        const words = passage.text.split(" ");
        let offset = 0;
        return (
          <p key={passage.text} className={passage.className} style={cssVars(pageVars(passageIndex))}>
            {words.map((word, index) => {
              const isEmphasis = emphasisFrom >= 0 && offset >= emphasisFrom;
              offset += word.length + 1;
              const place = (wordIndex++ / WORD_COUNT).toFixed(4);
              return (
                <span key={index}>
                  {index > 0 && " "}
                  <span
                    className={isEmphasis ? "about-word text-hand text-[1.2em] text-brand-accent" : "about-word"}
                    style={cssVars({ "--w": place, "--wp": (index / words.length).toFixed(4) })}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

/**
 * About me, on the laptop's lock screen. The hero flies into the laptop and lands on it;
 * scrolling wakes it to a page about me, portrait on the left and the words reading
 * themselves in on the right. Scrolling on, that folds away
 * to the login itself: a small picture, my name, a password typing itself, a welcome, and the
 * terminal that opens the projects.
 */
export function About() {
  const sceneRef = useRef<HTMLElement>(null);
  const followRef = useRef<ReturnType<typeof followScroll> | null>(null);

  // The login screen, from its smoothed progress, so a fast scroll plays its stages rather than flashing through them.
  function placeLogin(progress: number) {
    const scene = sceneRef.current;
    if (!scene) return;
    const wake = segment(progress, 0.02, 0.12);
    scene.style.setProperty("--wake", wake.toFixed(4));
    scene.style.setProperty("--read", segment(progress, 0.12, ABOUT_LANDING).toFixed(4));
    const login = segment(progress, 0.52, 0.6);
    scene.style.setProperty("--login", login.toFixed(4));
    // The about page only takes clicks while it is the thing on screen.
    scene.toggleAttribute("data-page", wake > 0.5 && login < 0.5);
    scene.style.setProperty("--pw", segment(progress, 0.62, 0.72).toFixed(4));
    scene.style.setProperty("--welcome", segment(progress, 0.73, 0.78).toFixed(4));
    scene.style.setProperty("--term", segment(progress, 0.8, 0.86).toFixed(4));
    scene.style.setProperty("--typed", segment(progress, 0.87, 0.97).toFixed(4));
  }

  useSceneProgress(sceneRef, (progress) => {
    followRef.current ??= followScroll(placeLogin, 0.8);
    followRef.current.set(progress);
  });

  useEffect(() => () => followRef.current?.dispose(), []);

  return (
    <section ref={sceneRef} className="scene scene--handoff about-scene" style={{ height: "440svh" }}>
      {/*
        Where "About" lands: once the page about me has read itself in, not on the bare lock
        screen at the scene's start. It spans the rest of the scene, short of the last screen,
        which the projects scene slides in under, so the nav hands over to Projects on time.
      */}
      <span id="about" aria-hidden="true" className="absolute inset-x-0" style={{ top: `${ABOUT_LANDING * (440 - 100)}svh`, bottom: "100svh" }} />
      <div className="scene-stage">
        <LockBackdrop fullscreen />

        <div className="about-layout absolute inset-0 flex items-center justify-center px-4 pt-18 pb-6 landscape-phone:pt-16 landscape-phone:pb-3 sm:px-8">
          <div className="about-panel grid w-full max-w-6xl items-center gap-8 p-5 landscape-phone:rounded-2xl landscape-phone:px-6 landscape-phone:py-4 sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
            <figure className="relative mx-auto hidden landscape-phone:hidden sm:block">
              <div className="relative aspect-3/4 h-[min(34svh,20rem)] overflow-hidden lg:h-[min(48svh,28rem)] rounded-t-full border-8 border-brand-surface shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--brand-cocoa)_60%,transparent)]">
                <Image src="/images/profile.jpg" alt={`${owner.firstName}, smiling outdoors`} fill loading="eager" sizes="22rem" className="object-cover" />
              </div>
              <figcaption className="text-hand absolute -right-4 bottom-8 rotate-6 rounded-md bg-brand-accent-3 px-3 py-1 text-xl text-brand-cocoa shadow-md">
                hi, that&apos;s me ♥
              </figcaption>
            </figure>

            <div>
              <div className="mb-6 flex items-center gap-3 landscape-phone:mb-3">
                {/* On a phone the big portrait has no room, so a small one sits by the label. */}
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-brand-surface shadow-md sm:hidden">
                  <Image src="/images/profile.jpg" alt="" fill sizes="3rem" className="object-cover object-[50%_25%]" />
                </span>
                <RunningHead label="A little about me" aside="pull up a chair" className="flex-1" />
              </div>
              <h2 className="sr-only">About me</h2>
              <LitPassages />
              {/* Which page of the three is showing, on a phone. */}
              <p aria-hidden="true" className="about-dots mt-6 hidden justify-center gap-2">
                {PASSAGES.map((passage, index) => (
                  <span key={passage.text} className="about-dot h-1.5 rounded-full bg-brand-accent" style={cssVars(pageVars(index))} />
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* The login itself: a small picture, the name, and a password that types itself. */}
        <div aria-hidden="true" className="login-account absolute inset-0 flex flex-col items-center justify-center gap-5 px-5 pt-16">
          <div className="flex flex-col items-center text-center">
            <span className="relative size-24 overflow-hidden rounded-full border-4 border-white/80 shadow-xl sm:size-28">
              <Image src="/images/profile.jpg" alt="" fill sizes="7rem" className="object-cover object-[50%_25%]" />
            </span>
            <p className="text-display mt-3 text-4xl text-white drop-shadow">{owner.firstName}</p>
          </div>
          <div className="grid">
            <div className="login-field col-start-1 row-start-1 flex items-center gap-3 rounded-full py-2 pr-2 pl-5">
              <span className="flex gap-1.5">
                {Array.from({ length: PASSWORD_DOTS }, (_, index) => (
                  <span key={index} className="login-dot size-2 rounded-full bg-brand-fg" style={cssVars({ "--i": String(index) })} />
                ))}
              </span>
              <span className="grid size-8 place-items-center rounded-full bg-brand-accent text-brand-on-accent">
                <ArrowRight className="size-4" />
              </span>
            </div>
            <p className="login-welcome text-hand col-start-1 row-start-1 self-center text-center text-2xl whitespace-nowrap text-white drop-shadow">
              welcome back, {owner.firstName} ♥
            </p>
          </div>
        </div>

        {/* Logged in, the screen goes dark and the command that opens the projects types itself. */}
        <div aria-hidden="true" className="login-terminal absolute inset-0 z-30 grid place-items-center bg-brand-cocoa text-brand-on-cocoa">
          <div className="boot-frame">
            <BootTerminal withOutput={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
