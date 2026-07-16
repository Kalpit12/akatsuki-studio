"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticCursor() {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
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

    window.addEventListener("mousemove", move);
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
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
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
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
