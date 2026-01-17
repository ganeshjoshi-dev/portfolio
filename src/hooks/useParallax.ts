"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface UseParallaxOptions {
  speed?: number;
  offset?: ["start end" | "end start" | "center center", "start end" | "end start" | "center center"];
}

/**
 * Hook for parallax scroll effect
 * Returns a MotionValue for y transform
 */
export function useParallax(options: UseParallaxOptions = {}): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const { speed = 0.5, offset = ["start end", "end start"] } = options;
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Calculate the parallax range based on speed
  // Positive speed = moves opposite to scroll, negative = moves with scroll
  const range = reduceMotion ? 0 : speed * 100;

  const rawY = useTransform(scrollYProgress, [0, 1], [range, -range]);

  // Add spring physics for smoother movement
  const y = useSpring(rawY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { ref, y };
}

/**
 * Simple parallax hook without spring (for performance)
 */
export function useSimpleParallax(speed: number = 0.5): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = reduceMotion ? 0 : speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return { ref, y };
}
