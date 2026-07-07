import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface ContentRowProps {
  title: string;
  movies: Movie[];
  href?: string;
  showRanks?: boolean;
}

const ContentRow = ({ title, movies, href, showRanks = false }: ContentRowProps) => {
  return (
    <section className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-base font-bold">{title}</h2>
        {href && (
          <Link to={href} className="text-xs text-muted-foreground flex items-center">
            All <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Movies */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3">
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="flex-shrink-0 w-28"
          >
            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card mb-1">
              {showRanks && (
                <div className="absolute top-1 left-1 z-10">
                  <span className="text-2xl font-black text-primary" style={{ 
                    WebkitTextStroke: '1px hsl(var(--primary))',
                    WebkitTextFillColor: 'hsl(var(--background))'
                  }}>
                    {index + 1}
                  </span>
                </div>
              )}
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Title */}
            <p className="text-xs font-medium line-clamp-1">{movie.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContentRow;
