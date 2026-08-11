import { useEffect, useRef, useCallback, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Loader2, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import { useInfiniteDiscover, useGenres, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BrowseItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

const BrowseCard = ({ item }: { item: BrowseItem }) => {
  const isTV = !!item.first_air_date || item.media_type === "tv";
  const path = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
  const title = item.title || item.name || "Untitled";

  return (
    <Link to={path} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card ring-1 ring-border/40 transition-all group-hover:ring-primary/60">
        {item.poster_path ? (
          <img
            src={getImageUrl(item.poster_path, "w342")}
            alt={`${title} poster`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground px-2 text-center">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[11px] font-semibold text-foreground">View details</span>
        </div>
        {item.vote_average > 0 && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star className="h-2.5 w-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-medium">{item.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <p className="text-xs md:text-sm font-medium mt-1.5 line-clamp-1">{title}</p>
      <p className="text-[10px] md:text-xs text-muted-foreground">
        {(item.release_date || item.first_air_date)?.split("-")[0] || "—"}
      </p>
    </Link>
  );
};

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Grossing" },
];

const tvSortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "first_air_date.desc", label: "Newest First" },
  { value: "first_air_date.asc", label: "Oldest First" },
];

const BrowseAllPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaType = (searchParams.get("type") || "movie") as "movie" | "tv";
  const sortBy = searchParams.get("sort") || "popularity.desc";
  const genreId = searchParams.get("genre") || "all";

  const { data: genreData } = useGenres();
  const genres = (mediaType === "movie" ? genreData?.movie : genreData?.tv) || [];

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDiscover(mediaType, sortBy, genreId === "all" ? undefined : genreId);

  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const allItems = (data?.pages.flatMap((page) => page.results) || []) as BrowseItem[];
  const totalResults = data?.pages[0]?.total_results || 0;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (!sentinel) return;
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "600px 0px",
      threshold: 0,
    });
    observerRef.current.observe(sentinel);
    return () => observerRef.current?.disconnect();
  }, [sentinel, handleObserver]);

  // Fallback for tall desktop viewports where the first pages don't fill the screen
  useEffect(() => {
    if (
      !isLoading &&
      hasNextPage &&
      !isFetchingNextPage &&
      typeof window !== "undefined" &&
      document.documentElement.scrollHeight <= window.innerHeight + 200
    ) {
      fetchNextPage();
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, allItems.length, fetchNextPage]);

  const updateParams = (patch: Record<string, string>) => {
    setSearchParams({ type: mediaType, sort: sortBy, genre: genreId, ...patch });
  };

  const label = mediaType === "movie" ? "Movies" : "TV Shows";
  const options = mediaType === "movie" ? sortOptions : tvSortOptions;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <Seo
        title={`Browse All ${label} — AfuChat Movies`}
        description={`Explore the full ${label.toLowerCase()} catalogue by genre, rating and release date with endless scrolling.`}
        path={`/browse?type=${mediaType}`}
      />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
          <div className="py-3 md:py-6">
            <Link
              to={mediaType === "movie" ? "/movies" : "/tv-shows"}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
            <h1 className="text-xl md:text-3xl font-bold">Browse All {label}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {totalResults ? `${totalResults.toLocaleString()} titles` : "Loading catalogue..."}
            </p>
          </div>

          {/* Filters */}
          <div className="pb-4 flex flex-wrap gap-2">
            <Select value={mediaType} onValueChange={(v) => updateParams({ type: v, genre: "all" })}>
              <SelectTrigger className="w-32 h-9 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genreId} onValueChange={(v) => updateParams({ genre: v })}>
              <SelectTrigger className="w-40 h-9 text-xs md:text-sm">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((g: { id: number; name: string }) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => updateParams({ sort: v })}>
              <SelectTrigger className="flex-1 min-w-[10rem] md:flex-none md:w-56 h-9 text-xs md:text-sm">
                <SlidersHorizontal className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
              {[...Array(24)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 mt-1.5 w-3/4" />
                  <Skeleton className="h-2 mt-1 w-1/2" />
                </div>
              ))}
            </div>
          ) : allItems.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No titles match these filters.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
                {allItems.map((item, index) => (
                  <BrowseCard key={`${item.id}-${index}`} item={item} />
                ))}
              </div>

              <div ref={setSentinel} className="py-10 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                ) : hasNextPage ? (
                  <Button variant="outline" size="sm" onClick={() => fetchNextPage()}>
                    Load more
                  </Button>
                ) : (
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
