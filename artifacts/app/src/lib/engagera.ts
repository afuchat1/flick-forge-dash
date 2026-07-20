import Engagera from "@afuchat1/engagera";

const apiKey = import.meta.env.VITE_ENGAGERA_API_KEY as string | undefined;

if (!apiKey && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn(
    "[engagera] VITE_ENGAGERA_API_KEY is not set. AI features will be disabled.",
  );
}

export const engagera = apiKey
  ? new Engagera({ apiKey, defaultModel: "engagera-2.1" })
  : null;

export const hasEngagera = () => engagera !== null;

/** Ask AfuBot for a JSON payload matching an inline schema description. */
export async function askEngageraJson<T>(prompt: string, fallback: T): Promise<T> {
  if (!engagera) return fallback;
  try {
    const reply = await engagera.chat.create({
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
