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
      
      rowRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10);
    }
  };

  return (
    <section 
      className="relative py-3 md:py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <div className="px-4 md:px-6 lg:px-8 mb-2 md:mb-3">
        <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground group cursor-pointer inline-flex items-center gap-2">
          {title}
          <span className={`text-primary text-xs md:text-sm font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
            Explore All →
          </span>
        </h2>
      </div>
      
      <div className="relative group/row">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 bottom-12 md:bottom-14 z-40 w-8 md:w-12 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center justify-center transition-all duration-300 ${
            showLeftArrow && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/20 transition-colors">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
          </div>
        </button>

        {/* Movie Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 md:gap-3 overflow-x-scroll scrollbar-hide px-4 md:px-6 lg:px-8 pb-14 md:pb-16"
        >
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className={`flex-shrink-0 ${showRanks ? 'w-[160px] md:w-[220px] lg:w-[280px]' : 'w-[150px] md:w-[200px] lg:w-[260px]'}`}
            >
              <NetflixCard movie={movie} index={index} showRank={showRanks} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 bottom-12 md:bottom-14 z-40 w-8 md:w-12 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-center transition-all duration-300 ${
            showRightArrow && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/20 transition-colors">
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default NetflixRow;
