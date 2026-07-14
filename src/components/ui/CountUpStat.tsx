"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function formatStat(value: number, suffix: string): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded =
      millions >= 10
        ? Math.round(millions).toString()
        : millions.toFixed(1).replace(/\.0$/, "");
    return `${rounded}M${suffix}`;
  }

  if (value >= 1_000) {
    const thousands = value / 1_000;
    const rounded =
      thousands >= 10
        ? Math.round(thousands).toString()
        : thousands.toFixed(1).replace(/\.0$/, "");
    return `${rounded}K${suffix}`;
  }

  return `${Math.round(value)}${suffix}`;
}

type CountUpStatProps = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function CountUpStat({
  value,
  suffix = "+",
  className,
  duration = 1.85,
}: CountUpStatProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => formatStat(0, suffix));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(formatStat(value, suffix));
      return;
    }

    const state = { current: 0 };
    setDisplay(formatStat(0, suffix));

    const tween = gsap.to(state, {
      current: value,
      duration,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
      onUpdate: () => {
        setDisplay(formatStat(state.current, suffix));
      },
      onComplete: () => {
        setDisplay(formatStat(value, suffix));
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, suffix, duration]);

  return (
    <span ref={rootRef} className={className}>
      {display}
    </span>
  );
}
