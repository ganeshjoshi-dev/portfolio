/** Word search puzzle: grid and list of words to find. Words are in the grid in one of 8 directions. */

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
] as const;

function randomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function canPlace(
  grid: string[][],
  word: string,
  r: number,
  c: number,
  dr: number,
  dc: number
): boolean {
  const rows = grid.length;
  const cols = grid[0]!.length;
  for (let i = 0; i < word.length; i++) {
    const nr = r + i * dr;
    const nc = c + i * dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
    const cell = grid[nr]![nc]!;
    if (cell !== '' && cell !== word[i]) return false;
  }
  return true;
}

function placeWord(grid: string[][], word: string): boolean {
  const rows = grid.length;
  const cols = grid[0]!.length;
  const attempts = 50;
  for (let a = 0; a < attempts; a++) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]!;
    if (canPlace(grid, word, r, c, dr, dc)) {
      for (let i = 0; i < word.length; i++) {
        grid[r + i * dr]![c + i * dc] = word[i]!;
      }
      return true;
    }
  }
  return false;
}

export function generateWordSearch(words: string[], size = 12): { grid: string[][]; words: string[] } {
  const grid: string[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(''));
  const placed: string[] = [];
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  for (const word of shuffled) {
    const upper = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length < 2 || upper.length > size) continue;
    if (placeWord(grid, upper)) placed.push(upper);
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r]![c]! === '') grid[r]![c] = randomLetter();
    }
  }
  return { grid, words: placed };
}

const THEMES: { words: string[] }[] = [
  { words: ['JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'HTML', 'CSS', 'NODE', 'API', 'CODE', 'WEB', 'APP'] },
  { words: ['SUN', 'MOON', 'STAR', 'EARTH', 'PLANET', 'SPACE', 'ORBIT', 'GALAXY', 'COMET', 'ASTRO'] },
  { words: ['MOUNTAIN', 'RIVER', 'OCEAN', 'FOREST', 'DESERT', 'LAKE', 'VALLEY', 'BEACH', 'ISLAND', 'CLOUD'] },
  { words: ['MUSIC', 'PIANO', 'GUITAR', 'DRUMS', 'SONG', 'MELODY', 'RHYTHM', 'BAND', 'CONCERT', 'NOTE'] },
  { words: ['COFFEE', 'TEA', 'BREAKFAST', 'LUNCH', 'DINNER', 'COOK', 'RECIPE', 'KITCHEN', 'FOOD', 'MEAL'] },
];

export function getRandomWordSearchPuzzle(): { grid: string[][]; words: string[] } {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)]!;
  return generateWordSearch(theme.words);
}
