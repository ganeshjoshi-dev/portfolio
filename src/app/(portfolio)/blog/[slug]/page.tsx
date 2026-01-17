import { notFound } from 'next/navigation';
import brandTheme from '@/styles/brand-theme';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Placeholder blog posts - replace with actual data source
const blogPosts = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    content: 'Coming soon...',
    date: '2025-01-01',
  },
];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <article className={`${brandTheme.components.container.base} section-padding max-w-4xl`}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <h1 className={`${brandTheme.components.text.hero} mb-6`}>
          {post.title}
        </h1>

        <time className="text-slate-400 text-sm mb-8 block">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        <div className="prose prose-invert prose-cyan max-w-none">
          <p className="text-slate-300 text-lg">{post.content}</p>
        </div>
      </article>
    </main>
  );
}
