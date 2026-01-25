import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Header from "@/components/Header";
import ContentRow from "@/components/ContentRow";
import MobileNav from "@/components/MobileNav";
import { allMovies } from "@/data/movies";

const MyListPage = () => {
  const savedMovies = allMovies.slice(0, 8);
  const downloads = allMovies.slice(8, 14);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14">
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">My List</h1>
          <p className="text-xs text-muted-foreground">{savedMovies.length + downloads.length} saved</p>
        </div>

        {/* Saved Grid */}
        <div className="px-3 pb-4">
          <h2 className="text-sm font-semibold mb-2">Saved</h2>
          <div className="grid grid-cols-3 gap-2">
            {savedMovies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <ContentRow title="Downloads" movies={downloads} href="/my-list" />

        {/* Download Info */}
        <div className="px-3 mt-4">
          <div className="p-3 bg-card rounded-lg flex items-center gap-3">
            <Download className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Download to watch offline</p>
              <p className="text-xs text-muted-foreground">Save content for when you're on the go</p>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default MyListPage;
