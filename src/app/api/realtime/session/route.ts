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
const VOICE_ADDENDUM = `

## You are speaking out loud

This is a voice conversation, not text. That changes things:
- Two or three sentences. People cannot skim speech.
- No markdown, no bullet points, no emoji, no URLs — none of it survives being read aloud. If someone wants a link, tell them it's on the site.
- Numbers stay, they're the whole point. "Three hundred dollars a day down to forty."
- Contractions and normal speech rhythm. Read your answer back in your head; if it sounds like a document, rewrite it.
- If they interrupt, stop and listen. Don't restart the sentence.
- Keep the visitor talking — this works best as a back-and-forth, not a lecture.`;

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
          audio: {
            input: { turn_detection: { type: 'server_vad' } },
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
