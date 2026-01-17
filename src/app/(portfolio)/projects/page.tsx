import brandTheme from "@/styles/brand-theme";
import { projects } from "@/lib/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";

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
