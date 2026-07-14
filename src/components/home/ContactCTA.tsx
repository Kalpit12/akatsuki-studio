"use client";

import { MEDIA } from "@/lib/cloudinary";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ContactCTA() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MEDIA.contactPoster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={MEDIA.contact}
        poster={MEDIA.contactPoster}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/55" />
      {/* Brand red atmosphere */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.28)_0%,transparent_68%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-10%] bottom-[-8%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.16)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        aria-hidden
      />

      <div className="section-padding relative flex min-h-[85vh] flex-col items-center justify-center py-32 text-center">
        <p className="label mb-6 text-accent">Next chapter</p>
        <h2 className="heading-xl max-w-4xl text-balance">
          Anyone Can Create{" "}
          <span className="text-accent">Content</span>
          <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle shadow-[0_0_18px_rgba(225,6,0,0.75)]" />
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          We create{" "}
          <span className="text-white">stories</span>,{" "}
          <span className="text-white">campaigns</span>, and{" "}
          <span className="text-white">experiences</span> that people{" "}
          <span className="text-accent">remember</span>.
        </p>
        <p className="mt-10 font-display text-2xl text-white md:text-3xl">
          Ready to raise the{" "}
          <span className="text-accent">standard</span>?
        </p>
        <div className="mt-4 h-px w-16 bg-accent/80 shadow-[0_0_12px_rgba(225,6,0,0.6)]" aria-hidden />
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <MagneticButton href="/contact">Let&apos;s Talk →</MagneticButton>
        </div>
      </div>
    </section>
  );
}
