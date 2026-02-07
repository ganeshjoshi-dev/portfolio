'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import { getRandomWordSearchPuzzle } from '@/lib/data/word-search-puzzles';

function getCellsInLine(
  r0: number,
  c0: number,
  r1: number,
  c1: number
): [number, number][] {
  const dr = r1 - r0;
  const dc = c1 - c0;
  if (dr === 0 && dc === 0) return [[r0, c0]];
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [[r0, c0]];
  const stepR = dr / steps;
  const stepC = dc / steps;
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const r = Math.round(r0 + i * stepR);
    const c = Math.round(c0 + i * stepC);
    out.push([r, c]);
  }
  return out;
}

function isStraightLine(r0: number, c0: number, r1: number, c1: number): boolean {
  const dr = r1 - r0;
  const dc = c1 - c0;
  if (dr === 0 || dc === 0) return true;
  return Math.abs(dr) === Math.abs(dc);
}

export default function WordSearchPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [puzzle, setPuzzle] = useState(() => getRandomWordSearchPuzzle());
  const [foundWords, setFoundWords] = useState<Set<string>>(() => new Set());
  const [selection, setSelection] = useState<[number, number] | null>(null);
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);

  const { grid, words } = puzzle;
  const rows = grid.length;
  const cols = grid[0]!.length;

  const selectionLine = useMemo(() => {
    if (!selection || !hoverCell) return null;
    const [r0, c0] = selection;
    const [r1, c1] = hoverCell;
    if (!isStraightLine(r0, c0, r1, c1)) return null;
    return getCellsInLine(r0, c0, r1, c1);
  }, [selection, hoverCell]);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (!selection) {
        setSelection([r, c]);
        return;
      }
      const [r0, c0] = selection;
      if (r0 === r && c0 === c) {
        setSelection(null);
        return;
      }
      if (!isStraightLine(r0, c0, r, c)) {
        setSelection([r, c]);
        return;
      }
      const cells = getCellsInLine(r0, c0, r, c);
      const letters = cells
        .map(([rr, cc]) => grid[rr]?.[cc])
        .filter(Boolean)
        .join('');
      const rev = letters.split('').reverse().join('');
      if (words.includes(letters) || words.includes(rev)) {
        setFoundWords((prev) => new Set(prev).add(letters).add(rev));
      }
      setSelection(null);
      setHoverCell(null);
    },
    [selection, grid, words]
  );

  const handleCellMouseEnter = (r: number, c: number) => {
    if (selection) setHoverCell([r, c]);
  };

  const handleCellMouseLeave = () => {
    setHoverCell(null);
  };

  const isInSelection = (r: number, c: number): boolean => {
    if (selection && !hoverCell) return selection[0] === r && selection[1] === c;
    if (!selectionLine) return false;
    return selectionLine.some(([rr, cc]) => rr === r && cc === c);
  };

  const isWordFound = (word: string) => foundWords.has(word);

  const newGame = () => {
    setPuzzle(getRandomWordSearchPuzzle());
    setFoundWords(new Set());
    setSelection(null);
    setHoverCell(null);
  };

  const allFound = words.length > 0 && words.every((w) => foundWords.has(w));

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
            Found: {foundWords.size} / {words.length}
          </span>
          <Button variant="secondary" size="sm" onClick={newGame}>
            New puzzle
          </Button>
        </div>

        {allFound && (
          <p className="text-green-400 font-medium">You found all the words!</p>
        )}

        <p className="text-slate-500 text-sm">
          Click a cell to start, then click another in a straight line (row, column, or diagonal) to select a word.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div
            className="inline-grid gap-0.5 p-2 bg-slate-800/60 border border-slate-700/60 rounded-xl select-none"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 2rem))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 2rem))`,
            }}
            role="grid"
            aria-label="Word search grid"
          >
            {grid.map((row, r) =>
              row.map((letter, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={`
                    w-8 h-8 flex items-center justify-center text-sm font-medium rounded
                    border border-slate-600/60
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                    ${
                      isInSelection(r, c)
                        ? 'bg-cyan-500/40 text-white border-cyan-400/60'
                        : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80'
                    }
                  `}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  onMouseLeave={handleCellMouseLeave}
                  aria-label={`${letter}, row ${r + 1}, column ${c + 1}`}
                >
                  {letter}
                </button>
              ))
            )}
          </div>

          <div className="min-w-[180px]">
            <h3 className="text-white font-medium mb-2">Words to find</h3>
            <ul className="flex flex-wrap gap-2">
              {words.map((word) => (
                <li
                  key={word}
                  className={
                    isWordFound(word)
                      ? 'text-green-400 line-through'
                      : 'text-slate-400'
                  }
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
