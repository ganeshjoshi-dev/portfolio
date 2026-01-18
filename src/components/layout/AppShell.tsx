"use client";

import { ReactNode } from "react";
import { Preloader } from "@/components/animations";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppShellProps {
  children: ReactNode;
}

/**
 * App shell component with preloader
 * Handles initial loading state and app structure
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <>
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-slate-900 focus:font-semibold focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <Preloader duration={1500} />
      <Navbar />
      <main id="main-content" className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
