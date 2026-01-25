import { Search, Menu, X, Bell, User, Home, Film, Tv, Sparkles, Download, Grid3X3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/tv-shows", icon: Tv },
  { name: "Categories", href: "/categories", icon: Grid3X3 },
  { name: "New & Popular", href: "/new-popular", icon: Sparkles },
  { name: "My List", href: "/my-list", icon: Download },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "glass py-2 md:py-3" 
            : "bg-gradient-to-b from-background via-background/80 to-transparent py-3 md:py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-lg flex items-center justify-center group-hover:animate-pulse-glow transition-all">
                <span className="text-primary-foreground font-black text-base md:text-lg">A</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm md:text-base font-bold tracking-tight leading-none">
                  AfuChat<span className="text-primary"> Movies</span>
                </span>
                <span className="text-[9px] text-muted-foreground tracking-wider">STREAM FREE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.href
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <form onSubmit={handleSearch} className={`relative transition-all duration-300 ${isSearchOpen ? "w-40 md:w-56" : "w-9"}`}>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute left-0 top-0 h-9 w-9 flex items-center justify-center text-foreground z-10"
                >
                  <Search className="h-4 w-4" />
                </button>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`h-9 pl-9 pr-3 bg-secondary/80 border-0 rounded-full text-sm transition-all duration-300 ${
                    isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                />
              </form>

              {/* Notification */}
              <Link to="/notifications" className="hidden md:flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50 transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </Link>

              {/* Profile */}
              <Link to="/profile" className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent overflow-hidden">
                <User className="h-4 w-4 text-primary-foreground" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <nav className={`absolute bottom-0 left-0 right-0 p-4 pb-8 bg-card rounded-t-3xl transition-transform duration-500 ${
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}>
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-5" />
          <div className="grid grid-cols-3 gap-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                  location.pathname === item.href
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
            <Link 
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 text-foreground"
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
            <Link 
              to="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 text-foreground relative"
            >
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Alerts</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
