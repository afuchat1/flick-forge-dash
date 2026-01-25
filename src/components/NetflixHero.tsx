import { Play, Info, Download, VolumeX, Volume2, Plus, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trendingMovies, popularMovies } from "@/data/movies";

const NetflixHero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const heroMovies = [...trendingMovies, ...popularMovies].slice(0, 8);
  const featuredMovie = heroMovies[currentIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

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
    <div className="relative h-[90svh] md:h-[88vh] w-full overflow-hidden">
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
        
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Navigation Arrows - Desktop */}
      <button 
        onClick={goToPrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center opacity-0 hover:opacity-100 md:opacity-50 md:hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full glass flex items-center justify-center opacity-0 hover:opacity-100 md:opacity-50 md:hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Content */}
      <div className="relative h-full flex items-end pb-20 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 md:space-y-4 animate-fade-in-up">
            {/* Badge */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-primary/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <span className="text-primary font-bold text-xs md:text-sm">A</span>
                <span className="text-[10px] md:text-xs font-semibold text-primary uppercase tracking-wider">Original</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground">#{currentIndex + 1} Trending</span>
              <span className="text-[10px] md:text-xs text-primary font-bold">{Math.round(featuredMovie.rating * 10)}% Match</span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[0.95] tracking-tight">
              {featuredMovie.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm">
              <span className="text-muted-foreground">{featuredMovie.year}</span>
              <span className="px-1 py-0.5 border border-muted-foreground/50 text-muted-foreground text-[10px] md:text-xs rounded">4K</span>
              <span className="px-1 py-0.5 border border-muted-foreground/50 text-muted-foreground text-[10px] md:text-xs rounded">HDR</span>
              <span className="text-muted-foreground">{featuredMovie.duration}</span>
            </div>

            {/* Genres - Mobile */}
            <div className="flex flex-wrap gap-1.5 md:hidden">
              {featuredMovie.genre?.slice(0, 3).map((g) => (
                <span key={g} className="text-[10px] text-foreground/70 bg-secondary/50 px-2 py-0.5 rounded-full">{g}</span>
              ))}
            </div>

            {/* Genres - Desktop */}
            <div className="hidden md:flex flex-wrap gap-2 text-sm text-muted-foreground">
              {featuredMovie.genre?.map((g, i) => (
                <span key={g}>{g}{i < (featuredMovie.genre?.length || 0) - 1 && " •"}</span>
              ))}
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-foreground/80 max-w-xl leading-relaxed line-clamp-2">
              {featuredMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link to={`/movie/${featuredMovie.id}`}>
                <Button className="bg-foreground text-background hover:bg-foreground/90 font-bold px-4 md:px-6 h-9 md:h-11 rounded-lg shadow-lg text-sm">
                  <Play className="mr-1.5 h-4 w-4" fill="currentColor" />
                  Play
                </Button>
              </Link>
              <Link to={`/movie/${featuredMovie.id}`}>
                <Button variant="secondary" className="glass font-semibold px-3 md:px-5 h-9 md:h-11 rounded-lg text-sm">
                  <Info className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">More Info</span>
                  <span className="sm:hidden">Info</span>
                </Button>
              </Link>
              <Button variant="secondary" className="glass h-9 md:h-11 w-9 md:w-11 p-0 rounded-lg">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="secondary" className="glass h-9 md:h-11 w-9 md:w-11 p-0 rounded-lg hidden sm:flex">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-foreground/30 flex items-center justify-center hover:border-foreground/60 transition-colors glass"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Volume2 className="h-3.5 w-3.5 md:h-4 md:w-4" />}
        </button>
        <div className="glass border-l-2 border-foreground/50 px-2 py-1 rounded-r-lg">
          <span className="text-xs md:text-sm font-medium">PG-13</span>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 md:w-8 bg-primary" : "w-1.5 md:w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NetflixHero;
