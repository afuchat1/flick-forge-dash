import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Download, Share2, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import VideoPlayer from "@/components/VideoPlayer";
import AddVideoLinkModal from "@/components/AddVideoLinkModal";
import AIInsights from "@/components/AIInsights";
import { useMovieDetails, getImageUrl } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useDownloads } from "@/hooks/useDownloads";
import { useAuth } from "@/hooks/useAuth";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useVideoLink } from "@/hooks/useVideoLinks";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const { data: movie, isLoading } = useMovieDetails(Number(id));
  const { data: videoLink } = useVideoLink(Number(id), "movie");
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isDownloaded, startDownload } = useDownloads();
  const { currentVideo, playVideo, closeVideo } = useVideoPlayer();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Track recently viewed
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

  const handlePlay = () => {
    // Priority: Admin-provided video > YouTube trailer
    if (videoLink?.video_url) {
      playVideo(videoLink.video_url, movie?.title || "Movie");
    } else {
      const trailer = movie?.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) {
        playVideo(trailer.key, movie?.title || "Movie");
      } else {
        toast.info("No video available for this movie");
      }
    }
  };

  const handleDownload = () => {
    if (!user) {
      toast.error("Please sign in to download");
      navigate("/auth");
      return;
    }
    
    if (movie) {
      startDownload({
        tmdb_id: movie.id,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });
    }
  };

  const handleToggleWatchlist = () => {
    if (!user) {
      toast.error("Please sign in to add to your list");
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
        await navigator.share({
          title: movie.title,
          text: movie.overview,
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Movie not found</h1>
          <Link to="/" className="text-primary text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const similarMovies = movie.similar?.results?.slice(0, 10) || [];
  const inWatchlist = isInWatchlist(movie.id, "movie");
  const downloaded = isDownloaded(movie.id, "movie");
  const hasFullMovie = !!videoLink?.video_url;

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
      {showAddVideoModal && movie && (
        <AddVideoLinkModal
          tmdbId={movie.id}
          mediaType="movie"
          title={movie.title}
          onClose={() => setShowAddVideoModal(false)}
        />
      )}
      
      <div className="relative">
        <div className="h-[50vh] md:h-[60vh] w-full">
          <img 
            src={getImageUrl(movie.backdrop_path || movie.poster_path, "w780")} 
            alt={movie.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-4xl font-bold">{movie.title}</h1>
            {hasFullMovie && (
              <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">
                Full Movie
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(movie.vote_average * 10)}%</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">
              {videoLink?.quality || "HD"}
            </span>
            <span>{movie.runtime} min</span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-primary fill-primary" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>

          {movie.genres && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {movie.genres.map((g: any) => (
                <Link key={g.id} to={`/genre/${g.id}`} className="px-2 py-0.5 bg-secondary rounded text-[10px]">
                  {g.name}
                </Link>
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
              {hasFullMovie ? "Watch Movie" : "Play Trailer"}
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
                {hasFullMovie ? "Update Link" : "Add Video"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {movie.overview && (
          <p className="text-sm text-foreground/80">{movie.overview}</p>
        )}

        {/* AI-Powered Insights */}
        <AIInsights movie={movie} />

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

        {/* Video Player Section */}
        {(hasFullMovie || trailer) && (
          <div>
            <h3 className="font-bold mb-2">
              {hasFullMovie ? "Watch Full Movie" : "Trailer"}
            </h3>
            <div 
              className="aspect-video rounded-md overflow-hidden bg-card relative group cursor-pointer"
              onClick={handlePlay}
            >
              <img
                src={`https://img.youtube.com/vi/${hasFullMovie ? videoLink.video_url : trailer?.key}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center group-hover:bg-background/60 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-primary-foreground fill-current ml-1" />
                </div>
              </div>
              {hasFullMovie && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-primary-foreground text-[10px]">
                    {videoLink.quality}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {movie.reviews?.results?.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Reviews</h3>
            <div className="space-y-2">
              {movie.reviews.results.slice(0, 3).map((review: any) => (
                <div key={review.id} className="p-3 bg-card rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{review.author}</span>
                    {review.author_details?.rating && (
                      <div className="flex items-center gap-0.5 text-xs">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        <span>{review.author_details.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {similarMovies.length > 0 && (
        <TMDBContentRow title="More Like This" movies={similarMovies} />
      )}

      <MobileNav />
    </div>
  );
};

export default MovieDetail;
