import { Play, Info, Download, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trendingMovies, popularMovies } from "@/data/movies";

const NetflixHero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const heroMovies = [...trendingMovies, ...popularMovies].slice(0, 6);
  const featuredMovie = heroMovies[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  return (
    <div className="relative w-full">
      {/* Background */}
      <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden">
        <img
          src={featuredMovie.image}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <div className="max-w-lg space-y-3">
          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold leading-tight line-clamp-2">
            {featuredMovie.title}
          </h1>
          
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-primary font-semibold">{Math.round(featuredMovie.rating * 10)}% Match</span>
            <span>{featuredMovie.year}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">HD</span>
            <span>{featuredMovie.duration}</span>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-foreground/80 line-clamp-2">
            {featuredMovie.description}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Link to={`/movie/${featuredMovie.id}`}>
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-semibold h-9 px-5 rounded-md">
                <Play className="mr-1.5 h-4 w-4" fill="currentColor" />
                Play
              </Button>
            </Link>
            <Link to={`/movie/${featuredMovie.id}`}>
              <Button size="sm" variant="secondary" className="bg-secondary/80 h-9 px-4 rounded-md">
                <Info className="mr-1.5 h-4 w-4" />
                Info
              </Button>
            </Link>
            <Button size="sm" variant="secondary" className="bg-secondary/80 h-9 w-9 p-0 rounded-md">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full border border-foreground/40 flex items-center justify-center bg-background/30"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <div className="bg-background/50 border-l-2 border-foreground/60 px-2 py-0.5 text-xs font-medium">
            PG-13
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1">
        {heroMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-0.5 rounded-full transition-all ${i === currentIndex ? "w-5 bg-primary" : "w-1.5 bg-foreground/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NetflixHero;
