'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type TimerMode = 'stopwatch' | 'countdown';

export interface UseGameTimerOptions {
  mode: TimerMode;
  initialSeconds?: number; // For countdown: start value. For stopwatch: ignored (starts at 0).
  onComplete?: () => void; // For countdown: called when reaching 0
}

export interface UseGameTimerReturn {
  seconds: number;
  formattedTime: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newInitialSeconds?: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function useGameTimer({
  mode,
  initialSeconds = 60,
  onComplete,
}: UseGameTimerOptions): UseGameTimerReturn {
  const [seconds, setSeconds] = useState(
    mode === 'countdown' ? initialSeconds : 0
  );
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const initialSecondsRef = useRef(initialSeconds);

  const clearIntervalSafe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearIntervalSafe();
    setIsRunning(true);
  }, [clearIntervalSafe]);

  const pause = useCallback(() => {
    clearIntervalSafe();
    setIsRunning(false);
  }, [clearIntervalSafe]);

  const reset = useCallback(
    (newInitialSeconds?: number) => {
      clearIntervalSafe();
      const initial =
        newInitialSeconds !== undefined
          ? newInitialSeconds
          : initialSecondsRef.current;
      initialSecondsRef.current = initial;
      setSeconds(mode === 'countdown' ? initial : 0);
      setIsRunning(false);
    },
    [mode, clearIntervalSafe]
  );

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === 'stopwatch') {
          return prev + 1;
        }
        if (prev <= 1) {
          clearIntervalSafe();
          setIsRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearIntervalSafe;
  }, [isRunning, mode, clearIntervalSafe]);

  const formattedTime = formatTime(seconds);

  return {
    seconds,
    formattedTime,
    isRunning,
    start,
    pause,
    reset,
  };
}
