import type { MetadataRoute } from "next";

import { siteDescription } from "@/lib/seo";
import { owner } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${owner.name} · ${owner.fullName}`,
    short_name: owner.name,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    // The daylight theme's paper, as in the viewport's theme colour.
    background_color: "#f7f0e5",
    theme_color: "#f7f0e5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
