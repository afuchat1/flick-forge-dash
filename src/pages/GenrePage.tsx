import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Star } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useMoviesByGenre, useGenres, getImageUrl, useMovieProviders } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const MovieCard = ({ movie }: { movie: any }) => {
  const { data: providers } = useMovieProviders(movie.id);
  const countryProviders = providers?.results?.US || providers?.results?.GB;
  const streamingProvider = countryProviders?.flatrate?.[0] || countryProviders?.rent?.[0] || countryProviders?.buy?.[0];
  const watchLink = countryProviders?.link;

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (watchLink) {
      window.open(watchLink, "_blank");
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
        <img 
          src={getImageUrl(movie.poster_path, "w342")} 
          alt={movie.title || movie.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Watch Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="gap-1.5 bg-primary/90 hover:bg-primary"
            onClick={handleWatch}
          >
            <Play className="h-3 w-3 fill-current" />
            Watch
          </Button>
        </div>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-background/80 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star className="h-2.5 w-2.5 fill-primary text-primary" />
            <span className="text-[10px] font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium mt-1.5 line-clamp-1">{movie.title || movie.name}</p>
      <p className="text-[10px] text-muted-foreground">
        {(movie.release_date || movie.first_air_date)?.split("-")[0]}
      </p>
    </Link>
  );
};

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
                <MovieCard key={movie.id} movie={movie} />
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
