import ResumeRoast from '@/components/fun/ResumeRoast';
import { Home } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Roast my resume | Sai Ganesh Nellore',
  description:
    'Drop your resume PDF and get it scored and critiqued — specific, blunt, and free. Nothing is stored.',
};

export default function RoastPage() {
  return (
    <div className="relative min-h-screen px-4 py-6">
      <Link
        href="/"
        aria-label="Back to home"
        className="bg-background/70 hover:bg-accent absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur transition-all hover:scale-105"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      <div className="pt-16">
        <ResumeRoast />
      </div>
    </div>
  );
}
