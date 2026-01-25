import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import NetflixCard from "@/components/NetflixCard";
import MobileNav from "@/components/MobileNav";
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
  
  const actualGenre = allGenres.find(g => g.toLowerCase() === genre?.toLowerCase()) || genreName;
  const movies = getMoviesByGenre(actualGenre);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Genre Header */}
          <div className="space-y-3 md:space-y-4 mb-8">
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to categories
            </Link>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">{actualGenre} Movies</h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              {genreDescriptions[genre?.toLowerCase() || ""] || `Explore our collection of ${actualGenre} movies.`}
            </p>
            <p className="text-sm text-primary font-medium">{movies.length} movies available</p>
          </div>

          {/* Movies Grid */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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

      <MobileNav />
    </div>
  );
};

export default GenrePage;
