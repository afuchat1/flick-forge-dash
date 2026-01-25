import { X, Maximize2, Minimize2, Volume2, VolumeX, PictureInPicture2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getVideoEmbedUrl, extractYouTubeId } from "@/hooks/useVideoLinks";

interface VideoPlayerProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

const VideoPlayer = ({ videoKey, title, onClose }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get embed URL and check if it's YouTube (for mute control)
  const { embedUrl: baseEmbedUrl, isYouTube } = getVideoEmbedUrl(videoKey);
  const embedUrl = isYouTube 
    ? `${baseEmbedUrl}&mute=${isMuted ? 1 : 0}&enablejsapi=1`
    : baseEmbedUrl;

  // For thumbnails, try to extract YouTube ID
  const youtubeId = extractYouTubeId(videoKey);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isPiP) {
          setIsPiP(false);
        } else if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, isPiP]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      setIsPiP(false);
      await containerRef.current.requestFullscreen();
    }
  };

  const togglePiP = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    }
    setIsPiP(!isPiP);
  };

  // PiP mode - floating mini player
  if (isPiP) {
    return (
      <div 
        className="fixed bottom-20 right-4 z-50 w-80 md:w-96 shadow-2xl rounded-lg overflow-hidden border border-border bg-card animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-center justify-between p-2 bg-background/95">
          <span className="text-xs font-medium truncate flex-1 mr-2">{title}</span>
          <div className="flex items-center gap-1">
            {isYouTube && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={togglePiP}
              title="Exit Picture-in-Picture"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="aspect-video bg-black">
          <iframe
            key={`${videoKey}-${isMuted}-pip`}
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full",
          isFullscreen ? "h-full" : "max-w-5xl mx-4"
        )}
      >
        <div className={cn(
          "flex items-center justify-between mb-3",
          isFullscreen && "absolute top-4 left-4 right-4 z-10"
        )}>
          <h2 className={cn(
            "font-bold truncate",
            isFullscreen ? "text-xl text-white drop-shadow-lg" : "text-lg"
          )}>
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {isYouTube && (
              <Button
                size="sm"
                variant="ghost"
                className={cn("h-8 w-8 p-0", isFullscreen && "bg-black/50 hover:bg-black/70")}
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8 w-8 p-0", isFullscreen && "bg-black/50 hover:bg-black/70")}
              onClick={togglePiP}
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8 w-8 p-0", isFullscreen && "bg-black/50 hover:bg-black/70")}
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8 w-8 p-0", isFullscreen && "bg-black/50 hover:bg-black/70")}
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={cn(
          "relative bg-black rounded-lg overflow-hidden",
          isFullscreen ? "h-full" : "aspect-video"
        )}>
          <iframe
            key={`${videoKey}-${isMuted}`}
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {!isFullscreen && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">ESC</kbd> to close • 
            Click <PictureInPicture2 className="h-3 w-3 inline mx-1" /> to browse while watching
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
