import { Star, Play, Download, Plus, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface NetflixCardProps {
  movie: Movie;
}

const NetflixCard = ({ movie }: NetflixCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeout.current = setTimeout(() => {
      setShowPreview(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  };

  const getCastNames = () => {
    if (!movie.cast || movie.cast.length === 0) return "";
    return movie.cast.slice(0, 3).map(c => c.name).join(", ");
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Card */}
      <div className="relative aspect-[16/9] rounded-md overflow-hidden bg-card transition-all duration-300">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Expanded Hover Card */}
      {isHovered && (
        <div className="absolute -top-4 -left-4 -right-4 z-50 bg-card rounded-lg shadow-2xl overflow-hidden animate-scale-in origin-center">
          {/* Video Preview */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {showPreview && movie.trailerUrl ? (
              <iframe
                src={`${movie.trailerUrl}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay"
              />
            ) : (
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-2 left-3 right-3">
              <h3 className="font-bold text-foreground text-sm line-clamp-1">{movie.title}</h3>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-3 space-y-3">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to={`/movie/${movie.id}`}>
                  <button className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-colors">
                    <Play className="h-4 w-4 text-background ml-0.5" fill="currentColor" />
                  </button>
                </Link>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center hover:border-foreground transition-colors">
                  <Plus className="h-4 w-4 text-foreground" />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center hover:border-foreground transition-colors group/download">
                  <Download className="h-4 w-4 text-foreground" />
                </button>
              </div>
              <Link to={`/movie/${movie.id}`}>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center hover:border-foreground transition-colors">
                  <ChevronDown className="h-4 w-4 text-foreground" />
                </button>
              </Link>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-primary font-semibold">{Math.round(movie.rating * 10)}% Match</span>
              <span className="px-1 border border-muted-foreground text-muted-foreground">
                HD
              </span>
              <span className="text-muted-foreground">{movie.duration || "2h"}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-primary fill-primary" />
                <span className="text-foreground">{movie.rating}</span>
              </div>
            </div>

            {/* Genres */}
            {movie.genre && (
              <div className="flex flex-wrap gap-1">
                {movie.genre.slice(0, 3).map((g, i) => (
                  <span key={g} className="text-xs text-foreground">
                    {g}{i < Math.min(movie.genre!.length, 3) - 1 && <span className="text-muted-foreground mx-1">•</span>}
                  </span>
                ))}
              </div>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                <span className="text-muted-foreground/70">Starring:</span> {getCastNames()}
              </p>
            )}

            {/* Description */}
            {movie.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {movie.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixCard;
