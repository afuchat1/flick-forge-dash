import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface RecentlyViewedItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number | null;
  viewed_at: string;
}

export const useRecentlyViewed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: recentlyViewed = [], isLoading } = useQuery({
    queryKey: ["recently-viewed", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("recently_viewed")
        .select("*")
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as RecentlyViewedItem[];
    },
    enabled: !!user,
  });

  const addToRecentlyViewed = useMutation({
    mutationFn: async (item: {
      tmdb_id: number;
      media_type: "movie" | "tv";
      title: string;
      poster_path?: string | null;
      vote_average?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      // Upsert - update viewed_at if already exists
      const { error } = await supabase
        .from("recently_viewed")
        .upsert({
          user_id: user.id,
          tmdb_id: item.tmdb_id,
          media_type: item.media_type,
          title: item.title,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          viewed_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,tmdb_id,media_type",
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed"] });
    },
  });

  return {
    recentlyViewed,
    isLoading,
    addToRecentlyViewed: addToRecentlyViewed.mutate,
  };
};
