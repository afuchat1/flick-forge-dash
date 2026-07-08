import { useQuery } from "@tanstack/react-query";

/**
 * Discovers whether a full public-domain copy of a movie is available
 * on the Internet Archive (feature_films / classic_tv collections).
 *
 * These are legally free-to-stream titles whose copyright has lapsed —
 * the honest "public movie domain" pool we can play directly in-app.
 */

const ADVANCED_SEARCH = "https://archive.org/advancedsearch.php";
const METADATA = "https://archive.org/metadata";
const DOWNLOAD = "https://archive.org/download";

type IAFile = {
  name: string;
  format?: string;
  size?: string;
  source?: string;
};

export interface PublicDomainSource {
  identifier: string;
  title: string;
  year?: string;
  videoUrl: string;
  mimeType: string;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function findIdentifier(title: string, year?: string): Promise<{ identifier: string; title: string; year?: string } | null> {
  const q = `title:(${JSON.stringify(title)}) AND mediatype:(movies) AND collection:(feature_films OR classic_tv OR film_noir OR silent_films OR classic_cartoons)`;
  const url = `${ADVANCED_SEARCH}?q=${encodeURIComponent(q)}&fl[]=identifier&fl[]=title&fl[]=year&rows=8&output=json&sort[]=downloads+desc`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const docs: Array<{ identifier: string; title: string; year?: string }> = json?.response?.docs ?? [];
  if (!docs.length) return null;

  const targetTitle = normalize(title);
  // Prefer exact-ish title matches; if a year is provided, require year proximity.
  const scored = docs
    .map((d) => {
      const nt = normalize(d.title || "");
      let score = 0;
      if (nt === targetTitle) score += 5;
      else if (nt.startsWith(targetTitle)) score += 3;
      else if (nt.includes(targetTitle)) score += 1;
      if (year && d.year) {
        const diff = Math.abs(Number(d.year) - Number(year));
        if (!Number.isNaN(diff) && diff <= 1) score += 3;
        else if (!Number.isNaN(diff) && diff <= 3) score += 1;
        else score -= 2;
      }
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.d ?? null;
}

async function findPlayableFile(identifier: string): Promise<{ name: string; mime: string } | null> {
  const res = await fetch(`${METADATA}/${identifier}`);
  if (!res.ok) return null;
  const json = await res.json();
  const files: IAFile[] = json?.files ?? [];

  // Prefer streamable formats in this order.
  const preferences: Array<{ match: (f: IAFile) => boolean; mime: string }> = [
    { match: (f) => /^h\.264 ia$|^h\.264$/i.test(f.format || "") && f.name.endsWith(".mp4"), mime: "video/mp4" },
    { match: (f) => /512kb mpeg4/i.test(f.format || "") && f.name.endsWith(".mp4"), mime: "video/mp4" },
    { match: (f) => f.name.toLowerCase().endsWith(".mp4"), mime: "video/mp4" },
    { match: (f) => f.name.toLowerCase().endsWith(".m4v"), mime: "video/mp4" },
    { match: (f) => f.name.toLowerCase().endsWith(".webm"), mime: "video/webm" },
    { match: (f) => f.name.toLowerCase().endsWith(".ogv"), mime: "video/ogg" },
  ];

  for (const pref of preferences) {
    const hit = files.find(pref.match);
    if (hit) return { name: hit.name, mime: pref.mime };
  }
  return null;
}

export function usePublicDomainSource(title: string | undefined, year?: string) {
  return useQuery<PublicDomainSource | null>({
    queryKey: ["public-domain-source", title, year],
    enabled: !!title,
    staleTime: 1000 * 60 * 60, // 1h — copyright status doesn't change often
    gcTime: 1000 * 60 * 60 * 6,
    retry: false,
    queryFn: async () => {
      if (!title) return null;
      try {
        const doc = await findIdentifier(title, year);
        if (!doc) return null;
        const file = await findPlayableFile(doc.identifier);
        if (!file) return null;
        return {
          identifier: doc.identifier,
          title: doc.title,
          year: doc.year,
          videoUrl: `${DOWNLOAD}/${doc.identifier}/${encodeURIComponent(file.name)}`,
          mimeType: file.mime,
        };
      } catch {
        return null;
      }
    },
  });
}
