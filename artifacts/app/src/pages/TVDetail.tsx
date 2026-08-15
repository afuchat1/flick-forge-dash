import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Star, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import AIInsights from "@/components/AIInsights";
import ContentMatcher from "@/components/ContentMatcher";
import FactPanel from "@/components/FactPanel";
import CreditsSection from "@/components/CreditsSection";
import VideoGallery from "@/components/VideoGallery";
import ImageGallery from "@/components/ImageGallery";
import ReviewsSection from "@/components/ReviewsSection";
import WhereToWatch from "@/components/WhereToWatch";
import ExternalLinks from "@/components/ExternalLinks";
import { useTVDetails, useTVSeason, getImageUrl } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatLanguage, formatList, formatRuntime, getTVRating } from "@/lib/format";

const TVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const { data: show, isLoading } = useTVDetails(Number(id));
  const { data: seasonData, isLoading: seasonLoading } = useTVSeason(Number(id), selectedSeason);
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (show && user) {
      addToRecentlyViewed({
        tmdb_id: show.id,
        media_type: "tv",
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
      });
    }
  }, [show?.id, user?.id]);


  const handleToggleWatchlist = () => {
    if (!user) {
      toast.error("Please sign in to save to your list");
      navigate("/auth");
      return;
    }
    if (show) {
      toggleWatchlist({
        tmdb_id: show.id,
        media_type: "tv",
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
        release_date: show.first_air_date,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && show) {
      try {
        await navigator.share({ title: show.name, text: show.overview, url: window.location.href });
      } catch {
        /* cancelled */
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0 pt-28 md:pt-24">
        <Header />
        <Skeleton className="h-[45vh] w-full" />
        <div className="mx-auto max-w-6xl space-y-3 p-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 pt-28 md:pt-24">
        <div className="text-center">
          <h1 className="mb-2 text-xl">TV Show not found</h1>
          <Link to="/" className="text-sm text-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const rating = getTVRating(show.content_ratings);
  const similarShows = [...(show.recommendations?.results ?? []), ...(show.similar?.results ?? [])]
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i)
    .slice(0, 20);
  const inWatchlist = isInWatchlist(show.id, "tv");
  const seasons = show.seasons?.filter((s: any) => s.season_number > 0) ?? [];
  const episodes = seasonData?.episodes ?? [];
  const currentSeason = seasons.find((s: any) => s.season_number === selectedSeason);

  const productionFacts = [
    { label: "Status", value: show.status },
    { label: "Type", value: show.type },
    { label: "First aired", value: formatDate(show.first_air_date) },
    { label: "Last aired", value: formatDate(show.last_air_date) },
    { label: "Seasons", value: show.number_of_seasons },
    { label: "Episodes", value: show.number_of_episodes },
    { label: "Episode runtime", value: formatRuntime(show.episode_run_time?.[0]) },
    { label: "Content rating", value: rating },
    { label: "In production", value: show.in_production ? "Yes" : "No" },
    { label: "Original title", value: show.original_name !== show.name ? show.original_name : null },
    { label: "Original language", value: formatLanguage(show.original_language) },
    { label: "Spoken languages", value: formatList(show.spoken_languages) },
    { label: "Countries", value: formatList(show.production_countries) },
    { label: "Networks", value: formatList(show.networks) },
    { label: "Studios", value: formatList(show.production_companies) },
    { label: "Created by", value: formatList(show.created_by) },
  ];

  const scoring = [
    { label: "TMDB score", value: show.vote_average ? `${show.vote_average.toFixed(1)} / 10` : null },
    { label: "Vote count", value: show.vote_count ? show.vote_count.toLocaleString() : null },
    { label: "Popularity", value: show.popularity ? show.popularity.toFixed(0) : null },
    {
      label: "Next episode",
      value: show.next_episode_to_air
        ? `S${show.next_episode_to_air.season_number}E${show.next_episode_to_air.episode_number} · ${formatDate(show.next_episode_to_air.air_date)}`
        : null,
    },
    {
      label: "Latest episode",
      value: show.last_episode_to_air
        ? `S${show.last_episode_to_air.season_number}E${show.last_episode_to_air.episode_number} · ${show.last_episode_to_air.name}`
        : null,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 pt-28 md:pt-24">
      <Seo
        title={`${show.name}${show.first_air_date ? ` (${show.first_air_date.slice(0, 4)})` : ""} — AfuChat Movies`}
        description={show.overview || `Episode guide, cast, crew and ratings for ${show.name}.`}
        path={`/tv/${show.id}`}
        image={getImageUrl(show.backdrop_path || show.poster_path, "original")}
        type="video.tv_show"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: show.name,
          description: show.overview,
          image: getImageUrl(show.poster_path, "original"),
          startDate: show.first_air_date || undefined,
          numberOfSeasons: show.number_of_seasons,
          numberOfEpisodes: show.number_of_episodes,
          genre: show.genres?.map((g: { name: string }) => g.name),
          aggregateRating: show.vote_count
            ? {
                "@type": "AggregateRating",
                ratingValue: Number(show.vote_average?.toFixed(1)),
                ratingCount: show.vote_count,
                bestRating: 10,
                worstRating: 0,
              }
            : undefined,
        }}
      />
      <Header />


      <div className="relative">
        <div className="h-[42vh] max-h-[560px] min-h-[300px] w-full md:h-[55vh]">
          <img
            src={getImageUrl(show.backdrop_path || show.poster_path, "original")}
            alt={`${show.name} backdrop`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <Link
              to="/tv-shows"
              className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3 w-3" /> Back to discovery
            </Link>

            <div className="flex items-end gap-4">
              <img
                src={getImageUrl(show.poster_path, "w342")}
                alt={`${show.name} poster`}
                className="hidden w-32 shrink-0 rounded-lg border border-border shadow-2xl md:block lg:w-40"
              />

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl leading-tight md:text-5xl">{show.name}</h1>
                {show.tagline && <p className="mt-1.5 text-sm italic text-primary md:text-base">“{show.tagline}”</p>}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {show.vote_average?.toFixed(1)}
                  </span>
                  {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
                  <span>
                    {show.number_of_seasons} season{show.number_of_seasons > 1 ? "s" : ""} ·{" "}
                    {show.number_of_episodes} eps
                  </span>
                  {rating && (
                    <span className="rounded border border-border px-1.5 py-0.5 font-semibold">{rating}</span>
                  )}
                </div>

                {show.genres?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {show.genres.map((g: any) => (
                      <Link key={g.id} to={`/genre/${g.id}`} className="chip">
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={inWatchlist ? "default" : "secondary"}
            className="h-9 px-4 font-semibold"
            onClick={handleToggleWatchlist}
          >
            {inWatchlist ? (
              <><Check className="mr-1.5 h-4 w-4" /> In My List</>
            ) : (
              <><Plus className="mr-1.5 h-4 w-4" /> Add to My List</>
            )}
          </Button>
          <Button size="sm" variant="secondary" className="h-9 w-9 p-0" onClick={handleShare} aria-label="Share">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {show.overview && (
          <section className="space-y-2.5">
            <h2 className="section-title">Synopsis</h2>
            <p className="max-w-3xl text-[15px] leading-relaxed text-foreground/85">{show.overview}</p>
          </section>
        )}

        <AIVerdict
          input={{
            title: show.name,
            type: "tv",
            year: show.first_air_date?.slice(0, 4),
            genres: show.genres?.map((g: any) => g.name),
            overview: show.overview,
            rating: show.vote_average,
            voteCount: show.vote_count,
            runtime: show.episode_run_time?.[0],
            seasons: show.number_of_seasons,
            episodes: show.number_of_episodes,
            cast: show.credits?.cast?.slice(0, 5).map((c: any) => c.name),
            certification: rating || undefined,
          }}
        />


        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-8">
            <FactPanel title="Production Details" facts={productionFacts} />

            {/* Season & episode guide */}
            {seasons.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="section-title">Episode Guide</h2>
                  <Select value={String(selectedSeason)} onValueChange={(v) => setSelectedSeason(Number(v))}>
                    <SelectTrigger className="h-8 w-44 text-xs">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map((season: any) => (
                        <SelectItem key={season.season_number} value={String(season.season_number)}>
                          Season {season.season_number} ({season.episode_count} eps)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentSeason?.overview && (
                  <p className="text-sm leading-relaxed text-muted-foreground">{currentSeason.overview}</p>
                )}

                {seasonLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {episodes.map((ep: any) => (
                      <article key={ep.id} className="fact-panel flex gap-3 p-2.5">
                        <img
                          src={getImageUrl(ep.still_path, "w342")}
                          alt={ep.name}
                          loading="lazy"
                          className="aspect-video w-32 shrink-0 rounded-md bg-secondary object-cover sm:w-44"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold leading-tight">
                              <span className="text-primary">E{ep.episode_number}</span> {ep.name}
                            </p>
                            {ep.vote_average > 0 && (
                              <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {ep.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {[formatDate(ep.air_date), ep.runtime ? `${ep.runtime} min` : null]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          {ep.overview && (
                            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-foreground/75">
                              {ep.overview}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <VideoGallery videos={show.videos?.results ?? []} title={show.name} />
            <CreditsSection cast={show.credits?.cast ?? []} crew={show.credits?.crew ?? []} />
            <ImageGallery images={show.images ?? {}} />
            <ReviewsSection
              reviews={show.reviews?.results ?? []}
              voteAverage={show.vote_average}
              voteCount={show.vote_count}
            />
          </div>

          <aside className="min-w-0 space-y-8">
            <FactPanel title="Scoring &amp; Schedule" facts={scoring} columns={1} />
            <WhereToWatch
              providers={show["watch/providers"]}
              title={show.name}
              tmdbLink={`https://www.themoviedb.org/tv/${show.id}/watch`}
            />
            <ExternalLinks
              externalIds={show.external_ids}
              homepage={show.homepage}
              keywords={show.keywords?.results ?? []}
              mediaType="tv"
            />
          </aside>
        </div>

        <AIInsights movie={show} />

        <ContentMatcher
          title={show.name}
          type="tv"
          genres={show.genres?.map((g: any) => g.name)}
          overview={show.overview}
        />
      </div>

      {similarShows.length > 0 && <TMDBContentRow title="More Like This" movies={similarShows} />}

      <MobileNav />
    </div>
  );
};

export default TVDetail;
