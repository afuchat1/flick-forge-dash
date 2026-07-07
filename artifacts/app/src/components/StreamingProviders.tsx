const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

/**
 * Direct search/browse URLs for known streaming providers.
 * These send users straight to the streamer — never to TMDB or JustWatch.
 */
const PROVIDER_SEARCH: Record<number, (title: string) => string> = {
  // Netflix
  8:    (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  // Amazon Prime Video
  9:    (t) => `https://www.amazon.com/s?k=${encodeURIComponent(t)}&i=instant-video`,
  119:  (t) => `https://www.amazon.com/s?k=${encodeURIComponent(t)}&i=instant-video`,
  // Hulu
  15:   (t) => `https://www.hulu.com/search?q=${encodeURIComponent(t)}`,
  // Disney+
  337:  (t) => `https://www.disneyplus.com/search/${encodeURIComponent(t)}`,
  // Apple TV+
  350:  (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  2:    (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  // Max (HBO Max)
  384:  (t) => `https://www.max.com/search?q=${encodeURIComponent(t)}`,
  1899: (t) => `https://www.max.com/search?q=${encodeURIComponent(t)}`,
  29:   (t) => `https://www.max.com/search?q=${encodeURIComponent(t)}`,
  // Peacock
  386:  (t) => `https://www.peacocktv.com/stream/search?q=${encodeURIComponent(t)}`,
  // Paramount+
  531:  (t) => `https://www.paramountplus.com/search/${encodeURIComponent(t)}`,
  // Tubi (free)
  73:   (t) => `https://tubitv.com/search?q=${encodeURIComponent(t)}`,
  // Crunchyroll
  283:  (t) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(t)}`,
  // Mubi
  11:   (t) => `https://mubi.com/films?q=${encodeURIComponent(t)}`,
  // Shudder
  99:   (t) => `https://www.shudder.com/search?q=${encodeURIComponent(t)}`,
  // BritBox
  151:  (t) => `https://www.britbox.com/us/search?q=${encodeURIComponent(t)}`,
  // Starz
  43:   (t) => `https://www.starz.com/us/en/search?q=${encodeURIComponent(t)}`,
  // Showtime / Paramount+ w/ Showtime
  37:   (t) => `https://www.paramountplus.com/search/${encodeURIComponent(t)}`,
  // Funimation
  269:  (t) => `https://www.funimation.com/search/?q=${encodeURIComponent(t)}`,
};

interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface StreamingProvidersProps {
  watchProviders: any;
  title: string;
}

const StreamingProviders = ({ watchProviders, title }: StreamingProvidersProps) => {
  // US first, then GB, then first available region
  const regionData: any =
    watchProviders?.results?.US ??
    watchProviders?.results?.GB ??
    Object.values(watchProviders?.results ?? {})[0];

  if (!regionData) return null;

  const flatrate: Provider[] = (regionData.flatrate ?? [])
    .filter((p: Provider) => PROVIDER_SEARCH[p.provider_id])
    .sort((a: Provider, b: Provider) => a.display_priority - b.display_priority);

  const rent: Provider[] = (regionData.rent ?? [])
    .filter((p: Provider) => PROVIDER_SEARCH[p.provider_id] &&
      !flatrate.some((f) => f.provider_id === p.provider_id))
    .sort((a: Provider, b: Provider) => a.display_priority - b.display_priority)
    .slice(0, 4);

  const buy: Provider[] = (regionData.buy ?? [])
    .filter((p: Provider) => PROVIDER_SEARCH[p.provider_id] &&
      !flatrate.some((f) => f.provider_id === p.provider_id) &&
      !rent.some((r) => r.provider_id === p.provider_id))
    .sort((a: Provider, b: Provider) => a.display_priority - b.display_priority)
    .slice(0, 4);

  if (flatrate.length === 0 && rent.length === 0 && buy.length === 0) return null;

  const ProviderCard = ({
    provider,
    badge,
    badgeColor = "bg-primary",
  }: {
    provider: Provider;
    badge?: string;
    badgeColor?: string;
  }) => {
    const href = PROVIDER_SEARCH[provider.provider_id](title);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-2 focus:outline-none"
        title={`Watch on ${provider.provider_name}`}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-primary group-focus:ring-primary transition-all duration-200 shadow-lg">
            <img
              src={`${IMAGE_BASE}${provider.logo_path}`}
              alt={provider.provider_name}
              className="w-full h-full object-cover"
            />
          </div>
          {badge && (
            <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full whitespace-nowrap ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <span className="text-[11px] text-white/70 group-hover:text-white transition-colors text-center leading-tight max-w-[60px] line-clamp-2">
          {provider.provider_name}
        </span>
      </a>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-base">Where to Watch</h3>

      {flatrate.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Stream Now — Included with Subscription
          </p>
          <div className="flex flex-wrap gap-4">
            {flatrate.map((p) => (
              <ProviderCard key={p.provider_id} provider={p} />
            ))}
          </div>
        </div>
      )}

      {rent.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">
            Available to Rent
          </p>
          <div className="flex flex-wrap gap-4">
            {rent.map((p) => (
              <ProviderCard
                key={p.provider_id}
                provider={p}
                badge="Rent"
                badgeColor="bg-yellow-600"
              />
            ))}
          </div>
        </div>
      )}

      {buy.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Available to Buy
          </p>
          <div className="flex flex-wrap gap-4">
            {buy.map((p) => (
              <ProviderCard
                key={p.provider_id}
                provider={p}
                badge="Buy"
                badgeColor="bg-zinc-600"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingProviders;
