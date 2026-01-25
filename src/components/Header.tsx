import { Search, Menu, X, Bell, User, Home, Film, Tv, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/tv", icon: Tv },
  { name: "New & Popular", href: "/new", icon: Sparkles },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "glass py-3" 
            : "bg-gradient-to-b from-background via-background/80 to-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center group-hover:animate-pulse-glow transition-all">
                <span className="text-primary-foreground font-black text-lg md:text-xl">F</span>
              </div>
              <span className="text-lg md:text-xl font-bold tracking-tight hidden sm:block">
                Flick<span className="text-primary">Forge</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search */}
              <div className={`relative transition-all duration-300 ${isSearchOpen ? "w-48 md:w-64" : "w-10"}`}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-foreground z-10"
                >
                  <Search className="h-5 w-5" />
                </button>
                <Input
                  placeholder="Search..."
                  className={`h-10 pl-10 pr-4 bg-secondary/80 border-0 rounded-full transition-all duration-300 ${
                    isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                />
              </div>

              {/* Notification */}
              <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted/50 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </button>

              {/* Profile */}
              <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent overflow-hidden">
                <User className="h-5 w-5 text-primary-foreground" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
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
        <nav className={`absolute bottom-0 left-0 right-0 p-6 pb-10 bg-card rounded-t-3xl transition-transform duration-500 ${
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}>
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
          <div className="grid grid-cols-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  location.pathname === item.href
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-6">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Notifications</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
              <span className="text-sm">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
