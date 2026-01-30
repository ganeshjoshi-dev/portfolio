'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_GAP = 4;
const BRICK_HEIGHT = 18;
const BRICK_WIDTH =
  (CANVAS_WIDTH - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS;
const BALL_SPEED = 5;
const PADDLE_SPEED = 8;
const PADDLE_Y = CANVAS_HEIGHT - PADDLE_HEIGHT - 20;

interface Brick {
  x: number;
  y: number;
  hit: boolean;
  color: string;
}

const BRICK_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
];

function createBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        x: BRICK_GAP + col * (BRICK_WIDTH + BRICK_GAP),
        y: 60 + row * (BRICK_HEIGHT + BRICK_GAP),
        hit: false,
        color: BRICK_COLORS[row % BRICK_COLORS.length],
      });
    }
  }
  return bricks;
}

export default function BreakoutPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bricks, setBricks] = useState<Brick[]>(createBricks);
  const [paddleX, setPaddleX] = useState((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const [ball, setBall] = useState({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 80,
    dx: BALL_SPEED * 0.6,
    dy: -BALL_SPEED,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lifeLostMessage, setLifeLostMessage] = useState(false);
  const lifeLostResumeRef = useRef(0);
  const keysRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const ballRef = useRef(ball);
  const paddleXRef = useRef(paddleX);
  const bricksRef = useRef(bricks);
  const pointerDownRef = useRef(false);
  ballRef.current = ball;
  paddleXRef.current = paddleX;
  bricksRef.current = bricks;

  const reset = useCallback(() => {
    setBricks(createBricks());
    setPaddleX((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 80,
      dx: BALL_SPEED * 0.6,
      dy: -BALL_SPEED,
    });
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setLifeLostMessage(false);
    lifeLostResumeRef.current = 0;
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver || won) return;

    const loop = () => {
      const now = Date.now();
      if (now < lifeLostResumeRef.current) return;

      const px = paddleXRef.current;
      const b = ballRef.current;
      const brickList = bricksRef.current;

      let newPx = px;
      if (keysRef.current.left) newPx = Math.max(0, px - PADDLE_SPEED);
      if (keysRef.current.right)
        newPx = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, px + PADDLE_SPEED);
      paddleXRef.current = newPx;
      setPaddleX(newPx);

      const nx = b.x + b.dx;
      const ny = b.y + b.dy;
      let dx = b.dx;
      let dy = b.dy;

      if (nx - BALL_RADIUS <= 0 || nx + BALL_RADIUS >= CANVAS_WIDTH) dx = -dx;
      if (ny - BALL_RADIUS <= 0) dy = -dy;

      if (ny + BALL_RADIUS >= PADDLE_Y) {
        if (
          nx >= newPx - BALL_RADIUS &&
          nx <= newPx + PADDLE_WIDTH + BALL_RADIUS
        ) {
          dy = -Math.abs(dy);
          const hitPos = (nx - newPx) / PADDLE_WIDTH;
          dx = (hitPos - 0.5) * 2 * BALL_SPEED;
        }
      }

      let brickHit = -1;
      for (let i = 0; i < brickList.length; i++) {
        if (brickList[i].hit) continue;
        const br = brickList[i];
        if (
          nx + BALL_RADIUS >= br.x &&
          nx - BALL_RADIUS <= br.x + BRICK_WIDTH &&
          ny + BALL_RADIUS >= br.y &&
          ny - BALL_RADIUS <= br.y + BRICK_HEIGHT
        ) {
          brickHit = i;
          dy = -dy;
          break;
        }
      }

      if (ny + BALL_RADIUS > CANVAS_HEIGHT) {
        const pauseMs = 1600;
        lifeLostResumeRef.current = now + pauseMs;
        setLifeLostMessage(true);
        setTimeout(() => setLifeLostMessage(false), pauseMs);
        setLives((l) => {
          if (l <= 1) setGameOver(true);
          return l - 1;
        });
        const resetBall = {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT - 80,
          dx: BALL_SPEED * 0.6,
          dy: -BALL_SPEED,
        };
        ballRef.current = resetBall;
        setBall(resetBall);
        return;
      }

      if (brickHit >= 0) {
        setScore((s) => s + 10);
        const nextBricks = brickList.map((br, j) =>
          j === brickHit ? { ...br, hit: true } : br
        );
        bricksRef.current = nextBricks;
        setBricks(nextBricks);
      }

      const newBall = { x: nx, y: ny, dx, dy };
      ballRef.current = newBall;
      setBall(newBall);
    };

    const interval = setInterval(loop, 1000 / 60);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, won]);

  useEffect(() => {
    if (!isPlaying) return;
    const remaining = bricks.filter((b) => !b.hit).length;
    if (remaining === 0) setWon(true);
  }, [bricks, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        keysRef.current.right = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDownRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const newPx = Math.max(
        0,
        Math.min(CANVAS_WIDTH - PADDLE_WIDTH, canvasX - PADDLE_WIDTH / 2)
      );
      paddleXRef.current = newPx;
      setPaddleX(newPx);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!canvasRef.current) return;
      pointerDownRef.current = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const newPx = Math.max(
        0,
        Math.min(CANVAS_WIDTH - PADDLE_WIDTH, canvasX - PADDLE_WIDTH / 2)
      );
      paddleXRef.current = newPx;
      setPaddleX(newPx);
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    pointerDownRef.current = false;
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver || won) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const draw = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      bricks.forEach((br) => {
        if (br.hit) return;
        ctx.fillStyle = br.color;
        ctx.fillRect(br.x, br.y, BRICK_WIDTH, BRICK_HEIGHT);
      });

      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();

      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, gameOver, won, bricks, paddleX, ball]);

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
            <span className="mx-3 text-slate-600">|</span>
            Lives: <span className="text-amber-300 font-medium">{lives}</span>
            {gameOver && (
              <span className="ml-3 text-red-400 font-medium">Game over</span>
            )}
            {won && (
              <span className="ml-3 text-emerald-400 font-medium">You won!</span>
            )}
          </p>
          {!isPlaying && (
            <Button type="button" variant="secondary" size="md" onClick={reset}>
              Start game
            </Button>
          )}
          {(gameOver || won) && (
            <Button type="button" variant="secondary" size="md" onClick={reset}>
              Play again
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full px-1 sm:px-0 min-w-0">
          <div className="relative w-full max-w-full sm:max-w-[400px] touch-none">
            <div
              className="relative rounded-lg overflow-hidden border-2 border-slate-700/60"
              style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="block w-full h-full bg-slate-900/80"
                style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
                aria-label="Breakout game. Drag or use arrow keys to move the paddle."
              />
              {lifeLostMessage && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center px-4 animate-fade-in"
                  role="alert"
                  aria-live="polite"
                >
                  <span className="text-red-400 font-bold text-xl sm:text-2xl">
                    Life lost!
                  </span>
                  <span className="text-slate-400 text-sm mt-1">–1 life</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center">
            <span className="sm:inline block">Drag on the game or use arrow keys to move the paddle.</span>
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
