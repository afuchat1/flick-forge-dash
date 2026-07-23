import { Heart, Sparkles } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useTrending } from "@/hooks/useTMDB";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { askEngageraJson, hasEngagera } from "@/lib/engagera";

interface PersonalizedRecommendation {
  tmdb_id: number;
  title: string;
  poster_path: string;
  media_type: "movie" | "tv";
  reason: string;
  match_score: number;
}

const WhyYoullLoveThis = () => {
  const { user } = useAuth();
  const { watchlist, isLoading: watchlistLoading } = useWatchlist();
  const { data: trending } = useTrending("all", "week");

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["engagera-personalized-recommendations", watchlist.length],
    queryFn: async () => {
      if (watchlist.length === 0 || !hasEngagera()) return null;

      const trendingItems = trending?.results?.slice(0, 15) || [];

      const prompt = `Based on the user's watchlist, recommend up to 6 titles from the candidates list that they would love.

User watchlist:
${watchlist.map(w => `- ${w.title} (${w.media_type})`).join("\n")}

Candidates:
${trendingItems.map((item: any) => `- ${item.title || item.name} (${item.media_type || (item.title ? "movie" : "tv")}) - TMDB ID: ${item.id}`).join("\n")}

Return JSON of shape:
{"recommendations":[{"tmdb_id":number,"title":"...","poster_path":"optional tmdb path","media_type":"movie"|"tv","reason":"one sentence why it matches","match_score":0-100}]}
Only include candidates from the list. Use the exact TMDB ID from the candidate.`;

      const data = await askEngageraJson<{ recommendations: PersonalizedRecommendation[] }>(
        prompt,
        { recommendations: [] }
      );

      // Enrich poster_path from candidates when missing
      const enriched = (data.recommendations || []).map((rec) => {
        if (rec.poster_path) return rec;
        const candidate = trendingItems.find((item: any) => item.id === rec.tmdb_id);
        return candidate ? { ...rec, poster_path: candidate.poster_path || "" } : rec;
      });

      return { recommendations: enriched };
    },
    enabled: !!user && watchlist.length > 0 && !!trending?.results && hasEngagera(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (!user || watchlistLoading) return null;
  if (watchlist.length === 0) return null;

  return (
    <section className="py-3">
      <div className="flex items-center gap-2 px-3 mb-2">
        <Heart className="h-4 w-4 text-pink-500" />
        <h2 className="text-sm font-bold">For You</h2>
        <Sparkles className="h-3 w-3 text-primary animate-pulse" />
      </div>

      {isLoading && (
        <div className="flex gap-2.5 px-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="w-28 aspect-[2/3] rounded-lg" />
              <Skeleton className="h-3 w-20 mt-1.5" />
              <Skeleton className="h-2 w-24 mt-1" />
            </div>
          ))}
        </div>
      )}

      {recommendations && recommendations.recommendations.length > 0 && (
        <div className="flex gap-2.5 px-3 overflow-x-auto scrollbar-hide scroll-smooth">
          {recommendations.recommendations.map((rec, index) => (
            <Link
              key={rec.tmdb_id}
              to={`/${rec.media_type}/${rec.tmdb_id}`}
              className="flex-shrink-0 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative w-28 aspect-[2/3] rounded-lg overflow-hidden bg-card">
                <img
                  src={rec.poster_path
                    ? `https://image.tmdb.org/t/p/w342${rec.poster_path}`
                    : "/placeholder.svg"
                  }
                  alt={rec.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-1.5 right-1.5 bg-primary/90 text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  {rec.match_score}%
                </div>
              </div>
              <p className="text-[11px] font-medium mt-1.5 line-clamp-1 w-28 group-hover:text-primary transition-colors">
                {rec.title}
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-1 w-28">
                {rec.reason}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default WhyYoullLoveThis;
