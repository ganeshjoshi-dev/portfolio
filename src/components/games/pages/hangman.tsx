'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import {
  getRandomHangmanWord,
  getAllHangmanCategories,
  getCategoryDisplayName,
  type HangmanCategory,
} from '@/lib/data/hangman-words';

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function HangmanPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [category, setCategory] = useState<HangmanCategory>('animals');
  const [word, setWord] = useState(() => getRandomHangmanWord('animals'));
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);

  const wrongCount = useMemo(() => {
    return [...guessed].filter((l) => !word.toLowerCase().includes(l)).length;
  }, [guessed, word]);

  const revealed = useMemo(() => {
    return word
      .toLowerCase()
      .split('')
      .map((c) => (c >= 'a' && c <= 'z' ? (guessed.has(c.toUpperCase()) ? c : '_') : c));
  }, [word, guessed]);

  const won = useMemo(() => {
    return word
      .toLowerCase()
      .split('')
      .filter((c) => c >= 'a' && c <= 'z')
      .every((c) => guessed.has(c.toUpperCase()));
  }, [word, guessed]);

  const lost = wrongCount >= MAX_WRONG;
  const gameOver = won || lost;

  const handleLetter = useCallback(
    (letter: string) => {
      if (gameOver || guessed.has(letter)) return;
      setGuessed((prev) => new Set(prev).add(letter));
    },
    [gameOver, guessed]
  );

  const startGame = useCallback((cat: HangmanCategory) => {
    setCategory(cat);
    setWord(getRandomHangmanWord(cat));
    setGuessed(new Set());
    setGameStarted(true);
  }, []);

  const reset = useCallback(() => {
    setWord(getRandomHangmanWord(category));
    setGuessed(new Set());
  }, [category]);

  const changeCategory = useCallback(() => {
    setGameStarted(false);
  }, []);

  const categories = getAllHangmanCategories();

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
    >
      <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
        {!gameStarted ? (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm sm:text-base">
              Choose a category to start.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => startGame(cat)}
                >
                  {getCategoryDisplayName(cat)}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-slate-400 text-sm sm:text-base">
                Category: <span className="text-cyan-300">{getCategoryDisplayName(category)}</span>
                {' · '}
                Wrong: <span className={wrongCount >= MAX_WRONG - 1 ? 'text-red-400' : ''}>{wrongCount}/{MAX_WRONG}</span>
                {won && (
                  <span className="ml-2 text-cyan-300 font-medium">You won!</span>
                )}
                {lost && (
                  <span className="ml-2 text-red-400 font-medium">Game over</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={reset}
                >
                  New word
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={changeCategory}
                >
                  Change category
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-1 sm:px-0">
              <div
                className="flex items-center justify-center w-full max-w-[7rem] sm:max-w-[8rem] text-slate-600 flex-shrink-0"
                aria-hidden
              >
                <svg
                  width="100%"
                  height="auto"
                  viewBox="0 0 120 140"
                  preserveAspectRatio="xMidYMid meet"
                  className="max-h-[10rem] sm:max-h-[11rem]"
                >
                  <line
                    x1={20}
                    y1={120}
                    x2={100}
                    y2={120}
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <line
                    x1={60}
                    y1={120}
                    x2={60}
                    y2={20}
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <line
                    x1={60}
                    y1={20}
                    x2={90}
                    y2={20}
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <line
                    x1={90}
                    y1={20}
                    x2={90}
                    y2={40}
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  {wrongCount >= 1 && (
                    <circle
                      cx={90}
                      cy={50}
                      r={10}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                  {wrongCount >= 2 && (
                    <line
                      x1={90}
                      y1={60}
                      x2={90}
                      y2={90}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                  {wrongCount >= 3 && (
                    <line
                      x1={90}
                      y1={70}
                      x2={75}
                      y2={85}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                  {wrongCount >= 4 && (
                    <line
                      x1={90}
                      y1={70}
                      x2={105}
                      y2={85}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                  {wrongCount >= 5 && (
                    <line
                      x1={90}
                      y1={90}
                      x2={75}
                      y2={105}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                  {wrongCount >= 6 && (
                    <line
                      x1={90}
                      y1={90}
                      x2={105}
                      y2={105}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                </svg>
              </div>

              <p
                className="text-xl sm:text-2xl md:text-3xl font-mono tracking-widest text-slate-200 text-center break-all px-2 min-w-0 max-w-full overflow-x-auto"
                aria-live="polite"
              >
                {revealed.join(' ')}
              </p>
              {lost && (
                <p className="text-slate-400 text-center">
                  The word was <span className="font-mono text-cyan-300">{word}</span>
                </p>
              )}

              <div
                className="flex flex-wrap justify-center gap-1.5 sm:gap-2 w-full max-w-lg px-1"
                role="group"
                aria-label="Letter keyboard"
              >
                {ALPHABET.map((letter) => {
                  const used = guessed.has(letter);
                  const correct = word.toLowerCase().includes(letter.toLowerCase());
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handleLetter(letter)}
                      disabled={gameOver || used}
                      className={`
                        w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium touch-manipulation
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                        disabled:pointer-events-none transition-all duration-200
                        ${
                          used
                            ? correct
                              ? 'bg-emerald-600/80 text-white'
                              : 'bg-red-600/80 text-white'
                            : 'bg-slate-700/80 border border-slate-600 text-slate-300 hover:border-cyan-400/50 hover:bg-slate-700'
                        }
                      `}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
