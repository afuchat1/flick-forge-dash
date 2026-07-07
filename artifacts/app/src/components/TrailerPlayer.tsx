import { useState, useRef } from "react";
import { Play, X, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TrailerPlayerProps {
  trailerKey: string;
  title: string;
  /** If provided, renders a full inline player instead of a trigger button */
  inline?: boolean;
}

const TrailerPlayer = ({ trailerKey, title, inline = false }: TrailerPlayerProps) => {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&color=red&controls=1`;

  if (inline) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl relative group">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1&iv_load_policy=3&color=red&controls=1`}
          title={`${title} — Official Trailer`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
        {/* AfuChat branding overlay (bottom-left, fades on hover) */}
        <div className="absolute bottom-2 left-3 pointer-events-none opacity-60 group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-[10px] text-white font-bold tracking-widest uppercase">AfuChat Movies</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger button */}
      <Button
        size="sm"
        className="h-9 px-4 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        onClick={() => setOpen(true)}
      >
        <Play className="h-4 w-4 fill-current" />
        Watch Trailer
      </Button>

      {/* Full-screen modal player */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 border-0 bg-black rounded-2xl overflow-hidden shadow-2xl">
          {/* Custom header bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-primary font-extrabold text-sm tracking-wide">AfuChat</span>
              <span className="text-white font-light text-sm">Movies</span>
              <span className="mx-1 text-white/20">·</span>
              <span className="text-white/60 text-xs truncate max-w-[200px] md:max-w-xs">{title}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Player */}
          <div className="aspect-video w-full bg-black">
            {open && (
              <iframe
                src={embedUrl}
                title={`${title} — Official Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-black/90 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/40 text-[11px]">Official Trailer · AfuChat Movies</span>
            <button
              onClick={() => iframeRef.current?.requestFullscreen?.()}
              className="text-white/40 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrailerPlayer;
