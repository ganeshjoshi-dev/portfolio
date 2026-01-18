import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/data/projects';
import brandTheme from '@/styles/brand-theme';
import { ArrowLeft } from 'lucide-react';
import { Button, Breadcrumbs } from '@/components/ui';
import { siteConfig, generateProjectSchema } from '@/lib/utils/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const url = `${siteConfig.url}/projects/${project.slug}`;

  return {
    title: `${project.title} | Ganesh Joshi Projects`,
    description: project.fullDescription || project.description,
    keywords: [...project.technologies, 'Project', 'Portfolio', 'Ganesh Joshi'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: project.title,
      description: project.fullDescription || project.description,
      url,
      siteName: siteConfig.name,
      images: [{ url: project.image }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.fullDescription || project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const projectSchema = generateProjectSchema({
    name: project.title,
    description: project.fullDescription || project.description,
    url: `${siteConfig.url}/projects/${project.slug}`,
    image: `${siteConfig.url}${project.image}`,
    author: siteConfig.name,
    datePublished: project.date,
    technologies: project.technologies,
  });

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <section className={`${brandTheme.components.container.base} section-padding`}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: project.title },
          ]}
        />

        <Button
          href="/projects"
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2 mt-6 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>

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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
