import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

const fetchInsight = async (
  movie: MovieData,
  type: InsightType,
  watchlist?: MovieData[]
): Promise<InsightResponse> => {
  const { data, error } = await supabase.functions.invoke("movie-insights", {
    body: { movie, type, watchlist },
  });

  if (error) throw error;
  return data;
};

export const useMovieInsights = (movie: MovieData | null, enabled = true) => {
  return useQuery({
    queryKey: ["movie-insights", movie?.title],
    queryFn: () => fetchInsight(movie!, "insights"),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
    retry: 1,
  });
};

export const useWhyWatch = (movie: MovieData | null, watchlist: MovieData[] = [], enabled = true) => {
  return useQuery({
    queryKey: ["why-watch", movie?.title, watchlist.length],
    queryFn: () => fetchInsight(movie!, "why-watch", watchlist),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

export const useMovieMood = (movie: MovieData | null, enabled = true) => {
  return useQuery({
    queryKey: ["movie-mood", movie?.title],
    queryFn: () => fetchInsight(movie!, "mood"),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

export const useMovieTrivia = (movie: MovieData | null, enabled = true) => {
  return useQuery({
    queryKey: ["movie-trivia", movie?.title],
    queryFn: () => fetchInsight(movie!, "trivia"),
    enabled: enabled && !!movie,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
};

// Helper to convert TMDB movie data to our format
export const toMovieData = (movie: any): MovieData => ({
  title: movie.title || movie.name || "",
  overview: movie.overview || "",
  genres: movie.genres?.map((g: any) => g.name) || [],
  release_year: (movie.release_date || movie.first_air_date || "").slice(0, 4),
  rating: movie.vote_average || 0,
  runtime: movie.runtime,
  cast: movie.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [],
});
