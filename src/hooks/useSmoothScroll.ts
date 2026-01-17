"use client";

import { useContext, createContext } from "react";
import type Lenis from "lenis";

// Context for Lenis instance
export const LenisContext = createContext<Lenis | null>(null);

/**
 * Hook to access Lenis smooth scroll instance
 * Use this to programmatically control scroll
 */
export function useSmoothScroll() {
  const lenis = useContext(LenisContext);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
    }
  ) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  };

  const stop = () => lenis?.stop();
  const start = () => lenis?.start();

  return {
    lenis,
    scrollTo,
    stop,
    start,
  };
}
