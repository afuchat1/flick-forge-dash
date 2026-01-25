import { Play, Info, Download, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trendingMovies } from "@/data/movies";

const NetflixHero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const featuredMovie = trendingMovies[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Video/Image */}
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
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-12 h-full flex items-center">
        <div className="max-w-2xl space-y-5 animate-fade-in">
          {/* Netflix Original Badge */}
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl font-bold tracking-wider">N</span>
            <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
              Film
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {featuredMovie.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex items-center flex-wrap gap-3 text-sm">
            <span className="text-primary font-semibold">{Math.round(featuredMovie.rating * 10)}% Match</span>
            <span className="text-muted-foreground">{featuredMovie.year}</span>
            <span className="px-2 py-0.5 border border-muted-foreground text-muted-foreground text-xs">
              HD
            </span>
            <span className="text-muted-foreground">{featuredMovie.duration}</span>
            {featuredMovie.genre && (
              <div className="flex items-center gap-2">
                {featuredMovie.genre.map((g, i) => (
                  <span key={g} className="text-muted-foreground">
                    {g}{i < featuredMovie.genre!.length - 1 && " •"}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cast */}
          {featuredMovie.cast && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground/70">Starring:</span>{" "}
              {featuredMovie.cast.slice(0, 3).map(c => c.name).join(", ")}
            </p>
          )}

          <p className="text-base md:text-lg text-foreground/90 max-w-xl leading-relaxed line-clamp-3">
            {featuredMovie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={`/movie/${featuredMovie.id}`}>
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8">
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Play
              </Button>
            </Link>
            <Link to={`/movie/${featuredMovie.id}`}>
              <Button size="lg" variant="secondary" className="bg-secondary/80 hover:bg-secondary font-semibold px-6">
                <Info className="mr-2 h-5 w-5" />
                More Info
              </Button>
            </Link>
            <Button size="lg" variant="secondary" className="bg-secondary/80 hover:bg-secondary font-semibold px-6">
              <Download className="mr-2 h-5 w-5" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-32 right-12 w-10 h-10 rounded-full border border-foreground/50 flex items-center justify-center hover:border-foreground transition-colors bg-background/30 backdrop-blur-sm"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-foreground" />
        ) : (
          <Volume2 className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Age Rating */}
      <div className="absolute bottom-32 right-28 flex items-center gap-2">
        <div className="bg-background/60 backdrop-blur-sm border-l-2 border-foreground px-3 py-1">
          <span className="text-sm text-foreground">PG-13</span>
        </div>
      </div>
    </div>
  );
};

export default NetflixHero;
