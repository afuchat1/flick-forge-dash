import { useState } from "react";
import { X, Link2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddEpisodeVideoLink } from "@/hooks/useEpisodeVideoLinks";

interface AddEpisodeVideoModalProps {
  tmdbId: number;
  showTitle: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle: string;
  onClose: () => void;
}

const AddEpisodeVideoModal = ({
  tmdbId,
  showTitle,
  seasonNumber,
  episodeNumber,
  episodeTitle,
  onClose,
}: AddEpisodeVideoModalProps) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("HD");
  const { mutate: addVideoLink, isPending } = useAddEpisodeVideoLink();

  const isValidUrl = videoUrl.trim().length > 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl) return;

    addVideoLink({
      tmdb_id: tmdbId,
      season_number: seasonNumber,
      episode_number: episodeNumber,
      video_url: videoUrl.trim(),
      video_title: `${showTitle} - S${seasonNumber}E${episodeNumber}`,
      quality,
    }, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <h2 className="font-bold">Add Episode Video</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{showTitle}</p>
          <p>Season {seasonNumber}, Episode {episodeNumber}: {episodeTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="videoUrl"
                placeholder="https://example.com/video or embed URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports YouTube, Vimeo, direct video links, or any embed URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Video Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4K">4K Ultra HD</SelectItem>
                <SelectItem value="HD">HD 1080p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="SD">SD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!isValidUrl || isPending}
            >
              {isPending ? "Adding..." : "Add Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEpisodeVideoModal;
