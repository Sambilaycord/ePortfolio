export type Demo = "studio" | "chart" | "boat" | "leads" | "thumbnail" | "clock" | "flower";

type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  contributions: string[];
  stack: string[];
  note: string;
  demo: Demo;
  /** The project's own colour: its window, dock icon and accents are painted in it. */
  hue: string;
  /** A real screenshot, shown in place of the drawn demo when there is one. */
  image?: { src: string; alt: string; width: number; height: number };
  links?: ProjectLink[];
};

/** A shelf of the dock: projects that belong together, set apart from the next group by a divider. */
type ProjectGroup = { name: string; projects: Project[] };

/** The work at Zen Companies, in the order the apps open. */
const zenProjects: Project[] = [
  {
    slug: "the-content-lab",
    name: "The Content Lab",
    kind: "Video production platform",
    summary: "A video agency's whole client cycle: book a call, then follow the shoot through editing, review and delivery.",
    contributions: [
      "Discovery-call booking with Hunter email checks, duplicate-lead guards and reschedule links.",
      "Role-based sign-in to per-role dashboards, with password emails through Resend.",
      "A modular homepage around a WebGL hero, and the Notion QA handoff.",
    ],
    stack: ["Laravel", "Inertia", "React", "Resend", "Hunter API"],
    note: "no more discovery calls booked with a typo'd email",
    demo: "studio",
    hue: "#e98a5f",
  },
  {
    slug: "zenalytics",
    name: "Zenalytics",
    kind: "Analytics and customer hub",
    summary: "One place to see what customers do after they sign up, what they are worth, and what each product costs to run.",
    contributions: [
      "Led the project's kickoff, from the brief to the PRD and the first sprint.",
      "Redesigned the sign-in page around a dot-field background and the wordmark.",
      "Added the light, dark and system theme toggle, and password sign-in.",
    ],
    stack: ["React", "Supabase", "Recharts"],
    note: "first impressions start at the login screen",
    demo: "chart",
    hue: "#d6a6e0",
  },
  {
    slug: "zen-marine-charters",
    name: "Zen Marine Charters",
    kind: "Booking site, portal and invoicing",
    summary: "Booking for a private yacht charter: pick a trip, pay through Stripe Checkout, and it lands on the operator's Google Calendar.",
    contributions: [
      "Reworked the booking steps and closed a gap that let people skip step one.",
      "Light and dark palettes, a journal, an FAQ and the customer portal.",
      "An invoice builder with saved packages and a sticky running total.",
    ],
    stack: ["React", "Next.js", "Supabase", "Stripe", "Google Calendar"],
    note: "the call button is gold now. it had to be gold.",
    demo: "boat",
    hue: "#7cc0d4",
  },
  {
    slug: "zen-intent",
    name: "Zen Intent",
    kind: "B2B lead generation",
    summary: "A lead-generation platform for businesses: lead lists are generated in the background and land in a customer portal, billed through Stripe.",
    contributions: [
      "Ran its delivery as technical project manager: requirements, sprint tickets, pull request review and QA on staging before each release.",
      "Brought it onto the GitHub Actions and Notion sync, so opening a pull request moves its ticket along.",
    ],
    stack: ["Laravel", "Inertia", "React", "Stripe"],
    note: "keep the board honest and the releases calm",
    demo: "leads",
    hue: "#a9c79f",
  },
  {
    slug: "viraltube-exploder",
    name: "ViralTube Exploder",
    kind: "AI thumbnail and title generator",
    summary: "Gemini-powered titles and thumbnails for YouTube creators: pick a style, add your face, and get click-worthy options back.",
    contributions: [
      "Managed delivery as technical project manager: sprint planning, tickets with acceptance criteria and test cases, code review and staging QA.",
      "Brought it onto the GitHub Actions and Notion sync, so opening a pull request moves its ticket along.",
    ],
    stack: ["Next.js", "Supabase", "Gemini", "Stripe"],
    note: "yes, there is a MrBeast style",
    demo: "thumbnail",
    hue: "#f2a7a0",
  },
  {
    slug: "zenith",
    name: "Zenith",
    kind: "HR system",
    summary: "The team's home base: attendance, leave, performance reviews and onboarding.",
    contributions: [
      "Rebuilt attendance: location-checked clock-in, weekly hours targets and a live presence board.",
      "Idempotent clock writes, and forgotten shifts that close themselves.",
      "Slack posts for breaks, birthdays and Selfie Wednesday, plus in-app notifications.",
      "Trimmed 131 kB off the entry chunk.",
    ],
    stack: ["React", "TypeScript", "Supabase", "TanStack Query", "Slack"],
    note: "‘today’ now means today in Manila, not in UTC",
    demo: "clock",
    hue: "#f0b45e",
  },
];

/** School and personal projects from before Zen. */
const earlierProjects: Project[] = [
  {
    slug: "edelweiss",
    name: "Edelweiss",
    kind: "Flower-shop marketplace",
    summary:
      "A marketplace I built for florists across Northern Mindanao: browse local shops, compare prices and personalise an arrangement.",
    contributions: [
      "Email sign-in, and one profile that switches into a full vendor dashboard.",
      "A seasonal storefront, a wishlist kept in Supabase, and a working cart and checkout.",
      "Gift reminders linked to the gift, so the date never sneaks up.",
    ],
    stack: ["React 19", "TypeScript", "Tailwind 4", "Framer Motion", "Supabase"],
    note: "where blooms meet convenience",
    demo: "flower",
    hue: "#ef7f8a",
    image: { src: "/images/edelweiss.png", alt: "The Edelweiss homepage on a laptop, under the line 'Where Blooms Meet Convenience'", width: 1174, height: 660 },
    links: [
      { label: "Visit the shop", href: "https://sambilaycord.github.io/Edelweiss-Web/" },
      { label: "Read the code", href: "https://github.com/Sambilaycord/Edelweiss-Web" },
    ],
  },
];

/** Every project, grouped as the dock shows them. Add a project to a group, or a new group, and it gets an app of its own. */
export const projectGroups: ProjectGroup[] = [
  { name: "Zen Companies", projects: zenProjects },
  { name: "Before Zen", projects: earlierProjects },
];

/** Every project in dock order, which is also the order their windows open. */
export const allProjects: Project[] = projectGroups.flatMap((group) => group.projects);
