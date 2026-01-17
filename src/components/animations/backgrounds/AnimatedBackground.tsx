"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { durations } from "@/lib/animations";

/**
 * Enhanced animated background with parallax effects
 * Used in hero section for depth and visual interest
 */
export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Parallax transforms at different speeds
  const y1 = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : -30]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary orb - top left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : durations.slower }}
        style={{ y: y1, opacity }}
        className="absolute -top-24 -left-24 h-72 w-72 md:h-96 md:w-96 rounded-full bg-cyan-400/10 blur-3xl"
      />

      {/* Secondary orb - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : durations.slower,
          delay: 0.2,
        }}
        style={{ y: y2 }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, -15, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-80 w-80 md:h-[28rem] md:w-[28rem] rounded-full bg-blue-500/10 blur-3xl"
        />
      </motion.div>

      {/* Third orb - center right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{
          duration: reduceMotion ? 0 : durations.slower,
          delay: 0.4,
        }}
        style={{ y: y3 }}
        className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl"
      />

      {/* Horizontal accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 1.2,
          delay: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent origin-left"
      />

      {/* Second horizontal line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 1.2,
          delay: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-x-0 bottom-1/4 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent origin-right"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// Keep default export for backward compatibility
export default AnimatedBackground;
