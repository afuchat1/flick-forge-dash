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

// Add a new video link
export const useAddVideoLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: AddVideoLinkParams) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const videoId = extractYouTubeId(params.video_url);
      if (!videoId) throw new Error("Invalid YouTube URL");

      const { data, error } = await supabase
        .from("video_links")
        .upsert({
          tmdb_id: params.tmdb_id,
          media_type: params.media_type,
          video_url: videoId,
          video_title: params.video_title || null,
          quality: params.quality || "HD",
          added_by: user.user.id,
        }, {
          onConflict: "tmdb_id,media_type",
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
