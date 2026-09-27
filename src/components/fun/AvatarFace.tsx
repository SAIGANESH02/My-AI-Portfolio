'use client';

import { useEffect, useRef } from 'react';
import {
  VISEME_COLS,
  VISEME_OPENNESS,
  VISEME_ROWS,
  VISEME_SHEET,
} from './visemes';

export type AvatarMode =
  /** Nothing happening — hold a closed mouth. Never animates. */
  | 'idle'
  /** Text is streaming in; there is no audio, so pulse gently instead. */
  | 'text'
  /** Live audio — mouth is driven by `level`. */
  | 'voice';

type Props = {
  mode?: AvatarMode;
  /**
   * Live output amplitude, 0..1, only read in 'voice' mode. Passed as a ref so
   * 60fps amplitude updates never re-render the component tree.
   */
  levelRef?: { current: number };
  /** Static fallback when there is no ref to follow. */
  level?: number;
  /** Rendered size in px. */
  size?: number;
  className?: string;
  onClick?: () => void;
};

/** Nearest tile for a normalized openness, using the real measured values. */
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

// Precomputed so the animation loop never allocates.
const POSITIONS = VISEME_OPENNESS.map((_, i) => {
  const col = i % VISEME_COLS;
  const row = Math.floor(i / VISEME_COLS);
  return `${(col / (VISEME_COLS - 1)) * 100}% ${(row / (VISEME_ROWS - 1)) * 100}%`;
});

/**
 * The memoji face, driven frame-by-frame from a sprite sheet.
 *
 * The original implementation looped an 8s video on repeat regardless of what
 * was being said. This picks a mouth shape instead: closed when idle, tracking
 * real output amplitude while speaking. The source video only had 2 keyframes
 * in 192 frames, so seeking it per-frame was not viable — hence the sheet,
 * which is also 92% smaller and works on Safari/iOS where the webm never did.
 *
 * Writes to the DOM node directly inside rAF: at 60fps, going through React
 * state would re-render the whole chat tree on every frame.
 */
const AvatarFace = ({
  mode = 'idle',
  levelRef,
  level = 0,
  size = 112,
  className = '',
  onClick,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const modeRef = useRef(mode);
  const fallbackLevel = useRef(level);
  const externalLevel = useRef(levelRef);
  modeRef.current = mode;
  fallbackLevel.current = level;
  externalLevel.current = levelRef;

  useEffect(() => {
    let raf = 0;
    let smoothed = 0;
    let lastFrame = -1;
    const started = performance.now();

    const tick = (now: number) => {
      let target = 0;

      if (modeRef.current === 'voice') {
        const raw = externalLevel.current?.current ?? fallbackLevel.current;
        target = Math.min(Math.max(raw, 0), 1);
      } else if (modeRef.current === 'text') {
        // No audio to follow — a soft cadence that reads as "talking".
        const t = (now - started) / 1000;
        target = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 7.5));
      }

      // Mouths open faster than they close; symmetric easing looks rubbery.
      const k = target > smoothed ? 0.5 : 0.2;
      smoothed += (target - smoothed) * k;

      const frame = frameFor(smoothed);
      if (frame !== lastFrame && ref.current) {
        ref.current.style.backgroundPosition = POSITIONS[frame];
        lastFrame = frame;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label="Sai's avatar"
      className={`shrink-0 rounded-full bg-white bg-no-repeat dark:bg-neutral-100 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${VISEME_SHEET})`,
        backgroundSize: `${VISEME_COLS * 100}% ${VISEME_ROWS * 100}%`,
        backgroundPosition: POSITIONS[0],
      }}
    />
  );
};

export default AvatarFace;
