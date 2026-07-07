import Header from "@/components/Header";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import CategoryCards from "@/components/CategoryCards";
import InfiniteContentRow from "@/components/InfiniteContentRow";
import MobileNav from "@/components/MobileNav";
import RecentlyViewed from "@/components/RecentlyViewed";
import WhyYoullLoveThis from "@/components/WhyYoullLoveThis";

import { 
  useTrending, 
  useInfinitePopularMovies, 
  useInfiniteTopRatedMovies, 
  useInfiniteNowPlayingMovies,
  useInfinitePopularTV,
  useInfiniteUpcomingMovies
} from "@/hooks/useTMDB";

const Index = () => {
  const { data: trending, isLoading: trendingLoading } = useTrending("all", "week");
  
  const { 
    data: popularMovies, 
    isLoading: popularLoading,
    fetchNextPage: fetchMorePopular,
    hasNextPage: hasMorePopular,
    isFetchingNextPage: isFetchingPopular
  } = useInfinitePopularMovies();
  
  const { 
    data: topRated, 
    isLoading: topRatedLoading,
    fetchNextPage: fetchMoreTopRated,
    hasNextPage: hasMoreTopRated,
    isFetchingNextPage: isFetchingTopRated
  } = useInfiniteTopRatedMovies();
  
  const { 
    data: nowPlaying, 
    isLoading: nowPlayingLoading,
    fetchNextPage: fetchMoreNowPlaying,
    hasNextPage: hasMoreNowPlaying,
    isFetchingNextPage: isFetchingNowPlaying
  } = useInfiniteNowPlayingMovies();
  
  const { 
    data: popularTV, 
    isLoading: tvLoading,
    fetchNextPage: fetchMoreTV,
    hasNextPage: hasMoreTV,
    isFetchingNextPage: isFetchingTV
  } = useInfinitePopularTV();
  
  const { 
    data: upcoming, 
    isLoading: upcomingLoading,
    fetchNextPage: fetchMoreUpcoming,
    hasNextPage: hasMoreUpcoming,
    isFetchingNextPage: isFetchingUpcoming
  } = useInfiniteUpcomingMovies();

  // Flatten infinite query results
  const allPopularMovies = popularMovies?.pages.flatMap(p => p.results) || [];
  const allTopRated = topRated?.pages.flatMap(p => p.results) || [];
  const allNowPlaying = nowPlaying?.pages.flatMap(p => p.results) || [];
  const allPopularTV = popularTV?.pages.flatMap(p => p.results) || [];
  const allUpcoming = upcoming?.pages.flatMap(p => p.results) || [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-32">
        <TMDBHeroCarousel movies={trending?.results} isLoading={trendingLoading} />
        
        
        {/* Recently Viewed */}
        <RecentlyViewed />
        
        {/* Personalized Recommendations */}
        <WhyYoullLoveThis />
        
        <CategoryCards />
        
        <div className="space-y-1">
          <InfiniteContentRow 
            title="Top 10 Today" 
            movies={allTopRated.slice(0, 10)} 
            isLoading={topRatedLoading} 
            showRanks 
            href="/new-popular" 
          />
          <InfiniteContentRow 
            title="Trending Now" 
            movies={trending?.results} 
            isLoading={trendingLoading} 
            href="/new-popular" 
          />
          <InfiniteContentRow 
            title="Popular Movies" 
            movies={allPopularMovies} 
            isLoading={popularLoading}
            isFetchingMore={isFetchingPopular}
            hasMore={hasMorePopular}
            onLoadMore={fetchMorePopular}
            href="/movies" 
          />
          <InfiniteContentRow 
            title="Popular TV Shows" 
            movies={allPopularTV} 
            isLoading={tvLoading}
            isFetchingMore={isFetchingTV}
            hasMore={hasMoreTV}
            onLoadMore={fetchMoreTV}
            href="/tv-shows" 
          />
          <InfiniteContentRow 
            title="Now Playing" 
            movies={allNowPlaying} 
            isLoading={nowPlayingLoading}
            isFetchingMore={isFetchingNowPlaying}
            hasMore={hasMoreNowPlaying}
            onLoadMore={fetchMoreNowPlaying}
            href="/movies" 
          />
          <InfiniteContentRow 
            title="Coming Soon" 
            movies={allUpcoming} 
            isLoading={upcomingLoading}
            isFetchingMore={isFetchingUpcoming}
            hasMore={hasMoreUpcoming}
            onLoadMore={fetchMoreUpcoming}
            href="/movies" 
          />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
