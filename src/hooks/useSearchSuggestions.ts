import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Suggestion {
  title: string;
  type: "movie" | "tv";
  year: string;
  reason: string;
}

export const useSearchSuggestions = (query: string, mood?: string | null) => {
  return useQuery({
    queryKey: ["search-suggestions", query, mood],
    queryFn: async () => {
      if (!query || query.length < 2) return { suggestions: [] };
      
      const { data, error } = await supabase.functions.invoke("search-suggestions", {
        body: { query, mood },
      });
      
      if (error) {
        console.error("Search suggestions error:", error);
        return { suggestions: [] };
      }
      
      return data as { suggestions: Suggestion[] };
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
