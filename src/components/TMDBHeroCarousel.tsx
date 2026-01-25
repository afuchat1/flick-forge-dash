import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMDBMovie, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

interface TMDBHeroCarouselProps {
  movies?: TMDBMovie[];
  isLoading?: boolean;
}

const TMDBHeroCarousel = ({ movies, isLoading }: TMDBHeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroMovies = movies?.slice(0, 6) || [];
  const featuredMovie = heroMovies[currentIndex];

  useEffect(() => {
    if (!heroMovies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (isLoading) {
    return (
      <div className="relative h-[45vh] w-full">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
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
    <div className="relative">
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img
          src={getImageUrl(featuredMovie.backdrop_path || featuredMovie.poster_path, "w780")}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-end gap-2">
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="flex-shrink-0 w-14 h-20 rounded-md overflow-hidden opacity-60"
            >
              <img
                src={getImageUrl(heroMovies[currentIndex - 1].poster_path, "w185")}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="text-primary font-semibold">{Math.round(featuredMovie.vote_average * 10)}%</span>
              <span>{(featuredMovie.release_date || featuredMovie.first_air_date)?.slice(0, 4)}</span>
            </div>
            <div className="flex gap-2">
              <Link to={detailPath}>
                <Button size="sm" className="h-8 px-3 text-xs bg-foreground text-background">
                  <Play className="h-3 w-3 mr-1" fill="currentColor" /> Play
                </Button>
              </Link>
              <Link to={detailPath}>
                <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">
                  <Info className="h-3 w-3 mr-1" /> Info
                </Button>
              </Link>
            </div>
          </div>

          <Button size="sm" variant="secondary" className="h-9 w-9 p-0 rounded-full flex-shrink-0">
            <Download className="h-4 w-4" />
          </Button>

          {currentIndex < heroMovies.length - 1 && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex-shrink-0 w-14 h-20 rounded-md overflow-hidden opacity-60"
            >
              <img
                src={getImageUrl(heroMovies[currentIndex + 1].poster_path, "w185")}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1">
        {heroMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === currentIndex ? "w-4 bg-primary" : "w-1 bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TMDBHeroCarousel;
