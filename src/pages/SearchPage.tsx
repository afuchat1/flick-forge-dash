import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useSearch, useGenres, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const { data: searchResults, isLoading: searchLoading } = useSearch(query);
  const { data: genres, isLoading: genresLoading } = useGenres();

  const results = searchResults?.results || [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies & TV shows..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-card text-sm"
            />
          </div>
        </div>

        {!query && (
          <div className="px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {genresLoading ? (
                [...Array(8)].map((_, i) => <Skeleton key={i} className="h-7 w-16 rounded-lg flex-shrink-0" />)
              ) : (
                genres?.slice(0, 12).map((g: any) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedGenre === g.id ? "bg-primary text-primary-foreground" : "bg-card"
                    }`}
                  >
                    {g.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="px-3 pt-2">
          {searchLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground mb-2">{results.length} results</p>
              <div className="grid grid-cols-3 gap-2">
                {results.map((item) => {
                  const isTV = item.media_type === "tv" || item.first_air_date;
                  const path = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
                  const title = item.title || item.name || "Untitled";
                  
                  return (
                    <Link key={item.id} to={path}>
                      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                        <img 
                          src={getImageUrl(item.poster_path)} 
                          alt={title} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs font-medium mt-1 line-clamp-1">{title}</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <span className="text-primary">{Math.round(item.vote_average * 10)}%</span>
                        <span>{(item.release_date || item.first_air_date)?.slice(0, 4)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm">No results found</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm">Search for movies and TV shows</p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default SearchPage;
