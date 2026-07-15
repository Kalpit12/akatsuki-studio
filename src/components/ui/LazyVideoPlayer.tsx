"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIntroReady } from "@/hooks/useIntroReady";

/** Shared studio control chrome — accent red, mono labels, film edges */
const controlBase =
  "group relative inline-flex items-center gap-2.5 overflow-hidden border bg-black/60 px-3 py-2 backdrop-blur-md transition duration-300";

const controlIdle =
  "border-white/20 text-white/75 hover:border-accent/70 hover:bg-black/75 hover:text-accent";

const controlActive =
  "border-accent/55 bg-accent/10 text-accent hover:border-accent hover:bg-accent/15";

function VolumeIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m16 9 5 5M21 9l-5 5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M18.2 5.8a8 8 0 0 1 0 12.4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function SoundBars() {
  return (
    <span className="studio-sound-bars" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function StudioControlButton({
  active = false,
  onClick,
  label,
  ariaLabel,
  children,
  pulse = false,
  showBars = false,
}: {
  active?: boolean;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
  pulse?: boolean;
  showBars?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        controlBase,
        active ? controlActive : controlIdle,
        pulse && "studio-control-muted",
        "active:scale-[0.97]",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-px transition-colors duration-300",
          active ? "bg-accent shadow-[0_0_8px_rgba(225,6,0,0.65)]" : "bg-white/25 group-hover:bg-accent",
        )}
        aria-hidden
      />
      {showBars ? <SoundBars /> : children}
      <span
        key={label}
        className="studio-control-label font-mono text-[9px] tracking-[0.22em] uppercase"
      >
        {label}
      </span>
    </button>
  );
}

export type LazyVideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  /** Muted autoplay when in view; starts buffering early to avoid lag */
  playInView?: boolean;
  /** Show play/pause + mute controls */
  showControls?: boolean;
  /** Mute only (no play/pause). Useful for autoplay sections. */
  showMuteOnly?: boolean;
  loop?: boolean;
  /** Large centered play button when paused (ignored when playInView) */
  showPlayOverlay?: boolean;
};

export function LazyVideoPlayer({
  src,
  poster,
  className,
  videoClassName,
  playInView = false,
  showControls = true,
  showMuteOnly = false,
  loop = true,
  showPlayOverlay = true,
}: LazyVideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantPlay = useRef(false);
  const mutedRef = useRef(true);
  const [srcLoaded, setSrcLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [deepPreload, setDeepPreload] = useState(false);
  const introReady = useIntroReady();

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !wantPlay.current) return;
    video.muted = mutedRef.current;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const pause = useCallback(() => {
    wantPlay.current = false;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaying(false);
  }, []);

  // After src mounts / changes, play when ready if requested
  useEffect(() => {
    if (!srcLoaded) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = mutedRef.current;
    const onReady = () => tryPlay();

    if (video.readyState >= 2) onReady();
    else {
      video.addEventListener("canplay", onReady);
      video.addEventListener("loadeddata", onReady);
    }

    return () => {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [src, srcLoaded, tryPlay]);

  // Ambient: attach + play only when near / in view (after intro)
  useEffect(() => {
    if (!playInView || !introReady) return;
    const root = rootRef.current;
    if (!root) return;

    const warm = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSrcLoaded(true);
          warm.disconnect();
        }
      },
      { rootMargin: "220px 0px", threshold: 0 },
    );

    const playObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          wantPlay.current = true;
          setDeepPreload(true);
          setSrcLoaded(true);
          tryPlay();
        } else {
          setDeepPreload(false);
          pause();
        }
      },
      { threshold: 0.25, rootMargin: "0px" },
    );

    warm.observe(root);
    playObs.observe(root);
    return () => {
      warm.disconnect();
      playObs.disconnect();
    };
  }, [playInView, introReady, tryPlay, pause]);

  const play = useCallback(async () => {
    setSrcLoaded(true);
    wantPlay.current = true;
    const video = videoRef.current;
    if (!video) return;

    if (!video.getAttribute("src") && !video.currentSrc) {
      return;
    }

    try {
      video.muted = mutedRef.current;
      await video.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [playing, play, pause]);

  useEffect(() => {
    mutedRef.current = muted;
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) video.volume = 1;
  }, [muted, srcLoaded]);

  function handleToggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const video = videoRef.current;
    const next = !muted;
    mutedRef.current = next;
    setMuted(next);
    if (video) {
      video.muted = next;
      if (!next) video.volume = 1;
      if (wantPlay.current || playing) {
        void video.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
  }

  const showMute = showControls || showMuteOnly;
  const showPlayButton = showControls && !showMuteOnly;

  return (
    <div ref={rootRef} className={cn("relative overflow-hidden bg-black", className)}>
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            playing && srcLoaded ? "opacity-0" : "opacity-100",
          )}
          loading={playInView ? "eager" : "lazy"}
          decoding="async"
          aria-hidden
        />
      ) : null}

      <video
        ref={videoRef}
        className={cn("h-full w-full object-cover", videoClassName)}
        src={srcLoaded ? src : undefined}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        autoPlay={playInView}
        preload={srcLoaded ? (deepPreload || playing ? "auto" : "metadata") : "none"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {showPlayOverlay && !playing && !playInView ? (
        <button
          type="button"
          onClick={() => void play()}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
          aria-label="Play video"
        >
          <span
            className={cn(
              controlBase,
              "px-5 py-3",
              controlIdle,
            )}
          >
            <span className="absolute inset-y-0 left-0 w-px bg-accent" aria-hidden />
            <PlayIcon />
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase">
              Play
            </span>
          </span>
        </button>
      ) : null}

      {showMute ? (
        <div
          className={cn(
            "absolute z-20 flex flex-wrap items-center justify-end gap-2",
            showMuteOnly
              ? "top-3 right-3 md:top-4 md:right-4"
              : "right-3 bottom-3 md:right-4 md:bottom-4",
          )}
        >
          {showPlayButton ? (
            <StudioControlButton
              active={playing}
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              label={playing ? "Pause" : "Play"}
              ariaLabel={playing ? "Pause video" : "Play video"}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </StudioControlButton>
          ) : null}
          <StudioControlButton
            active={!muted}
            onClick={handleToggleMute}
            label={muted ? "Sound" : "Mute"}
            ariaLabel={muted ? "Unmute video" : "Mute video"}
            pulse={muted}
            showBars={!muted}
          >
            <VolumeIcon muted={muted} />
          </StudioControlButton>
        </div>
      ) : null}
    </div>
  );
}
