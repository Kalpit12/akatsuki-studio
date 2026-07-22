"use client";

import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { RouteScrollSync } from "./RouteScrollSync";
import { MagneticCursor } from "@/components/cursor/MagneticCursor";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { PageTransition } from "@/components/layout/PageTransition";
import { PresenceProvider } from "@/components/providers/PresenceProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PresenceProvider>
      <SmoothScrollProvider>
        <RouteScrollSync />
        <LoadingScreen />
        <MagneticCursor />
        <PageTransition>{children}</PageTransition>
      </SmoothScrollProvider>
    </PresenceProvider>
  );
}
