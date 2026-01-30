'use client';

import { useState, useCallback } from 'react';

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useLocalStorage<T>(key: string, fallback: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => getStoredValue(key, fallback));

  const setValue = useCallback(
    (value: T) => {
      setState(value);
      setStoredValue(key, value);
    },
    [key]
  );

  return [state, setValue];
}
