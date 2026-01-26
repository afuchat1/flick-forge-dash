import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface DownloadItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  status: "queued" | "downloading" | "completed" | "failed";
  progress: number;
  downloaded_at: string;
}

// Helper to check if URL is a direct video file
const isDirectVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('video') ||
         lowerUrl.includes('download');
};

// Helper to check if URL is from a streaming platform (can't be downloaded)
const isStreamingPlatform = (url: string): boolean => {
  const platforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
  return platforms.some(platform => url.toLowerCase().includes(platform));
};

// Trigger browser download for a file
const downloadFile = async (
  url: string, 
  filename: string, 
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  try {
    // For streaming platforms, we can't download
    if (isStreamingPlatform(url)) {
      throw new Error("Cannot download from streaming platforms. Try a direct video link.");
    }

    // Try to fetch with progress tracking
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'video/*,*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    // If we have content length, track progress
    if (total && response.body) {
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        
        if (onProgress && total) {
          onProgress(Math.round((received / total) * 100));
        }
      }

      const blob = new Blob(chunks as BlobPart[]);
      triggerDownload(blob, filename);
    } else {
      // Fallback for when we can't stream
      const blob = await response.blob();
      onProgress?.(100);
      triggerDownload(blob, filename);
    }

    return true;
  } catch (error) {
    console.error('Download error:', error);
    
    // Fallback: Try to open in new tab for download
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch {
      throw error;
    }
  }
};

// Create download link and trigger click
const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Sanitize filename for download
const sanitizeFilename = (title: string, extension: string = 'mp4'): string => {
  return title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100) + '.' + extension;
};

export const useDownloads = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ["downloads", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("downloads")
        .select("*")
        .eq("user_id", user.id)
        .order("downloaded_at", { ascending: false });
      
      if (error) throw error;
      return data as DownloadItem[];
    },
    enabled: !!user,
  });

  const startDownload = useMutation({
    mutationFn: async (item: {
      tmdb_id: number;
      media_type: "movie" | "tv";
      title: string;
      poster_path?: string | null;
      vote_average?: number;
      release_date?: string;
      video_url?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const filename = sanitizeFilename(item.title);
      let downloadSuccess = false;
      let videoUrl = item.video_url;

      // If no video URL provided, try to fetch from video_links
      if (!videoUrl) {
        const { data: videoLink } = await supabase
          .from("video_links")
          .select("video_url")
          .eq("tmdb_id", item.tmdb_id)
          .eq("media_type", item.media_type)
          .maybeSingle();
        
        videoUrl = videoLink?.video_url;
      }

      // Check if we have a downloadable video URL
      if (videoUrl) {
        if (isStreamingPlatform(videoUrl)) {
          toast.error("Cannot download streaming videos", {
            description: "Videos from YouTube, Vimeo, etc. cannot be downloaded directly.",
          });
          throw new Error("Streaming platform videos cannot be downloaded");
        }

        // Show initial toast
        const toastId = toast.loading(`Downloading "${item.title}"...`, {
          description: "Starting download...",
        });

        try {
          // Attempt real download
          downloadSuccess = await downloadFile(videoUrl, filename, (progress) => {
            toast.loading(`Downloading "${item.title}"...`, {
              id: toastId,
              description: `${progress}% complete`,
            });
          });

          toast.success(`Downloaded "${item.title}"`, {
            id: toastId,
            description: "File saved to your downloads folder",
          });
        } catch (downloadError) {
          toast.error("Download failed", {
            id: toastId,
            description: "Could not download the video file",
          });
          throw downloadError;
        }
      } else {
        toast.error("No video available", {
          description: "This content doesn't have a downloadable video link.",
        });
        throw new Error("No video URL available for download");
      }

      // Only save to database if download was successful
      if (downloadSuccess) {
        const { error } = await supabase.from("downloads").insert({
          user_id: user.id,
          tmdb_id: item.tmdb_id,
          media_type: item.media_type,
          title: item.title,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          release_date: item.release_date,
          status: "completed",
          progress: 100,
        });
        
        if (error && error.code !== "23505") throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downloads"] });
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.info("Already downloaded");
      }
      console.error("Download error:", error);
    },
  });

  const removeDownload = useMutation({
    mutationFn: async (item: { tmdb_id: number; media_type: "movie" | "tv" }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("downloads")
        .delete()
        .eq("user_id", user.id)
        .eq("tmdb_id", item.tmdb_id)
        .eq("media_type", item.media_type);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downloads"] });
      toast.success("Removed from Downloads");
    },
    onError: () => {
      toast.error("Failed to remove download");
    },
  });

  const isDownloaded = (tmdb_id: number, media_type: "movie" | "tv") => {
    return downloads.some(
      (item) => item.tmdb_id === tmdb_id && item.media_type === media_type && item.status === "completed"
    );
  };

  return {
    downloads,
    isLoading,
    startDownload: startDownload.mutate,
    isDownloading: startDownload.isPending,
    removeDownload: removeDownload.mutate,
    isDownloaded,
  };
};
