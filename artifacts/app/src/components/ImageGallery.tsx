import { useState } from "react";

interface ImageGalleryProps {
  images: { backdrops?: any[]; posters?: any[]; logos?: any[] };
}

const IMAGE_BASE = "https://image.tmdb.org/t/p";

/** Official stills and poster artwork documented for the title. */
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [tab, setTab] = useState<"backdrops" | "posters">("backdrops");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const backdrops = images?.backdrops ?? [];
  const posters = images?.posters ?? [];

  if (backdrops.length === 0 && posters.length === 0) return null;

  const tabs = [
    { key: "backdrops" as const, label: `Stills (${backdrops.length})`, items: backdrops, size: "w780", aspect: "aspect-video", width: "w-64" },
    { key: "posters" as const, label: `Posters (${posters.length})`, items: posters, size: "w342", aspect: "aspect-[2/3]", width: "w-32" },
  ].filter((t) => t.items.length > 0);

  const activeTab = tabs.find((t) => t.key === tab) ?? tabs[0];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Media Gallery</h2>
        {tabs.length > 1 && (
          <div className="flex gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`chip ${t.key === activeTab.key ? "border-primary text-primary" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {activeTab.items.slice(0, 20).map((img: any, i: number) => (
          <button
            key={img.file_path ?? i}
            onClick={() => setLightbox(`${IMAGE_BASE}/original${img.file_path}`)}
            className={`${activeTab.width} ${activeTab.aspect} shrink-0 overflow-hidden rounded-md bg-secondary ring-1 ring-border transition-all hover:ring-primary`}
          >
            <img
              src={`${IMAGE_BASE}/${activeTab.size}${img.file_path}`}
              alt={`${activeTab.key === "posters" ? "Poster" : "Still"} ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-label="Image preview"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
        >
          <img src={lightbox} alt="Enlarged still" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
