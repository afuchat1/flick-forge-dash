import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useGenres } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const genreIcons: Record<number, string> = {
  28: "💥", // Action
  12: "🗺️", // Adventure
  16: "🎨", // Animation
  35: "😂", // Comedy
  80: "🔍", // Crime
  99: "📹", // Documentary
  18: "🎭", // Drama
  10751: "👨‍👩‍👧", // Family
  14: "🧙", // Fantasy
  36: "📜", // History
  27: "👻", // Horror
  10402: "🎵", // Music
  9648: "🔮", // Mystery
  10749: "💕", // Romance
  878: "🚀", // Sci-Fi
  10770: "📺", // TV Movie
  53: "😱", // Thriller
  10752: "⚔️", // War
  37: "🤠", // Western
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
          <Link
            key={genre.id}
            to={`/genre/${genre.id}`}
            className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden relative bg-gradient-to-br from-accent/50 to-accent/20"
          >
            <div className="absolute inset-0 flex items-center gap-2 px-3">
              <span className="text-lg">{genreIcons[genre.id] || "🎬"}</span>
              <span className="text-xs font-semibold truncate">{genre.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
