import { mistral } from '@ai-sdk/mistral';
import { createDataStreamResponse, formatDataStreamPart, streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getCrazy } from './tools/getCrazy';
import { getFullTime } from './tools/getfulltime';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getSports } from './tools/getSports';
import { getWeather } from './tools/getWeather';

export const maxDuration = 30;

// Simple in-memory cache for identical requests.
// Note: this cache is per-server-instance (won't be shared across deployments/regions).
const RESPONSE_CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const RESPONSE_CACHE_MAX_ENTRIES = 200;
const responseCache = new Map<string, { value: string; expiresAt: number }>();

// ---- Token limits ----
// "General" questions (no tool section requested) get a higher cap.
const GENERAL_MAX_TOKENS = 800;

// When the user is clearly asking for a specific section/tool, use a tighter cap.
// These limits apply to the model output (assistant text + tool-call reasoning),
// not to the UI components rendered by the tool renderer.
type ToolName =
  | 'getProjects'
  | 'getPresentation'
  | 'getResume'
  | 'getContact'
  | 'getSkills'
  | 'getSports'
  | 'getCrazy'
  | 'getFullTime'
  | 'getWeather';

const TOOL_MAX_TOKENS: Record<ToolName, number> = {
  getProjects: 220,
  getPresentation: 240,
  getResume: 160,
  getContact: 160,
  getSkills: 260,
  getSports: 220,
  getCrazy: 220,
  getFullTime: 260,
  getWeather: 160,
};

const TOOL_TRIGGERS: Record<ToolName, RegExp[]> = {
  getProjects: [/projects?/i, /portfolio/i, /what have you built/i, /what.*built/i],
  getResume: [/resume/i, /\bcv\b/i, /experience/i],
  getSkills: [/skills?/i, /tech stack/i, /technologies/i],
  getContact: [/contact/i, /reach out/i, /email/i, /phone/i, /linkedin/i, /github/i],
  getPresentation: [/about you/i, /who are you/i, /tell me about yourself/i],
  getSports: [/gaming/i, /esports/i, /hobbies/i, /fun/i],
  getFullTime: [/job/i, /opportunit/i, /hiring/i, /full[- ]?time/i, /employment/i, /work/i],
  getWeather: [/weather/i, /temperature/i],
  getCrazy: [/crazy/i, /fun fact/i],
};

function inferRequestedTools(latestUserText: string): ToolName[] {
  const matches: ToolName[] = [];
  for (const [toolName, patterns] of Object.entries(TOOL_TRIGGERS)) {
    if (patterns.some((re) => re.test(latestUserText))) {
      matches.push(toolName as ToolName);
    }
  }
  return matches;
}

function pickMaxTokens(latestUserText: string) {
  const requestedTools = inferRequestedTools(latestUserText);
  if (requestedTools.length === 0) {
    return {
      maxTokens: GENERAL_MAX_TOKENS,
      activeTools: undefined as ToolName[] | undefined,
    };
  }

  const maxTokens = requestedTools.reduce((acc, toolName) => {
    const cap = TOOL_MAX_TOKENS[toolName] ?? 220;
    return Math.max(acc, cap);
  }, 0);

  return { maxTokens, activeTools: requestedTools };
}

function getCacheKey(payload: unknown) {
  // Keep key stable and include important generation settings.
  return JSON.stringify(payload);
}

function cacheGet(key: string): string | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

function cacheSet(key: string, value: string) {
  // Basic eviction: drop the oldest inserted entry (Map iteration order) when over capacity.
  if (responseCache.size >= RESPONSE_CACHE_MAX_ENTRIES) {
    const oldestKey = responseCache.keys().next().value as string | undefined;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { value, expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS });
}

// ❌ Pas besoin de l'export ici, Next.js n'aime pas ça
function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    messages.unshift(SYSTEM_PROMPT);

    const lastUser = [...messages].reverse().find((m) => m?.role === 'user');
    const lastUserText =
      lastUser && typeof lastUser.content === 'string' ? lastUser.content : '';
    const { maxTokens, activeTools } = pickMaxTokens(lastUserText);

    const cacheKey = getCacheKey({
      messages,
      model: 'mistral-large-latest',
      maxTokens,
      maxSteps: 2,
      activeTools,
    });

    const cached = cacheGet(cacheKey);
    if (cached) {
      return createDataStreamResponse({
        headers: {
          'x-chat-cache': 'HIT',
        },
        execute: (dataStream) => {
          dataStream.write(formatDataStreamPart('text', cached));
          dataStream.write(
            formatDataStreamPart('finish_message', { finishReason: 'stop' }),
          );
        },
        onError: errorHandler,
      });
    }

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getSports,
      getCrazy,
      getFullTime,
      getWeather,
    };

    const result = streamText({
      model: mistral('mistral-large-latest'),
      messages,
      toolCallStreaming: true,
      tools,
      maxSteps: 2,
      // Hard cap: limits maximum output tokens generated by the model.
      maxTokens,
      // If the user is clearly asking for a specific section, restrict tool access to that section(s).
      // This improves correctness and keeps responses shorter.
      experimental_activeTools: activeTools,
    });

    // Cache the final text once generation completes (doesn't block streaming response).
    result.text
      .then((text) => cacheSet(cacheKey, text))
      .catch(() => {
        // ignore cache errors
      });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
      headers: {
        'x-chat-cache': 'MISS',
      },
    });
  } catch (err) {
    console.error('Global error:', err);
    const errorMessage = errorHandler(err);
    return new Response(errorMessage, { status: 500 });
  }
}
