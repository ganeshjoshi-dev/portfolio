"use client";

import { motion, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { durations, easings } from "@/lib/animations";

interface SplitTextProps {
  children: string;
  type?: "chars" | "words" | "lines";
  stagger?: number;
  delay?: number;
  className?: string;
  charClassName?: string;
}

/**
 * Split text animation component
 * Animates text by characters, words, or lines
 */
export function SplitText({
  children,
  type = "chars",
  stagger = 0.03,
  delay = 0,
  className = "",
  charClassName = "",
}: SplitTextProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{children}</span>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.fast,
        ease: easings.easeOutQuart,
      },
    },
  };

  const splitContent = () => {
    switch (type) {
      case "chars":
        return children.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className={`inline-block ${charClassName}`}
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ));

      case "words":
        return children.split(" ").map((word, index, arr) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className={`inline-block ${charClassName}`}
          >
            {word}
            {index < arr.length - 1 && "\u00A0"}
          </motion.span>
        ));

      case "lines":
        return children.split("\n").map((line, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className={`block ${charClassName}`}
          >
            {line}
          </motion.span>
        ));

      default:
        return children;
    }
  };

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`inline-block ${className}`}
      aria-label={children}
    >
      {splitContent()}
    </motion.span>
  );
}
