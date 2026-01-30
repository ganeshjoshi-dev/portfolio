'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

type CellValue = 'X' | 'O' | null;
type Board = CellValue[];

const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board: Board): CellValue {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

/** Returns the three cell indices that form the winning line, or null. */
function getWinningLine(board: Board): [number, number, number] | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return [a, b, c];
  }
  return null;
}

/** SVG line endpoints for each winning line (viewBox 0 0 100 100), through cell centers. */
const WIN_LINE_COORDS: Record<
  string,
  { x1: number; y1: number; x2: number; y2: number; length: number }
> = (() => {
  const raw: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {
    '0,1,2': { x1: 17, y1: 17, x2: 83, y2: 17 },
    '3,4,5': { x1: 17, y1: 50, x2: 83, y2: 50 },
    '6,7,8': { x1: 17, y1: 83, x2: 83, y2: 83 },
    '0,3,6': { x1: 17, y1: 17, x2: 17, y2: 83 },
    '1,4,7': { x1: 50, y1: 17, x2: 50, y2: 83 },
    '2,5,8': { x1: 83, y1: 17, x2: 83, y2: 83 },
    '0,4,8': { x1: 17, y1: 17, x2: 83, y2: 83 },
    '2,4,6': { x1: 83, y1: 17, x2: 17, y2: 83 },
  };
  const out: Record<
    string,
    { x1: number; y1: number; x2: number; y2: number; length: number }
  > = {};
  for (const [key, { x1, y1, x2, y2 }] of Object.entries(raw)) {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    out[key] = { x1, y1, x2, y2, length };
  }
  return out;
})();

function isDraw(board: Board): boolean {
  return board.every((c) => c !== null);
}

function getBestMove(board: Board, player: 'X' | 'O'): number {
  const opponent = player === 'X' ? 'O' : 'X';
  function minimax(b: Board, isMax: boolean): number {
    const winner = getWinner(b);
    if (winner === player) return 1;
    if (winner === opponent) return -1;
    if (b.every((c) => c !== null)) return 0;
    const indices = b
      .map((_, i) => i)
      .filter((i) => b[i] === null);
    if (isMax) {
      let best = -Infinity;
      for (const i of indices) {
        const next = [...b];
        next[i] = player;
        best = Math.max(best, minimax(next, false));
      }
      return best;
    } else {
      let best = Infinity;
      for (const i of indices) {
        const next = [...b];
        next[i] = opponent;
        best = Math.min(best, minimax(next, true));
      }
      return best;
    }
  }
  const indices = board
    .map((_, i) => i)
    .filter((i) => board[i] === null);
  let bestScore = -Infinity;
  let bestIndex = indices[0] ?? 0;
  for (const i of indices) {
    const next = [...board];
    next[i] = player;
    const score = minimax(next, false);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return bestIndex;
}

export default function TicTacToePage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [board, setBoard] = useState<Board>(() => Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState<'2p' | 'ai'>('2p');
  const [gameStarted, setGameStarted] = useState(false);

  const winner = useMemo(() => getWinner(board), [board]);
  const winningLine = useMemo(() => getWinningLine(board), [board]);
  const draw = useMemo(() => isDraw(board), [board]);
  const gameOver = !!winner || draw;

  const winLineCoords = winningLine
    ? WIN_LINE_COORDS[winningLine.join(',')]
    : null;

  const makeMove = useCallback(
    (index: number) => {
      if (board[index] || winner) return;
      const next = [...board];
      next[index] = isXTurn ? 'X' : 'O';
      setBoard(next);
      setIsXTurn(!isXTurn);
    },
    [board, isXTurn, winner]
  );

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || winner) return;
      if (mode === '2p') {
        makeMove(index);
        return;
      }
      if (!isXTurn) return;
      const next = [...board];
      next[index] = 'X';
      setBoard(next);
      setIsXTurn(false);
      const w = getWinner(next);
      const hasEmpty = next.some((c) => c === null);
      if (!w && hasEmpty) {
        setTimeout(() => {
          setBoard((prev) => {
            const aiIndex = getBestMove(prev, 'O');
            const after = [...prev];
            after[aiIndex] = 'O';
            return after;
          });
          setIsXTurn(true);
        }, 300);
      }
    },
    [board, winner, mode, isXTurn, makeMove]
  );

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }, []);

  const startVsAi = useCallback(() => {
    setMode('ai');
    setGameStarted(true);
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }, []);

  const start2P = useCallback(() => {
    setMode('2p');
    setGameStarted(true);
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }, []);

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
    >
      <div className="space-y-6">
        {!gameStarted ? (
          <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0">
            <div className="text-center space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Choose how to play
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Two players on one device, or challenge the AI (unbeatable).
              </p>
            </div>
            <div
              className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full max-w-[10rem] mx-auto p-3 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-700/60"
              style={{ aspectRatio: '1' }}
              aria-hidden
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-600/60 bg-slate-800/60 min-h-0"
                  style={{ aspectRatio: '1' }}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={start2P}
                className="min-w-[10rem]"
              >
                Two players
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={startVsAi}
                className="min-w-[10rem]"
              >
                Play vs AI
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 min-w-0">
              <p className="text-slate-400 text-sm sm:text-base">
                {mode === 'ai' ? 'You are X. AI is O.' : ''}
                {gameOver
                  ? winner
                    ? `Winner: ${winner}`
                    : 'Draw!'
                  : `Turn: ${isXTurn ? 'X' : 'O'}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={reset}
                >
                  New game
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setGameStarted(false)}
                >
                  Change mode
                </Button>
              </div>
            </div>

            <div className="relative w-full max-w-xs mx-auto aspect-square min-h-0">
              <div
                className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 sm:gap-2 md:gap-3"
                role="grid"
                aria-label="Tic-tac-toe board"
              >
                {board.map((value, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    disabled={gameOver || (mode === 'ai' && !isXTurn)}
                    className="
                      flex items-center justify-center min-h-0
                      rounded-lg sm:rounded-xl border-2 text-2xl sm:text-3xl md:text-4xl font-bold
                      bg-slate-800/60 border-slate-700/60
                      hover:border-cyan-400/50 hover:bg-slate-800/80
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                      disabled:pointer-events-none disabled:opacity-90
                      transition-all duration-300
                    "
                    aria-label={`Cell ${index + 1}, ${value ?? 'empty'}`}
                  >
                    {value === 'X' && <span className="text-cyan-400">X</span>}
                    {value === 'O' && <span className="text-amber-400">O</span>}
                  </button>
                ))}
              </div>
              {winLineCoords && winner && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <line
                    x1={winLineCoords.x1}
                    y1={winLineCoords.y1}
                    x2={winLineCoords.x2}
                    y2={winLineCoords.y2}
                    stroke={winner === 'X' ? '#22d3ee' : '#fbbf24'}
                    strokeWidth={8}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.6))' }}
                  />
                </svg>
              )}
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
