import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { jobTitle } from "@/lib/seo";
import { owner } from "@/lib/site";

export const alt = `${owner.name}: ${owner.fullName}, ${jobTitle.toLowerCase()}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The daylight palette, as in globals.css. */
const PAPER = "#f7f0e5";
const INK = "#3a2a21";
const MUTED = "#7a6455";
const ACCENT = "#c45d34";
const HONEY = "#f2c98a";

/** A Google font cut down to just the letters drawn here; without it the card falls back to the renderer's own sans. */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The card shown when the site is shared: the name and role on the page's paper, beside the arched portrait from the about page. */
export default async function OpenGraphImage() {
  const headline = owner.fullName;
  const role = "Full-stack developer & technical PM";
  const wordmark = `${owner.name.toLowerCase()}.`;
  const hand = "pull up a chair";
  const footer = "React · Next.js · Laravel · Supabase · the Philippines";

  const [portrait, display, body, handwriting] = await Promise.all([
    readFile(join(process.cwd(), "public/images/profile.jpg")),
    googleFont("Fraunces", 600, headline + wordmark),
    googleFont("Nunito", 600, role + footer),
    googleFont("Caveat", 600, hand),
  ]);
  const fonts = [
    display && { name: "Fraunces", data: display, weight: 600 as const },
    body && { name: "Nunito", data: body, weight: 600 as const },
    handwriting && { name: "Caveat", data: handwriting, weight: 600 as const },
  ].filter((font) => !!font);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, padding: "64px 72px", fontFamily: "Nunito" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Fraunces", fontSize: 34, color: INK }}>
            <svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 9c-1.5-1.6 1.5-2.6 0-4.4M16 9c-1.5-1.6 1.5-2.6 0-4.4M21 9c-1.5-1.6 1.5-2.6 0-4.4" />
              <path d="M6 13h19v6a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8z" fill={HONEY} />
              <path d="M25 15h1.5a3 3 0 0 1 0 6H24.5" />
            </svg>
            <div style={{ display: "flex" }}>
              {owner.name.toLowerCase()}
              <span style={{ color: ACCENT }}>.</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 84, lineHeight: 1.05, color: INK, letterSpacing: -1 }}>{headline}</div>
            <div style={{ marginTop: 20, fontSize: 36, color: INK }}>{role}</div>
            <div style={{ marginTop: 18, fontFamily: "Caveat", fontSize: 40, color: ACCENT }}>{hand}</div>
          </div>
          <div style={{ fontSize: 24, color: MUTED }}>{footer}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: 48 }}>
          <div style={{ display: "flex", padding: 12, background: "#fffaf2", borderRadius: "200px 200px 18px 18px", boxShadow: "0 30px 60px -30px rgba(58,42,33,0.55)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- the image renderer takes plain <img> only */}
            <img
              src={`data:image/jpeg;base64,${portrait.toString("base64")}`}
              alt=""
              width={330}
              height={440}
              style={{ objectFit: "cover", borderRadius: "190px 190px 10px 10px" }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
