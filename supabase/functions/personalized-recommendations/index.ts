import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WatchlistItem {
  title: string;
  media_type: string;
}

interface Candidate {
  tmdb_id: number;
  title: string;
  poster_path: string;
  media_type: string;
  overview: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { watchlist, candidates } = await req.json() as { 
      watchlist: WatchlistItem[]; 
      candidates: Candidate[];
    };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!watchlist.length || !candidates.length) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const watchlistTitles = watchlist.map(w => w.title).join(", ");
    const candidatesList = candidates.map((c, i) => 
      `${i + 1}. "${c.title}" (${c.media_type}): ${c.overview.slice(0, 100)}...`
    ).join("\n");

    const prompt = `You are a movie recommendation AI. A user has these in their watchlist: ${watchlistTitles}

Based on their taste, analyze these candidates and recommend the TOP 3 that best match their preferences:
${candidatesList}

For each recommendation, provide:
1. The candidate number (1-${candidates.length})
2. A personalized reason why this user would love it (max 12 words, reference their watchlist taste)
3. A match percentage (75-98%)

Return ONLY a valid JSON array:
[
  {"index": 1, "reason": "Perfect for fans of...", "match_score": 92},
  {"index": 2, "reason": "Similar vibes to...", "match_score": 88},
  {"index": 3, "reason": "You'll love the...", "match_score": 85}
]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let recommendations: any[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        recommendations = parsed.map((item: any) => {
          const candidate = candidates[item.index - 1];
          if (!candidate) return null;
          return {
            tmdb_id: candidate.tmdb_id,
            title: candidate.title,
            poster_path: candidate.poster_path,
            media_type: candidate.media_type,
            reason: item.reason,
            match_score: item.match_score,
          };
        }).filter(Boolean);
      }
    } catch {
      // Fallback: return first 3 candidates with generic reasons
      recommendations = candidates.slice(0, 3).map((c, i) => ({
        tmdb_id: c.tmdb_id,
        title: c.title,
        poster_path: c.poster_path,
        media_type: c.media_type,
        reason: "Based on your watching history",
        match_score: 85 - i * 5,
      }));
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("personalized-recommendations error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
