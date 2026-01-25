import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  showRanks?: boolean;
  href?: string;
}

const MovieRow = ({ title, movies, showRanks = false, href }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      setCanScrollRight(rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10);
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: rowRef.current.clientWidth * 0.8, behavior: "smooth" });
    }
  };

  return (
    <section className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-base md:text-lg font-bold">{title}</h2>
        {href && (
          <Link to={href} className="text-xs text-primary font-medium flex items-center">
            Explore All <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      
      {/* Row */}
      <div className="relative">
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4"
        >
          {movies.map((movie, index) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className={`flex-shrink-0 relative ${showRanks ? 'w-32 md:w-40' : 'w-28 md:w-36'}`}
            >
              {/* Rank */}
              {showRanks && (
                <div className="absolute -left-1 bottom-0 z-10">
                  <span 
                    className="text-4xl md:text-5xl font-black"
                    style={{ WebkitTextStroke: '1px hsl(var(--primary))', WebkitTextFillColor: 'transparent' }}
                  >
                    {index + 1}
                  </span>
                </div>
              )}
              
              {/* Card */}
              <div className={`relative aspect-[2/3] rounded-md overflow-hidden bg-card ${showRanks ? 'ml-4' : ''}`}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-background via-background/80 to-transparent">
                  <p className="text-[10px] md:text-xs font-medium line-clamp-1">{movie.title}</p>
                  <div className="flex items-center gap-1 text-[8px] md:text-[10px] text-muted-foreground">
                    <span className="text-primary font-semibold">{movie.rating}</span>
                    <span>•</span>
                    <span>{movie.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-center opacity-80 hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
};

export default MovieRow;
