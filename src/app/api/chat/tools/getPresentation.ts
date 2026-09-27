import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'This tool returns a personal introduction and professional overview of Sai Ganesh Nellore. Use this to answer "Who are you?", "Tell me about yourself", or when user wants to know more about background, experience, or career journey.',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "The short version: ML engineer, nearly five years in, mostly production LLM systems and making inference fast and cheap. Currently contracting with Google on training infrastructure and GPU kernel work.",
    };
  },
});