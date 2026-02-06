'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export function Presentation() {
  // Personal information
  const profile = {
    name: 'Sai Ganesh Nellore',
    age: '3+ Years Experience',
    location: 'Chicago, IL, USA',
    description:
      "Hey 👋\nI'm Sai Ganesh, a Lead Machine Learning Engineer specializing in AI systems, LLM optimization, and agentic voice automation. Building production-scale GenAI solutions with a focus on sub-second latency, HIPAA compliance, and cost-efficient cloud architectures.",
    src: '/saiganesh.jpeg', // Make sure this file exists in your /public folder
  };

  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Animation for the entire paragraph rather than word-by-word
  const paragraphAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Image section */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="h-full w-full"
            >
              <Image
                src={profile.src}
                alt={profile.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* Text content section */}
        <div className="flex flex-col space-y">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
              {profile.name}
            </h1>
            <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <p className="text-muted-foreground font-medium">{profile.age}</p>
              <div className="bg-border hidden h-1.5 w-1.5 rounded-full md:block" />
              <p className="text-muted-foreground font-medium">{profile.location}</p>
            </div>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={paragraphAnimation}
            className="text-foreground mt-6 text-base md:text-lg leading-relaxed whitespace-pre-line"
          >
            {profile.description}
          </motion.p>

          {/* Tags/Keywords */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {[
              'Voice AI',
              'LLM Optimization',
              'AWS',
              'RAG Systems',
              'NLP',
              'Computer Vision',
              'MLOps',
              'HIPAA Compliance',
            ].map((tag) => (
              <span
                key={tag}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:shadow-md hover:scale-105"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Additional highlight badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-4 flex flex-wrap gap-3"
          >
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg px-3 py-1.5 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium">Available for opportunities</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Presentation;