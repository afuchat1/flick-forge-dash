import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const RecentlyViewed = () => {
  const { user } = useAuth();
  const { recentlyViewed, isLoading } = useRecentlyViewed();

  if (!user) return null;
  if (!isLoading && recentlyViewed.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Continue Watching</h2>
      </div>

      {isLoading && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <Skeleton className="w-32 h-48 rounded-lg" />
              <Skeleton className="h-3 w-28 mt-2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && recentlyViewed.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recentlyViewed.map((item) => (
            <Link
              key={item.id}
              to={`/${item.media_type}/${item.tmdb_id}`}
              className="flex-shrink-0 w-32 group"
            >
              <div className="relative">
                <img
                  src={item.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                    : "/placeholder.svg"
                  }
                  alt={item.title}
                  className="w-32 h-48 object-cover rounded-lg group-hover:ring-2 ring-primary transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-xs text-white font-medium">Resume</span>
                </div>
              </div>
              <h3 className="text-sm font-medium mt-2 line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyViewed;
