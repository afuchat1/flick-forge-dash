import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useInfiniteSearch, useGenres, getImageUrl, useMoviesByGenre } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  const { 
    data: searchResults, 
    isLoading: searchLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteSearch(query);
  
  const { data: genres, isLoading: genresLoading } = useGenres();
  const { data: genreMovies } = useMoviesByGenre(selectedGenre || 0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update query when URL changes
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

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

  const allResults = searchResults?.pages.flatMap(page => page.results) || [];
  const totalResults = searchResults?.pages[0]?.total_results || 0;
  
  // Filter out person results
  const filteredResults = allResults.filter(item => item.media_type !== "person");
  
  // Show genre movies if a genre is selected and no search query
  const displayResults = query ? filteredResults : (selectedGenre ? genreMovies?.results || [] : []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedGenre(null);
              }}
              placeholder="Search movies & TV shows..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {!query && (
          <div className="px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {genresLoading ? (
                [...Array(8)].map((_, i) => <Skeleton key={i} className="h-7 w-16 rounded-lg flex-shrink-0" />)
              ) : (
                genres?.slice(0, 12).map((g: any) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedGenre === g.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                    }`}
                  >
                    {g.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="px-3 pt-2">
          {searchLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              ))}
            </div>
          ) : displayResults.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                {query ? `${totalResults.toLocaleString()} results for "${query}"` : `${displayResults.length} results`}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {displayResults.map((item, index) => {
                  const isTV = item.media_type === "tv" || item.first_air_date;
                  const path = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
                  const title = item.title || item.name || "Untitled";
                  
                  return (
                    <Link key={`${item.id}-${index}`} to={path}>
                      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                        <img 
                          src={getImageUrl(item.poster_path)} 
                          alt={title} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs font-medium mt-1 line-clamp-1">{title}</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <span className="text-primary">{Math.round(item.vote_average * 10)}%</span>
                        <span>{(item.release_date || item.first_air_date)?.slice(0, 4)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Infinite scroll trigger for search */}
              {query && (
                <div ref={loadMoreRef} className="py-8 flex justify-center">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading more...</span>
                    </div>
                  )}
                  {!hasNextPage && allResults.length > 0 && (
                    <p className="text-xs text-muted-foreground">End of results</p>
                  )}
                </div>
              )}
            </>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm">Search for movies and TV shows</p>
              <p className="text-xs text-muted-foreground mt-1">Or select a genre to browse</p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default SearchPage;