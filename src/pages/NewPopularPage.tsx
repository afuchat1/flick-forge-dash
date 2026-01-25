import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import ContentRow from "@/components/ContentRow";
import MobileNav from "@/components/MobileNav";
import { trendingMovies, newReleases, topRatedMovies, popularMovies } from "@/data/movies";

const NewPopularPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <CategoryTabs />
        
        <div className="px-3 py-3">
          <h1 className="text-xl font-bold">New & Popular</h1>
          <p className="text-xs text-muted-foreground">What's hot right now</p>
        </div>

        <div className="px-3 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {trendingMovies.slice(0, 6).map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium mt-1 line-clamp-1">{movie.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <ContentRow title="Top 10 Today" movies={topRatedMovies} showRanks href="/new-popular" />
        <ContentRow title="New Releases" movies={newReleases} href="/movies" />
        <ContentRow title="Trending Now" movies={trendingMovies} href="/new-popular" />
        <ContentRow title="Popular on AfuChat" movies={popularMovies} href="/movies" />
      </main>

      <MobileNav />
    </div>
  );
};

export default NewPopularPage;
