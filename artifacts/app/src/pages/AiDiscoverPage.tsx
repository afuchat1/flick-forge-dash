import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send, Loader2, Mic, RotateCcw, Star } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { askEngageraConversationJson, hasEngagera, EngageraMessage } from "@/lib/engagera";
import { getImageUrl } from "@/hooks/useTMDB";

interface AiTitle {
  title: string;
  year?: string | number;
  type?: "movie" | "tv";
  confidence?: number;
  why?: string;
}

interface AiReply {
  reply: string;
  titles: AiTitle[];
  followUps: string[];
}

interface EnrichedTitle extends AiTitle {
  tmdbId?: number;
  posterPath?: string | null;
  mediaType: "movie" | "tv";
  rating?: number;
  date?: string;
  overview?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  results?: EnrichedTitle[];
  followUps?: string[];
}

const SYSTEM_PROMPT = `You are the AfuChat Movies discovery assistant. Users describe a film or series from memory — a half-remembered plot, a scene, a vibe, an actor, a mood, or a research question about cinema — and you identify or recommend real titles.

Rules:
- Only reference real, existing movies or TV shows with their exact official English titles.
- When a user describes a specific title they are trying to remember, put your single best guess first and add plausible alternatives after it.
- When the request is a mood, theme or "something like X", return a curated set of 6-10 titles.
- Never invent titles, never return streaming links, never claim a title can be watched here — this platform is a discovery library only.
- Keep "reply" short (max 3 sentences) and conversational. Put per-title reasoning in "why".

Respond with ONLY valid JSON, no markdown fences, of exactly this shape:
{"reply":"...","titles":[{"title":"Exact Title","year":"1999","type":"movie","confidence":0-100,"why":"one short sentence"}],"followUps":["short suggested next question","..."]}
If no titles apply, return an empty titles array.`;

const STARTERS = [
  "A sci-fi film where a man relives the same day fighting aliens",
  "Slow, beautiful movies to watch on a rainy night",
  "Series like Breaking Bad but set outside the US",
  "That 90s thriller with a twist ending on a boat",
  "Best films by cinematographer Roger Deakins",
];

const searchTmdb = async (title: string, year?: string | number, type?: string) => {
  const { data } = await supabase.functions.invoke("tmdb", {
    body: {
      endpoint: "/search/multi",
      params: { query: title, ...(year ? { year: String(year) } : {}) },
    },
  });
  const results = (data?.results || []).filter(
    (r: any) => r.media_type === "movie" || r.media_type === "tv"
  );
  const preferred =
    results.find(
      (r: any) =>
        (!type || r.media_type === type) &&
        (r.title || r.name || "").toLowerCase() === title.toLowerCase()
    ) ||
    results.find((r: any) => !type || r.media_type === type) ||
    results[0];
  return preferred;
};

const AiDiscoverPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const historyRef = useRef<EngageraMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const speechSupported =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    // Full history is resent on every call — the model is stateless.
    historyRef.current = [...historyRef.current, { role: "user" as const, content: text }].slice(-16);

    const fallback: AiReply = {
      reply: hasEngagera()
        ? "I couldn't reach the AI service just now. Try rephrasing, or search the library directly."
        : "AI discovery is unavailable right now.",
      titles: [],
      followUps: [],
    };

    const ai = await askEngageraConversationJson<AiReply>(
      SYSTEM_PROMPT,
      historyRef.current,
      fallback
    );

    const titles = Array.isArray(ai.titles) ? ai.titles.slice(0, 10) : [];
    const enriched: EnrichedTitle[] = (
      await Promise.all(
        titles.map(async (t) => {
          try {
            const hit = await searchTmdb(t.title, t.year, t.type);
            if (!hit) return null;
            return {
              ...t,
              tmdbId: hit.id,
              posterPath: hit.poster_path,
              mediaType: (hit.media_type === "tv" ? "tv" : "movie") as "movie" | "tv",
              rating: hit.vote_average,
              date: hit.release_date || hit.first_air_date,
              overview: hit.overview,
            };
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean) as EnrichedTitle[];

    historyRef.current = [
      ...historyRef.current,
      { role: "assistant" as const, content: JSON.stringify({ reply: ai.reply, titles }) },
    ].slice(-16);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: ai.reply || "Here's what I found.",
        results: enriched,
        followUps: Array.isArray(ai.followUps) ? ai.followUps.slice(0, 3) : [],
      },
    ]);
    setBusy(false);
  };

  const reset = () => {
    historyRef.current = [];
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo
        title="AI Movie Finder — Describe It, Discover It | AfuChat Movies"
        description="Describe a plot, a scene, a mood or a half-remembered detail and our AI finds the exact movie or series, with full details from the library."
        path="/ai"
      />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-4xl px-3 md:px-6">
          <div className="flex items-start justify-between gap-3 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h1 className="text-xl md:text-3xl font-bold">AI Discovery</h1>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Describe a plot, a scene, an actor or just a mood — the assistant identifies the
                title and links straight to its full documentation page.
              </p>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={reset} className="shrink-0">
                <RotateCcw className="h-4 w-4 mr-1" /> New chat
              </Button>
            )}
          </div>

          {messages.length === 0 && (
            <div className="space-y-2 pb-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Try one of these
              </p>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs text-left rounded-full border border-border/60 px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-5 pb-6">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm">
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="space-y-3">
                  <div className="flex gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <p className="text-sm leading-relaxed text-foreground/90">{m.text}</p>
                  </div>

                  {!!m.results?.length && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {m.results.map((r, i) => (
                        <Link
                          key={`${r.tmdbId}-${i}`}
                          to={`/${r.mediaType}/${r.tmdbId}`}
                          className="group rounded-lg overflow-hidden bg-card/60 border border-border/40 hover:border-primary/50 transition-colors"
                        >
                          <div className="aspect-[2/3] bg-card relative">
                            <img
                              src={getImageUrl(r.posterPath ?? null, "w342")}
                              alt={r.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {typeof r.confidence === "number" && (
                              <span className="absolute top-1.5 right-1.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5">
                                {Math.round(r.confidence)}%
                              </span>
                            )}
                          </div>
                          <div className="p-2 space-y-1">
                            <p className="text-[12px] font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                              {r.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{r.date?.slice(0, 4) || "—"}</span>
                              <span className="uppercase">{r.mediaType}</span>
                              {!!r.rating && (
                                <span className="flex items-center gap-0.5 text-primary">
                                  <Star className="h-2.5 w-2.5 fill-current" />
                                  {r.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                            {r.why && (
                              <p className="text-[10px] text-muted-foreground line-clamp-2">
                                {r.why}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {!!m.followUps?.length && (
                    <div className="flex flex-wrap gap-2">
                      {m.followUps.map((f) => (
                        <button
                          key={f}
                          onClick={() => send(f)}
                          className="text-[11px] rounded-full border border-border/60 px-2.5 py-1 hover:border-primary hover:text-primary transition-colors"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Searching the library…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="sticky bottom-0 md:bottom-0 bg-background/95 backdrop-blur border-t border-border/40">
          <div className="mx-auto w-full max-w-4xl px-3 md:px-6 py-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Describe the movie or what you're in the mood for…"
                className="min-h-[44px] max-h-32 resize-none text-sm"
              />
              {speechSupported && (
                <Button
                  variant={listening ? "default" : "outline"}
                  size="icon"
                  onClick={toggleVoice}
                  aria-label="Speak your description"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Send">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default AiDiscoverPage;
