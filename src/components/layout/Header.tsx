"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { MoonSplash } from "@/components/brand/MoonSplash";
import { cn } from "@/lib/utils";
import { subscribeScroll } from "@/lib/scroll-bridge";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      data-magnetic
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "label link-underline relative isolate transition-colors hover:text-white",
        active ? "text-white" : "text-muted",
      )}
    >
      <MoonSplash active={hovered} />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    return subscribeScroll((y, delta) => {
      setScrolled(y > 80);

      if (y < 64) {
        setNavVisible(true);
      } else if (delta > 6) {
        setNavVisible(false);
      } else if (delta < -6) {
        setNavVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navVisible) setOpen(false);
  }, [navVisible]);

  const navLinks = NAV_LINKS.map((link) => (
    <NavLink
      key={link.href}
      href={link.href}
      label={link.label}
      active={pathname === link.href}
    />
  ));

  const menuButton = (
    <button
      type="button"
      aria-label="Toggle menu"
      className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
      onClick={() => setOpen((v) => !v)}
    >
      <span className={cn("h-px w-6 bg-white transition", open && "translate-y-2 rotate-45")} />
      <span className={cn("h-px w-6 bg-white transition", open && "opacity-0")} />
      <span className={cn("h-px w-6 bg-white transition", open && "-translate-y-2 -rotate-45")} />
    </button>
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "glass py-4" : "bg-transparent py-6 md:py-8",
          !navVisible && scrolled && "py-3 md:py-4",
        )}
      >
        <div
          className={cn(
            "section-padding flex flex-col items-center transition-[gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            navVisible ? "gap-5 md:gap-6" : "gap-0",
          )}
        >
          <div className="relative flex w-full items-center justify-center">
            <Logo className="h-11 w-auto md:h-14" priority />
            <AnimatePresence>
              {navVisible ? (
                <motion.div
                  key="header-actions"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-3"
                >
                  <Link
                    href="/contact"
                    data-magnetic
                    onMouseEnter={() => setCtaHovered(true)}
                    onMouseLeave={() => setCtaHovered(false)}
                    onFocus={() => setCtaHovered(true)}
                    onBlur={() => setCtaHovered(false)}
                    className="relative isolate hidden overflow-visible rounded-full border border-white/20 px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition hover:border-accent hover:text-accent md:inline-flex lg:px-6 lg:py-2.5 lg:text-xs"
                  >
                    <MoonSplash active={ctaHovered} />
                    <span className="relative z-10">Start a Project</span>
                  </Link>
                  {menuButton}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {navVisible ? (
              <motion.nav
                key="header-nav"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="hidden items-center gap-10 overflow-hidden lg:flex"
              >
                {navLinks}
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="section-padding flex flex-col gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="heading-md text-white"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
              >
                <Link
                  href="/contact"
                  className="heading-md text-accent"
                  onClick={() => setOpen(false)}
                >
                  Start a Project
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="section-padding py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Logo className="mb-6 h-20 w-auto md:h-24" href="/" />
            <p className="mt-4 max-w-md text-muted">{SITE.description}</p>
          </div>
          <div className="lg:col-span-1">
            <p className="label mb-4">Navigate</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-4">Connect</p>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a href={`mailto:${SITE.email}`} className="transition hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.address}</li>
              <li>
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Akatsuki Studio on Instagram"
                  data-magnetic
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <span>@akatsukistudioke</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} Akatsuki Studio Kenya. All rights reserved.</span>
          <span>Crafted by Nexora Digital with ❤️</span>
        </div>
      </div>
    </footer>
  );
}
