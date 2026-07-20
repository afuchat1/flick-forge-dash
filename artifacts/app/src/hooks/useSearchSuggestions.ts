import { useQuery } from "@tanstack/react-query";
import { askEngageraJson, hasEngagera } from "@/lib/engagera";

interface Suggestion {
  title: string;
  type: "movie" | "tv";
  year: string;
  reason: string;
}

export const useSearchSuggestions = (query: string, mood?: string | null) => {
  return useQuery({
    queryKey: ["engagera-search-suggestions", query, mood],
    queryFn: async () => {
      if (!query || query.length < 2 || !hasEngagera()) return { suggestions: [] as Suggestion[] };

      const moodLine = mood ? `The user is in a "${mood}" mood, so lean into titles that fit that feeling.\n` : "";
      const prompt = `${moodLine}A user is searching for movies or TV shows with the partial query: "${query}".
Return up to 5 popular, well-known matching titles as a JSON object of shape:
{"suggestions":[{"title":"...","type":"movie"|"tv","year":"YYYY","reason":"5-10 words why it matches"}]}`;

      const data = await askEngageraJson<{ suggestions: Suggestion[] }>(prompt, { suggestions: [] });
      return { suggestions: Array.isArray(data.suggestions) ? data.suggestions : [] };
    },
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
