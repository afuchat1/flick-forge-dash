import { 
  Film, Tv, TrendingUp, Clock, Heart, Download, 
  Sparkles, Crown, Compass, Star, Clapperboard 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const QuickNavigation = () => {
  const { user } = useAuth();
  const { watchlist } = useWatchlist();
  const { recentlyViewed } = useRecentlyViewed();

  const quickLinks = [
    { 
      to: "/movies", 
      icon: Film, 
      label: "Movies", 
      color: "from-blue-500/20 to-blue-600/20 text-blue-400",
      border: "border-blue-500/30"
    },
    { 
      to: "/tv-shows", 
      icon: Tv, 
      label: "TV Shows", 
      color: "from-purple-500/20 to-purple-600/20 text-purple-400",
      border: "border-purple-500/30"
    },
    { 
      to: "/new-popular", 
      icon: TrendingUp, 
      label: "Trending", 
      color: "from-orange-500/20 to-red-500/20 text-orange-400",
      border: "border-orange-500/30"
    },
    { 
      to: "/categories", 
      icon: Compass, 
      label: "Explore", 
      color: "from-teal-500/20 to-cyan-500/20 text-teal-400",
      border: "border-teal-500/30"
    },
  ];

  const personalLinks = user ? [
    { 
      to: "/my-list", 
      icon: Heart, 
      label: "My List",
      count: watchlist.length,
      color: "from-pink-500/20 to-rose-500/20 text-pink-400",
      border: "border-pink-500/30"
    },
    { 
      to: "/downloads", 
      icon: Download, 
      label: "Downloads",
      color: "from-green-500/20 to-emerald-500/20 text-green-400",
      border: "border-green-500/30"
    },
  ] : [];

  return (
    <section className="px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Quick Access</h2>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br ${link.color} border ${link.border} hover:scale-105 transition-all`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {personalLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {personalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${link.color} border ${link.border} hover:scale-[1.02] transition-all`}
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <span className="text-sm font-medium">{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <p className="text-xs opacity-80">{link.count} items</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!user && (
        <Link
          to="/auth"
          className="mt-3 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-primary hover:bg-primary/30 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Sign in for personalized experience</span>
        </Link>
      )}
    </section>
  );
};

export default QuickNavigation;
