import Header from "@/components/Header";
import NetflixHero from "@/components/NetflixHero";
import NetflixRow from "@/components/NetflixRow";
import { trendingMovies, popularMovies, newReleases, allMovies } from "@/data/movies";

const Index = () => {
  // Create curated lists
  const top10Movies = [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const actionMovies = allMovies.filter(m => m.genre?.includes("Action") || m.genre?.includes("Thriller"));
  const dramaMovies = allMovies.filter(m => m.genre?.includes("Drama"));
  const sciFiMovies = allMovies.filter(m => m.genre?.includes("Sci-Fi"));
  const continueWatching = allMovies.slice(0, 4);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <NetflixHero />
        
        {/* Content Rows */}
        <div className="relative -mt-20 md:-mt-32 z-10 space-y-0 pb-16">
          <NetflixRow title="Continue Watching for You" movies={continueWatching} />
          <NetflixRow title="Trending Now" movies={trendingMovies} />
          <NetflixRow title="Top 10 in Your Country Today" movies={top10Movies} showRanks />
          <NetflixRow title="New Releases" movies={newReleases} />
          <NetflixRow title="Popular on FlickForge" movies={popularMovies} />
          <NetflixRow title="Action & Thriller" movies={actionMovies} />
          <NetflixRow title="Award-Winning Dramas" movies={dramaMovies} />
          <NetflixRow title="Sci-Fi Adventures" movies={sciFiMovies} />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-primary">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] font-medium">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-[10px] font-medium">Downloads</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
