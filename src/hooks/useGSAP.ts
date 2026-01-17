"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Hook for GSAP animations with automatic cleanup
 */
export function useGSAP() {
  const reduceMotion = useReducedMotion();
  const contextRef = useRef<gsap.Context | null>(null);

  // Create animation with ScrollTrigger
  const createScrollAnimation = useCallback(
    (
      element: gsap.TweenTarget,
      animation: gsap.TweenVars,
      scrollTriggerOptions?: ScrollTrigger.Vars
    ) => {
      if (reduceMotion) {
        // Set final state immediately for reduced motion
        gsap.set(element, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          ...animation,
        });
        return null;
      }

      return gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          ...animation,
          scrollTrigger: {
            trigger: element as gsap.DOMTarget,
            start: "top 80%",
            toggleActions: "play none none reverse",
            ...scrollTriggerOptions,
          },
        }
      );
    },
    [reduceMotion]
  );

  // Create a GSAP context for scoped cleanup
  const createContext = useCallback((scope: Element | string) => {
    contextRef.current = gsap.context(() => {}, scope);
    return contextRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, []);

  return {
    gsap,
    ScrollTrigger,
    createScrollAnimation,
    createContext,
    reduceMotion,
  };
}
