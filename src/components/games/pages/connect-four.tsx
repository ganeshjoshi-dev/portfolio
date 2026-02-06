'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const COLS = 7;
const ROWS = 6;

type Cell = 'red' | 'yellow' | null;
type Board = Cell[][];

function createBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
}

function dropInColumn(board: Board, col: number, player: 'red' | 'yellow'): Board | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) {
      const next = board.map((row) => [...row]);
      next[r][col] = player;
      return next;
    }
  }
  return null;
}

function checkWinner(board: Board): 'red' | 'yellow' | 'draw' | null {
  const check = (r: number, c: number, dr: number, dc: number): Cell => {
    const cell = board[r]?.[c];
    if (!cell) return null;
    let count = 1;
    let nr = r + dr;
    let nc = c + dc;
    while (board[nr]?.[nc] === cell) {
      count++;
      nr += dr;
      nc += dc;
    }
    return count >= 4 ? cell : null;
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === null) continue;
      const w =
        check(r, c, 0, 1) ?? // horizontal
        check(r, c, 1, 0) ?? // vertical
        check(r, c, 1, 1) ?? // diagonal
        check(r, c, 1, -1);  // anti-diagonal
      if (w) return w;
    }
  }

  const full = board.every((row) => row.every((cell) => cell !== null));
  return full ? 'draw' : null;
}

function getEmptyCols(board: Board): number[] {
  const cols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) cols.push(c);
  }
  return cols;
}

function scorePosition(board: Board, player: 'red' | 'yellow'): number {
  let score = 0;
  const opponent: 'red' | 'yellow' = player === 'red' ? 'yellow' : 'red';

  const countLine = (cells: Cell[]): number => {
    const p = cells.filter((c) => c === player).length;
    const o = cells.filter((c) => c === opponent).length;
    const empty = cells.filter((c) => c === null).length;
    if (o > 0 && p > 0) return 0;
    if (p === 4) return 1000;
    if (p === 3 && empty === 1) return 10;
    if (p === 2 && empty === 2) return 4;
    if (o === 3 && empty === 1) return -8;
    return 0;
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += countLine([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]]);
    }
  }
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      score += countLine([
        board[r][c],
        board[r + 1][c],
        board[r + 2][c],
        board[r + 3][c],
      ]);
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += countLine([
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3],
      ]);
      score += countLine([
        board[r][c + 3],
        board[r + 1][c + 2],
        board[r + 2][c + 1],
        board[r + 3][c],
      ]);
    }
  }
  return score;
}

function getAiColumn(board: Board): number {
  const empty = getEmptyCols(board);
  if (empty.length === 0) return 0;
  let bestCol = empty[0];
  let bestScore = -Infinity;
  for (const c of empty) {
    const next = dropInColumn(board, c, 'yellow');
    if (!next) continue;
    let score = scorePosition(next, 'yellow');
    const winner = checkWinner(next);
    if (winner === 'yellow') score = 9999;
    if (winner === 'red') score = -9999;
    const redResponses = getEmptyCols(next).length;
    if (redResponses > 0) {
      let minOpp = Infinity;
      for (let c2 = 0; c2 < COLS; c2++) {
        const next2 = dropInColumn(next, c2, 'red');
        if (next2) {
          const w = checkWinner(next2);
          if (w === 'red') minOpp = -Infinity;
          else minOpp = Math.min(minOpp, scorePosition(next2, 'yellow'));
        }
      }
      if (minOpp !== Infinity) score -= minOpp * 0.5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCol = c;
    }
  }
  return bestCol;
}

export default function ConnectFourPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [board, setBoard] = useState<Board>(createBoard);
  const [mode, setMode] = useState<'2p' | 'ai'>('2p');
  const [isRedTurn, setIsRedTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const winner = useMemo(() => checkWinner(board), [board]);
  const gameOver = winner !== null;

  const makeMove = useCallback(
    (col: number) => {
      if (gameOver) return;
      const player: 'red' | 'yellow' = isRedTurn ? 'red' : 'yellow';
      const next = dropInColumn(board, col, player);
      if (!next) return;
      setBoard(next);
      const w = checkWinner(next);
      if (w) return;
      if (mode === '2p') {
        setIsRedTurn(!isRedTurn);
        return;
      }
      setIsRedTurn(false);
      const aiCol = getAiColumn(next);
      setTimeout(() => {
        setBoard((prev) => {
          const after = dropInColumn(prev, aiCol, 'yellow');
          return after ?? prev;
        });
        setIsRedTurn(true);
      }, 400);
    },
    [board, isRedTurn, gameOver, mode]
  );

  const reset = useCallback(() => {
    setBoard(createBoard());
    setIsRedTurn(true);
  }, []);

  const start2P = useCallback(() => {
    setMode('2p');
    setGameStarted(true);
    setBoard(createBoard());
    setIsRedTurn(true);
  }, []);

  const startAi = useCallback(() => {
    setMode('ai');
    setGameStarted(true);
    setBoard(createBoard());
    setIsRedTurn(true);
  }, []);

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-6 w-full min-w-0">
        {!gameStarted ? (
          <div className="w-full max-w-md mx-auto space-y-6 px-1 sm:px-0">
            <div className="text-center space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Choose how to play
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Two players on one device, or play against the computer.
              </p>
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
                onClick={startAi}
                className="min-w-[10rem]"
              >
                Play vs AI
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm md:text-base min-w-0">
                {gameOver
                  ? winner === 'draw'
                    ? "It's a draw!"
                    : `Winner: ${winner === 'red' ? 'Red' : 'Yellow'}`
                  : `Turn: ${isRedTurn ? 'Red' : 'Yellow'}`}
                {mode === 'ai' && !gameOver && ' (You are Red)'}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={reset}>
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

            <div className="flex justify-center w-full min-w-0 px-0 overflow-x-auto">
              <div
                className="inline-block p-1.5 sm:p-2 md:p-3 rounded-xl bg-slate-800/60 border-2 border-slate-700/60"
                role="grid"
                aria-label="Connect Four board"
              >
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
                  {Array.from({ length: COLS }, (_, col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => makeMove(col)}
                      disabled={gameOver || (mode === 'ai' && !isRedTurn)}
                      className="flex flex-col gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-80 transition-colors touch-manipulation min-w-[2.25rem] min-h-[3rem] sm:min-w-[2.5rem] sm:min-h-[3.5rem]"
                      aria-label={`Column ${col + 1}`}
                    >
                      {Array.from({ length: ROWS }, (_, row) => (
                        <div
                          key={`${row}-${col}`}
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-900/80 flex-shrink-0"
                          aria-hidden
                        >
                          {board[row][col] === 'red' && (
                            <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-red-500 shadow-inner" />
                          )}
                          {board[row][col] === 'yellow' && (
                            <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-amber-400 shadow-inner" />
                          )}
                        </div>
                      ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 text-center">
              Click a column to drop your disc. Get four in a row to win.
            </p>
          </>
        )}
      </div>
    </GameLayout>
  );
}
