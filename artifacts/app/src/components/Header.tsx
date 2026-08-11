import { Link, useLocation } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";

const navTabs = [
  { name: "Trending", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "TV", href: "/tv-shows" },
  { name: "New", href: "/new-popular" },
  { name: "My List", href: "/my-list" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
        {/* Row 1: logo + (desktop) nav + (desktop) search */}
        <div className="flex items-center gap-3 md:gap-6 h-14 md:h-20">
          <Link to="/" className="shrink-0" aria-label="AfuChat Movies home">
            <img
              src="/logo.png"
              alt="AfuChat Movies"
              className="h-9 md:h-14 w-auto max-w-[180px] md:max-w-[260px] object-contain drop-shadow-[0_2px_12px_hsl(var(--primary)/0.35)]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 min-w-0 overflow-x-auto scrollbar-hide">
            {navTabs.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={`text-sm font-semibold whitespace-nowrap transition-colors border-b-2 pb-0.5 ${
                    isActive
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop search */}
          <div className="hidden md:block ml-auto w-full max-w-sm min-w-0">
            <SearchAutocomplete />
          </div>
        </div>

        {/* Row 2 (mobile only): search */}
        <div className="md:hidden pb-2 -mt-0.5">
          <SearchAutocomplete />
        </div>
      </div>
    </header>
  );
};

export default Header;
