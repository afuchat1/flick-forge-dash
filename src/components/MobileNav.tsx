import { Link, useLocation } from "react-router-dom";
import { Home, Tv, Download, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "TV Shows", href: "/tv-shows", icon: Tv },
    { name: "Downloads", href: "/my-list", icon: Download },
    { name: "Me", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 relative">
        {/* Home */}
        <Link
          to={navItems[0].href}
          className={`flex flex-col items-center gap-0.5 ${
            location.pathname === navItems[0].href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* TV Shows */}
        <Link
          to={navItems[1].href}
          className={`flex flex-col items-center gap-0.5 ${
            location.pathname === navItems[1].href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Tv className="h-5 w-5" />
          <span className="text-[10px]">TV Shows</span>
        </Link>

        {/* Center Logo */}
        <Link to="/" className="-mt-6">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="text-base font-bold text-primary-foreground">AC</span>
          </div>
        </Link>

        {/* Downloads */}
        <Link
          to={navItems[2].href}
          className={`flex flex-col items-center gap-0.5 ${
            location.pathname === navItems[2].href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Download className="h-5 w-5" />
          <span className="text-[10px]">Downloads</span>
        </Link>

        {/* Me */}
        <Link
          to={navItems[3].href}
          className={`flex flex-col items-center gap-0.5 ${
            location.pathname === navItems[3].href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px]">Me</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
