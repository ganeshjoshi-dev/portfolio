'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import {
  getRandomScrambleWord,
  getScrambledWord,
  type WordLengthOption,
} from '@/lib/data/word-scramble-words';

const LENGTH_OPTIONS: { value: WordLengthOption; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 4, label: 'Short (4)' },
  { value: 5, label: 'Medium (5)' },
  { value: 6, label: 'Long (6)' },
];

export default function WordScramblePage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [lengthOption, setLengthOption] = useState<WordLengthOption>('any');
  const [round, setRound] = useState(() => {
    const w = getRandomScrambleWord('any');
    return { word: w, scrambled: getScrambledWord(w) };
  });
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);

  const startRound = useCallback(() => {
    const w = getRandomScrambleWord(lengthOption);
    setRound({ word: w, scrambled: getScrambledWord(w) });
    setGuess('');
    setMessage(null);
  }, [lengthOption]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = guess.trim().toLowerCase();
      if (!trimmed) return;
      const correct = trimmed === round.word.toLowerCase();
      setMessage(correct ? 'correct' : 'wrong');
      setRounds((r) => r + 1);
      if (correct) setScore((s) => s + 1);
    },
    [guess, round.word]
  );

  const nextWord = useCallback(() => {
    startRound();
  }, [startRound]);

  const displayScrambled = useMemo(
    () => round.scrambled.toUpperCase().split('').join(' '),
    [round.scrambled]
  );

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-6 max-w-lg w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-slate-400 text-sm sm:text-base">
            Score: {score}
            {rounds > 0 && ` / ${rounds}`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="word-length" className="text-slate-400 text-sm">
              Length:
            </label>
            <select
              id="word-length"
              value={lengthOption}
              onChange={(e) => setLengthOption(e.target.value as WordLengthOption)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50"
            >
              {LENGTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={startRound}
            >
              New word
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-800/40 border border-slate-700/60 rounded-xl">
          <p className="text-slate-500 text-sm mb-2">Unscramble this word:</p>
          <p
            className="text-2xl sm:text-3xl font-mono font-semibold tracking-widest text-cyan-300 mb-6"
            aria-label={`Scrambled letters: ${displayScrambled}`}
          >
            {displayScrambled}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="word-scramble-guess" className="sr-only">
              Your guess
            </label>
            <input
              id="word-scramble-guess"
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your answer..."
              disabled={message !== null}
              className="
                w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/60
                text-white placeholder-slate-500
                focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20
                disabled:opacity-70
              "
              autoComplete="off"
              autoCapitalize="off"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={!guess.trim() || message !== null}
              >
                Check
              </Button>
              {message !== null && (
                <Button type="button" variant="secondary" size="md" onClick={nextWord}>
                  Next word
                </Button>
              )}
            </div>
          </form>

          {message === 'correct' && (
            <p className="mt-4 text-green-400 font-medium" role="status">
              Correct! The word was {round.word}.
            </p>
          )}
          {message === 'wrong' && (
            <p className="mt-4 text-amber-400 font-medium" role="status">
              Not quite. The word was &quot;{round.word}&quot;. Try the next one!
            </p>
          )}
        </div>

        <p className="text-slate-500 text-sm">
          Type the word that matches the scrambled letters and click Check.
        </p>
      </div>
    </GameLayout>
  );
}
