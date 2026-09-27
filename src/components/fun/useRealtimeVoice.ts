'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type VoicePhase = 'idle' | 'connecting' | 'live' | 'ended' | 'error';

export type VoiceTurn = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Still being transcribed / spoken. */
  partial: boolean;
};

type Options = {
  /** Fired when the model calls one of the section tools. */
  onTool?: (name: string) => void;
  /** Fired once a turn is final, so it can be folded into the chat history. */
  onTurnComplete?: (turn: VoiceTurn) => void;
};

/**
 * Live voice conversation over WebRTC against the Realtime API.
 *
 * The browser never sees the real key — /api/realtime/session mints a
 * short-lived ephemeral token and the SDP offer goes to /v1/realtime/calls
 * with that. Calls are hard-capped because realtime audio costs cents/minute.
 *
 * Exposes the output amplitude so the avatar's mouth can track real speech,
 * and both sides' transcripts so the conversation is readable as it happens.
 */
export function useRealtimeVoice({ onTool, onTurnComplete }: Options = {}) {
  const [phase, setPhase] = useState<VoicePhase>('idle');
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [speaking, setSpeaking] = useState(false);

  /** Output amplitude 0..1, read imperatively by the avatar's rAF loop. */
  const levelRef = useRef(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const deadlineRef = useRef(0);

  const cbRef = useRef({ onTool, onTurnComplete });
  cbRef.current = { onTool, onTurnComplete };

  const hangUp = useCallback((next: VoicePhase = 'ended') => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;

    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    if (audioElRef.current) audioElRef.current.srcObject = null;

    levelRef.current = 0;
    setSpeaking(false);
    setPhase(next);
  }, []);

  useEffect(() => () => hangUp('idle'), [hangUp]);

  // Enforce the cap here, not inside the timer's state updater. Calling a
  // side effect from a setState updater is not guaranteed to run (and runs
  // twice under StrictMode), which is why the call never auto-ended.
  useEffect(() => {
    if (phase === 'live' && secondsLeft <= 0) hangUp('ended');
  }, [phase, secondsLeft, hangUp]);

  /** Upsert a streaming transcript line. */
  const pushDelta = useCallback(
    (id: string, role: VoiceTurn['role'], chunk: string) => {
      setTurns((prev) => {
        const i = prev.findIndex((t) => t.id === id);
        if (i === -1) {
          return [...prev, { id, role, text: chunk, partial: true }];
        }
        const next = [...prev];
        next[i] = { ...next[i], text: next[i].text + chunk };
        return next;
      });
    },
    []
  );

  const finalize = useCallback(
    (id: string, role: VoiceTurn['role'], text?: string) => {
      setTurns((prev) => {
        const i = prev.findIndex((t) => t.id === id);
        const done: VoiceTurn = {
          id,
          role,
          text: (text ?? (i === -1 ? '' : prev[i].text)).trim(),
          partial: false,
        };
        if (!done.text) return i === -1 ? prev : prev.filter((t) => t.id !== id);
        cbRef.current.onTurnComplete?.(done);
        if (i === -1) return [...prev, done];
        const next = [...prev];
        next[i] = done;
        return next;
      });
    },
    []
  );

  const handleEvent = useCallback(
    (raw: string) => {
      let e: Record<string, unknown>;
      try {
        e = JSON.parse(raw);
      } catch {
        return;
      }
      const type = e.type as string;

      // --- what the visitor said ---
      if (type === 'conversation.item.input_audio_transcription.delta') {
        pushDelta(`u-${e.item_id}`, 'user', (e.delta as string) ?? '');
      } else if (
        type === 'conversation.item.input_audio_transcription.completed'
      ) {
        finalize(`u-${e.item_id}`, 'user', e.transcript as string);
      }

      // --- what the model is saying, streamed in step with the audio ---
      else if (
        type === 'response.output_audio_transcript.delta' ||
        type === 'response.audio_transcript.delta'
      ) {
        pushDelta(`a-${e.item_id}`, 'assistant', (e.delta as string) ?? '');
      } else if (
        type === 'response.output_audio_transcript.done' ||
        type === 'response.audio_transcript.done'
      ) {
        finalize(`a-${e.item_id}`, 'assistant', e.transcript as string);
      }

      // --- section cards ---
      else if (
        type === 'response.function_call_arguments.done' ||
        type === 'response.output_item.done'
      ) {
        const item = e.item as { type?: string; name?: string } | undefined;
        const name = (e.name as string) ?? item?.name;
        if (name && (e.type === 'response.function_call_arguments.done' || item?.type === 'function_call')) {
          cbRef.current.onTool?.(name);
        }
      }
    },
    [pushDelta, finalize]
  );

  const watchOutput = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.3;
    ctx.createMediaStreamSource(stream).connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    let wasSpeaking = false;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      // Voice energy lives low; averaging the whole spectrum washes it out.
      let sum = 0;
      const bins = Math.floor(data.length * 0.35);
      for (let i = 0; i < bins; i++) sum += data[i];
      const avg = sum / bins;

      levelRef.current = Math.min(avg / 70, 1);

      const now = avg > 8;
      if (now !== wasSpeaking) {
        wasSpeaking = now;
        setSpeaking(now);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    if (phase === 'connecting' || phase === 'live') return;
    setPhase('connecting');
    setError('');
    setTurns([]);

    try {
      const res = await fetch('/api/realtime/session', { method: 'POST' });
      if (!res.ok) {
        const p = await res.json().catch(() => null);
        throw new Error(p?.error ?? 'Could not start a session');
      }
      const { token, model, seconds } = await res.json();

      const mic = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      micRef.current = mic;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (ev) => {
        if (!audioElRef.current) {
          const el = document.createElement('audio');
          el.autoplay = true;
          el.style.display = 'none';
          document.body.appendChild(el);
          audioElRef.current = el;
        }
        audioElRef.current.srcObject = ev.streams[0];
        audioElRef.current.play().catch(() => {});
        watchOutput(ev.streams[0]);
      };

      pc.onconnectionstatechange = () => {
        if (['failed', 'disconnected'].includes(pc.connectionState)) {
          hangUp('ended');
        }
      };

      mic.getTracks().forEach((t) => pc.addTrack(t, mic));

      const channel = pc.createDataChannel('oai-events');
      channel.onmessage = (ev) => handleEvent(ev.data);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdp = await fetch(
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
      if (!sdp.ok) throw new Error('Voice connection was refused');
      await pc.setRemoteDescription({ type: 'answer', sdp: await sdp.text() });

      // Deadline rather than a decrementing counter: an interval that drifts
      // or gets throttled in a background tab would otherwise overrun the cap.
      deadlineRef.current = Date.now() + seconds * 1000;
      setSecondsLeft(seconds);
      timerRef.current = window.setInterval(() => {
        const left = Math.max(
          0,
          Math.ceil((deadlineRef.current - Date.now()) / 1000)
        );
        setSecondsLeft(left);
      }, 250);

      setPhase('live');
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? 'Mic access denied — allow it in your browser and try again.'
          : e instanceof Error
            ? e.message
            : 'Voice mode failed to start'
      );
      hangUp('error');
      setPhase('error');
    }
  }, [phase, handleEvent, hangUp, watchOutput]);

  return { phase, error, secondsLeft, turns, speaking, levelRef, start, hangUp };
}
