'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const COLS = 20;
const ROWS = 16;
const CELL_SIZE = 16;
const INITIAL_SPEED_MS = 180;
const MIN_SPEED_MS = 80;
const SPEED_DECREMENT = 5;

type Direction = 'up' | 'down' | 'left' | 'right';

interface Point {
  x: number;
  y: number;
}

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let x: number;
  let y: number;
  do {
    x = Math.floor(Math.random() * COLS);
    y = Math.floor(Math.random() * ROWS);
  } while (occupied.has(`${x},${y}`));
  return { x, y };
}

export default function SnakePage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [snake, setSnake] = useState<Point[]>(() => [
    { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
  ]);
  // direction state drives game loop; setter used, value only for consistency
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [direction, setDirection] = useState<Direction>('right');
  const [nextDirection, setNextDirection] = useState<Direction>('right');
  const [food, setFood] = useState<Point>(() => randomFood([{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const speedMs = Math.max(
    MIN_SPEED_MS,
    INITIAL_SPEED_MS - score * SPEED_DECREMENT
  );
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    const head = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
    setSnake([head]);
    setDirection('right');
    setNextDirection('right');
    setFood(randomFood([head]));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const tick = () => {
      setDirection(() => nextDirection);
      setSnake((prev) => {
        const head = prev[0];
        const dir = nextDirection;
        let nx = head.x;
        let ny = head.y;
        if (dir === 'up') ny--;
        if (dir === 'down') ny++;
        if (dir === 'left') nx--;
        if (dir === 'right') nx++;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
          setGameOver(true);
          return prev;
        }
        const newHead = { x: nx, y: ny };
        const bodySet = new Set(prev.slice(1).map((p) => `${p.x},${p.y}`));
        if (bodySet.has(`${nx},${ny}`)) {
          setGameOver(true);
          return prev;
        }
        const ateFood = nx === food.x && ny === food.y;
        const newSnake = ateFood ? [newHead, ...prev] : [newHead, ...prev.slice(0, -1)];
        if (ateFood) {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        }
        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(tick, speedMs);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [isPlaying, gameOver, nextDirection, food, speedMs]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setNextDirection((d) => (d !== 'down' ? 'up' : d));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setNextDirection((d) => (d !== 'up' ? 'down' : d));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setNextDirection((d) => (d !== 'right' ? 'left' : d));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setNextDirection((d) => (d !== 'left' ? 'right' : d));
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

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
          </p>
          {!isPlaying && (
            <Button type="button" variant="secondary" size="md" onClick={reset}>
              Start game
            </Button>
          )}
          {isPlaying && gameOver && (
            <Button type="button" variant="secondary" size="md" onClick={reset}>
              Play again
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full px-1 sm:px-0">
          <div
            className="w-full max-w-[320px] aspect-[5/4] border-2 border-slate-700/60 rounded-lg overflow-hidden bg-slate-900/80"
            role="img"
            aria-label="Snake game board"
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${COLS * CELL_SIZE} ${ROWS * CELL_SIZE}`}
              preserveAspectRatio="xMidYMid meet"
              className="block"
            >
              {snake.map((p, i) => (
                <rect
                  key={`${p.x}-${p.y}-${i}`}
                  x={p.x * CELL_SIZE + 1}
                  y={p.y * CELL_SIZE + 1}
                  width={CELL_SIZE - 2}
                  height={CELL_SIZE - 2}
                  fill={i === 0 ? '#22d3ee' : '#0e7490'}
                  rx={2}
                />
              ))}
              <rect
                x={food.x * CELL_SIZE + 2}
                y={food.y * CELL_SIZE + 2}
                width={CELL_SIZE - 4}
                height={CELL_SIZE - 4}
                fill="#f59e0b"
                rx={2}
              />
            </svg>
          </div>
          <p className="text-sm text-slate-500 text-center">
            Use arrow keys to move. Don&apos;t hit the walls or yourself.
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
