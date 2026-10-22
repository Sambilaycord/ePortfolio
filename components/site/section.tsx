import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The column every section shares. */
export const CONTAINER = "mx-auto w-full max-w-[84rem]";

/** A chapter's running head: its label, a rule drawn in as it scrolls into view, and a handwritten aside. */
export function RunningHead({
  index,
  label,
  aside,
  className,
}: {
  index?: string;
  label: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 text-brand-muted", className)}>
      {index && <span className="text-label text-brand-accent">{index}</span>}
      <span className="text-label font-medium text-brand-fg">{label}</span>
      <span aria-hidden="true" className="section-rule h-px flex-1 bg-brand-line" />
      {aside && <span className="text-hand hidden text-xl text-brand-muted sm:inline">{aside}</span>}
    </div>
  );
}
