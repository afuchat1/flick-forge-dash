import Header from "@/components/Header";
import MovieRow from "@/components/MovieRow";
import MobileNav from "@/components/MobileNav";
import { newReleases, trendingMovies, topRatedMovies } from "@/data/movies";

const NewPopularPage = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold">New & Popular</h1>
          <p className="text-xs text-muted-foreground">Trending and new releases</p>
        </div>

        <div className="space-y-1">
          <MovieRow title="Trending Now" movies={trendingMovies} />
          <MovieRow title="New Releases" movies={newReleases} />
          <MovieRow title="Top Rated" movies={topRatedMovies} showRanks />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default NewPopularPage;
