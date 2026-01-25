import { Link, useNavigate } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">AC</span>
          </div>
        </Link>

        {/* AI-Powered Search */}
        <SearchAutocomplete />

        {/* Search Link */}
        <Link
          to="/search"
          className="text-primary font-semibold text-sm flex-shrink-0"
        >
          Search
        </Link>
      </div>
    </header>
  );
};

export default Header;
