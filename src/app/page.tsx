'use client';

import FluidCursor from '@/components/FluidCursor';
import { Button } from '@/components/ui/button';
import WelcomeModal from '@/components/welcome-modal';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Laugh,
  Layers,
  PartyPopper,
  UserRoundSearch,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/* ---------- quick-question data ---------- */
const questions = {
  Me: 'Who are you? Tell me about your background and experience.',
  Resume: 'Show me your resume and work experience.',
  Projects: 'What are your AI/ML projects? Show me your portfolio.',
  Skills: 'What are your technical skills? List your expertise in AI/ML.',
  Fun: 'What are your hobbies and interests outside of work?',
  Contact: 'How can I contact you? What\'s the best way to reach out?',
} as const;

const questionConfig = [
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Resume', color: '#E85D04', icon: FileText },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Fun', color: '#B95F9D', icon: PartyPopper },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
] as const;

/* ---------- component ---------- */
export default function Home() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const goToChat = (query: string) =>
    router.push(`/chat?query=${encodeURIComponent(query)}`);

  /* hero animations */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'ease', duration: 0.8 },
    },
  };
  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'ease', duration: 0.8, delay: 0.2 },
    },
  };

  useEffect(() => {
    // Preload assets in background
    const img = new window.Image();
    img.src = '/landing-memojis.png';

    // Preload videos
    const linkWebm = document.createElement('link');
    linkWebm.rel = 'prefetch';
    linkWebm.as = 'video';
    linkWebm.href = '/final_memojis.webm';
    document.head.appendChild(linkWebm);

    const linkMp4 = document.createElement('link');
    linkMp4.rel = 'prefetch';
    linkMp4.as = 'video';
    linkMp4.href = '/final_memojis_ios.mp4';
    document.head.appendChild(linkMp4);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* Big blurred background text */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-blue-500/10 via-indigo-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: '-2.5rem' }}
        >
          SaiGanesh
        </div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
        <ThemeToggle />
      </div>

      {/* Full-time availability badge - FIXED TO TRIGGER getFullTime TOOL */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => goToChat('Show me your full-time job search card. Are you looking for full-time opportunities? Tell me about your job search.')}
          className="relative flex cursor-pointer items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90 dark:border-blue-800 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-lg backdrop-blur-lg transition-all hover:shadow-xl hover:scale-105"
        >
          {/* Green pulse dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
          </span>
          Open to Full-Time Roles
        </button>
      </div>

      {/* Header */}
      <motion.div
        className="z-1 mt-24 mb-8 flex flex-col items-center text-center md:mt-4 md:mb-12"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="z-100">
          <WelcomeModal />
        </div>

        <h2 className="text-secondary-foreground mt-2 text-xl font-semibold md:text-2xl">
          Hey, I'm Sai Ganesh Nellore 👋
        </h2>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl mt-2">
          AI-Powered Portfolio
        </h1>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl">
          Lead ML Engineer • AI Systems • LLM Optimization • Voice AI
        </p>
      </motion.div>

      {/* Center memoji */}
      <div className="relative z-10 h-52 w-48 overflow-hidden sm:h-72 sm:w-72">
        <Image
          src="/landing-memojis.png"
          alt="Hero memoji"
          width={2000}
          height={2000}
          priority
          className="translate-y-1 scale-[1.2] object-cover"
        />
      </div>

      {/* Input + quick buttons */}
      <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
      >
        {/* Free-form question input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) goToChat(input.trim());
          }}
          className="relative w-full max-w-lg"
        >
          <div className="mx-auto flex items-center rounded-full border-2 border-blue-200 dark:border-blue-800 bg-white/40 dark:bg-neutral-800/40 py-3 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about my work, skills, or projects…"
              className="w-full border-none bg-transparent text-base text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Submit question"
              className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-500 dark:to-indigo-500"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Quick-question grid */}
        <div className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {questionConfig.map(({ key, color, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => goToChat(questions[key])}
              variant="outline"
              className="border-border hover:bg-border/30 aspect-square w-full cursor-pointer rounded-2xl border-2 bg-white/40 dark:bg-neutral-800/40 py-8 shadow-md backdrop-blur-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 md:p-10"
            >
              <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                <Icon size={24} strokeWidth={2.5} color={color} />
                <span className="text-xs font-semibold sm:text-sm">{key}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Quick stats or badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-2 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700">
            <span className="font-semibold text-blue-600 dark:text-blue-400">3+ Years</span>
            <span>Experience</span>
          </div>
          <div className="flex items-center gap-2 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700">
            <span className="font-semibold text-green-600 dark:text-green-400">12+</span>
            <span>AI/ML Projects</span>
          </div>
          <div className="flex items-center gap-2 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700">
            <span className="font-semibold text-purple-600 dark:text-purple-400">MS in AI</span>
            <span>Northwestern</span>
          </div>
        </div>
      </motion.div>
      <FluidCursor />
    </div>
  );
}