import { Link, useNavigate } from "react-router-dom";
import { Trash2, Play } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const MyListPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { watchlist, isLoading, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      
      <main className="pt-14 md:pt-28">
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">My List</h1>
          <p className="text-xs text-muted-foreground">
            {watchlist.length} {watchlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {isLoading ? (
          <div className="px-3">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              ))}
            </div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="px-3 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Your List is Empty</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add movies and shows to watch later
            </p>
            <Link to="/">
              <Button>Browse Content</Button>
            </Link>
          </div>
        ) : (
          <div className="px-3">
            <div className="grid grid-cols-3 gap-2">
              {watchlist.map((item) => {
                const detailPath = item.media_type === "tv" ? `/tv/${item.tmdb_id}` : `/movie/${item.tmdb_id}`;
                
                return (
                  <div key={item.id} className="relative group">
                    <Link to={detailPath}>
                      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                        <img
                          src={getImageUrl(item.poster_path, "w342")}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium mt-1 line-clamp-1">{item.title}</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <span className="text-primary">{Math.round((item.vote_average || 0) * 10)}%</span>
                        <span>{item.release_date?.slice(0, 4)}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWatchlist({ tmdb_id: item.tmdb_id, media_type: item.media_type as "movie" | "tv" })}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default MyListPage;
