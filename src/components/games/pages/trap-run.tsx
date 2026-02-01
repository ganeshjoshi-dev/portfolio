'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 32;
const GRAVITY = 0.5;
const JUMP_VY = -12;
const MOVE_SPEED = 5;
const TICK_MS = 1000 / 60;
const MAX_LIVES = 3;
const TIMER_SECONDS = 180;
const SWIPE_THRESHOLD_PX = 40;

type GameMode = 'unlimited' | 'limited' | 'timer';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Spike {
  type: 'spike';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Collapse {
  type: 'collapse';
  x: number;
  y: number;
  width: number;
  height: number;
  delayMs?: number;
}

interface Saw {
  type: 'saw';
  x: number;
  y: number;
  width: number;
  height: number;
  axis: 'x' | 'y';
  range: number;
  speed?: number;
}

type Hazard = Spike | Collapse | Saw;

interface Level {
  spawn: { x: number; y: number };
  exit: Rect;
  platforms: Rect[];
  hazards: Hazard[];
}

function aabbOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

const LEVELS: Level[] = [
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 200, y: CANVAS_HEIGHT - 120, width: 120, height: 20 },
    ],
    hazards: [],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 120, y: CANVAS_HEIGHT - 140, width: 80, height: 20 },
      { x: 260, y: CANVAS_HEIGHT - 180, width: 100, height: 20 },
    ],
    hazards: [
      { type: 'spike', x: 200, y: CANVAS_HEIGHT - 60, width: 80, height: 20 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 260, y: CANVAS_HEIGHT - 160, width: 100, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 80, y: CANVAS_HEIGHT - 60, width: 100, height: 20 },
      { type: 'collapse', x: 100, y: CANVAS_HEIGHT - 160, width: 100, height: 16, delayMs: 400 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 80, y: CANVAS_HEIGHT - 140, width: 60, height: 16 },
      { x: 200, y: CANVAS_HEIGHT - 200, width: 120, height: 16 },
      { x: 320, y: CANVAS_HEIGHT - 140, width: 60, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 150, y: CANVAS_HEIGHT - 60, width: 80, height: 20 },
      { type: 'saw', x: 170, y: CANVAS_HEIGHT - 180, width: 32, height: 32, axis: 'x', range: 40, speed: 2 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 60, y: CANVAS_HEIGHT - 120, width: 100, height: 16 },
      { x: 200, y: CANVAS_HEIGHT - 180, width: 100, height: 16 },
      { x: 310, y: CANVAS_HEIGHT - 120, width: 70, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 120, y: CANVAS_HEIGHT - 68, width: 160, height: 28 },
      { type: 'saw', x: 195, y: CANVAS_HEIGHT - 200, width: 28, height: 28, axis: 'y', range: 22, speed: 1.6 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 230, y: CANVAS_HEIGHT - 200, width: 100, height: 16 },
      { x: 230, y: CANVAS_HEIGHT - 260, width: 100, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 200, y: CANVAS_HEIGHT - 60, width: 30, height: 20 },
      { type: 'collapse', x: 100, y: CANVAS_HEIGHT - 140, width: 100, height: 16, delayMs: 750 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 250, y: CANVAS_HEIGHT - 160, width: 70, height: 16 },
    ],
    hazards: [
      { type: 'collapse', x: 80, y: CANVAS_HEIGHT - 160, width: 70, height: 16, delayMs: 500 },
      { type: 'saw', x: 165, y: CANVAS_HEIGHT - 200, width: 36, height: 36, axis: 'x', range: 50, speed: 1.8 },
      { type: 'spike', x: 150, y: CANVAS_HEIGHT - 60, width: 100, height: 20 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 50, y: CANVAS_HEIGHT - 120, width: 60, height: 16 },
      { x: 290, y: CANVAS_HEIGHT - 120, width: 60, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 110, y: CANVAS_HEIGHT - 60, width: 80, height: 20 },
      { type: 'spike', x: 210, y: CANVAS_HEIGHT - 60, width: 80, height: 20 },
      { type: 'collapse', x: 150, y: CANVAS_HEIGHT - 180, width: 60, height: 16, delayMs: 350 },
      { type: 'saw', x: 200, y: CANVAS_HEIGHT - 220, width: 30, height: 30, axis: 'y', range: 25, speed: 3 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 40, y: CANVAS_HEIGHT - 160, width: 80, height: 16 },
      { x: 160, y: CANVAS_HEIGHT - 240, width: 80, height: 16 },
      { x: 340, y: CANVAS_HEIGHT - 160, width: 60, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 120, y: CANVAS_HEIGHT - 56, width: 160, height: 16 },
      { type: 'saw', x: 140, y: CANVAS_HEIGHT - 260, width: 28, height: 28, axis: 'x', range: 35, speed: 2.2 },
      { type: 'collapse', x: 260, y: CANVAS_HEIGHT - 160, width: 80, height: 16, delayMs: 400 },
    ],
  },
  {
    spawn: { x: 40, y: CANVAS_HEIGHT - 80 },
    exit: { x: CANVAS_WIDTH - 80, y: CANVAS_HEIGHT - 100, width: 48, height: 60 },
    platforms: [
      { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 },
      { x: 80, y: CANVAS_HEIGHT - 120, width: 60, height: 16 },
      { x: 250, y: CANVAS_HEIGHT - 200, width: 70, height: 16 },
      { x: 320, y: CANVAS_HEIGHT - 120, width: 50, height: 16 },
    ],
    hazards: [
      { type: 'spike', x: 140, y: CANVAS_HEIGHT - 56, width: 120, height: 16 },
      { type: 'saw', x: 195, y: CANVAS_HEIGHT - 220, width: 32, height: 32, axis: 'y', range: 28, speed: 2.5 },
      { type: 'saw', x: 260, y: CANVAS_HEIGHT - 220, width: 28, height: 28, axis: 'y', range: 24, speed: 1.8 },
      { type: 'collapse', x: 180, y: CANVAS_HEIGHT - 200, width: 70, height: 16, delayMs: 600 },
    ],
  },
];

export default function TrapRunPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [player, setPlayer] = useState({ x: 0, y: 0, vx: 0, vy: 0, grounded: false });
  const [won, setWon] = useState(false);
  const [deathCount, setDeathCount] = useState(0);
  const [collapseTriggeredAt, setCollapseTriggeredAt] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('unlimited');
  const [gameOver, setGameOver] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(TIMER_SECONDS);

  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });
  const playerRef = useRef(player);
  const levelIndexRef = useRef(levelIndex);
  const collapseRef = useRef(collapseTriggeredAt);
  const gameModeRef = useRef(gameMode);
  const deathCountRef = useRef(deathCount);
  const gameOverRef = useRef(gameOver);
  const gameStartTimeRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  playerRef.current = player;
  levelIndexRef.current = levelIndex;
  collapseRef.current = collapseTriggeredAt;
  gameModeRef.current = gameMode;
  deathCountRef.current = deathCount;
  gameOverRef.current = gameOver;

  const resetToSpawn = useCallback(() => {
    const lvl = LEVELS[levelIndexRef.current];
    setPlayer({
      x: lvl.spawn.x,
      y: lvl.spawn.y,
      vx: 0,
      vy: 0,
      grounded: false,
    });
    setCollapseTriggeredAt((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${levelIndexRef.current}-`)) delete next[key];
      });
      return next;
    });
  }, []);

  const startOrPlayAgain = useCallback(() => {
    gameOverRef.current = false;
    setLevelIndex(0);
    setDeathCount(0);
    setWon(false);
    setGameOver(false);
    setCollapseTriggeredAt({});
    setRemainingSeconds(TIMER_SECONDS);
    if (gameModeRef.current === 'timer') gameStartTimeRef.current = Date.now();
    const lvl = LEVELS[0];
    setPlayer({
      x: lvl.spawn.x,
      y: lvl.spawn.y,
      vx: 0,
      vy: 0,
      grounded: false,
    });
    setIsPlaying(true);
  }, []);

  const handleRestart = useCallback(() => {
    gameOverRef.current = false;
    setLevelIndex(0);
    setDeathCount(0);
    setWon(false);
    setGameOver(false);
    setCollapseTriggeredAt({});
    setRemainingSeconds(TIMER_SECONDS);
    if (gameModeRef.current === 'timer') gameStartTimeRef.current = Date.now();
    const lvl = LEVELS[0];
    setPlayer({
      x: lvl.spawn.x,
      y: lvl.spawn.y,
      vx: 0,
      vy: 0,
      grounded: false,
    });
    setIsPlaying(true);
  }, []);

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
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        keysRef.current.jump = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp') keysRef.current.jump = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const setKeyFromTouch = useCallback((key: 'left' | 'right' | 'jump', value: boolean) => {
    keysRef.current[key] = value;
  }, []);

  const clearGestureKeys = useCallback(() => {
    keysRef.current.left = false;
    keysRef.current.right = false;
    keysRef.current.jump = false;
  }, []);

  const handleGestureTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 0) return;
    e.preventDefault();
    const t = e.changedTouches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleGestureTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    e.preventDefault();
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx >= SWIPE_THRESHOLD_PX && absDx >= absDy) {
      keysRef.current.left = dx < 0;
      keysRef.current.right = dx > 0;
    }
    if (absDy >= SWIPE_THRESHOLD_PX && dy < 0) {
      keysRef.current.jump = true;
    }
  }, []);

  const handleGestureTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 0) return;
    e.preventDefault();
    touchStartRef.current = null;
    clearGestureKeys();
  }, [clearGestureKeys]);

  useEffect(() => {
    if (!isPlaying || won || gameOver || gameMode !== 'timer') return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(TIMER_SECONDS - elapsed));
      setRemainingSeconds(remaining);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, won, gameOver, gameMode]);

  useEffect(() => {
    if (!isPlaying || won || gameOver) return;

    const loop = () => {
      if (gameOverRef.current) return;
      if (gameModeRef.current === 'timer') {
        const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
        if (elapsed >= TIMER_SECONDS) {
          setGameOver(true);
          setIsPlaying(false);
          gameOverRef.current = true;
          setRemainingSeconds(0);
          setTick((t) => t + 1);
          return;
        }
      }
      const idx = levelIndexRef.current;
      const lvl = LEVELS[idx];
      const p = playerRef.current;
      const now = Date.now() / 1000;
      const collapseState = collapseRef.current;

      let vx = p.vx;
      let vy = p.vy;
      if (keysRef.current.left) vx = -MOVE_SPEED;
      else if (keysRef.current.right) vx = MOVE_SPEED;
      else vx = 0;
      if (keysRef.current.jump && p.grounded) vy = JUMP_VY;
      vy += GRAVITY;

      let nx = p.x + vx;
      let ny = p.y + vy;

      const platforms: Rect[] = [...lvl.platforms];
      lvl.hazards.forEach((h, hi) => {
        if (h.type === 'collapse') {
          const key = `${idx}-${hi}`;
          const triggered = collapseState[key];
          if (triggered !== undefined) {
            if (now * 1000 - triggered >= (h.delayMs ?? 500)) return;
          }
          platforms.push({ x: h.x, y: h.y, width: h.width, height: h.height });
        }
      });

      let grounded = false;
      for (const pl of platforms) {
        if (p.x + PLAYER_WIDTH <= pl.x || p.x >= pl.x + pl.width) continue;
        if (p.vy >= 0 && p.y + PLAYER_HEIGHT <= pl.y + 8 && ny + PLAYER_HEIGHT >= pl.y) {
          ny = pl.y - PLAYER_HEIGHT;
          vy = 0;
          grounded = true;
          break;
        }
        if (p.vy < 0 && p.y >= pl.y + pl.height && ny <= pl.y + pl.height) {
          ny = pl.y + pl.height;
          vy = 0;
          break;
        }
      }
      if (!grounded) {
        for (const pl of platforms) {
          if (ny + PLAYER_HEIGHT <= pl.y || ny >= pl.y + pl.height) continue;
          if (p.x + PLAYER_WIDTH <= pl.x && nx + PLAYER_WIDTH > pl.x) {
            nx = pl.x - PLAYER_WIDTH;
            vx = 0;
          } else if (p.x >= pl.x + pl.width && nx < pl.x + pl.width) {
            nx = pl.x + pl.width;
            vx = 0;
          }
        }
      }

      nx = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, nx));
      if (ny > CANVAS_HEIGHT) {
        const wouldBeDeaths = deathCountRef.current + 1;
        if (gameModeRef.current === 'limited' && wouldBeDeaths >= MAX_LIVES) {
          setDeathCount((c) => c + 1);
          setGameOver(true);
          setIsPlaying(false);
          gameOverRef.current = true;
          setTick((t) => t + 1);
          return;
        }
        setDeathCount((c) => c + 1);
        resetToSpawn();
        setTick((t) => t + 1);
        return;
      }

      for (const h of lvl.hazards) {
        if (h.type === 'spike') {
          if (aabbOverlap(nx, ny, PLAYER_WIDTH, PLAYER_HEIGHT, h.x, h.y, h.width, h.height)) {
            const wouldBeDeaths = deathCountRef.current + 1;
            if (gameModeRef.current === 'limited' && wouldBeDeaths >= MAX_LIVES) {
              setDeathCount((c) => c + 1);
              setGameOver(true);
              setIsPlaying(false);
              gameOverRef.current = true;
              setTick((t) => t + 1);
              return;
            }
            setDeathCount((c) => c + 1);
            resetToSpawn();
            setTick((t) => t + 1);
            return;
          }
        } else if (h.type === 'collapse') {
          const hi = lvl.hazards.indexOf(h);
          const key = `${idx}-${hi}`;
          if (collapseState[key] === undefined) {
            const pad = 4;
            const onPlatform =
              ny + PLAYER_HEIGHT >= h.y - pad &&
              ny + PLAYER_HEIGHT <= h.y + h.height + pad &&
              nx < h.x + h.width &&
              nx + PLAYER_WIDTH > h.x;
            if (
              aabbOverlap(nx, ny, PLAYER_WIDTH, PLAYER_HEIGHT, h.x, h.y, h.width, h.height) ||
              onPlatform
            ) {
              setCollapseTriggeredAt((prev) => ({ ...prev, [key]: now * 1000 }));
            }
          }
        } else if (h.type === 'saw') {
          const speed = h.speed ?? 2;
          const r = h.range ?? 30;
          const t = now * speed;
          const sx = h.axis === 'x' ? h.x + r * Math.sin(t) : h.x;
          const sy = h.axis === 'y' ? h.y + r * Math.sin(t) : h.y;
          if (aabbOverlap(nx, ny, PLAYER_WIDTH, PLAYER_HEIGHT, sx, sy, h.width, h.height)) {
            const wouldBeDeaths = deathCountRef.current + 1;
            if (gameModeRef.current === 'limited' && wouldBeDeaths >= MAX_LIVES) {
              setDeathCount((c) => c + 1);
              setGameOver(true);
              setIsPlaying(false);
              gameOverRef.current = true;
              setTick((t) => t + 1);
              return;
            }
            setDeathCount((c) => c + 1);
            resetToSpawn();
            setTick((t) => t + 1);
            return;
          }
        }
      }

      if (aabbOverlap(nx, ny, PLAYER_WIDTH, PLAYER_HEIGHT, lvl.exit.x, lvl.exit.y, lvl.exit.width, lvl.exit.height)) {
        if (idx + 1 >= LEVELS.length) {
          setWon(true);
          setIsPlaying(false);
        } else {
          levelIndexRef.current = idx + 1;
          setLevelIndex(idx + 1);
          const nextLvl = LEVELS[idx + 1];
          setPlayer({
            x: nextLvl.spawn.x,
            y: nextLvl.spawn.y,
            vx: 0,
            vy: 0,
            grounded: false,
          });
        }
        setTick((t) => t + 1);
        return;
      }

      setPlayer({ x: nx, y: ny, vx, vy, grounded });
      setTick((t) => t + 1);
    };

    const interval = setInterval(loop, TICK_MS);
    return () => clearInterval(interval);
  }, [isPlaying, won, gameOver, resetToSpawn]);

  useEffect(() => {
    levelIndexRef.current = levelIndex;
  }, [levelIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const draw = () => {
      const inPlay = isPlaying && !won;
      const showCurrent = inPlay || gameOver;
      const idx = showCurrent ? levelIndexRef.current : 0;
      const lvl = LEVELS[idx];
      const p =
        showCurrent
          ? playerRef.current
          : { x: lvl.spawn.x, y: lvl.spawn.y, vx: 0, vy: 0, grounded: false };
      const now = Date.now() / 1000;
      const collapseState = showCurrent ? collapseRef.current : {};

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      for (const pl of lvl.platforms) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(pl.x, pl.y, pl.width, pl.height);
        ctx.strokeStyle = '#64748b';
        ctx.strokeRect(pl.x, pl.y, pl.width, pl.height);
      }

      lvl.hazards.forEach((h, hi) => {
        if (h.type === 'collapse') {
          const key = `${idx}-${hi}`;
          const triggered = collapseState[key];
          if (triggered !== undefined && now * 1000 - triggered >= (h.delayMs ?? 500)) return;
          ctx.fillStyle = '#eab308';
          ctx.globalAlpha = triggered !== undefined ? 1 - (now * 1000 - triggered) / (h.delayMs ?? 500) : 1;
          ctx.fillRect(h.x, h.y, h.width, h.height);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#ca8a04';
          ctx.strokeRect(h.x, h.y, h.width, h.height);
          return;
        }
        if (h.type === 'spike') {
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 1;
          const count = Math.max(1, Math.floor(h.width / 12));
          const step = h.width / count;
          for (let i = 0; i < count; i++) {
            const x1 = h.x + i * step;
            const x2 = h.x + (i + 1) * step;
            ctx.beginPath();
            ctx.moveTo((x1 + x2) / 2, h.y);
            ctx.lineTo(x1, h.y + h.height);
            ctx.lineTo(x2, h.y + h.height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
          return;
        }
        if (h.type === 'saw') {
          const speed = h.speed ?? 2;
          const r = h.range ?? 30;
          const sx = h.axis === 'x' ? h.x + r * Math.sin(now * speed) : h.x;
          const sy = h.axis === 'y' ? h.y + r * Math.sin(now * speed) : h.y;
          const cx = sx + h.width / 2;
          const cy = sy + h.height / 2;
          const facing = (h.axis === 'x' ? Math.cos(now * speed) : 1) >= 0 ? 1 : -1;
          const wingFlap = Math.sin(now * speed * 3) * 0.3 + 0.7;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(facing, 1);

          // Body (ellipse)
          ctx.fillStyle = '#64748b';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, h.width * 0.32, h.height * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Wing (curved, slight flap)
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.ellipse(-h.width * 0.15, -h.height * 0.1 * wingFlap, h.width * 0.25, h.height * 0.35 * wingFlap, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#64748b';
          ctx.stroke();

          // Head
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(h.width * 0.35, -h.height * 0.15, h.width * 0.22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Beak
          ctx.fillStyle = '#f59e0b';
          ctx.strokeStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(h.width * 0.5, -h.height * 0.15);
          ctx.lineTo(h.width * 0.52 + 4, -h.height * 0.15);
          ctx.lineTo(h.width * 0.5, -h.height * 0.08);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Eye
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(h.width * 0.4, -h.height * 0.18, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });

      // Draw exit door (frame, panel, handle, arch)
      const ex = lvl.exit.x;
      const ey = lvl.exit.y;
      const ew = lvl.exit.width;
      const eh = lvl.exit.height;
      const frameInset = 3;
      const archH = 10;

      // Shadow / depth behind door
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(ex + 3, ey + 3, ew, eh);

      // Frame (arch + sides)
      ctx.fillStyle = '#0e7490';
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ex, ey + archH);
      ctx.lineTo(ex, ey + eh);
      ctx.lineTo(ex + ew, ey + eh);
      ctx.lineTo(ex + ew, ey + archH);
      ctx.quadraticCurveTo(ex + ew / 2, ey - 2, ex, ey + archH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Door panel (gradient for depth, below the arch)
      const panelY = ey + archH;
      const panelW = ew - frameInset * 2;
      const panelH = eh - archH - frameInset;
      const grad = ctx.createLinearGradient(ex, panelY, ex + ew, panelY + panelH);
      grad.addColorStop(0, '#22d3ee');
      grad.addColorStop(0.4, '#06b6d4');
      grad.addColorStop(1, '#0891b2');
      ctx.fillStyle = grad;
      ctx.fillRect(ex + frameInset, panelY, panelW, panelH);

      // Inner frame stroke
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1;
      ctx.strokeRect(ex + frameInset, panelY, panelW, panelH);

      // Door handle
      const hx = ex + ew - 10;
      const hy = ey + eh / 2 - 4;
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hx, hy, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();

      // Small highlight on arch
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ex + ew / 2, ey + 4, ew / 2 - 4, Math.PI * 0.85, Math.PI * 1.15);
      ctx.stroke();

      // Draw player as a simple runner (head, body, limbs) inside the same hitbox
      const px = p.x;
      const py = p.y;
      const facing = p.vx >= 0 ? 1 : -1;
      const isAirborne = !p.grounded;
      const isMoving = p.vx !== 0;
      const runPhase = isMoving ? (now * 12) % (Math.PI * 2) : 0;
      const legSwing = isMoving ? Math.sin(runPhase) * (isAirborne ? 0.2 : 0.6) : 0;

      ctx.save();
      ctx.translate(px + PLAYER_WIDTH / 2, py);

      // Legs (behind body when drawn first)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4 * facing, 20);
      ctx.lineTo(-4 * facing - legSwing * 6 * facing, 32);
      ctx.moveTo(4 * facing, 20);
      ctx.lineTo(4 * facing + legSwing * 6 * facing, 32);
      ctx.stroke();

      // Body (torso)
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      roundRect(ctx, -6, 8, 12, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Arms (swing when moving; spread when jumping; idle when standing)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (isAirborne) {
        ctx.moveTo(-5, 12);
        ctx.lineTo(-9 * facing, 8);
        ctx.moveTo(5, 12);
        ctx.lineTo(9 * facing, 8);
      } else if (isMoving) {
        ctx.moveTo(-5, 12);
        ctx.lineTo(-8 * facing - legSwing * 4 * facing, 10);
        ctx.moveTo(5, 12);
        ctx.lineTo(8 * facing + legSwing * 4 * facing, 10);
      } else {
        ctx.moveTo(-5, 12);
        ctx.lineTo(-6 * facing, 18);
        ctx.moveTo(5, 12);
        ctx.lineTo(6 * facing, 18);
      }
      ctx.stroke();

      // Head
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Two eyes (left and right of center, facing direction)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(-2 * facing, 3, 1.5, 0, Math.PI * 2);
      ctx.arc(2 * facing, 3, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    function roundRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    if (isPlaying && !won && !gameOver) {
      let rafId: number;
      const loop = () => {
        draw();
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    draw();
  }, [isPlaying, won, gameOver, levelIndex]);

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
            Level: <span className="text-cyan-300 font-medium">{levelIndex + 1}</span>
            <span className="mx-3 text-slate-600">|</span>
            {gameMode === 'limited' ? (
              <>Lives: <span className="text-amber-300 font-medium">{Math.max(0, MAX_LIVES - deathCount)}</span></>
            ) : gameMode === 'timer' && isPlaying ? (
              <>Time: <span className="text-amber-300 font-medium">{Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}</span></>
            ) : (
              <>Deaths: <span className="text-amber-300 font-medium">{deathCount}</span></>
            )}
            {won && (
              <span className="ml-3 text-emerald-400 font-medium">You win!</span>
            )}
            {gameOver && (
              <span className="ml-3 text-red-400 font-medium">Game over</span>
            )}
          </p>
          {!isPlaying && !won && !gameOver && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-slate-500 text-sm">Mode:</span>
              <div className="flex rounded-lg border border-slate-600/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setGameMode('unlimited')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${gameMode === 'unlimited' ? 'bg-cyan-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'}`}
                >
                  Endless
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('limited')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${gameMode === 'limited' ? 'bg-cyan-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'}`}
                >
                  3 Lives
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('timer')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${gameMode === 'timer' ? 'bg-cyan-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'}`}
                >
                  Timer (3:00)
                </button>
              </div>
              <Button type="button" variant="secondary" size="md" onClick={startOrPlayAgain}>
                Start
              </Button>
            </div>
          )}
          {(won || gameOver) && (
            <Button type="button" variant="secondary" size="md" onClick={handleRestart}>
              Restart
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full px-1 sm:px-0 min-w-0">
          <div className="relative w-full max-w-[min(400px,100vw-1.5rem)] touch-none select-none" style={{ touchAction: 'none' }}>
            <div
              className="relative rounded-lg overflow-hidden border-2 border-slate-700/60"
              style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
              onTouchStart={handleGestureTouchStart}
              onTouchMove={handleGestureTouchMove}
              onTouchEnd={handleGestureTouchEnd}
              onTouchCancel={handleGestureTouchEnd}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="block w-full h-full bg-slate-900/80"
                style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
                aria-label="Trap Run platformer. Swipe left/right on the game area to move, swipe up to jump. Or use arrow keys and Space, or the buttons below."
              />
            </div>
            <div
              className="flex items-center justify-center gap-4 sm:gap-6 mt-3 md:hidden [@media(pointer:coarse)]:!flex"
              aria-label="On-screen controls"
            >
              <button
                type="button"
                className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-700/80 border-2 border-slate-600 active:bg-cyan-600/80 active:border-cyan-500 flex items-center justify-center text-slate-300 active:text-white select-none touch-none"
                onPointerDown={(e) => { e.preventDefault(); setKeyFromTouch('left', true); }}
                onPointerUp={(e) => { e.preventDefault(); setKeyFromTouch('left', false); }}
                onPointerLeave={(e) => { e.preventDefault(); setKeyFromTouch('left', false); }}
                onPointerCancel={(e) => { e.preventDefault(); setKeyFromTouch('left', false); }}
                onContextMenu={(e) => e.preventDefault()}
                aria-label="Move left"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                type="button"
                className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-amber-600/90 border-2 border-amber-500 active:bg-amber-500 active:border-amber-400 flex items-center justify-center text-amber-100 font-bold text-lg select-none touch-none"
                onPointerDown={(e) => { e.preventDefault(); setKeyFromTouch('jump', true); }}
                onPointerUp={(e) => { e.preventDefault(); setKeyFromTouch('jump', false); }}
                onPointerLeave={(e) => { e.preventDefault(); setKeyFromTouch('jump', false); }}
                onPointerCancel={(e) => { e.preventDefault(); setKeyFromTouch('jump', false); }}
                onContextMenu={(e) => e.preventDefault()}
                aria-label="Jump"
              >
                ↑
              </button>
              <button
                type="button"
                className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-700/80 border-2 border-slate-600 active:bg-cyan-600/80 active:border-cyan-500 flex items-center justify-center text-slate-300 active:text-white select-none touch-none"
                onPointerDown={(e) => { e.preventDefault(); setKeyFromTouch('right', true); }}
                onPointerUp={(e) => { e.preventDefault(); setKeyFromTouch('right', false); }}
                onPointerLeave={(e) => { e.preventDefault(); setKeyFromTouch('right', false); }}
                onPointerCancel={(e) => { e.preventDefault(); setKeyFromTouch('right', false); }}
                onContextMenu={(e) => e.preventDefault()}
                aria-label="Move right"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center">
            <span className="hidden sm:inline">Arrow keys to move, Space to jump.</span>
            <span className="sm:hidden">Swipe on the game area (left/right = move, up = jump) or use the buttons below.</span>
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
