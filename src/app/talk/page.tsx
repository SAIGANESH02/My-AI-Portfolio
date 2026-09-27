import TalkSurface from '@/components/fun/TalkSurface';
import { Home, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Talk to me | Sai Ganesh Nellore',
  description:
    'Have a real voice conversation with Sai’s AI twin — live speech, live captions.',
};

export default function TalkPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <Link
          href="/"
          aria-label="Back to home"
          className="bg-background/70 hover:bg-accent flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur transition-all hover:scale-105"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <Link
          href="/chat"
          className="bg-background/70 hover:bg-accent flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur transition-all hover:scale-105"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Type instead</span>
        </Link>
      </div>

      <TalkSurface />
    </div>
  );
}
