import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Download, Share2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import StreamingProviders from "@/components/StreamingProviders";
import { useMovieDetails, getImageUrl } from "@/hooks/useTMDB";
import { useDownload } from "@/hooks/useDownload";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading } = useMovieDetails(Number(id));
  const { startDownload, isDownloading, isDownloaded, getProgress } = useDownload();
  const [isInList, setIsInList] = useState(false);

  const handlePlay = () => {
    navigate(`/player/movie/${id}`);
  };

  const handleDownload = () => {
    if (movie) {
      startDownload(
        movie.id,
        movie.title,
        getImageUrl(movie.poster_path, "w185")
      );
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
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
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
  const watchProviders = movie["watch/providers"]?.results?.US || movie["watch/providers"]?.results?.GB;
  const downloading = isDownloading(movie.id);
  const downloaded = isDownloaded(movie.id);
  const progress = getProgress(movie.id);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
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
          
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(movie.vote_average * 10)}%</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">HD</span>
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

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="bg-foreground text-background h-9 px-5 font-semibold"
              onClick={handlePlay}
            >
              <Play className="mr-1.5 h-4 w-4" fill="currentColor" /> Play
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className={`h-9 px-4 ${downloaded ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> {Math.round(progress)}%
                </>
              ) : downloaded ? (
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
              className={`h-9 w-9 p-0 ${isInList ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => {
                setIsInList(!isInList);
                toast.success(isInList ? "Removed from My List" : "Added to My List");
              }}
            >
              {isInList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {movie.overview && (
          <p className="text-sm text-foreground/80">{movie.overview}</p>
        )}

        {cast.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground mb-1">Cast</h3>
            <p className="text-sm">{cast.map((c: any) => c.name).join(", ")}</p>
          </div>
        )}

        <StreamingProviders providers={watchProviders} />

        {trailer && (
          <div>
            <h3 className="font-bold mb-2">Trailer</h3>
            <div className="aspect-video rounded-md overflow-hidden bg-card">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
              />
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
