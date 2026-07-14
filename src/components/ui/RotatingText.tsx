"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RotatingTextProps = {
  words: string[];
  className?: string;
  intervalMs?: number;
  startDelayMs?: number;
};

/**
 * Width always follows the current word (tight spacing next to “Let’s / that”).
 * Desktop: vertical slide + soft width morph.
 * Mobile: opacity fade only (unchanged).
 */
export function RotatingText({
  words,
  className = "",
  intervalMs = 2600,
  startDelayMs = 0,
}: RotatingTextProps) {
  const reduceMotion = useReducedMotion();
  const safeWords = words.length > 0 ? words : [""];
  const [index, setIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || safeWords.length < 2) return;

    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIndex((i) => (i + 1) % safeWords.length);
      }, intervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [safeWords, intervalMs, startDelayMs, reduceMotion]);

  const current = safeWords[index] ?? safeWords[0];

  return (
    <motion.span
      layout={isDesktop && !reduceMotion}
      transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        "relative inline-grid align-baseline leading-[inherit]",
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Natural width of the active word — no longest-word gap */}
      <span
        className="invisible col-start-1 row-start-1 whitespace-nowrap leading-[inherit]"
        aria-hidden
      >
        {current}
      </span>

      <span className="relative col-start-1 row-start-1 inline-grid overflow-hidden leading-[inherit]">
        <span
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
          aria-hidden
        >
          {current}
        </span>

        <span className="col-start-1 row-start-1 overflow-hidden">
          {reduceMotion ? (
            <span className="whitespace-nowrap">{current}</span>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current}
                className="inline-block whitespace-nowrap will-change-transform"
                initial={
                  isDesktop
                    ? { y: "0.85em", opacity: 0 }
                    : { opacity: 0 }
                }
                animate={
                  isDesktop
                    ? { y: "0em", opacity: 1 }
                    : { opacity: 1 }
                }
                exit={
                  isDesktop
                    ? { y: "-0.85em", opacity: 0 }
                    : { opacity: 0 }
                }
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {current}
              </motion.span>
            </AnimatePresence>
          )}
        </span>
      </span>
    </motion.span>
  );
}
