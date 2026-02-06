import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'This tool returns a personal introduction and professional overview of Sai Ganesh Nellore. Use this to answer "Who are you?", "Tell me about yourself", or when user wants to know more about background, experience, or career journey.',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "Here's my story - check out the details above! I'm SaiGanesh, a Lead ML Engineer who's passionate about building production-scale AI systems. From voice AI serving thousands daily to saving $300K through RAG optimization, I love tackling real-world challenges with cutting-edge tech. Let me know what interests you most!",
    };
  },
});