import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end checks against a production build, on a desktop and a phone. Playwright's own
 * Chromium is used by default (`npx playwright install chromium`); set PW_CHANNEL to `msedge`
 * or `chrome` to run in a browser that is already installed instead.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PW_CHANNEL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 860 }, channel: process.env.PW_CHANNEL } },
    { name: "phone", use: { ...devices["Pixel 7"], channel: process.env.PW_CHANNEL } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
