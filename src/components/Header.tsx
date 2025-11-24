import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-primary">MOVIEBOX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Movies</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">TV Shows</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">New & Popular</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search movies..." 
              className="pl-10 w-64 bg-secondary border-border"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
