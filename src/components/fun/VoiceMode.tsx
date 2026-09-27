'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mic, PhoneOff, Radio } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'connecting' | 'live' | 'ended' | 'error';

/**
 * Live voice conversation over WebRTC against OpenAI's Realtime API.
 *
 * The browser never sees the real API key — /api/realtime/session mints a
 * short-lived ephemeral token, and the SDP offer goes to /v1/realtime/calls
 * with that token instead.
 *
 * Calls are hard-capped server- and client-side because realtime audio costs
 * cents per minute.
 */
const VoiceMode = ({
  onSpeakingChange,
}: {
  onSpeakingChange?: (speaking: boolean) => void;
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [level, setLevel] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);

  /** Tear everything down. Safe to call twice. */
  const hangUp = useCallback(
    (nextPhase: Phase = 'ended') => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      if (endTimerRef.current) window.clearInterval(endTimerRef.current);
      endTimerRef.current = null;

      micRef.current?.getTracks().forEach((t) => t.stop());
      micRef.current = null;

      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
      pcRef.current = null;

      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;

      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }

      setLevel(0);
      onSpeakingChange?.(false);
      setPhase(nextPhase);
    },
    [onSpeakingChange]
  );

  // Never leave a call running when the component unmounts.
  useEffect(() => () => hangUp('idle'), [hangUp]);

  /** Drive the avatar + waveform from the model's actual output audio. */
  const watchOutputAudio = useCallback(
    (stream: MediaStream) => {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      let speaking = false;

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(avg);

        const nowSpeaking = avg > 8;
        if (nowSpeaking !== speaking) {
          speaking = nowSpeaking;
          onSpeakingChange?.(nowSpeaking);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    },
    [onSpeakingChange]
  );

  const start = useCallback(async () => {
    setPhase('connecting');
    setError('');

    try {
      // 1. Ephemeral token from our server.
      const sessionRes = await fetch('/api/realtime/session', {
        method: 'POST',
      });
      if (!sessionRes.ok) {
        const payload = await sessionRes.json().catch(() => null);
        throw new Error(payload?.error ?? 'Could not start a session');
      }
      const { token, model, seconds } = await sessionRes.json();

      // 2. Mic. Must follow a user gesture — iOS especially.
      const mic = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      micRef.current = mic;

      // 3. Peer connection.
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (e) => {
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
          audioRef.current.play().catch(() => {});
        }
        watchOutputAudio(e.streams[0]);
      };

      pc.onconnectionstatechange = () => {
        if (['failed', 'disconnected'].includes(pc.connectionState)) {
          hangUp('ended');
        }
      };

      mic.getTracks().forEach((t) => pc.addTrack(t, mic));
      pc.createDataChannel('oai-events');

      // 4. SDP exchange against the GA endpoint.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`,
        {
          method: 'POST',
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/sdp',
          },
        }
      );
      if (!sdpRes.ok) throw new Error('Voice connection was refused');

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: await sdpRes.text(),
      });

      // 5. Hard cap, mirroring the server's.
      setSecondsLeft(seconds);
      endTimerRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            hangUp('ended');
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      setPhase('live');
    } catch (e) {
      const message =
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? 'Mic access denied — allow it in your browser and try again.'
          : e instanceof Error
            ? e.message
            : 'Voice mode failed to start';
      setError(message);
      hangUp('error');
      setPhase('error');
    }
  }, [hangUp, watchOutputAudio]);

  const connecting = phase === 'connecting';
  const live = phase === 'live';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} autoPlay className="hidden" />

      <AnimatePresence mode="wait">
        {live ? (
          <motion.button
            key="live"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => hangUp('ended')}
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
          >
            <PhoneOff className="h-4 w-4" />
            End · {secondsLeft}s
            <span
              className="ml-1 h-2 w-2 rounded-full bg-white"
              style={{ opacity: 0.35 + Math.min(level / 60, 1) * 0.65 }}
            />
          </motion.button>
        ) : (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={start}
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

      {live && (
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Radio className="h-3 w-3 animate-pulse text-red-500" />
          Listening — just talk
        </p>
      )}

      {phase === 'error' && (
        <p className="max-w-xs text-center text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceMode;
