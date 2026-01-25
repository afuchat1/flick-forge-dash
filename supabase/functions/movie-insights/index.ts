import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MovieData {
  title: string;
  overview: string;
  genres: string[];
  release_year: string;
  rating: number;
  runtime?: number;
  cast?: string[];
}

interface InsightRequest {
  movie: MovieData;
  type: "insights" | "why-watch" | "mood" | "trivia";
  watchlist?: MovieData[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { movie, type, watchlist } = await req.json() as InsightRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "insights":
        systemPrompt = `You are a film expert. Provide 2-3 fascinating insights about movies. Be concise and insightful. Focus on: cinematography, themes, cultural impact, behind-the-scenes facts, or artistic choices. Keep each insight to 1-2 sentences. Return as JSON array of strings.`;
        userPrompt = `Movie: "${movie.title}" (${movie.release_year})
Genres: ${movie.genres.join(", ")}
Overview: ${movie.overview}
Rating: ${movie.rating}/10

Provide fascinating insights about this film.`;
        break;

      case "why-watch":
        systemPrompt = `You are a personalized movie recommender. Based on the user's watchlist, explain in 2-3 sentences why they might enjoy this specific movie. Be specific and reference patterns from their watchlist. If no watchlist provided, give general compelling reasons.`;
        const watchlistTitles = watchlist?.map(m => `${m.title} (${m.genres.join(", ")})`).join(", ") || "No watchlist";
        userPrompt = `User's watchlist: ${watchlistTitles}

Movie to recommend: "${movie.title}" (${movie.release_year})
Genres: ${movie.genres.join(", ")}
Overview: ${movie.overview}

Why should this user watch this movie?`;
        break;

      case "mood":
        systemPrompt = `You are a movie mood analyzer. Describe the emotional experience of watching this movie in one evocative sentence. Use descriptive language that captures the film's atmosphere and emotional journey.`;
        userPrompt = `Analyze the mood/atmosphere of: "${movie.title}"
Genres: ${movie.genres.join(", ")}
Overview: ${movie.overview}`;
        break;

      case "trivia":
        systemPrompt = `You are a film trivia expert. Share one surprising or little-known fact about this movie. Keep it to 1-2 sentences. Focus on production, casting, box office, awards, or cultural impact.`;
        userPrompt = `Share a fascinating trivia fact about: "${movie.title}" (${movie.release_year})`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse as JSON for insights, otherwise return as string
    let result = content;
    if (type === "insights") {
      try {
        // Extract JSON array from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = [content];
        }
      } catch {
        result = [content];
      }
    }

    return new Response(JSON.stringify({ result, type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("movie-insights error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
