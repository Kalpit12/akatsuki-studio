"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RedMoonSmokeProps = {
  className?: string;
  active?: boolean;
  direction?: "ltr" | "converge";
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  heat: number;
  kind: "plume" | "wispy" | "ember";
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function spawn(w: number, h: number, progress: number): Particle {
  const front = w * progress;
  const plume = Math.random() > 0.4;
  const kindRoll = Math.random();

  if (kindRoll > 0.8) {
    return {
      x: rand(Math.max(0, front - w * 0.3), Math.min(w, front + 6)),
      y: rand(h * 0.18, h * 0.82),
      vx: rand(0.35, 1.1),
      vy: rand(-0.2, 0.12),
      life: 0,
      maxLife: rand(35, 75),
      size: rand(0.5, 1.8),
      heat: rand(0.55, 1),
      kind: "ember",
    };
  }

  return {
    x: rand(Math.max(0, front - w * 0.45), Math.min(w, front + 8)),
    y: h * 0.5 + rand(-h * 0.28, h * 0.28),
    vx: rand(0.85, 2.1),
    vy: rand(-0.28, 0.28),
    life: 0,
    maxLife: rand(40, 85),
    size: plume ? rand(8, 22) : rand(3, 9),
    heat: plume ? rand(0.12, 0.45) : rand(0.5, 0.92),
    kind: plume ? "plume" : "wispy",
  };
}

function colorFor(heat: number, alpha: number): string {
  const r = Math.round(100 + heat * 155);
  const g = Math.round(6 + heat * 70);
  const b = Math.round(6 + heat * 55);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Soft L→R red smoke — painted only within the logo’s box. */
export function RedMoonSmoke({
  className,
  active = true,
  direction = "ltr",
}: RedMoonSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let particles: Particle[] = [];
    let seeded = false;
    let spawnBudget = 1;
    const start = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const duration = 2000;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = (w: number, h: number) => {
      if (w < 8 || h < 8) return;
      particles = [];
      for (let i = 0; i < 22; i++) {
        const p = spawn(w, h, 0.1);
        p.life = rand(2, 16);
        particles.push(p);
      }
      seeded = true;
    };

    const syncSize = () => {
      resize();
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!seeded && w > 8 && h > 8) seed(w, h);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    const sizeRetry = window.requestAnimationFrame(syncSize);

    const settleTimer = window.setTimeout(() => {
      spawnBudget = 0.12;
    }, 1200);
    const stopTimer = window.setTimeout(() => {
      spawnBudget = 0;
    }, 1750);

    const tick = (now: number) => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const on = activeRef.current;
      const ease = 1 - Math.pow(1 - progress, 2.2);
      const fadeOut =
        progress < 0.78 ? 1 : Math.max(0, 1 - (progress - 0.78) / 0.22);
      const power = on ? spawnBudget * fadeOut : 0;

      ctx.clearRect(0, 0, w, h);
      if (power <= 0.01 && particles.length === 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      ctx.globalCompositeOperation = "lighter";

      // Feathered oval mist only — no rectangular fillRect bands
      if (power > 0.04) {
        const edge = w * ease;
        const mist = ctx.createRadialGradient(
          edge * 0.5,
          h * 0.5,
          0,
          edge * 0.5,
          h * 0.5,
          Math.max(w * 0.42, h * 0.75),
        );
        mist.addColorStop(0, `rgba(225,6,0,${0.16 * power})`);
        mist.addColorStop(0.5, `rgba(160,0,0,${0.07 * power})`);
        mist.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = mist;
        ctx.beginPath();
        ctx.ellipse(
          edge * 0.48,
          h * 0.5,
          Math.max(edge * 0.55, h * 0.35),
          h * 0.48,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      const target = Math.floor(28 + power * 70);
      const emitN = Math.max(0, Math.round(2 * power));
      for (let i = 0; i < emitN && particles.length < target; i++) {
        particles.push(spawn(w, h, ease));
      }

      const next: Particle[] = [];
      for (const p of particles) {
        p.life += 1;
        p.vy += Math.sin(p.life * 0.07 + p.x * 0.02) * 0.024;
        p.vx *= 0.994;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        const t = p.life / p.maxLife;
        if (t >= 1) continue;

        const fade =
          t < 0.1 ? t / 0.1 : t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1;
        const alpha =
          fade *
          (p.kind === "plume" ? 0.22 : p.kind === "wispy" ? 0.4 : 0.65) *
          Math.min(1, power + 0.15);

        if (alpha < 0.01) {
          next.push(p);
          continue;
        }

        const radius = p.size * (1 + t * (p.kind === "plume" ? 1.05 : 0.22));
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grd.addColorStop(0, colorFor(Math.min(1, p.heat + 0.2), alpha));
        grd.addColorStop(0.4, colorFor(p.heat, alpha * 0.48));
        grd.addColorStop(1, "rgba(70,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      particles = next;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sizeRetry);
      ro.disconnect();
      window.clearTimeout(settleTimer);
      window.clearTimeout(stopTimer);
    };
  }, [direction]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}
