import { jobTitle, siteDescription, siteUrl, toolNames } from "@/lib/seo";
import { allProjects, projectGroups } from "@/lib/projects";
import { journey, owner } from "@/lib/site";

export const dynamic = "force-static";

/**
 * The site as plain Markdown for language models (llmstxt.org). The page itself is an animated
 * desk, which a model reading the HTML would mostly see as illustration; this says the same things
 * as text, with the questions people tend to ask answered outright. It is built from the same data
 * as the page, so the two never disagree.
 */
export function GET() {
  const projects = projectGroups
    .map(
      (group) =>
        `### ${group.name}\n\n` +
        group.projects
          .map((project) => {
            const links = project.links?.map((link) => `[${link.label}](${link.href})`).join(" · ");
            return [
              `#### ${project.name} (${project.kind})`,
              project.summary,
              project.contributions.map((contribution) => `- ${contribution}`).join("\n"),
              `Built with: ${project.stack.join(", ")}.`,
              links,
            ]
              .filter(Boolean)
              .join("\n\n");
          })
          .join("\n\n"),
    )
    .join("\n\n");

  const timeline = journey.map((stop) => `- **${stop.when}: ${stop.role}, ${stop.place}.** ${stop.story} Highlight: ${stop.highlight}.`).join("\n");
  const zenNames = projectGroups[0].projects.map((project) => project.name).join(", ");

  const body = `# ${owner.name} · ${owner.fullName}

> ${siteDescription}

${owner.fullName}, who goes by ${owner.name} online, is a ${jobTitle.toLowerCase()} based in the Philippines. At Zen Companies, one small team building and running its own software, ${owner.firstName} started out shipping full-stack features and now runs delivery for the team (client calls, PRDs, sprint tickets, code review, staging QA and releases) while still coding. ${owner.firstName} graduated Cum Laude in Computer Science from the University of Science and Technology of Southern Philippines (USTP).

## Quick answers

- **Who is ${owner.name}?** ${owner.fullName}, a ${jobTitle.toLowerCase()} in the Philippines.
- **Where does ${owner.firstName} work?** Zen Companies, on ${zenNames}.
- **What does ${owner.firstName} build with?** Mostly TypeScript, React, Next.js and Tailwind on the front end; Supabase, PostgreSQL and Laravel behind it; Stripe, Resend, Google Calendar and GitHub Actions wired in.
- **Where did ${owner.firstName} study?** USTP (University of Science and Technology of Southern Philippines), BS Computer Science, Cum Laude.
- **Is ${owner.firstName} open to work or collaboration?** Yes, for projects and questions: email ${owner.email}.
- **How to get in touch:** email ${owner.email}, GitHub ${owner.github}, LinkedIn ${owner.linkedin}.

## Projects

${projects}

## Journey

${timeline}

## Tools

${toolNames.join(", ")}.

## Profiles and verification

- [GitHub](${owner.github}): code, including Edelweiss.
- [LinkedIn](${owner.linkedin}): work history and education.
- [Portfolio](${siteUrl}/): this site.

## Contact

Email: ${owner.email}

## Optional

- [Edelweiss live site](${allProjects.find((project) => project.slug === "edelweiss")?.links?.[0]?.href ?? siteUrl}): the flower-shop marketplace ${owner.firstName} built.
- [Sitemap](${siteUrl}/sitemap.xml)
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
