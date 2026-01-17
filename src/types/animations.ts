import { ReactNode } from "react";

// Base animation configuration
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  disabled?: boolean; // For reduced motion
}

// Reveal wrapper props
export interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  stagger?: number;
  config?: AnimationConfig;
  className?: string;
}

// Magnetic effect props
export interface MagneticProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

// Tilt effect props
export interface TiltProps {
  children: ReactNode;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  className?: string;
}

// Split text props
export interface SplitTextProps {
  children: string;
  type?: "chars" | "words" | "lines";
  stagger?: number;
  delay?: number;
  className?: string;
}

// Parallax layer props
export interface ParallaxLayerProps {
  children?: ReactNode;
  speed?: number;
  className?: string;
}

// Preloader props
export interface PreloaderProps {
  duration?: number;
  onComplete?: () => void;
}

// Scroll progress props
export interface ScrollProgressProps {
  className?: string;
  color?: string;
}
