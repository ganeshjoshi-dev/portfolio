'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import {
  games,
  gameCategories,
  getGamesByCategory,
  searchGames,
} from '@/config/games';
import { GameCard } from '@/components/games/shared';
import { GameCategory } from '@/types/games';

/** For hub page: show a few games as "More to try" (pick from each category) */
function getFeaturedRelatedGames() {
  const puzzle = getGamesByCategory('puzzle').slice(0, 2);
  const arcade = getGamesByCategory('arcade').slice(0, 2);
  const word = getGamesByCategory('word').slice(0, 2);
  return [...puzzle, ...arcade, ...word].slice(0, 6);
}

function GamesHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQuery = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category');
  const validCategories: (GameCategory | 'all')[] = [
    'all',
    'puzzle',
    'arcade',
    'word',
  ];
  const initialCategory: GameCategory | 'all' =
    categoryParam && validCategories.includes(categoryParam as GameCategory | 'all')
      ? (categoryParam as GameCategory | 'all')
      : 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<
    GameCategory | 'all'
  >(initialCategory);

  const updateURL = useCallback(
    (query: string, category: GameCategory | 'all') => {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category !== 'all') params.set('category', category);
      const newURL = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newURL, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(searchQuery, activeCategory);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, updateURL]);

  const filteredGames = useMemo(() => {
    let result = searchQuery ? searchGames(searchQuery) : games;
    if (activeCategory !== 'all') {
      result = result.filter((game) => game.category === activeCategory);
    }
    return result;
  }, [searchQuery, activeCategory]);

  const categories = [
    { id: 'all' as const, name: 'All Games', count: games.length },
    ...Object.entries(gameCategories).map(([id, config]) => ({
      id: id as GameCategory,
      name: config.name,
      count: getGamesByCategory(id as GameCategory).length,
    })),
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Free Browser Games</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Games
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
            Free online browser games — no sign-up, no ads. Play memory, puzzle,
            and more. Built as portfolio projects.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-900/60 border border-slate-700/60
                rounded-xl text-white placeholder-slate-500
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                ${
                  activeCategory === category.id
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-300'
                }
              `}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-60">({category.count})</span>
            </button>
          ))}
        </div>

        <section>
          {activeCategory === 'all' && !searchQuery && (
            <h2 className="text-xl font-semibold text-white mb-6">
              All Games
            </h2>
          )}
          {filteredGames.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                {searchQuery && activeCategory !== 'all'
                  ? `No games found matching "${searchQuery}" in ${gameCategories[activeCategory as GameCategory]?.name ?? 'this category'}`
                  : searchQuery
                    ? `No games found matching "${searchQuery}"`
                    : activeCategory !== 'all'
                      ? `No games in ${gameCategories[activeCategory as GameCategory]?.name ?? 'this category'}`
                      : 'No games found'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {activeCategory === 'all' && !searchQuery && (
          <section className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              More games to try
            </h2>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getFeaturedRelatedGames().map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 sm:mt-16 text-center">
          <div className="inline-block p-6 sm:p-8 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-xl">
            <p className="text-slate-500">More games coming soon!</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function GamesLoadingFallback() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Free Browser Games</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Games
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
            Free online browser games — no sign-up, no ads.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <div className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-900/60 border border-slate-700/60 rounded-xl h-12 sm:h-14 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-24 h-10 bg-slate-900/60 border border-slate-700/60 rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 bg-slate-900/60 border border-slate-700/60 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function GamesHubPage() {
  return (
    <Suspense fallback={<GamesLoadingFallback />}>
      <GamesHubContent />
    </Suspense>
  );
}
