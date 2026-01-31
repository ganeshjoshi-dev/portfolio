'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backLink?: string;
  backLabel?: string;
}

export default function GameLayout({
  children,
  title,
  description,
  backLink = '/games',
  backLabel = 'All Games',
}: GameLayoutProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Games', href: '/games' },
    { label: title },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-x-hidden">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0 w-full">
        <Breadcrumbs items={breadcrumbItems} includeSchema={false} />
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
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            {title}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            {description}
          </p>
        </header>
        <div className="space-y-6 min-w-0" data-game-container>
          {children}
        </div>
      </div>
    </main>
  );
}
