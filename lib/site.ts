export const owner = {
  /** The persona the site is written as, everywhere it names its owner. */
  name: "Sambilaycord",
  /** The real first name, used only where it is personal: the login screen and the about text. */
  firstName: "Krystal",
  /** The full name, for search engines and structured data only: on the page itself she is the persona, or Krystal. */
  fullName: "Krystal Bacalso",
  location: "the Philippines",
  timeZone: "Asia/Manila",
  email: "bacalso.krystal707@gmail.com",
  github: "https://github.com/Sambilaycord",
  linkedin: "https://www.linkedin.com/in/krystal-bacalso/",
};

export const helloHref = `mailto:${owner.email}`;

/** In the order the page tells it. Each points at an anchor placed where its section is fully shown, not its first frame. */
export const siteNavigation = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Pantry", href: "#toolbox" },
  { label: "Contact", href: "#contact" },
];

type JourneyStop = {
  when: string;
  role: string;
  place: string;
  story: string;
  highlight: string;
  /** `focus` is the part of the photo to keep when the board crops it, as a CSS object-position; the top by default. */
  image?: { src: string; alt: string; focus?: string };
};

/** Oldest first, so the line draws itself toward now. */
export const journey: JourneyStop[] = [
  {
    when: "2023 – 2024",
    role: "Founding treasurer",
    place: "Computer Science Student Society (CS³), USTP",
    story:
      "A brand-new department with no seniors to show us how. Our board built the society from nothing, and I ran its money: transparent budgets for our first workshops and events.",
    highlight: "Gold Unit Organization Award, in our first year",
    image: { src: "/images/cs3.jpg", alt: "The CS³ officers on stage receiving the Gold Unit Organization Award" },
  },
  {
    when: "June – July 2025",
    role: "Intern",
    place: "MeldCX Philippines",
    story:
      "My first production codebase. I turned Figma designs into interactive React, TypeScript and Tailwind screens, made a large multi-level marketing platform responsive, and fixed the frontend bugs I found along the way.",
    highlight: "First real codebase: from Figma to shipped React",
    image: { src: "/images/meldcx.jpg", alt: "The MeldCX team's welcome slide introducing Krystal" },
  },
  {
    when: "May – October 2026",
    role: "Developer, then technical PM",
    place: "Zen Companies PH",
    story: "One small team building software for very different markets. I started out shipping full-stack features, then ran delivery for the whole team while still coding.",
    highlight: "Six products and counting",
    image: { src: "/images/zen.jpg", alt: "The Zen Companies PH team at a long dinner table, smiling for a group photo", focus: "50% 72%" },
  },
];
