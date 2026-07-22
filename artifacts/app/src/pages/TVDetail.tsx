import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Star, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import AIInsights from "@/components/AIInsights";
import ContentMatcher from "@/components/ContentMatcher";
import StreamingProviders from "@/components/StreamingProviders";
import TrailerPlayer from "@/components/TrailerPlayer";
import { useTVDetails, useTVSeason, getImageUrl } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        await navigator.share({
          title: show.name,
          text: show.overview,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0 pt-24 md:pt-40">
        <Header />
        <div className="relative h-[50vh]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24 md:pt-40">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">TV Show not found</h1>
          <Link to="/" className="text-primary text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const trailer = show.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const cast = show.credits?.cast?.slice(0, 10) || [];
  const creator = show.created_by?.[0];
  const similarShows = show.similar?.results?.slice(0, 10) || [];
  const inWatchlist = isInWatchlist(show.id, "tv");
  const seasons = show.seasons?.filter((s: any) => s.season_number > 0) || [];
  const episodes = seasonData?.episodes || [];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 pt-24 md:pt-40">
      <Header />

      <div className="relative">
        <div className="h-[50vh] md:h-[60vh] w-full">
          <img
            src={getImageUrl(show.backdrop_path || show.poster_path, "w780")}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link to="/tv-shows" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>

          <h1 className="text-2xl md:text-4xl font-bold mb-2">{show.name}</h1>
          {show.tagline && (
            <p className="text-sm text-muted-foreground italic mb-2">{show.tagline}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(show.vote_average * 10)}%</span>
            <span>{show.first_air_date?.slice(0, 4)}</span>
            <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-primary fill-primary" />
              <span>{show.vote_average?.toFixed(1)}</span>
            </div>
          </div>

          {show.genres && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {show.genres.map((g: any) => (
                <span key={g.id} className="px-2 py-0.5 bg-secondary rounded text-[10px]">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={inWatchlist ? "default" : "secondary"}
              className={`h-9 px-4 font-semibold ${inWatchlist ? "bg-primary text-primary-foreground" : ""}`}
              onClick={handleToggleWatchlist}
            >
              {inWatchlist ? (
                <><Check className="mr-1.5 h-4 w-4" /> In My List</>
              ) : (
                <><Plus className="mr-1.5 h-4 w-4" /> Add to My List</>
              )}
            </Button>
            {trailer && (
              <TrailerPlayer
                trailerKey={trailer.key}
                title={show.name}
                watchPath={`/watch/tv/${show.id}?trailer=1`}
              />
            )}
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {show.overview && (
          <div>
            <h3 className="font-bold mb-1">Synopsis</h3>
            <p className="text-sm text-foreground/80">{show.overview}</p>
          </div>
        )}

        <StreamingProviders
          watchProviders={show["watch/providers"]}
          title={show.name}
        />

        <div className="grid grid-cols-2 gap-3 text-xs">
          {creator && (
            <div>
              <p className="text-muted-foreground">Created By</p>
              <p className="font-medium">{creator.name}</p>
            </div>
          )}
          {show.first_air_date && (
            <div>
              <p className="text-muted-foreground">First Aired</p>
              <p className="font-medium">{new Date(show.first_air_date).toLocaleDateString()}</p>
            </div>
          )}
          {show.number_of_episodes && (
            <div>
              <p className="text-muted-foreground">Episodes</p>
              <p className="font-medium">{show.number_of_episodes}</p>
            </div>
          )}
          {show.status && (
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{show.status}</p>
            </div>
          )}
          {show.networks?.[0] && (
            <div>
              <p className="text-muted-foreground">Network</p>
              <p className="font-medium">{show.networks[0].name}</p>
            </div>
          )}
          {show.original_language && (
            <div>
              <p className="text-muted-foreground">Language</p>
              <p className="font-medium uppercase">{show.original_language}</p>
            </div>
          )}
        </div>

        <AIInsights movie={show} />

        <ContentMatcher
          title={show.name}
          type="tv"
          genres={show.genres?.map((g: any) => g.name)}
          overview={show.overview}
        />

        {cast.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Cast</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {cast.map((actor: any) => (
                <Link
                  key={actor.id}
                  to={`/person/${actor.id}`}
                  className="flex-shrink-0 w-20 text-center group"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-card mb-1.5 ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <img
                      src={getImageUrl(actor.profile_path, "w185")}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium line-clamp-1 group-hover:text-primary transition-colors">{actor.name}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{actor.character}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {seasons.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Episodes</h3>
              <Select
                value={String(selectedSeason)}
                onValueChange={(val) => setSelectedSeason(Number(val))}
              >
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="Select Season" />
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

            {seasonLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {episodes.map((episode: any) => (
                  <button
                    key={episode.id}
                    onClick={() => trailer && navigate(`/watch/tv/${id}`)}
                    disabled={!trailer}
                    title={trailer ? "Play show trailer" : undefined}
                    className="flex-shrink-0 w-44 text-left animate-fade-in group touch-manipulation disabled:cursor-default"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(episode.still_path, "w342")}
                        alt={episode.name}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      {trailer && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg">
                          <div className="w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-4 w-4 text-primary-foreground ml-0.5" fill="currentColor" />
                          </div>
                          <span className="text-[9px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity px-1 text-center">
                            Play show trailer
                          </span>
                        </div>
                      )}
                      {episode.vote_average > 0 && (
                        <div className="absolute bottom-1 left-1 flex items-center gap-0.5 px-1 py-0.5 rounded bg-background/80 text-[10px]">
                          <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                          {episode.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="mt-1.5">
                      <p className="text-xs font-medium line-clamp-1">
                        {episode.episode_number}. {episode.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        {episode.runtime && <span>{episode.runtime} min</span>}
                        {episode.air_date && <span>{episode.air_date.slice(0, 4)}</span>}
                      </div>
                      {episode.overview && (
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                          {episode.overview}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {trailer && (
          <div>
            <h3 className="font-bold mb-2">Trailer</h3>
            <TrailerPlayer trailerKey={trailer.key} title={show.name} inline />
          </div>
        )}
      </div>

      {similarShows.length > 0 && (
        <TMDBContentRow title="More Like This" movies={similarShows} />
      )}

      <MobileNav />
    </div>
  );
};

export default TVDetail;
