import { useQuery } from "@tanstack/react-query";
import { askEngageraJson, hasEngagera } from "@/lib/engagera";

export type VerdictLabel =
  | "Must watch"
  | "Worth your time"
  | "Worth a rental"
  | "Wait for streaming"
  | "Skip it";

export interface WatchVerdict {
  verdict: VerdictLabel | string;
  score: number;
  one_liner: string;
  value_for_money: string;
  best_way_to_watch: string;
  watch_if: string[];
  skip_if: string[];
  strengths: string[];
  weaknesses: string[];
  content_notes: string[];
  time_commitment: string;
}

const EMPTY: WatchVerdict = {
  verdict: "",
  score: 0,
  one_liner: "",
  value_for_money: "",
  best_way_to_watch: "",
  watch_if: [],
  skip_if: [],
  strengths: [],
  weaknesses: [],
  content_notes: [],
  time_commitment: "",
};

export interface VerdictInput {
  title: string;
  type: "movie" | "tv";
  year?: string;
  genres?: string[];
  overview?: string;
  rating?: number;
  voteCount?: number;
  runtime?: number;
  seasons?: number;
  episodes?: number;
  cast?: string[];
  director?: string;
  certification?: string;
  budget?: number;
  revenue?: number;
}

const asArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).slice(0, 4) : [];

export const useWatchVerdict = (input: VerdictInput | null) => {
  return useQuery({
    queryKey: ["engagera-watch-verdict", input?.type, input?.title, input?.year],
    enabled: !!input?.title && hasEngagera(),
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
    queryFn: async (): Promise<WatchVerdict> => {
      if (!input) return EMPTY;

      const facts = [
        `Title: "${input.title}" (${input.year || "year unknown"}) — ${input.type === "tv" ? "TV series" : "film"}`,
        input.genres?.length ? `Genres: ${input.genres.join(", ")}` : "",
        input.director ? `Director: ${input.director}` : "",
        input.cast?.length ? `Cast: ${input.cast.join(", ")}` : "",
        input.rating ? `Audience score: ${input.rating.toFixed(1)}/10 from ${input.voteCount ?? 0} votes` : "",
        input.runtime ? `Runtime: ${input.runtime} minutes` : "",
        input.seasons ? `Seasons: ${input.seasons}, Episodes: ${input.episodes ?? "?"}` : "",
        input.certification ? `Certification: ${input.certification}` : "",
        input.budget ? `Budget: $${input.budget.toLocaleString()}` : "",
        input.revenue ? `Box office: $${input.revenue.toLocaleString()}` : "",
        input.overview ? `Synopsis: ${input.overview.slice(0, 700)}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const prompt = `You are a blunt, trustworthy film & TV critic advising a viewer who is deciding whether to spend money and time on this title. Be honest — recommend skipping when it is not worth it.

${facts}

Judge value for money (ticket price, rental, subscription or waiting), and value for time.

Return ONLY JSON of exactly this shape:
{
 "verdict": "Must watch" | "Worth your time" | "Worth a rental" | "Wait for streaming" | "Skip it",
 "score": 0-100 (how worth it),
 "one_liner": "one sharp sentence on whether to watch it and why",
 "value_for_money": "one sentence: is it worth paying for, and how much",
 "best_way_to_watch": "e.g. Cinema / Big screen at home / Streaming subscription / Cheap rental / Background watch",
 "time_commitment": "e.g. 2h 10m single sitting, or 40h across 4 seasons",
 "watch_if": ["3 short bullets describing who will love it"],
 "skip_if": ["2-3 short bullets describing who should avoid it"],
 "strengths": ["2-4 short bullets"],
 "weaknesses": ["2-4 honest short bullets"],
 "content_notes": ["short notes on violence, language, sex, tone, pacing"]
}`;

      const raw = await askEngageraJson<Partial<WatchVerdict>>(prompt, EMPTY);
      const score = Number(raw.score);

      return {
        ...EMPTY,
        ...raw,
        verdict: typeof raw.verdict === "string" ? raw.verdict : "",
        score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
        one_liner: typeof raw.one_liner === "string" ? raw.one_liner : "",
        value_for_money: typeof raw.value_for_money === "string" ? raw.value_for_money : "",
        best_way_to_watch: typeof raw.best_way_to_watch === "string" ? raw.best_way_to_watch : "",
        time_commitment: typeof raw.time_commitment === "string" ? raw.time_commitment : "",
        watch_if: asArray(raw.watch_if),
        skip_if: asArray(raw.skip_if),
        strengths: asArray(raw.strengths),
        weaknesses: asArray(raw.weaknesses),
        content_notes: asArray(raw.content_notes),
      };
    },
  });
};
