import { Link } from "react-router-dom";
import { allGenres, getMoviesByGenre } from "@/data/movies";

const GenreGrid = () => {
  return (
    <section className="py-3">
      <div className="px-4 mb-2">
        <h2 className="text-base md:text-lg font-bold">Browse by Genre</h2>
      </div>
      
      <div className="px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {allGenres.map((genre) => {
            const movies = getMoviesByGenre(genre);
            const previewImage = movies[0]?.image;
            
            return (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
                className="relative aspect-[4/3] rounded-md overflow-hidden group"
              >
                <img
                  src={previewImage}
                  alt={genre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs md:text-sm font-bold text-center px-1">{genre}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenreGrid;
