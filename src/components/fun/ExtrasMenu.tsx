'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Activity,
  Crosshair,
  Flame,
  Mic,
  Sparkles,
  SquareTerminal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

const COMMANDS = [
  { cmd: 'sudo hire sai', does: 'Drops my contact details' },
  { cmd: 'rm -rf', does: 'Do not.' },
  { cmd: 'ggwp', does: 'For the Valorant people' },
];

type ExtraRow = {
  icon: ReactNode;
  title: string;
  body: string;
  action?: { label: string; run: () => void };
};

/**
 * One discoverable home for everything that isn't obvious from the chat UI —
 * the aim trainer, the live inference meter, and the keyboard easter eggs.
 */
const ExtrasMenu = ({ trigger }: { trigger?: ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const rows: ExtraRow[] = [
    {
      icon: <Mic className="h-5 w-5 text-blue-500" />,
      title: 'Talk to me out loud',
      body: "Real voice conversation with live captions, and the mouth tracks actual speech. 90 seconds a call — realtime audio isn't cheap.",
      action: {
        label: 'Talk',
        run: () => {
          close();
          router.push('/talk');
        },
      },
    },
    {
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      title: 'Roast my resume',
      body: "Drop your own PDF and I'll score it and tell you what a recruiter won't. Nothing gets stored.",
      action: {
        label: 'Open',
        run: () => {
          close();
          router.push('/roast');
        },
      },
    },
    {
      icon: <Crosshair className="h-5 w-5 text-red-500" />,
      title: 'Aim trainer',
      body: '30-second round against my tournament score. Lives at the bottom of the gaming card.',
      action: {
        label: 'Play',
        run: () => {
          close();
          router.push(
            `/chat?query=${encodeURIComponent('What are your hobbies and interests outside of work?')}`
          );
        },
      },
    },
    {
      icon: <Activity className="h-5 w-5 text-green-500" />,
      title: 'Live inference stats',
      body: 'Bottom-left pill. Real time-to-first-token, token counts, and what this conversation is costing me. Click it to expand.',
    },
    {
      icon: <SquareTerminal className="h-5 w-5 text-purple-500" />,
      title: 'Terminal mode',
      body: 'Konami code — ↑ ↑ ↓ ↓ ← → ← → B A. Esc to exit.',
      action: {
        label: 'Engage',
        run: () => {
          close();
          document.documentElement.classList.add('terminal-mode');
        },
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            aria-label="Extras"
            className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5"
          >
            <Sparkles className="text-accent-foreground h-5 w-5" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Things you can poke at
          </DialogTitle>
          <DialogDescription>
            This site has a few extras hiding in it. Here they all are.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.title}
              className="flex items-start gap-3 rounded-xl border p-3"
            >
              <div className="mt-0.5 shrink-0">{row.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{row.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {row.body}
                </p>
              </div>
              {row.action && (
                <button
                  onClick={row.action.run}
                  className="shrink-0 cursor-pointer rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  {row.action.label}
                </button>
              )}
            </div>
          ))}

          <div className="rounded-xl border p-3">
            <p className="mb-2 text-sm font-semibold">Type these anywhere</p>
            <ul className="space-y-1.5">
              {COMMANDS.map(({ cmd, does }) => (
                <li
                  key={cmd}
                  className="flex items-baseline justify-between gap-3 text-xs"
                >
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono">
                    {cmd}
                  </code>
                  <span className="text-muted-foreground text-right">{does}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtrasMenu;
