import { Link } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MovieRow from "@/components/MovieRow";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

const MyListPage = () => {
  const savedMovies = allMovies.slice(0, 8);
  const downloads = allMovies.slice(8, 12);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-14 pb-4">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold">My List</h1>
          <p className="text-xs text-muted-foreground">{savedMovies.length} saved</p>
        </div>

        {savedMovies.length > 0 ? (
          <>
            <MovieRow title="Saved Movies" movies={savedMovies} />
            <MovieRow title="Downloads" movies={downloads} />
          </>
        ) : (
          <div className="px-4 text-center py-12">
            <Plus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium mb-1">Your list is empty</p>
            <p className="text-xs text-muted-foreground mb-4">Add movies to watch later</p>
            <Link to="/"><Button size="sm">Browse Movies</Button></Link>
          </div>
        )}

        {/* Download Info */}
        <div className="px-4 mt-6">
          <div className="p-4 bg-card rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Download to watch offline</p>
                <p className="text-xs text-muted-foreground">Save content for when you're on the go</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default MyListPage;
