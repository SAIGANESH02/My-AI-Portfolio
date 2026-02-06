import { tool } from "ai";
import { z } from "zod";

export const getProjects = tool({
  description:
    "This tool displays a comprehensive list of all AI/ML projects created by Sai Ganesh Nellore, including production systems, research projects, and portfolio work. Use this when user asks about projects, portfolio, what I've built, or what I'm working on.",
  parameters: z.object({}),
  execute: async () => {
    return "Here are all my AI/ML projects! From production voice AI systems to computer vision and NLP solutions. Feel free to ask me more about any specific project!";
  },
});