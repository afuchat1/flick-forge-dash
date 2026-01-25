import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { searchMovies, allMovies, allGenres, Movie } from "@/data/movies";

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
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, actors..."
              className="h-10 pl-9 pr-9 bg-card border-border rounded-md"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Genre Filters */}
        <div className="px-4 mb-4">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {allGenres.slice(0, 10).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs ${
                  selectedGenre === g ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="px-4">
          {results.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground mb-3">{results.length} results</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {results.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="relative aspect-[2/3] rounded-md overflow-hidden">
                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-background via-background/80 to-transparent">
                      <p className="text-[10px] font-medium line-clamp-1">{movie.title}</p>
                    </div>
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {allMovies.slice(0, 18).map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="relative aspect-[2/3] rounded-md overflow-hidden">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-background via-background/80 to-transparent">
                    <p className="text-[10px] font-medium line-clamp-1">{movie.title}</p>
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

export default SearchPage;
