import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import { usePopularTV, useTopRatedTV, useTrending } from "@/hooks/useTMDB";
import { Button } from "@/components/ui/button";

const TVShowsPage = () => {
  const { data: popular, isLoading: popularLoading } = usePopularTV();
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedTV();
  const { data: trending, isLoading: trendingLoading } = useTrending("tv", "week");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <TMDBHeroCarousel movies={popular?.results} isLoading={popularLoading} />
        
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