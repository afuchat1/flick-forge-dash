import { Heart, Sparkles } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTrending } from "@/hooks/useTMDB";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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
    queryKey: ["personalized-recommendations", watchlist.length],
    queryFn: async () => {
      if (watchlist.length === 0) return null;

      // Get some trending items to recommend
      const trendingItems = trending?.results?.slice(0, 10) || [];
      
      const { data, error } = await supabase.functions.invoke("personalized-recommendations", {
        body: { 
          watchlist: watchlist.map(w => ({
            title: w.title,
            media_type: w.media_type,
          })),
          candidates: trendingItems.map((item: any) => ({
            tmdb_id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            media_type: item.media_type || (item.title ? "movie" : "tv"),
            overview: item.overview,
          })),
        },
      });
      
      if (error) throw error;
      return data as { recommendations: PersonalizedRecommendation[] };
    },
    enabled: !!user && watchlist.length > 0 && !!trending?.results,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (!user || watchlistLoading) return null;
  if (watchlist.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-pink-500" />
        <h2 className="text-lg font-semibold">Why You'll Love These</h2>
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      </div>

      {isLoading && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-40">
              <Skeleton className="w-40 h-60 rounded-lg" />
              <Skeleton className="h-4 w-32 mt-2" />
              <Skeleton className="h-3 w-full mt-1" />
            </div>
          ))}
        </div>
      )}

      {recommendations && recommendations.recommendations.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recommendations.recommendations.map((rec) => (
            <Link
              key={rec.tmdb_id}
              to={`/${rec.media_type}/${rec.tmdb_id}`}
              className="flex-shrink-0 w-40 group"
            >
              <div className="relative">
                <img
                  src={rec.poster_path 
                    ? `https://image.tmdb.org/t/p/w300${rec.poster_path}`
                    : "/placeholder.svg"
                  }
                  alt={rec.title}
                  className="w-40 h-60 object-cover rounded-lg group-hover:ring-2 ring-primary transition-all"
                />
                <div className="absolute top-2 right-2 bg-pink-500/90 text-white text-xs px-2 py-0.5 rounded-full">
                  {rec.match_score}% match
                </div>
              </div>
              <h3 className="font-medium text-sm mt-2 line-clamp-1 group-hover:text-primary transition-colors">
                {rec.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
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
