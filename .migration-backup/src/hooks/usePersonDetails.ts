import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
}

export interface PersonCredits {
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export interface PersonCastCredit {
  id: number;
  title?: string;
  name?: string;
  character: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  popularity: number;
}

export interface PersonCrewCredit {
  id: number;
  title?: string;
  name?: string;
  job: string;
  department: string;
  poster_path: string | null;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export const getPersonImageUrl = (path: string | null, size: "w185" | "w342" | "w500" | "h632" | "original" = "w342") => {
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

export const usePersonDetails = (personId: number) => {
  return useQuery<PersonDetails>({
    queryKey: ["tmdb", "person", personId],
    queryFn: () => fetchTMDB(`/person/${personId}`),
    enabled: !!personId,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePersonCredits = (personId: number) => {
  return useQuery<PersonCredits>({
    queryKey: ["tmdb", "person", personId, "credits"],
    queryFn: () => fetchTMDB(`/person/${personId}/combined_credits`),
    enabled: !!personId,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePersonImages = (personId: number) => {
  return useQuery({
    queryKey: ["tmdb", "person", personId, "images"],
    queryFn: () => fetchTMDB(`/person/${personId}/images`),
    enabled: !!personId,
    staleTime: 10 * 60 * 1000,
  });
};
