"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { durations, easings } from "@/lib/animations";

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Text reveal animation with mask
 * Text slides up from behind a mask
 */
export function TextReveal({
  children,
  delay = 0,
  duration = durations.slow,
  className = "",
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
      },
    },
  };

  const textVariants: Variants = {
    hidden: {
      y: "100%",
    },
    visible: {
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : duration,
        ease: easings.easeOutExpo,
      },
    },
  };

  if (reduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`text-reveal-mask ${className}`}
    >
      <motion.span variants={textVariants} className="inline-block">
        {children}
      </motion.span>
    </motion.span>
  );
}
