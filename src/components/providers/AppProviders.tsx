"use client";

import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { RouteScrollSync } from "./RouteScrollSync";
import { MagneticCursor } from "@/components/cursor/MagneticCursor";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { PageTransition } from "@/components/layout/PageTransition";
import { WorkMorphProvider } from "@/components/work/WorkMorphProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <WorkMorphProvider>
        <RouteScrollSync />
        <LoadingScreen />
        <MagneticCursor />
        <PageTransition>{children}</PageTransition>
      </WorkMorphProvider>
    </SmoothScrollProvider>
  );
}
