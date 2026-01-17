"use client";

import { createContext, useContext, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { durations } from "@/lib/animations/durations";
import { easings } from "@/lib/animations/easings";

interface AnimationContextValue {
  reduceMotion: boolean;
  durations: typeof durations;
  easings: typeof easings;
}

const AnimationContext = createContext<AnimationContextValue>({
  reduceMotion: false,
  durations,
  easings,
});

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion ?? false;

  return (
    <AnimationContext.Provider
      value={{
        reduceMotion,
        durations,
        easings,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext() {
  return useContext(AnimationContext);
}
