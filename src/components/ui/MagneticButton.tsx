"use client";

import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "outline";
  onClick?: () => void;
  type?: "button" | "submit";
};

export function MagneticButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const variants = {
    primary:
      "bg-white text-background hover:bg-accent hover:text-white border-transparent",
    ghost: "bg-transparent text-white hover:text-accent border-transparent",
    outline:
      "bg-transparent text-white border-white/20 hover:border-accent hover:text-accent",
  };

  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.2em] transition-all duration-500 border",
    variants[variant],
    className,
  );

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  if (href) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        data-magnetic
        className={classes}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      data-magnetic
      className={classes}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  );
}
