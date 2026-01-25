import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Calendar, Clock, Download, Share2, ThumbsUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";
import CastSection from "@/components/CastSection";
import ReviewSection from "@/components/ReviewSection";
import NetflixRow from "@/components/NetflixRow";
import MobileNav from "@/components/MobileNav";
import { getMovieById, getSimilarMovies } from "@/data/movies";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movie = getMovieById(Number(id));
  const [isInList, setIsInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <p className="text-muted-foreground">The movie you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="secondary" className="mt-4">
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <div className="relative min-h-[85vh] md:min-h-[80vh] w-full">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/50" />
        </div>
        
        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 min-h-[85vh] md:min-h-[80vh] flex items-end pb-8 md:pb-12 pt-20">
          <div className="max-w-3xl space-y-3 md:space-y-4 animate-fade-in-up">
            {/* Back Button */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to browse
            </Link>
            
            {/* Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-primary font-bold text-sm">A</span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Film</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[0.95] tracking-tight">
              {movie.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
              <span className="text-primary font-bold">{Math.round(movie.rating * 10)}% Match</span>
              {movie.year && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{movie.year}</span>
                </div>
              )}
              <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-muted-foreground text-xs rounded">
                4K
              </span>
              <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-muted-foreground text-xs rounded">
                HDR
              </span>
              {movie.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{movie.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="font-bold">{movie.rating}</span>
              </div>
            </div>

            {/* Genres */}
            {movie.genre && (
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <Link 
                    key={g} 
                    to={`/genre/${g.toLowerCase()}`}
                    className="px-3 py-1 bg-secondary/80 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-secondary transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {/* Cast Preview */}
            {movie.cast && movie.cast.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground/60">Starring:</span>{" "}
                {movie.cast.slice(0, 4).map(c => c.name).join(" • ")}
              </p>
            )}
            
            {/* Description */}
            {movie.description && (
              <p className="text-sm md:text-base text-foreground/80 max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                {movie.description}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold px-5 md:px-8 h-10 md:h-12 rounded-lg shadow-lg">
                <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" fill="currentColor" />
                Play
              </Button>
              <Button size="lg" variant="secondary" className="glass font-semibold px-4 md:px-6 h-10 md:h-12 rounded-lg">
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                className={`h-10 md:h-12 w-10 md:w-12 p-0 rounded-lg transition-all ${isInList ? 'bg-primary hover:bg-primary/90' : 'glass'}`}
                onClick={() => setIsInList(!isInList)}
              >
                {isInList ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : <Plus className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                className={`h-10 md:h-12 w-10 md:w-12 p-0 rounded-lg transition-all hidden sm:flex ${isLiked ? 'bg-primary hover:bg-primary/90' : 'glass'}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <ThumbsUp className={`h-4 w-4 md:h-5 md:w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button size="lg" variant="secondary" className="glass h-10 md:h-12 w-10 md:w-12 p-0 rounded-lg hidden sm:flex">
                <Share2 className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 pb-24 md:pb-16">
        {/* Trailer Section */}
        {movie.trailerUrl && (
          <section className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Trailer</h2>
            <div className="aspect-video max-w-5xl rounded-xl overflow-hidden bg-card glass-card">
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
          <section className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
            <CastSection cast={movie.cast} />
          </section>
        )}

        {/* Reviews Section */}
        {movie.reviews && movie.reviews.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
            <ReviewSection reviews={movie.reviews} />
          </section>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="py-6 md:py-10">
            <NetflixRow title="More Like This" movies={similarMovies} />
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default MovieDetail;
