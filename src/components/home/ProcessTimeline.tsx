"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "@/lib/constants";
import { useMobileCenterActive } from "@/hooks/useMobileCenterActive";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function ProcessTimeline() {
  const ref = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { lockScrollSelection } = useMobileCenterActive(
    ref,
    'button[class*="process-step-"]',
    setActiveStep,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".process-step"),
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el.querySelector(".process-grid"),
            start: "top 78%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-padding max-md:py-20 md:py-36">
      <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-4">The system</p>
          <h2 className="heading-lg max-w-2xl text-balance">
            One connected engine, built to turn attention into impact.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted md:pb-2">
          Strategy, craft, and rollout as one system — not a pile of disconnected
          deliverables.
        </p>
      </div>

      <div className="process-grid grid grid-cols-1 border-t border-l border-white/15 md:grid-cols-2 lg:grid-cols-3">
        {PROCESS_STEPS.map((step, i) => {
          const isActive = activeStep === i;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => {
                setActiveStep(i);
                lockScrollSelection();
              }}
              className={cn(
                "process-step group flex h-full min-h-[15rem] flex-col border-r border-b border-white/15 p-8 text-left transition-colors duration-300 md:min-h-[17rem] md:p-10",
                `process-step-${i}`,
                isActive &&
                  "max-md:border-accent/25 max-md:bg-white/[0.03]",
              )}
            >
              <span className="mb-5 block font-mono text-xs tracking-[0.2em] text-accent md:mb-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className={cn(
                  "heading-md mb-3 transition-colors duration-300 md:mb-4",
                  "md:group-hover:text-accent",
                  isActive && "max-md:text-accent",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "max-w-sm text-sm leading-relaxed transition-colors duration-300 md:text-base",
                  isActive ? "max-md:text-white/75 text-muted" : "text-muted",
                )}
              >
                {step.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
