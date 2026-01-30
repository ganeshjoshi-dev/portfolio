const GAME_STATS_PREFIX = 'game-stats-';

export interface GameStatsRecord {
  bestScore: number | null;
  bestTimeSeconds: number | null;
  wins: number;
  gamesPlayed: number;
}

const defaultRecord: GameStatsRecord = {
  bestScore: null,
  bestTimeSeconds: null,
  wins: 0,
  gamesPlayed: 0,
};

function storageKey(gameId: string): string {
  return `${GAME_STATS_PREFIX}${gameId}`;
}

export function getGameStats(gameId: string): GameStatsRecord {
  if (typeof window === 'undefined') return { ...defaultRecord };
  try {
    const raw = window.localStorage.getItem(storageKey(gameId));
    if (!raw) return { ...defaultRecord };
    const parsed = JSON.parse(raw) as Partial<GameStatsRecord>;
    return {
      bestScore: parsed.bestScore ?? defaultRecord.bestScore,
      bestTimeSeconds: parsed.bestTimeSeconds ?? defaultRecord.bestTimeSeconds,
      wins: parsed.wins ?? defaultRecord.wins,
      gamesPlayed: parsed.gamesPlayed ?? defaultRecord.gamesPlayed,
    };
  } catch {
    return { ...defaultRecord };
  }
}

export function updateGameStats(
  gameId: string,
  updates: Partial<GameStatsRecord>
): GameStatsRecord {
  const current = getGameStats(gameId);
  const next: GameStatsRecord = {
    bestScore:
      updates.bestScore !== undefined
        ? updates.bestScore
        : current.bestScore,
    bestTimeSeconds:
      updates.bestTimeSeconds !== undefined
        ? updates.bestTimeSeconds
        : current.bestTimeSeconds,
    wins: updates.wins !== undefined ? updates.wins : current.wins,
    gamesPlayed:
      updates.gamesPlayed !== undefined
        ? updates.gamesPlayed
        : current.gamesPlayed,
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(storageKey(gameId), JSON.stringify(next));
    } catch {
      // ignore
    }
  }
  return next;
}

export function mergeBestScore(
  current: number | null,
  newScore: number
): number {
  if (current === null) return newScore;
  return Math.max(current, newScore);
}

export function mergeBestTime(
  current: number | null,
  newTimeSeconds: number
): number {
  if (current === null) return newTimeSeconds;
  return Math.min(current, newTimeSeconds);
}
