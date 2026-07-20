"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticCursor() {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  // Dot tracks the pointer directly (no spring) so it never feels behind.
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  // Ring keeps a light trail — high stiffness/damping = snappy, not laggy.
  const ringX = useSpring(cursorX, { stiffness: 600, damping: 38, mass: 0.2 });
  const ringY = useSpring(cursorY, { stiffness: 600, damping: 38, mass: 0.2 });
  const scale = useSpring(1, { stiffness: 450, damping: 32, mass: 0.2 });
  const mounted = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    mounted.current = true;
    setVisible(true);

    let rafId = 0;
    let lastX = -100;
    let lastY = -100;

    const move = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        cursorX.set(lastX);
        cursorY.set(lastY);
        rafId = 0;
      });
    };

    const onEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const magnetic = target.closest("[data-magnetic]");
      const cursorLabel = target.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
      if (magnetic || cursorLabel) {
        setHovering(true);
        scale.set(magnetic ? 2.2 : 1.8);
        setLabel(cursorLabel ?? "");
      }
    };

    const onLeave = () => {
      setHovering(false);
      scale.set(1);
      setLabel("");
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [cursorX, cursorY, scale]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden mix-blend-difference md:block"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="h-2 w-2 rounded-full bg-white"
          style={{ scale }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: hovering ? (label ? 96 : 48) : 32,
            height: hovering ? (label ? 96 : 48) : 32,
            opacity: hovering ? 0.6 : 0.25,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.2 }}
          className="flex items-center justify-center rounded-full border border-white/30"
        >
          {label && (
            <span className="text-[10px] uppercase tracking-widest text-white">{label}</span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
