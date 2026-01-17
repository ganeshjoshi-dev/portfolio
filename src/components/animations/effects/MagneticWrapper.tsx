"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

/**
 * Magnetic hover effect wrapper
 * Elements subtly follow cursor when hovered
 */
export function MagneticWrapper({
  children,
  strength = 0.3,
  radius = 100,
  className = "",
}: MagneticWrapperProps) {
  const { ref, position, handlers } = useMagnetic({ strength, radius });

  return (
    <motion.div
      ref={ref}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={`magnetic ${className}`}
      {...handlers}
    >
      {children}
    </motion.div>
  );
}
