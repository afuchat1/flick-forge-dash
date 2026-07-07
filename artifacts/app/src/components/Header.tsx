import { Link, useNavigate } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.png" alt="AfuChat Movies" className="h-8 w-auto" />
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
