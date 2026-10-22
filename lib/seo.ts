import { pantryShelves } from "./pantry";
import { allProjects } from "./projects";
import { journey, owner } from "./site";

/**
 * The site's public address, for canonical links, the sitemap and structured data. It is the live
 * domain even in development, so nothing built here ever points search engines at localhost;
 * NEXT_PUBLIC_SITE_URL overrides it, for a preview deployment say.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sambilaycord.site").replace(/\/$/, "");

export const jobTitle = "Full-stack developer and technical project manager";

export const siteTitle = `${owner.name} · ${owner.fullName}, full-stack developer and technical PM`;

/** Who, what, where and with what, in the first sentence: the line search and answer engines quote. */
export const siteDescription =
  `${owner.fullName} (${owner.name}) is a full-stack developer and technical project manager at Zen Companies in the Philippines, ` +
  "shipping HR systems, booking flows, analytics dashboards and AI tools with React, Next.js, Laravel and Supabase.";

export const toolNames = pantryShelves.flatMap((shelf) => shelf.tools.map((tool) => tool.title));

export const keywords = [
  owner.fullName,
  owner.name,
  "full-stack developer Philippines",
  "technical project manager",
  "React developer",
  "Next.js developer",
  "Laravel developer",
  "Supabase",
  "portfolio",
  ...allProjects.map((project) => project.name),
];

const id = (fragment: string) => `${siteUrl}/#${fragment}`;

/**
 * Everything the page says about who made it, as one schema.org graph: the person, the site and
 * profile page about them, where they work and studied, and the projects, so search and answer
 * engines can state the facts without guessing them from the illustrations.
 */
export function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": id("person"),
        name: owner.fullName,
        givenName: owner.firstName,
        familyName: owner.fullName.split(" ").at(-1),
        alternateName: owner.name,
        jobTitle,
        description: siteDescription,
        url: `${siteUrl}/`,
        image: `${siteUrl}/images/profile.jpg`,
        email: `mailto:${owner.email}`,
        homeLocation: { "@type": "Country", name: "Philippines" },
        worksFor: { "@id": id("zen-companies") },
        alumniOf: { "@id": id("ustp") },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "degree",
          name: "Bachelor of Science in Computer Science, Cum Laude",
          recognizedBy: { "@id": id("ustp") },
        },
        award: ["Cum Laude, BS Computer Science, USTP", `${journey[0].highlight.replace(/, in our first year$/, "")} (${journey[0].place})`],
        knowsAbout: [...toolNames, "Technical project management", "Full-stack web development", "Sprint planning", "Code review"],
        sameAs: [owner.github, owner.linkedin],
      },
      {
        "@type": "Organization",
        "@id": id("zen-companies"),
        name: "Zen Companies",
        description: "One small team in the Philippines building and running software for very different markets.",
      },
      {
        "@type": "CollegeOrUniversity",
        "@id": id("ustp"),
        name: "University of Science and Technology of Southern Philippines",
        alternateName: "USTP",
        sameAs: "https://en.wikipedia.org/wiki/University_of_Science_and_Technology_of_Southern_Philippines",
      },
      {
        "@type": "WebSite",
        "@id": id("website"),
        url: `${siteUrl}/`,
        name: owner.name,
        description: siteDescription,
        inLanguage: "en",
        author: { "@id": id("person") },
        publisher: { "@id": id("person") },
      },
      {
        "@type": "ProfilePage",
        "@id": id("profile"),
        url: `${siteUrl}/`,
        name: siteTitle,
        isPartOf: { "@id": id("website") },
        mainEntity: { "@id": id("person") },
        about: { "@id": id("person") },
        hasPart: { "@id": id("projects") },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": id("projects"),
        name: `Projects by ${owner.fullName}`,
        numberOfItems: allProjects.length,
        itemListElement: allProjects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.name,
            genre: project.kind,
            description: `${project.summary} ${project.contributions.join(" ")}`,
            keywords: project.stack.join(", "),
            creator: { "@id": id("person") },
            ...(project.image && { image: `${siteUrl}${project.image.src}` }),
            ...(project.links?.[0] && { url: project.links[0].href }),
          },
        })),
      },
    ],
  };
}
