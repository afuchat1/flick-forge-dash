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

const GenreShowcase = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="px-4 md:px-6 lg:px-8 mb-3 md:mb-5">
        <h2 className="text-lg md:text-xl font-bold">Browse by Genre</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Find your perfect movie</p>
      </div>
      
      <div className="px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {allGenres.slice(0, 16).map((genre) => {
            const movies = getMoviesByGenre(genre);
            const previewImage = movies[0]?.image;
            
            return (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                {/* Background */}
                <div className="absolute inset-0">
                  {previewImage && (
                    <img src={previewImage} alt={genre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-xl md:text-2xl mb-0.5">{genreIcons[genre] || "🎬"}</span>
                  <span className="text-[10px] md:text-xs font-bold text-foreground">{genre}</span>
                  <span className="text-[8px] md:text-[10px] text-muted-foreground">{movies.length}</span>
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
