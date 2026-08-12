import Header from "@/components/Header";
import Seo from "@/components/Seo";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import CategoryCards from "@/components/CategoryCards";
import InfiniteContentRow from "@/components/InfiniteContentRow";
import MobileNav from "@/components/MobileNav";
import RecentlyViewed from "@/components/RecentlyViewed";
import WhyYoullLoveThis from "@/components/WhyYoullLoveThis";
import DiscoverSpotlight from "@/components/DiscoverSpotlight";

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

  // TMDB's /movie/upcoming still returns titles already in cinemas — keep only
  // films whose release date is genuinely in the future, sorted soonest first.
  const today = new Date().toISOString().slice(0, 10);
  const allUpcoming = (upcoming?.pages.flatMap(p => p.results) || [])
    .filter(m => (m.release_date || "") > today)
    .sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo title={"AfuChat Movies — Movie & TV Discovery Library"} description={"Discover movies and TV shows with full documentation: cast, crew, box office, ratings, trailers and where to watch."} path="/" />
      <Header />
      
      <main className="pt-28 md:pt-24">
        <TMDBHeroCarousel movies={trending?.results} isLoading={trendingLoading} />

        {/* Editorial spotlight */}
        <DiscoverSpotlight items={trending?.results} isLoading={trendingLoading} />

        {/* Recently Viewed */}
        <RecentlyViewed />

        {/* Personalized Recommendations */}
        <WhyYoullLoveThis />

        <CategoryCards />

        
        <div className="space-y-1">
          <InfiniteContentRow 
            title="Top 10 Highest Rated Films" 
            subtitle="All-time TMDB user score leaders"
            movies={allTopRated.slice(0, 10)} 
            isLoading={topRatedLoading} 
            showRanks 
            href="/new-popular" 
          />
          <InfiniteContentRow 
            title="Trending This Week" 
            subtitle="Most viewed movies and shows on TMDB over the last 7 days"
            movies={trending?.results} 
            isLoading={trendingLoading} 
            href="/new-popular" 
          />
          <InfiniteContentRow 
            title="Popular Movies" 
            subtitle="Films with the highest audience activity right now"
            movies={allPopularMovies} 
            isLoading={popularLoading}
            isFetchingMore={isFetchingPopular}
            hasMore={hasMorePopular}
            onLoadMore={fetchMorePopular}
            href="/movies" 
          />
          <InfiniteContentRow 
            title="Popular TV Shows" 
            subtitle="Series drawing the most attention this week"
            movies={allPopularTV} 
            isLoading={tvLoading}
            isFetchingMore={isFetchingTV}
            hasMore={hasMoreTV}
            onLoadMore={fetchMoreTV}
            href="/tv-shows" 
          />
          <InfiniteContentRow 
            title="In Cinemas Now" 
            subtitle="Currently screening in theatres"
            movies={allNowPlaying} 
            isLoading={nowPlayingLoading}
            isFetchingMore={isFetchingNowPlaying}
            hasMore={hasMoreNowPlaying}
            onLoadMore={fetchMoreNowPlaying}
            href="/movies" 
          />
          <InfiniteContentRow 
            title="Coming Soon" 
            subtitle="Not yet released — sorted by nearest release date"
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
