'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ChevronDown } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// gpt-4o-mini list price, USD per 1M tokens. Update if you change CHAT_MODEL.
const PRICE_IN_PER_1M = 0.15;
const PRICE_OUT_PER_1M = 0.6;

export type PerfStats = {
  ttftMs: number | null;
  totalMs: number | null;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  sessionCostUsd: number;
  cached: boolean;
};

const EMPTY: PerfStats = {
  ttftMs: null,
  totalMs: null,
  promptTokens: 0,
  completionTokens: 0,
  costUsd: 0,
  sessionCostUsd: 0,
  cached: false,
};

/**
 * Tracks time-to-first-token, round-trip time, and estimated spend for each
 * chat turn. Wire the returned callbacks into useChat's lifecycle.
 */
export const usePerfMeter = () => {
  const [stats, setStats] = useState<PerfStats>(EMPTY);
  const startedAtRef = useRef<number | null>(null);
  const ttftRef = useRef<number | null>(null);
  const sessionCostRef = useRef(0);

  const onSend = useCallback(() => {
    startedAtRef.current = performance.now();
    ttftRef.current = null;
    setStats((s) => ({ ...s, ttftMs: null, totalMs: null, cached: false }));
  }, []);

  const onResponseHeaders = useCallback((response: Response) => {
    const cached = response.headers.get('x-chat-cache') === 'HIT';
    setStats((s) => ({ ...s, cached }));
  }, []);

  // Call on the first streamed token of the turn.
  const onFirstToken = useCallback(() => {
    if (ttftRef.current !== null || startedAtRef.current === null) return;
    ttftRef.current = performance.now() - startedAtRef.current;
    setStats((s) => ({ ...s, ttftMs: Math.round(ttftRef.current as number) }));
  }, []);

  const onDone = useCallback(
    (usage?: { promptTokens?: number; completionTokens?: number }) => {
      const totalMs =
        startedAtRef.current !== null
          ? Math.round(performance.now() - startedAtRef.current)
          : null;
      const promptTokens = usage?.promptTokens ?? 0;
      const completionTokens = usage?.completionTokens ?? 0;
      const costUsd =
        (promptTokens / 1_000_000) * PRICE_IN_PER_1M +
        (completionTokens / 1_000_000) * PRICE_OUT_PER_1M;
      sessionCostRef.current += costUsd;
      setStats((s) => ({
        ...s,
        totalMs,
        promptTokens,
        completionTokens,
        costUsd,
        sessionCostUsd: sessionCostRef.current,
      }));
    },
    []
  );

  return { stats, onSend, onResponseHeaders, onFirstToken, onDone };
};

const fmtCost = (v: number) => (v < 0.01 ? `$${v.toFixed(5)}` : `$${v.toFixed(3)}`);

const PerfMeter = ({ stats }: { stats: PerfStats }) => {
  const [open, setOpen] = useState(false);

  // Nothing measured yet — stay out of the way.
  if (stats.ttftMs === null && stats.totalMs === null) return null;

  const rows: [string, string][] = [
    ['Time to first token', stats.ttftMs !== null ? `${stats.ttftMs} ms` : '—'],
    ['Round trip', stats.totalMs !== null ? `${stats.totalMs} ms` : '—'],
    ['Prompt tokens', stats.promptTokens.toLocaleString()],
    ['Completion tokens', stats.completionTokens.toLocaleString()],
    ['This message', fmtCost(stats.costUsd)],
    ['Session total', fmtCost(stats.sessionCostUsd)],
  ];

  // Bottom-left corner. Next's dev-mode indicator overlaps this during local
  // development only — it is not part of a production build, so the corner is
  // clear on the deployed site.
  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 z-40 font-mono text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-neutral-900/95 dark:hover:bg-neutral-900"
        aria-expanded={open}
      >
        <Activity className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
        <span className="text-muted-foreground hidden sm:inline">
          live stats
        </span>
        <span className="text-foreground">
          {stats.ttftMs !== null ? `${stats.ttftMs}ms` : '—'}
        </span>
        <span className="text-muted-foreground">
          {fmtCost(stats.sessionCostUsd)}
        </span>
        {stats.cached && (
          <span className="rounded bg-green-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
            CACHED
          </span>
        )}
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="mt-2 w-64 rounded-xl border border-black/10 bg-white/90 p-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-black/80"
          >
            <p className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
              Live inference stats
            </p>
            <dl className="space-y-1">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 border-t border-black/5 pt-2 text-[10px] leading-snug text-muted-foreground dark:border-white/5">
              Cost estimated from gpt-4o-mini list price. Cutting this number is
              literally my day job.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerfMeter;
