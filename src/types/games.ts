export type GameCategory = 'puzzle' | 'arcade' | 'word';

export interface GameCategoryConfig {
  name: string;
  icon: string;
  slug: string;
  description: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  category?: GameCategory;
  isNew?: boolean;
  keywords?: string[];
}

/** Memory game settings */
export type MemoryGridSize = '2x2' | '3x2' | '4x4' | '4x5' | '6x6';
export type MemoryTimerMode = 'none' | 'stopwatch' | 'countdown';
export interface MemoryGameSettings {
  gridSize: MemoryGridSize;
  timerMode: MemoryTimerMode;
  countdownSeconds?: number;
}

/** Props for game page components rendered by games/[slug]. */
export type GamePageComponent = import('react').ComponentType<{ slug: string }>;
