import { tool } from 'ai';
import { z } from 'zod';

export const getFullTime = tool({
  description:
    "Displays Sai Ganesh's full-time job search card with availability, focus areas, and contact information. Use this tool when user asks about job search, employment status, career opportunities, hiring, looking for work, or professional availability.",
  parameters: z.object({}),
  execute: async () => {
    return `Here's what I'm looking for in my next role 🚀

**Current Status:** Open to Full-Time Opportunities

**Target Roles:**
- Lead Machine Learning Engineer
- Senior AI Engineer
- Staff ML Engineer
- AI/ML Tech Lead

**Location:** Chicago, IL (Open to relocation for the right opportunity)

**What I Bring:**
✅ 3+ years building production AI systems at scale
✅ Voice AI serving 1000s of customers daily with sub-second latency
✅ Cost optimization: Reduced LLM costs from $300 to $40/day
✅ $300K+ savings through automated RAG evaluation pipelines
✅ HIPAA-compliant AI systems with secure infrastructure
✅ Team leadership experience (led 3-person engineering team)
✅ MS in AI from Northwestern (GPA: 3.95)

**Core Expertise:**
🔹 LLM Fine-tuning & Optimization (RLHF, GRPO, Distillation)
🔹 Voice AI & Conversational Systems (STT, TTS, Dialog)
🔹 RAG Systems & Vector Databases
🔹 AWS MLOps (SageMaker, Bedrock, EC2)
🔹 Production ML Infrastructure
🔹 HIPAA/Compliance-ready AI

**Tech Stack:**
Python • TensorFlow • PyTorch • LangChain • AWS • FastAPI • Docker • Kubernetes

**What Excites Me:**
💡 Building AI systems that solve real problems
💡 Shipping production-ready solutions at scale
💡 Leading technical initiatives and mentoring teams
💡 Working on cutting-edge LLM and voice AI projects
💡 Companies with strong AI/ML culture

**Availability:** Immediate start available

📬 **Let's Connect:**
- 📧 Email: nsaiganesh2003@gmail.com
- 📞 Phone: +1 (773) 822-5301
- 💼 LinkedIn: linkedin.com/in/saiganeshn
- 💻 GitHub: github.com/SAIGANESH02
- 🌐 Portfolio: saiganesh02.github.io/SaiGanesh02

I move fast, ship faster, and I'm hungry for impactful challenges. Let's build something amazing together! 🔥
    `;
  },
});