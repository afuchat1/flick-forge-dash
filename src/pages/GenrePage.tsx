import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useMoviesByGenre, useGenres, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const genreId = parseInt(genre || "0", 10);
  const { data: genres } = useGenres();
  const { data: movies, isLoading } = useMoviesByGenre(genreId);
  
  const genreName = genres?.find((g: { id: number; name: string }) => g.id === genreId)?.name || "Genre";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3 py-3">
          <Link to="/categories" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          <h1 className="text-xl font-bold">{genreName}</h1>
          <p className="text-xs text-muted-foreground">
            {movies?.total_results ? `${movies.total_results} titles` : "Loading..."}
          </p>
        </div>

        <div className="px-3">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 mt-1 w-3/4" />
                  <Skeleton className="h-2 mt-1 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {movies?.results?.map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                    <img 
                      src={getImageUrl(movie.poster_path, "w342")} 
                      alt={movie.title || movie.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title || movie.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {(movie.release_date || movie.first_air_date)?.split("-")[0]}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default GenrePage;
