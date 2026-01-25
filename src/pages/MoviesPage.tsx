import Header from "@/components/Header";
import NetflixCard from "@/components/NetflixCard";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

const MoviesPage = () => {
  const sortedMovies = [...allMovies].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">All Movies</h1>
            <p className="text-muted-foreground">
              Browse our complete collection of {allMovies.length} movies
            </p>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {sortedMovies.map((movie, index) => (
              <NetflixCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default MoviesPage;
