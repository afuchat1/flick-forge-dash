import Engagera from "@afuchat1/engagera";

/**
 * Single platform-wide Engagera key. No per-user keys, no localStorage:
 * AI works identically for signed-in and anonymous visitors.
 */
const PLATFORM_KEY =
  (import.meta.env.VITE_ENGAGERA_API_KEY as string | undefined)?.trim() ||
  "eng_2ed3f056425528efe6685e1d5f833a2b25910ae83c32f090a2320e8b298a2ca7";


let _client: Engagera | null = PLATFORM_KEY
  ? new Engagera({ apiKey: PLATFORM_KEY, defaultModel: "engagera-2.1" })
  : null;

export const getEngagera = () => _client;

export const hasEngagera = () => _client !== null;

// Back-compat named export
export const engagera = _client;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retries transient (5xx / network) upstream failures a couple of times. */
async function chatWithRetry(client: Engagera, messages: any[], attempts = 3) {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await client.chat.create({ messages });
    } catch (err: any) {
      lastErr = err;
      const status = err?.status;
      const transient = status === undefined || status >= 500 || status === 429;
      if (!transient || i === attempts - 1) break;
      await sleep(400 * 2 ** i);
    }
  }
  throw lastErr;
}

export async function askEngageraJson<T>(prompt: string, fallback: T): Promise<T> {
  const client = getEngagera();
  if (!client) return fallback;
  try {
    const reply = await chatWithRetry(client, [
      {
        role: "system",
        content:
          "You are a helpful movie & TV recommendation assistant. Respond with ONLY valid JSON matching the requested schema — no prose, no markdown fences.",
      },
      { role: "user", content: prompt },
    ]);
    const text = (reply as any).content ?? "";
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return fallback;
    return JSON.parse(match[0]) as T;
  } catch (err: any) {
    // Upstream AI outage — non-fatal, callers render without AI extras.
    console.warn("[engagera] request unavailable:", err?.status ?? "network");
    return fallback;
  }
}


export interface EngageraMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Multi-turn conversation helper. Sends the full history every call (the model
 * is stateless) and parses a single JSON object out of the reply.
 */
export async function askEngageraConversationJson<T>(
  system: string,
  history: EngageraMessage[],
  fallback: T
): Promise<T> {
  const client = getEngagera();
  if (!client) return fallback;
  try {
    const reply = await client.chat.create({
      messages: [{ role: "system", content: system }, ...history],
    });
    const text = (reply as any).content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    return JSON.parse(match[0]) as T;
  } catch (err) {
    console.error("[engagera] conversation failed", err);
    return fallback;
  }
}
