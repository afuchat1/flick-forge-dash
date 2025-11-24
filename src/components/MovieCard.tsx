import { Star, Play } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  title: string;
  image: string;
  rating: number;
  year: string;
}

const MovieCard = ({ title, image, rating, year }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative cursor-pointer transition-transform duration-300 hover:scale-105 animate-scale-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{year}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-foreground font-medium">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
