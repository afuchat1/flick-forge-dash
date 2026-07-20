import Engagera from "@afuchat1/engagera";

const STORAGE_KEY = "engagera_api_key";

const readKey = (): string | undefined => {
  const envKey = (import.meta.env.VITE_ENGAGERA_API_KEY as string | undefined) ?? undefined;
  if (envKey) return envKey;
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
  }
  return undefined;
};

let _client: Engagera | null = null;
let _key: string | undefined = readKey();

const buildClient = (key?: string) => (key ? new Engagera({ apiKey: key, defaultModel: "engagera-2.1" }) : null);
_client = buildClient(_key);

export const getEngagera = () => {
  const latest = readKey();
  if (latest !== _key) {
    _key = latest;
    _client = buildClient(latest);
  }
  return _client;
};

export const hasEngagera = () => getEngagera() !== null;

export const setEngageraApiKey = (key: string) => {
  if (typeof window !== "undefined") {
    if (key.trim()) window.localStorage.setItem(STORAGE_KEY, key.trim());
    else window.localStorage.removeItem(STORAGE_KEY);
  }
  _key = key.trim() || undefined;
  _client = buildClient(_key);
};

export const getStoredEngageraKey = (): string => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
};

// Back-compat named export
export const engagera = getEngagera();


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
