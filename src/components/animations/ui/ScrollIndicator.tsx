"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { durations } from "@/lib/animations";

/**
 * Animated scroll indicator
 * Shows at bottom of hero section
 */
export function ScrollIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: reduceMotion ? 0 : 0.8,
        duration: reduceMotion ? 0 : durations.slow,
      }}
      className="flex flex-col items-center text-gray-400"
    >
      <span className="text-xs uppercase tracking-[0.3em] mb-3">Scroll</span>
      <div className="h-12 w-6 rounded-full border border-cyan-400/40 flex items-start justify-center p-1">
        <motion.span
          animate={reduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-2 w-2 rounded-full bg-cyan-400"
        />
      </div>
    </motion.div>
  );
}

// Keep default export for backward compatibility
export default ScrollIndicator;
