import { Play, Plus, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface FeaturedBannerProps {
  movie: Movie;
  variant?: "left" | "right";
}

const FeaturedBanner = ({ movie, variant = "left" }: FeaturedBannerProps) => {
  if (!movie) return null;
  
  const isRight = variant === "right";
  
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] my-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-${isRight ? 'l' : 'r'} from-background via-background/80 to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className={`relative h-full container mx-auto px-4 md:px-8 lg:px-12 flex items-center ${isRight ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xl space-y-4 ${isRight ? 'text-right' : 'text-left'}`}>
          {/* Badge */}
          <div className={`flex items-center gap-2 ${isRight ? 'justify-end' : 'justify-start'}`}>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </span>
            <span className="text-primary font-bold">{Math.round(movie.rating * 10)}% Match</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
            {movie.title}
          </h2>

          <div className={`flex flex-wrap gap-2 text-sm ${isRight ? 'justify-end' : 'justify-start'}`}>
            {movie.genre?.map((g) => (
              <span key={g} className="text-muted-foreground">
                {g}
              </span>
            ))}
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{movie.year}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{movie.duration}</span>
          </div>

          <p className="text-sm md:text-base text-foreground/80 line-clamp-2 md:line-clamp-3">
            {movie.description}
          </p>

          <div className={`flex flex-wrap gap-3 pt-2 ${isRight ? 'justify-end' : 'justify-start'}`}>
            <Link to={`/movie/${movie.id}`}>
              <Button className="bg-foreground text-background hover:bg-foreground/90 font-bold">
                <Play className="mr-2 h-4 w-4" fill="currentColor" />
                Play Now
              </Button>
            </Link>
            <Button variant="secondary" className="glass">
              <Plus className="mr-2 h-4 w-4" />
              My List
            </Button>
            <Button variant="secondary" className="glass">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Link to={`/movie/${movie.id}`}>
              <Button variant="secondary" className="glass">
                <Info className="mr-2 h-4 w-4" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
