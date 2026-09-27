'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Real questions worth asking — these double as the rotating input placeholder
 * and the scrolling suggestion rail, so visitors always have a way in.
 */
export const SUGGESTED_QUESTIONS = [
  'How did you cut inference costs by 85%?',
  "What's your take on RAG?",
  'What are you working on right now?',
  'Tell me about the voice AI at XSELL',
  'What does your Google contract involve?',
  'Show me your best project',
  'Why should I hire you?',
  'What was the hardest bug you shipped past?',
  'How do you make an LLM respond in under a second?',
  'Do you know Rust?',
  "What's your biggest weakness?",
  'Can I beat you at Valorant?',
];

/** Cycles through the questions as the input's placeholder. */
export const useRotatingPlaceholder = (active: boolean) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SUGGESTED_QUESTIONS.length),
      3200
    );
    return () => window.clearInterval(id);
  }, [active]);

  return SUGGESTED_QUESTIONS[index];
};

/** Animated placeholder overlay — sits behind a transparent input. */
export const RotatingPlaceholder = ({ text }: { text: string }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28 }}
        className="truncate text-base text-neutral-500 dark:text-neutral-400"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  </div>
);

/**
 * Continuously scrolling rail of clickable questions. Duplicated once so the
 * translate loop is seamless; pauses on hover so a question can be clicked.
 */
export const SuggestionRail = ({
  onPick,
}: {
  onPick: (question: string) => void;
}) => {
  const track = [...SUGGESTED_QUESTIONS, ...SUGGESTED_QUESTIONS];

  // A mask fades the pills out at both edges. Gradient overlays were wrong
  // here — they hardcode a background colour, so they only looked right on a
  // pure white or pure black page.
  const edgeFade = {
    maskImage:
      'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
    WebkitMaskImage:
      'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
  } as const;

  return (
    <div className="relative w-full max-w-3xl overflow-hidden" style={edgeFade}>

      <div className="group flex w-max gap-2 py-1 animate-[suggestion-scroll_44s_linear_infinite] hover:[animation-play-state:paused]">
        {track.map((q, i) => (
          <button
            key={`${q}-${i}`}
            onClick={() => onPick(q)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-neutral-200 bg-white/60 px-3.5 py-1.5 text-xs whitespace-nowrap text-neutral-700 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300 hover:bg-white hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:border-blue-700 dark:hover:bg-neutral-800 dark:hover:text-blue-300"
          >
            <Sparkles className="h-3 w-3 shrink-0 text-blue-500" />
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
