import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
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

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">Categories</h1>
            <p className="text-muted-foreground">
              Explore movies by genre
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allGenres.map((genre) => {
              const movies = getMoviesByGenre(genre);
              const previewImage = movies[0]?.image;
              
              return (
                <Link
                  key={genre}
                  to={`/genre/${genre.toLowerCase()}`}
                  className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  {/* Background */}
                  <div className="absolute inset-0">
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt={genre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-3xl md:text-4xl mb-2">{genreIcons[genre] || "🎬"}</span>
                    <span className="text-sm md:text-base font-bold text-foreground">{genre}</span>
                    <span className="text-xs text-muted-foreground mt-1">{movies.length} movies</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default CategoriesPage;
