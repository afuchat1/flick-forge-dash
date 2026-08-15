import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Star, Share2, Check, Film } from "lucide-react";
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
import { useMovieDetails, getImageUrl } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  formatCurrency,
  formatDate,
  formatLanguage,
  formatList,
  formatRuntime,
  getMovieCertification,
  profitLabel,
} from "@/lib/format";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading } = useMovieDetails(Number(id));
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (movie && user) {
      addToRecentlyViewed({
        tmdb_id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      });
    }
  }, [movie?.id, user?.id]);


  const handleToggleWatchlist = () => {
    if (!user) {
      toast.error("Please sign in to save to your list");
      navigate("/auth");
      return;
    }
    if (movie) {
      toggleWatchlist({
        tmdb_id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && movie) {
      try {
        await navigator.share({ title: movie.title, text: movie.overview, url: window.location.href });
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
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-40 w-full" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 pt-28 md:pt-24">
        <div className="text-center">
          <h1 className="mb-2 text-xl">Movie not found</h1>
          <Link to="/" className="text-sm text-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const cert = getMovieCertification(movie.release_dates);
  const director = movie.credits?.crew?.filter((c: any) => c.job === "Director") ?? [];
  const writers = movie.credits?.crew?.filter((c: any) => ["Screenplay", "Writer", "Story"].includes(c.job)) ?? [];
  const composer = movie.credits?.crew?.find((c: any) => c.job === "Original Music Composer");
  const cinematographer = movie.credits?.crew?.find((c: any) => c.job === "Director of Photography");
  const producers = movie.credits?.crew?.filter((c: any) => c.job === "Producer") ?? [];
  const similarMovies = [...(movie.recommendations?.results ?? []), ...(movie.similar?.results ?? [])]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 20);
  const inWatchlist = isInWatchlist(movie.id, "movie");
  const collection = movie.belongs_to_collection;

  const people = [
    { label: "Director", value: formatList(director) },
    { label: "Writers", value: formatList(writers) },
    { label: "Producers", value: formatList(producers.slice(0, 4)) },
    { label: "Cinematography", value: cinematographer?.name },
    { label: "Music by", value: composer?.name },
  ];

  const releaseFacts = [
    { label: "Status", value: movie.status },
    { label: "Release date", value: formatDate(movie.release_date) },
    { label: "Runtime", value: formatRuntime(movie.runtime) },
    { label: "Certification", value: cert },
    { label: "Original title", value: movie.original_title !== movie.title ? movie.original_title : null },
    { label: "Original language", value: formatLanguage(movie.original_language) },
    { label: "Spoken languages", value: formatList(movie.spoken_languages) },
    { label: "Countries", value: formatList(movie.production_countries) },
    { label: "Studios", value: formatList(movie.production_companies) },
  ];

  const boxOffice = [
    { label: "Budget", value: formatCurrency(movie.budget) },
    { label: "Revenue", value: formatCurrency(movie.revenue) },
    { label: "Result", value: profitLabel(movie.budget, movie.revenue) },
    { label: "TMDB score", value: movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : null },
    { label: "Vote count", value: movie.vote_count ? movie.vote_count.toLocaleString() : null },
    { label: "Popularity", value: movie.popularity ? movie.popularity.toFixed(0) : null },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 pt-28 md:pt-24">
      <Seo
        title={`${movie.title}${movie.release_date ? ` (${movie.release_date.slice(0, 4)})` : ""} — AfuChat Movies`}
        description={movie.overview || `Cast, crew, box office, ratings and where to watch ${movie.title}.`}
        path={`/movie/${movie.id}`}
        image={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
        type="video.movie"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Movie",
          name: movie.title,
          description: movie.overview,
          image: getImageUrl(movie.poster_path, "original"),
          datePublished: movie.release_date || undefined,
          genre: movie.genres?.map((g: { name: string }) => g.name),
          aggregateRating: movie.vote_count
            ? {
                "@type": "AggregateRating",
                ratingValue: Number(movie.vote_average?.toFixed(1)),
                ratingCount: movie.vote_count,
                bestRating: 10,
                worstRating: 0,
              }
            : undefined,
        }}
      />
      <Header />


      {/* Masthead */}
      <div className="relative">
        <div className="h-[42vh] max-h-[560px] min-h-[300px] w-full md:h-[55vh]">
          <img
            src={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
            alt={`${movie.title} backdrop`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <Link to="/" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-3 w-3" /> Back to discovery
            </Link>

            <div className="flex items-end gap-4">
              <img
                src={getImageUrl(movie.poster_path, "w342")}
                alt={`${movie.title} poster`}
                className="hidden w-32 shrink-0 rounded-lg border border-border shadow-2xl md:block lg:w-40"
              />

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl leading-tight md:text-5xl">{movie.title}</h1>
                {movie.tagline && (
                  <p className="mt-1.5 text-sm italic text-primary md:text-base">“{movie.tagline}”</p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
                  {movie.runtime ? <span>{formatRuntime(movie.runtime)}</span> : null}
                  {cert && <span className="rounded border border-border px-1.5 py-0.5 font-semibold">{cert}</span>}
                </div>

                {movie.genres?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {movie.genres.map((g: any) => (
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

        {movie.overview && (
          <section className="space-y-2.5">
            <h2 className="section-title">Synopsis</h2>
            <p className="max-w-3xl text-[15px] leading-relaxed text-foreground/85">{movie.overview}</p>
          </section>
        )}

        <AIVerdict
          input={{
            title: movie.title,
            type: "movie",
            year: movie.release_date?.slice(0, 4),
            genres: movie.genres?.map((g: any) => g.name),
            overview: movie.overview,
            rating: movie.vote_average,
            voteCount: movie.vote_count,
            runtime: movie.runtime,
            cast: movie.credits?.cast?.slice(0, 5).map((c: any) => c.name),
            director: director[0]?.name,
            certification: cert || undefined,
            budget: movie.budget,
            revenue: movie.revenue,
          }}
        />


        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-8">
            <FactPanel title="Release Details" facts={releaseFacts} />
            <FactPanel title="Key People" facts={people} />
            <VideoGallery videos={movie.videos?.results ?? []} title={movie.title} />
            <CreditsSection cast={movie.credits?.cast ?? []} crew={movie.credits?.crew ?? []} />
            <ImageGallery images={movie.images ?? {}} />
            <ReviewsSection
              reviews={movie.reviews?.results ?? []}
              voteAverage={movie.vote_average}
              voteCount={movie.vote_count}
            />
          </div>

          <aside className="min-w-0 space-y-8">
            <FactPanel title="Box Office &amp; Scoring" facts={boxOffice} columns={1} />
            <WhereToWatch
              providers={movie["watch/providers"]}
              title={movie.title}
              tmdbLink={`https://www.themoviedb.org/movie/${movie.id}/watch`}
            />
            {collection && (
              <section className="space-y-3">
                <h2 className="section-title">Part of a Collection</h2>
                <div className="fact-panel overflow-hidden">
                  {collection.backdrop_path && (
                    <img
                      src={getImageUrl(collection.backdrop_path, "w780")}
                      alt={collection.name}
                      className="h-24 w-full object-cover"
                    />
                  )}
                  <p className="flex items-center gap-2 p-3.5 text-sm font-semibold">
                    <Film className="h-4 w-4 text-primary" /> {collection.name}
                  </p>
                </div>
              </section>
            )}
            <ExternalLinks
              externalIds={movie.external_ids}
              homepage={movie.homepage}
              keywords={movie.keywords?.keywords ?? []}
              mediaType="movie"
            />
          </aside>
        </div>

        <AIInsights movie={movie} />

        <ContentMatcher
          title={movie.title}
          type="movie"
          genres={movie.genres?.map((g: any) => g.name)}
          overview={movie.overview}
        />
      </div>

      {similarMovies.length > 0 && <TMDBContentRow title="More Like This" movies={similarMovies} />}

      <MobileNav />
    </div>
  );
};

export default MovieDetail;
