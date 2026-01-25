import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, Film, Tv, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  className?: string;
}

const moods = [
  { id: "happy", label: "😊 Happy" },
  { id: "thrilled", label: "🔥 Thrilled" },
  { id: "romantic", label: "💕 Romantic" },
  { id: "relaxed", label: "😌 Relaxed" },
];

const SearchAutocomplete = ({ className }: SearchAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useSearchSuggestions(debouncedQuery, selectedMood);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowMoodPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (title: string, type: string) => {
    navigate(`/search?q=${encodeURIComponent(title)}`);
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedMood(null);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative flex-1", className)}>
      <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies, series..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {query && !isLoading && (
          <button onClick={clearSearch} className="p-0.5 rounded-full hover:bg-muted">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
        <button
          onClick={() => setShowMoodPicker(!showMoodPicker)}
          className={cn(
            "p-1 rounded-full transition-colors",
            selectedMood ? "bg-primary/20 text-primary" : "hover:bg-muted text-muted-foreground"
          )}
          title="Filter by mood"
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Mood Picker */}
      {showMoodPicker && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-card rounded-lg border border-border shadow-lg z-50">
          <p className="text-xs text-muted-foreground mb-2 px-1">Filter by mood:</p>
          <div className="flex gap-1 flex-wrap">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => {
                  setSelectedMood(selectedMood === mood.id ? null : mood.id);
                  setShowMoodPicker(false);
                }}
                className={cn(
                  "px-2 py-1 rounded-full text-xs transition-colors",
                  selectedMood === mood.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                )}
              >
                {mood.label}
              </button>
            ))}
            {selectedMood && (
              <button
                onClick={() => {
                  setSelectedMood(null);
                  setShowMoodPicker(false);
                }}
                className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive hover:bg-destructive/30"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && query.length >= 2 && data?.suggestions && data.suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              AI Suggestions
              {selectedMood && <span className="text-primary">• {selectedMood} mood</span>}
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {data.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.title, suggestion.type)}
                className="w-full px-3 py-2.5 flex items-start gap-3 hover:bg-accent transition-colors text-left"
              >
                <div className="p-1.5 rounded bg-muted">
                  {suggestion.type === "tv" ? (
                    <Tv className="h-4 w-4 text-primary" />
                  ) : (
                    <Film className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion.year} • {suggestion.reason}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="block p-2 text-center text-xs text-primary hover:bg-accent border-t border-border"
          >
            See all results for "{query}"
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
