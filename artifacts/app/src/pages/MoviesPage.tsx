import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import { usePopularMovies, useTopRatedMovies, useNowPlayingMovies, useUpcomingMovies } from "@/hooks/useTMDB";
import { Button } from "@/components/ui/button";

const MoviesPage = () => {
  const { data: popular, isLoading: popularLoading } = usePopularMovies();
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedMovies();
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlayingMovies();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo title={"Movies — Browse & Discover Films | AfuChat Movies"} description={"Browse thousands of films by genre, year and rating. Full cast, crew, box office and where-to-watch details for every movie."} path="/movies" />
      <Header />
      
      <main className="pt-28 md:pt-24">
        <TMDBHeroCarousel movies={popular?.results} isLoading={popularLoading} />
        
        {/* Browse All CTA */}
        <div className="px-3 py-4">
          <Link to="/browse?type=movie">
            <Button variant="outline" className="w-full justify-between text-sm">
              Browse All Movies
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-1">
          <TMDBContentRow title="Popular Movies" movies={popular?.results} isLoading={popularLoading} />
          <TMDBContentRow title="Top Rated" movies={topRated?.results} isLoading={topRatedLoading} showRanks />
          <TMDBContentRow title="Now Playing" movies={nowPlaying?.results} isLoading={nowPlayingLoading} />
          <TMDBContentRow title="Coming Soon" movies={upcoming?.results} isLoading={upcomingLoading} />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default MoviesPage;