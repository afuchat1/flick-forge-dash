import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Star, Loader2 } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useInfiniteMoviesByGenre, useGenres, getImageUrl, useMovieProviders } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const MovieCard = ({ movie }: { movie: any }) => {
  const { data: providers } = useMovieProviders(movie.id);
  const countryProviders = providers?.results?.US || providers?.results?.GB;
  const watchLink = countryProviders?.link;

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (watchLink) {
      window.open(watchLink, "_blank");
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
        <img 
          src={getImageUrl(movie.poster_path, "w342")} 
          alt={movie.title || movie.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Watch Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="gap-1.5 bg-primary/90 hover:bg-primary"
            onClick={handleWatch}
          >
            <Play className="h-3 w-3 fill-current" />
            Watch
          </Button>
        </div>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star className="h-2.5 w-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium mt-1.5 line-clamp-1">{movie.title || movie.name}</p>
      <p className="text-[10px] text-muted-foreground">
        {(movie.release_date || movie.first_air_date)?.split("-")[0]}
      </p>
    </Link>
  );
};

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const genreId = parseInt(genre || "0", 10);
  const { data: genres } = useGenres();
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteMoviesByGenre(genreId);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const genreName = genres?.find((g: { id: number; name: string }) => g.id === genreId)?.name || "Genre";
  
  const allMovies = data?.pages.flatMap(page => page.results) || [];
  const totalResults = data?.pages[0]?.total_results || 0;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14 md:pt-28">
        <div className="px-3 py-3">
          <Link to="/categories" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <h1 className="text-xl font-bold">{genreName}</h1>
          <p className="text-xs text-muted-foreground">
            {totalResults ? `${totalResults.toLocaleString()} titles` : "Loading..."}
          </p>
        </div>

        <div className="px-3">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 mt-1 w-3/4" />
                  <Skeleton className="h-2 mt-1 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {allMovies.map((movie, index) => (
                  <MovieCard key={`${movie.id}-${index}`} movie={movie} />
                ))}
              </div>
              
              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                )}
                {!hasNextPage && allMovies.length > 0 && (
                  <p className="text-xs text-muted-foreground">No more movies to load</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenrePage;