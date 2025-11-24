import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { trendingMovies, popularMovies, newReleases } from "@/data/movies";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Hero />
        <div className="container mx-auto space-y-8 pb-16">
          <MovieRow title="Trending Now" movies={trendingMovies} />
          <MovieRow title="Popular on MovieBox" movies={popularMovies} />
          <MovieRow title="New Releases" movies={newReleases} />
        </div>
      </main>
    </div>
  );
};

export default Index;
