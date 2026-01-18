import type { Metadata } from "next";
import brandTheme from "@/styles/brand-theme";
import { projects } from "@/lib/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";
import { generatePageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Projects | Ganesh Joshi - Full Stack Developer",
  description:
    "Explore my portfolio of web development projects including eCommerce platforms, React applications, and full-stack solutions with modern architecture.",
  path: "/projects",
  keywords: [
    "Web Development Projects",
    "React Projects",
    "Next.js Portfolio",
    "eCommerce Projects",
    "Full Stack Projects",
    "MERN Stack",
  ],
});

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <section className={`${brandTheme.components.container.base} section-padding`}>
        <div className="flex flex-col items-center text-center">
          <h1 className={`${brandTheme.components.text.hero} mb-6`}>
            My <span className={brandTheme.components.logo.brand}>Projects</span>
          </h1>
          <p className="text-slate-300 max-w-2xl">
            A showcase of work that highlights scalable architecture, modern UI,
            and measurable results.
          </p>
        </div>
      </section>

      <section className={`${brandTheme.components.container.base} section-padding`}>
        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </section>
    </main>
  );
}
