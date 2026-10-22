import type { CSSProperties } from "react";

export { cn } from "cn";

/** An inline style that also sets custom properties, which CSSProperties alone does not allow for. */
type CssVariables = CSSProperties & Record<`--${string}`, string>;

/** Zero-pads a count or position for the site's numbered labels: 3 → "03". */
export function padNumber(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** An inline style made only of custom properties, typed without a cast. */
export function cssVars(variables: Record<`--${string}`, string>): CssVariables {
  return variables;
}
