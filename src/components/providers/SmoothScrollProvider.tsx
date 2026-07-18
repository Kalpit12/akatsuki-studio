"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOBILE_MQ } from "@/lib/gsap-mobile";
import { notifyScroll, resetScrollBridge, registerScrollController } from "@/lib/scroll-bridge";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_MQ).matches;

    if (mobile) {
      registerScrollController({
        stop: () => {
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
        },
        start: () => {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
        },
        scrollTo: (y, options) => {
          window.scrollTo({
            top: y,
            behavior: options?.immediate ? "instant" : "smooth",
          });
        },
      });

      const onScroll = () => {
        ScrollTrigger.update();
        notifyScroll(window.scrollY);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      ScrollTrigger.defaults({ scroller: document.documentElement });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      resetScrollBridge(window.scrollY);

      const refresh = () => {
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);

      return () => {
        registerScrollController(null);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
        ScrollTrigger.getAll().forEach((t) => t.kill(true));
        resetScrollBridge(0);
      };
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
      wheelMultiplier: 0.95,
    });

    lenisRef.current = lenis;
    registerScrollController({
      stop: () => lenis.stop(),
      start: () => lenis.start(),
      scrollTo: (y, options) => {
        lenis.scrollTo(y, { immediate: options?.immediate ?? false });
      },
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

    const refresh = () => {
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      registerScrollController(null);
      lenis.destroy();
      lenisRef.current = null;
      resetScrollBridge(0);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
    };
  }, []);

  return <>{children}</>;
}
