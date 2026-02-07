'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const SIZE = 4;
const TOTAL = SIZE * SIZE;
const EMPTY = 0;

function getEmptyIndex(board: number[]): number {
  return board.indexOf(EMPTY);
}

function getNeighbors(index: number): number[] {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(index - SIZE);
  if (row < SIZE - 1) neighbors.push(index + SIZE);
  if (col > 0) neighbors.push(index - 1);
  if (col < SIZE - 1) neighbors.push(index + 1);
  return neighbors;
}

function isSolved(board: number[]): boolean {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[TOTAL - 1] === EMPTY;
}

/** Create a solvable shuffled board by performing random valid moves from solved state. */
function createShuffledBoard(): number[] {
  const board = Array.from({ length: TOTAL }, (_, i) => (i === TOTAL - 1 ? EMPTY : i + 1));
  let emptyIdx = TOTAL - 1;
  const moves = 150 + Math.floor(Math.random() * 100);
  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(emptyIdx);
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    [board[emptyIdx], board[next]] = [board[next], board[emptyIdx]];
    emptyIdx = next;
  }
  return board;
}

export default function FifteenPuzzlePage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [board, setBoard] = useState<number[]>(createShuffledBoard);
  const [moves, setMoves] = useState(0);

  const solved = useMemo(() => isSolved(board), [board]);
  const emptyIndex = useMemo(() => getEmptyIndex(board), [board]);

  const move = useCallback(
    (clickedIndex: number) => {
      if (solved) return;
      const neighbors = getNeighbors(emptyIndex);
      if (!neighbors.includes(clickedIndex)) return;
      setBoard((prev) => {
        const next = [...prev];
        next[emptyIndex] = next[clickedIndex];
        next[clickedIndex] = EMPTY;
        return next;
      });
      setMoves((m) => m + 1);
    },
    [emptyIndex, solved]
  );

  const shuffle = useCallback(() => {
    setBoard(createShuffledBoard());
    setMoves(0);
  }, []);

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-slate-400 text-sm sm:text-base">
            {solved ? 'Solved!' : `Moves: ${moves}`}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={shuffle}
          >
            Shuffle
          </Button>
        </div>

        <div
          className="inline-grid gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${SIZE}, 1fr)`,
            aspectRatio: '1',
            maxWidth: 'min(28rem, 100%)',
          }}
          role="grid"
          aria-label="Fifteen puzzle grid"
        >
          {board.map((value, index) => (
            <button
              key={`${index}-${value}`}
              type="button"
              onClick={() => move(index)}
              disabled={solved || value === EMPTY}
              className={`
                flex items-center justify-center min-w-0 min-h-0
                rounded-lg sm:rounded-xl text-xl sm:text-2xl md:text-3xl font-bold
                transition-all duration-200 touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                ${
                  value === EMPTY
                    ? 'bg-slate-800/60 border border-slate-700/40 cursor-default'
                    : 'bg-slate-700/80 border border-slate-600/60 text-white hover:border-cyan-400/50 hover:bg-slate-700'
                }
                ${solved ? 'pointer-events-none' : ''}
              `}
              aria-label={value === EMPTY ? 'Empty space' : `Tile ${value}`}
            >
              {value === EMPTY ? '' : value}
            </button>
          ))}
        </div>

        <p className="text-slate-500 text-sm">
          Click a tile next to the empty space to slide it. Get 1–15 in order.
        </p>
      </div>
    </GameLayout>
  );
}
