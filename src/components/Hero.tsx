import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            The Dark Knight
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-primary font-semibold">98% Match</span>
            <span className="text-muted-foreground">2008</span>
            <span className="px-2 py-1 border border-muted-foreground text-muted-foreground text-xs">
              PG-13
            </span>
            <span className="text-muted-foreground">2h 32m</span>
          </div>
          <p className="text-lg text-foreground/90 max-w-xl">
            When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, 
            Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
            <Button size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/80">
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
