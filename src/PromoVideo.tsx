import React, { useEffect, useRef, useState } from 'react';
import { Maximize, Maximize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';

const VIDEO_SRC = '/serbisure-appdemo.mp4#t=0.001';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Promotional video with a scroll-linked "docked -> floating mini player" transformation.
 *
 * - One persistent <video>; never remounted or re-sourced.
 * - `.promo-slot` keeps the 16:9 footprint so the page never shifts.
 * - Docked: player is absolutely positioned inside the slot (native scrolling, no jitter).
 * - Leaving: player becomes `position: fixed` and is driven only by transform (translate + scale),
 *   interpolated between the slot rect and the mini-player rect.
 * - All scroll work runs in one rAF-coalesced handler writing straight to the DOM (no React renders).
 */
export const PromoVideo: React.FC = () => {
  const slotRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const dismissedRef = useRef(false);
  const scrubbingRef = useRef(false);
  const hasStartedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  /* ---------- Scroll-linked transformation ---------- */
  useEffect(() => {
    const slot = slotRef.current;
    const player = playerRef.current;
    const overlay = overlayRef.current;
    const probe = probeRef.current;
    if (!slot || !player || !overlay || !probe) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let mode: 'docked' | 'fixed' = 'docked';
    let state = '';
    let safeBottom = 0;
    let lastW = 0;
    let lastH = 0;

    player.dataset.state = 'docked';
    player.dataset.dismissed = 'false';

    const readSafeArea = () => {
      safeBottom = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
    };

    const setState = (next: string) => {
      if (state !== next) {
        state = next;
        player.dataset.state = next;
      }
    };

    const update = () => {
      raf = 0;
      const rect = slot.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const compact = vw <= 720;

      let miniW = compact
        ? Math.min(240, Math.max(168, vw * 0.5))
        : Math.min(340, Math.max(280, vw * 0.26));
      miniW = Math.round(Math.min(miniW, rect.width * 0.62));
      const margin = compact ? 14 : 24;
      const miniScale = miniW / rect.width;
      const miniH = rect.height * miniScale;
      const miniLeft = vw - margin - miniW;
      const miniTop = vh - margin - safeBottom - miniH;

      // 0 = docked, 1 = fully floating (only float once the user has started the video)
      const startTop = 24;
      const distance = Math.max(180, Math.min(rect.height * 0.9, vh * 0.75));
      const reduced = reduceMotion.matches;
      let progress = hasStartedRef.current ? clamp01((startTop - rect.top) / distance) : 0;
      if (reduced && hasStartedRef.current) progress = rect.bottom <= 0 ? 1 : 0;
      const e = reduced ? progress : easeInOutCubic(progress);

      // A dismissed mini player re-activates once the original section is >= 50% visible again.
      if (dismissedRef.current) {
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visible >= rect.height * 0.5) {
          dismissedRef.current = false;
          player.dataset.dismissed = 'false';
        }
      }

      if (progress <= 0) {
        if (mode !== 'docked') {
          player.style.position = '';
          player.style.top = '';
          player.style.left = '';
          player.style.right = '';
          player.style.bottom = '';
          player.style.width = '';
          player.style.height = '';
          player.style.transform = '';
          player.style.zIndex = '';
          player.style.willChange = '';
          overlay.style.width = '';
          overlay.style.height = '';
          overlay.style.transform = '';
          lastW = 0;
          lastH = 0;
          mode = 'docked';
        }
        player.style.borderRadius = '16px';
        player.style.boxShadow = '0 18px 44px rgba(13, 13, 17, 0.1)';
        setState('docked');
        return;
      }

      if (mode !== 'fixed') {
        player.style.position = 'fixed';
        player.style.top = '0';
        player.style.left = '0';
        player.style.right = 'auto';
        player.style.bottom = 'auto';
        player.style.zIndex = '90';
        player.style.willChange = 'transform';
        mode = 'fixed';
      }
      if (lastW !== rect.width || lastH !== rect.height) {
        player.style.width = `${rect.width}px`;
        player.style.height = `${rect.height}px`;
        lastW = rect.width;
        lastH = rect.height;
      }

      const scale = lerp(1, miniScale, e);
      const x = lerp(rect.left, miniLeft, e);
      const y = lerp(rect.top, miniTop, e);
      player.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

      // Radius and shadow are divided by scale so they read consistently after the transform.
      player.style.borderRadius = `${lerp(16, 14, e) / scale}px`;
      player.style.boxShadow = `0 ${lerp(18, 10, e) / scale}px ${lerp(44, 28, e) / scale}px rgba(13, 13, 17, ${lerp(0.1, 0.32, e)})`;

      // Counter-scale the control layer so buttons keep a constant, usable size.
      overlay.style.width = `${rect.width * scale}px`;
      overlay.style.height = `${rect.height * scale}px`;
      overlay.style.transform = `scale(${1 / scale})`;

      setState(progress >= 0.92 ? 'floating' : 'moving');
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      readSafeArea();
      lastW = 0;
      lastH = 0;
      schedule();
    };

    readSafeArea();
    update();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    reduceMotion.addEventListener('change', schedule);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(slot);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      reduceMotion.removeEventListener('change', schedule);
      resizeObserver.disconnect();
    };
  }, []);

  /* ---------- Playback sync (progress updates bypass React) ---------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf = 0;

    const syncProgress = () => {
      const duration = video.duration || 0;
      const t = video.currentTime;
      const ratio = duration ? t / duration : 0;
      const range = rangeRef.current;
      if (range && !scrubbingRef.current) {
        range.value = String(Math.round(ratio * 1000));
        range.style.setProperty('--fill', `${ratio * 100}%`);
      }
      if (timeRef.current) timeRef.current.textContent = `${formatTime(t)} / ${formatTime(duration)}`;
    };
    const loop = () => {
      syncProgress();
      raf = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      hasStartedRef.current = true;
      setPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(raf);
      syncProgress();
    };
    const onVolume = () => setMuted(video.muted || video.volume === 0);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onPause);
    video.addEventListener('seeked', syncProgress);
    video.addEventListener('timeupdate', syncProgress);
    video.addEventListener('loadedmetadata', syncProgress);
    video.addEventListener('durationchange', syncProgress);
    video.addEventListener('volumechange', onVolume);
    syncProgress();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onPause);
      video.removeEventListener('seeked', syncProgress);
      video.removeEventListener('timeupdate', syncProgress);
      video.removeEventListener('loadedmetadata', syncProgress);
      video.removeEventListener('durationchange', syncProgress);
      video.removeEventListener('volumechange', onVolume);
    };
  }, []);

  /* ---------- Handlers ---------- */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  const onScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const ratio = Number(event.target.value) / 1000;
    video.currentTime = ratio * video.duration;
    event.target.style.setProperty('--fill', `${ratio * 100}%`);
  };

  const enterFullscreen = () => {
    const player = playerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!player || !video) return;
    if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
    else video.webkitEnterFullscreen?.();
  };

  const returnToSection = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slotRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  };

  const dismiss = () => {
    videoRef.current?.pause();
    dismissedRef.current = true;
    if (playerRef.current) playerRef.current.dataset.dismissed = 'true';
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && playerRef.current?.dataset.state === 'floating') dismiss();
  };

  return (
    <section className="promo-video-section" aria-label="SerbiSure promotional video">
      <div className="page-shell">
        <div className="promo-slot" ref={slotRef}>
          <div
            className="promo-player"
            ref={playerRef}
            data-playing={playing}
            role="group"
            aria-label="SerbiSure promotional video player"
            onKeyDown={onKeyDown}
          >
            <video ref={videoRef} className="promo-player__video" src={VIDEO_SRC} playsInline preload="metadata">
              Your browser does not support the video tag.
            </video>

            <div className="promo-player__overlay" ref={overlayRef}>
              <div className="promo-player__surface" onClick={togglePlay} aria-hidden="true" />

              <button
                type="button"
                className="promo-player__big-play"
                aria-label="Play video"
                onClick={togglePlay}
                tabIndex={-1}
              >
                <Play size={26} fill="currentColor" />
              </button>

              <button type="button" className="promo-player__close" aria-label="Close mini player" onClick={dismiss}>
                <X size={14} />
              </button>

              <div className="promo-player__controls">
                <button
                  type="button"
                  className="promo-player__btn"
                  aria-label={playing ? 'Pause video' : 'Play video'}
                  onClick={togglePlay}
                >
                  {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
                <input
                  ref={rangeRef}
                  className="promo-player__range"
                  type="range"
                  min={0}
                  max={1000}
                  step={1}
                  defaultValue={0}
                  aria-label="Seek video"
                  onChange={onScrub}
                  onPointerDown={() => {
                    scrubbingRef.current = true;
                  }}
                  onPointerUp={() => {
                    scrubbingRef.current = false;
                  }}
                  onBlur={() => {
                    scrubbingRef.current = false;
                  }}
                />
                <span className="promo-player__time" ref={timeRef}>
                  0:00 / 0:00
                </span>
                <button
                  type="button"
                  className="promo-player__btn"
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                  onClick={toggleMute}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  type="button"
                  className="promo-player__btn promo-player__btn--fullscreen"
                  aria-label="Fullscreen"
                  onClick={enterFullscreen}
                >
                  <Maximize size={15} />
                </button>
                <button
                  type="button"
                  className="promo-player__btn promo-player__btn--return"
                  aria-label="Return to video section"
                  onClick={returnToSection}
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
          </div>
          <span className="promo-safe-probe" ref={probeRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
