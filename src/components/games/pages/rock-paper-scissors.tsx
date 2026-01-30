'use client';

import { useState, useCallback } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';

const CHOICES = ['rock', 'paper', 'scissors'] as const;
type Choice = (typeof CHOICES)[number];

const BEATS: Record<Choice, Choice> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const CHOICE_LABELS: Record<Choice, string> = {
  rock: 'Rock',
  paper: 'Paper',
  scissors: 'Scissors',
};

const CHOICE_EMOJI: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

function getResult(player: Choice, computer: Choice): 'win' | 'lose' | 'draw' {
  if (player === computer) return 'draw';
  return BEATS[player] === computer ? 'win' : 'lose';
}

function randomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

export default function RockPaperScissorsPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [wins, setWins] = useState(0);
  const [rounds, setRounds] = useState(0);

  const play = useCallback((choice: Choice) => {
    const computer = randomChoice();
    const res = getResult(choice, computer);
    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(res);
    setRounds((r) => r + 1);
    if (res === 'win') setWins((w) => w + 1);
  }, []);

  const reset = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setWins(0);
    setRounds(0);
  }, []);

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
            Wins: <span className="text-cyan-300 font-medium">{wins}</span>
            <span className="mx-2 text-slate-600">|</span>
            Rounds: <span className="text-slate-300 font-medium">{rounds}</span>
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            Reset score
          </Button>
        </div>

        <div className="flex flex-col items-center gap-8 w-full px-1 sm:px-0">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => play(choice)}
                className="
                  flex flex-col items-center gap-2 p-6 sm:p-8
                  rounded-2xl border-2 border-slate-700/60 bg-slate-800/60
                  hover:border-cyan-400/50 hover:bg-slate-800/80
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  transition-all duration-300
                "
                aria-label={CHOICE_LABELS[choice]}
              >
                <span className="text-4xl sm:text-5xl" aria-hidden>
                  {CHOICE_EMOJI[choice]}
                </span>
                <span className="text-white font-semibold text-lg">
                  {CHOICE_LABELS[choice]}
                </span>
              </button>
            ))}
          </div>

          {playerChoice !== null && computerChoice !== null && result !== null && (
            <div className="w-full max-w-md mx-auto p-6 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center space-y-4">
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-slate-500 text-sm">You</span>
                  <span className="text-3xl" aria-hidden>
                    {CHOICE_EMOJI[playerChoice]}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {CHOICE_LABELS[playerChoice]}
                  </span>
                </div>
                <span className="text-2xl text-slate-500 font-bold">vs</span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-slate-500 text-sm">Computer</span>
                  <span className="text-3xl" aria-hidden>
                    {CHOICE_EMOJI[computerChoice]}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {CHOICE_LABELS[computerChoice]}
                  </span>
                </div>
              </div>
              <p
                className={`text-xl font-bold ${
                  result === 'win'
                    ? 'text-emerald-400'
                    : result === 'lose'
                      ? 'text-red-400'
                      : 'text-slate-400'
                }`}
              >
                {result === 'win' && 'You win!'}
                {result === 'lose' && 'You lose!'}
                {result === 'draw' && "It's a draw!"}
              </p>
            </div>
          )}

          <p className="text-sm text-slate-500 text-center">
            Rock beats scissors, paper beats rock, scissors beat paper.
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
