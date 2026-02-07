'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import { getRandomSudokuPuzzle } from '@/lib/data/sudoku-puzzles';

function getConflicts(
  grid: number[],
  index: number
): Set<number> {
  const conflicts = new Set<number>();
  const value = grid[index];
  if (value === 0) return conflicts;
  const r = Math.floor(index / 9);
  const c = index % 9;
  for (let i = 0; i < 9; i++) {
    const rowIdx = r * 9 + i;
    if (rowIdx !== index && grid[rowIdx] === value) conflicts.add(rowIdx);
    const colIdx = i * 9 + c;
    if (colIdx !== index && grid[colIdx] === value) conflicts.add(colIdx);
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      const idx = (br + dr) * 9 + (bc + dc);
      if (idx !== index && grid[idx] === value) conflicts.add(idx);
    }
  }
  return conflicts;
}

function isComplete(grid: number[]): boolean {
  if (grid.some((n) => n === 0)) return false;
  for (let i = 0; i < 81; i++) {
    if (getConflicts(grid, i).size > 0) return false;
  }
  return true;
}

export default function SudokuPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [{ puzzle, given }, setPuzzleState] = useState(() => getRandomSudokuPuzzle());
  const [grid, setGrid] = useState<number[]>(() => [...puzzle]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setGrid([...puzzle]);
  }, [puzzle]);

  const conflicts = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < 81; i++) {
      getConflicts(grid, i).forEach((idx) => set.add(idx));
    }
    return set;
  }, [grid]);

  const solved = useMemo(() => isComplete(grid), [grid]);

  const setCell = useCallback(
    (index: number, value: number) => {
      if (given[index]) return;
      setGrid((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    [given]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selected === null) return;
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        setCell(selected, parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        if (!given[selected]) setCell(selected, 0);
      } else if (e.key === 'ArrowRight' && selected < 80) setSelected(selected + 1);
      else if (e.key === 'ArrowLeft' && selected > 0) setSelected(selected - 1);
      else if (e.key === 'ArrowDown' && selected + 9 <= 80) setSelected(selected + 9);
      else if (e.key === 'ArrowUp' && selected - 9 >= 0) setSelected(selected - 9);
    },
    [selected, setCell, given]
  );

  const newGame = () => {
    const next = getRandomSudokuPuzzle();
    setPuzzleState(next);
    setGrid([...next.puzzle]);
    setSelected(null);
  };

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {solved && <p className="text-green-400 font-medium">Puzzle complete!</p>}
          <Button variant="secondary" size="sm" onClick={newGame}>
            New puzzle
          </Button>
        </div>

        <p className="text-slate-500 text-sm">
          Click a cell (or the grid) and type 1–9. Use arrow keys to move. Delete to clear.
        </p>

        <div
          className="inline-grid gap-0 p-2 bg-slate-800/60 border border-slate-700/60 rounded-xl"
          style={{
            gridTemplateColumns: 'repeat(9, minmax(0, 2.5rem))',
            gridTemplateRows: 'repeat(9, minmax(0, 2.5rem))',
          }}
          role="grid"
          aria-label="Sudoku grid"
        >
          {Array.from({ length: 81 }, (_, i) => {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const value = grid[i];
            const isGiven = given[i];
            const hasConflict = conflicts.has(i);
            const isSelected = selected === i;
            const thickRight = c === 2 || c === 5;
            const thickBottom = r === 2 || r === 5;

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                onKeyDown={handleKeyDown}
                className={`
                  w-10 h-10 flex items-center justify-center text-lg font-medium rounded-sm
                  border border-slate-600/60
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  ${thickRight ? 'border-r-2 border-r-slate-500' : ''}
                  ${thickBottom ? 'border-b-2 border-b-slate-500' : ''}
                  ${
                    isSelected
                      ? 'bg-cyan-500/30 text-cyan-100 ring-1 ring-cyan-400'
                      : hasConflict
                        ? 'bg-red-900/30 text-red-200'
                        : isGiven
                          ? 'bg-slate-700/60 text-slate-100'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80'
                  }
                `}
                aria-label={`Cell row ${r + 1} column ${c + 1}, ${value || 'empty'}`}
              >
                {value > 0 ? value : ''}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Button
              key={n}
              variant="ghost"
              size="sm"
              className="min-w-[2.5rem]"
              onClick={() => selected !== null && setCell(selected, n)}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selected !== null && !given[selected] && setCell(selected, 0)}
          >
            Clear
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
