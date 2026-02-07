'use client';

import { getGameById, getGamesByCategory } from '@/config/games';
import type { GameCategory } from '@/types/games';
import GameCard from './GameCard';

interface RelatedGamesProps {
  /** Current game id (slug) to exclude and to derive category from */
  currentGameId: string;
  title?: string;
  maxItems?: number;
}

export default function RelatedGames({
  currentGameId,
  title = 'Related Games',
  maxItems = 6,
}: RelatedGamesProps) {
  const currentGame = getGameById(currentGameId);
  if (!currentGame) return null;

  const category = currentGame.category as GameCategory;
  const sameCategory = getGamesByCategory(category).filter(
    (g) => g.id !== currentGameId
  );
  const related = sameCategory.slice(0, maxItems);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="related-games-heading">
      <h2
        id="related-games-heading"
        className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
      >
        {title}
      </h2>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
