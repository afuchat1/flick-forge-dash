import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useContentMatcher } from "@/hooks/useContentMatcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContentMatcherProps {
  title: string;
  type: string;
  genres?: string[];
  overview?: string;
}

const ContentMatcher = ({ title, type, genres, overview }: ContentMatcherProps) => {
  const { data, isLoading, error } = useContentMatcher({
    title,
    type,
    genres,
    overview,
  });

  // Fetch TMDB data for each match to get poster images
  const matchQueries = useQueries({
    queries: (data?.matches || []).slice(0, 6).map((match) => ({
      queryKey: ["tmdb-search-match", match.title],
      queryFn: async () => {
        const { data: result } = await supabase.functions.invoke("tmdb", {
          body: { endpoint: `/search/multi`, params: { query: match.title } },
        });
        const firstResult = result?.results?.[0];
        return {
          ...match,
          tmdb_id: firstResult?.id,
          poster_path: firstResult?.poster_path,
          media_type: firstResult?.media_type || match.type,
        };
      },
      enabled: !!data?.matches?.length,
      staleTime: 30 * 60 * 1000,
    })),
  });

  const enrichedMatches = matchQueries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => q.data!);

  const isEnriching = matchQueries.some((q) => q.isLoading);

  if (error) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">You might also like</h3>
      </div>

      {(isLoading || isEnriching) && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="w-28 aspect-[2/3] rounded-lg" />
              <Skeleton className="h-3 w-20 mt-1.5" />
              <Skeleton className="h-2 w-24 mt-1" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isEnriching && enrichedMatches.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {enrichedMatches.map((match, index) => (
            <Link
              key={index}
              to={match.tmdb_id ? `/${match.media_type}/${match.tmdb_id}` : `/search?q=${encodeURIComponent(match.title)}`}
              className="flex-shrink-0 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative w-28 aspect-[2/3] rounded-lg overflow-hidden bg-card">
                <img
                  src={match.poster_path 
                    ? `https://image.tmdb.org/t/p/w342${match.poster_path}`
                    : "/placeholder.svg"
                  }
                  alt={match.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-1.5 right-1.5 bg-primary/90 text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  {match.matchScore}%
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <div className="flex gap-1 flex-wrap">
                    {match.sharedThemes.slice(0, 2).map((theme) => (
                      <span
                        key={theme}
                        className="text-[8px] px-1 py-0.5 rounded bg-black/50 text-white/90"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-medium mt-1.5 line-clamp-1 w-28 group-hover:text-primary transition-colors">
                {match.title}
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-1 w-28">
                {match.reason}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ContentMatcher;
