import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
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

const genreColors: Record<number, string> = {
  28: "from-red-500/40 to-orange-500/20",
  12: "from-emerald-500/40 to-teal-500/20",
  16: "from-pink-500/40 to-purple-500/20",
  35: "from-yellow-500/40 to-amber-500/20",
  80: "from-slate-500/40 to-zinc-500/20",
  99: "from-blue-500/40 to-cyan-500/20",
  18: "from-violet-500/40 to-purple-500/20",
  10751: "from-green-500/40 to-lime-500/20",
  14: "from-indigo-500/40 to-blue-500/20",
  36: "from-amber-500/40 to-yellow-500/20",
  27: "from-gray-700/40 to-slate-700/20",
  10402: "from-fuchsia-500/40 to-pink-500/20",
  9648: "from-purple-500/40 to-violet-500/20",
  10749: "from-rose-500/40 to-pink-500/20",
  878: "from-cyan-500/40 to-blue-500/20",
  10770: "from-sky-500/40 to-indigo-500/20",
  53: "from-orange-500/40 to-red-500/20",
  10752: "from-stone-500/40 to-gray-500/20",
  37: "from-amber-600/40 to-orange-600/20",
};

const CategoriesPage = () => {
  const { data: genres, isLoading } = useGenres();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
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
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${genreColors[genre.id] || "from-primary/30 to-primary/10"} hover:scale-[1.02] transition-transform`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-3xl">{genreIcons[genre.id] || "🎬"}</span>
                    <span className="text-sm font-bold">{genre.name}</span>
                  </div>
                </Link>
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
