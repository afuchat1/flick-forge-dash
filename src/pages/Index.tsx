import Header from "@/components/Header";
import NetflixHero from "@/components/NetflixHero";
import NetflixRow from "@/components/NetflixRow";
import { trendingMovies, popularMovies, newReleases, allMovies } from "@/data/movies";

const Index = () => {
  // Create "Top 10" list
  const top10Movies = [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
  
  // Create genre-based lists
  const actionMovies = allMovies.filter(m => m.genre?.includes("Action") || m.genre?.includes("Thriller"));
  const dramaMovies = allMovies.filter(m => m.genre?.includes("Drama"));
  const sciFiMovies = allMovies.filter(m => m.genre?.includes("Sci-Fi"));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <NetflixHero />
        <div className="relative -mt-24 z-10 space-y-2 pb-16">
          <NetflixRow title="Trending Now" movies={trendingMovies} />
          <NetflixRow title="Top 10 in Your Country Today" movies={top10Movies} />
          <NetflixRow title="New Releases" movies={newReleases} />
          <NetflixRow title="Popular on FlickForge" movies={popularMovies} />
          <NetflixRow title="Action & Thriller" movies={actionMovies} />
          <NetflixRow title="Award-Winning Dramas" movies={dramaMovies} />
          <NetflixRow title="Sci-Fi Adventures" movies={sciFiMovies} />
        </div>
      </main>
    </div>
  );
};

export default Index;
