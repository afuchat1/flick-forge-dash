import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CastSection from "@/components/CastSection";
import ReviewSection from "@/components/ReviewSection";
import MovieRow from "@/components/MovieRow";
import { getMovieById, getSimilarMovies } from "@/data/movies";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movie = getMovieById(Number(id));

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Link to="/">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const similarMovies = movie.similarMovies ? getSimilarMovies(movie.similarMovies) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${movie.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-16 pt-24">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to browse
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span className="font-semibold text-lg">{movie.rating}</span>
              </div>
              {movie.year && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
              )}
              {movie.genre && (
                <div className="flex gap-2">
                  {movie.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {movie.description && (
              <p className="text-lg text-foreground/80 max-w-2xl leading-relaxed">
                {movie.description}
              </p>
            )}
            
            <div className="flex gap-4 pt-2">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Watch Now
              </Button>
              <Button size="lg" variant="secondary">
                <Plus className="mr-2 h-5 w-5" />
                Add to List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-16 space-y-12">
        {/* Trailer Section */}
        {movie.trailerUrl && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Trailer</h2>
            <div className="aspect-video max-w-4xl rounded-xl overflow-hidden bg-card">
              <iframe
                src={movie.trailerUrl}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <CastSection cast={movie.cast} />
        )}

        {/* Reviews Section */}
        {movie.reviews && movie.reviews.length > 0 && (
          <ReviewSection reviews={movie.reviews} />
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MovieRow title="You May Also Like" movies={similarMovies} />
        )}
      </main>
    </div>
  );
};

export default MovieDetail;
