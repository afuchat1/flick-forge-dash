import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoverSpotlightProps {
  items?: any[];
  isLoading?: boolean;
}

const linkFor = (item: any) =>
  `/${item.media_type === "tv" || item.first_air_date ? "tv" : "movie"}/${item.id}`;

const titleOf = (item: any) => item.title || item.name;
const yearOf = (item: any) => (item.release_date || item.first_air_date || "").slice(0, 4);

/**
 * Editorial spotlight: one cinematic lead banner followed by a numbered
 * horizontal rail of supporting picks. Every card routes to the title's page.
 */
const DiscoverSpotlight = ({ items = [], isLoading }: DiscoverSpotlightProps) => {
  if (isLoading) {
    return (
      <section className="px-4 py-5 md:px-6">
        <Skeleton className="mb-3 h-5 w-48" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl md:aspect-[21/8]" />
        <div className="mt-3 flex gap-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-44 flex-shrink-0 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  const picks = items.filter((i) => i.backdrop_path).slice(0, 7);
  if (picks.length < 3) return null;

  const [lead, ...rest] = picks;

  return (
    <section className="px-4 py-5 md:px-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="section-title">In the Spotlight</h2>
        <Link
          to="/new-popular"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          See all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Lead banner */}
      <Link
        to={linkFor(lead)}
        className="group relative block overflow-hidden rounded-xl border border-border"
      >
        <img
          src={getImageUrl(lead.backdrop_path, "original")}
          alt={titleOf(lead)}
          className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:aspect-[21/8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-7">
          <span className="chip mb-2 border-primary/60 text-primary">Featured</span>
          <h3 className="text-xl leading-tight md:text-4xl">{titleOf(lead)}</h3>
          <div className="mt-1.5 flex items-center gap-2.5 text-[11px] text-muted-foreground md:text-xs">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {lead.vote_average?.toFixed(1)}
            </span>
            {yearOf(lead) && <span>{yearOf(lead)}</span>}
          </div>
          {lead.overview && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-foreground/75 md:text-sm">
              {lead.overview}
            </p>
          )}
        </div>
      </Link>

      {/* Numbered supporting rail */}
      <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto scroll-smooth pb-1">
        {rest.map((item, i) => (
          <Link
            key={item.id}
            to={linkFor(item)}
            className="group relative w-44 flex-shrink-0 overflow-hidden rounded-lg border border-border md:w-56"
          >
            <img
              src={getImageUrl(item.backdrop_path, "w500")}
              alt={titleOf(item)}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
            <span className="absolute left-2 top-2 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-bold text-primary backdrop-blur">
              {String(i + 2).padStart(2, "0")}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-2.5">
              <h3 className="line-clamp-1 text-xs leading-tight md:text-sm">{titleOf(item)}</h3>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                {item.vote_average?.toFixed(1)}
                {yearOf(item) && <span className="ml-1">{yearOf(item)}</span>}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DiscoverSpotlight;
