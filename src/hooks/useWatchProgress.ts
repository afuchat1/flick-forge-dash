import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WatchProgress {
  id: string;
  tmdb_id: number;
  media_type: string;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  progress_seconds: number;
  duration_seconds: number;
  season_number: number | null;
  episode_number: number | null;
  episode_title: string | null;
  video_url: string | null;
  updated_at: string;
}

export const useWatchProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchProgress = [], isLoading } = useQuery({
    queryKey: ["watch-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("watch_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as WatchProgress[];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (params: {
      tmdb_id: number;
      media_type: string;
      title: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      progress_seconds: number;
      duration_seconds: number;
      season_number?: number | null;
      episode_number?: number | null;
      episode_title?: string | null;
      video_url?: string | null;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("watch_progress")
        .upsert({
          user_id: user.id,
          tmdb_id: params.tmdb_id,
          media_type: params.media_type,
          title: params.title,
          poster_path: params.poster_path,
          backdrop_path: params.backdrop_path,
          progress_seconds: params.progress_seconds,
          duration_seconds: params.duration_seconds,
          season_number: params.season_number,
          episode_number: params.episode_number,
          episode_title: params.episode_title,
          video_url: params.video_url,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,tmdb_id,media_type,season_number,episode_number",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watch-progress"] });
    },
  });

  const removeProgressMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("watch_progress")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watch-progress"] });
    },
  });

  const getProgress = (tmdb_id: number, media_type: string, season?: number, episode?: number) => {
    return watchProgress.find(
      (p) => 
        p.tmdb_id === tmdb_id && 
        p.media_type === media_type &&
        p.season_number === (season ?? null) &&
        p.episode_number === (episode ?? null)
    );
  };

  // Filter to show only items with meaningful progress (>5% and <95%)
  const continueWatching = watchProgress.filter((p) => {
    if (p.duration_seconds === 0) return false;
    const percentage = (p.progress_seconds / p.duration_seconds) * 100;
    return percentage > 5 && percentage < 95;
  });

  return {
    watchProgress,
    continueWatching,
    isLoading,
    updateProgress: updateProgressMutation.mutate,
    removeProgress: removeProgressMutation.mutate,
    getProgress,
  };
};
