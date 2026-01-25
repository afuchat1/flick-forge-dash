import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  added_at: string;
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });
      
      if (error) throw error;
      return data as WatchlistItem[];
    },
    enabled: !!user,
  });

  const addToWatchlist = useMutation({
    mutationFn: async (item: {
      tmdb_id: number;
      media_type: "movie" | "tv";
      title: string;
      poster_path?: string | null;
      vote_average?: number;
      release_date?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase.from("watchlist").insert({
        user_id: user.id,
        tmdb_id: item.tmdb_id,
        media_type: item.media_type,
        title: item.title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Added to My List");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.info("Already in your list");
      } else {
        toast.error("Failed to add to list");
      }
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (item: { tmdb_id: number; media_type: "movie" | "tv" }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("tmdb_id", item.tmdb_id)
        .eq("media_type", item.media_type);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Removed from My List");
    },
    onError: () => {
      toast.error("Failed to remove from list");
    },
  });

  const isInWatchlist = (tmdb_id: number, media_type: "movie" | "tv") => {
    return watchlist.some(
      (item) => item.tmdb_id === tmdb_id && item.media_type === media_type
    );
  };

  const toggleWatchlist = async (item: {
    tmdb_id: number;
    media_type: "movie" | "tv";
    title: string;
    poster_path?: string | null;
    vote_average?: number;
    release_date?: string;
  }) => {
    if (!user) {
      toast.error("Please sign in to add to your list");
      return;
    }

    if (isInWatchlist(item.tmdb_id, item.media_type)) {
      removeFromWatchlist.mutate({ tmdb_id: item.tmdb_id, media_type: item.media_type });
    } else {
      addToWatchlist.mutate(item);
    }
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist: addToWatchlist.mutate,
    removeFromWatchlist: removeFromWatchlist.mutate,
    isInWatchlist,
    toggleWatchlist,
  };
};
