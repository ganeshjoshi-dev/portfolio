"use client";

import { ReactNode } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { AnimationProvider } from "./AnimationProvider";
import { ScrollContainmentProvider } from "./ScrollContainmentProvider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers wrapper
 * Includes smooth scrolling, scroll containment (wheel stays in scrollable areas), and animation context
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AnimationProvider>
      <ScrollContainmentProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </ScrollContainmentProvider>
    </AnimationProvider>
  );
}
