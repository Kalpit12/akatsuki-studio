"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO_SRC } from "@/components/brand/Logo";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let frame = 0;
    let doneTimer = 0;
    let cancelled = false;
    const duration = 3200;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (elapsed < duration) {
        frame = requestAnimationFrame(tick);
      } else {
        doneTimer = window.setTimeout(() => {
          if (cancelled) return;
          setDone(true);
          document.body.style.overflow = "";
        }, 700);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-black"
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Soft red glow behind logo */}
          <motion.div
            className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#e10600]/20 blur-[100px]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.2, 0.55, 0.35], scale: [0.8, 1.1, 1] }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center gap-10 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, filter: "blur(16px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_SRC}
                alt="Akatsuki Studio"
                width={640}
                height={260}
                className="h-auto w-[min(78vw,420px)] object-contain"
                fetchPriority="high"
              />

              {/* Subtle shine sweep */}
              <motion.div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
              >
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ delay: 0.9, duration: 1.4, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            <div className="flex w-56 flex-col items-center gap-3 md:w-72">
              <div className="h-px w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-[#e10600]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                  Entering studio
                </span>
                <span className="font-mono text-xs tabular-nums text-white/70">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
