"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks";

interface ParallaxLayerProps {
  children?: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Parallax layer wrapper
 * Applies parallax scroll effect to children
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
}: ParallaxLayerProps) {
  const { ref, y } = useParallax({ speed });

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`parallax-layer ${className}`}
    >
      {children}
    </motion.div>
  );
}
