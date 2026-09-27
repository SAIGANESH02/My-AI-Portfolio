'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import AvatarFace from './AvatarFace';
import VoiceBar from './VoiceBar';
import { useRealtimeVoice } from './useRealtimeVoice';

/**
 * Full-screen voice experience: big avatar, live captions of both sides,
 * nothing else competing for attention.
 */
const TalkSurface = () => {
  const voice = useRealtimeVoice();
  const live = voice.phase === 'live';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [voice.turns]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-20">
      <div className="relative">
        <AvatarFace
          mode={live ? 'voice' : 'idle'}
          levelRef={voice.levelRef}
          size={220}
          className={`shadow-xl ring-4 transition-all duration-300 ${
            live ? 'ring-red-400 dark:ring-red-500' : 'ring-black/5 dark:ring-white/10'
          }`}
        />
        {live && (
          <span className="absolute inset-0 animate-ping rounded-full ring-4 ring-red-400/30" />
        )}
      </div>

      <VoiceBar
        phase={voice.phase}
        error={voice.error}
        secondsLeft={voice.secondsLeft}
        turns={voice.turns}
        onStart={voice.start}
        onStop={voice.hangUp}
        hideCaptions
      />

      {voice.phase === 'idle' && (
        <p className="text-muted-foreground max-w-sm text-center text-sm">
          A real conversation, not a chatbot demo. Ask me anything you&apos;d ask
          in a screening call — 90 seconds a go, because realtime audio is
          genuinely expensive.
        </p>
      )}

      {/* Transcript — both sides, streaming as it happens */}
      <div
        ref={scrollRef}
        className="custom-scrollbar max-h-[38vh] w-full max-w-xl space-y-3 overflow-y-auto"
      >
        <AnimatePresence initial={false}>
          {voice.turns.map((turn) => (
            <motion.div
              key={turn.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  turn.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-accent text-foreground'
                } ${turn.partial ? 'opacity-70' : ''}`}
              >
                {turn.text}
                {turn.partial && (
                  <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-current align-middle" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TalkSurface;
