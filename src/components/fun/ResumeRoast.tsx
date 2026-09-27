'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Loader2, Lock, RotateCcw, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Phase = 'idle' | 'working' | 'done' | 'error';

/**
 * Drop a resume PDF, get it scored and torn apart in Sai's voice.
 * The file is streamed straight to /api/roast and never stored anywhere.
 */
const ResumeRoast = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPhase('idle');
    setOutput('');
    setError('');
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const roast = useCallback(async (file: File) => {
    setPhase('working');
    setOutput('');
    setError('');
    setFileName(file.name);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/roast', { method: 'POST', body });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error ?? `Request failed (${res.status})`);
        setPhase('error');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      const decoder = new TextDecoder();
      let text = '';

      // AI SDK data-stream: text parts arrive as `0:"..."` lines.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split('\n')) {
          if (!line.startsWith('0:')) continue;
          try {
            text += JSON.parse(line.slice(2));
          } catch {
            /* partial chunk — the next read completes it */
          }
        }
        setOutput(text);
      }
      setPhase('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setPhase('error');
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) roast(file);
  };

  const busy = phase === 'working';

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 py-6">
      <div className="space-y-1 text-center">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Flame className="h-6 w-6 text-orange-500" />
          Roast my resume
        </h2>
        <p className="text-muted-foreground text-sm">
          Drop your PDF. I&apos;ll score it and tell you what a recruiter
          won&apos;t.
        </p>
      </div>

      {phase === 'idle' && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-all ${
              dragging
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                : 'hover:border-orange-400 hover:bg-accent/40 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            <Upload className="h-9 w-9 text-orange-500" />
            <div className="text-center">
              <p className="font-semibold">Drop a resume PDF here</p>
              <p className="text-muted-foreground text-xs">
                or click to browse · max 2 MB, 5 pages
              </p>
            </div>
          </div>

          <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-xs">
            <Lock className="h-3 w-3 shrink-0" />
            Parsed in memory and thrown away. Not stored, not logged, not
            trained on.
          </p>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) roast(file);
        }}
      />

      {busy && !output && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Reading {fileName}…
        </div>
      )}

      <AnimatePresence>
        {(output || phase === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {phase === 'error' ? (
              <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </p>
            ) : (
              <div className="rounded-2xl border p-5 text-sm leading-relaxed">
                {/* Explicit element styling — this project has no tailwind
                    typography plugin, so `prose` alone would do nothing. */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => (
                      <h2 className="mb-1 text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mt-5 mb-2 border-b pb-1 text-base font-bold">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="my-2 break-words">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-2 list-disc space-y-1.5 pl-5">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {output}
                </ReactMarkdown>
                {busy && (
                  <span className="bg-foreground ml-0.5 inline-block h-4 w-2 animate-pulse align-middle" />
                )}
              </div>
            )}

            {!busy && (
              <div className="flex justify-center">
                <button
                  onClick={reset}
                  className="hover:bg-accent flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  Roast another
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeRoast;
