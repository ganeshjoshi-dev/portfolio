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
      <Preloader duration={1500} />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
