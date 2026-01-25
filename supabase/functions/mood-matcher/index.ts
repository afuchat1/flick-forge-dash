import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const moodToGenres: Record<string, string[]> = {
  happy: ["Comedy", "Animation", "Family", "Musical"],
  sad: ["Drama", "Romance", "War"],
  romantic: ["Romance", "Drama", "Comedy"],
  excited: ["Action", "Adventure", "Sci-Fi"],
  relaxed: ["Documentary", "Animation", "Drama"],
  cozy: ["Family", "Animation", "Comedy", "Fantasy"],
  thrilled: ["Thriller", "Horror", "Action", "Crime"],
  thoughtful: ["Mystery", "Sci-Fi", "Drama", "Documentary"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mood } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const genres = moodToGenres[mood] || ["Drama"];

    const prompt = `You are a movie recommendation expert. Based on someone feeling "${mood}", suggest exactly 3 movies that would be perfect for this mood.

Preferred genres: ${genres.join(", ")}

For each movie, provide:
1. The exact movie title
2. A brief, compelling reason why it's perfect for this mood (1 sentence, max 15 words)
3. 2 genre tags

Return ONLY a valid JSON array with this exact structure:
[
  {"title": "Movie Name", "reason": "Brief reason", "genres": ["Genre1", "Genre2"]},
  {"title": "Movie Name", "reason": "Brief reason", "genres": ["Genre1", "Genre2"]},
  {"title": "Movie Name", "reason": "Brief reason", "genres": ["Genre1", "Genre2"]}
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
        max_tokens: 500,
        temperature: 0.8,
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

    // Parse JSON from response
    let suggestions = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    } catch {
      suggestions = [
        { title: "The Shawshank Redemption", reason: "An uplifting tale of hope and friendship", genres: ["Drama"] },
        { title: "Amélie", reason: "Whimsical and heartwarming", genres: ["Romance", "Comedy"] },
        { title: "The Grand Budapest Hotel", reason: "Visually stunning and delightfully quirky", genres: ["Comedy", "Adventure"] },
      ];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("mood-matcher error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
