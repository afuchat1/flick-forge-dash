import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Calendar, Clock, Download, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CastSection from "@/components/CastSection";
import ReviewSection from "@/components/ReviewSection";
import NetflixRow from "@/components/NetflixRow";
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
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${movie.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>
        
        <div className="relative container mx-auto px-4 md:px-12 h-full flex items-end pb-16 pt-24">
          <div className="max-w-3xl space-y-5 animate-fade-in">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to browse
            </Link>
            
            {/* Netflix Badge */}
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl font-bold tracking-wider">N</span>
              <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
                Film
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-primary font-semibold">{Math.round(movie.rating * 10)}% Match</span>
              {movie.year && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              )}
              <span className="px-2 py-0.5 border border-muted-foreground text-muted-foreground text-xs">
                HD
              </span>
              {movie.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="font-semibold">{movie.rating}</span>
              </div>
            </div>

            {movie.genre && (
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <span key={g} className="px-3 py-1 bg-secondary rounded text-xs font-medium">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Cast Preview */}
            {movie.cast && movie.cast.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground/70">Starring:</span>{" "}
                {movie.cast.slice(0, 4).map(c => c.name).join(", ")}
              </p>
            )}
            
            {movie.description && (
              <p className="text-base md:text-lg text-foreground/80 max-w-2xl leading-relaxed">
                {movie.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8">
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Play
              </Button>
              <Button size="lg" variant="secondary" className="font-semibold">
                <Download className="mr-2 h-5 w-5" />
                Download
              </Button>
              <Button size="lg" variant="secondary" className="w-12 px-0">
                <Plus className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="w-12 px-0">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="w-12 px-0">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-12 pb-16 space-y-12">
        {/* Trailer Section */}
        {movie.trailerUrl && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Trailer</h2>
            <div className="aspect-video max-w-4xl rounded-lg overflow-hidden bg-card">
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
          <div className="-mx-4 md:-mx-12">
            <NetflixRow title="More Like This" movies={similarMovies} />
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieDetail;
