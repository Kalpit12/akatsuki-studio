"use client";

import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false },
);

export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] opacity-25">
      <ParticleField />
    </div>
  );
}
