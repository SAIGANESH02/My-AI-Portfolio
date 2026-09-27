'use client';

import { useEffect, useRef } from 'react';
import { VISEME_IDLE, VISEME_OPENNESS, VISEME_SRCS } from './visemes';

export type AvatarMode =
  /** Nothing happening — hold the resting face. Never animates. */
  | 'idle'
  /** Text is streaming in; there is no audio, so pulse gently instead. */
  | 'text'
  /** Live audio — the mouth follows `levelRef`. */
  | 'voice';

type Props = {
  mode?: AvatarMode;
  /**
   * Live output amplitude, 0..1, only read in 'voice' mode. A ref rather than
   * a prop so 60fps updates never re-render the component tree.
   */
  levelRef?: { current: number };
  /** Rendered size in px. */
  size?: number;
  className?: string;
  onClick?: () => void;
};

/** Nearest frame for a normalized openness, using the real measured values. */
function frameFor(openness: number) {
  let best = 0;
  let bestErr = Infinity;
  for (let i = 0; i < VISEME_OPENNESS.length; i++) {
    const err = Math.abs(VISEME_OPENNESS[i] - openness);
    if (err < bestErr) {
      bestErr = err;
      best = i;
    }
  }
  return best;
}

/** Decode every frame once so swapping src mid-speech never flickers. */
let warmed: HTMLImageElement[] | null = null;
function warmFrames() {
  if (warmed || typeof window === 'undefined') return;
  warmed = VISEME_SRCS.map((src) => {
    const img = new window.Image();
    img.src = src;
    return img;
  });
}

/**
 * The memoji face. One <img> whose source swaps between 24 pre-rendered mouth
 * shapes, chosen from live audio amplitude.
 *
 * Previously this looped an 8s video on repeat regardless of what was being
 * said. A sprite sheet replaced it, but the background-position math produced
 * visible tile seams — two half-faces in one circle. Separate files remove the
 * geometry entirely: there is nothing to misalign.
 *
 * The src is written straight to the DOM node inside rAF; going through React
 * state would re-render the chat tree 60 times a second.
 */
const AvatarFace = ({
  mode = 'idle',
  levelRef,
  size = 112,
  className = '',
  onClick,
}: Props) => {
  const ref = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef(mode);
  const externalLevel = useRef(levelRef);
  modeRef.current = mode;
  externalLevel.current = levelRef;

  useEffect(() => {
    warmFrames();

    let raf = 0;
    let smoothed = 0;
    let lastFrame = -1;
    const started = performance.now();

    const tick = (now: number) => {
      let target = 0;

      if (modeRef.current === 'voice') {
        target = Math.min(Math.max(externalLevel.current?.current ?? 0, 0), 1);
      } else if (modeRef.current === 'text') {
        // No audio to follow — a soft cadence that reads as "talking".
        const t = (now - started) / 1000;
        target = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 7.5));
      }

      // Mouths open faster than they close; symmetric easing looks rubbery.
      smoothed += (target - smoothed) * (target > smoothed ? 0.5 : 0.2);

      const frame = frameFor(smoothed);
      if (frame !== lastFrame && ref.current) {
        ref.current.src = VISEME_SRCS[frame];
        lastFrame = frame;
      }

      // Continuous motion cue alongside the discrete mouth steps — the ring
      // reads smoothly even when the mouth is only stepping a frame or two.
      if (ringRef.current) {
        const live = modeRef.current === 'voice';
        ringRef.current.style.opacity = live ? String(0.2 + smoothed * 0.6) : '0';
        ringRef.current.style.transform = `scale(${1 + smoothed * 0.16})`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full ring-4 ring-red-400/70 dark:ring-red-500/70"
        style={{ opacity: 0, willChange: 'transform, opacity' }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={VISEME_IDLE}
        alt="Sai's avatar"
        width={size}
        height={size}
        draggable={false}
        onClick={onClick}
        className={`relative rounded-full bg-white object-cover select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        style={{ width: size, height: size }}
      />
    </span>
  );
};

export default AvatarFace;
