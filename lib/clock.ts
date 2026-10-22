const MINUTE_MS = 60_000;

/** The current minute since the epoch: a primitive, so React sees the same snapshot until the minute turns. */
export function currentMinute(): number {
  return Math.floor(Date.now() / MINUTE_MS);
}

/** Ticks on each turn of the minute, aligned to the wall clock rather than to when the page loaded. */
export function subscribeMinute(onChange: () => void): () => void {
  let interval = 0;
  const timeout = window.setTimeout(() => {
    onChange();
    interval = window.setInterval(onChange, MINUTE_MS);
  }, MINUTE_MS - (Date.now() % MINUTE_MS));

  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}

// The server cannot know the visitor's clock; components render a neutral state until hydration.
export const minuteOnServer = (): number | null => null;
