'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui';
import GameSearch from './GameSearch';
import RelatedGames from './RelatedGames';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backLink?: string;
  backLabel?: string;
  /** Current game id to exclude from search results (e.g. slug) */
  currentGameId?: string;
}

export default function GameLayout({
  children,
  title,
  description,
  backLink = '/games',
  backLabel = 'All Games',
  currentGameId,
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
        {/* Top bar: Breadcrumb + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Breadcrumbs items={breadcrumbItems} includeSchema={false} />
          <div className="w-full sm:w-64 sm:shrink-0">
            <GameSearch currentGameId={currentGameId} compact />
          </div>
        </div>

        {/* Back link */}
        <Link
          href={backLink}
          className="
            inline-flex items-center gap-2 text-slate-400 hover:text-cyan-300
            transition-all duration-300 mt-3 mb-4 sm:mt-4 sm:mb-6 group w-fit
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

        {currentGameId && (
          <RelatedGames currentGameId={currentGameId} />
        )}
      </div>
    </main>
  );
}
