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
    <div className="relative w-full h-[45vh] md:h-[55vh] my-6 md:my-8 overflow-hidden">
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
      <div className={`relative h-full container mx-auto px-4 md:px-6 lg:px-8 flex items-center ${isRight ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-lg space-y-3 md:space-y-4 ${isRight ? 'text-right' : 'text-left'}`}>
          {/* Badge */}
          <div className={`flex items-center gap-2 ${isRight ? 'justify-end' : 'justify-start'}`}>
            <span className="bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
              FEATURED
            </span>
            <span className="text-primary font-bold text-xs md:text-sm">{Math.round(movie.rating * 10)}% Match</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {movie.title}
          </h2>

          <div className={`flex flex-wrap gap-1.5 md:gap-2 text-xs md:text-sm ${isRight ? 'justify-end' : 'justify-start'}`}>
            {movie.genre?.slice(0, 3).map((g) => (
              <span key={g} className="text-muted-foreground">{g}</span>
            ))}
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{movie.year}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{movie.duration}</span>
          </div>

          <p className="text-xs md:text-sm text-foreground/80 line-clamp-2">
            {movie.description}
          </p>

          <div className={`flex flex-wrap gap-2 pt-1 ${isRight ? 'justify-end' : 'justify-start'}`}>
            <Link to={`/movie/${movie.id}`}>
              <Button className="bg-foreground text-background hover:bg-foreground/90 font-bold text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
                <Play className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" />
                Play
              </Button>
            </Link>
            <Button variant="secondary" className="glass text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
              <Plus className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">My List</span>
            </Button>
            <Button variant="secondary" className="glass text-xs md:text-sm h-8 md:h-10 px-3 md:px-4 hidden sm:flex">
              <Download className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              Download
            </Button>
            <Link to={`/movie/${movie.id}`}>
              <Button variant="secondary" className="glass text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
                <Info className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">More Info</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
