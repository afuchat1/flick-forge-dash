import { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import NetflixCard from "@/components/NetflixCard";
import MobileNav from "@/components/MobileNav";
import { searchMovies, allMovies, allGenres, Movie } from "@/data/movies";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      let filtered = searchMovies(query);
      if (selectedGenre) {
        filtered = filtered.filter(m => m.genre?.includes(selectedGenre));
      }
      setResults(filtered);
    } else if (selectedGenre) {
      setResults(allMovies.filter(m => m.genre?.includes(selectedGenre)));
    } else {
      setResults([]);
    }
  }, [query, selectedGenre]);

  const clearSearch = () => {
    setQuery("");
    setSelectedGenre(null);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Search Header */}
          <div className="space-y-4 md:space-y-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">Search</h1>
            
            {/* Search Input */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, actors, genres..."
                className="h-12 md:h-14 pl-12 pr-12 text-base md:text-lg bg-card border-border rounded-xl"
                autoFocus
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="glass"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              {selectedGenre && (
                <div className="flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full">
                  <span className="text-sm text-primary">{selectedGenre}</span>
                  <button onClick={() => setSelectedGenre(null)}>
                    <X className="h-3 w-3 text-primary" />
                  </button>
                </div>
              )}
            </div>

            {/* Genre Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedGenre === genre
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {results.map((movie, index) => (
                  <NetflixCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </div>
          ) : query || selectedGenre ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try different keywords or filters</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Popular Searches */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Romance", "Horror", "Animation"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSelectedGenre(term)}
                      className="px-4 py-2 bg-secondary/50 rounded-full text-sm hover:bg-secondary transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse All */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Browse All ({allMovies.length} movies)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {allMovies.slice(0, 18).map((movie, index) => (
                    <NetflixCard key={movie.id} movie={movie} index={index} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default SearchPage;
