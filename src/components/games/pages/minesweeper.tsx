'use client';

import { useState, useCallback, useEffect } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function getNeighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  }
  return out;
}

function placeMines(excludeR: number, excludeC: number): Set<number> {
  const exclude = excludeR * COLS + excludeC;
  const mines = new Set<number>();
  while (mines.size < MINES) {
    const cell = Math.floor(Math.random() * (ROWS * COLS));
    if (cell !== exclude) mines.add(cell);
  }
  return mines;
}

function countAdjacentMines(mines: Set<number>, r: number, c: number): number {
  return getNeighbors(r, c).filter(
    ([nr, nc]) => mines.has(nr * COLS + nc)
  ).length;
}

export default function MinesweeperPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [mines, setMines] = useState<Set<number> | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());
  const [flagged, setFlagged] = useState<Set<number>>(() => new Set());
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);

  const totalCells = ROWS * COLS;
  const revealedCount = revealed.size;
  const win = mines !== null && gameOver === null && revealedCount === totalCells - MINES;

  useEffect(() => {
    if (win) setGameOver('win');
  }, [win]);

  const revealCell = useCallback(
    (r: number, c: number) => {
      const idx = r * COLS + c;
      if (gameOver || flagged.has(idx)) return;

      if (mines === null) {
        const newMines = placeMines(r, c);
        setMines(newMines);
        const adj = countAdjacentMines(newMines, r, c);
        if (adj === 0) {
          const toReveal = new Set<number>();
          const queue: [number, number][] = [[r, c]];
          while (queue.length) {
            const [nr, nc] = queue.shift()!;
            const nidx = nr * COLS + nc;
            if (toReveal.has(nidx)) continue;
            if (newMines.has(nidx)) continue;
            toReveal.add(nidx);
            if (countAdjacentMines(newMines, nr, nc) === 0) {
              for (const [nnr, nnc] of getNeighbors(nr, nc)) {
                const nnidx = nnr * COLS + nnc;
                if (!toReveal.has(nnidx) && !newMines.has(nnidx)) queue.push([nnr, nnc]);
              }
            }
          }
          setRevealed(toReveal);
        } else {
          setRevealed((prev) => new Set(prev).add(idx));
        }
        return;
      }

      if (mines.has(idx)) {
        setGameOver('lose');
        setRevealed((prev) => new Set([...prev, ...mines]));
        return;
      }

      const adj = countAdjacentMines(mines, r, c);
      if (adj === 0) {
        const toReveal = new Set(revealed);
        const queue: [number, number][] = [[r, c]];
        while (queue.length) {
          const [nr, nc] = queue.shift()!;
          const nidx = nr * COLS + nc;
          if (toReveal.has(nidx)) continue;
          if (mines.has(nidx)) continue;
          toReveal.add(nidx);
          if (countAdjacentMines(mines, nr, nc) === 0) {
            for (const [nnr, nnc] of getNeighbors(nr, nc)) {
              const nnidx = nnr * COLS + nnc;
              if (!toReveal.has(nnidx) && !mines.has(nnidx)) queue.push([nnr, nnc]);
            }
          }
        }
        setRevealed(toReveal);
      } else {
        setRevealed((prev) => new Set(prev).add(idx));
      }
    },
    [gameOver, flagged, mines, revealed]
  );

  const toggleFlag = useCallback(
    (r: number, c: number) => {
      if (gameOver || mines === null) return;
      const idx = r * COLS + c;
      if (revealed.has(idx)) return;
      setFlagged((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });
    },
    [gameOver, mines, revealed]
  );

  const handleCellClick = (r: number, c: number) => {
    if (gameOver) return;
    revealCell(r, c);
  };

  const handleCellContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    toggleFlag(r, c);
  };

  const flagCount = flagged.size;
  const mineCount = mines !== null ? MINES : 0;

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-slate-400">
            Mines: {mineCount - flagCount} | Flags: {flagCount}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setMines(null);
              setRevealed(new Set());
              setFlagged(new Set());
              setGameOver(null);
            }}
          >
            New game
          </Button>
        </div>

        {gameOver === 'lose' && (
          <p className="text-red-400 font-medium">You hit a mine. Try again!</p>
        )}
        {gameOver === 'win' && (
          <p className="text-green-400 font-medium">You won! All safe cells revealed.</p>
        )}

        <div
          className="inline-grid gap-0.5 p-2 bg-slate-800/60 border border-slate-700/60 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 2rem))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 2rem))`,
          }}
          role="grid"
          aria-label="Minesweeper grid"
        >
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const isRevealed = revealed.has(i);
            const isFlag = flagged.has(i);
            const isMine = mines !== null && mines.has(i);
            const showMine = isRevealed && isMine;
            const adj =
              mines !== null && isRevealed && !isMine
                ? countAdjacentMines(mines, r, c)
                : 0;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleCellContextMenu(e, r, c)}
                disabled={gameOver === 'lose'}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-medium rounded
                  border border-slate-600/60
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  disabled:pointer-events-none
                  ${
                    showMine
                      ? 'bg-red-900/60 text-red-200'
                      : isRevealed
                        ? 'bg-slate-700/80 text-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }
                `}
                aria-label={`Cell ${r + 1}, ${c + 1}${isFlag ? ', flagged' : ''}${isRevealed ? `, ${adj > 0 ? adj + ' adjacent mines' : 'empty'}` : ''}`}
              >
                {showMine ? '💣' : isFlag ? '🚩' : isRevealed && adj > 0 ? adj : ''}
              </button>
            );
          })}
        </div>
        <p className="text-slate-500 text-sm">Right-click to place or remove a flag.</p>
      </div>
    </GameLayout>
  );
}
