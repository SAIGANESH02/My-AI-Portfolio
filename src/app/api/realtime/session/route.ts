import { SYSTEM_PROMPT } from '@/app/api/chat/prompt';

export const maxDuration = 30;

// Verified against the account's model list — the older gpt-4o-realtime-preview
// names and the /v1/realtime/sessions endpoint are both gone (the beta shape
// now returns beta_api_shape_disabled). GA is /v1/realtime/client_secrets.
// (not exported — Next.js route files may only export handlers and config)
const REALTIME_MODEL = 'gpt-realtime-2.1-mini';
const VOICE = 'verse';

// Realtime audio is priced per audio token and costs cents per minute — orders
// of magnitude more than the text chat. These limits exist so a public URL
// can't run up a bill.
const SESSION_SECONDS = 90;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const bad = (message: string, status: number) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });

// Spoken answers need to be shorter than written ones, and must never read
// markdown aloud. Everything else about the persona carries over.
/**
 * The same nine sections the text chat can render, exposed to the voice model
 * as functions. The browser renders the matching card when one fires — the
 * spoken answer and the visual card arrive together.
 */
const VOICE_TOOLS = [
  ['getProjects', 'Show the full list of AI/ML projects. Use for projects, portfolio, what you have built.'],
  ['getResume', 'Show the downloadable resume card. Use for resume, CV, work history.'],
  ['getSkills', 'Show the skills and tech stack card.'],
  ['getContact', 'Show contact details. Use for email, reaching out, getting in touch.'],
  ['getPresentation', 'Show the personal introduction card. Use for "who are you", "tell me about yourself".'],
  ['getSports', 'Show the esports/gaming card, which also contains the aim trainer. Use for hobbies, gaming, fun.'],
  ['getFullTime', 'Show the availability card. Use for hiring, job search, opportunities.'],
  ['getCrazy', 'Show the craziest-thing-done card.'],
].map(([name, description]) => ({
  type: 'function' as const,
  name,
  description,
  parameters: { type: 'object', properties: {}, required: [] },
}));

const VOICE_ADDENDUM = `

## You are speaking out loud

This is a voice conversation, not text. That changes things:
- Two or three sentences. People cannot skim speech.
- No markdown, no bullet points, no emoji, no URLs — none of it survives being read aloud. If someone wants a link, tell them it's on the site.
- Numbers stay, they're the whole point. "Three hundred dollars a day down to forty."
- Contractions and normal speech rhythm. Read your answer back in your head; if it sounds like a document, rewrite it.
- If they interrupt, stop and listen. Don't restart the sentence.
- Keep the visitor talking — this works best as a back-and-forth, not a lecture.

## Language

Speak English. Transcription is imperfect, and a single garbled turn is not a request to switch languages — if a transcript comes through in another language, assume it was misheard and carry on in English. Only switch if the visitor clearly and repeatedly speaks to you in another language across several turns. Never announce what language you are speaking.

## Showing things while you talk

You can put a visual card on screen by calling one of the functions. When someone asks to *see* something — projects, resume, skills, contact — call it, then say one short line about what's now on their screen. Never read the card's contents aloud; they can see it. "That's all sixteen — Wealth Advisor AI is the newest" is right. Listing every project is not.`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return bad('Voice mode is not configured on this deployment.', 503);
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (rateLimited(ip)) {
      return bad(
        "That's a few voice calls already — give it 15 minutes. The text chat has no limit.",
        429
      );
    }

    const instructions = `${SYSTEM_PROMPT.content}${VOICE_ADDENDUM}`;

    const res = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Token dies shortly after the call would have ended anyway.
        expires_after: { anchor: 'created_at', seconds: SESSION_SECONDS + 30 },
        session: {
          type: 'realtime',
          model: REALTIME_MODEL,
          instructions,
          output_modalities: ['audio'],
          tools: VOICE_TOOLS,
          tool_choice: 'auto',
          audio: {
            input: {
              transcription: {
                // gpt-4o-transcribe is materially more accurate than whisper-1.
                model: 'gpt-4o-transcribe',
                // Pinned. Left to auto-detect, short or accented utterances
                // were being mis-detected as Hindi; that bad transcript then
                // entered the conversation and the model replied in Hindi.
                language: 'en',
                // Biases decoding toward the vocabulary that actually comes up.
                prompt:
                  'Technical conversation about machine learning engineering: vLLM, TensorRT, Triton, FSDP, LoRA, Llama, Qwen, RAG, inference, quantization, distillation, latency, Northwestern, XSELL, Vanguard, Paramount, Cincinnatus, Sai Ganesh Nellore.',
              },
              turn_detection: { type: 'server_vad' },
            },
            output: { voice: VOICE },
          },
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('[REALTIME] mint failed:', res.status, detail.slice(0, 500));
      return bad("Couldn't start a voice session. Try the text chat.", 502);
    }

    const data = await res.json();

    // Only the ephemeral value crosses to the browser — never the real key.
    return Response.json({
      token: data.value,
      model: REALTIME_MODEL,
      seconds: SESSION_SECONDS,
    });
  } catch (err) {
    console.error('[REALTIME] error:', err);
    return bad('Something broke starting the voice session.', 500);
  }
}
