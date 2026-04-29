import React from 'react'
import { Code2, Database, Layout, Gamepad2, ArrowRight, Mail } from 'lucide-react'

// Import images
import profileImg from './assets/profile.jpg'

// Logo assets
import assemblyLogo from './assets/assembly.jpg'
import smApiLogo from './assets/smapi.png'
import rpgMakerLogo from './assets/rpgmaker.jpg'
import godotLogo from './assets/godot.png'

// Software & Web App Images
import edelweissImg from './assets/edelweiss.png'
import edMorsImg from './assets/ed-mor\'s.png'
import dymonImg from './assets/dymon.png'
import dfaNfaImg from './assets/dfa-nfa-simulator.png'

// Research & Dev Images
import steamReviewImg from './assets/steam_review.png'
import quickSortImg from './assets/quick-sort.png'

// Game Dev Images
import lethal2DImg from './assets/lethal2D.png'
import catDistroImg from './assets/cat-distribution-system.png'
import leviPerezImg from './assets/Levi-Perez.png'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-primary font-body text-text-main antialiased selection:bg-accent-light/40">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 w-full bg-primary/90 backdrop-blur-md z-50 shadow-[0_2px_10px_rgba(74,64,58,0.05)] border-b border-divider transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="text-2xl font-heading font-bold tracking-tight">Sambilaycord</div>
          <div className="hidden md:flex gap-8">
            <a href="#about" className="text-sm font-medium uppercase tracking-wide text-text-muted hover:text-accent transition-colors duration-300">About</a>
            <a href="#tech" className="text-sm font-medium uppercase tracking-wide text-text-muted hover:text-accent transition-colors duration-300">Skills</a>
            <a href="#projects" className="text-sm font-medium uppercase tracking-wide text-text-muted hover:text-accent transition-colors duration-300">Projects</a>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section id="header" className="w-full relative bg-primary overflow-hidden pt-18">
        <a className="group relative flex justify-center items-center py-12 w-full min-h-[322px] mb-8" id="page-wrap" rel="external noopener">
          <svg className="waves absolute inset-0 block min-w-full min-h-[80%] m-auto" width="1440" height="321.75" viewBox="0 0 960 214.5" preserveAspectRatio="xMinYMid meet">
            <defs>
              <linearGradient id="a">
                <stop stopColor="#B38054" />
                <stop offset="0.3" stopColor="#D4A373" />
                <stop offset="0.65" stopColor="#E5C1A1" />
                <stop offset="0.9" stopColor="#CCD5AE" />
              </linearGradient>
            </defs>
            <path fill="url(#a)" d="M2662.6 1S2532 41.2 2435 40.2c-19.6-.2-37.3-1.3-53.5-2.8 0 0-421.3-59.4-541-28.6-119.8 30.6-206.2 75.7-391 73.3-198.8-2-225.3-15-370.2-50-145-35-218 37-373.3 36-19.6 0-37.5-1-53.7-3 0 0-282.7-36-373.4-38C139 26 75 46-1 46v106c17-1.4 20-2.3 37.6-1.2 130.6 8.4 210 56.3 287 62.4 77 6 262-25 329.3-23.6 67 1.4 107 22.6 193 23.4 155 1.5 249-71 380-62.5 130 8.5 209 56.3 287 62.5 77 6 126-18 188-18 61.4 0 247-38 307.4-46 159.3-20 281.2 29 348.4 30 67 2 132.2 6 217.4 7 39.3 0 87-11 87-11V1z" />
            <path fill="var(--color-secondary)" d="M2663.6 73.2S2577 92 2529 89c-130.7-8.5-209.5-56.3-286.7-62.4s-125.7 18-188.3 18c-5 0-10-.4-14.5-.7-52-5-149.2-43-220.7-39-31.7 2-64 14-96.4 30-160.4 80-230.2-5.6-340.4-18-110-12-146.6 20-274 36S820.4 0 605.8 0C450.8 0 356 71 225.2 62.2 128 56 60.7 28-.3 11.2V104c22 7.3 46 14.2 70.4 16.7 110 12.3 147-19.3 275-35.5s350 39.8 369 43c27 4.3 59 8 94 10 13 .5 26 1 39 1 156 2 250-70.3 381-62 130.5 8.2 209.5 56.3 286.7 62 77 6.4 125.8-18 188.3-17.5 5 0 10 .2 14.3.6 52 5 145 49.5 220.7 38.2 32-5 64-15 96.6-31 160.5-79.4 230.3 6 340 18.4 110 12 146.3-20 273.7-36l15.5-2V73l1-.5z" />
            <g fill="none" stroke="#E2E9E9" strokeWidth="1">
              <path d="M0 51.4c3.4.6 7.7 1.4 11 2.3 133.2 34 224.3 34 308.6 34 110.2 0 116.7 36.6 229.8 26 113-11 128.7-44 222-42.6C865 73 889 38 1002 27c113-10.8 119.6 25.6 229.8 25.6 84.4 0 175.4 0 308.6 34 133 34.2 277-73 379.4-84.3 204-22.5 283.6 128.7 283.6 128.7" />
              <path d="M0 6C115.7-6 198.3 76.6 308 76.6c109.6 0 131.8-20 223-28.3 114.3-10.2 238.2 0 238.2 0s124 10.2 238.3 0c91-8.2 113.2-28 223-28S1425 103 1541 91c115.8-11.8 153.3-69 269.3-84.6 116-15.5 198.4 71 308 71 109.8 0 131.8-20 223-28 114-10.2 237.7 0 237.7 0s37.4 2.4 82.8 3.7" />
            </g>
          </svg>
          <svg className="text relative z-10 block w-[83%] h-full m-auto" width="1440" height="321.75" viewBox="0 0 1440 321.8" preserveAspectRatio="xMidYMid meet" aria-label="Hello, World!">
            <path fill="var(--color-text-main)" d="M240.8 223h-33v-53.4H151V223h-33.2V88H151v52.5h56.8V88.1h33V223zM363.2 180.7H289c1.3 6 4 10.6 7.8 14.2 4 3.6 8.6 5.3 14 5.3 10 0 17.2-3.9 21.5-11.6l28.6 5.8a48.4 48.4 0 0 1-27.3 27.6 59.7 59.7 0 0 1-43.3.2 49.6 49.6 0 0 1-28.8-28.2 56.2 56.2 0 0 1-4.1-21.6c0-7.6 1.4-14.7 4.1-21.4a49.8 49.8 0 0 1 28.9-28.2 55 55 0 0 1 40.5-.2 49 49 0 0 1 27.8 28 60 60 0 0 1 4.4 21.8v8.3zM298 149.4c-4 2.9-6.8 6.7-8.3 11.6h41.7c-1.5-5.1-4-9-7.8-11.8-3.7-2.8-7.9-4.1-12.6-4.1s-9 1.4-13 4.3zM379.7 223V78h32.2v145h-32.2zM435 223V78h32.3v145H435zM557 121.8c6.2 1.7 12.4 5 18.8 9.8 6.3 4.8 11 11 14.4 18.3a54.9 54.9 0 0 1 .6 44c-3 6.6-7 12.3-12.1 17.1a59 59 0 0 1-56.6 12.3c-6.2-1.7-12.5-5-19-9.8-6.3-4.8-11.1-11-14.4-18.4a55.2 55.2 0 0 1-.6-44c2.9-6.6 6.9-12.2 12-17a54.2 54.2 0 0 1 18-11 61.2 61.2 0 0 1 39-1.3zm-7.2 74.4a26 26 0 0 0 14.3-23.8c0-7.5-2.5-13.7-7.4-18.7s-10.5-7.4-17-7.4c-4 0-8 1-12 3.2-4 2.1-7.2 5.3-9.5 9.6a27.8 27.8 0 0 0 .9 28.2 23 23 0 0 0 10.2 8.9c3.8 1.6 7.3 2.4 10.4 2.4 3 0 6.3-.8 10-2.4zM595 249.6l12-58h35.6v.8l-23.2 57.2h-24.3zM850.1 223h-35.6L792 139.6 769.2 223h-35.4L695.3 88h34l23.6 85 23.2-85h31.6l23.1 85 23.6-85h34.2L850 223zM958.9 121.8c6.1 1.7 12.4 5 18.7 9.8 6.3 4.8 11 11 14.4 18.3a54.9 54.9 0 0 1 .6 44c-3 6.6-7 12.3-12.1 17.1a59 59 0 0 1-56.6 12.3c-6.2-1.7-12.5-5-18.9-9.8s-11.2-11-14.5-18.4a55.6 55.6 0 0 1-.6-44c2.9-6.6 7-12.2 12-17a54.2 54.2 0 0 1 18.1-11 61.2 61.2 0 0 1 38.9-1.3zm-7.3 74.4a26 26 0 0 0 14.3-23.8c0-7.5-2.4-13.7-7.3-18.7-5-5-10.6-7.4-17-7.4-4 0-8.1 1-12.1 3.2-4 2.1-7.2 5.3-9.5 9.6a27.8 27.8 0 0 0 1 28.2 23 23 0 0 0 10 8.9c4 1.6 7.5 2.4 10.5 2.4s6.3-.8 10.1-2.4zM1087.7 121.3l-1.4 32.2h-5.9c-23.2 0-34.8 12.6-34.8 37.9V223h-32.2V122h32.2v19.2c2.8-4.5 6.2-8.5 10-11.8a33 33 0 0 1 12.6-7c4.4-1.2 8.5-1.9 12.2-1.9 2.7 0 5.1.3 7.3.8zM1101.2 223V78h32.2v145h-32.2zM1262.8 223h-32.2v-8a45.1 45.1 0 0 1-31.4 11 48.2 48.2 0 0 1-45.4-32 58.8 58.8 0 0 1-2.6-34 52.4 52.4 0 0 1 14.2-27 46.8 46.8 0 0 1 33.8-14c12.8-.1 23.2 3.6 31.4 11V78h32.2v145zm-46.6-26.8c3.9-1.6 7.2-4.6 10-9s4.4-9.2 4.4-14.7c0-7.6-2.4-13.8-7.3-18.8-5-5-10.7-7.4-17.4-7.4-5.1 0-9.7 1.4-13.7 4.2s-6.8 6.3-8.4 10.4c-1.5 4-2.3 8-2.3 11.6s.8 7.5 2.3 11.6a23.7 23.7 0 0 0 32.4 12zM1317.7 193.7c3.5 3.5 5.3 7.7 5.3 12.6 0 5-1.7 9.1-5.2 12.6a18 18 0 0 1-13 5c-5.5 0-9.9-1.6-13.4-5a17 17 0 0 1-5.2-12.6c0-4.9 1.8-9 5.3-12.6s8-5.3 13.2-5.3c5.1 0 9.4 1.7 13 5.3zm4.5-99.4l-2 82.6h-31.8l-2-82.6v-6.2h35.8v6.2z" />
          </svg>
        </a>
      </section>

      {/* Hero Section */}
      <section id="about" className="w-full bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-32 flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-text-main">Hi, I'm Krystal</h1>
            <p className="text-lg text-text-muted mb-8 leading-relaxed max-w-2xl mx-auto md:mx-0">
              A passionate developer who creates cozy, elegant, and efficient digital experiences.
              I specialize in full-stack development with a keen eye for clean design and smooth animations.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-accent-light hover:text-text-main hover:-translate-y-1 shadow-[0_4px_6px_-1px_rgba(74,64,58,0.1)] hover:shadow-[0_10px_15px_-3px_rgba(74,64,58,0.15)]">
              <Mail size={18} /> Let's Talk
            </a>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-[26rem] md:w-80 md:h-[26rem] rounded-t-full rounded-b-none overflow-hidden border-8 border-white shadow-2xl">
              <img src={profileImg} alt="Krystal" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="w-full bg-primary py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-4xl font-heading font-bold inline-block relative pb-4 text-text-main">
              Tech Stack
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TechCard
              icon={<Code2 size={32} />}
              title="Languages"
              skills={[
                { name: 'Python', logo: 'https://cdn.simpleicons.org/python' },
                { name: 'Java', logo: 'https://cdn.simpleicons.org/openjdk' },
                { name: 'C++', logo: 'https://cdn.simpleicons.org/cplusplus' },
                { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript' },
                { name: 'TypeScript', logo: 'https://cdn.simpleicons.org/typescript' },
                { name: 'MIPS', logo: assemblyLogo },
              ]}
            />
            <TechCard
              icon={<Layout size={32} />}
              title="Web & DB"
              skills={[
                { name: 'React', logo: 'https://cdn.simpleicons.org/react' },
                { name: 'Tailwind CSS', logo: 'https://cdn.simpleicons.org/tailwindcss' },
                { name: 'Bootstrap', logo: 'https://cdn.simpleicons.org/bootstrap' },
                { name: 'Supabase', logo: 'https://cdn.simpleicons.org/supabase' },
                { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql' },
              ]}
            />
            <TechCard
              icon={<Database size={32} />}
              title="Machine Learning"
              skills={[
                { name: 'Scikit-learn', logo: 'https://cdn.simpleicons.org/scikitlearn' },
                { name: 'Pandas', logo: 'https://cdn.simpleicons.org/pandas' },
                { name: 'PyTorch', logo: 'https://cdn.simpleicons.org/pytorch' },
                { name: 'NumPy', logo: 'https://cdn.simpleicons.org/numpy' },
                { name: 'Matplotlib', logo: null },
              ]}
            />
            <TechCard
              icon={<Gamepad2 size={32} />}
              title="Game Dev"
              skills={[
                { name: 'Godot', logo: godotLogo },
                { name: 'SMAPI', logo: smApiLogo },
                { name: 'RPG Maker MZ', logo: rpgMakerLogo },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full bg-secondary py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-4xl font-heading font-bold inline-block relative pb-4 text-text-main">
              Featured Work
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></div>
            </h2>
          </div>

          <div className="space-y-24">
            <ProjectCategory title="Research & Development" icon={<Database size={24} />}>
              <ProjectCard
                title="DyMoN"
                description="Developed and evaluated a motion-aware anomaly detection module designed for dynamic networks. Conducted extensive hyperparameter tuning and benchmarked against state-of-the-art baseline models (DSEDN, JODIE, and STRIPE)."
                img={dymonImg}
                link="https://github.com/Ofen-Lovers/DyMoN"
              />
              <ProjectCard
                title="Runtime Optimization of Modified Quicksort"
                description="An optimized Quicksort implementation that enhances efficiency by integrating Insertion Sort for small subarrays. Building on Md. Sabir Hossain's pivot selection method, this project tests various switching thresholds to maximize speed."
                img={quickSortImg}
                objectFit="contain"
                link="https://github.com/Bun-N-Bun/Modified_Quicksort_with_Insertion_Sort"
              />
              <ProjectCard
                title="Steam Review Sentiment Analysis"
                description='An end-to-end data mining and machine learning pipeline analyzing the link between player engagement and review sentiment. Using 10,000+ Steam API reviews warehoused in Supabase, we identified distinct behavioral patterns between "casual" positive reviewers and "veteran" negative critics.'
                img={steamReviewImg}
                objectFit="contain"
                link="https://github.com/Sambilaycord/Steam-Review-Sentiment-Analysis"
              />
            </ProjectCategory>

            <ProjectCategory title="Software & Web Development" icon={<Layout size={24} />}>
              <ProjectCard
                title="Edelweiss"
                description="A modern web application built with React and TypeScript, backed by Supabase, that connects flower shops and customers in Northern Mindanao. Features include secure authentication, product catalogs, order management, real-time notifications, and personalized reminders."
                img={edelweissImg}
                link="https://github.com/Sambilaycord/Edelweiss-Web"
              />
              <ProjectCard
                title="Ed Mor's Videoke Rental Database"
                description="A custom database management system for Ed Mor's Videoke Rental in Cagayan de Oro City to modernize their daily operations, replacing manual recordkeeping by streamlining customer reservations, delivery scheduling, machine maintenance, and payment tracking."
                img={edMorsImg}
                link="https://github.com/Sambilaycord/Ed_Mors"
              />
              <ProjectCard
                title="DFA and NFA Simulator"
                description="An interactive environment for users to create, visualize, and simulate finite automata. The tool helps users understand the behavior of DFAs and NFAs by allowing them to construct automata, define transitions, and test input strings."
                img={dfaNfaImg}
                link="https://github.com/Ofen-Lovers/DFA-and-NFA-Simulator"
              />
            </ProjectCategory>

            <ProjectCategory title="Game Development" icon={<Gamepad2 size={24} />}>
              <ProjectCard
                title="Cat Distribution System"
                description="Made entirely with C++ using the Raylib Framework. A pull-all-you-can gacha game, free from in-game currency, with cats from popular culture as collectible characters. It seeks to curb a player's thirst for gacha, without the concern of spending any form of currency."
                img={catDistroImg}
                link="https://github.com/Bun-N-Bun/Cat-Distribution-System"
              />
              <ProjectCard
                title="NPC Levi Perez"
                description="Made with the SMAPI framework. This project enriches gameplay with a new NPC that has a unique, relatable backstory and intriguing personality. Levi Perez joins the village as a character you can befriend, date, marry, and start a family with."
                img={leviPerezImg}
                link="https://github.com/joxyle-jhon/Stardew-Valley-Mod"
              />
              <ProjectCard
                title="Lethal2D"
                description="A 2D top-down survival-exploration game built with Python and Pygame. Inspired by Lethal Company, Lethal2D tasks players with exploring abandoned moons, collecting scrap, and returning to their ship to meet an ever-increasing profit quota—all while avoiding dangerous entities."
                img={lethal2DImg}
                link="https://github.com/Ofen-Lovers/Lethal2D"
              />
            </ProjectCategory>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full bg-primary py-16 text-center border-t border-divider">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-2xl font-heading font-bold mb-8 text-text-main">Let's Connect</h3>
          <div className="flex justify-center gap-6 mb-8">
            <a href="https://github.com/Sambilaycord" className="w-12 h-12 rounded-full border border-divider bg-secondary text-text-muted flex items-center justify-center transition-all duration-300 hover:bg-accent-light hover:text-text-main hover:border-accent-light hover:-translate-y-1 shadow-sm">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/krystal-bacalso/" className="w-12 h-12 rounded-full border border-divider bg-secondary text-text-muted flex items-center justify-center transition-all duration-300 hover:bg-accent-light hover:text-text-main hover:border-accent-light hover:-translate-y-1 shadow-sm">
              <Linkedin size={20} />
            </a>
            <a href="mailto: bacalso.krystal707@gmail.com" className="w-12 h-12 rounded-full border border-divider bg-secondary text-text-muted flex items-center justify-center transition-all duration-300 hover:bg-accent-light hover:text-text-main hover:border-accent-light hover:-translate-y-1 shadow-sm">
              <Mail size={20} />
            </a>
          </div>
          <p className="text-text-muted text-sm">© {new Date().getFullYear()} Krystal Bacalso. Designed with cozy vibes.</p>
        </div>
      </footer>
    </div>
  )
}

function TechCard({ icon, title, skills }) {
  return (
    <div className="group bg-secondary p-8 rounded-2xl shadow-[0_4px_6px_-1px_rgba(74,64,58,0.05)] border border-divider transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(74,64,58,0.08)] hover:border-accent-light/50 flex flex-col items-center text-center">
      <div className="text-accent group-hover:text-accent-light transition-colors duration-300 mb-4">{icon}</div>
      <h3 className="font-heading font-bold text-xl mb-4 text-text-main">{title}</h3>
      <ul className="space-y-1 w-full">
        {skills.map((skill, idx) => (
          <li key={idx} className="flex items-center gap-3 text-text-muted text-sm border-b border-divider/50 py-2 last:border-0">
            {skill.logo
              ? <img src={skill.logo} alt={skill.name} className="w-4 h-4 shrink-0 object-contain" />
              : <span className="w-4 h-4 shrink-0 rounded-sm bg-divider inline-block"></span>
            }
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCategory({ title, icon, children }) {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-heading font-bold text-text-main mb-8 flex items-center gap-4">
        <span className="text-accent-light">{icon}</span>
        {title}
        <div className="flex-1 h-px bg-divider"></div>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {children}
      </div>
    </div>
  )
}

function ProjectCard({ title, description, img, objectFit = 'cover', link = '#' }) {
  return (
    <div className="group bg-primary rounded-2xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(74,64,58,0.05)] border border-divider flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(74,64,58,0.1)]">
      <div className="h-48 overflow-hidden border-b border-divider bg-secondary flex items-center justify-center relative">
        <img
          src={img}
          alt={title}
          className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${objectFit === 'contain' ? 'object-contain w-4/5 h-4/5' : 'object-cover'}`}
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h4 className="text-xl font-heading font-bold mb-2 text-text-main">{title}</h4>
        <p className="text-text-muted text-sm mb-6 flex-1">{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light transition-colors mt-auto w-fit">
          Read More <ArrowRight size={16} />
        </a>
      </div>
    </div>
  )
}

function Github({ size = 24 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
  )
}

function Linkedin({ size = 24 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
  )
}

export default App
