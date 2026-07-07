import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Star, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import AIInsights from "@/components/AIInsights";
import ContentMatcher from "@/components/ContentMatcher";
import { useMovieDetails, getImageUrl } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading } = useMovieDetails(Number(id));
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

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
        await navigator.share({
          title: movie.title,
          text: movie.overview,
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
  const director = movie.credits?.crew?.find((c: any) => c.job === "Director");
  const similarMovies = movie.similar?.results?.slice(0, 10) || [];
  const inWatchlist = isInWatchlist(movie.id, "movie");

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
          {movie.tagline && (
            <p className="text-sm text-muted-foreground italic mb-2">{movie.tagline}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(movie.vote_average * 10)}%</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            {movie.runtime ? <span>{movie.runtime} min</span> : null}
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
              className={`h-9 px-4 font-semibold ${inWatchlist ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}
              onClick={handleToggleWatchlist}
            >
              {inWatchlist ? (
                <><Check className="mr-1.5 h-4 w-4" /> In My List</>
              ) : (
                <><Plus className="mr-1.5 h-4 w-4" /> Add to My List</>
              )}
            </Button>
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {movie.overview && (
          <div>
            <h3 className="font-bold mb-1">Synopsis</h3>
            <p className="text-sm text-foreground/80">{movie.overview}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          {director && (
            <div>
              <p className="text-muted-foreground">Director</p>
              <p className="font-medium">{director.name}</p>
            </div>
          )}
          {movie.release_date && (
            <div>
              <p className="text-muted-foreground">Release Date</p>
              <p className="font-medium">{new Date(movie.release_date).toLocaleDateString()}</p>
            </div>
          )}
          {movie.original_language && (
            <div>
              <p className="text-muted-foreground">Language</p>
              <p className="font-medium uppercase">{movie.original_language}</p>
            </div>
          )}
          {movie.production_countries?.[0] && (
            <div>
              <p className="text-muted-foreground">Country</p>
              <p className="font-medium">{movie.production_countries[0].name}</p>
            </div>
          )}
          {movie.budget > 0 && (
            <div>
              <p className="text-muted-foreground">Budget</p>
              <p className="font-medium">${movie.budget.toLocaleString()}</p>
            </div>
          )}
          {movie.revenue > 0 && (
            <div>
              <p className="text-muted-foreground">Revenue</p>
              <p className="font-medium">${movie.revenue.toLocaleString()}</p>
            </div>
          )}
        </div>

        <AIInsights movie={movie} />

        <ContentMatcher
          title={movie.title}
          type="movie"
          genres={movie.genres?.map((g: any) => g.name)}
          overview={movie.overview}
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

        {trailer && (
          <div>
            <h3 className="font-bold mb-2">Trailer</h3>
            <div className="aspect-video rounded-md overflow-hidden bg-card">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                title={`${movie.title} trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
