import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Info, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMDBMovie, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TMDBHeroCarouselProps {
  movies?: TMDBMovie[];
  isLoading?: boolean;
}

const TMDBHeroCarousel = ({ movies, isLoading }: TMDBHeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const heroMovies = movies?.slice(0, 8) || [];
  const featuredMovie = heroMovies[currentIndex];

  const goToSlide = useCallback((index: number, direction: "left" | "right") => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setSlideDirection(direction);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, isAnimating]);

  const nextSlide = useCallback(() => {
    const next = (currentIndex + 1) % heroMovies.length;
    goToSlide(next, "right");
  }, [currentIndex, heroMovies.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndex - 1 + heroMovies.length) % heroMovies.length;
    goToSlide(prev, "left");
  }, [currentIndex, heroMovies.length, goToSlide]);

  useEffect(() => {
    if (!heroMovies.length) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [heroMovies.length, nextSlide]);

  if (isLoading) {
    return (
      <div className="relative h-[58vh] md:h-[60vh] w-full">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (!featuredMovie) return null;

  const isTV = featuredMovie.media_type === "tv" || featuredMovie.first_air_date;
  const detailPath = isTV ? `/tv/${featuredMovie.id}` : `/movie/${featuredMovie.id}`;
  const title = featuredMovie.title || featuredMovie.name || "Untitled";

  return (
    <div className="relative overflow-hidden">
      {/* Background slides */}
      <div className="relative h-[58vh] md:h-[60vh] w-full">
        {heroMovies.map((movie, index) => {
          const movieTitle = movie.title || movie.name || "Untitled";
          return (
            <div
              key={movie.id}
              className={cn(
                "absolute inset-0 transition-all duration-500 ease-out",
                index === currentIndex
                  ? "opacity-100 translate-x-0 scale-100"
                  : slideDirection === "right"
                    ? index < currentIndex
                      ? "opacity-0 -translate-x-full scale-95"
                      : "opacity-0 translate-x-full scale-95"
                    : index > currentIndex
                      ? "opacity-0 translate-x-full scale-95"
                      : "opacity-0 -translate-x-full scale-95"
              )}
            >
              <img
                src={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
                alt={movieTitle}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Nav arrows — larger tap targets on mobile */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-8 md:h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 active:scale-95 transition-all z-10 touch-manipulation"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5 md:h-4 md:w-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-8 md:h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 active:scale-95 transition-all z-10 touch-manipulation"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
      </button>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <div key={currentIndex} className="animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-1 line-clamp-2 drop-shadow-lg">{title}</h2>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 max-w-lg">
            {featuredMovie.overview}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(featuredMovie.vote_average * 10)}% Match</span>
            <span>{(featuredMovie.release_date || featuredMovie.first_air_date)?.slice(0, 4)}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">HD</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/watch/${isTV ? "tv" : "movie"}/${featuredMovie.id}`}>
              <Button size="sm" className="h-10 md:h-9 px-5 md:px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold touch-manipulation">
                <Play className="h-4 w-4 mr-1.5" fill="currentColor" /> Play
              </Button>
            </Link>
            <Link to={detailPath}>
              <Button size="sm" variant="secondary" className="h-10 md:h-9 px-5 md:px-4 text-sm font-semibold touch-manipulation">
                <Info className="h-4 w-4 mr-1.5" /> Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-[100px] md:bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {heroMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i, i > currentIndex ? "right" : "left")}
            className="flex items-center justify-center h-6 w-6 touch-manipulation"
            aria-label={`Slide ${i + 1}`}
          >
            <span
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-foreground/40"
              )}
            />
          </button>
        ))}
      </div>

      {/* Thumbnail strip — hidden on mobile to reduce clutter */}
      <div className="absolute bottom-2 right-3 hidden sm:flex gap-1.5 z-10">
        {heroMovies.slice(0, 5).map((movie, i) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(i, i > currentIndex ? "right" : "left")}
            className={cn(
              "w-10 h-14 rounded overflow-hidden transition-all duration-300",
              i === currentIndex ? "ring-2 ring-primary scale-110" : "opacity-50 hover:opacity-80"
            )}
          >
            <img
              src={getImageUrl(movie.poster_path, "w185")}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TMDBHeroCarousel;
