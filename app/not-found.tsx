import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SteamingMug } from "@/components/site/steaming-mug";
import { helloHref, owner } from "@/lib/site";

// Out of search results, overriding the layout's "index", but its links are still followed, so a crawler lands back home.
export const metadata: Metadata = {
  title: `Page not found · ${owner.name}`,
  description: "This page wandered off. The desk, the projects and the rest of the site are one click away.",
  robots: { index: false, follow: true },
};

/**
 * Any address the site does not have. It keeps the room's paper, type and mug, says plainly what
 * happened, and offers the way back home; the header's nav covers every stop of the page.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      {/* The zero is the site's own mug, still steaming: nothing is broken, the page just is not here. */}
      <p aria-hidden="true" className="text-display flex items-center text-[clamp(6rem,22vw,12rem)] leading-none text-brand-fg">
        4
        <SteamingMug className="mx-[0.04em] size-[0.9em] text-brand-accent" />
        4
      </p>

      <p className="text-hand mt-6 text-2xl text-brand-accent">hmm, nothing on this shelf</p>
      <h1 className="text-display mt-2 max-w-xl text-[clamp(2rem,5vw,3.25rem)] text-brand-fg">This page wandered off.</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-brand-muted">
        The address may have a typo, or the page has moved. Pour another cup and head back to the desk.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-accent px-6 font-bold text-brand-on-accent transition-colors hover:bg-brand-tint-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to the desk
        </Link>
        <a href={helloHref} className="font-bold text-brand-fg underline-offset-4 hover:text-brand-accent hover:underline">
          Tell me what you were looking for
        </a>
      </div>
    </section>
  );
}
