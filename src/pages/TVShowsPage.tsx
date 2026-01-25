import Header from "@/components/Header";
import NetflixCard from "@/components/NetflixCard";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

// Simulated TV Shows (reusing movie data for demo)
const tvShows = allMovies.slice(0, 20).map((movie, i) => ({
  ...movie,
  id: movie.id + 100,
  title: movie.title + " Series",
  duration: `${Math.floor(Math.random() * 5) + 1} Seasons`,
}));

const TVShowsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">TV Shows</h1>
            <p className="text-muted-foreground">
              Binge-worthy series and exclusive originals
            </p>
          </div>

          {/* Coming Soon Banner */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">🎬 More Shows Coming Soon!</h2>
            <p className="text-muted-foreground">
              We're expanding our TV collection. Check back for new series weekly.
            </p>
          </div>

          {/* TV Shows Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {tvShows.map((show, index) => (
              <NetflixCard key={show.id} movie={show} index={index} />
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default TVShowsPage;
