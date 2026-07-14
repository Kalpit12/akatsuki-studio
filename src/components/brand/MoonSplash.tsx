"use client";

import { cn } from "@/lib/utils";

type MoonSplashProps = {
  active: boolean;
};

/** Classic magatama / tomoe comma — used nine times on the Rinne Sharingan moon. */
function Tomoe({
  cx,
  cy,
  r,
  rotate,
}: {
  cx: number;
  cy: number;
  r: number;
  rotate: number;
}) {
  const s = r / 5.2;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <path
        d={`M ${-0.2 * s} ${-2.8 * s}
           C ${2.4 * s} ${-2.6 * s} ${3.4 * s} ${-0.4 * s} ${2.2 * s} ${1.4 * s}
           C ${1.2 * s} ${2.9 * s} ${-0.6 * s} ${3.2 * s} ${-1.6 * s} ${1.8 * s}
           C ${-2.4 * s} ${0.6 * s} ${-2.1 * s} ${-1.4 * s} ${-0.2 * s} ${-2.8 * s} Z`}
        fill="#0a0a0a"
      />
    </g>
  );
}

/**
 * Akatsuki hover mark — full Infinite Tsukuyomi red moon.
 * Complete disc (no crescent cut), concentric ripples, nine tomoe.
 * 暁 Akatsuki = dawn; the red moon is the Eye of the Moon / Infinite Tsukuyomi.
 */
export function MoonSplash({ active }: MoonSplashProps) {
  const innerTomoe = [0, 120, 240].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      cx: 32 + Math.cos(rad) * 9.5,
      cy: 32 + Math.sin(rad) * 9.5,
      rotate: deg + 90,
    };
  });

  const outerTomoe = [0, 60, 120, 180, 240, 300].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      cx: 32 + Math.cos(rad) * 18.5,
      cy: 32 + Math.sin(rad) * 18.5,
      rotate: deg + 90,
    };
  });

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 z-0 h-14 w-14 -translate-x-1/2 -translate-y-1/2 overflow-visible transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "scale-100 opacity-100" : "scale-75 opacity-0",
      )}
    >
      {/* Outer red bloom into the night */}
      <span
        className={cn(
          "absolute inset-[-28%] rounded-full bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.55)_0%,rgba(225,6,0,0.22)_38%,transparent_72%)]",
          active && "animate-[dawn-bloom_3s_ease-in-out_infinite]",
        )}
      />

      {/* Soft lunar halo */}
      <span
        className={cn(
          "absolute inset-[-4%] rounded-full border border-[#e10600]/35 shadow-[0_0_22px_rgba(225,6,0,0.45)]",
          active && "animate-[lunar-halo_3.4s_ease-in-out_infinite]",
        )}
      />

      {/* Full red moon — no cuts */}
      <span
        className={cn(
          "absolute inset-[10%] overflow-hidden rounded-full shadow-[0_0_18px_rgba(225,6,0,0.7),inset_0_0_12px_rgba(80,0,0,0.35)]",
          active && "animate-[moon-breathe_2.8s_ease-in-out_infinite]",
        )}
      >
        <svg
          viewBox="0 0 64 64"
          className={cn(
            "h-full w-full",
            active && "animate-[tsukuyomi-drift_18s_linear_infinite]",
          )}
        >
          <defs>
            <radialGradient id="moon-fill" cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#ff2a1f" />
              <stop offset="42%" stopColor="#e10600" />
              <stop offset="78%" stopColor="#9a0400" />
              <stop offset="100%" stopColor="#5c0100" />
            </radialGradient>
            <radialGradient id="moon-veil" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,80,70,0.35)" />
              <stop offset="55%" stopColor="rgba(225,6,0,0)" />
              <stop offset="100%" stopColor="rgba(40,0,0,0.45)" />
            </radialGradient>
          </defs>

          {/* Full disc */}
          <circle cx="32" cy="32" r="31" fill="url(#moon-fill)" />
          <circle cx="32" cy="32" r="31" fill="url(#moon-veil)" />

          {/* Rinne Sharingan concentric ripples */}
          {[8, 14, 20, 26].map((r) => (
            <circle
              key={r}
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke="rgba(20,0,0,0.45)"
              strokeWidth="1.1"
            />
          ))}

          {/* Inner pupil ring */}
          <circle
            cx="32"
            cy="32"
            r="4.2"
            fill="none"
            stroke="rgba(10,0,0,0.7)"
            strokeWidth="1.4"
          />
          <circle cx="32" cy="32" r="2.2" fill="#0a0a0a" />

          {/* Nine tomoe: 3 inner + 6 outer */}
          {innerTomoe.map((t, i) => (
            <Tomoe key={`i-${i}`} cx={t.cx} cy={t.cy} r={9.5} rotate={t.rotate} />
          ))}
          {outerTomoe.map((t, i) => (
            <Tomoe key={`o-${i}`} cx={t.cx} cy={t.cy} r={18.5} rotate={t.rotate} />
          ))}
        </svg>

        {/* Soft cloud drift across the surface */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_70%,rgba(0,0,0,0.28)_0%,transparent_55%),radial-gradient(ellipse_at_75%_25%,rgba(255,90,80,0.18)_0%,transparent_40%)]",
            active && "animate-[moon-cloud_5.5s_ease-in-out_infinite]",
          )}
        />
      </span>
    </span>
  );
}
