import { useState } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import NetflixCard from "@/components/NetflixCard";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

const MyListPage = () => {
  // Simulated saved movies (in real app, this would come from user data)
  const [savedMovies] = useState(allMovies.slice(0, 8));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold">My List</h1>
              <p className="text-muted-foreground">
                {savedMovies.length} saved items
              </p>
            </div>
          </div>

          {savedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {savedMovies.map((movie, index) => (
                <NetflixCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your list is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add movies and shows to watch later
              </p>
              <Link to="/">
                <Button>Browse Movies</Button>
              </Link>
            </div>
          )}

          {/* Downloads Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Download className="h-6 w-6" />
              Downloads
            </h2>
            <div className="glass-card rounded-2xl p-6 md:p-8 text-center">
              <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Download movies to watch offline</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Save your favorite content and watch without internet
              </p>
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default MyListPage;
