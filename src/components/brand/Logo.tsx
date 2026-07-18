"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RedMoonSmoke } from "@/components/brand/RedMoonSmoke";

export const LOGO_SRC = "/brand/akatsuki-logo.png?v=3";
export const LOADER_LOGO_SRC = "/brand/loader-logo.png?v=1";
export const INTRO_DONE_EVENT = "akatsuki:intro-done";

/** Warm the header mark into the browser cache during the loader. */
export function preloadHeaderLogo() {
  if (typeof window === "undefined") return;
  const img = new Image();
  img.decoding = "async";
  img.src = LOGO_SRC;
  void img.decode?.().catch(() => {});
}

type LogoProps = {
  className?: string;
  href?: string | null;
  priority?: boolean;
  /** Elegant L→R red smoke reveal after the loader */
  smokeReveal?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_MS = 1.85;

function DriftWisp({
  active,
  delay,
  className,
}: {
  active: boolean;
  delay: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.5)_0%,rgba(225,6,0,0.16)_48%,transparent_74%)] blur-md",
        className,
      )}
      initial={{ opacity: 0, x: "-35%", scale: 0.75 }}
      animate={
        active
          ? {
              opacity: [0, 0.8, 0.35, 0],
              x: ["-30%", "15%", "55%", "95%"],
              y: ["0%", "-8%", "6%", "0%"],
              scale: [0.8, 1.1, 1.2, 1.15],
            }
          : { opacity: 0, x: "-35%" }
      }
      transition={{ duration: 2, delay, ease: EASE }}
    />
  );
}

export function Logo({
  className,
  href = "/",
  priority,
  smokeReveal = false,
}: LogoProps) {
  const reduceMotion = useReducedMotion();
  const skipSmoke = reduceMotion === true;
  const [introReady, setIntroReady] = useState(!smokeReveal || skipSmoke);
  const [imageReady, setImageReady] = useState(!smokeReveal || skipSmoke);
  const [revealed, setRevealed] = useState(!smokeReveal || skipSmoke);
  const [smokeLive, setSmokeLive] = useState(false);

  useEffect(() => {
    if (!smokeReveal || skipSmoke) {
      setIntroReady(true);
      setImageReady(true);
      setRevealed(true);
      setSmokeLive(false);
      return;
    }

    // Start fetching/decoding immediately — don't wait for the intro to finish.
    preloadHeaderLogo();
    const warm = new Image();
    warm.src = LOGO_SRC;
    const markReady = () => setImageReady(true);
    if (warm.complete) markReady();
    else {
      warm.addEventListener("load", markReady, { once: true });
      warm.addEventListener("error", markReady, { once: true });
      void warm.decode?.().then(markReady).catch(markReady);
    }

    const unlock = () => setIntroReady(true);
    try {
      if (sessionStorage.getItem("akatsuki-intro-ready") === "1") {
        unlock();
      }
    } catch {
      /* ignore */
    }

    window.addEventListener(INTRO_DONE_EVENT, unlock);
    const fallback = window.setTimeout(unlock, 4200);

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, unlock);
      window.clearTimeout(fallback);
      warm.removeEventListener("load", markReady);
      warm.removeEventListener("error", markReady);
    };
  }, [smokeReveal, skipSmoke]);

  useEffect(() => {
    if (!smokeReveal || skipSmoke || !introReady || !imageReady) return;

    setSmokeLive(true);
    const start = window.setTimeout(() => setRevealed(true), 16);
    const end = window.setTimeout(() => setSmokeLive(false), 2100);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [smokeReveal, skipSmoke, introReady, imageReady]);

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Akatsuki Studio"
      width={308}
      height={89}
      decoding={priority ? "sync" : "async"}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setImageReady(true)}
      className={cn("relative z-10 h-auto w-auto object-contain", className)}
    />
  );

  const content =
    smokeReveal && !skipSmoke ? (
      // Clip to logo bounds so smoke never paints a wider “box”
      <span className="relative inline-block overflow-hidden">
        {smokeLive && (
          <>
            {/* Canvas exactly matches logo box */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2]"
            >
              <RedMoonSmoke active direction="ltr" />
            </span>

            {/* Wisps travel across the logo only (clipped) */}
            <DriftWisp
              active={revealed}
              delay={0}
              className="top-[5%] left-0 z-[3] h-[70%] w-[42%]"
            />
            <DriftWisp
              active={revealed}
              delay={0.1}
              className="top-[28%] left-0 z-[3] h-[55%] w-[36%]"
            />
            <DriftWisp
              active={revealed}
              delay={0.18}
              className="bottom-[8%] left-0 z-[3] h-[48%] w-[40%]"
            />

            {/* Soft oval haze — never a rectangle; fades fully out */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.28)_0%,rgba(225,6,0,0.1)_42%,transparent_72%)]"
              initial={{ opacity: 0, scaleX: 0.25, originX: 0 }}
              animate={
                revealed
                  ? { opacity: [0, 0.75, 0.25, 0], scaleX: [0.25, 1, 1] }
                  : { opacity: 0, scaleX: 0.25 }
              }
              transition={{ duration: REVEAL_MS, ease: EASE }}
            />

            {/* Red moon bloom — fades completely */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-[58%] right-[2%] z-[4] h-[42%] w-[14%] -translate-y-1/2 rounded-full bg-[#e10600]/45 blur-lg"
              initial={{ opacity: 0, scale: 0.35 }}
              animate={
                revealed
                  ? { opacity: [0, 0, 0.7, 0], scale: [0.35, 0.35, 1.15, 1] }
                  : { opacity: 0, scale: 0.35 }
              }
              transition={{ duration: REVEAL_MS + 0.15, ease: EASE }}
            />
          </>
        )}

        {/* Logo unveils left → right with the smoke */}
        <motion.span
          className="relative z-[5] inline-block"
          initial={{
            opacity: 0.2,
            filter: "blur(6px)",
            clipPath: "inset(0 100% 0 0)",
          }}
          animate={
            revealed
              ? {
                  opacity: 1,
                  filter: "blur(0px)",
                  clipPath: "inset(0 0% 0 0)",
                }
              : {
                  opacity: 0.2,
                  filter: "blur(6px)",
                  clipPath: "inset(0 100% 0 0)",
                }
          }
          transition={{ duration: REVEAL_MS, ease: EASE }}
        >
          {image}
        </motion.span>
      </span>
    ) : (
      image
    );

  if (!href) return content;

  return (
    <Link
      href={href}
      data-magnetic
      className="relative inline-block overflow-visible"
      aria-label="Akatsuki Studio home"
    >
      {content}
    </Link>
  );
}
