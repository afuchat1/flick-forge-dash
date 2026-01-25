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
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      // Simulate download - in real app this would download actual content
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
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["downloads"] });
      toast.success(`Downloaded "${variables.title}"`, {
        description: "Available offline in Downloads",
      });
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.info("Already downloaded");
      } else {
        toast.error("Download failed");
      }
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
    removeDownload: removeDownload.mutate,
    isDownloaded,
  };
};
