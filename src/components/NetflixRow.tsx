import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import NetflixCard from "./NetflixCard";
import { Movie } from "@/data/movies";

interface NetflixRowProps {
  title: string;
  movies: Movie[];
  showRanks?: boolean;
}

const NetflixRow = ({ title, movies, showRanks = false }: NetflixRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      const newScrollLeft = direction === "left" 
        ? rowRef.current.scrollLeft - scrollAmount 
        : rowRef.current.scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
      );
    }
  };

  return (
    <section 
      className="relative py-4 md:py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <div className="px-4 md:px-8 lg:px-12 mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground group cursor-pointer inline-flex items-center gap-2">
          {title}
          <span className={`text-primary text-sm font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
            Explore All →
          </span>
        </h2>
      </div>
      
      <div className="relative group/row">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 bottom-16 z-40 w-10 md:w-14 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center justify-center transition-all duration-300 ${
            showLeftArrow && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/20 transition-colors">
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </div>
        </button>

        {/* Movie Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 md:gap-3 overflow-x-scroll scrollbar-hide px-4 md:px-8 lg:px-12 pb-20"
        >
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className={`flex-shrink-0 ${showRanks ? 'w-[200px] md:w-[280px] lg:w-[320px]' : 'w-[200px] md:w-[260px] lg:w-[300px]'}`}
            >
              <NetflixCard movie={movie} index={index} showRank={showRanks} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 bottom-16 z-40 w-10 md:w-14 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-center transition-all duration-300 ${
            showRightArrow && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/20 transition-colors">
            <ChevronRight className="h-6 w-6 text-foreground" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default NetflixRow;
