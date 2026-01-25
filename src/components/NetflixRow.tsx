import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import NetflixCard from "./NetflixCard";
import { Movie } from "@/data/movies";

interface NetflixRowProps {
  title: string;
  movies: Movie[];
}

const NetflixRow = ({ title, movies }: NetflixRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
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
    <section className="relative space-y-2 group/row py-4">
      <h2 className="text-xl font-bold text-foreground px-4 md:px-12 hover:text-foreground/80 cursor-pointer transition-colors">
        {title}
        <span className="inline-block ml-1 opacity-0 group-hover/row:opacity-100 transition-opacity text-primary text-sm">
          Explore All →
        </span>
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-background/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-background/90"
          >
            <ChevronLeft className="h-8 w-8 text-foreground" />
          </button>
        )}

        {/* Movie Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-scroll scrollbar-hide px-4 md:px-12 pb-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[250px] md:w-[300px]">
              <NetflixCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-background/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-background/90"
          >
            <ChevronRight className="h-8 w-8 text-foreground" />
          </button>
        )}
      </div>
    </section>
  );
};

export default NetflixRow;
