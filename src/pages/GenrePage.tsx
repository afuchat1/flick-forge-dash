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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3 py-3">
          <Link to="/categories" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <h1 className="text-xl font-bold">{actualGenre}</h1>
          <p className="text-xs text-muted-foreground">{movies.length} titles</p>
        </div>

        <div className="px-3">
          <div className="grid grid-cols-3 gap-2">
            {movies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title}</p>
                <p className="text-[10px] text-muted-foreground">{movie.year}</p>
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
