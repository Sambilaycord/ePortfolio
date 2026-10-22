import { expect, test, type Page } from "@playwright/test";

/** Collects uncaught errors and console errors, so each test can assert the page stayed clean. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

/** Whether the element with this id crosses the middle of the window, which is how the nav judges "here". */
async function isAtMidline(page: Page, id: string): Promise<boolean> {
  return page.evaluate((anchor) => {
    const box = document.getElementById(anchor)?.getBoundingClientRect();
    return !!box && box.top <= innerHeight / 2 && box.bottom > innerHeight / 2;
  }, id);
}

/** Goes to a section the way a visitor would: the nav bar on a desktop, the menu sheet on a phone. */
async function navigateTo(page: Page, label: string, isMobile: boolean) {
  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label }).click();
}

test("the home page renders with its heading, structured data and no errors", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");

  await expect(page).toHaveTitle(/Sambilaycord/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sambilaycord");

  const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  const types = graph["@graph"].map((node: { "@type": string }) => node["@type"]);
  expect(types).toEqual(expect.arrayContaining(["Person", "WebSite", "ProfilePage", "ItemList"]));

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(scrollWidth, "no sideways scroll").toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("the nav takes a trip to each section and hands the page back", async ({ page, isMobile }) => {
  const errors = watchErrors(page);
  await page.goto("/");

  for (const [label, id] of [
    ["Journey", "journey"],
    ["Contact", "contact"],
    ["About", "about"],
    ["Pantry", "toolbox"],
  ]) {
    await navigateTo(page, label, isMobile);
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect.poll(() => isAtMidline(page, id), { timeout: 5_000 }).toBe(true);
    // The trip's overlay is gone and the page scrolls again.
    await expect(page.locator(".fixed.inset-0.z-30")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  }
  expect(errors).toEqual([]);
});

test("the phone menu opens, follows a link and folds away", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the menu sheet is for phones");
  await page.goto("/");

  const button = page.getByRole("button", { name: "Open menu" });
  await button.click();
  await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();

  await navigateTo(page, "Pantry", true);
  await expect(page.locator("[aria-expanded]")).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#toolbox$/);
});

test("without motion, every nav anchor sits on its section", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  for (const [id, section] of [
    ["about", ".about-layout"],
    ["journey", ".room-close-up--board"],
    ["toolbox", ".room-close-up--pantry"],
    ["contact", ".contact-content"],
  ]) {
    const [anchorTop, sectionTop] = await page.evaluate(
      ([anchor, selector]) => [document.getElementById(anchor)!.getBoundingClientRect().top, document.querySelector(selector)!.getBoundingClientRect().top],
      [id, section],
    );
    expect(Math.abs(anchorTop - sectionTop), `#${id} lines up with ${section}`).toBeLessThan(2);
  }
  await context.close();
});

test("a missing page is a real 404 that leads home", async ({ page, isMobile }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page wandered off.");
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);

  await navigateTo(page, "Journey", isMobile);
  await expect(page).toHaveURL(/\/#journey$/);
});

test("the search and answer-engine files are served", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://www.sambilaycord.site/sitemap.xml");
  expect(robots).toContain("GPTBot");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://www.sambilaycord.site/</loc>");

  const llms = await request.get("/llms.txt");
  expect(llms.headers()["content-type"]).toContain("text/markdown");
  expect(await llms.text()).toContain("# Sambilaycord");

  const image = await request.get("/opengraph-image");
  expect(image.headers()["content-type"]).toBe("image/png");

  const home = await request.get("/");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["x-frame-options"]).toBe("DENY");
});
