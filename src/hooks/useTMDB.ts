import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}

export interface TMDBResponse {
  results: TMDBMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const getImageUrl = (path: string | null, size: "w185" | "w342" | "w500" | "w780" | "original" = "w342") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const fetchTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const { data, error } = await supabase.functions.invoke("tmdb", {
    body: { endpoint, params },
  });

  if (error) throw error;
  return data;
};

export const useTrending = (mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week") => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "trending", mediaType, timeWindow],
    queryFn: () => fetchTMDB(`/trending/${mediaType}/${timeWindow}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularMovies = (page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "popular", page],
    queryFn: () => fetchTMDB("/movie/popular", { page: String(page) }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedMovies = (page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "top_rated", page],
    queryFn: () => fetchTMDB("/movie/top_rated", { page: String(page) }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNowPlayingMovies = (page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "now_playing", page],
    queryFn: () => fetchTMDB("/movie/now_playing", { page: String(page) }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingMovies = (page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "upcoming", page],
    queryFn: () => fetchTMDB("/movie/upcoming", { page: String(page) }),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularTV = (page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "tv", "popular", page],
    queryFn: () => fetchTMDB("/tv/popular", { page: String(page) }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedTV = (page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "tv", "top_rated", page],
    queryFn: () => fetchTMDB("/tv/top_rated", { page: String(page) }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ["tmdb", "movie", movieId],
    queryFn: () => fetchTMDB(`/movie/${movieId}`, { append_to_response: "credits,videos,similar,reviews,watch/providers" }),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useMovieProviders = (movieId: number) => {
  return useQuery({
    queryKey: ["tmdb", "movie", movieId, "providers"],
    queryFn: () => fetchTMDB(`/movie/${movieId}/watch/providers`),
    enabled: !!movieId,
    staleTime: 60 * 60 * 1000,
  });
};

export const useTVDetails = (tvId: number) => {
  return useQuery({
    queryKey: ["tmdb", "tv", tvId],
    queryFn: () => fetchTMDB(`/tv/${tvId}`, { append_to_response: "credits,videos,similar,reviews,watch/providers" }),
    enabled: !!tvId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTVSeason = (tvId: number, seasonNumber: number) => {
  return useQuery({
    queryKey: ["tmdb", "tv", tvId, "season", seasonNumber],
    queryFn: () => fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`),
    enabled: !!tvId && seasonNumber >= 0,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTVProviders = (tvId: number) => {
  return useQuery({
    queryKey: ["tmdb", "tv", tvId, "providers"],
    queryFn: () => fetchTMDB(`/tv/${tvId}/watch/providers`),
    enabled: !!tvId,
    staleTime: 60 * 60 * 1000,
  });
};

export const useSearch = (query: string, page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "search", query, page],
    queryFn: () => fetchTMDB("/search/multi", { query, page: String(page) }),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
};

export const useInfiniteSearch = (query: string) => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "search", "infinite", query],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/search/multi", { query, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMoviesByGenre = (genreId: number, page = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["tmdb", "discover", "movie", genreId, page],
    queryFn: () => fetchTMDB("/discover/movie", { with_genres: String(genreId), page: String(page) }),
    enabled: !!genreId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteMoviesByGenre = (genreId: number) => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "discover", "movie", "infinite", genreId],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/discover/movie", { with_genres: String(genreId), page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 20) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!genreId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfinitePopularMovies = () => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "popular", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/movie/popular", { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteTopRatedMovies = () => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "top_rated", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/movie/top_rated", { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteNowPlayingMovies = () => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "now_playing", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/movie/now_playing", { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteUpcomingMovies = () => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "movies", "upcoming", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/movie/upcoming", { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfinitePopularTV = () => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "tv", "popular", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/tv/popular", { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteTopRatedTV = () => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "tv", "top_rated", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchTMDB("/tv/top_rated", { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteTrending = (mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week") => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "trending", "infinite", mediaType, timeWindow],
    queryFn: ({ pageParam = 1 }) => fetchTMDB(`/trending/${mediaType}/${timeWindow}`, { page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteDiscover = (type: "movie" | "tv", sortBy: string = "popularity.desc") => {
  return useInfiniteQuery<TMDBResponse>({
    queryKey: ["tmdb", "discover", "infinite", type, sortBy],
    queryFn: ({ pageParam = 1 }) => fetchTMDB(`/discover/${type}`, { 
      page: String(pageParam),
      sort_by: sortBy 
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGenres = () => {
  return useQuery({
    queryKey: ["tmdb", "genres"],
    queryFn: async () => {
      const [movieGenres, tvGenres] = await Promise.all([
        fetchTMDB("/genre/movie/list"),
        fetchTMDB("/genre/tv/list"),
      ]);
      const allGenres = [...movieGenres.genres, ...tvGenres.genres];
      const uniqueGenres = allGenres.filter((g, i, arr) => arr.findIndex(x => x.id === g.id) === i);
      return uniqueGenres;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};
