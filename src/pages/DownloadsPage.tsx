import { Link, useNavigate } from "react-router-dom";
import { Trash2, Play, Download } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useDownloads } from "@/hooks/useDownloads";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const DownloadsPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { downloads, isLoading, removeDownload } = useDownloads();

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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">Downloads</h1>
          <p className="text-xs text-muted-foreground">
            {downloads.length} {downloads.length === 1 ? "item" : "items"} downloaded
          </p>
        </div>

        {isLoading ? (
          <div className="px-3 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-20 aspect-[2/3] rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : downloads.length === 0 ? (
          <div className="px-3 py-12 text-center">
            <Download className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h2 className="text-lg font-semibold mb-1">No Downloads Yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Download movies and shows to watch offline
            </p>
            <Link to="/">
              <Button>Browse Content</Button>
            </Link>
          </div>
        ) : (
          <div className="px-3 space-y-3">
            {downloads.map((item) => {
              const detailPath = item.media_type === "tv" ? `/tv/${item.tmdb_id}` : `/movie/${item.tmdb_id}`;
              
              return (
                <div
                  key={item.id}
                  className="flex gap-3 bg-card rounded-lg p-2"
                >
                  <Link to={detailPath} className="flex-shrink-0">
                    <div className="w-20 aspect-[2/3] rounded-md overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path, "w185")}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex-1 min-w-0 py-1">
                    <Link to={detailPath}>
                      <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="text-primary">{Math.round((item.vote_average || 0) * 10)}%</span>
                      <span>{item.release_date?.slice(0, 4)}</span>
                      <span className="capitalize">{item.media_type}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Downloaded {new Date(item.downloaded_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2 mt-2">
                      <Link to={detailPath}>
                        <Button size="sm" className="h-7 px-3 text-xs">
                          <Play className="h-3 w-3 mr-1" fill="currentColor" />
                          Watch
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-destructive hover:text-destructive"
                        onClick={() => removeDownload({ tmdb_id: item.tmdb_id, media_type: item.media_type as "movie" | "tv" })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default DownloadsPage;
