import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EpisodeVideoLink {
  id: string;
  tmdb_id: number;
  media_type: "tv";
  video_url: string;
  video_title: string | null;
  is_full_movie: boolean;
  quality: string;
  added_by: string | null;
  season_number: number;
  episode_number: number;
  created_at: string;
  updated_at: string;
}

interface AddEpisodeVideoLinkParams {
  tmdb_id: number;
  season_number: number;
  episode_number: number;
  video_url: string;
  video_title?: string;
  quality?: string;
}

// Fetch video link for a specific episode
export const useEpisodeVideoLink = (
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  return useQuery({
    queryKey: ["episodeVideoLink", tmdbId, seasonNumber, episodeNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_links")
        .select("*")
        .eq("tmdb_id", tmdbId)
        .eq("media_type", "tv")
        .eq("season_number", seasonNumber)
        .eq("episode_number", episodeNumber)
        .maybeSingle();

      if (error) throw error;
      return data as EpisodeVideoLink | null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch all episode video links for a TV show
export const useShowEpisodeLinks = (tmdbId: number) => {
  return useQuery({
    queryKey: ["showEpisodeLinks", tmdbId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_links")
        .select("*")
        .eq("tmdb_id", tmdbId)
        .eq("media_type", "tv")
        .not("season_number", "is", null)
        .not("episode_number", "is", null)
        .order("season_number", { ascending: true })
        .order("episode_number", { ascending: true });

      if (error) throw error;
      return data as EpisodeVideoLink[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Add episode video link
export const useAddEpisodeVideoLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddEpisodeVideoLinkParams) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("video_links")
        .upsert({
          tmdb_id: params.tmdb_id,
          media_type: "tv",
          video_url: params.video_url.trim(),
          video_title: params.video_title || null,
          quality: params.quality || "HD",
          season_number: params.season_number,
          episode_number: params.episode_number,
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
      queryClient.invalidateQueries({ queryKey: ["showEpisodeLinks", data.tmdb_id] });
      queryClient.invalidateQueries({ 
        queryKey: ["episodeVideoLink", data.tmdb_id, data.season_number, data.episode_number] 
      });
      toast.success("Episode video link added!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add episode video link");
    },
  });
};

// Check if episode has video available
export const hasEpisodeVideo = (
  episodeLinks: EpisodeVideoLink[] | undefined,
  seasonNumber: number,
  episodeNumber: number
): EpisodeVideoLink | undefined => {
  return episodeLinks?.find(
    (link) => 
      link.season_number === seasonNumber && 
      link.episode_number === episodeNumber
  );
};
