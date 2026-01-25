import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { getMoviesByGenre, allGenres } from "@/data/movies";

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const actualGenre = allGenres.find(g => g.toLowerCase() === genre?.toLowerCase()) || genre || "";
  const movies = getMoviesByGenre(actualGenre);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <Link to="/categories" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <ArrowLeft className="h-3 w-3" /> Categories
          </Link>
          <h1 className="text-2xl font-bold">{actualGenre}</h1>
          <p className="text-xs text-muted-foreground">{movies.length} titles</p>
        </div>

        <div className="px-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {movies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="relative aspect-[2/3] rounded-md overflow-hidden">
                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-background via-background/80 to-transparent">
                  <p className="text-[10px] font-medium line-clamp-1">{movie.title}</p>
                  <p className="text-[8px] text-muted-foreground">{movie.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenrePage;
