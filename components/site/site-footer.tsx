import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { owner } from "@/lib/site";

import { HomeClock } from "./home-clock";
import { CONTAINER } from "./section";

export function SiteFooter() {
  return (
    <footer className="site-footer night-palette relative">
      <div className={`${CONTAINER} flex flex-col gap-6 px-6 py-10 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between lg:px-10`}>
        <p>
          Made with <span className="text-brand-accent">♥</span> and a lot of late-night lamplight in {owner.location}.
          <br className="hidden sm:block" /> © {new Date().getFullYear()} {owner.name}
        </p>
        <div className="flex items-center gap-6">
          <HomeClock />
          <Link href="/#top" className="group inline-flex items-center gap-1.5 font-semibold text-brand-fg hover:text-brand-accent">
            Back to top
            <ArrowUp aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
