import { useQuery } from "@tanstack/react-query";
import { askEngageraJson, hasEngagera } from "@/lib/engagera";

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
    queryKey: ["engagera-content-matcher", params?.title],
    queryFn: async () => {
      if (!params?.title || !hasEngagera()) return { matches: [] as ContentMatch[] };

      const prompt = `Suggest 6 movies or TV shows similar to "${params.title}"${
        params.type ? ` (${params.type})` : ""
      }.
Genres: ${params.genres?.join(", ") || "unknown"}
Overview: ${params.overview?.slice(0, 400) || "n/a"}

Return JSON of shape:
{"matches":[{"title":"...","type":"movie"|"tv","matchScore":0-100,"reason":"one sentence","sharedThemes":["theme1","theme2"]}]}`;

      const data = await askEngageraJson<{ matches: ContentMatch[] }>(prompt, { matches: [] });
      return { matches: Array.isArray(data.matches) ? data.matches : [] };
    },
    enabled: !!params?.title,
    staleTime: 10 * 60 * 1000,
  });
};
