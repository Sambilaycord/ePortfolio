import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

/** AI search and answer crawlers, named so it is plain they are welcome: being cited by them is the point. */
const ANSWER_ENGINES = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ANSWER_ENGINES, allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
