import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import { usePopularTV, useTopRatedTV, useTrending } from "@/hooks/useTMDB";

const TVShowsPage = () => {
  const { data: popular, isLoading: popularLoading } = usePopularTV();
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedTV();
  const { data: trending, isLoading: trendingLoading } = useTrending("tv", "week");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <TMDBHeroCarousel movies={popular?.results} isLoading={popularLoading} />
        
        <div className="space-y-1 mt-2">
          <TMDBContentRow title="Popular TV Shows" movies={popular?.results} isLoading={popularLoading} />
          <TMDBContentRow title="Top Rated" movies={topRated?.results} isLoading={topRatedLoading} showRanks />
          <TMDBContentRow title="Trending This Week" movies={trending?.results} isLoading={trendingLoading} />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default TVShowsPage;
