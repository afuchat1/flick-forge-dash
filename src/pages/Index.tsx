import Header from "@/components/Header";
import NetflixHero from "@/components/NetflixHero";
import NetflixRow from "@/components/NetflixRow";
import GenreShowcase from "@/components/GenreShowcase";
import FeaturedBanner from "@/components/FeaturedBanner";
import MobileNav from "@/components/MobileNav";
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
  const continueWatching = allMovies.slice(0, 6);
  const myList = allMovies.slice(10, 16);
  const becauseYouWatched = allMovies.slice(20, 26);
  const awardWinners = allMovies.filter(m => m.rating >= 8.5);
  const classicMovies = allMovies.filter(m => parseInt(m.year) < 2000);
  const recentHits = allMovies.filter(m => parseInt(m.year) >= 2020);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <NetflixHero />
        
        <div className="relative -mt-16 md:-mt-24 z-10 pb-24 md:pb-16">
          <NetflixRow title="Continue Watching" movies={continueWatching} />
          <NetflixRow title="🔥 Trending Now" movies={trendingMovies} />
          <NetflixRow title="Top 10 Movies Today" movies={topRatedMovies} showRanks />
          
          <FeaturedBanner movie={popularMovies[2] || allMovies[0]} />
          
          <NetflixRow title="✨ New Releases" movies={newReleases} />
          
          <GenreShowcase />
          
          <NetflixRow title="💥 Action & Adventure" movies={actionMovies} />
          <NetflixRow title="My List" movies={myList} />
          <NetflixRow title="🚀 Sci-Fi Epics" movies={sciFiMovies} />
          
          <FeaturedBanner movie={allMovies[35]} variant="right" />
          
          <NetflixRow title="😱 Thrillers" movies={thrillerMovies} />
          <NetflixRow title="🎭 Award-Winning Dramas" movies={dramaMovies} />
          <NetflixRow title="😂 Comedy Hits" movies={comedyMovies} />
          <NetflixRow title="👻 Horror & Suspense" movies={horrorMovies} />
          <NetflixRow title="💕 Romance" movies={romanceMovies} />
          <NetflixRow title="🎨 Animation" movies={animationMovies} />
          <NetflixRow title="Because You Watched Inception" movies={becauseYouWatched} />
          <NetflixRow title="🧙 Fantasy & Adventure" movies={fantasyMovies} />
          <NetflixRow title="🔍 Crime & Mystery" movies={[...crimeMovies, ...mysteryMovies]} />
          <NetflixRow title="🏆 Award Winners" movies={awardWinners} />
          <NetflixRow title="📼 Timeless Classics" movies={classicMovies} />
          <NetflixRow title="⚔️ War & History" movies={warMovies} />
          <NetflixRow title="🎬 Recent Blockbusters" movies={recentHits} />
          <NetflixRow title="🌟 Popular on AfuChat" movies={popularMovies} />
          <NetflixRow title="📚 Explore All Movies" movies={allMovies} />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
