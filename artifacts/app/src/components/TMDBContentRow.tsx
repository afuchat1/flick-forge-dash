import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { TMDBMovie, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

interface TMDBContentRowProps {
  title: string;
  movies?: TMDBMovie[];
  isLoading?: boolean;
  showRanks?: boolean;
  href?: string;
}

const TMDBContentRow = ({ title, movies, isLoading, showRanks, href }: TMDBContentRowProps) => {
  if (isLoading) {
    return (
      <div className="py-2">
        <div className="px-3 mb-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2 px-3 overflow-x-auto scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-24 aspect-[2/3] rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies?.length) return null;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-bold">{title}</h2>
        {href && (
          <Link to={href} className="text-xs text-muted-foreground flex items-center">
            See all <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      
      <div className="flex gap-2 px-3 overflow-x-auto scrollbar-hide">
        {movies.slice(0, 20).map((movie, index) => {
          const isTV = movie.media_type === "tv" || movie.first_air_date;
          const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
          const displayTitle = movie.title || movie.name || "Untitled";
          
          return (
            <Link
              key={movie.id}
              to={detailPath}
              className="flex-shrink-0 relative group"
            >
              {showRanks && (
                <span className="absolute -left-1 bottom-0 text-4xl font-black text-foreground/20 z-10">
                  {index + 1}
                </span>
              )}
              <div className={`${showRanks ? "w-20 ml-3" : "w-24"} aspect-[2/3] rounded-md overflow-hidden bg-card`}>
                <img
                  src={getImageUrl(movie.poster_path, "w342")}
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="text-[10px] font-medium mt-1 line-clamp-1 w-24">{displayTitle}</p>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="text-primary">{Math.round(movie.vote_average * 10)}%</span>
                <span>{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TMDBContentRow;
