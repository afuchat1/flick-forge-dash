import Header from "@/components/Header";
import MovieRow from "@/components/MovieRow";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

const MoviesPage = () => {
  const sorted = [...allMovies].sort((a, b) => b.rating - a.rating);
  const byYear = [...allMovies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold">All Movies</h1>
          <p className="text-xs text-muted-foreground">{allMovies.length} titles available</p>
        </div>

        <div className="space-y-1">
          <MovieRow title="Top Rated" movies={sorted.slice(0, 10)} />
          <MovieRow title="Latest" movies={byYear.slice(0, 10)} />
          <MovieRow title="All Movies" movies={allMovies} />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default MoviesPage;
