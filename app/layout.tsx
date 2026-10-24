import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Geist_Mono, Nunito } from "next/font/google";
import Script from "next/script";

import { NavTrip } from "@/components/site/nav-trip";
import { RoomLight } from "@/components/site/room-light";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { keywords, siteDescription, siteTitle, siteUrl, structuredData } from "@/lib/seo";
import { owner } from "@/lib/site";
import { LOCK_VIEW_SCRIPT } from "@/lib/lock-view";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

import "./globals.css";

// SOFT rounds the terminals and WONK tips the leaning letters: together they are the room's handwriting in type.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The social image is app/opengraph-image.tsx, which Next adds to the Open Graph and Twitter tags on its own.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: owner.name,
  keywords,
  authors: [{ name: owner.fullName, url: siteUrl }],
  creator: owner.fullName,
  publisher: owner.fullName,
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: owner.name,
    locale: "en_PH",
    title: siteTitle,
    description: siteDescription,
    firstName: owner.firstName,
    lastName: owner.fullName.split(" ").at(-1),
    username: owner.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  // Where the work is from, for search engines that answer "developers near me".
  other: { "geo.region": "PH", "geo.placename": "Philippines" },
};

// Cloudflare Web Analytics site token. Set only in Vercel's production env, so local runs and tests stay out of the stats.
const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export const viewport: Viewport = {
  // The meta tag cannot read CSS custom properties, so these mirror --brand-bg in each theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f0e5" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1411" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The head scripts add the theme class and the lock screen's `--lock-view` before hydration, so the server-rendered attributes are expected to differ.
    <html
      lang="en"
      className={`${fraunces.variable} ${nunito.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LOCK_VIEW_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Who made the site and what is on it, for search and answer engines (lib/seo.ts). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }} />
        <SmoothScroll />
        <RoomLight />
        <SiteHeader />
        <NavTrip />
        <main id="main" className="flex flex-col">
          {children}
        </main>
        <SiteFooter />
        {/* Vercel serves the analytics script only on its own deployments; elsewhere it would 404. */}
        {process.env.VERCEL && <Analytics />}
        {cfBeaconToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken, spa: true })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
