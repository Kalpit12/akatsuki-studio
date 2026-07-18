"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";
import { MEDIA } from "@/lib/cloudinary";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border-b border-white/15 bg-transparent py-3.5 text-base text-white outline-none transition placeholder:text-white/25 focus:border-accent focus:shadow-[0_1px_0_0_rgba(225,6,0,0.85)]";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
      window.setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-28 md:pt-36">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MEDIA.contactImage}
        alt=""
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover object-center opacity-20"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background via-background/85 to-background"
        aria-hidden
      />
      {/* Brand red atmosphere */}
      <div
        className="pointer-events-none fixed -top-32 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.22)_0%,transparent_68%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-[-12%] left-[-8%] -z-10 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.12)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="section-padding pb-10 md:pb-14">
        <p className="label mb-4 text-accent">Contact</p>
        <div className="relative flex flex-col gap-6 border-b border-accent/25 pb-10 md:flex-row md:items-end md:justify-between md:pb-12">
          <span
            className="pointer-events-none absolute bottom-0 left-0 h-px w-24 bg-accent md:w-36"
            aria-hidden
          />
          <h1 className="heading-xl max-w-3xl text-balance">
            Tell us about the{" "}
            <span className="text-accent">project</span>
            <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle shadow-[0_0_18px_rgba(225,6,0,0.7)]" />
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted md:pb-2 md:text-right">
            Share what you&apos;re building, the outcome you need, and when you need it.
          </p>
        </div>
      </div>

      <div className="section-padding grid gap-16 pb-28 lg:grid-cols-12 lg:gap-20 lg:pb-36">
        <aside className="flex flex-col justify-between gap-12 lg:col-span-4">
          <div className="space-y-0 border-t border-accent/20">
            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-start justify-between gap-4 border-b border-white/10 py-5 transition-colors hover:border-accent/40"
            >
              <div>
                <p className="label mb-2 text-accent/80">Email</p>
                <p className="text-sm text-white transition group-hover:text-accent md:text-base">
                  {SITE.email}
                </p>
              </div>
              <span className="mt-1 text-accent opacity-0 transition group-hover:opacity-100" aria-hidden>
                →
              </span>
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 border-b border-white/10 py-5 transition-colors hover:border-accent/40"
            >
              <div>
                <p className="label mb-2 text-accent/80">Instagram</p>
                <p className="text-sm text-white transition group-hover:text-accent md:text-base">
                  @akatsukistudioke
                </p>
              </div>
              <span className="mt-1 text-accent opacity-0 transition group-hover:opacity-100" aria-hidden>
                →
              </span>
            </a>
          </div>

          <p className="max-w-xs border-l-2 border-accent/50 pl-4 text-xs leading-relaxed text-muted">
            Typical reply within one business day. No pitch decks — just a straight
            read on whether we can make the work land.
          </p>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8"
          noValidate={false}
        >
          <BorderBeam duration={10} contentClassName="p-6 md:p-10 lg:p-12">
            <div className="mb-10 flex flex-col gap-2 border-b border-accent/15 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label mb-2 text-accent">Start a brief</p>
                <h2 className="font-display text-2xl text-white md:text-3xl">
                  Tell us about the project.
                </h2>
              </div>
              <p className="text-xs text-muted md:text-right">
                All fields marked <span className="text-accent">*</span> required
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:gap-x-10">
              <div>
                <label htmlFor="name" className="label mb-1 block">
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="label mb-1 block">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@brand.com"
                  className={fieldClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="company" className="label mb-1 block">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  placeholder="Your company or brand"
                  className={fieldClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="message" className="label mb-1 block">
                  Project details <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="What are you building — and by when?"
                  className={cn(fieldClass, "min-h-[8rem] resize-y")}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-accent/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <MagneticButton
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
              >
                {status === "loading" ? "Sending…" : "Send message →"}
              </MagneticButton>

              <div className="min-h-[1.25rem] text-sm" aria-live="polite">
                {status === "success" && (
                  <p className="text-accent">Message sent. We&apos;ll be in touch soon.</p>
                )}
                {status === "error" && (
                  <p className="text-[#ff6b6b]">Something went wrong. Please try again.</p>
                )}
                {status === "idle" && (
                  <p className="text-muted">No spam. Just a real reply.</p>
                )}
              </div>
            </div>
          </BorderBeam>
        </form>
      </div>
    </div>
  );
}
