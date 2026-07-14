"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type RotatingTextProps = {
  words: string[];
  className?: string;
  intervalMs?: number;
  startDelayMs?: number;
};

export function RotatingText({
  words,
  className = "",
  intervalMs = 2400,
  startDelayMs = 0,
}: RotatingTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const ghost = ghostRef.current;
    const wordEl = wordRef.current;
    if (!root || !ghost || !wordEl || words.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setWord = (next: string) => {
      ghost.textContent = next;
      wordEl.textContent = next;
    };

    /** Intrinsic width — never measure while a forced pixel width is locked on. */
    const measureWidth = () => {
      gsap.set(root, { clearProps: "width" });
      return Math.ceil(ghost.getBoundingClientRect().width);
    };

    const fitWidth = (animate: boolean) => {
      const from = root.getBoundingClientRect().width;
      const width = measureWidth();
      if (animate) {
        gsap.fromTo(
          root,
          { width: from },
          { width, duration: 0.4, ease: "power2.out" },
        );
      } else {
        gsap.set(root, { width });
      }
    };

    indexRef.current = 0;
    setWord(words[0]);
    gsap.set(wordEl, { yPercent: 0, opacity: 1, clearProps: "transform" });
    fitWidth(false);

    if (reduceMotion || words.length < 2) return;

    let intervalId = 0;

    const advance = () => {
      const next = (indexRef.current + 1) % words.length;
      const nextWord = words[next];
      indexRef.current = next;

      const tl = gsap.timeline();
      tl.to(wordEl, {
        yPercent: -110,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      })
        .add(() => {
          setWord(nextWord);
          gsap.set(wordEl, { yPercent: 110 });
          fitWidth(true);
        })
        .to(wordEl, {
          yPercent: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
    };

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(advance, intervalMs);
    }, startDelayMs);

    const onResize = () => fitWidth(false);
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf([root, wordEl]);
    };
  }, [words, intervalMs, startDelayMs]);

  return (
    <span
      ref={rootRef}
      className={`inline-grid w-max max-w-full align-baseline leading-[inherit] ${className}`}
      style={{ verticalAlign: "baseline" }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/*
        Ghost text keeps a real typographic baseline.
        overflow:hidden on an inline-block would otherwise use the box
        bottom as the baseline and lift the word above the line.
      */}
      <span
        ref={ghostRef}
        className="invisible col-start-1 row-start-1 w-max whitespace-nowrap leading-[inherit]"
        aria-hidden
      >
        {words[0]}
      </span>
      <span className="col-start-1 row-start-1 overflow-hidden leading-[inherit]">
        <span
          ref={wordRef}
          className="block w-max whitespace-nowrap will-change-transform"
        >
          {words[0]}
        </span>
      </span>
    </span>
  );
}
