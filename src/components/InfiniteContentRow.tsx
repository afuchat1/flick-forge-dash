import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { TMDBMovie, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InfiniteContentRowProps {
  title: string;
  movies?: TMDBMovie[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  showRanks?: boolean;
  href?: string;
}

const InfiniteContentRow = ({ 
  title, 
  movies, 
  isLoading, 
  isFetchingMore,
  hasMore,
  onLoadMore,
  showRanks, 
  href 
}: InfiniteContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isFetchingMore && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, isFetchingMore, onLoadMore]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !onLoadMore) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: scrollRef.current,
      rootMargin: "100px",
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver, onLoadMore]);

  if (isLoading) {
    return (
      <div className="py-3">
        <div className="px-3 mb-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2 px-3 overflow-x-auto scrollbar-hide">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse">
              <Skeleton className="w-28 aspect-[2/3] rounded-lg" />
              <Skeleton className="h-3 w-20 mt-1.5" />
              <Skeleton className="h-2 w-14 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies?.length) return null;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-bold">{title}</h2>
        {href && (
          <Link to={href} className="text-xs text-muted-foreground flex items-center hover:text-primary transition-colors">
            See all <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-2.5 px-3 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {movies.map((movie, index) => {
          const isTV = movie.media_type === "tv" || movie.first_air_date;
          const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
          const displayTitle = movie.title || movie.name || "Untitled";
          
          return (
            <Link
              key={`${movie.id}-${index}`}
              to={detailPath}
              className="flex-shrink-0 relative group animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              {showRanks && index < 10 && (
                <span className="absolute -left-1 bottom-8 text-5xl font-black text-foreground/20 z-10 drop-shadow-lg">
                  {index + 1}
                </span>
              )}
              <div className={cn(
                "aspect-[2/3] rounded-lg overflow-hidden bg-card transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/50",
                showRanks && index < 10 ? "w-24 ml-4" : "w-28"
              )}>
                <img
                  src={getImageUrl(movie.poster_path, "w342")}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] font-medium mt-1.5 line-clamp-1 w-28">{displayTitle}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="text-primary font-medium">{Math.round(movie.vote_average * 10)}%</span>
                <span>{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</span>
              </div>
            </Link>
          );
        })}

        {/* Inline loading indicator */}
        {onLoadMore && (
          <div ref={loadMoreRef} className="flex-shrink-0 flex items-center justify-center w-16">
            {isFetchingMore && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-[10px] text-muted-foreground">Loading...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteContentRow;
