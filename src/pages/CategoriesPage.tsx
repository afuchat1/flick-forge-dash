import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { allGenres, getMoviesByGenre } from "@/data/movies";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-xs text-muted-foreground">Browse by genre</p>
        </div>

        <div className="px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allGenres.map((genre) => {
              const movies = getMoviesByGenre(genre);
              const img = movies[0]?.image;
              
              return (
                <Link
                  key={genre}
                  to={`/genre/${genre.toLowerCase()}`}
                  className="relative aspect-video rounded-md overflow-hidden"
                >
                  <img src={img} alt={genre} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold">{genre}</span>
                    <span className="text-[10px] text-muted-foreground">{movies.length} titles</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default CategoriesPage;
