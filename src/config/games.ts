import { Game, GameCategory, GameCategoryConfig } from '@/types/games';

export const gameCategories: Record<GameCategory, GameCategoryConfig> = {
  puzzle: {
    name: 'Puzzle',
    icon: 'Puzzle',
    slug: 'puzzle',
    description: 'Match, remember, and think your way through',
  },
  arcade: {
    name: 'Arcade',
    icon: 'Gamepad2',
    slug: 'arcade',
    description: 'Classic arcade-style games',
  },
  word: {
    name: 'Word',
    icon: 'Type',
    slug: 'word',
    description: 'Word and letter games',
  },
} as const;

export const games: Game[] = [
  {
    id: 'memory',
    name: 'Memory',
    description: 'Flip cards to find matching pairs. Test your memory with this classic card-matching game.',
    category: 'puzzle',
    path: '/games/memory',
    icon: 'Brain',
    isNew: true,
    keywords: ['memory', 'card', 'match', 'pairs', 'brain', 'puzzle'],
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe',
    description: 'Classic 3×3 grid. Play against a friend or the computer.',
    category: 'puzzle',
    path: '/games/tic-tac-toe',
    icon: 'Grid3X3',
    keywords: ['tic-tac-toe', 'noughts', 'crosses', 'xo', 'puzzle'],
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Guide the snake to food. Don’t hit the walls or yourself.',
    category: 'arcade',
    path: '/games/snake',
    icon: 'Worm',
    keywords: ['snake', 'arcade', 'classic', 'retro'],
  },
  {
    id: '2048',
    name: '2048',
    description: 'Slide tiles to combine numbers. Reach 2048 and beyond.',
    category: 'puzzle',
    path: '/games/2048',
    icon: 'LayoutGrid',
    keywords: ['2048', 'puzzle', 'numbers', 'tiles'],
  },
  {
    id: 'wordle',
    name: 'Wordle',
    description: 'Guess the 5-letter word in six tries. Color hints show how close you are.',
    category: 'word',
    path: '/games/wordle',
    icon: 'Type',
    keywords: ['wordle', 'word', 'guess', 'letters'],
  },
  {
    id: 'hangman',
    name: 'Hangman',
    description: 'Guess the word letter by letter. Avoid too many wrong guesses.',
    category: 'word',
    path: '/games/hangman',
    icon: 'HelpCircle',
    keywords: ['hangman', 'word', 'letters', 'guess'],
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Bounce the ball off the paddle and break all the bricks.',
    category: 'arcade',
    path: '/games/breakout',
    icon: 'Layers',
    keywords: ['breakout', 'brick', 'paddle', 'arcade', 'ball'],
  },
  {
    id: 'simon-says',
    name: 'Simon Says',
    description: 'Watch the sequence, then repeat it. How far can you go?',
    category: 'puzzle',
    path: '/games/simon-says',
    icon: 'CircleDot',
    keywords: ['simon says', 'memory', 'sequence', 'puzzle'],
  },
  {
    id: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    description: 'Classic hand game. Play against the computer.',
    category: 'puzzle',
    path: '/games/rock-paper-scissors',
    icon: 'Hand',
    keywords: ['rock paper scissors', 'rps', 'puzzle', 'vs computer'],
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    description: 'Drop discs to get four in a row. Play vs a friend or the computer.',
    category: 'puzzle',
    path: '/games/connect-four',
    icon: 'Circle',
    keywords: ['connect four', 'four in a row', 'puzzle', 'strategy'],
  },
  {
    id: 'sola-haadi',
    name: 'Sola Haadi',
    description:
      'Traditional 16 vs 16 jumping game. Also known as Sixteen Soldiers. Famous in Rajasthan, India. Capture by jumping; win by taking all or blocking.',
    category: 'puzzle',
    path: '/games/sola-haadi',
    icon: 'Grid2X2',
    keywords: ['sola haadi', 'sixteen soldiers', 'rajasthan', 'board', 'strategy'],
  },
  {
    id: 'trap-run',
    name: 'Trap Run',
    description:
      'Reach the exit without touching hazards. Tricky platformer with instant retry—learn through failure.',
    category: 'arcade',
    path: '/games/trap-run',
    icon: 'Flame',
    keywords: ['trap run', 'platformer', 'arcade', 'exit', 'hazards'],
  },
];

export function getGamesByCategory(category: GameCategory): Game[] {
  return games.filter((game) => game.category === category);
}

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}

export function getGameBySlug(slug: string): Game | undefined {
  return getGameById(slug);
}

export function searchGames(query: string): Game[] {
  const lowerQuery = query.toLowerCase();
  return games.filter(
    (game) =>
      game.name.toLowerCase().includes(lowerQuery) ||
      game.description.toLowerCase().includes(lowerQuery) ||
      game.keywords?.some((keyword) => keyword.includes(lowerQuery))
  );
}
