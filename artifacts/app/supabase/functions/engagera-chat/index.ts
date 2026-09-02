import Engagera from "npm:@afuchat1/engagera@0.2.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.25.76";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().trim().min(1).max(12_000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Request body must be valid JSON" }, 400);
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: "Invalid chat request" }, 400);
  }

  const apiKey = Deno.env.get("ENGAGERA_API_KEY");
  if (!apiKey) {
    return json({ ok: false, error: "AI discovery is not configured" });
  }

  const client = new Engagera({ apiKey, defaultModel: "engagera-pro" });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const reply = await client.chat.create({ messages: parsed.data.messages });
      return json({ ok: true, content: reply.content });
    } catch (error) {
      const status = typeof error === "object" && error !== null && "status" in error
        ? Number(error.status)
        : 0;
      const retryable = status === 0 || status === 429 || status >= 500;

      if (!retryable || attempt === 2) {
        const unavailable = retryable
          ? "AI discovery is temporarily unavailable"
          : "AI discovery request was rejected";
        return json({ ok: false, error: unavailable });
      }

      await wait(500 * 2 ** attempt);
    }
  }

  return json({ ok: false, error: "AI discovery is temporarily unavailable" });
});