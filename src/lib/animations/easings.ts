/**
 * Custom easing functions for animations
 * These can be used with both Framer Motion and GSAP
 */

// Cubic bezier arrays for Framer Motion
export const easings = {
  // Smooth, natural feeling
  smooth: [0.25, 0.1, 0.25, 1],
  // Slight overshoot for playful feel
  bounce: [0.68, -0.55, 0.265, 1.55],
  // Quick start, smooth end
  snappy: [0.77, 0, 0.175, 1],
  // Ease out with more punch
  easeOutExpo: [0.16, 1, 0.3, 1],
  // Gentle ease in-out
  easeInOutCubic: [0.65, 0, 0.35, 1],
  // Strong ease out
  easeOutQuart: [0.25, 1, 0.5, 1],
} as const;

// GSAP-compatible easing strings
export const gsapEasings = {
  smooth: "power2.out",
  bounce: "back.out(1.7)",
  snappy: "power4.out",
  easeOutExpo: "expo.out",
  easeInOutCubic: "power2.inOut",
  easeOutQuart: "power3.out",
} as const;

export type Easing = keyof typeof easings;
