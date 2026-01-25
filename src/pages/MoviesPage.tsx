import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import { usePopularMovies, useTopRatedMovies, useNowPlayingMovies, useUpcomingMovies } from "@/hooks/useTMDB";

const MoviesPage = () => {
  const { data: popular, isLoading: popularLoading } = usePopularMovies();
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedMovies();
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlayingMovies();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <TMDBHeroCarousel movies={popular?.results} isLoading={popularLoading} />
        
        <div className="space-y-1 mt-2">
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
