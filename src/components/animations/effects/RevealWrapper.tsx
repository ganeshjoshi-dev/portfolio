"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { durations, easings } from "@/lib/animations";

interface RevealWrapperProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

/**
 * Scroll reveal wrapper
 * Animates children when they enter viewport
 */
export function RevealWrapper({
  children,
  direction = "up",
  delay = 0,
  duration = durations.normal,
  className = "",
  once = true,
  amount = 0.3,
}: RevealWrapperProps) {
  const reduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 24, x: 0 };
      case "down":
        return { y: -24, x: 0 };
      case "left":
        return { x: 24, y: 0 };
      case "right":
        return { x: -24, y: 0 };
      default:
        return { y: 24, x: 0 };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: easings.smooth,
      },
    },
  };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
