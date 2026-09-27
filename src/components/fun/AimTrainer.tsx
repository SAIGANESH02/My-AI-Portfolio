'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, RotateCcw, Trophy, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ROUND_SECONDS = 30;
const TARGET_SIZE = 56; // px
const SAI_BEST = 47; // the score to beat
const STORAGE_KEY = 'aim-trainer-best';

type Phase = 'idle' | 'playing' | 'done';

type Target = { id: number; xPct: number; yPct: number };

const randomTarget = (id: number): Target => ({
  id,
  // keep targets fully inside the arena regardless of its pixel size
  xPct: 8 + Math.random() * 84,
  yPct: 10 + Math.random() * 80,
});

const AimTrainer = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [target, setTarget] = useState<Target>(() => randomTarget(0));
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [best, setBest] = useState<number | null>(null);
  const [lastReaction, setLastReaction] = useState<number | null>(null);

  const reactionsRef = useRef<number[]>([]);
  const spawnedAtRef = useRef<number>(0);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setBest(Number(stored));
  }, []);

  // Round timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setPhase('done');
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, timeLeft]);

  // Persist a new personal best
  useEffect(() => {
    if (phase !== 'done') return;
    setBest((prev) => {
      if (prev !== null && hits <= prev) return prev;
      window.localStorage.setItem(STORAGE_KEY, String(hits));
      return hits;
    });
  }, [phase, hits]);

  const start = useCallback(() => {
    reactionsRef.current = [];
    spawnedAtRef.current = performance.now();
    setHits(0);
    setMisses(0);
    setLastReaction(null);
    setTimeLeft(ROUND_SECONDS);
    setTarget(randomTarget(0));
    setPhase('playing');
  }, []);

  const hitTarget = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // don't let the arena count this as a miss
      if (phase !== 'playing') return;
      const reaction = performance.now() - spawnedAtRef.current;
      reactionsRef.current.push(reaction);
      setLastReaction(Math.round(reaction));
      setHits((h) => h + 1);
      setTarget((prev) => randomTarget(prev.id + 1));
      spawnedAtRef.current = performance.now();
    },
    [phase]
  );

  const missArena = useCallback(() => {
    if (phase !== 'playing') return;
    setMisses((m) => m + 1);
  }, [phase]);

  const totalShots = hits + misses;
  const accuracy = totalShots ? Math.round((hits / totalShots) * 100) : 100;
  const avgReaction = reactionsRef.current.length
    ? Math.round(
        reactionsRef.current.reduce((a, b) => a + b, 0) /
          reactionsRef.current.length
      )
    : 0;

  const beatSai = hits > SAI_BEST;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="flex items-center justify-center gap-2 text-xl font-bold text-foreground">
          <Crosshair className="h-5 w-5 text-red-500" />
          Can you out-aim me?
        </h3>
        <p className="text-sm text-muted-foreground">
          30 seconds. Click the targets. My best is{' '}
          <span className="font-semibold text-foreground">{SAI_BEST}</span>.
        </p>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'Hits', value: hits, tone: 'text-purple-600 dark:text-purple-400' },
          { label: 'Accuracy', value: `${accuracy}%`, tone: 'text-blue-600 dark:text-blue-400' },
          {
            label: 'Reaction',
            value: lastReaction ? `${lastReaction}ms` : '—',
            tone: 'text-green-600 dark:text-green-400',
          },
          { label: 'Time', value: `${timeLeft}s`, tone: 'text-red-600 dark:text-red-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white/60 p-3 text-center dark:bg-black/20"
          >
            <div className={`text-xl font-bold sm:text-2xl ${stat.tone}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Arena */}
      <div
        onClick={missArena}
        className={`relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20 ${
          phase === 'playing' ? 'cursor-crosshair' : ''
        }`}
      >
        <AnimatePresence mode="popLayout">
          {phase === 'playing' && (
            <motion.button
              key={target.id}
              type="button"
              aria-label="target"
              onClick={hitTarget}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{
                left: `${target.xPct}%`,
                top: `${target.yPct}%`,
                width: TARGET_SIZE,
                height: TARGET_SIZE,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg ring-4 ring-white/70 dark:ring-black/30"
            >
              <span className="absolute inset-[30%] rounded-full bg-white/80" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Overlays */}
        {phase !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/40 p-4 text-center backdrop-blur-[2px] dark:bg-black/30">
            {phase === 'done' ? (
              <>
                <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                  {beatSai ? (
                    <>
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      {hits} — you got me
                    </>
                  ) : (
                    <>
                      <Zap className="h-6 w-6 text-purple-500" />
                      {hits} hits
                    </>
                  )}
                </div>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {accuracy}% accuracy · {avgReaction}ms average reaction
                  {best !== null && ` · your best ${best}`}
                  <br />
                  {beatSai
                    ? "Respect. Genuinely didn't expect that."
                    : `${SAI_BEST - hits} short of my score. Run it back.`}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    start();
                  }}
                  className="mt-1 flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Play again
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  start();
                }}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-purple-700"
              >
                <Crosshair className="h-4 w-4" />
                Start 30s round
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs italic text-muted-foreground">
        Clicking empty space counts as a miss — same as it does in ranked.
      </p>
    </div>
  );
};

export default AimTrainer;
