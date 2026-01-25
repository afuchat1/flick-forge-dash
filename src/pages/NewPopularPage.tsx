import Header from "@/components/Header";
import NetflixRow from "@/components/NetflixRow";
import MobileNav from "@/components/MobileNav";
import { newReleases, trendingMovies, topRatedMovies } from "@/data/movies";

const NewPopularPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold">New & Popular</h1>
            <p className="text-muted-foreground">
              The latest releases and trending titles
            </p>
          </div>
        </div>

        <div className="space-y-0">
          <NetflixRow title="🔥 Trending This Week" movies={trendingMovies} />
          <NetflixRow title="✨ New Releases" movies={newReleases} />
          <NetflixRow title="🏆 Top Rated" movies={topRatedMovies} showRanks />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default NewPopularPage;
