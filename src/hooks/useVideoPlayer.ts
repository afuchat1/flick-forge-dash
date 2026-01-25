import { useState, useCallback } from "react";

interface VideoInfo {
  key: string;
  title: string;
}

export const useVideoPlayer = () => {
  const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);

  const playVideo = useCallback((key: string, title: string) => {
    setCurrentVideo({ key, title });
  }, []);

  const closeVideo = useCallback(() => {
    setCurrentVideo(null);
  }, []);

  return {
    currentVideo,
    playVideo,
    closeVideo,
    isPlaying: !!currentVideo,
  };
};
