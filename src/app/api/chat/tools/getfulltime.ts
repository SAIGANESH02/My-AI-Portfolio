import { tool } from 'ai';
import { z } from 'zod';

export const getFullTime = tool({
  description:
    "Displays Sai Ganesh's availability card with current status, target roles, and contact information. Use this tool when user asks about job search, employment status, career opportunities, hiring, looking for work, or professional availability.",
  parameters: z.object({}),
  execute: async () => {
    return `**Current Status:** On contract as a Sr. ML Engineer (Cincinnatus LLC, client: Google) — open to the right full-time role.

**Target Roles:**
- Senior / Staff Machine Learning Engineer
- Inference & Performance Engineer
- ML Infrastructure / Training Systems
- AI Engineer (LLM platform)

**Location:** Chicago, IL · Remote-friendly · Open to relocation

**What I Bring:**
✅ Nearly 5 years building production AI systems at scale
✅ 100K+ requests/day on vLLM + TensorRT, HIPAA-regulated healthcare traffic
✅ Cut inference spend from $300/day to $40/day — up to 85% off serving cost
✅ Multi-node GPU training with FSDP, Accelerate, and clean checkpoint recovery
✅ GPU kernel optimization (Pallas/Triton, JAX/PyTorch) on frontier-model work
✅ Sub-second voice AI; cut human-fallback rate 46% at Paramount
✅ $300K+ projected SME savings from automated RAG evaluation at Vanguard
✅ MS in AI from Northwestern (GPA 3.95)

**Core Expertise:**
🔹 LLM inference optimization — quantization, distillation, batching, TensorRT
🔹 Distributed training — FSDP, tensor/pipeline parallelism, multi-node GPU
🔹 Voice AI & conversational systems (STT, TTS, dialog, latency budgets)
🔹 RAG systems and LLM evaluation
🔹 AWS MLOps (SageMaker, Bedrock, Triton)
🔹 HIPAA-aligned, compliance-ready ML infrastructure

**Tech Stack:**
Python • PyTorch • JAX • vLLM • TensorRT • Triton • LangGraph • AWS • Docker • Kubernetes

**What Excites Me:**
💡 Making inference fast and cheap enough that the product becomes possible
💡 Training infrastructure that survives node failures at 3am
💡 Shipping to real traffic, not demos
💡 Teams where the GPU bill is somebody's actual problem

📬 **Let's Connect:**
- 📧 Email: nsaiganesh2003@gmail.com
- 📞 Phone: +1 (773) 822-5301
- 💼 LinkedIn: linkedin.com/in/saiganeshn
- 💻 GitHub: github.com/SAIGANESH02
    `;
  },
});
