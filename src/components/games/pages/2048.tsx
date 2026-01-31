'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const SWIPE_THRESHOLD = 30;

const SIZE = 4;
type Grid = (number | null)[][];

function emptyGrid(): Grid {
  return Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(null));
}

function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const filtered = row.filter((c) => c !== null) as number[];
  let score = 0;
  const merged: (number | null)[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(null);
  return { row: merged, score };
}

function slideLeft(grid: Grid): { grid: Grid; score: number } {
  let totalScore = 0;
  const newGrid = grid.map((row) => {
    const { row: newRow, score } = slideRow(row);
    totalScore += score;
    return newRow;
  });
  return { grid: newGrid, score: totalScore };
}

function flipHorizontal(grid: Grid): Grid {
  return grid.map((row) => [...row].reverse());
}

function slideRight(grid: Grid): { grid: Grid; score: number } {
  const flipped = flipHorizontal(grid);
  const { grid: slid, score } = slideLeft(flipped);
  return { grid: flipHorizontal(slid), score };
}

function transpose(grid: Grid): Grid {
  const next = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      next[c][r] = grid[r][c];
    }
  }
  return next;
}

function slideUp(grid: Grid): { grid: Grid; score: number } {
  const t = transpose(grid);
  const { grid: slid, score } = slideLeft(t);
  return { grid: transpose(slid), score };
}

function slideDown(grid: Grid): { grid: Grid; score: number } {
  const t = transpose(grid);
  const { grid: slid, score } = slideRight(t);
  return { grid: transpose(slid), score };
}

function gridEqual(a: Grid, b: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function canMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) return true;
      const v = grid[r][c];
      if (c + 1 < SIZE && grid[r][c + 1] === v) return true;
      if (r + 1 < SIZE && grid[r + 1][c] === v) return true;
    }
  }
  return false;
}

function hasWon(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 2048) return true;
    }
  }
  return false;
}

export default function Game2048Page({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [grid, setGrid] = useState<Grid>(() => {
    const g = emptyGrid();
    return addRandomTile(addRandomTile(g));
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const tryMove = useCallback(
    (slide: (g: Grid) => { grid: Grid; score: number }) => {
      if (gameOver) return;
      const { grid: newGrid, score: delta } = slide(grid);
      if (gridEqual(grid, newGrid)) return;
      const withTile = addRandomTile(newGrid);
      setGrid(withTile);
      setScore((s) => s + delta);
      if (hasWon(withTile) && !won) setWon(true);
      if (!canMove(withTile)) setGameOver(true);
    },
    [grid, gameOver, won]
  );

  const moveLeft = useCallback(() => tryMove(slideLeft), [tryMove]);
  const moveRight = useCallback(() => tryMove(slideRight), [tryMove]);
  const moveUp = useCallback(() => tryMove(slideUp), [tryMove]);
  const moveDown = useCallback(() => tryMove(slideDown), [tryMove]);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveLeft, moveRight, moveUp, moveDown]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      const t = e.changedTouches[0];
      if (!start || !t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;
      if (absX >= absY) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        if (dy > 0) moveDown();
        else moveUp();
      }
    },
    [moveLeft, moveRight, moveUp, moveDown]
  );

  const reset = useCallback(() => {
    const g = emptyGrid();
    setGrid(addRandomTile(addRandomTile(g)));
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  const tileColors: Record<number, string> = {
    2: 'bg-amber-100 text-amber-900',
    4: 'bg-amber-200 text-amber-900',
    8: 'bg-orange-300 text-orange-900',
    16: 'bg-orange-400 text-orange-900',
    32: 'bg-red-400 text-red-900',
    64: 'bg-red-500 text-red-900',
    128: 'bg-yellow-300 text-yellow-900',
    256: 'bg-yellow-400 text-yellow-900',
    512: 'bg-yellow-500 text-yellow-900',
    1024: 'bg-cyan-300 text-cyan-900',
    2048: 'bg-cyan-400 text-cyan-900',
  };

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
    >
      <div className="space-y-4 sm:space-y-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <p className="text-slate-400 text-sm sm:text-base">
            Score: <span className="text-cyan-300 font-medium">{score}</span>
            {gameOver && (
              <span className="ml-3 text-red-400 font-medium">Game over</span>
            )}
            {won && !gameOver && (
              <span className="ml-3 text-cyan-300 font-medium">You reached 2048!</span>
            )}
          </p>
          <Button type="button" variant="secondary" size="md" onClick={reset}>
            New game
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 w-full px-1 sm:px-0 min-w-0">
          <div
            className="grid gap-1 sm:gap-1.5 sm:gap-2 md:gap-2.5 p-1.5 sm:p-2 md:p-3 w-full max-w-[min(20rem,100%-1rem)] aspect-square rounded-xl bg-slate-800/60 border border-slate-700/60 touch-manipulation select-none"
            style={{
              gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
            }}
            role="grid"
            aria-label="2048 board"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {grid.flat().map((value, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-center min-h-0 rounded-md sm:rounded-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold
                  ${value === null ? 'bg-slate-700/40' : tileColors[value] ?? 'bg-slate-600 text-white'}
                `}
              >
                {value ?? ''}
              </div>
            ))}
          </div>
          {/* On-screen controls for touch devices */}
          <div
            className="grid grid-cols-3 gap-1.5 sm:gap-2 w-[min(10rem,90vw)] max-w-[10rem] place-items-center"
            role="group"
            aria-label="Direction controls"
          >
            <div />
            <button
              type="button"
              onClick={moveUp}
              disabled={!!gameOver}
              className="flex items-center justify-center min-w-[3rem] min-h-[3rem] w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-700/80 border border-slate-600 hover:bg-slate-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 disabled:pointer-events-none touch-manipulation transition-colors"
              aria-label="Slide up"
            >
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
            </button>
            <div />
            <button
              type="button"
              onClick={moveLeft}
              disabled={!!gameOver}
              className="flex items-center justify-center min-w-[3rem] min-h-[3rem] w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-700/80 border border-slate-600 hover:bg-slate-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 disabled:pointer-events-none touch-manipulation transition-colors"
              aria-label="Slide left"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
            </button>
            <div className="min-w-[3rem] min-h-[3rem] w-14 h-14 sm:w-16 sm:h-16" aria-hidden />
            <button
              type="button"
              onClick={moveRight}
              disabled={!!gameOver}
              className="flex items-center justify-center min-w-[3rem] min-h-[3rem] w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-700/80 border border-slate-600 hover:bg-slate-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 disabled:pointer-events-none touch-manipulation transition-colors"
              aria-label="Slide right"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
            </button>
            <div />
            <button
              type="button"
              onClick={moveDown}
              disabled={!!gameOver}
              className="flex items-center justify-center min-w-[3rem] min-h-[3rem] w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-700/80 border border-slate-600 hover:bg-slate-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 disabled:pointer-events-none touch-manipulation transition-colors"
              aria-label="Slide down"
            >
              <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
            </button>
            <div />
          </div>
          <p className="text-sm text-slate-500 text-center">
            Swipe or use arrow keys to slide. Tap the buttons above on touch devices.
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
