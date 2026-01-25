import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import ContentRow from "@/components/ContentRow";
import MobileNav from "@/components/MobileNav";
import { allMovies, actionMovies, dramaMovies, sciFiMovies, comedyMovies } from "@/data/movies";

const MoviesPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <CategoryTabs />
        
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">Movies</h1>
          <p className="text-xs text-muted-foreground">{allMovies.length} titles available</p>
        </div>

        <div className="px-3 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {allMovies.slice(0, 12).map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <ContentRow title="Action" movies={actionMovies} href="/genre/action" />
        <ContentRow title="Drama" movies={dramaMovies} href="/genre/drama" />
        <ContentRow title="Sci-Fi" movies={sciFiMovies} href="/genre/sci-fi" />
        <ContentRow title="Comedy" movies={comedyMovies} href="/genre/comedy" />
      </main>

      <MobileNav />
    </div>
  );
};

export default MoviesPage;
