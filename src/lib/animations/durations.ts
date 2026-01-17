/**
 * Standardized animation durations (in seconds)
 * Use these values for consistent timing across the app
 */
export const durations = {
  instant: 0,
  faster: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.2,
} as const;

export type Duration = keyof typeof durations;
