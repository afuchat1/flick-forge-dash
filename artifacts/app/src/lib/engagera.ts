import Engagera from "@afuchat1/engagera";

/**
 * Single platform-wide Engagera key. No per-user keys, no localStorage:
 * AI works identically for signed-in and anonymous visitors.
 */
const PLATFORM_KEY = (import.meta.env.VITE_ENGAGERA_API_KEY as string | undefined)?.trim() || "";

let _client: Engagera | null = PLATFORM_KEY
  ? new Engagera({ apiKey: PLATFORM_KEY, defaultModel: "engagera-2.1" })
  : null;

export const getEngagera = () => _client;

export const hasEngagera = () => _client !== null;

// Back-compat named export
export const engagera = _client;

export async function askEngageraJson<T>(prompt: string, fallback: T): Promise<T> {
  const client = getEngagera();
  if (!client) return fallback;
  try {
    const reply = await client.chat.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful movie & TV recommendation assistant. Respond with ONLY valid JSON matching the requested schema — no prose, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
    });
    const text = (reply as any).content ?? "";
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return fallback;
    return JSON.parse(match[0]) as T;
  } catch (err) {
    console.error("[engagera] request failed", err);
    return fallback;
  }
}
