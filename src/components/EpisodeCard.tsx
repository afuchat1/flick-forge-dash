import { Play, Star, Clock, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/hooks/useTMDB";

interface EpisodeCardProps {
  episode: {
    id: number;
    episode_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    runtime: number | null;
    vote_average: number;
    air_date: string;
  };
  hasVideoLink: boolean;
  videoQuality?: string;
  onPlay: () => void;
  onAddLink?: () => void;
  isAdmin?: boolean;
}

const EpisodeCard = ({
  episode,
  hasVideoLink,
  videoQuality,
  onPlay,
  onAddLink,
  isAdmin,
}: EpisodeCardProps) => {
  return (
    <div className="flex gap-3 p-2 rounded-lg bg-card hover:bg-accent transition-colors group">
      {/* Thumbnail */}
      <div 
        className="relative w-28 flex-shrink-0 cursor-pointer"
        onClick={onPlay}
      >
        <img
          src={getImageUrl(episode.still_path, "w342")}
          alt={episode.name}
          className="w-full aspect-video object-cover rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <Play className="h-6 w-6 fill-current" />
        </div>
        {hasVideoLink && (
          <Badge className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] px-1 py-0">
            {videoQuality || "HD"}
          </Badge>
        )}
        {!hasVideoLink && (
          <Badge variant="secondary" className="absolute top-1 right-1 text-[8px] px-1 py-0">
            Coming Soon
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs font-medium line-clamp-1">
              {episode.episode_number}. {episode.name}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
              {episode.runtime && (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  {episode.runtime}m
                </span>
              )}
              {episode.vote_average > 0 && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                  {episode.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          {isAdmin && onAddLink && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onAddLink();
              }}
              title={hasVideoLink ? "Update video link" : "Add video link"}
            >
              <Link2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
          {episode.overview || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default EpisodeCard;
