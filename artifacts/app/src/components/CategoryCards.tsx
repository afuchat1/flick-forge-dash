import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useGenres, useMoviesByGenre, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const GenreChip = ({ genre }: { genre: { id: number; name: string } }) => {
  const { data: movies } = useMoviesByGenre(genre.id, 1);
  const backdropMovie = movies?.results?.[0];

  return (
    <Link
      to={`/genre/${genre.id}`}
      className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden relative group"
    >
      {backdropMovie?.backdrop_path ? (
        <img
          src={getImageUrl(backdropMovie.backdrop_path, "w500")}
          alt={genre.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent/50 to-accent/20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center px-2">
        <span className="text-xs font-semibold text-center">{genre.name}</span>
      </div>
    </Link>
  );
};

const CategoryCards = () => {
  const { data: genres, isLoading } = useGenres();
  const displayGenres = genres?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="py-3">
        <h2 className="text-base font-bold px-3 mb-2">Categories</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-28 h-16 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-3">
      <h2 className="text-base font-bold px-3 mb-2">Categories</h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3">
        <Link
          to="/categories"
          className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden relative bg-gradient-to-br from-primary/30 to-primary/10"
        >
          <div className="absolute inset-0 flex items-center justify-between px-3">
            <span className="text-sm font-semibold">All</span>
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
        {displayGenres.map((genre: { id: number; name: string }) => (
          <GenreChip key={genre.id} genre={genre} />
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
