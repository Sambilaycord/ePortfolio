"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { SMOOTH_SCROLL_EVENT } from "@/lib/motion";
import { helloHref, siteNavigation } from "@/lib/site";
import { cn, padNumber } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

/** How far, in pixels, the page has to scroll before an open phone menu folds away. */
const SCROLL_TO_CLOSE = 48;

/** A section counts as current while it crosses the horizontal midline of the viewport. */
const VIEWPORT_MIDLINE = "-50% 0px -50% 0px";

/** Of these elements, the one crossing the middle of the window, which is how the page judges where the visitor is. */
export function elementAtMidline<T extends Element>(elements: T[]): T | undefined {
  const midline = window.innerHeight / 2;
  return elements.find((element) => {
    const { top, bottom } = element.getBoundingClientRect();
    return top <= midline && bottom > midline;
  });
}

function useSectionInView(): string | null {
  const [sectionInView, setSectionInView] = useState<string | null>(null);

  useEffect(() => {
    const sections = siteNavigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);

    // Entries only report sections whose state changed, so a long jump can skip one; re-measure them all instead.
    function findSectionAtMidline() {
      setSectionInView(elementAtMidline(sections)?.id ?? null);
    }

    // Pinned scenes hold sections in place for screens at a time, so crossings alone are too rare; re-check on scroll as well.
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        findSectionAtMidline();
      });
    };
    const observer = new IntersectionObserver(findSectionAtMidline, { rootMargin: VIEWPORT_MIDLINE });
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return sectionInView;
}

export function SiteNav() {
  const sectionInView = useSectionInView();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-7 text-sm font-semibold text-brand-muted md:flex">
      {siteNavigation.map((item) => {
        const current = item.href.slice(1) === sectionInView;
        return (
          <a
            key={item.href}
            href={`/${item.href}`}
            aria-current={current ? "location" : undefined}
            className={cn("relative py-1 transition-colors hover:text-brand-fg", current && "text-brand-accent hover:text-brand-accent")}
          >
            {item.label}
            {/* A little hand-drawn squiggle under the current section, sketched in as it becomes current. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 60 8"
              preserveAspectRatio="none"
              className={cn(
                "absolute inset-x-0 -bottom-1.5 h-1.5 w-full text-brand-accent transition-[clip-path] duration-500",
                current ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]",
              )}
            >
              <path d="M1 5c8-4 12 2 20-1s12-3 18 0 12 2 20-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        );
      })}
    </nav>
  );
}

/**
 * The nav on a phone, where the links, theme toggle and "say hi" do not fit across the header:
 * a button that drops them down in a sheet, which folds away once a link is followed, the page
 * scrolls, or the visitor taps elsewhere.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    // Only a real scroll closes it: the last of a fling, or the address bar settling, can nudge the page as it opens.
    const openedAt = window.scrollY;
    const closeOnScroll = () => {
      if (Math.abs(window.scrollY - openedAt) > SCROLL_TO_CLOSE) close();
    };
    // Closing from the keyboard hands focus back to the button, rather than losing it with the sheet.
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menuRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
      close();
    };
    const closeOnOutsideTap = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) close();
    };
    // The smooth scroll stops a section link's click before React sees it, but not other listeners on the window.
    const closeOnLink = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a") && menuRef.current?.contains(event.target)) close();
    };
    window.addEventListener(SMOOTH_SCROLL_EVENT, closeOnScroll);
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsideTap);
    window.addEventListener("click", closeOnLink, { capture: true });
    return () => {
      window.removeEventListener(SMOOTH_SCROLL_EVENT, closeOnScroll);
      window.removeEventListener("scroll", closeOnScroll);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsideTap);
      window.removeEventListener("click", closeOnLink, { capture: true });
    };
  }, [open]);

  return (
    <div ref={menuRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? sheetId : undefined}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="grid size-10 place-items-center rounded-full border border-brand-line bg-brand-surface/60 text-brand-fg transition-colors hover:text-brand-accent"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>

      {open && (
        <div
          id={sheetId}
          className="absolute inset-x-0 top-full border-b border-brand-line/70 bg-brand-bg px-6 pt-2 pb-6 shadow-[0_24px_40px_-24px_color-mix(in_srgb,var(--brand-cocoa)_45%,transparent)]"
        >
          <SheetLinks />
          <div className="mt-4 flex items-center justify-between gap-4">
            <ThemeToggle />
            <a
              href={helloHref}
              className="inline-flex h-10 items-center rounded-full bg-brand-accent px-5 text-sm font-bold text-brand-on-accent transition-colors hover:bg-brand-tint-fg"
            >
              Say hi
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/** The sheet's links. Mounted only while the sheet is open, so the menu watches where the visitor is only then. */
function SheetLinks() {
  const sectionInView = useSectionInView();
  return (
    <nav aria-label="Primary">
      <ul className="divide-y divide-brand-line/60">
        {siteNavigation.map((item, index) => {
          const current = item.href.slice(1) === sectionInView;
          return (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                aria-current={current ? "location" : undefined}
                className={cn("flex items-baseline gap-4 py-3 text-brand-fg", current && "text-brand-accent")}
              >
                <span className="font-mono text-xs text-brand-muted">{padNumber(index + 1)}</span>
                <span className="text-display text-2xl">{item.label}</span>
                {current && <span className="text-hand ml-auto text-lg">you are here</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
