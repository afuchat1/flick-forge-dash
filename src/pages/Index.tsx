import Header from "@/components/Header";
import NetflixHero from "@/components/NetflixHero";
import MovieRow from "@/components/MovieRow";
import GenreGrid from "@/components/GenreGrid";
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
  comedyMovies,
  horrorMovies,
  romanceMovies,
  animationMovies
} from "@/data/movies";

const Index = () => {
  const continueWatching = allMovies.slice(0, 8);
  const myList = allMovies.slice(8, 16);
  const recentlyAdded = allMovies.slice(16, 24);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <NetflixHero />
        
        <div className="space-y-1 mt-2">
          <MovieRow title="Continue Watching" movies={continueWatching} href="/my-list" />
          <MovieRow title="Trending Now" movies={trendingMovies} href="/new-popular" />
          <MovieRow title="Top 10 Today" movies={topRatedMovies} showRanks />
          <MovieRow title="New Releases" movies={newReleases} href="/movies" />
          
          <GenreGrid />
          
          <MovieRow title="Action" movies={actionMovies} href="/genre/action" />
          <MovieRow title="My List" movies={myList} href="/my-list" />
          <MovieRow title="Sci-Fi" movies={sciFiMovies} href="/genre/sci-fi" />
          <MovieRow title="Drama" movies={dramaMovies} href="/genre/drama" />
          <MovieRow title="Comedy" movies={comedyMovies} href="/genre/comedy" />
          <MovieRow title="Horror" movies={horrorMovies} href="/genre/horror" />
          <MovieRow title="Romance" movies={romanceMovies} href="/genre/romance" />
          <MovieRow title="Animation" movies={animationMovies} href="/genre/animation" />
          <MovieRow title="Popular on AfuChat" movies={popularMovies} href="/movies" />
          <MovieRow title="Recently Added" movies={recentlyAdded} href="/movies" />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
