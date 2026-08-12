import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import { useTrending, useTopRatedMovies, useUpcomingMovies, useTopRatedTV } from "@/hooks/useTMDB";

const NewPopularPage = () => {
  const { data: trending, isLoading: trendingLoading } = useTrending("all", "day");
  const { data: topMovies, isLoading: topMoviesLoading } = useTopRatedMovies();
  const { data: topTV, isLoading: topTVLoading } = useTopRatedTV();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();

  const today = new Date().toISOString().slice(0, 10);
  const comingSoon = (upcoming?.results || [])
    .filter((m) => (m.release_date || "") > today)
    .sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo title={"New & Popular — Latest Movies and Shows | AfuChat Movies"} description={"The newest releases and trending titles right now, with full details on cast, ratings and where to watch."} path="/new-popular" />
      <Header />
      
      <main className="pt-28 md:pt-24">
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">New & Popular</h1>
          <p className="text-xs text-muted-foreground">Trending and top-rated content</p>
        </div>

        <div className="space-y-1">
          <TMDBContentRow
            title="Trending Today"
            subtitle="Most viewed movies and shows on TMDB in the last 24 hours"
            movies={trending?.results}
            isLoading={trendingLoading}
            showRanks
          />
          <TMDBContentRow
            title="Top Rated Movies of All Time"
            subtitle="Ranked by TMDB user score"
            movies={topMovies?.results}
            isLoading={topMoviesLoading}
          />
          <TMDBContentRow
            title="Top Rated TV Shows of All Time"
            subtitle="Ranked by TMDB user score"
            movies={topTV?.results}
            isLoading={topTVLoading}
          />
          <TMDBContentRow
            title="Coming Soon"
            subtitle="Not yet released — sorted by nearest release date"
            movies={comingSoon}
            isLoading={upcomingLoading}
          />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default NewPopularPage;
