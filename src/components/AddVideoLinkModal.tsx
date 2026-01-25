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
import { useAddVideoLink, extractYouTubeId } from "@/hooks/useVideoLinks";

interface AddVideoLinkModalProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  onClose: () => void;
}

const AddVideoLinkModal = ({ tmdbId, mediaType, title, onClose }: AddVideoLinkModalProps) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("HD");
  const { mutate: addVideoLink, isPending } = useAddVideoLink();

  const videoId = extractYouTubeId(videoUrl);
  const isValidUrl = !!videoId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl) return;

    addVideoLink({
      tmdb_id: tmdbId,
      media_type: mediaType,
      video_url: videoUrl,
      video_title: title,
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
            <h2 className="font-bold">Add Video Link</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Add a YouTube video link for "<span className="text-foreground font-medium">{title}</span>"
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube Video URL</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            {videoUrl && !isValidUrl && (
              <p className="text-xs text-destructive">Invalid YouTube URL</p>
            )}
            {isValidUrl && (
              <p className="text-xs text-primary">Valid YouTube video detected</p>
            )}
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

          {videoId && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video rounded-md overflow-hidden bg-muted">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

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

export default AddVideoLinkModal;
