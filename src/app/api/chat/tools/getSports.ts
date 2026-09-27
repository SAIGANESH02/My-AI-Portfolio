import { tool } from "ai";
import { z } from "zod";

export const getSports = tool({
  description:
    "This tool displays information and photos about Sai Ganesh's esports activities, including his participation in Northwestern University's esports team and his Valorant tournament achievements. Use this when user asks about hobbies, gaming, esports, sports, extracurricular activities, or what he does for fun.",
  parameters: z.object({}),
  execute: async () => {
    return "Valorant, mostly — played on Northwestern's esports team during my MS and took a tournament. There's a 30-second aim trainer on that card if you want to try beating my score of 47.";
  },
});