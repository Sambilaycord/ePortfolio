import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { RoomScene } from "@/components/site/room-scene";
import { ProjectsChapter } from "@/components/site/projects-chapter";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsChapter />
      <RoomScene />
      <Contact />
    </>
  );
}
