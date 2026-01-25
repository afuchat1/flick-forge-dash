import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star, Download, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TMDBContentRow from "@/components/TMDBContentRow";
import { useTVDetails, getImageUrl } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";

const TVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: show, isLoading } = useTVDetails(Number(id));
  const [isInList, setIsInList] = useState(false);

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

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
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
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="text-primary font-semibold">{Math.round(show.vote_average * 10)}%</span>
            <span>{show.first_air_date?.slice(0, 4)}</span>
            <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">HD</span>
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

          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-foreground text-background h-9 px-5 font-semibold">
              <Play className="mr-1.5 h-4 w-4" fill="currentColor" /> Play
            </Button>
            <Button size="sm" variant="secondary" className="h-9 px-4">
              <Download className="mr-1.5 h-4 w-4" /> Download
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className={`h-9 w-9 p-0 ${isInList ? 'bg-primary' : ''}`}
              onClick={() => setIsInList(!isInList)}
            >
              {isInList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {show.overview && (
          <p className="text-sm text-foreground/80">{show.overview}</p>
        )}

        {cast.length > 0 && (
          <div>
            <h3 className="text-xs text-muted-foreground mb-1">Cast</h3>
            <p className="text-sm">{cast.map((c: any) => c.name).join(", ")}</p>
          </div>
        )}

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
      </div>

      {similarShows.length > 0 && (
        <TMDBContentRow title="More Like This" movies={similarShows} />
      )}

      <MobileNav />
    </div>
  );
};

export default TVDetail;
