'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trophy, Gamepad2, Users, Target, Award, Zap } from 'lucide-react';

const Sports = () => {
  const esportsHighlights = [
    {
      title: 'Northwestern Esports Team',
      description: 'Active member of Northwestern University\'s competitive esports program',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      title: 'Valorant Tournament Champion',
      description: 'Secured tournament victory through strategic gameplay and team coordination',
      icon: Trophy,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
    {
      title: 'Competitive Gaming',
      description: 'Applying analytical thinking and quick decision-making in high-pressure situations',
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
  ];

  const skills = [
    { name: 'Strategic Thinking', icon: Zap },
    { name: 'Team Coordination', icon: Users },
    { name: 'Quick Decision Making', icon: Target },
    { name: 'Competitive Spirit', icon: Award },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <Gamepad2 className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
            Esports & Gaming
          </h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Balancing technical excellence with competitive gaming at Northwestern University
        </p>
      </motion.div>

      {/* Main Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {esportsHighlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className={`${highlight.bgColor} border-2 border-opacity-20 rounded-2xl p-6 space-y-4 hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <div className={`${highlight.color} ${highlight.bgColor} w-14 h-14 rounded-xl flex items-center justify-center`}>
              <highlight.icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Featured Section - Valorant Tournament */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-purple-950/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-8 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Valorant Tournament Victory
            </h3>
            <p className="text-muted-foreground">
              Northwestern University Esports Program
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">1st</div>
            <div className="text-sm text-muted-foreground">Place</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5v5</div>
            <div className="text-sm text-muted-foreground">Team Play</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">NU</div>
            <div className="text-sm text-muted-foreground">Esports</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">🎮</div>
            <div className="text-sm text-muted-foreground">Champion</div>
          </div>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">
          Competing in high-stakes Valorant tournaments taught me valuable lessons in team coordination, 
          strategic planning, and performing under pressure—skills that translate directly to collaborative 
          AI/ML projects and technical leadership.
        </p>
      </motion.div>

      {/* Skills from Gaming */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-accent rounded-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Transferable Skills from Competitive Gaming
          </h3>
          <p className="text-sm text-muted-foreground">
            How esports enhances my professional capabilities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105"
            >
              <skill.icon className="h-8 w-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold text-foreground">{skill.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Image Gallery Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-center text-foreground">
          Tournament Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Placeholder for gaming images */}
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700">
            <div className="text-center space-y-2">
              <Gamepad2 className="h-12 w-12 mx-auto text-purple-400" />
              <p className="text-sm text-muted-foreground">Northwestern Esports Team Photo</p>
            </div>
          </div>
          <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl flex items-center justify-center border-2 border-dashed border-red-300 dark:border-red-700">
            <div className="text-center space-y-2">
              <Trophy className="h-12 w-12 mx-auto text-yellow-500" />
              <p className="text-sm text-muted-foreground">Valorant Tournament Victory</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground italic">
          Add your tournament and team photos to /public/esports/ folder
        </p>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800"
      >
        <p className="text-lg italic text-foreground/80">
          "Gaming isn't just entertainment—it's a training ground for quick thinking, 
          team collaboration, and maintaining composure under pressure. 
          Skills that make me a better engineer."
        </p>
        <p className="mt-4 text-sm font-semibold text-purple-600 dark:text-purple-400">
          — Sai Ganesh Nellore
        </p>
      </motion.div>
    </div>
  );
};

export default Sports;