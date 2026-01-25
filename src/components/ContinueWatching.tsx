import { Play, X, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useWatchProgress } from "@/hooks/useWatchProgress";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/hooks/useTMDB";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ContinueWatching = () => {
  const { user } = useAuth();
  const { continueWatching, removeProgress, isLoading } = useWatchProgress();

  if (!user || isLoading || continueWatching.length === 0) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <section className="py-4">
      <div className="flex items-center gap-2 px-3 mb-3">
        <Clock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold">Continue Watching</h2>
      </div>

      <div className="flex gap-3 px-3 overflow-x-auto scrollbar-hide">
        {continueWatching.map((item) => {
          const percentage = Math.round((item.progress_seconds / item.duration_seconds) * 100);
          const remainingTime = item.duration_seconds - item.progress_seconds;
          const isTV = item.media_type === "tv";
          const detailPath = isTV ? `/tv/${item.tmdb_id}` : `/movie/${item.tmdb_id}`;

          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-40 group relative animate-fade-in"
            >
              <Link to={detailPath}>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
                  <img
                    src={getImageUrl(item.backdrop_path || item.poster_path, "w500")}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <Progress value={percentage} className="h-1" />
                  </div>
                </div>
              </Link>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeProgress(item.id);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <X className="h-3 w-3" />
              </button>

              <div className="mt-1.5">
                <p className="text-xs font-medium line-clamp-1">{item.title}</p>
                {item.episode_title && (
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    S{item.season_number} E{item.episode_number}: {item.episode_title}
                  </p>
                )}
                <p className="text-[10px] text-primary">
                  {formatTime(remainingTime)} left
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatching;
