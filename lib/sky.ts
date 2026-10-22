export type SkyPhase = "dawn" | "day" | "dusk" | "night";

/** Rough Manila-latitude light: the window should look right, not be astronomically exact. */
export function skyPhaseAt(hour: number): SkyPhase {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 19) return "dusk";
  return "night";
}
