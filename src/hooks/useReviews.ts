import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Review {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: string;
  rating: number;
  content: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export const useReviews = (tmdbId: number, mediaType: "movie" | "tv") => {
  return useQuery<Review[]>({
    queryKey: ["reviews", tmdbId, mediaType],
    queryFn: async () => {
      // First get reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      
      // Then get profiles for each review
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      return reviewsData.map(review => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || { username: null, avatar_url: null }
      })) as Review[];
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserReview = (tmdbId: number, mediaType: "movie" | "tv") => {
  const { user } = useAuth();
  
  return useQuery<Review | null>({
    queryKey: ["reviews", "user", tmdbId, mediaType, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      tmdbId,
      mediaType,
      rating,
      content,
    }: {
      tmdbId: number;
      mediaType: "movie" | "tv";
      rating: number;
      content: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: user.id,
            tmdb_id: tmdbId,
            media_type: mediaType,
            rating,
            content,
          },
          { onConflict: "user_id,tmdb_id,media_type" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.tmdbId, variables.mediaType] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "user", variables.tmdbId, variables.mediaType] });
      toast.success("Review submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit review: " + error.message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      tmdbId,
      mediaType,
    }: {
      tmdbId: number;
      mediaType: "movie" | "tv";
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.tmdbId, variables.mediaType] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "user", variables.tmdbId, variables.mediaType] });
      toast.success("Review deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete review: " + error.message);
    },
  });
};
