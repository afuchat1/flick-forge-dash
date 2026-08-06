import { useState } from "react";

interface VideoGalleryProps {
  videos: any[];
  title: string;
}

const TYPE_ORDER = ["Trailer", "Teaser", "Clip", "Featurette", "Behind the Scenes", "Bloopers"];

/** Every official video TMDB documents for the title, not just the first trailer. */
const VideoGallery = ({ videos = [], title }: VideoGalleryProps) => {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const sorted = [...youtube].sort(
    (a, b) => (TYPE_ORDER.indexOf(a.type) + 1 || 99) - (TYPE_ORDER.indexOf(b.type) + 1 || 99),
  );
  const [activeKey, setActiveKey] = useState<string | null>(sorted[0]?.key ?? null);

  if (sorted.length === 0) return null;

  const active = sorted.find((v) => v.key === activeKey) ?? sorted[0];

  return (
    <section className="space-y-3">
      <h2 className="section-title">Videos &amp; Trailers</h2>

      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-secondary">
        <iframe
          key={active.key}
          src={`https://www.youtube.com/embed/${active.key}?rel=0&modestbranding=1&iv_load_policy=3`}
          title={`${title} — ${active.name}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold leading-tight">{active.name}</p>
        <span className="chip shrink-0">{active.type}</span>
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sorted.map((v) => (
            <button
              key={v.key}
              onClick={() => setActiveKey(v.key)}
              className={`w-40 shrink-0 text-left transition-opacity ${
                v.key === active.key ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <div
                className={`aspect-video w-full overflow-hidden rounded-md bg-secondary ring-1 ${
                  v.key === active.key ? "ring-primary" : "ring-border"
                }`}
              >
                <img
                  src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`}
                  alt={v.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-1 text-[11px] font-medium leading-tight line-clamp-2">{v.name}</p>
              <p className="text-[10px] text-muted-foreground">{v.type}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default VideoGallery;
