'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import { getRandomPassage } from '@/lib/data/typing-passages';

function computeStats(passage: string, typed: string): { wpm: number; accuracy: number; errors: number } {
  const passageWords = passage.trim().split(/\s+/).filter(Boolean);
  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageChars = passage.replace(/\s/g, '');
  const typedChars = typed.replace(/\s/g, '');
  let errors = 0;
  const len = Math.min(passage.length, typed.length);
  for (let i = 0; i < len; i++) {
    if (passage[i] !== typed[i]) errors++;
  }
  errors += Math.abs(passage.length - typed.length);
  const totalChars = passage.length;
  const accuracy = totalChars > 0 ? Math.max(0, 100 - (errors / totalChars) * 100) : 100;
  const wordsTyped = typedWords.length;
  return { wpm: Math.round(wordsTyped), accuracy: Math.round(accuracy * 10) / 10, errors };
}

export default function TypingSpeedPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [passage, setPassage] = useState(() => getRandomPassage());
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startNew = useCallback(() => {
    setPassage(getRandomPassage());
    setTyped('');
    setStartTime(null);
    setElapsedSeconds(null);
    setFinished(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!startTime || finished) return;
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [startTime, finished]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (startTime === null && value.length > 0) setStartTime(Date.now());
    setTyped(value);
    if (value.length >= passage.length) {
      setElapsedSeconds(Math.floor((Date.now() - (startTime ?? Date.now())) / 1000));
      setFinished(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = typed.slice(0, start);
      const after = typed.slice(end);
      setTyped(before + '  ' + after);
      setTimeout(() => ta.setSelectionRange(start + 2, start + 2), 0);
    }
  };

  const stats = finished && startTime && elapsedSeconds !== null
    ? computeStats(passage, typed)
    : null;

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-6 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={startNew}>
            New passage
          </Button>
          {startTime && !finished && (
            <span className="text-slate-400 text-sm">
              Time: {elapsedSeconds ?? 0}s
            </span>
          )}
        </div>

        <div className="p-4 sm:p-6 bg-slate-800/40 border border-slate-700/60 rounded-xl">
          <p className="text-slate-500 text-sm mb-2">Type the passage below. Timer starts on first key.</p>
          <p
            className="text-slate-300 whitespace-pre-wrap mb-4 font-mono text-sm leading-relaxed"
            aria-hidden="true"
          >
            {passage}
          </p>
          <textarea
            ref={textareaRef}
            value={typed}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={finished}
            placeholder="Start typing here..."
            rows={5}
            className="
              w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/60
              text-white placeholder-slate-500 font-mono text-sm resize-y
              focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20
              disabled:opacity-70
            "
            aria-label="Type the passage above"
          />
        </div>

        {stats && (
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl">
            <h3 className="text-white font-medium mb-3">Results</h3>
            <ul className="space-y-1 text-slate-300">
              <li>Words typed: {stats.wpm}</li>
              <li>Accuracy: {stats.accuracy}%</li>
              <li>Errors: {stats.errors}</li>
              <li>WPM (words per minute): {Math.round((stats.wpm / Math.max(1, elapsedSeconds ?? 1)) * 60)}</li>
            </ul>
            <Button variant="secondary" size="sm" className="mt-3" onClick={startNew}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
