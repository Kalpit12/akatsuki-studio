"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_MQ } from "@/lib/gsap-mobile";
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

function CompactIconControl({
  onClick,
  ariaLabel,
  active = false,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/75 backdrop-blur-[2px] transition active:scale-95",
        active && "text-accent",
      )}
    >
      {children}
    </button>
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
  /** Muted play while pointer is over the player (homepage sections) */
  playOnHover?: boolean;
  /** Parent-controlled hover (use when overlays sit above the player root) */
  hoverActive?: boolean;
  /** Muted autoplay immediately and keep playing (hero backgrounds) */
  alwaysPlay?: boolean;
  /** Minimum visible ratio before autoplay (default 0.25) */
  playInViewMinRatio?: number;
  /** Drop video src when fully out of view to free decoders */
  unloadWhenHidden?: boolean;
  /** For playOnHover: attach + buffer when near viewport before first hover */
  warmWhenNear?: boolean;
  /** When playInView: only autoplay while true (e.g. dominant story in a section) */
  ambientActive?: boolean;
  /** Show play/pause + mute controls */
  showControls?: boolean;
  /** Mute only (no play/pause). Useful for autoplay sections. */
  showMuteOnly?: boolean;
  loop?: boolean;
  /** Large centered play button when paused (ignored when playInView) */
  showPlayOverlay?: boolean;
  /** Mobile work films: only this src may play; others auto-pause */
  soloPlaybackKey?: string | null;
  onSoloPlaybackClaim?: (src: string) => void;
  /** Mobile tap-toggle sections: show play/pause beside mute (requires hoverActive) */
  mobileTapControls?: boolean;
  /** Sync parent hover state when mobile pause is tapped */
  onMobilePause?: () => void;
  /** Mobile tap controls: icon-only buttons without studio chrome (reel tiles) */
  mobileTapControlsMinimal?: boolean;
};

export function LazyVideoPlayer({
  src,
  poster,
  className,
  videoClassName,
  playInView = false,
  playOnHover = false,
  hoverActive,
  alwaysPlay = false,
  playInViewMinRatio = 0.25,
  unloadWhenHidden = false,
  warmWhenNear = false,
  ambientActive = true,
  showControls = true,
  showMuteOnly = false,
  loop = true,
  showPlayOverlay = true,
  soloPlaybackKey = null,
  onSoloPlaybackClaim,
  mobileTapControls = false,
  onMobilePause,
  mobileTapControlsMinimal = false,
}: LazyVideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantPlay = useRef(false);
  const mutedRef = useRef(true);
  const [srcLoaded, setSrcLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [deepPreload, setDeepPreload] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const introReady = useIntroReady();
  const pointerHover = hoverActive ?? hovered;
  const hoverControlled = hoverActive !== undefined;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const attachSrc = useCallback(
    (video: HTMLVideoElement) => {
      if (!video.currentSrc && src) {
        video.src = src;
        video.load();
      }
    },
    [src],
  );

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !wantPlay.current) return;
    attachSrc(video);
    video.muted = mutedRef.current;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [attachSrc]);

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

    attachSrc(video);
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
  }, [src, srcLoaded, tryPlay, attachSrc]);

  // Hero: always-on muted autoplay (never pause on scroll)
  useEffect(() => {
    if (!alwaysPlay || !introReady) return;
    wantPlay.current = true;
    setSrcLoaded(true);
    setDeepPreload(true);
    mutedRef.current = true;
    setMuted(true);

    const video = videoRef.current;
    if (!video) return;

    attachSrc(video);
    video.muted = true;
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
  }, [alwaysPlay, introReady, tryPlay, attachSrc, src]);

  // Hover: play only while pointer is over the player (or parent sets hoverActive)
  useEffect(() => {
    if (alwaysPlay || !playOnHover || !introReady) return;

    if (pointerHover) {
      wantPlay.current = true;
      setSrcLoaded(true);
      setDeepPreload(true);
      tryPlay();
      return;
    }

    // Keep buffered src after hover ends — only pause. Unload is handled by
    // the near/viewport observer when warmWhenNear or unloadWhenHidden is set.
    setDeepPreload(false);
    pause();
  }, [
    playOnHover,
    pointerHover,
    introReady,
    tryPlay,
    pause,
    alwaysPlay,
  ]);

  // Warm hover videos before first pointer enter; optionally unload when far away
  useEffect(() => {
    if (alwaysPlay || !playOnHover || !introReady) return;
    if (!warmWhenNear && !unloadWhenHidden) return;
    const root = rootRef.current;
    if (!root) return;

    const warm = new IntersectionObserver(
      ([entry]) => {
        const near = !!entry?.isIntersecting;

        if (near) {
          setSrcLoaded(true);
          // Metadata is enough until hover; deep preload kicks in on pointer enter
          return;
        }

        if (!unloadWhenHidden || pointerHover) return;

        pause();
        const video = videoRef.current;
        if (video) {
          video.removeAttribute("src");
          video.load();
        }
        setSrcLoaded(false);
        setDeepPreload(false);
      },
      {
        rootMargin: warmWhenNear ? "320px 0px" : "0px",
        threshold: 0,
      },
    );

    warm.observe(root);
    return () => warm.disconnect();
  }, [
    playOnHover,
    warmWhenNear,
    unloadWhenHidden,
    introReady,
    alwaysPlay,
    pointerHover,
    pause,
  ]);

  // Ambient: attach + play only when near / in view (after intro)
  useEffect(() => {
    if (alwaysPlay || playOnHover || !playInView || !introReady) return;
    const root = rootRef.current;
    if (!root) return;

    const warm = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSrcLoaded(true);
          warm.disconnect();
        }
      },
      { rootMargin: "100px 0px", threshold: 0 },
    );

    const playObs = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        const visibleEnough =
          !!entry?.isIntersecting && ratio >= playInViewMinRatio;
        const shouldPlay = visibleEnough && ambientActive;

        if (shouldPlay) {
          wantPlay.current = true;
          setDeepPreload(true);
          setSrcLoaded(true);
          const video = videoRef.current;
          if (video) attachSrc(video);
          tryPlay();
          return;
        }

        setDeepPreload(false);
        pause();

        if (unloadWhenHidden && !entry?.isIntersecting) {
          const video = videoRef.current;
          if (video) {
            video.removeAttribute("src");
            video.load();
          }
          setSrcLoaded(false);
          setPlaying(false);
        }
      },
      {
        threshold: [0, 0.15, 0.35, 0.5, 0.55, 0.7, 0.85, 1],
        rootMargin: "0px",
      },
    );

    warm.observe(root);
    playObs.observe(root);
    return () => {
      warm.disconnect();
      playObs.disconnect();
    };
  }, [playInView, playInViewMinRatio, unloadWhenHidden, ambientActive, introReady, tryPlay, pause, alwaysPlay, attachSrc]);

  useEffect(() => {
    if (alwaysPlay || !playInView || ambientActive) return;
    pause();
  }, [playInView, ambientActive, pause, alwaysPlay]);

  // Warm metadata when play overlay is shown so the first tap can play immediately.
  useEffect(() => {
    if (alwaysPlay || playOnHover || !playInView || !showPlayOverlay || !introReady) return;
    const root = rootRef.current;
    if (!root) return;

    const warm = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSrcLoaded(true);
          warm.disconnect();
        }
      },
      { rootMargin: "280px 0px", threshold: 0 },
    );

    warm.observe(root);
    return () => warm.disconnect();
  }, [playInView, showPlayOverlay, introReady, alwaysPlay]);

  const play = useCallback(async () => {
    wantPlay.current = true;
    setSrcLoaded(true);
    setDeepPreload(true);

    const video = videoRef.current;
    if (!video) return;

    attachSrc(video);

    // User-initiated play should include sound; ambient/hero autoplay stays muted.
    if (!playInView && !alwaysPlay) {
      mutedRef.current = false;
      setMuted(false);
      video.muted = false;
      video.volume = 1;
    } else {
      video.muted = mutedRef.current;
    }

    try {
      await video.play();
      setPlaying(true);
      onSoloPlaybackClaim?.(src);
      return;
    } catch {
      /* retry once media is ready */
    }

    const onReady = () => {
      if (!playInView) {
        video.muted = false;
        video.volume = 1;
      } else {
        video.muted = mutedRef.current;
      }
      void video
        .play()
        .then(() => {
          setPlaying(true);
          onSoloPlaybackClaim?.(src);
        })
        .catch(() => setPlaying(false));
    };

    if (video.readyState >= 2) onReady();
    else video.addEventListener("canplay", onReady, { once: true });
  }, [attachSrc, playInView, onSoloPlaybackClaim, src]);

  useEffect(() => {
    if (!soloPlaybackKey || soloPlaybackKey === src || !playing) return;
    pause();
  }, [soloPlaybackKey, src, playing, pause]);

  const togglePlay = useCallback(() => {
    if (playing) {
      pause();
      if (isMobile && mobileTapControls) onMobilePause?.();
    } else void play();
  }, [playing, play, pause, isMobile, mobileTapControls, onMobilePause]);

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

  const showMobilePlaybackControls =
    isMobile &&
    showPlayOverlay &&
    !showControls &&
    !showMuteOnly &&
    !playInView &&
    !playOnHover &&
    !alwaysPlay &&
    playing;

  const showMobileTapControlsUi =
    isMobile &&
    mobileTapControls &&
    playOnHover &&
    hoverControlled &&
    !alwaysPlay;

  const showMobileTapControlsActive =
    showMobileTapControlsUi && (pointerHover || playing);

  const showMute =
    showControls ||
    showMuteOnly ||
    showMobilePlaybackControls ||
    showMobileTapControlsActive ||
    (playOnHover && (pointerHover || playing));
  const showPlayButton =
    (showControls && !showMuteOnly) ||
    showMobilePlaybackControls ||
    showMobileTapControlsActive;

  const useCompactMobileTapControls =
    showMobileTapControlsActive && mobileTapControlsMinimal;

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden bg-black", className)}
      onPointerEnter={
        playOnHover && !hoverControlled ? () => setHovered(true) : undefined
      }
      onPointerLeave={
        playOnHover && !hoverControlled ? () => setHovered(false) : undefined
      }
    >
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            playing && srcLoaded ? "opacity-0" : "opacity-100",
          )}
          loading={playInView || alwaysPlay ? "eager" : "lazy"}
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
        autoPlay={alwaysPlay}
        preload={srcLoaded ? (deepPreload || playing || alwaysPlay ? "auto" : "metadata") : "none"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {showPlayOverlay && !playing && !playInView && !playOnHover && !alwaysPlay ? (
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
            useCompactMobileTapControls
              ? "top-2.5 right-2.5 gap-1 md:top-4 md:right-4 md:gap-2"
              : showMuteOnly || showMobileTapControlsActive
                ? "top-3 right-3 md:top-4 md:right-4"
                : "right-3 bottom-3 md:right-4 md:bottom-4",
          )}
        >
          {showPlayButton ? (
            useCompactMobileTapControls ? (
              <CompactIconControl
                active={playing}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                ariaLabel={playing ? "Pause video" : "Play video"}
              >
                {playing ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}
              </CompactIconControl>
            ) : (
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
            )
          ) : null}
          {useCompactMobileTapControls ? (
            <CompactIconControl
              active={!muted}
              onClick={handleToggleMute}
              ariaLabel={muted ? "Unmute video" : "Mute video"}
            >
              <VolumeIcon muted={muted} />
            </CompactIconControl>
          ) : (
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
          )}
        </div>
      ) : null}
    </div>
  );
}
