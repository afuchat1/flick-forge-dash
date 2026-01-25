import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoLink {
  id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  video_url: string;
  video_title: string | null;
  is_full_movie: boolean;
  quality: string;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AddVideoLinkParams {
  tmdb_id: number;
  media_type: "movie" | "tv";
  video_url: string;
  video_title?: string;
  quality?: string;
}

// Extract YouTube video ID from various URL formats
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Check if URL is a YouTube URL
export const isYouTubeUrl = (url: string): boolean => {
  return /(?:youtube\.com|youtu\.be)/.test(url) || /^[a-zA-Z0-9_-]{11}$/.test(url);
};

// Get video embed URL for any video source
export const getVideoEmbedUrl = (url: string): { embedUrl: string; isYouTube: boolean } => {
  // YouTube
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return { 
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`, 
      isYouTube: true 
    };
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { 
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`, 
      isYouTube: false 
    };
  }
  
  // Dailymotion
  const dailymotionMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
  if (dailymotionMatch) {
    return { 
      embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}?autoplay=1`, 
      isYouTube: false 
    };
  }
  
  // Already an embed URL or direct link
  if (url.includes('/embed/') || url.includes('player.')) {
    return { embedUrl: url, isYouTube: false };
  }
  
  // Return as-is for other URLs
  return { embedUrl: url, isYouTube: false };
};

// Fetch video link for a specific movie/show
export const useVideoLink = (tmdbId: number, mediaType: "movie" | "tv") => {
  return useQuery({
    queryKey: ["videoLink", tmdbId, mediaType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_links")
        .select("*")
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .maybeSingle();

      if (error) throw error;
      return data as VideoLink | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch all video links (for admin panel)
export const useAllVideoLinks = () => {
  return useQuery({
    queryKey: ["videoLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_links")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as VideoLink[];
    },
  });
};

// Add a new video link (supports any URL)
export const useAddVideoLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: AddVideoLinkParams) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const videoUrl = params.video_url.trim();
      if (!videoUrl || videoUrl.length < 10) throw new Error("Invalid video URL");

      const { data, error } = await supabase
        .from("video_links")
        .upsert({
          tmdb_id: params.tmdb_id,
          media_type: params.media_type,
          video_url: videoUrl,
          video_title: params.video_title || null,
          quality: params.quality || "HD",
          added_by: user.user.id,
        }, {
          onConflict: "tmdb_id,media_type,season_number,episode_number",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["videoLinks"] });
      queryClient.invalidateQueries({ queryKey: ["videoLink", data.tmdb_id, data.media_type] });
      toast.success("Video link added successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add video link");
    },
  });
};

// Delete a video link
export const useDeleteVideoLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("video_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videoLinks"] });
      toast.success("Video link removed");
    },
    onError: () => {
      toast.error("Failed to remove video link");
    },
  });
};
