import { Link, useLocation } from "react-router-dom";
import { Home, Search, Film, Heart, User } from "lucide-react";

const navItems = [
  { name: "Home",    href: "/",        icon: Home },
  { name: "Search",  href: "/search",  icon: Search },
  { name: "Movies",  href: "/movies",  icon: Film },
  { name: "My List", href: "/my-list", icon: Heart },
  { name: "Profile", href: "/profile", icon: User },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 safe-area-inset-bottom">
      <div className="flex items-stretch justify-around">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 flex-1 min-w-0 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium leading-none ${isActive ? "text-primary" : ""}`}>
                {name}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
