import { useQuery } from "@tanstack/react-query";
import { askEngageraJson, hasEngagera } from "@/lib/engagera";

interface MovieData {
  title: string;
  overview: string;
  genres: string[];
  release_year: string;
  rating: number;
  runtime?: number;
  cast?: string[];
}

interface InsightResponse {
  result: string | string[];
  type: string;
}

type InsightType = "insights" | "why-watch" | "mood" | "trivia";

const buildPrompt = (movie: MovieData, type: InsightType, watchlist?: MovieData[]): string => {
  const base = `Movie/Show: "${movie.title}" (${movie.release_year})
Genres: ${movie.genres.join(", ") || "n/a"}
Rating: ${movie.rating}/10
Overview: ${movie.overview?.slice(0, 500) || "n/a"}
${movie.cast?.length ? `Cast: ${movie.cast.join(", ")}` : ""}`;

  switch (type) {
    case "insights":
      return `${base}

Return JSON: {"result":["insight 1","insight 2","insight 3"],"type":"insights"}
Each insight is one short sentence highlighting themes, style, or notable elements.`;
    case "why-watch":
      return `${base}
${watchlist?.length ? `User's watchlist: ${watchlist.map(m => m.title).join(", ")}` : ""}

Return JSON: {"result":"one persuasive sentence explaining why to watch this","type":"why-watch"}`;
    case "mood":
      return `${base}

Return JSON: {"result":"one short poetic sentence describing the mood/vibe","type":"mood"}`;
    case "trivia":
      return `${base}

Return JSON: {"result":["fact 1","fact 2","fact 3"],"type":"trivia"} with interesting production trivia.`;
  }
};

const fetchInsight = async (
  movie: MovieData,
  type: InsightType,
  watchlist?: MovieData[]
): Promise<InsightResponse> => {
  if (!hasEngagera()) return { result: "", type };
  const prompt = buildPrompt(movie, type, watchlist);
  return askEngageraJson<InsightResponse>(prompt, { result: "", type });
};

export const useMovieInsights = (movie: MovieData | null, enabled = true) => {
  return useQuery({
    queryKey: ["engagera-movie-insights", movie?.title],
    queryFn: () => fetchInsight(movie!, "insights"),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

export const useWhyWatch = (movie: MovieData | null, watchlist: MovieData[] = [], enabled = true) => {
  return useQuery({
    queryKey: ["engagera-why-watch", movie?.title, watchlist.length],
    queryFn: () => fetchInsight(movie!, "why-watch", watchlist),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

export const useMovieMood = (movie: MovieData | null, enabled = true) => {
  return useQuery({
    queryKey: ["engagera-movie-mood", movie?.title],
    queryFn: () => fetchInsight(movie!, "mood"),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

export const useMovieTrivia = (movie: MovieData | null, enabled = true) => {
  return useQuery({
    queryKey: ["engagera-movie-trivia", movie?.title],
    queryFn: () => fetchInsight(movie!, "trivia"),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

export const toMovieData = (movie: any): MovieData => ({
  title: movie.title || movie.name || "",
  overview: movie.overview || "",
  genres: movie.genres?.map((g: any) => g.name) || [],
  release_year: (movie.release_date || movie.first_air_date || "").slice(0, 4),
  rating: movie.vote_average || 0,
  runtime: movie.runtime,
  cast: movie.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [],
});
