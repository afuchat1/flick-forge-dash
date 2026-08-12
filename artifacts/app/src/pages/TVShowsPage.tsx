import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import InfiniteContentRow from "@/components/InfiniteContentRow";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import { 
  useInfinitePopularTV, 
  useInfiniteTopRatedTV, 
  useTrending 
} from "@/hooks/useTMDB";
import { Button } from "@/components/ui/button";

const TVShowsPage = () => {
  const { data: trending, isLoading: trendingLoading } = useTrending("tv", "week");
  
  const { 
    data: popular, 
    isLoading: popularLoading,
    fetchNextPage: fetchMorePopular,
    hasNextPage: hasMorePopular,
    isFetchingNextPage: isFetchingPopular
  } = useInfinitePopularTV();
  
  const { 
    data: topRated, 
    isLoading: topRatedLoading,
    fetchNextPage: fetchMoreTopRated,
    hasNextPage: hasMoreTopRated,
    isFetchingNextPage: isFetchingTopRated
  } = useInfiniteTopRatedTV();

  // Flatten infinite query results
  const allPopular = popular?.pages.flatMap(p => p.results) || [];
  const allTopRated = topRated?.pages.flatMap(p => p.results) || [];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo title={"TV Shows — Series Guide & Episode Lists | AfuChat Movies"} description={"Explore TV series with season and episode guides, cast, crew, ratings and streaming availability."} path="/tv-shows" />
      <Header />
      
      <main className="pt-28 md:pt-24">
        <TMDBHeroCarousel movies={trending?.results} isLoading={trendingLoading} />
        
        {/* Browse All CTA */}
        <div className="px-3 py-4">
          <Link to="/browse?type=tv">
            <Button variant="outline" className="w-full justify-between text-sm">
              Browse All TV Shows
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-1">
          <InfiniteContentRow 
            title="Popular TV Shows" 
            subtitle="Series with the highest audience activity right now"
            movies={allPopular} 
            isLoading={popularLoading}
            isFetchingMore={isFetchingPopular}
            hasMore={hasMorePopular}
            onLoadMore={fetchMorePopular}
          />
          <InfiniteContentRow 
            title="Top Rated Series of All Time" 
            subtitle="Ranked by TMDB user score"
            movies={allTopRated} 
            isLoading={topRatedLoading}
            isFetchingMore={isFetchingTopRated}
            hasMore={hasMoreTopRated}
            onLoadMore={fetchMoreTopRated}
            showRanks 
          />
          <InfiniteContentRow 
            title="Trending This Week" 
            subtitle="Most viewed series on TMDB over the last 7 days"
            movies={trending?.results} 
            isLoading={trendingLoading} 
          />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default TVShowsPage;
