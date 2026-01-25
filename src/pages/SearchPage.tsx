import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { searchMovies, allMovies, allGenres, getMoviesByGenre, Movie } from "@/data/movies";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim()) {
      let filtered = searchMovies(query);
      if (selectedGenre) filtered = filtered.filter(m => m.genre?.includes(selectedGenre));
      setResults(filtered);
    } else if (selectedGenre) {
      setResults(allMovies.filter(m => m.genre?.includes(selectedGenre)));
    } else {
      setResults([]);
    }
  }, [query, selectedGenre]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        {/* Genre Filters */}
        <div className="px-3 py-2">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {allGenres.slice(0, 10).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  selectedGenre === g ? "bg-primary text-primary-foreground" : "bg-card"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="px-3 pt-2">
          {results.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground mb-2">{results.length} results</p>
              <div className="grid grid-cols-3 gap-2">
                {results.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : query || selectedGenre ? (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm">No results found</p>
            </div>
          ) : (
            <>
              <h2 className="text-sm font-semibold mb-2">Browse Categories</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {allGenres.slice(0, 6).map((genre) => {
                  const movies = getMoviesByGenre(genre);
                  return (
                    <Link
                      key={genre}
                      to={`/genre/${genre.toLowerCase()}`}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <img src={movies[0]?.image} alt={genre} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <span className="text-sm font-bold">{genre}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              <h2 className="text-sm font-semibold mb-2">Popular</h2>
              <div className="grid grid-cols-3 gap-2">
                {allMovies.slice(0, 12).map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default SearchPage;
