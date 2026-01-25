import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMovieDetails, useTVDetails } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const PlayerPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isTV = type === "tv";
  const { data: movieData, isLoading: movieLoading } = useMovieDetails(isTV ? 0 : Number(id));
  const { data: tvData, isLoading: tvLoading } = useTVDetails(isTV ? Number(id) : 0);
  
  const data = isTV ? tvData : movieData;
  const isLoading = isTV ? tvLoading : movieLoading;
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const trailer = data?.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );
  const title = data?.title || data?.name || "Loading...";

  useEffect(() => {
    const hideControls = () => {
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };
    
    hideControls();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!trailer) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
        <p className="text-lg mb-4">No trailer available for {title}</p>
        <Button onClick={handleBack} variant="secondary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black" 
      onMouseMove={handleMouseMove}
      onClick={() => setShowControls(true)}
    >
      {/* Video Player */}
      <div className="absolute inset-0">
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&mute=${isMuted ? 1 : 0}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg line-clamp-1">{title}</h1>
            <p className="text-white/70 text-sm">Trailer</p>
          </div>
        </div>

        {/* Center Controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <button className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <SkipBack className="h-6 w-6 text-white" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" fill="white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            )}
          </button>
          <button className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <SkipForward className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <span className="text-white text-sm">0:00 / {data?.runtime || 0}:00</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-white">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
