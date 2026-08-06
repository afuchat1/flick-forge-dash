interface WhereToWatchProps {
  providers: any;
  title: string;
  tmdbLink?: string;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

const ProviderRow = ({ label, items }: { label: string; items: any[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="fact-label">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <div
            key={`${label}-${p.provider_id}`}
            title={p.provider_name}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary py-1 pl-1 pr-2.5"
          >
            <img
              src={`${IMAGE_BASE}${p.logo_path}`}
              alt={p.provider_name}
              loading="lazy"
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="text-xs font-medium">{p.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Availability information only — this is a discovery library, so we tell users
 * where a title can be found rather than playing it here.
 */
const WhereToWatch = ({ providers, title, tmdbLink }: WhereToWatchProps) => {
  const region = providers?.results?.US ?? Object.values(providers?.results ?? {})[0];
  const link = region?.link ?? tmdbLink;

  const hasAny =
    region && (region.flatrate?.length || region.rent?.length || region.buy?.length || region.free?.length);

  return (
    <section className="space-y-3">
      <h2 className="section-title">Where to Watch</h2>
      <div className="fact-panel space-y-4 p-3.5">
        {hasAny ? (
          <>
            <ProviderRow label="Stream" items={region.flatrate} />
            <ProviderRow label="Free with ads" items={region.free} />
            <ProviderRow label="Rent" items={region.rent} />
            <ProviderRow label="Buy" items={region.buy} />
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
            className="inline-block text-xs font-semibold text-primary hover:underline"
          >
            View full availability on JustWatch →
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
