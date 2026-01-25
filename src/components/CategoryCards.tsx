import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { allGenres, getMoviesByGenre } from "@/data/movies";

const CategoryCards = () => {
  const displayCategories = ["All", "Hollywood", "Action", "Drama", "Sci-Fi", "Comedy"];

  return (
    <section className="py-3">
      <h2 className="text-base font-bold px-3 mb-2">Categories</h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3">
        {displayCategories.map((category, index) => {
          const movies = category === "All" ? [] : getMoviesByGenre(category);
          const bgImage = category === "All" ? "" : movies[0]?.image;

          return (
            <Link
              key={category}
              to={category === "All" ? "/categories" : `/genre/${category.toLowerCase()}`}
              className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden relative"
            >
              {bgImage ? (
                <img src={bgImage} alt={category} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-sm font-semibold">{category}</span>
                {category === "All" && (
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryCards;
