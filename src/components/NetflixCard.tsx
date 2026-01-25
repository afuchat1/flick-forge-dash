import { Star, Play, Download, Plus, ChevronDown, Check } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface NetflixCardProps {
  movie: Movie;
  index?: number;
  showRank?: boolean;
}

const NetflixCard = ({ movie, index = 0, showRank = false }: NetflixCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeout.current = setTimeout(() => setShowPreview(true), 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const getCastNames = () => {
    if (!movie.cast || movie.cast.length === 0) return "";
    return movie.cast.slice(0, 2).map(c => c.name).join(", ");
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Rank Number */}
      {showRank && (
        <div className="absolute -left-2 md:-left-4 top-0 bottom-0 flex items-center z-10 pointer-events-none">
          <span 
            className="text-4xl md:text-6xl font-black select-none"
            style={{ 
              WebkitTextStroke: '1px hsl(var(--foreground) / 0.3)',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {index + 1}
          </span>
        </div>
      )}

      {/* Base Card */}
      <div className={`relative aspect-[16/9] rounded-lg overflow-hidden bg-card transition-all duration-300 ${showRank ? 'ml-4 md:ml-8' : ''}`}>
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-60" />
        
        {/* Quick Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-bold text-xs md:text-sm text-foreground line-clamp-1">{movie.title}</h3>
        </div>
      </div>

      {/* Expanded Hover Card - Desktop Only */}
      {isHovered && (
        <div className="hidden md:block absolute -top-4 -left-4 -right-4 z-50 glass-card rounded-xl overflow-hidden animate-scale-in origin-center shadow-2xl">
          {/* Video Preview */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {showPreview && movie.trailerUrl ? (
              <iframe
                src={`${movie.trailerUrl}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay"
              />
            ) : (
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3">
              <h3 className="font-bold text-foreground text-sm line-clamp-1">{movie.title}</h3>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-3 space-y-2.5">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Link to={`/movie/${movie.id}`}>
                  <button className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-all hover:scale-105 shadow-lg">
                    <Play className="h-3.5 w-3.5 text-background ml-0.5" fill="currentColor" />
                  </button>
                </Link>
                <button 
                  onClick={(e) => { e.preventDefault(); setIsInList(!isInList); }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 ${
                    isInList ? 'bg-primary border-primary' : 'border-muted-foreground/50 hover:border-foreground'
                  }`}
                >
                  {isInList ? <Check className="h-3.5 w-3.5 text-primary-foreground" /> : <Plus className="h-3.5 w-3.5 text-foreground" />}
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-all hover:scale-105">
                  <Download className="h-3.5 w-3.5 text-foreground" />
                </button>
              </div>
              <Link to={`/movie/${movie.id}`}>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-all hover:scale-105">
                  <ChevronDown className="h-3.5 w-3.5 text-foreground" />
                </button>
              </Link>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-primary font-bold">{Math.round(movie.rating * 10)}%</span>
              <span className="px-1 py-0.5 border border-muted-foreground/50 text-muted-foreground rounded">HD</span>
              <span className="text-muted-foreground">{movie.duration || "2h"}</span>
              <div className="flex items-center gap-0.5 ml-auto">
                <Star className="h-2.5 w-2.5 text-primary fill-primary" />
                <span className="text-foreground font-medium">{movie.rating}</span>
              </div>
            </div>

            {/* Genres */}
            {movie.genre && (
              <div className="flex flex-wrap gap-1">
                {movie.genre.slice(0, 3).map((g, i) => (
                  <span key={g} className="text-[10px] text-foreground/80 after:content-['•'] after:ml-1 after:text-muted-foreground last:after:content-none">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <p className="text-[10px] text-muted-foreground line-clamp-1">{getCastNames()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixCard;
