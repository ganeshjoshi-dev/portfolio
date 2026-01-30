import { lazy, type LazyExoticComponent } from 'react';
import type { GamePageComponent } from '@/types/games';
import { games } from '@/config/games';

/** Lazy-loaded game page components keyed by game id (slug). */
export const gamePageRegistry: Record<
  string,
  LazyExoticComponent<GamePageComponent>
> = {
  memory: lazy(() => import('./memory')),
  'tic-tac-toe': lazy(() => import('./tic-tac-toe')),
  snake: lazy(() => import('./snake')),
  '2048': lazy(() => import('./2048')),
  wordle: lazy(() => import('./wordle')),
  hangman: lazy(() => import('./hangman')),
  breakout: lazy(() => import('./breakout')),
  'simon-says': lazy(() => import('./simon-says')),
  'rock-paper-scissors': lazy(() => import('./rock-paper-scissors')),
  'connect-four': lazy(() => import('./connect-four')),
};

/** All game slugs for generateStaticParams. */
export const gameSlugs = games.map((g) => g.id);
