"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { durations, easings } from "@/lib/animations";

interface PreloaderProps {
  duration?: number;
  onComplete?: () => void;
}

/**
 * Preloader component with animated logo
 * Shows on initial page load, fades out after content loads
 */
export function Preloader({
  duration = 2000,
  onComplete,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Check if user has already seen preloader in this session
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    if (hasSeenPreloader || reduceMotion) {
      setIsLoading(false);
      onComplete?.();
      return;
    }

    // Wait for page to be fully loaded
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasSeenPreloader", "true");
        onComplete?.();
      }, duration);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [duration, onComplete, reduceMotion]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: reduceMotion ? 0 : durations.normal,
              ease: easings.smooth,
            },
          }}
          className="preloader"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : durations.slow,
              ease: easings.easeOutExpo,
            }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo animation */}
            <motion.div
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-16 h-16"
            >
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400" />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : durations.normal,
                delay: reduceMotion ? 0 : 0.3,
              }}
              className="text-center"
            >
              <span className="text-xl font-bold text-white">
                <span className="text-cyan-400">G</span>anesh{" "}
                <span className="text-cyan-400">J</span>oshi
              </span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : duration / 1000,
                  ease: "linear",
                }}
                className="h-full bg-cyan-400 origin-left"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
