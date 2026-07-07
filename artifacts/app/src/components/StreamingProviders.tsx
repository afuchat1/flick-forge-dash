import { ExternalLink } from "lucide-react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w45";

// Map well-known provider IDs → direct search URLs
const PROVIDER_LINKS: Record<number, (title: string) => string> = {
  8:    (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  9:    (t) => `https://www.amazon.com/s?k=${encodeURIComponent(t)}&i=instant-video`,
  119:  (t) => `https://www.amazon.com/s?k=${encodeURIComponent(t)}&i=instant-video`,
  15:   (t) => `https://www.hulu.com/search?q=${encodeURIComponent(t)}`,
  337:  (t) => `https://www.disneyplus.com/search/${encodeURIComponent(t)}`,
  350:  (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  384:  (t) => `https://www.max.com/search?q=${encodeURIComponent(t)}`,
  1899: (t) => `https://www.max.com/search?q=${encodeURIComponent(t)}`,
  29:   (t) => `https://www.max.com/search?q=${encodeURIComponent(t)}`,
  386:  (t) => `https://www.peacocktv.com/stream/search?q=${encodeURIComponent(t)}`,
  531:  (t) => `https://www.paramountplus.com/search/${encodeURIComponent(t)}`,
  73:   (t) => `https://tubitv.com/search?q=${encodeURIComponent(t)}`,
  283:  (t) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(t)}`,
  2:    (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
};

interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface StreamingProvidersProps {
  /** The raw watch/providers object from TMDB (movie["watch/providers"] or show["watch/providers"]) */
  watchProviders: any;
  title: string;
  /** Fallback JustWatch link from TMDB results */
  justWatchLink?: string;
}

const StreamingProviders = ({ watchProviders, title, justWatchLink }: StreamingProvidersProps) => {
  // Try to get providers for the user's region; fall back to US then first available region
  const regionData =
    watchProviders?.results?.US ??
    watchProviders?.results?.GB ??
    Object.values(watchProviders?.results ?? {})[0] as any;

  if (!regionData) return null;

  const streamingProviders: Provider[] = regionData.flatrate ?? [];
  const rentProviders: Provider[] = regionData.rent ?? [];
  const buyProviders: Provider[] = regionData.buy ?? [];
  const fallbackLink: string = regionData.link ?? justWatchLink ?? "";

  const allProviders = [...streamingProviders, ...rentProviders, ...buyProviders]
    // deduplicate by provider_id
    .filter((p, i, arr) => arr.findIndex((x) => x.provider_id === p.provider_id) === i)
    .sort((a, b) => a.display_priority - b.display_priority)
    .slice(0, 10);

  if (allProviders.length === 0) return null;

  const getLink = (provider: Provider) => {
    const fn = PROVIDER_LINKS[provider.provider_id];
    return fn ? fn(title) : fallbackLink || `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`;
  };

  const isStreaming = (p: Provider) => streamingProviders.some((s) => s.provider_id === p.provider_id);
  const isRent = (p: Provider) =>
    !isStreaming(p) && rentProviders.some((r) => r.provider_id === p.provider_id);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Where to Watch</h3>
        {fallbackLink && (
          <a
            href={fallbackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary flex items-center gap-1 hover:underline"
          >
            All options <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {allProviders.map((provider) => (
          <a
            key={provider.provider_id}
            href={getLink(provider)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Watch on ${provider.provider_name}${isStreaming(provider) ? "" : isRent(provider) ? " (Rent)" : " (Buy)"}`}
            className="group flex flex-col items-center gap-1.5"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all shadow-md">
              <img
                src={`${IMAGE_BASE}${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] text-muted-foreground text-center max-w-[52px] leading-tight line-clamp-2">
              {provider.provider_name}
            </span>
            {!isStreaming(provider) && (
              <span className="text-[9px] text-primary font-medium -mt-1">
                {isRent(provider) ? "Rent" : "Buy"}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default StreamingProviders;
