import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl, useInfiniteUpcomingReleases, TMDBMovie } from "@/hooks/useTMDB";

type Kind = "movie" | "tv";

const formatDate = (iso?: string) => {
  if (!iso) return "Date TBA";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "Date TBA";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const daysAway = (iso?: string) => {
  if (!iso) return null;
  const diff = Math.ceil((new Date(`${iso}T00:00:00`).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(diff)) return null;
  if (diff <= 0) return "Releasing today";
  if (diff === 1) return "Tomorrow";
  if (diff < 31) return `In ${diff} days`;
  if (diff < 365) return `In ${Math.round(diff / 30)} months`;
  return `In ${Math.round(diff / 365)} years`;
};

const monthLabel = (iso?: string) => {
  if (!iso) return "Date to be announced";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "Date to be announced";
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

const ComingSoonPage = () => {
  const [kind, setKind] = useState<Kind>("movie");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUpcomingReleases(kind);
  const sentinel = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().slice(0, 10);

  const items = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.results) ?? [];
    const seen = new Set<number>();
    return all
      .filter((m) => {
        const date = kind === "movie" ? m.release_date : m.first_air_date;
        if (!date || date < today) return false;
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      })
      .sort((a, b) =>
        ((kind === "movie" ? a.release_date : a.first_air_date) || "").localeCompare(
          (kind === "movie" ? b.release_date : b.first_air_date) || ""
        )
      );
  }, [data, kind, today]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Group by release month for an editorial release calendar.
  const groups: { label: string; items: TMDBMovie[] }[] = [];
  items.forEach((item) => {
    const label = monthLabel(kind === "movie" ? item.release_date : item.first_air_date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Seo
        title="Coming Soon — Upcoming Movies & TV Releases | AfuChat Movies"
        description="A full release calendar of films and series that have not hit cinemas or screens yet, with exact release dates, synopses and cast details."
        path="/coming-soon"
      />
      <Header />

      <main className="pt-28 md:pt-24">
        <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
          <div className="py-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <h1 className="text-xl md:text-3xl font-bold">Coming Soon</h1>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Titles that have not been released yet — announced and dated, sorted by the nearest
              release day.
            </p>
          </div>

          <div className="flex gap-2 pb-4">
            {(["movie", "tv"] as Kind[]).map((k) => (
              <Button
                key={k}
                size="sm"
                variant={kind === k ? "default" : "outline"}
                onClick={() => setKind(k)}
              >
                {k === "movie" ? "Upcoming Films" : "Upcoming Series"}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {[...Array(16)].map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-md" />
              ))}
            </div>
          )}

          {!isLoading &&
            groups.map((group) => (
              <section key={group.label} className="mb-8">
                <h2 className="text-sm md:text-base font-bold mb-3 sticky top-[104px] md:top-[80px] bg-background/90 backdrop-blur py-1 z-10">
                  {group.label}
                  <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                    {group.items.length} title{group.items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {group.items.map((item) => {
                    const date = kind === "movie" ? item.release_date : item.first_air_date;
                    return (
                      <Link
                        key={item.id}
                        to={`/${kind}/${item.id}`}
                        className="group min-w-0"
                      >
                        <div className="aspect-[2/3] rounded-md overflow-hidden bg-card relative">
                          <img
                            src={getImageUrl(item.poster_path, "w342")}
                            alt={item.title || item.name || "Upcoming release"}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <span className="absolute bottom-1 left-1 right-1 text-[9px] font-semibold text-white bg-black/70 rounded px-1 py-0.5 text-center">
                            {daysAway(date)}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title || item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(date)}</p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

          <div ref={sentinel} className="h-10" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center pb-8">
              <Button variant="outline" size="sm" onClick={() => fetchNextPage()}>
                Load more releases
              </Button>
            </div>
          )}

          {!isLoading && !items.length && (
            <p className="text-sm text-muted-foreground py-10 text-center">
              No dated upcoming releases found right now.
            </p>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ComingSoonPage;
