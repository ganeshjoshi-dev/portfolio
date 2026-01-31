'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const COLORS = ['green', 'red', 'yellow', 'blue'] as const;
type Color = (typeof COLORS)[number];

const COLOR_BG: Record<Color, string> = {
  green: 'rgb(16, 185, 129)',   /* emerald-500 */
  red: 'rgb(239, 68, 68)',      /* red-500 */
  yellow: 'rgb(251, 191, 36)',  /* amber-400 */
  blue: 'rgb(59, 130, 246)',    /* blue-500 */
};

/** Bright "lit" color and glow for each quadrant when flashing */
const COLOR_LIT: Record<Color, { bg: string; shadow: string }> = {
  green: { bg: 'rgb(167, 243, 208)', shadow: 'rgba(167, 243, 208, 0.9)' },
  red: { bg: 'rgb(254, 202, 202)', shadow: 'rgba(254, 202, 202, 0.9)' },
  yellow: { bg: 'rgb(254, 243, 199)', shadow: 'rgba(254, 243, 199, 0.9)' },
  blue: { bg: 'rgb(191, 219, 254)', shadow: 'rgba(191, 219, 254, 0.9)' },
};

const FLASH_MS = 500;
const BETWEEN_FLASH_MS = 200;
const GET_READY_MS = 1200;

export default function SimonSaysPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerInput, setPlayerInput] = useState<Color[]>([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'getReady' | 'show' | 'input' | 'wrong'>('idle');
  const [activeFlash, setActiveFlash] = useState<Color | null>(null);
  const showIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reserved for future reset button
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reset = useCallback(() => {
    setSequence([]);
    setPlayerInput([]);
    setScore(0);
    setPhase('idle');
    setActiveFlash(null);
    showIndexRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const first: Color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence([first]);
    setPlayerInput([]);
    setScore(1);
    setActiveFlash(null);
    showIndexRef.current = 0;
    setPhase('getReady');
    const id = setTimeout(() => {
      timeoutRef.current = null;
      setPhase('show');
    }, GET_READY_MS);
    timeoutRef.current = id;
  }, []);

  useEffect(() => {
    if (phase !== 'show' || sequence.length === 0) return;

    const showNext = () => {
      if (showIndexRef.current >= sequence.length) {
        setPhase('input');
        setPlayerInput([]);
        return;
      }
      const color = sequence[showIndexRef.current];
      setActiveFlash(color);
      timeoutRef.current = setTimeout(() => {
        setActiveFlash(null);
        timeoutRef.current = setTimeout(() => {
          showIndexRef.current += 1;
          showNext();
        }, BETWEEN_FLASH_MS);
      }, FLASH_MS);
    };

    showNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, sequence]);

  const handleColorClick = useCallback(
    (color: Color) => {
      if (phase !== 'input') return;

      setActiveFlash(color);
      setTimeout(() => setActiveFlash(null), FLASH_MS);

      const expected = sequence[playerInput.length];
      if (color !== expected) {
        setPhase('wrong');
        return;
      }

      const nextInput = [...playerInput, color];
      setPlayerInput(nextInput);

      if (nextInput.length === sequence.length) {
        setPhase('show');
        setSequence((s) => [...s, COLORS[Math.floor(Math.random() * COLORS.length)]]);
        setScore((sc) => sc + 1);
        showIndexRef.current = 0;
      }
    },
    [phase, sequence, playerInput]
  );

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
    >
      <div className="space-y-6 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <p className="text-slate-400 text-sm sm:text-base">
            Score: <span className="text-cyan-300 font-medium">{score}</span>
            {phase === 'wrong' && (
              <span className="ml-3 text-red-400 font-medium">Wrong! Game over.</span>
            )}
          </p>
          {(phase === 'idle' || phase === 'wrong') && (
            <Button type="button" variant="secondary" size="md" onClick={startGame}>
              {phase === 'wrong' ? 'Play again' : 'Start game'}
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 w-full px-1 sm:px-0 min-w-0">
          <p className="text-slate-400 text-sm text-center min-h-[2.5rem] px-1">
            {phase === 'idle' &&
              'Click Start game. Then watch which colors light up in order.'}
            {phase === 'getReady' && (
              <span className="text-amber-300 font-medium">Get ready! Watch the colors…</span>
            )}
            {phase === 'show' && (
              <span className="text-cyan-300 font-medium">Watch! Remember the order.</span>
            )}
            {phase === 'input' && 'Your turn! Tap the colors in the same order.'}
            {phase === 'wrong' && 'Wrong color. Your score is above. Play again to try again.'}
          </p>

          <div
            className="relative w-full max-w-[min(300px,100%-2rem)] min-h-[min(280px,80vw)] aspect-square rounded-full overflow-hidden border-4 border-slate-600 shadow-xl"
            role="group"
            aria-label="Simon Says: four colored buttons"
          >
            {/* Top-left green */}
            <button
              type="button"
              onClick={() => handleColorClick('green')}
              disabled={phase !== 'input'}
              className="
                absolute top-0 left-0 w-1/2 h-1/2 rounded-tl-full border-r-2 border-b-2 border-slate-700/50
                transition-all duration-150 touch-manipulation
                hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                disabled:pointer-events-none disabled:opacity-90
              "
              style={{
                backgroundColor: activeFlash === 'green' ? COLOR_LIT.green.bg : COLOR_BG.green,
                boxShadow: activeFlash === 'green' ? `inset 0 0 35px 8px ${COLOR_LIT.green.shadow}` : undefined,
              }}
              aria-label="Green"
            />
            {/* Top-right red */}
            <button
              type="button"
              onClick={() => handleColorClick('red')}
              disabled={phase !== 'input'}
              className="
                absolute top-0 right-0 w-1/2 h-1/2 rounded-tr-full border-l-2 border-b-2 border-slate-700/50
                transition-all duration-150 touch-manipulation
                hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                disabled:pointer-events-none disabled:opacity-90
              "
              style={{
                backgroundColor: activeFlash === 'red' ? COLOR_LIT.red.bg : COLOR_BG.red,
                boxShadow: activeFlash === 'red' ? `inset 0 0 35px 8px ${COLOR_LIT.red.shadow}` : undefined,
              }}
              aria-label="Red"
            />
            {/* Bottom-left yellow */}
            <button
              type="button"
              onClick={() => handleColorClick('yellow')}
              disabled={phase !== 'input'}
              className="
                absolute bottom-0 left-0 w-1/2 h-1/2 rounded-bl-full border-r-2 border-t-2 border-slate-700/50
                transition-all duration-150 touch-manipulation
                hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                disabled:pointer-events-none disabled:opacity-90
              "
              style={{
                backgroundColor: activeFlash === 'yellow' ? COLOR_LIT.yellow.bg : COLOR_BG.yellow,
                boxShadow: activeFlash === 'yellow' ? `inset 0 0 35px 8px ${COLOR_LIT.yellow.shadow}` : undefined,
              }}
              aria-label="Yellow"
            />
            {/* Bottom-right blue */}
            <button
              type="button"
              onClick={() => handleColorClick('blue')}
              disabled={phase !== 'input'}
              className="
                absolute bottom-0 right-0 w-1/2 h-1/2 rounded-br-full border-l-2 border-t-2 border-slate-700/50
                transition-all duration-150 touch-manipulation
                hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                disabled:pointer-events-none disabled:opacity-90
              "
              style={{
                backgroundColor: activeFlash === 'blue' ? COLOR_LIT.blue.bg : COLOR_BG.blue,
                boxShadow: activeFlash === 'blue' ? `inset 0 0 35px 8px ${COLOR_LIT.blue.shadow}` : undefined,
              }}
              aria-label="Blue"
            />
            {/* Center: score + phase hint */}
            <div
              className="absolute inset-0 m-auto w-[38%] h-[38%] min-w-[56px] min-h-[56px] sm:min-w-[72px] sm:min-h-[72px] md:min-w-[80px] md:min-h-[80px] rounded-full bg-slate-800 border-4 border-slate-600 flex flex-col items-center justify-center pointer-events-none z-10"
              aria-hidden
            >
              <span className="text-slate-300 font-bold text-xl sm:text-2xl">{score}</span>
              {(phase === 'getReady' || phase === 'show') && (
                <span className="text-slate-500 text-xs mt-0.5">Watch</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
