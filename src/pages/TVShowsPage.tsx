import Header from "@/components/Header";
import MovieRow from "@/components/MovieRow";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

const tvShows = allMovies.slice(0, 20).map((m, i) => ({
  ...m,
  id: m.id + 100,
  title: m.title + " Series",
  duration: `${Math.floor(Math.random() * 5) + 1} Seasons`,
}));

const TVShowsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold">TV Shows</h1>
          <p className="text-xs text-muted-foreground">Binge-worthy series</p>
        </div>

        <div className="px-4 mb-4">
          <div className="p-4 bg-card rounded-lg text-center">
            <p className="text-sm font-medium">More Shows Coming Soon</p>
            <p className="text-xs text-muted-foreground">Check back for new series weekly</p>
          </div>
        </div>

        <MovieRow title="Popular Series" movies={tvShows.slice(0, 10)} />
        <MovieRow title="All Series" movies={tvShows} />
      </main>

      <MobileNav />
    </div>
  );
};

export default TVShowsPage;
