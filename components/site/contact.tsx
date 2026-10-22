"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { prefersReducedMotion, subscribeReducedMotion } from "@/lib/motion";
import { helloHref, owner } from "@/lib/site";
import { segment, useSceneProgress } from "@/lib/use-scene-progress";
import { cssVars } from "@/lib/utils";

import { CONTAINER, RunningHead } from "./section";

type LivingStep = { lead: string; text: string; className: string; isCall?: boolean };

/** What we could make together, each set in its own voice, ending on the invitation. */
const LIVING_SEQUENCE: LivingStep[] = [
  { lead: "Let's build", text: "your booking flow.", className: "italic font-normal text-brand-accent" },
  { lead: "Let's build", text: "a dashboard.", className: "font-mono text-[0.72em] font-medium tracking-[-0.04em]" },
  { lead: "Let's build", text: "your team's HR tools.", className: "text-hand text-[1.15em] text-brand-accent" },
  { lead: "Let's build", text: "something cozy.", className: "text-outline font-semibold" },
  { lead: "Got an idea?", text: "Say hi.", className: "text-brand-accent", isCall: true },
];
const FINAL_STEP = LIVING_SEQUENCE.length - 1;
const STEP_MS = 1800;
/** The invitation is the point of the section, so it holds well past the other steps before the loop starts over. */
const CALL_HOLD_MS = 5000;

// Until hydration the visitor's preference is unknown; the sequence's opening step is the server render.
const prefersReducedMotionOnServer = () => false;

/** True from the first time the element is properly in view, and stays true after. */
function useHasBeenSeen(ref: React.RefObject<HTMLElement | null>): boolean {
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasBeenSeen(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return hasBeenSeen;
}

/**
 * Steps through the sequence, holding on the invitation before looping back. It starts the
 * first time the headline is properly in view, so nobody arrives mid-sentence.
 */
function useLivingStep(headlineRef: React.RefObject<HTMLElement | null>, reducedMotion: boolean): number {
  const [step, setStep] = useState(0);
  const hasBeenSeen = useHasBeenSeen(headlineRef);

  useEffect(() => {
    if (reducedMotion || !hasBeenSeen) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % LIVING_SEQUENCE.length),
      step === FINAL_STEP ? CALL_HOLD_MS : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [step, hasBeenSeen, reducedMotion]);

  return reducedMotion ? FINAL_STEP : step;
}

function LivingHeadline() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, prefersReducedMotionOnServer);
  const current = LIVING_SEQUENCE[useLivingStep(headlineRef, reducedMotion)];
  const ideas = LIVING_SEQUENCE.filter((step) => !step.isCall).map((step) => step.text.replace(".", ""));

  return (
    <h2 ref={headlineRef} className="text-display min-w-0 text-[clamp(2.4rem,min(9vw,15svh),8rem)] text-brand-fg">
      <span className="sr-only">
        Let&apos;s build {ideas.slice(0, -1).join(", ")} or {ideas[ideas.length - 1]}. Got an idea? Say hi.
      </span>
      <span aria-hidden="true" className="living-line">
        <span key={current.lead} className="living-swap">
          {current.lead}
        </span>
      </span>
      <span aria-hidden="true" className="living-line">
        <span key={current.text} className={`living-swap ${current.className}`}>
          {current.text}
        </span>
      </span>
    </h2>
  );
}

/** The share of the scene's scroll at which the invitation is fully lit. */
const CONTACT_LANDING = 0.4;

const NIGHT_STARS = [
  [8, 14], [17, 32], [26, 9], [38, 24], [47, 12], [58, 30], [66, 8], [74, 22], [83, 13], [92, 28], [12, 48], [88, 46], [52, 42],
];

/**
 * The evening beyond the desk's window: the room's camera flies out into it, and contact is set
 * on it. By daylight it is a sunset, the sun sinking behind the hills; by lamplight it is night,
 * with stars and a moon. The hills along the bottom are the colour the footer carries on in, so
 * the page ends without a seam either way.
 */
export function EveningSky() {
  return (
    <div aria-hidden="true" className="contact-dusk absolute inset-0 overflow-hidden">
      {NIGHT_STARS.map(([left, top], index) => (
        <span key={index} className="contact-star sky-star" style={{ left: `${left}%`, top: `${top}%`, ...cssVars({ "--i": String(index) }) }} />
      ))}
      <span className="contact-moon" />
      <span className="contact-sun" />
      <svg viewBox="0 0 1600 200" preserveAspectRatio="none" className="contact-hills absolute inset-x-0 bottom-0 h-[16svh] w-full">
        <path d="M0 120C160 70 300 80 460 115S760 150 940 100 1260 40 1420 85 1560 120 1600 110V200H0z" className="contact-hills__far" />
        <path d="M0 160C200 120 380 130 560 158S900 190 1120 150 1460 120 1600 145V200H0z" className="contact-hills__near" />
      </svg>
    </div>
  );
}

/**
 * The last scene, out through the window: the room's camera flies into the desk's window as the
 * evening comes in (a sunset by daylight, night by lamplight), and this takes over on the same
 * sky. The invitation then lights up in a pool of warm light. Either sky is dark enough for light
 * text, so the section carries its own evening palette whatever the theme.
 */
export function Contact() {
  const sceneRef = useRef<HTMLElement>(null);

  useSceneProgress(sceneRef, (progress) => {
    sceneRef.current?.style.setProperty("--lamp", segment(progress, 0.04, CONTACT_LANDING).toFixed(4));
  });

  return (
    <section ref={sceneRef} className="scene scene--handoff contact-scene night-palette" style={{ height: "220svh" }}>
      {/* Where "Contact" lands: with the invitation fully lit, rather than on the empty sky it starts on. */}
      <span id="contact" aria-hidden="true" className="absolute inset-x-0 bottom-0" style={{ top: `${CONTACT_LANDING * (220 - 100)}svh` }} />
      <div className="scene-stage">
        <EveningSky />
        <div aria-hidden="true" className="contact-lamp absolute inset-0" />

        <div className={`${CONTAINER} contact-content relative flex h-full flex-col justify-center px-6 pt-20 pb-10 landscape-phone:pt-16 landscape-phone:pb-4 lg:px-10`}>
          <RunningHead index="04" label="Say hi" aside="the kettle's on" />
          <div className="mt-10 short-phone:mt-6 landscape-phone:mt-2">
            <LivingHeadline />
          </div>

          <svg aria-hidden="true" viewBox="0 0 600 24" preserveAspectRatio="none" className="mt-2 h-5 w-full max-w-3xl text-brand-accent-2">
            <path pathLength="1" className="contact-scribble" d="M4 14c60-10 120 6 190-2s140-8 200 0 130 6 202-4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* The note on the left, the way out on the right: links first, so the invitation is the last thing the eye lands on. */}
          <div className="mt-12 grid gap-8 short-phone:mt-8 short-phone:gap-6 landscape-phone:mt-3 landscape-phone:grid-cols-[minmax(0,1fr)_auto] landscape-phone:items-end landscape-phone:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <p className="max-w-lg text-lg leading-relaxed text-brand-muted landscape-phone:text-sm">
              Whether it&apos;s a project, a question about something I built, or just to swap favorite CSS tricks, my door is
              open. I read everything, usually with something warm to drink.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 sm:justify-end">
              {[
                { label: "GitHub", href: owner.github },
                { label: "LinkedIn", href: owner.linkedin },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 font-bold text-brand-fg hover:text-brand-accent">
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
              <a
                href={helloHref}
                className="inline-flex h-14 items-center rounded-full bg-brand-accent px-8 text-lg font-bold text-brand-on-accent shadow-[0_14px_30px_-14px_var(--brand-accent)] transition-[background-color,translate] hover:-translate-y-0.5 hover:bg-brand-tint-fg"
              >
                Write to me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
