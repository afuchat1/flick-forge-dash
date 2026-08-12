import { ExternalLink } from "lucide-react";

interface WhereToWatchProps {
  providers: any;
  title: string;
  tmdbLink?: string;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

/**
 * Deep links per provider. TMDB only returns a single JustWatch region link, so
 * for the major services we build a real search URL on the provider's own site
 * using the title; anything unknown falls back to the JustWatch listing.
 */
const PROVIDER_LINKS: Record<number, (q: string) => string> = {
  8: (q) => `https://www.netflix.com/search?q=${q}`, // Netflix
  9: (q) => `https://www.amazon.com/s?k=${q}&i=instant-video`, // Prime Video
  10: (q) => `https://www.amazon.com/s?k=${q}&i=instant-video`, // Amazon Video
  15: (q) => `https://www.hulu.com/search?q=${q}`,
  337: (q) => `https://www.disneyplus.com/search?q=${q}`,
  350: (q) => `https://tv.apple.com/search?term=${q}`,
  2: (q) => `https://tv.apple.com/search?term=${q}`, // Apple TV (buy/rent)
  384: (q) => `https://www.max.com/search?q=${q}`,
  1899: (q) => `https://www.max.com/search?q=${q}`,
  531: (q) => `https://www.paramountplus.com/search/?q=${q}`,
  386: (q) => `https://www.peacocktv.com/search?q=${q}`,
  283: (q) => `https://www.crunchyroll.com/search?q=${q}`,
  192: (q) => `https://www.youtube.com/results?search_query=${q}+movie`,
  3: (q) => `https://play.google.com/store/search?q=${q}&c=movies`,
  68: (q) => `https://www.microsoft.com/en-us/search/shop/movies-and-tv?q=${q}`,
  7: (q) => `https://www.vudu.com/content/movies/search?searchString=${q}`,
  538: (q) => `https://www.plex.tv/watch-free/search?q=${q}`,
  613: (q) => `https://www.freevee.com/search?q=${q}`,
  73: (q) => `https://www.tubitv.com/search/${q}`,
  300: (q) => `https://pluto.tv/en/search/details?query=${q}`,
  1968: (q) => `https://www.crunchyroll.com/search?q=${q}`,
};

const providerUrl = (providerId: number, title: string, fallback?: string) => {
  const builder = PROVIDER_LINKS[providerId];
  if (builder) return builder(encodeURIComponent(title));
  return fallback;
};

const ProviderRow = ({
  label,
  hint,
  items,
  title,
  fallback,
}: {
  label: string;
  hint: string;
  items: any[];
  title: string;
  fallback?: string;
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <div>
        <p className="fact-label">{label}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => {
          const href = providerUrl(p.provider_id, title, fallback);
          return (
            <a
              key={`${label}-${p.provider_id}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${label} ${title} on ${p.provider_name}`}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary py-1 pl-1 pr-2.5 transition-colors hover:border-primary hover:bg-secondary/70"
            >
              <img
                src={`${IMAGE_BASE}${p.logo_path}`}
                alt={`${p.provider_name} logo`}
                loading="lazy"
                className="h-7 w-7 rounded-md object-cover"
              />
              <span className="text-xs font-medium">{p.provider_name}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Availability information only — this is a discovery library, so we tell users
 * where a title can be found rather than playing it here.
 */
const WhereToWatch = ({ providers, title, tmdbLink }: WhereToWatchProps) => {
  const results = providers?.results ?? {};
  const regionCode = results.US ? "US" : Object.keys(results)[0];
  const region = regionCode ? results[regionCode] : undefined;
  const link = region?.link ?? tmdbLink;

  const hasAny =
    region && (region.flatrate?.length || region.rent?.length || region.buy?.length || region.free?.length);

  return (
    <section className="space-y-3">
      <h2 className="section-title">Where to Watch</h2>
      <div className="fact-panel space-y-4 p-3.5">
        {regionCode && (
          <p className="text-[11px] text-muted-foreground">
            Availability shown for region <span className="font-semibold text-foreground">{regionCode}</span>. Each
            logo opens that service so you can watch there.
          </p>
        )}
        {hasAny ? (
          <>
            <ProviderRow
              label="Stream"
              hint="Included with a subscription"
              items={region.flatrate}
              title={title}
              fallback={link}
            />
            <ProviderRow
              label="Free with ads"
              hint="No subscription required"
              items={region.free}
              title={title}
              fallback={link}
            />
            <ProviderRow
              label="Rent"
              hint="Pay once for a limited viewing window"
              items={region.rent}
              title={title}
              fallback={link}
            />
            <ProviderRow
              label="Buy"
              hint="Purchase a permanent digital copy"
              items={region.buy}
              title={title}
              fallback={link}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No streaming availability is currently listed for {title} in your region.
          </p>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Compare every option and price on JustWatch
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Availability data is provided by JustWatch via TMDB. AfuChat Movies is a discovery library — we
          link you to official providers rather than hosting any content.
        </p>
      </div>
    </section>
  );
};

export default WhereToWatch;
