import Header from "@/components/Header";
import NetflixHero from "@/components/NetflixHero";
import NetflixRow from "@/components/NetflixRow";
import GenreShowcase from "@/components/GenreShowcase";
import FeaturedBanner from "@/components/FeaturedBanner";
import { 
  trendingMovies, 
  popularMovies, 
  newReleases, 
  topRatedMovies,
  allMovies,
  actionMovies,
  dramaMovies,
  sciFiMovies,
  thrillerMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  animationMovies,
  fantasyMovies,
  crimeMovies,
  mysteryMovies,
  warMovies
} from "@/data/movies";

const Index = () => {
  // Continue watching (simulated)
  const continueWatching = allMovies.slice(0, 6);
  
  // My List (simulated)
  const myList = allMovies.slice(10, 16);
  
  // Because you watched (simulated)
  const becauseYouWatched = allMovies.slice(20, 26);
  
  // Award Winners
  const awardWinners = allMovies.filter(m => m.rating >= 8.5);
  
  // 90s Classics
  const classicMovies = allMovies.filter(m => parseInt(m.year) < 2000);
  
  // Recent Hits
  const recentHits = allMovies.filter(m => parseInt(m.year) >= 2020);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <NetflixHero />
        
        {/* Content Rows */}
        <div className="relative -mt-20 md:-mt-32 z-10 pb-24 md:pb-16">
          {/* Continue Watching */}
          <NetflixRow title="Continue Watching for You" movies={continueWatching} />
          
          {/* Trending */}
          <NetflixRow title="🔥 Trending Now" movies={trendingMovies} />
          
          {/* Top 10 */}
          <NetflixRow title="Top 10 Movies Today" movies={topRatedMovies} showRanks />
          
          {/* Featured Banner */}
          <FeaturedBanner movie={popularMovies[2] || allMovies[0]} />
          
          {/* New Releases */}
          <NetflixRow title="✨ New Releases" movies={newReleases} />
          
          {/* Genre Showcase */}
          <GenreShowcase />
          
          {/* Action */}
          <NetflixRow title="💥 Action & Adventure" movies={actionMovies} />
          
          {/* My List */}
          <NetflixRow title="My List" movies={myList} />
          
          {/* Sci-Fi */}
          <NetflixRow title="🚀 Sci-Fi Epics" movies={sciFiMovies} />
          
          {/* Featured Banner 2 */}
          <FeaturedBanner movie={allMovies[35]} variant="right" />
          
          {/* Thriller */}
          <NetflixRow title="😱 Thrillers" movies={thrillerMovies} />
          
          {/* Drama */}
          <NetflixRow title="🎭 Award-Winning Dramas" movies={dramaMovies} />
          
          {/* Comedy */}
          <NetflixRow title="😂 Comedy Hits" movies={comedyMovies} />
          
          {/* Horror */}
          <NetflixRow title="👻 Horror & Suspense" movies={horrorMovies} />
          
          {/* Romance */}
          <NetflixRow title="💕 Romance" movies={romanceMovies} />
          
          {/* Animation */}
          <NetflixRow title="🎨 Animation Masterpieces" movies={animationMovies} />
          
          {/* Because You Watched */}
          <NetflixRow title="Because You Watched Inception" movies={becauseYouWatched} />
          
          {/* Fantasy */}
          <NetflixRow title="🧙 Fantasy & Adventure" movies={fantasyMovies} />
          
          {/* Crime */}
          <NetflixRow title="🔍 Crime & Mystery" movies={[...crimeMovies, ...mysteryMovies]} />
          
          {/* Award Winners */}
          <NetflixRow title="🏆 Award Winners" movies={awardWinners} />
          
          {/* Classics */}
          <NetflixRow title="📼 Timeless Classics" movies={classicMovies} />
          
          {/* War */}
          <NetflixRow title="⚔️ War & History" movies={warMovies} />
          
          {/* Recent Hits */}
          <NetflixRow title="🎬 Recent Blockbusters" movies={recentHits} />
          
          {/* Popular */}
          <NetflixRow title="🌟 Popular on FlickForge" movies={popularMovies} />
          
          {/* All Movies */}
          <NetflixRow title="📚 Explore All Movies" movies={allMovies} />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[10px] font-medium">Categories</span>
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
