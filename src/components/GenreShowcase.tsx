import { Link } from "react-router-dom";
import { allGenres, getMoviesByGenre } from "@/data/movies";

const genreIcons: Record<string, string> = {
  "Action": "💥",
  "Adventure": "🗺️",
  "Animation": "🎨",
  "Biography": "📖",
  "Comedy": "😂",
  "Crime": "🔍",
  "Drama": "🎭",
  "Fantasy": "🧙",
  "History": "📜",
  "Horror": "👻",
  "Mystery": "🔮",
  "Romance": "💕",
  "Sci-Fi": "🚀",
  "Thriller": "😱",
  "War": "⚔️",
};

const genreColors: Record<string, string> = {
  "Action": "from-red-500/30 to-orange-500/30",
  "Adventure": "from-green-500/30 to-emerald-500/30",
  "Animation": "from-pink-500/30 to-purple-500/30",
  "Biography": "from-amber-500/30 to-yellow-500/30",
  "Comedy": "from-yellow-500/30 to-lime-500/30",
  "Crime": "from-slate-500/30 to-gray-500/30",
  "Drama": "from-purple-500/30 to-indigo-500/30",
  "Fantasy": "from-violet-500/30 to-purple-500/30",
  "History": "from-amber-600/30 to-orange-600/30",
  "Horror": "from-red-600/30 to-rose-600/30",
  "Mystery": "from-indigo-500/30 to-blue-500/30",
  "Romance": "from-pink-500/30 to-rose-500/30",
  "Sci-Fi": "from-cyan-500/30 to-blue-500/30",
  "Thriller": "from-gray-600/30 to-slate-600/30",
  "War": "from-stone-500/30 to-neutral-500/30",
};

const GenreShowcase = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="px-4 md:px-8 lg:px-12 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Browse by Genre</h2>
        <p className="text-sm text-muted-foreground mt-1">Find your perfect movie by category</p>
      </div>
      
      <div className="px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {allGenres.slice(0, 16).map((genre) => {
            const movies = getMoviesByGenre(genre);
            const previewImage = movies[0]?.image;
            
            return (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt={genre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${genreColors[genre] || 'from-primary/30 to-accent/30'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-2xl md:text-3xl mb-1">{genreIcons[genre] || "🎬"}</span>
                  <span className="text-xs md:text-sm font-bold text-foreground">{genre}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{movies.length} movies</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenreShowcase;
