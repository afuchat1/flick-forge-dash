import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContentMatch {
  title: string;
  type: "movie" | "tv";
  matchScore: number;
  reason: string;
  sharedThemes: string[];
}

interface ContentMatcherParams {
  title: string;
  type?: string;
  genres?: string[];
  overview?: string;
}

export const useContentMatcher = (params: ContentMatcherParams | null) => {
  return useQuery({
    queryKey: ["content-matcher", params?.title],
    queryFn: async () => {
      if (!params?.title) return { matches: [] };
      
      const { data, error } = await supabase.functions.invoke("content-matcher", {
        body: params,
      });
      
      if (error) {
        console.error("Content matcher error:", error);
        return { matches: [] };
      }
      
      return data as { matches: ContentMatch[] };
    },
    enabled: !!params?.title,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
