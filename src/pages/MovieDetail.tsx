import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Download, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";
import MovieRow from "@/components/MovieRow";
import MobileNav from "@/components/MobileNav";
import { getMovieById, getSimilarMovies } from "@/data/movies";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movie = getMovieById(Number(id));
  const [isInList, setIsInList] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Movie not found</h1>
          <Link to="/" className="text-primary text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const similarMovies = movie.similarMovies ? getSimilarMovies(movie.similarMovies) : [];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      {/* Hero */}
      <div className="relative">
        <div className="h-[50vh] md:h-[60vh] w-full">
          <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(movie.rating * 10)}%</span>
            <span>{movie.year}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">HD</span>
            <span>{movie.duration}</span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-primary fill-primary" />
              <span>{movie.rating}</span>
            </div>
          </div>

          {movie.genre && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {movie.genre.map((g) => (
                <Link key={g} to={`/genre/${g.toLowerCase()}`} className="px-2 py-0.5 bg-secondary rounded text-[10px]">
                  {g}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-foreground text-background h-9 px-5 font-semibold">
              <Play className="mr-1.5 h-4 w-4" fill="currentColor" /> Play
            </Button>
            <Button size="sm" variant="secondary" className="h-9 px-4">
              <Download className="mr-1.5 h-4 w-4" /> Download
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className={`h-9 w-9 p-0 ${isInList ? 'bg-primary' : ''}`}
              onClick={() => setIsInList(!isInList)}
            >
              {isInList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        {movie.description && (
          <p className="text-sm text-foreground/80">{movie.description}</p>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground mb-1">Cast</h3>
            <p className="text-sm">{movie.cast.map(c => c.name).join(", ")}</p>
          </div>
        )}

        {/* Trailer */}
        {movie.trailerUrl && (
          <div>
            <h3 className="font-bold mb-2">Trailer</h3>
            <div className="aspect-video rounded-md overflow-hidden bg-card">
              <iframe
                src={movie.trailerUrl}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Reviews */}
        {movie.reviews && movie.reviews.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Reviews</h3>
            <div className="space-y-2">
              {movie.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="p-3 bg-card rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{review.author}</span>
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar */}
      {similarMovies.length > 0 && (
        <MovieRow title="More Like This" movies={similarMovies} />
      )}

      <MobileNav />
    </div>
  );
};

export default MovieDetail;
