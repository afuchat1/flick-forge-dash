import { supabase } from "@/integrations/supabase/client";

/**
 * Single platform-wide Engagera key. No per-user keys, no localStorage:
 * AI works identically for signed-in and anonymous visitors.
 */
export const hasEngagera = () => true;

async function requestEngagera(messages: EngageraMessage[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke("engagera-chat", {
    body: { messages },
  });

  if (error || !data?.ok || typeof data.content !== "string") return "";
  return data.content;
}

export async function askEngageraJson<T>(prompt: string, fallback: T): Promise<T> {
  try {
    const text = await requestEngagera([
      {
        role: "system",
        content:
          "You are a helpful movie & TV recommendation assistant. Respond with ONLY valid JSON matching the requested schema — no prose, no markdown fences.",
      },
      { role: "user", content: prompt },
    ]);
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return fallback;
    return JSON.parse(match[0]) as T;
  } catch {
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
  try {
    const text = await requestEngagera([
      { role: "system", content: system },
      ...history,
    ]);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    return JSON.parse(match[0]) as T;
  } catch {
    return fallback;
  }
}
