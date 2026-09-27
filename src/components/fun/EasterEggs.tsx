'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// stored lowercase; incoming e.key is lowercased before comparing
const KONAMI = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
];

const PHRASES: { trigger: string; fire: () => void }[] = [
  {
    trigger: 'sudo hire sai',
    fire: () =>
      toast.success('Permission granted.', {
        description: 'nsaiganesh2003@gmail.com · linkedin.com/in/saiganeshn',
        duration: 8000,
      }),
  },
  {
    trigger: 'rm -rf',
    fire: () =>
      toast.error('Nice try.', {
        description: "I've seen what that does to a prod cluster. Not today.",
      }),
  },
  {
    // 'gg' alone would fire inside ordinary words (egg, trigger, suggest)
    trigger: 'ggwp',
    fire: () =>
      toast('ggwp', {
        description: 'Ask me about gaming if you want a real round.',
      }),
  },
];

const EasterEggs = () => {
  const keysRef = useRef<string[]>([]);
  const charsRef = useRef('');

  useEffect(() => {
    const exitTerminal = () => {
      document.documentElement.classList.remove('terminal-mode');
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // --- Konami code -> terminal mode ---
      keysRef.current = [...keysRef.current, e.key.toLowerCase()].slice(
        -KONAMI.length
      );
      const konamiHit =
        keysRef.current.length === KONAMI.length &&
        KONAMI.every((k, i) => k === keysRef.current[i]);
      if (konamiHit) {
        keysRef.current = [];
        const root = document.documentElement;
        const on = root.classList.toggle('terminal-mode');
        toast(on ? 'TERMINAL MODE ENGAGED' : 'Back to normal', {
          description: on ? 'Press Esc to exit. Or don\'t.' : undefined,
        });
      }

      if (e.key === 'Escape') exitTerminal();

      // --- typed phrases ---
      if (e.key.length === 1) {
        charsRef.current = (charsRef.current + e.key.toLowerCase()).slice(-40);
        const match = PHRASES.find((p) => charsRef.current.endsWith(p.trigger));
        if (match) {
          charsRef.current = '';
          match.fire();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return null;
};

export default EasterEggs;
