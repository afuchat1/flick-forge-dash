import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import { useTrending, useTopRatedMovies, useUpcomingMovies, useTopRatedTV } from "@/hooks/useTMDB";

const NewPopularPage = () => {
  const { data: trending, isLoading: trendingLoading } = useTrending("all", "day");
  const { data: topMovies, isLoading: topMoviesLoading } = useTopRatedMovies();
  const { data: topTV, isLoading: topTVLoading } = useTopRatedTV();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      
      <main className="pt-24 md:pt-40">
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">New & Popular</h1>
          <p className="text-xs text-muted-foreground">Trending and top-rated content</p>
        </div>

        <div className="space-y-1">
          <TMDBContentRow title="Trending Today" movies={trending?.results} isLoading={trendingLoading} showRanks />
          <TMDBContentRow title="Top Rated Movies" movies={topMovies?.results} isLoading={topMoviesLoading} />
          <TMDBContentRow title="Top Rated TV Shows" movies={topTV?.results} isLoading={topTVLoading} />
          <TMDBContentRow title="Coming Soon" movies={upcoming?.results} isLoading={upcomingLoading} />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default NewPopularPage;
