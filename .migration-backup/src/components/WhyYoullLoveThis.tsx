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
