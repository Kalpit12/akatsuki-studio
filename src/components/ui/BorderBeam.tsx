"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

type BorderBeamProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Full lap duration in seconds */
  duration?: number;
  /** Beam length as fraction of perimeter (0.05–0.3) */
  beamRatio?: number;
};

/**
 * Single red beam traveling the perimeter.
 *
 * Important: do NOT paint the stroke with a left→right linearGradient.
 * That maps the whole left edge to the transparent stop, so the glow
 * disappears on the left. Solid stroke color keeps every side visible.
 */
export function BorderBeam({
  children,
  className,
  contentClassName,
  duration = 10,
  beamRatio = 0.15,
}: BorderBeamProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<SVGRectElement>(null);
  const reactId = useId().replace(/:/g, "");
  const filterId = `beam-glow-${reactId}`;

  useEffect(() => {
    const root = rootRef.current;
    const beam = beamRef.current;
    if (!root || !beam) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tween: gsap.core.Tween | null = null;

    const layout = () => {
      const { width, height } = root.getBoundingClientRect();
      if (width < 4 || height < 4) return;

      // Keep the stroke fully inside the box so no side is clipped
      const inset = 2;
      beam.setAttribute("x", String(inset));
      beam.setAttribute("y", String(inset));
      beam.setAttribute("width", String(Math.max(width - inset * 2, 0)));
      beam.setAttribute("height", String(Math.max(height - inset * 2, 0)));

      tween?.kill();

      const length = beam.getTotalLength();
      if (!Number.isFinite(length) || length <= 0) return;

      const lead = Math.min(Math.max(length * beamRatio, 36), length * 0.4);
      beam.setAttribute("stroke-dasharray", `${lead} ${Math.max(length - lead, 1)}`);
      // GSAP-friendly starting point
      gsap.set(beam, { strokeDashoffset: 0 });

      if (prefersReduced) return;

      tween = gsap.to(beam, {
        strokeDashoffset: -length,
        duration,
        ease: "none",
        repeat: -1,
      });
    };

    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(root);

    return () => {
      ro.disconnect();
      tween?.kill();
    };
  }, [duration, beamRatio]);

  return (
    <div ref={rootRef} className={cn("relative isolate overflow-visible", className)}>
      {/* Quiet rim so the box edge stays readable between beam passes */}
      <div
        className="pointer-events-none absolute inset-[2px] z-10 border border-white/[0.06]"
        aria-hidden
      />

      <div className={cn("relative z-0 bg-[#0c0c0c]", contentClassName)}>
        {children}
      </div>

      <svg
        className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          ref={beamRef}
          fill="none"
          stroke="#e10600"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${filterId})`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
