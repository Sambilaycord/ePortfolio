# sambilaycord.

The portfolio of Krystal Bacalso (Sambilaycord), full-stack developer and technical project manager in the Philippines.

**Live:** [sambilaycord.site](https://www.sambilaycord.site/)

The whole site is one cozy desk, told by scrolling. The camera zooms into the laptop, which wakes to an about page and logs in to a desktop where each project opens as an app. Then it pulls back to the room, flies into the cork board (the journey) and the shelf of jars (the tools), and out through the window into the evening sky, where the contact is.

## Features

- **Scroll-driven scenes.** Each section is a pinned scene whose progress drives a camera that dollies like a real lens (log-scale zoom), eased and speed-capped so a hard flick still plays as motion.
- **A desk you can navigate.** Nav links zoom out to the whole desk and back into the section you chose, instead of gliding through every scene or teleporting.
- **Light and dark.** Daylight, with a sunset at the contact, or lamplight, with night. Pull the lamp's chain on the desk to switch. The window shows your own time of day.
- **Works on phones.** A menu sheet, paged about text, and layouts tuned for small and landscape screens.
- **Reduced motion.** With `prefers-reduced-motion`, the scenes lie flat and finished, in reading order.
- **SEO, AEO and GEO.** A schema.org graph (person, website, profile page, projects), a sitemap, a robots file that welcomes AI search crawlers, an `llms.txt`, a manifest and a generated share image, all built from the same data as the page.

## Tech stack

| | |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, statically generated) |
| UI | [React 19](https://react.dev/), TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/), hand-drawn SVG illustration |
| Motion | [Lenis](https://lenis.darkroom.engineering/) smooth scroll, CSS custom properties driven from scroll progress, a WebGL2 shader for the room's light |
| Icons | [Lucide](https://lucide.dev/), [Simple Icons](https://simpleicons.org/) |
| Fonts | Fraunces, Nunito, Caveat and Geist Mono via `next/font` |
| Share image | `next/og` (`ImageResponse`) |
| Testing | [Playwright](https://playwright.dev/) end-to-end tests, ESLint, TypeScript |
| Hosting | [Vercel](https://vercel.com/) |
| Domain and DNS | [Cloudflare](https://www.cloudflare.com/), pointing `sambilaycord.site` at Vercel |

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright end-to-end tests (builds and serves the site itself) |

## Testing

The Playwright suite in `tests/` runs against a production build on two devices, a desktop (1440×860) and a phone (Pixel 7). It checks that:

- the home page renders with its heading and structured data, with no console errors and no sideways scroll;
- the nav takes its trip to every section, lands on it, and hands the scroll back;
- the phone menu opens, returns focus on Escape, follows a link and folds away;
- with reduced motion, every nav anchor lines up with its section;
- a missing page returns a real 404, marked `noindex`, whose links lead home;
- `robots.txt`, `sitemap.xml`, `llms.txt`, the share image and the security headers are served.

```bash
npx playwright install chromium   # once, to download the test browser
npm run test:e2e
```

To use a browser that is already installed instead, set `PW_CHANNEL`, e.g. `PW_CHANNEL=msedge npm run test:e2e`.

## Project structure

```
app/                  Page, layout, 404, and the SEO routes
  robots.ts           robots.txt
  sitemap.ts          sitemap.xml, with the site's images
  manifest.ts         Web app manifest
  llms.txt/route.ts   The site as Markdown for language models
  opengraph-image.tsx The generated share image
components/site/      The scenes: hero, about, projects, room, contact, and the desk itself
lib/                  Content and shared logic
  site.ts             Name, links, nav and the journey
  projects.ts         The projects shown as apps on the desktop
  pantry.ts           The tools on the pantry shelves
  seo.ts              Titles, descriptions and the structured data
tests/                Playwright end-to-end tests
public/images/        Photos used on the page
```

## Editing the content

Most changes need no new code:

- **A new project:** add it to a group in `lib/projects.ts`. It gets its own app window, dock icon, and entries in the structured data and `llms.txt`.
- **A new journey stop or photo:** edit `journey` in `lib/site.ts`. A photo's `focus` sets which part stays in frame on the board.
- **Tools:** edit the shelves in `lib/pantry.ts`.

## Deployment

Hosted on Vercel, building the `main` branch with the Next.js framework preset and default settings. The domain's DNS is on Cloudflare, with its records pointed at Vercel (DNS only, not proxied), so Vercel serves the site and its certificates directly. Every route is statically generated, so it can also run on any host that serves a Next.js build (`npm run build && npm run start`).

Canonical links, the sitemap and the structured data use `https://www.sambilaycord.site`. Set `NEXT_PUBLIC_SITE_URL` to override it, for example on a preview deployment.

Every response carries security headers (frame blocking, `nosniff`, a strict referrer policy and a permissions policy), set in `next.config.ts`.
