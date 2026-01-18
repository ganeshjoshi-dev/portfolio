import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import brandTheme from '@/styles/brand-theme';
import { ArrowLeft } from 'lucide-react';
import { Button, Breadcrumbs } from '@/components/ui';
import { siteConfig } from '@/lib/utils/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

// Placeholder blog posts - replace with actual data source
const blogPosts = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'An introduction to web development concepts and best practices.',
    content: 'Coming soon...',
    date: '2025-01-01',
  },
];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} | Ganesh Joshi Blog`,
    description: post.description || post.content.slice(0, 160),
    keywords: ['Blog', 'Web Development', 'Ganesh Joshi', post.title],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description || post.content.slice(0, 160),
      url,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: post.date,
      authors: [siteConfig.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.content.slice(0, 160),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Generate Article structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description || post.content.slice(0, 160),
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className={`${brandTheme.components.container.base} section-padding max-w-4xl`}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        <Button
          href="/blog"
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2 mt-6 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Button>

        <h1 className={`${brandTheme.components.text.hero} mb-6`}>
          {post.title}
        </h1>

        <time className="text-slate-400 text-sm mb-8 block" dateTime={post.date}>
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
