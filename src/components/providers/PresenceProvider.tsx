"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const SESSION_KEY = "akatsuki-presence-id";
const VISITED_KEY = "akatsuki-visit-counted";
const HEARTBEAT_MS = 20_000;

type SitePresenceValue = {
  live: number | null;
  total: number | null;
};

const SitePresenceContext = createContext<SitePresenceValue>({
  live: null,
  total: null,
});

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 32);
  }
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = createSessionId();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return createSessionId();
  }
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const heartbeat = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { live?: number | null };
      if (typeof data.live === "number") setLive(data.live);
    } catch {
      /* fail soft */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sessionId = getOrCreateSessionId();
    let intervalId: number | undefined;

    const start = () => {
      void heartbeat(sessionId);
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          void heartbeat(sessionId);
        }
      }, HEARTBEAT_MS);
    };

    const stop = () => {
      window.clearInterval(intervalId);
      intervalId = undefined;
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    const recordVisit = async () => {
      try {
        const already = sessionStorage.getItem(VISITED_KEY) === "1";
        if (already) {
          const res = await fetch("/api/visits", { cache: "no-store" });
          if (!res.ok || cancelled) return;
          const data = (await res.json()) as { total?: number | null };
          if (typeof data.total === "number") setTotal(data.total);
          return;
        }

        const res = await fetch("/api/visits", {
          method: "POST",
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { total?: number | null };
        if (typeof data.total === "number") {
          setTotal(data.total);
          sessionStorage.setItem(VISITED_KEY, "1");
        }
      } catch {
        /* fail soft */
      }
    };

    start();
    void recordVisit();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [heartbeat]);

  return (
    <SitePresenceContext.Provider value={{ live, total }}>
      {children}
    </SitePresenceContext.Provider>
  );
}

export function useSitePresence() {
  return useContext(SitePresenceContext);
}

/** Compact counts for the footer badge (12 · 1.2k · 1.5M). */
export function formatCompactCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(value);
}
