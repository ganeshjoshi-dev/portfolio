import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Tool, ToolCategoryConfig } from '@/types/tools';
import { ToolStructuredData } from '@/components/tools/ToolStructuredData';
import { Breadcrumbs } from '@/components/ui';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backLink?: string;
  backLabel?: string;
  /** Tool config for structured data injection */
  tool?: Tool;
  /** Category config for breadcrumb structured data */
  category?: ToolCategoryConfig;
}

export default function ToolLayout({
  children,
  title,
  description,
  backLink = '/tools',
  backLabel = 'All Tools',
  tool,
  category,
}: ToolLayoutProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: title },
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      {/* Structured Data for SEO */}
      {tool && category && (
        <ToolStructuredData tool={tool} category={category} />
      )}

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} includeSchema={false} />

        {/* Back Link */}
        <Link
          href={backLink}
          className="
            inline-flex items-center gap-2 text-slate-400 hover:text-cyan-300
            transition-all duration-300 mt-3 mb-4 sm:mt-4 sm:mb-6 group
          "
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </Link>

        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            {title}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            {description}
          </p>
        </header>

        {/* Tool Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </main>
  );
}
