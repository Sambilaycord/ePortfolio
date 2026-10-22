import { helloHref, owner } from "@/lib/site";

import { CONTAINER } from "./section";
import { MobileMenu, SiteNav } from "./site-nav";
import { SteamingMug } from "./steaming-mug";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  // A solid tint, not a backdrop blur: a blur behind a fixed header is recomputed on every frame of the scenes moving under it.
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand-line/70 bg-brand-bg/95">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brand-fg focus:px-4 focus:py-2 focus:text-brand-bg"
      >
        Skip to content
      </a>

      <div className={`${CONTAINER} flex h-15 items-center justify-between gap-4 px-6 lg:px-10`}>
        <a href="#top" className="group flex shrink-0 items-center gap-2 text-brand-fg">
          <SteamingMug className="size-7 text-brand-accent transition-transform group-hover:-rotate-6" />
          <span className="text-display text-xl">
            {owner.name.toLowerCase()}
            <span className="text-brand-accent">.</span>
          </span>
        </a>

        <SiteNav />

        {/* On a phone these move into the menu's sheet, along with the nav. */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href={helloHref}
            className="inline-flex h-8 shrink-0 items-center rounded-full bg-brand-accent px-4 text-sm font-bold whitespace-nowrap text-brand-on-accent transition-colors hover:bg-brand-tint-fg"
          >
            Say hi
          </a>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
