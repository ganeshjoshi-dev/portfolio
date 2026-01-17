import { notFound } from 'next/navigation';
import { projects } from '@/lib/data/projects';
import brandTheme from '@/styles/brand-theme';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <section className={`${brandTheme.components.container.base} section-padding`}>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <h1 className={`${brandTheme.components.text.hero} mb-6`}>
          {project.title}
        </h1>

        <p className="text-slate-300 text-lg mb-8 max-w-3xl">
          {project.fullDescription || project.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-slate-800/60 border border-slate-700/60 rounded-full text-sm text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.liveLink && (
            <Button href={project.liveLink} external variant="primary" size="lg">
              View Live
            </Button>
          )}
          {project.githubLink && (
            <Button href={project.githubLink} external variant="secondary" size="lg">
              View Code
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
