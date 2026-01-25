import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import ContentRow from "@/components/ContentRow";
import MobileNav from "@/components/MobileNav";
import { allMovies, dramaMovies, sciFiMovies, actionMovies } from "@/data/movies";

const tvShows = allMovies.slice(0, 20);

const TVShowsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <CategoryTabs />
        
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">TV Shows</h1>
          <p className="text-xs text-muted-foreground">{tvShows.length} series available</p>
        </div>

        <div className="px-3 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {tvShows.slice(0, 9).map((show) => (
              <Link key={show.id} to={`/movie/${show.id}`}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                  <img src={show.image} alt={show.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium mt-1 line-clamp-1">{show.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <ContentRow title="Popular Series" movies={tvShows.slice(0, 8)} href="/tv-shows" />
        <ContentRow title="Drama Series" movies={dramaMovies} href="/genre/drama" />
        <ContentRow title="Sci-Fi Series" movies={sciFiMovies} href="/genre/sci-fi" />
        <ContentRow title="Action Series" movies={actionMovies} href="/genre/action" />
      </main>

      <MobileNav />
    </div>
  );
};

export default TVShowsPage;
