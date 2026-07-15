"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export type MorphRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type MorphState = {
  slug: string;
  coverImage: string;
  from: MorphRect;
};

type WorkMorphContextValue = {
  /** Slug currently morphing (tile → hero) */
  activeSlug: string | null;
  /** True while the expanding overlay is still covering the hero */
  lockHero: boolean;
  startMorph: (args: {
    slug: string;
    coverImage: string;
    from: MorphRect;
  }) => void;
};

const WorkMorphContext = createContext<WorkMorphContextValue | null>(null);

export function useWorkMorph() {
  const ctx = useContext(WorkMorphContext);
  if (!ctx) {
    return {
      activeSlug: null,
      lockHero: false,
      startMorph: () => {},
    } satisfies WorkMorphContextValue;
  }
  return ctx;
}

function heroTarget(): MorphRect {
  if (typeof window === "undefined") {
    return { top: 0, left: 0, width: 1920, height: 800 };
  }
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: Math.max(window.innerHeight * 0.85, 500),
  };
}

export function WorkMorphProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [morph, setMorph] = useState<MorphState | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [lockHero, setLockHero] = useState(false);
  const phaseRef = useRef<"idle" | "expanding" | "exiting">("idle");

  const startMorph = useCallback(
    ({
      slug,
      coverImage,
      from,
    }: {
      slug: string;
      coverImage: string;
      from: MorphRect;
    }) => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        router.push(`/work/${slug}`);
        return;
      }

      phaseRef.current = "expanding";
      setMorph({ slug, coverImage, from });
      setLockHero(true);
      setOverlayVisible(true);
      router.push(`/work/${slug}`);
      window.scrollTo(0, 0);
    },
    [router],
  );

  const onExpandComplete = useCallback(() => {
    if (phaseRef.current !== "expanding") return;
    phaseRef.current = "exiting";
    // Unlock hero first so it sits under the fading overlay
    setLockHero(false);
    setOverlayVisible(false);
  }, []);

  const onExitComplete = useCallback(() => {
    phaseRef.current = "idle";
    setMorph(null);
  }, []);

  const value = useMemo<WorkMorphContextValue>(
    () => ({
      activeSlug: morph?.slug ?? null,
      lockHero,
      startMorph,
    }),
    [morph?.slug, lockHero, startMorph],
  );

  const target = heroTarget();

  return (
    <WorkMorphContext.Provider value={value}>
      {children}

      <AnimatePresence onExitComplete={onExitComplete}>
        {overlayVisible && morph ? (
          <motion.div
            key={`morph-${morph.slug}`}
            className="pointer-events-none fixed z-[80] overflow-hidden bg-black will-change-[top,left,width,height,border-radius]"
            initial={{
              top: morph.from.top,
              left: morph.from.left,
              width: morph.from.width,
              height: morph.from.height,
              borderRadius: 24,
            }}
            animate={{
              top: target.top,
              left: target.left,
              width: target.width,
              height: target.height,
              borderRadius: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={onExpandComplete}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={morph.coverImage}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/25 to-transparent" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </WorkMorphContext.Provider>
  );
}
