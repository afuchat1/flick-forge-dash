import { Link, useLocation } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";

const navTabs = [
  { name: "Trending", href: "/" },
  { name: "Movies",   href: "/movies" },
  { name: "TV",       href: "/tv-shows" },
  { name: "New",      href: "/new-popular" },
  { name: "My List",  href: "/my-list" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
      {/* Top row: Logo + Search */}
      <div className="flex items-center gap-2 md:gap-4 px-3 md:px-6 py-3 md:py-4">
        <Link to="/" className="flex-shrink-0" aria-label="AfuChat Movies home">
          <img
            src="/logo.png"
            alt="AfuChat Movies"
            className="h-14 md:h-24 w-auto drop-shadow-[0_2px_12px_rgba(229,20,20,0.35)]"
            style={{ maxWidth: 320 }}
          />
        </Link>

        <div className="flex-1 min-w-0">
          <SearchAutocomplete />
        </div>

        {/* Search link — hidden on mobile (MobileNav has it) */}
        <Link
          to="/search"
          className="hidden md:block text-primary font-bold text-sm flex-shrink-0"
        >
          Search
        </Link>
      </div>

      {/* Bottom row: Nav tabs — hidden on mobile (MobileNav handles it) */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide border-t border-border/20">
        <div className="flex items-center gap-6 px-4 py-2 whitespace-nowrap">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.href;
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={`text-sm font-semibold transition-colors pb-1 ${
                  isActive
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
