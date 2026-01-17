"use client";

import { useRef, useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface MagneticState {
  x: number;
  y: number;
}

interface UseMagneticOptions {
  strength?: number;
  radius?: number;
}

/**
 * Hook for magnetic hover effect
 * Elements subtly follow the cursor when hovered
 */
export function useMagnetic(options: UseMagneticOptions = {}) {
  const { strength = 0.3, radius = 100 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<MagneticState>({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Calculate distance from center
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Only apply effect within radius
      if (distance < radius) {
        const factor = 1 - distance / radius;
        setPosition({
          x: distanceX * strength * factor,
          y: distanceY * strength * factor,
        });
      }
    },
    [strength, radius, reduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
