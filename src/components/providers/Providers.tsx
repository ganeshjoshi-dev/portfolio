"use client";

import { ReactNode } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { AnimationProvider } from "./AnimationProvider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers wrapper
 * Includes smooth scrolling and animation context
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AnimationProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </AnimationProvider>
  );
}
