import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import TMDBHeroCarousel from "@/components/TMDBHeroCarousel";
import CategoryCards from "@/components/CategoryCards";
import TMDBContentRow from "@/components/TMDBContentRow";
import MobileNav from "@/components/MobileNav";
import { 
  useTrending, 
  usePopularMovies, 
  useTopRatedMovies, 
  useNowPlayingMovies,
  usePopularTV,
  useUpcomingMovies
} from "@/hooks/useTMDB";

const Index = () => {
  const { data: trending, isLoading: trendingLoading } = useTrending("all", "week");
  const { data: popularMovies, isLoading: popularLoading } = usePopularMovies();
  const { data: topRated, isLoading: topRatedLoading } = useTopRatedMovies();
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlayingMovies();
  const { data: popularTV, isLoading: tvLoading } = usePopularTV();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <CategoryTabs />
        <TMDBHeroCarousel movies={trending?.results} isLoading={trendingLoading} />
        <CategoryCards />
        
        <div className="space-y-1">
          <TMDBContentRow 
            title="Top 10 Today" 
            movies={topRated?.results} 
            isLoading={topRatedLoading} 
            showRanks 
            href="/new-popular" 
          />
          <TMDBContentRow 
            title="Trending Now" 
            movies={trending?.results} 
            isLoading={trendingLoading} 
            href="/new-popular" 
          />
          <TMDBContentRow 
            title="Popular Movies" 
            movies={popularMovies?.results} 
            isLoading={popularLoading} 
            href="/movies" 
          />
          <TMDBContentRow 
            title="Popular TV Shows" 
            movies={popularTV?.results} 
            isLoading={tvLoading} 
            href="/tv-shows" 
          />
          <TMDBContentRow 
            title="Now Playing" 
            movies={nowPlaying?.results} 
            isLoading={nowPlayingLoading} 
            href="/movies" 
          />
          <TMDBContentRow 
            title="Coming Soon" 
            movies={upcoming?.results} 
            isLoading={upcomingLoading} 
            href="/movies" 
          />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
