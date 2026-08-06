import { Link } from "react-router-dom";
import { Star } from "lucide-react";
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
 * Magazine-style editorial spotlight: one lead story plus a supporting grid.
 * Purely a discovery entry point — every card routes to the title's info page.
 */
const DiscoverSpotlight = ({ items = [], isLoading }: DiscoverSpotlightProps) => {
  if (isLoading) {
    return (
      <section className="px-4 py-5 md:px-6">
        <Skeleton className="mb-3 h-5 w-48" />
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="aspect-[16/10] rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[16/10] rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const picks = items.filter((i) => i.backdrop_path).slice(0, 5);
  if (picks.length < 3) return null;

  const [lead, ...rest] = picks;

  return (
    <section className="px-4 py-5 md:px-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="section-title">In the Spotlight</h2>
        <Link to="/new-popular" className="text-xs font-semibold text-primary hover:underline">
          See all
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Lead story */}
        <Link
          to={linkFor(lead)}
          className="group relative block overflow-hidden rounded-lg border border-border"
        >
          <img
            src={getImageUrl(lead.backdrop_path, "w780")}
            alt={titleOf(lead)}
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="chip mb-2 border-primary/60 text-primary">Featured</span>
            <h3 className="text-lg leading-tight md:text-2xl">{titleOf(lead)}</h3>
            <div className="mt-1 flex items-center gap-2.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {lead.vote_average?.toFixed(1)}
              </span>
              {yearOf(lead) && <span>{yearOf(lead)}</span>}
            </div>
            {lead.overview && (
              <p className="mt-1.5 line-clamp-2 max-w-lg text-xs leading-relaxed text-foreground/75">
                {lead.overview}
              </p>
            )}
          </div>
        </Link>

        {/* Supporting grid */}
        <div className="grid grid-cols-2 gap-3">
          {rest.map((item) => (
            <Link
              key={item.id}
              to={linkFor(item)}
              className="group relative block overflow-hidden rounded-lg border border-border"
            >
              <img
                src={getImageUrl(item.backdrop_path, "w500")}
                alt={titleOf(item)}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <h3 className="line-clamp-2 text-xs leading-tight md:text-sm">{titleOf(item)}</h3>
                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                  {item.vote_average?.toFixed(1)}
                  {yearOf(item) && <span className="ml-1">{yearOf(item)}</span>}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverSpotlight;
