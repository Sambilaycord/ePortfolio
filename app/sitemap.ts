import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";
import { allProjects, type Project } from "@/lib/projects";
import { journey } from "@/lib/site";

/** One page, with the pictures on it, so image search can find them too. */
export default function sitemap(): MetadataRoute.Sitemap {
  const images = [
    "/images/profile.jpg",
    ...journey.flatMap((stop) => (stop.image ? [stop.image.src] : [])),
    ...allProjects.flatMap((project: Project) => (project.image ? [project.image.src] : [])),
  ];
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: images.map((src) => `${siteUrl}${src}`),
    },
  ];
}
