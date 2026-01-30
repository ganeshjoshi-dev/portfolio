'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import MemorySettings, {
  MEMORY_SETTINGS_KEY,
  defaultSettings,
} from '@/components/games/memory/MemorySettings';
import { useGameTimer } from '@/hooks';
import type { MemoryGameSettings, MemoryGridSize } from '@/types/games';

const SYMBOLS = [
  '🎮', '🎯', '🌟', '🔥', '💎', '🎵', '🌈', '⭐',
  '🎪', '🎨', '🎭', '🏆', '🚀', '🛸', '⚡', '🎸',
  '🎺', '🎷', '🧩', '🎲',
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const gridConfig: Record<
  MemoryGridSize,
  { cols: number; rows: number; pairCount: number }
> = {
  '2x2': { cols: 2, rows: 2, pairCount: 2 },
  '3x2': { cols: 3, rows: 2, pairCount: 3 },
  '4x4': { cols: 4, rows: 4, pairCount: 8 },
  '4x5': { cols: 4, rows: 5, pairCount: 10 },
  '6x6': { cols: 6, rows: 6, pairCount: 18 },
};

interface CardState {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createInitialCards(settings: MemoryGameSettings): CardState[] {
  const { pairCount } = gridConfig[settings.gridSize];
  const symbols = SYMBOLS.slice(0, pairCount);
  const pairs = [...symbols, ...symbols];
  return shuffle(pairs).map((symbol, index) => ({
    id: `card-${index}`,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

function getStoredSettings(): MemoryGameSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = window.localStorage.getItem(MEMORY_SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<MemoryGameSettings>;
    return {
      gridSize: parsed.gridSize ?? defaultSettings.gridSize,
      timerMode: parsed.timerMode ?? defaultSettings.timerMode,
      countdownSeconds: parsed.countdownSeconds ?? defaultSettings.countdownSeconds,
    };
  } catch {
    return defaultSettings;
  }
}

const MEMORY_STATS_KEY = 'memory-game-stats';

interface MemoryStats {
  bestMoves: number | null;
  bestTimeSeconds: number | null;
  gamesPlayed: number;
}

function loadMemoryStats(): MemoryStats {
  if (typeof window === 'undefined')
    return { bestMoves: null, bestTimeSeconds: null, gamesPlayed: 0 };
  try {
    const raw = window.localStorage.getItem(MEMORY_STATS_KEY);
    if (!raw) return { bestMoves: null, bestTimeSeconds: null, gamesPlayed: 0 };
    return JSON.parse(raw) as MemoryStats;
  } catch {
    return { bestMoves: null, bestTimeSeconds: null, gamesPlayed: 0 };
  }
}

function saveMemoryStats(stats: MemoryStats): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MEMORY_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export default function MemoryPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [settings, setSettings] = useState<MemoryGameSettings>(defaultSettings);
  const [cards, setCards] = useState<CardState[]>(() =>
    createInitialCards(settings)
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [stats, setStats] = useState<MemoryStats>(loadMemoryStats);

  const timer = useGameTimer({
    mode: settings.timerMode === 'countdown' ? 'countdown' : 'stopwatch',
    initialSeconds:
      settings.timerMode === 'countdown'
        ? Math.min(600, Math.max(10, settings.countdownSeconds ?? 60))
        : 0,
    onComplete: settings.timerMode === 'countdown' ? () => setTimeUp(true) : undefined,
  });

  useEffect(() => {
    const stored = getStoredSettings();
    setSettings(stored);
    setCards(createInitialCards(stored));
  }, []);

  const config = gridConfig[settings.gridSize];
  const matchedCount = useMemo(
    () => cards.filter((c) => c.isMatched).length,
    [cards]
  );
  const isComplete = matchedCount === cards.length && cards.length > 0;

  useEffect(() => {
    if (isComplete && !timeUp) {
      timer.pause();
      const nextStats: MemoryStats = {
        bestMoves:
          stats.bestMoves === null
            ? moves
            : Math.min(stats.bestMoves, moves),
        bestTimeSeconds:
          settings.timerMode === 'stopwatch'
            ? stats.bestTimeSeconds === null
              ? timer.seconds
              : Math.min(stats.bestTimeSeconds, timer.seconds)
            : stats.bestTimeSeconds,
        gamesPlayed: stats.gamesPlayed + 1,
      };
      setStats(nextStats);
      saveMemoryStats(nextStats);
    }
  }, [
    isComplete,
    timeUp,
    moves,
    timer,
    timer.seconds,
    settings.timerMode,
    stats.bestMoves,
    stats.bestTimeSeconds,
    stats.gamesPlayed,
    timer.pause,
  ]);

  const startNewGame = useCallback(
    (newSettings: MemoryGameSettings) => {
      setSettings(newSettings);
      setCards(createInitialCards(newSettings));
      setFlippedIndices([]);
      setIsChecking(false);
      setMoves(0);
      setTimeUp(false);
      if (newSettings.timerMode === 'none') {
        timer.reset(0);
      } else if (newSettings.timerMode === 'countdown') {
        const sec = Math.min(
          600,
          Math.max(10, newSettings.countdownSeconds ?? 60)
        );
        timer.reset(sec);
        timer.start();
      } else {
        timer.reset(0);
        timer.start();
      }
      setShowSettings(false);
    },
    [timer]
  );

  const handleApplySettings = useCallback(
    (newSettings: MemoryGameSettings) => {
      startNewGame(newSettings);
    },
    [startNewGame]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (isChecking || isComplete || timeUp) return;
      if (settings.timerMode !== 'none' && !timer.isRunning && moves === 0) {
        timer.start();
      }
      const card = cards[index];
      if (card.isFlipped || card.isMatched) return;
      if (flippedIndices.length >= 2) return;

      const newFlipped =
        flippedIndices.length === 0
          ? [index]
          : flippedIndices[0] === index
            ? flippedIndices
            : [flippedIndices[0], index];

      setFlippedIndices(newFlipped);
      setCards((prev) =>
        prev.map((c, i) =>
          newFlipped.includes(i) ? { ...c, isFlipped: true } : c
        )
      );

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setIsChecking(true);
        const [a, b] = newFlipped;
        const match = cards[a].symbol === cards[b].symbol;
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => {
              if (i === a || i === b) {
                return { ...c, isFlipped: match, isMatched: match };
              }
              return c;
            })
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 600);
      }
    },
    [
      cards,
      flippedIndices,
      isChecking,
      isComplete,
      timeUp,
      moves,
      settings.timerMode,
      timer,
    ]
  );

  const handleResetSameSettings = useCallback(() => {
    startNewGame(settings);
  }, [settings, startNewGame]);

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[config.cols];

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
    >
      <div className="space-y-4 sm:space-y-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm sm:text-base">
            <span>Moves: {moves}</span>
            {settings.timerMode !== 'none' && (
              <span
                className={
                  settings.timerMode === 'countdown' && timer.seconds <= 10
                    ? 'text-red-400 font-medium'
                    : ''
                }
              >
                Time: {timer.formattedTime}
              </span>
            )}
            {isComplete && !timeUp && (
              <span className="text-cyan-300 font-medium">
                You won in {moves} moves!
                {settings.timerMode === 'stopwatch' &&
                  ` (${timer.formattedTime})`}
              </span>
            )}
            {timeUp && (
              <span className="text-red-400 font-medium">Time&apos;s up!</span>
            )}
            {stats.bestMoves != null && (
              <span className="text-slate-500">
                Best: {stats.bestMoves} moves
                {stats.bestTimeSeconds != null &&
                  settings.timerMode === 'stopwatch' &&
                  ` · ${Math.floor(stats.bestTimeSeconds / 60)}:${(stats.bestTimeSeconds % 60).toString().padStart(2, '0')}`}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowSettings((s) => !s)}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                bg-slate-800/60 border border-slate-700/60
                text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50
                transition-all duration-300
              "
            >
              {showSettings ? 'Hide settings' : 'Settings'}
            </button>
            <button
              type="button"
              onClick={handleResetSameSettings}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                bg-slate-800/60 border border-slate-700/60
                text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50
                transition-all duration-300
              "
            >
              New game
            </button>
          </div>
        </div>

        {showSettings && (
          <MemorySettings onApply={handleApplySettings} />
        )}

        <div
          className={`
            grid ${gridColsClass} gap-1.5 sm:gap-2 md:gap-3 w-full mx-auto
            ${config.cols >= 6 ? 'max-w-[28rem]' : 'max-w-2xl'}
          `}
          style={{
            aspectRatio: `${config.cols} / ${config.rows}`,
          }}
        >
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(index)}
              disabled={isChecking || card.isMatched || timeUp}
              className={`
                relative rounded-lg sm:rounded-xl border-2 overflow-hidden
                flex items-center justify-center min-h-0
                text-lg sm:text-2xl md:text-3xl lg:text-4xl
                transition-all duration-300 touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                disabled:pointer-events-none
                aspect-square
                ${
                  card.isMatched
                    ? 'bg-cyan-400/20 border-cyan-400/50 opacity-90'
                    : card.isFlipped
                      ? 'bg-slate-800/80 border-cyan-400/50'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }
              `}
            >
              <span className="inline-block transition-transform duration-300">
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-500 text-center max-w-md mx-auto">
          Click two cards to flip them. Find all matching pairs with the fewest
          moves.
        </p>
      </div>
    </GameLayout>
  );
}
