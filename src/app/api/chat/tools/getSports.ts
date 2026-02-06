import { tool } from "ai";
import { z } from "zod";

export const getSports = tool({
  description:
    "This tool displays information and photos about Sai Ganesh's esports activities, including his participation in Northwestern University's esports team and his Valorant tournament achievements. Use this when user asks about hobbies, gaming, esports, sports, extracurricular activities, or what he does for fun.",
  parameters: z.object({}),
  execute: async () => {
    return "Here are some highlights from my esports journey at Northwestern! I'm proud to be part of the Northwestern esports team and have competed in several Valorant tournaments, including a tournament win. Gaming has been a great way to balance technical work with competitive team strategy!";
  },
});