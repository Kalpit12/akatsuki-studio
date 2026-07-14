"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { notifyScroll, resetScrollBridge, registerScrollController } from "@/lib/scroll-bridge";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    registerScrollController({
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    });

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      notifyScroll(e.scroll);
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value);
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.documentElement });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    resetScrollBridge(lenis.scroll);

    return () => {
      registerScrollController(null);
      lenis.destroy();
      lenisRef.current = null;
      resetScrollBridge(0);
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
    };
  }, []);

  return <>{children}</>;
}
