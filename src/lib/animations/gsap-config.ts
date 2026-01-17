import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { durations } from "./durations";
import { gsapEasings } from "./easings";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP default configuration
 */
export const gsapDefaults = {
  duration: durations.normal,
  ease: gsapEasings.smooth,
};

/**
 * ScrollTrigger default configuration
 */
export const scrollTriggerDefaults = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse",
};

/**
 * Initialize GSAP with Lenis smooth scroll
 * Call this in your SmoothScrollProvider
 */
export function initGSAPWithLenis(lenisInstance: { raf: (time: number) => void }) {
  // Sync Lenis with GSAP ticker
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Disable GSAP's lag smoothing for Lenis compatibility
  gsap.ticker.lagSmoothing(0);
}

/**
 * Cleanup function for GSAP ScrollTrigger
 * Call this in useEffect cleanup
 */
export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { gsap, ScrollTrigger };
