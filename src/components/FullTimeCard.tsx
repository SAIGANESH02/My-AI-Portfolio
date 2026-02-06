'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe, Briefcase, Award } from 'lucide-react';

const FullTimeCard = () => {
  const openMail = () => {
    window.open('mailto:nsaiganesh2003@gmail.com', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-100 dark:border-blue-900 mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12 shadow-xl"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full shadow-lg ring-4 ring-blue-100 dark:ring-blue-900">
            <img
              src="/saiganesh.jpeg"
              alt="Sai Ganesh's avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              Sai Ganesh Nellore
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Lead ML Engineer | 3+ Years Experience
            </p>
          </div>
        </div>

        {/* Available badge */}
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <span className="flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-500 dark:border-green-600 px-4 py-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
            </span>
            Open to Full-Time
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-semibold">Experience</p>
            <p className="text-muted-foreground text-sm">
              3+ Years in AI/ML Engineering & Production Systems
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-semibold">Location</p>
            <p className="text-muted-foreground text-sm">
              Chicago, IL, USA
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Briefcase className="mt-1 h-5 w-5 text-purple-500" />
          <div>
            <p className="text-foreground text-sm font-semibold">Role Focus</p>
            <p className="text-muted-foreground text-sm">
              Lead ML Engineer / Senior AI Engineer
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Award className="mt-1 h-5 w-5 text-amber-500" />
          <div>
            <p className="text-foreground text-sm font-semibold">Education</p>
            <p className="text-muted-foreground text-sm">
              MS in AI (Northwestern) • GPA: 3.95
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-indigo-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-semibold mb-2">Core Tech Stack</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
              <ul className="list-disc pl-4 space-y-1">
                <li>Python, TensorFlow, PyTorch</li>
                <li>LangChain, LlamaIndex, Ollama</li>
                <li>AWS (SageMaker, Bedrock, EC2)</li>
                <li>FastAPI, Django, Flask</li>
              </ul>
              <ul className="list-disc pl-4 space-y-1">
                <li>LLM Fine-tuning (RLHF, GRPO)</li>
                <li>RAG Systems, Vector DBs</li>
                <li>Docker, Kubernetes, MLOps</li>
                <li>OpenAI API, Gemini API, Vercel AI SDK</li>
                <li>
                  <a
                    href="/chat?query=What%20are%20your%20technical%20skills%3F%20Give%20me%20a%20detailed%20breakdown."
                    className="cursor-pointer items-center text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View full stack →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I bring */}
      <div className="mt-10 bg-white/50 dark:bg-gray-900/50 rounded-2xl p-6 border border-blue-100 dark:border-blue-900">
        <p className="text-foreground mb-3 text-lg font-bold flex items-center gap-2">
          <span className="h-6 w-1 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
          What I Bring to the Table
        </p>
        <ul className="text-foreground text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
            <span><strong>Production-Scale AI:</strong> Built agentic voice systems serving 1000s of customers/day with sub-second latency</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
            <span><strong>Cost Optimization:</strong> Reduced LLM inference costs from $300 to $40/day through compression and fine-tuning</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
            <span><strong>Compliance Expertise:</strong> HIPAA-aligned data flows with PHI redaction and secure infrastructure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
            <span><strong>RAG & Evaluation:</strong> Saved $300K+ by automating evaluation pipelines with robust metrics</span>
          </li>
        </ul>
      </div>

      {/* Goal */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <p className="text-foreground mb-3 text-lg font-bold flex items-center gap-2">
          <span className="h-6 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
          Career Goals
        </p>
        <p className="text-foreground text-sm leading-relaxed">
          Seeking <strong>Lead ML Engineer or Senior AI Engineer</strong> roles where I can drive innovation in 
          production AI systems. Passionate about building scalable GenAI solutions, optimizing LLM performance, 
          and leading teams to ship impactful AI products. Ready to tackle complex challenges in voice AI, 
          RAG systems, and cloud-native ML infrastructure 🚀
        </p>
      </div>

      {/* Contact button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={openMail}
          className="cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3.5 font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
        >
          <span>Let's Connect</span>
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Additional note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Open to discussing opportunities in AI/ML • Relocation-friendly • Available for immediate start
      </p>
    </motion.div>
  );
};

export default FullTimeCard;
