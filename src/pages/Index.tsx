import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCards from "@/components/CategoryCards";
import ContentRow from "@/components/ContentRow";
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
  const popularSeries = allMovies.slice(8, 16);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-12">
        <CategoryTabs />
        <HeroCarousel />
        <CategoryCards />
        
        <div className="space-y-1">
          <ContentRow title="Popular Series" movies={popularSeries} href="/tv-shows" />
          <ContentRow title="Continue Watching" movies={continueWatching} href="/my-list" />
          <ContentRow title="Top 10 Today" movies={topRatedMovies} showRanks href="/new-popular" />
          <ContentRow title="Trending Now" movies={trendingMovies} href="/new-popular" />
          <ContentRow title="New Releases" movies={newReleases} href="/movies" />
          <ContentRow title="Action Movies" movies={actionMovies} href="/genre/action" />
          <ContentRow title="Drama" movies={dramaMovies} href="/genre/drama" />
          <ContentRow title="Sci-Fi" movies={sciFiMovies} href="/genre/sci-fi" />
          <ContentRow title="Comedy" movies={comedyMovies} href="/genre/comedy" />
          <ContentRow title="Horror" movies={horrorMovies} href="/genre/horror" />
          <ContentRow title="Romance" movies={romanceMovies} href="/genre/romance" />
          <ContentRow title="Animation" movies={animationMovies} href="/genre/animation" />
          <ContentRow title="Popular on AfuChat" movies={popularMovies} href="/movies" />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
