import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import NetflixCard from "@/components/NetflixCard";
import { getMoviesByGenre, allGenres } from "@/data/movies";

const genreDescriptions: Record<string, string> = {
  "action": "Explosive sequences, heart-pounding chases, and adrenaline-fueled adventures await.",
  "adventure": "Epic journeys and exciting quests that take you to incredible places.",
  "animation": "Stunning animated stories that captivate audiences of all ages.",
  "biography": "True stories of remarkable individuals who shaped our world.",
  "comedy": "Laugh-out-loud moments and hilarious situations to brighten your day.",
  "crime": "Gripping tales of criminals, detectives, and the pursuit of justice.",
  "drama": "Powerful performances and emotionally resonant storytelling at its finest.",
  "fantasy": "Magical worlds, mythical creatures, and enchanting adventures.",
  "history": "Journey through time with stories from our past.",
  "horror": "Spine-chilling scares and terrifying tales for the brave.",
  "mystery": "Puzzling cases and enigmatic plots that keep you guessing.",
  "romance": "Heartwarming love stories that touch the soul.",
  "sci-fi": "Mind-bending concepts and futuristic visions of what could be.",
  "thriller": "Edge-of-your-seat suspense and nail-biting tension.",
  "war": "Powerful stories of conflict, courage, and the human spirit.",
};

const GenrePage = () => {
  const { genre } = useParams<{ genre: string }>();
  const genreName = genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : "";
  
  // Find the actual genre name (case-insensitive match)
  const actualGenre = allGenres.find(g => g.toLowerCase() === genre?.toLowerCase()) || genreName;
  const movies = getMoviesByGenre(actualGenre);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {/* Genre Header */}
          <div className="space-y-4 mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to browse
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-extrabold">{actualGenre} Movies</h1>
            <p className="text-muted-foreground max-w-2xl">
              {genreDescriptions[genre?.toLowerCase() || ""] || `Explore our collection of ${actualGenre} movies.`}
            </p>
            <p className="text-sm text-primary font-medium">{movies.length} movies available</p>
          </div>

          {/* Movies Grid */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie, index) => (
                <NetflixCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No movies found</h3>
              <p className="text-muted-foreground">Check back soon for more content!</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-3">
          <Link to="/" className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] font-medium">Search</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[10px] font-medium">Categories</span>
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

export default GenrePage;
