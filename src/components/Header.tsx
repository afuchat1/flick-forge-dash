import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">AC</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2 bg-card rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search movies, series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="text-primary font-semibold text-sm flex-shrink-0"
        >
          Search
        </button>
      </div>
    </header>
  );
};

export default Header;
