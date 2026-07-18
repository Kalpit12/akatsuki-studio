"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADER_LOGO_SRC, INTRO_DONE_EVENT, preloadHeaderLogo } from "@/components/brand/Logo";

const INTRO_READY_KEY = "akatsuki-intro-ready";

function readIntroSkipped() {
  try {
    return sessionStorage.getItem(INTRO_READY_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroDone() {
  try {
    sessionStorage.setItem(INTRO_READY_KEY, "1");
  } catch {
    /* ignore */
  }
  document.body.style.overflow = "";
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const finishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    markIntroDone();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    // Warm the header logo while the loader runs so smoke reveal starts instantly.
    preloadHeaderLogo();

    if (readIntroSkipped() || reducedMotion) {
      finishIntro();
      return;
    }

    setVisible(true);
    document.body.style.overflow = "hidden";

    let frame = 0;
    let hideTimer = 0;
    let forceTimer = 0;
    let cancelled = false;
    const duration = mobile ? 2000 : 3200;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (elapsed < duration) {
        frame = requestAnimationFrame(tick);
      } else {
        hideTimer = window.setTimeout(() => {
          if (cancelled) return;
          setVisible(false);
        }, mobile ? 400 : 700);
      }
    };

    // Never block the site if exit animation fails to complete.
    forceTimer = window.setTimeout(() => {
      if (cancelled) return;
      setVisible(false);
      finishIntro();
    }, 6500);

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(forceTimer);
      document.body.style.overflow = "";
    };
  }, [finishIntro]);

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {visible ? (
        <motion.div
          key="akatsuki-loader"
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-black"
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          }}
        >
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
                src={LOADER_LOGO_SRC}
                alt="Akatsuki Studio"
                width={640}
                height={260}
                className="h-auto w-[min(78vw,420px)] object-contain"
                fetchPriority="high"
              />

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
      ) : null}
    </AnimatePresence>
  );
}
