import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Download, Share2, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import VideoPlayer from "@/components/VideoPlayer";
import AddVideoLinkModal from "@/components/AddVideoLinkModal";
import { useTVDetails, useTVSeason, getImageUrl } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useDownloads } from "@/hooks/useDownloads";
import { useAuth } from "@/hooks/useAuth";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useVideoLink } from "@/hooks/useVideoLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const { data: show, isLoading } = useTVDetails(Number(id));
  const { data: seasonData, isLoading: seasonLoading } = useTVSeason(Number(id), selectedSeason);
  const { data: videoLink } = useVideoLink(Number(id), "tv");
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isDownloaded, startDownload } = useDownloads();
  const { currentVideo, playVideo, closeVideo } = useVideoPlayer();

  const handlePlay = () => {
    // Priority: Admin-provided video > YouTube trailer
    if (videoLink?.video_url) {
      playVideo(videoLink.video_url, show?.name || "TV Show");
    } else {
      const trailer = show?.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) {
        playVideo(trailer.key, show?.name || "TV Show");
      } else {
        toast.info("No video available for this show");
      }
    }
  };

  const handleDownload = () => {
    if (!user) {
      toast.error("Please sign in to download");
      navigate("/auth");
      return;
    }
    
    if (show) {
      startDownload({
        tmdb_id: show.id,
        media_type: "tv",
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
        release_date: show.first_air_date,
      });
    }
  };

  const handleToggleWatchlist = () => {
    if (!user) {
      toast.error("Please sign in to add to your list");
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
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddVideoLink = () => {
    if (!user) {
      toast.error("Please sign in to add video links");
      navigate("/auth");
      return;
    }
    setShowAddVideoModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">TV Show not found</h1>
          <Link to="/" className="text-primary text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const trailer = show.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const cast = show.credits?.cast?.slice(0, 10) || [];
  const similarShows = show.similar?.results?.slice(0, 10) || [];
  const inWatchlist = isInWatchlist(show.id, "tv");
  const downloaded = isDownloaded(show.id, "tv");
  const seasons = show.seasons?.filter((s: any) => s.season_number > 0) || [];
  const episodes = seasonData?.episodes || [];
  const hasFullShow = !!videoLink?.video_url;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      {/* Video Player Modal */}
      {currentVideo && (
        <VideoPlayer
          videoKey={currentVideo.key}
          title={currentVideo.title}
          onClose={closeVideo}
        />
      )}

      {/* Add Video Link Modal */}
      {showAddVideoModal && show && (
        <AddVideoLinkModal
          tmdbId={show.id}
          mediaType="tv"
          title={show.name}
          onClose={() => setShowAddVideoModal(false)}
        />
      )}
      
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
          
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-4xl font-bold">{show.name}</h1>
            {hasFullShow && (
              <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">
                Full Show
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(show.vote_average * 10)}%</span>
            <span>{show.first_air_date?.slice(0, 4)}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">
              {videoLink?.quality || "HD"}
            </span>
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
              className="bg-foreground text-background h-9 px-5 font-semibold"
              onClick={handlePlay}
            >
              <Play className="mr-1.5 h-4 w-4" fill="currentColor" /> 
              {hasFullShow ? "Watch Show" : "Play Trailer"}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className={`h-9 px-4 ${downloaded ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={handleDownload}
              disabled={downloaded}
            >
              {downloaded ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" /> Downloaded
                </>
              ) : (
                <>
                  <Download className="mr-1.5 h-4 w-4" /> Download
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className={`h-9 w-9 p-0 ${inWatchlist ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={handleToggleWatchlist}
            >
              {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            {user && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 px-3"
                onClick={handleAddVideoLink}
              >
                <Link2 className="mr-1.5 h-4 w-4" /> 
                {hasFullShow ? "Update Link" : "Add Video"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {show.overview && (
          <p className="text-sm text-foreground/80">{show.overview}</p>
        )}

        {/* Cast Section with Photos */}
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

        {/* Seasons & Episodes Section */}
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
              <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                {episodes.map((episode: any) => (
                  <div 
                    key={episode.id}
                    className="flex gap-3 p-2 rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer"
                    onClick={handlePlay}
                  >
                    <div className="relative w-28 flex-shrink-0">
                      <img
                        src={getImageUrl(episode.still_path, "w342")}
                        alt={episode.name}
                        className="w-full aspect-video object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium line-clamp-1">
                            {episode.episode_number}. {episode.name}
                          </p>
                          {episode.runtime && (
                            <p className="text-[10px] text-muted-foreground">{episode.runtime} min</p>
                          )}
                        </div>
                        {episode.vote_average > 0 && (
                          <div className="flex items-center gap-0.5 text-[10px]">
                            <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                            {episode.vote_average.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                        {episode.overview || "No description available."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Player Section */}
        {(hasFullShow || trailer) && (
          <div>
            <h3 className="font-bold mb-2">
              {hasFullShow ? "Watch Full Show" : "Trailer"}
            </h3>
            <div 
              className="aspect-video rounded-md overflow-hidden bg-card relative group cursor-pointer"
              onClick={handlePlay}
            >
              <img
                src={`https://img.youtube.com/vi/${hasFullShow ? videoLink.video_url : trailer?.key}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center group-hover:bg-background/60 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-primary-foreground fill-current ml-1" />
                </div>
              </div>
              {hasFullShow && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-primary-foreground text-[10px]">
                    {videoLink.quality}
                  </Badge>
                </div>
              )}
            </div>
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
