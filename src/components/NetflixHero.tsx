import { Play, Info, Download, VolumeX, Volume2, Plus, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trendingMovies, popularMovies } from "@/data/movies";

const NetflixHero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine trending and popular for more variety
  const heroMovies = [...trendingMovies, ...popularMovies].slice(0, 8);
  const featuredMovie = heroMovies[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setShowVideo(false);
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const goToSlide = (index: number) => {
    setShowVideo(false);
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setShowVideo(false);
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  const goToNext = () => {
    setShowVideo(false);
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  };

  return (
    <div className="relative h-[100svh] md:h-[95vh] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {showVideo && featuredMovie.trailerUrl ? (
          <iframe
            src={`${featuredMovie.trailerUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&modestbranding=1&loop=1`}
            className="w-full h-full object-cover scale-150"
            allow="autoplay"
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <img
            src={featuredMovie.image}
            alt={featuredMovie.title}
            className="w-full h-full object-cover animate-fade-in"
          />
        )}
        
        {/* Premium Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity md:opacity-50 md:hover:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity md:opacity-50 md:hover:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-2xl space-y-4 md:space-y-5 animate-fade-in-up">
            {/* Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-primary font-bold text-sm">F</span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Original</span>
              </div>
              <span className="text-xs text-muted-foreground">#{currentIndex + 1} Trending</span>
              <span className="text-xs text-primary font-bold">{Math.round(featuredMovie.rating * 10)}% Match</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
              {featuredMovie.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
              <span className="text-muted-foreground">{featuredMovie.year}</span>
              <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-muted-foreground text-xs rounded">
                4K
              </span>
              <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-muted-foreground text-xs rounded">
                HDR
              </span>
              <span className="text-muted-foreground">{featuredMovie.duration}</span>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <span className="hidden md:inline text-muted-foreground">
                {featuredMovie.genre?.join(" • ")}
              </span>
            </div>

            {/* Mobile Genres */}
            <div className="flex flex-wrap gap-2 md:hidden">
              {featuredMovie.genre?.slice(0, 3).map((g) => (
                <span key={g} className="text-xs text-foreground/70 bg-secondary/50 px-2 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-foreground/80 max-w-xl leading-relaxed line-clamp-2 md:line-clamp-3">
              {featuredMovie.description}
            </p>

            {/* Cast */}
            {featuredMovie.cast && (
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                <span className="text-foreground/60">Starring:</span>{" "}
                {featuredMovie.cast.slice(0, 3).map(c => c.name).join(" • ")}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2">
              <Link to={`/movie/${featuredMovie.id}`}>
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold px-6 md:px-8 h-11 md:h-12 rounded-lg shadow-lg">
                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                  Play
                </Button>
              </Link>
              <Link to={`/movie/${featuredMovie.id}`}>
                <Button size="lg" variant="secondary" className="glass font-semibold px-4 md:px-6 h-11 md:h-12 rounded-lg">
                  <Info className="mr-2 h-5 w-5" />
                  <span className="hidden sm:inline">More Info</span>
                </Button>
              </Link>
              <Button size="lg" variant="secondary" className="glass h-11 md:h-12 w-11 md:w-12 p-0 rounded-lg">
                <Download className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="glass h-11 md:h-12 w-11 md:w-12 p-0 rounded-lg hidden sm:flex">
                <Plus className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="glass h-11 md:h-12 w-11 md:w-12 p-0 rounded-lg hidden sm:flex">
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 md:bottom-10 right-4 md:right-12 flex items-center gap-3">
        {/* Mute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center hover:border-foreground/60 transition-colors glass"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-foreground" />
          ) : (
            <Volume2 className="h-4 w-4 text-foreground" />
          )}
        </button>
        
        {/* Age Rating */}
        <div className="glass border-l-2 border-foreground/50 px-3 py-1.5 rounded-r-lg">
          <span className="text-sm font-medium">PG-13</span>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Mini Preview Thumbnails - Desktop Only */}
      <div className="absolute bottom-24 right-12 hidden xl:flex items-center gap-2">
        {heroMovies.slice(0, 5).map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex ? "ring-2 ring-primary scale-110" : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetflixHero;
