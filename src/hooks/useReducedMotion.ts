"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Custom hook to check if user prefers reduced motion
 * Wraps Framer Motion's hook for consistent usage
 */
export function useReducedMotion(): boolean {
  const prefersReducedMotion = useFramerReducedMotion();
  return prefersReducedMotion ?? false;
}
