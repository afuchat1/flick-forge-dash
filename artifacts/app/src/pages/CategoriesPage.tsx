import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useGenres, useMoviesByGenre, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const GenreCard = ({ genre }: { genre: { id: number; name: string } }) => {
  const { data: movies } = useMoviesByGenre(genre.id, 1);
  const backdropMovie = movies?.results?.[0];

  return (
    <Link
      to={`/genre/${genre.id}`}
      className="relative aspect-video rounded-lg overflow-hidden group"
    >
      {backdropMovie?.backdrop_path ? (
        <img
          src={getImageUrl(backdropMovie.backdrop_path, "w780")}
          alt={genre.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold">{genre.name}</span>
        {movies?.total_results && (
          <span className="text-[10px] text-muted-foreground">{movies.total_results}+ titles</span>
        )}
      </div>
    </Link>
  );
};

const CategoriesPage = () => {
  const { data: genres, isLoading } = useGenres();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      
      <main className="pt-14 md:pt-28">
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">Categories</h1>
          <p className="text-xs text-muted-foreground">Browse by genre</p>
        </div>

        <div className="px-3">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {genres?.map((genre: { id: number; name: string }) => (
                <GenreCard key={genre.id} genre={genre} />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default CategoriesPage;
