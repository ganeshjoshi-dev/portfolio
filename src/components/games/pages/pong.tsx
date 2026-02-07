'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const W = 400;
const H = 500;
const PADDLE_W = 80;
const PADDLE_H = 12;
const BALL_R = 8;
const PADDLE_SPEED = 6;
const PADDLE_Y_PLAYER = H - PADDLE_H - 20;
const PADDLE_Y_CPU = 20;
const WIN_SCORE = 11;

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { ballSpeed: number; cpuMultiplier: number }
> = {
  easy: { ballSpeed: 4, cpuMultiplier: 0.6 },
  medium: { ballSpeed: 5, cpuMultiplier: 0.85 },
  hard: { ballSpeed: 6.5, cpuMultiplier: 1.1 },
};

export default function PongPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerPaddleX, setPlayerPaddleX] = useState((W - PADDLE_W) / 2);
  const [cpuPaddleX, setCpuPaddleX] = useState((W - PADDLE_W) / 2);
  const ballSpeed = DIFFICULTY_CONFIG[difficulty].ballSpeed;
  const cpuMultiplier = DIFFICULTY_CONFIG[difficulty].cpuMultiplier;
  const [ball, setBall] = useState({
    x: W / 2,
    y: H / 2,
    dx: ballSpeed * 0.7,
    dy: -ballSpeed * 0.7,
  });
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const keysRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const ballRef = useRef(ball);
  const playerPaddleRef = useRef(playerPaddleX);
  const cpuPaddleRef = useRef(cpuPaddleX);
  const pointerDownRef = useRef(false);
  ballRef.current = ball;
  playerPaddleRef.current = playerPaddleX;
  cpuPaddleRef.current = cpuPaddleX;

  const reset = useCallback(() => {
    const speed = DIFFICULTY_CONFIG[difficulty].ballSpeed;
    setPlayerPaddleX((W - PADDLE_W) / 2);
    setCpuPaddleX((W - PADDLE_W) / 2);
    setBall({
      x: W / 2,
      y: H / 2,
      dx: speed * 0.7,
      dy: -speed * 0.7,
    });
    setPlayerScore(0);
    setCpuScore(0);
    setGameOver(false);
    setWinner(null);
    setIsPlaying(true);
  }, [difficulty]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const loop = () => {
      const px = playerPaddleRef.current;
      const cx = cpuPaddleRef.current;
      const b = ballRef.current;

      let newPx = px;
      if (keysRef.current.left) newPx = Math.max(0, px - PADDLE_SPEED);
      if (keysRef.current.right)
        newPx = Math.min(W - PADDLE_W, px + PADDLE_SPEED);
      playerPaddleRef.current = newPx;
      setPlayerPaddleX(newPx);

      const cpuCenter = cx + PADDLE_W / 2;
      const targetX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, b.x));
      let newCx = cx;
      if (cpuCenter < targetX - 4) newCx = Math.min(W - PADDLE_W, cx + PADDLE_SPEED * cpuMultiplier);
      else if (cpuCenter > targetX + 4) newCx = Math.max(0, cx - PADDLE_SPEED * cpuMultiplier);
      cpuPaddleRef.current = newCx;
      setCpuPaddleX(newCx);

      const nx = b.x + b.dx;
      const ny = b.y + b.dy;
      let dx = b.dx;
      let dy = b.dy;

      if (nx - BALL_R <= 0 || nx + BALL_R >= W) dx = -dx;
      if (ny - BALL_R <= PADDLE_Y_CPU + PADDLE_H) {
        if (
          nx + BALL_R >= newCx &&
          nx - BALL_R <= newCx + PADDLE_W
        ) {
          dy = Math.abs(dy);
          const hitPos = (nx - newCx) / PADDLE_W;
          dx = (hitPos - 0.5) * 2 * ballSpeed;
        } else {
          setPlayerScore((s) => {
            const next = s + 1;
            if (next >= WIN_SCORE) {
              setGameOver(true);
              setWinner('player');
            }
            return next;
          });
          setBall({
            x: W / 2,
            y: H / 2,
            dx: ballSpeed * 0.7,
            dy: ballSpeed * 0.7,
          });
          ballRef.current = { x: W / 2, y: H / 2, dx: ballSpeed * 0.7, dy: ballSpeed * 0.7 };
          return;
        }
      }
      if (ny + BALL_R >= PADDLE_Y_PLAYER) {
        if (
          nx + BALL_R >= newPx &&
          nx - BALL_R <= newPx + PADDLE_W
        ) {
          dy = -Math.abs(dy);
          const hitPos = (nx - newPx) / PADDLE_W;
          dx = (hitPos - 0.5) * 2 * ballSpeed;
        } else {
          setCpuScore((s) => {
            const next = s + 1;
            if (next >= WIN_SCORE) {
              setGameOver(true);
              setWinner('cpu');
            }
            return next;
          });
          setBall({
            x: W / 2,
            y: H / 2,
            dx: ballSpeed * 0.7,
            dy: -ballSpeed * 0.7,
          });
          ballRef.current = { x: W / 2, y: H / 2, dx: ballSpeed * 0.7, dy: -ballSpeed * 0.7 };
          return;
        }
      }

      const newBall = { x: nx, y: ny, dx, dy };
      ballRef.current = newBall;
      setBall(newBall);
    };

    const interval = setInterval(loop, 1000 / 60);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, ballSpeed, cpuMultiplier]);

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
      const scaleX = W / rect.width;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const newPx = Math.max(
        0,
        Math.min(W - PADDLE_W, canvasX - PADDLE_W / 2)
      );
      playerPaddleRef.current = newPx;
      setPlayerPaddleX(newPx);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!canvasRef.current) return;
      pointerDownRef.current = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = W / rect.width;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const newPx = Math.max(
        0,
        Math.min(W - PADDLE_W, canvasX - PADDLE_W / 2)
      );
      playerPaddleRef.current = newPx;
      setPlayerPaddleX(newPx);
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    pointerDownRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, H / 2 - 1, W, 2);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(playerPaddleX, PADDLE_Y_PLAYER, PADDLE_W, PADDLE_H);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cpuPaddleX, PADDLE_Y_CPU, PADDLE_W, PADDLE_H);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  }, [ball, playerPaddleX, cpuPaddleX]);

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
          <p className="text-slate-400 text-sm sm:text-base">
            {gameOver
              ? winner === 'player'
                ? 'You win!'
                : 'CPU wins!'
              : `You ${playerScore} – ${cpuScore} CPU`}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={reset}
            >
              New game
            </Button>
          </div>
        </div>

        {!isPlaying && !gameOver ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-slate-400 text-sm">Difficulty:</span>
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                    ${difficulty === d
                      ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'}
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-center">Use arrow keys or touch/drag to move your paddle (cyan). First to {WIN_SCORE} wins.</p>
            <Button type="button" variant="secondary" size="lg" onClick={reset}>
              Start game
            </Button>
          </div>
        ) : null}

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="max-w-full h-auto border border-slate-700/60 rounded-xl bg-slate-900/60 touch-none"
            style={{ maxHeight: 'min(500px, 85vh)' }}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            aria-label="Pong game canvas"
          />
        </div>
      </div>
    </GameLayout>
  );
}
