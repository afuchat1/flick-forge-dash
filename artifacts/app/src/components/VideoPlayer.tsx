import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
}

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface VideoPlayerProps {
  videoId: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onEnded?: () => void;
}

const VideoPlayer = ({ videoId, title, subtitle, onBack, onEnded }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerElRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const isPlayingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize the YouTube player
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(false);
    loadYouTubeApi().then(() => {
      if (cancelled || !playerElRef.current) return;
      playerRef.current = new window.YT.Player(playerElRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            if (cancelled) return;
            setReady(true);
            setDuration(e.target.getDuration());
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            if (cancelled) return;
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              onEnded?.();
            }
          },
          onError: () => !cancelled && setError(true),
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Poll playback progress (YouTube API has no continuous timeupdate event)
  useEffect(() => {
    if (!ready) return;
    pollRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        setCurrentTime(p.getCurrentTime());
        const d = p.getDuration();
        if (d) setDuration(d);
      } catch {
        /* player may be mid-teardown */
      }
    }, 400);
    return () => clearInterval(pollRef.current);
  }, [ready]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimerRef.current);
  }, [isPlaying, resetHideTimer]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlayingRef.current) p.pauseVideo();
    else p.playVideo();
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    setIsMuted((prev) => {
      if (prev) p.unMute();
      else p.mute();
      return !prev;
    });
  }, []);

  const handleVolumeChange = (v: number) => {
    const p = playerRef.current;
    setVolume(v);
    if (!p) return;
    p.setVolume(v);
    if (v === 0) {
      p.mute();
      setIsMuted(true);
    } else if (isMuted) {
      p.unMute();
      setIsMuted(false);
    }
  };

  const seekTo = (time: number) => {
    const clamped = Math.min(Math.max(time, 0), duration || time);
    playerRef.current?.seekTo(clamped, true);
    setCurrentTime(clamped);
  };

  const skip = useCallback(
    (delta: number) => {
      const p = playerRef.current;
      if (!p) return;
      const t = Math.min(Math.max(p.getCurrentTime() + delta, 0), duration);
      seekTo(t);
    },
    [duration]
  );

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          skip(10);
          break;
        case "ArrowLeft":
          skip(-10);
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          if (!document.fullscreenElement) onBack?.();
          break;
        default:
          return;
      }
      resetHideTimer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay, toggleMute, toggleFullscreen, skip, onBack, resetHideTimer]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden select-none touch-manipulation"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      <div ref={playerElRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Tap/click anywhere toggles play */}
      <button
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full"
        tabIndex={-1}
      />

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none">
          <div className="h-10 w-10 border-2 border-white/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black text-white px-6 text-center">
          <p className="text-sm text-white/70">This video can't be played right now.</p>
          {onBack && (
            <button onClick={onBack} className="text-primary text-sm font-semibold underline underline-offset-2">
              Go back
            </button>
          )}
        </div>
      )}

      {/* Top bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 px-3 py-3 md:px-6 md:py-5 bg-gradient-to-b from-black/85 to-transparent transition-opacity duration-300 flex items-center gap-3 pointer-events-none",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="text-white p-2 -ml-1 rounded-full hover:bg-white/10 active:scale-95 transition-all touch-manipulation pointer-events-auto"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm md:text-base truncate">{title}</p>
          {subtitle && <p className="text-white/60 text-xs truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 px-3 pb-4 pt-10 md:px-6 md:pb-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Progress bar */}
        <div
          className="group relative h-1.5 md:h-1.5 w-full bg-white/25 rounded-full cursor-pointer mb-3 touch-manipulation"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seekTo(ratio * duration);
          }}
        >
          <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${progress}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-primary shadow scale-100 md:scale-0 md:group-hover:scale-100 transition-transform"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 md:gap-3 min-w-0">
            <button
              onClick={togglePlay}
              className="text-white p-1.5 touch-manipulation active:scale-90 transition-transform"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 md:h-5 md:w-5" fill="currentColor" />
              ) : (
                <Play className="h-6 w-6 md:h-5 md:w-5" fill="currentColor" />
              )}
            </button>
            <button
              onClick={() => skip(-10)}
              className="text-white p-1.5 touch-manipulation hidden sm:block active:scale-90 transition-transform"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={() => skip(10)}
              className="text-white p-1.5 touch-manipulation hidden sm:block active:scale-90 transition-transform"
              aria-label="Forward 10 seconds"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMute}
              className="text-white p-1.5 touch-manipulation active:scale-90 transition-transform"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-16 md:w-20 accent-primary hidden sm:block"
              aria-label="Volume"
            />
            <span className="text-white/80 text-[11px] md:text-sm tabular-nums ml-1 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-white p-1.5 touch-manipulation active:scale-90 transition-transform"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
