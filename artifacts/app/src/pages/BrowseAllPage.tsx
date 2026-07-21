import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Star, Loader2, Filter, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { 
  useInfiniteDiscover, 
  useInfinitePopularMovies, 
  useInfinitePopularTV,
  useGenres,
  getImageUrl, 
  useMovieProviders 
} from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MovieCard = ({ item }: { item: any }) => {
  const isTV = item.media_type === "tv" || item.first_air_date;
  const { data: providers } = useMovieProviders(isTV ? 0 : item.id);
  const countryProviders = providers?.results?.US || providers?.results?.GB;
  const watchLink = countryProviders?.link;
  const path = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (watchLink) {
      window.open(watchLink, "_blank");
    }
  };

  return (
    <Link to={path} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
        <img 
          src={getImageUrl(item.poster_path, "w342")} 
          alt={item.title || item.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
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
        {item.vote_average > 0 && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star className="h-2.5 w-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-medium">{item.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium mt-1.5 line-clamp-1">{item.title || item.name}</p>
      <p className="text-[10px] text-muted-foreground">
        {(item.release_date || item.first_air_date)?.split("-")[0]}
      </p>
    </Link>
  );
};

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Grossing" },
];

const BrowseAllPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaType = (searchParams.get("type") || "movie") as "movie" | "tv";
  const sortBy = searchParams.get("sort") || "popularity.desc";
  
  const { data: genres } = useGenres();
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteDiscover(mediaType, sortBy);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allItems = data?.pages.flatMap(page => page.results) || [];
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
      rootMargin: "200px",
      threshold: 0,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleTypeChange = (value: string) => {
    setSearchParams({ type: value, sort: sortBy });
  };

  const handleSortChange = (value: string) => {
    setSearchParams({ type: mediaType, sort: value });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      
      <main className="pt-24 md:pt-40">
        <div className="px-3 py-3">
          <Link to={mediaType === "movie" ? "/movies" : "/tv-shows"} className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <h1 className="text-xl font-bold">
            Browse All {mediaType === "movie" ? "Movies" : "TV Shows"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {totalResults ? `${totalResults.toLocaleString()} titles available` : "Loading..."}
          </p>
        </div>

        {/* Filters */}
        <div className="px-3 pb-3 flex gap-2">
          <Select value={mediaType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SlidersHorizontal className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="px-3">
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {[...Array(18)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 mt-1 w-3/4" />
                  <Skeleton className="h-2 mt-1 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {allItems.map((item, index) => (
                  <MovieCard key={`${item.id}-${index}`} item={item} />
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
                {!hasNextPage && allItems.length > 0 && (
                  <p className="text-xs text-muted-foreground">You've reached the end</p>
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

export default BrowseAllPage;