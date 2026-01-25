import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { trendingMovies, popularMovies, Movie } from "@/data/movies";

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroMovies = [...trendingMovies, ...popularMovies].slice(0, 6);
  const featuredMovie = heroMovies[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  return (
    <div className="relative">
      {/* Main Hero Image */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img
          src={featuredMovie.image}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Thumbnail Carousel at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
        <div className="flex items-end gap-2">
          {/* Left Thumbnail */}
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="flex-shrink-0 w-16 h-20 rounded-md overflow-hidden opacity-70"
            >
              <img
                src={heroMovies[currentIndex - 1].image}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          )}

          {/* Center Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{featuredMovie.title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{featuredMovie.year}</span>
              <span>|</span>
              <span>{featuredMovie.genre}</span>
            </div>
          </div>

          {/* Download Button */}
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Download className="h-5 w-5 text-primary-foreground" />
          </button>

          {/* Right Thumbnail */}
          {currentIndex < heroMovies.length - 1 && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex-shrink-0 w-16 h-20 rounded-md overflow-hidden opacity-70"
            >
              <img
                src={heroMovies[currentIndex + 1].image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-background to-transparent">
                <p className="text-[10px] font-medium truncate">{heroMovies[currentIndex + 1].title}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Slide Indicators */}
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

export default HeroCarousel;
