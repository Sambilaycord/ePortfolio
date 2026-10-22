import {
  siClaude,
  siClickup,
  siCplusplus,
  siFigma,
  siFramer,
  siGithub,
  siGithubactions,
  siGooglecalendar,
  siInertia,
  siJavascript,
  siLaravel,
  siNextdotjs,
  siNotion,
  siObsidian,
  siOpenjdk,
  siPhp,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siReactquery,
  siResend,
  siScikitlearn,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siWebgl,
  type SimpleIcon,
} from "simple-icons";

export type Shelf = { name: string; note: string; tools: SimpleIcon[] };

/** The same mark under the name I actually use for it. */
function labelled(icon: SimpleIcon, title: string): SimpleIcon {
  return { ...icon, title };
}

/** Stocked from the skills on my resumes. */
export const pantryShelves: Shelf[] = [
  { name: "Everyday staples", note: "on the counter, always", tools: [siTypescript, siJavascript, siReact, siNextdotjs, siTailwindcss] },
  { name: "The pantry", note: "where the data lives", tools: [siSupabase, siPostgresql, siLaravel, siPhp, labelled(siInertia, "Inertia.js")] },
  { name: "The spice rack", note: "a pinch makes it special", tools: [siWebgl, labelled(siFramer, "Framer Motion"), labelled(siReactquery, "TanStack Query"), siVite] },
  { name: "Ordered in", note: "the services I wire up", tools: [siStripe, siResend, siGooglecalendar, siGithubactions, siVercel] },
  { name: "The kitchen notebook", note: "how the kitchen runs", tools: [siClickup, siNotion, siObsidian, siFigma, siGithub, labelled(siClaude, "Claude Code")] },
  { name: "From school days", note: "still in the back of the cupboard", tools: [siPython, siPytorch, siScikitlearn, labelled(siOpenjdk, "Java"), siCplusplus] },
];

export const pantryJarCount = pantryShelves.reduce((count, shelf) => count + shelf.tools.length, 0);
