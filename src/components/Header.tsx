import { Search, Menu, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm" : "bg-gradient-to-b from-background to-transparent"}`}>
        <div className="flex items-center justify-between px-4 h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">A</span>
            </div>
            <span className="text-sm font-bold hidden sm:block">AfuChat</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm ${location.pathname === item.href ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link to="/search" className="p-1.5">
              <Search className="h-5 w-5" />
            </Link>
            <Link to="/notifications" className="p-1.5 relative hidden sm:block">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="p-1.5 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/profile" className="w-7 h-7 rounded-md bg-primary hidden md:flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">U</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="p-4">
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg font-medium py-2"
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium py-2">
                Categories
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium py-2">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
