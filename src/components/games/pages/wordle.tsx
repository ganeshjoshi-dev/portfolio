'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import {
  getRandomWordleWord,
  isValidWordleWord,
} from '@/lib/data/wordle-words';

const ROWS = 6;
const COLS = 5;

type LetterStatus = 'correct' | 'present' | 'absent' | null;

function getFeedback(guess: string, answer: string): LetterStatus[] {
  const ans = answer.toLowerCase().split('');
  const g = guess.toLowerCase().split('');
  const status: LetterStatus[] = Array(5).fill(null);
  const used: boolean[] = Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    if (g[i] === ans[i]) {
      status[i] = 'correct';
      used[i] = true;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (status[i] !== null) continue;
    const idx = ans.findIndex((c, j) => !used[j] && c === g[i]);
    if (idx !== -1) {
      status[i] = 'present';
      used[idx] = true;
    } else {
      status[i] = 'absent';
    }
  }
  return status;
}

const ROW_KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

// Stable initial answer across React Strict Mode double-mount (avoids answer changing mid-game)
const initialAnswerRef = { current: '' };
function getStableInitialAnswer(): string {
  if (!initialAnswerRef.current) {
    initialAnswerRef.current = getRandomWordleWord();
  }
  return initialAnswerRef.current;
}

export default function WordlePage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [answer, setAnswer] = useState(getStableInitialAnswer);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [invalidMessage, setInvalidMessage] = useState('');

  const handleLetter = useCallback((letter: string) => {
    setInvalidMessage('');
    setCurrent((prev) =>
      prev.length < COLS ? prev + letter.toUpperCase() : prev
    );
  }, []);

  const handleBackspace = useCallback(() => {
    setCurrent((prev) => prev.slice(0, -1));
  }, []);

  const handleEnter = useCallback(() => {
    if (current.length !== COLS) return;
    const word = current.toLowerCase();
    if (!isValidWordleWord(word)) {
      setInvalidMessage('Not in word list');
      setTimeout(() => setInvalidMessage(''), 2000);
      return;
    }
    setInvalidMessage('');
    const nextGuesses = [...guesses, word];
    setGuesses(nextGuesses);
    setCurrent('');
    if (word === answer) setGameOver('win');
    else if (nextGuesses.length >= ROWS) setGameOver('lose');
  }, [current, guesses, answer]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleLetter(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameOver, handleLetter, handleBackspace, handleEnter]);

  const shareText = useMemo(() => {
    if (gameOver !== 'win' && gameOver !== 'lose') return '';
    const lines = guesses.map((g) => {
      const fb = getFeedback(g, answer);
      return fb
        .map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬜'))
        .join('');
    });
    return `Wordle ${gameOver === 'win' ? guesses.length : 'X'}/${ROWS}\n${lines.join('\n')}`;
  }, [gameOver, guesses, answer]);

  const reset = useCallback(() => {
    setAnswer(getRandomWordleWord());
    setGuesses([]);
    setCurrent('');
    setGameOver(null);
  }, []);

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
            {gameOver === 'win' && (
              <span className="text-cyan-300 font-medium">
                You got it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
              </span>
            )}
            {gameOver === 'lose' && (
              <span className="text-red-400 font-medium">
                The word was <span className="font-mono">{answer}</span>
              </span>
            )}
            {!gameOver && (
              <span>
                Guess {guesses.length + 1}/{ROWS}
              </span>
            )}
            {invalidMessage && (
              <span className="text-amber-400 font-medium animate-pulse">
                {invalidMessage}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {gameOver && shareText && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(shareText);
                }}
              >
                Copy results
              </Button>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={reset}>
              New game
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-1 sm:px-0 min-w-0">
          <div
            className="grid gap-0.5 sm:gap-1 md:gap-2 w-full max-w-[min(20rem,100%-1rem)] mx-auto aspect-[5/6]"
            style={{
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            }}
            role="grid"
            aria-label="Wordle guesses"
          >
            {Array.from({ length: ROWS * COLS }).map((_, index) => {
              const rowIndex = Math.floor(index / COLS);
              const colIndex = index % COLS;
              const guess = guesses[rowIndex];
              const letter = guess
                ? guess[colIndex]?.toUpperCase()
                : rowIndex === guesses.length
                  ? current[colIndex] ?? ''
                  : '';
              const status = guess
                ? getFeedback(guess, answer)[colIndex]
                : null;
              return (
                <div
                  key={index}
                  className={`
                    flex items-center justify-center min-h-0 rounded border-2 text-base sm:text-lg md:text-xl lg:text-2xl font-bold
                    ${
                      status === 'correct'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : status === 'present'
                          ? 'bg-amber-500 border-amber-400 text-white'
                          : status === 'absent'
                            ? 'bg-slate-700 border-slate-600 text-slate-300'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }
                  `}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1 sm:gap-2 w-full max-w-[min(28rem,100%-0.5rem)] px-0 min-w-0 overflow-x-auto" role="group" aria-label="Keyboard">
            {ROW_KEYS.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-nowrap justify-center gap-0.5 sm:gap-1 md:gap-1.5"
              >
                {row.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'Enter') handleEnter();
                      else if (key === 'Backspace') handleBackspace();
                      else handleLetter(key);
                    }}
                    disabled={!!gameOver}
                    className={`
                      flex-1 min-w-0 min-h-[2.75rem] sm:min-h-[3rem] md:min-h-[3rem] h-11 sm:h-12 md:h-12 rounded
                      text-xs sm:text-sm font-medium
                      bg-slate-700/80 border border-slate-600
                      hover:bg-slate-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                      disabled:opacity-50 disabled:pointer-events-none
                      transition-all duration-200 touch-manipulation
                      ${key.length > 1 ? 'flex-[1.5] min-w-[2rem] px-1 sm:px-2 md:px-3' : 'min-w-[1.5rem]'}
                    `}
                  >
                    {key === 'Backspace' ? '⌫' : key}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-500 text-center">
            Type or tap letters. Green = correct spot, yellow = wrong spot, gray = not in word.
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
