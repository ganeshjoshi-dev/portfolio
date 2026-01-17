"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks";

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

/**
 * Animated scroll progress bar
 * Shows reading progress at top of page
 */
export function ScrollProgress({
  className = "",
  color = "bg-cyan-400",
}: ScrollProgressProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${color} origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  );
}
