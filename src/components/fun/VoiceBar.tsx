'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mic, PhoneOff, Radio } from 'lucide-react';
import type { VoicePhase, VoiceTurn } from './useRealtimeVoice';

type Props = {
  phase: VoicePhase;
  error: string;
  secondsLeft: number;
  turns: VoiceTurn[];
  onStart: () => void;
  onStop: () => void;
  /** Hide the live caption strip (e.g. when the page shows it elsewhere). */
  hideCaptions?: boolean;
};

/**
 * Mic control plus the live caption of the turn in progress. Completed turns
 * are handed to the chat history instead, so this only shows what's happening
 * right now.
 */
const VoiceBar = ({
  phase,
  error,
  secondsLeft,
  turns,
  onStart,
  onStop,
  hideCaptions,
}: Props) => {
  const live = phase === 'live';
  const connecting = phase === 'connecting';
  const current = turns.filter((t) => t.partial).slice(-1)[0];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <AnimatePresence mode="wait">
        {live ? (
          <motion.button
            key="live"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onStop()}
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
          >
            <PhoneOff className="h-4 w-4" />
            End · {secondsLeft}s
          </motion.button>
        ) : (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onStart()}
            disabled={connecting}
            className="bg-background/70 hover:bg-accent flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition-all hover:scale-105 disabled:opacity-60"
          >
            {connecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 text-blue-500" />
                Talk to me
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {live && !hideCaptions && (
        <div className="flex max-w-md flex-col items-center gap-1">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Radio className="h-3 w-3 animate-pulse text-red-500" />
            Listening — just talk
          </p>
          {current && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm ${
                current.role === 'user'
                  ? 'text-muted-foreground italic'
                  : 'text-foreground'
              }`}
            >
              {current.role === 'user' && 'you: '}
              {current.text}
            </motion.p>
          )}
        </div>
      )}

      {phase === 'error' && (
        <p className="max-w-xs text-center text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceBar;
