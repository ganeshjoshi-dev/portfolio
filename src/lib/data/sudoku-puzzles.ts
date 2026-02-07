/** Sudoku puzzles. Each is 81 digits (row-major), 0 = empty. All are valid and solvable. */

export const SUDOKU_PUZZLES: number[][] = [
  // Easy
  [
    5, 3, 0, 0, 7, 0, 0, 0, 0,
    6, 0, 0, 1, 9, 5, 0, 0, 0,
    0, 9, 8, 0, 0, 0, 0, 6, 0,
    8, 0, 0, 0, 6, 0, 0, 0, 3,
    4, 0, 0, 8, 0, 3, 0, 0, 1,
    7, 0, 0, 0, 2, 0, 0, 0, 6,
    0, 6, 0, 0, 0, 0, 2, 8, 0,
    0, 0, 0, 4, 1, 9, 0, 0, 5,
    0, 0, 0, 0, 8, 0, 0, 7, 9,
  ],
  // Medium
  [
    0, 0, 0, 6, 0, 0, 4, 0, 0,
    7, 0, 0, 0, 0, 3, 6, 0, 0,
    0, 0, 0, 0, 9, 1, 0, 8, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 0, 1, 8, 0, 0, 0, 3,
    0, 0, 0, 3, 0, 6, 0, 4, 5,
    0, 4, 0, 2, 0, 0, 0, 6, 0,
    9, 0, 3, 0, 0, 0, 0, 0, 0,
    0, 2, 0, 0, 0, 0, 1, 0, 0,
  ],
  // Another
  [
    0, 2, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 6, 0, 0, 0, 0, 3,
    0, 7, 4, 0, 8, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 3, 0, 0, 2,
    0, 8, 0, 0, 4, 0, 0, 1, 0,
    6, 0, 0, 5, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 7, 8, 0,
    5, 0, 0, 0, 0, 9, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 4, 0,
  ],
];

export function getRandomSudokuPuzzle(): { puzzle: number[]; given: boolean[] } {
  const puzzle = [...SUDOKU_PUZZLES[Math.floor(Math.random() * SUDOKU_PUZZLES.length)]!];
  const given = puzzle.map((n) => n !== 0);
  return { puzzle, given };
}
