import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersonDetails, usePersonCredits, getPersonImageUrl } from "@/hooks/usePersonDetails";
import { getImageUrl } from "@/hooks/useTMDB";

const ActorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading: personLoading } = usePersonDetails(Number(id));
  const { data: credits, isLoading: creditsLoading } = usePersonCredits(Number(id));

  const isLoading = personLoading || creditsLoading;

  // Sort credits by popularity and filter out duplicates
  const sortedCast = credits?.cast
    ?.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id && t.media_type === item.media_type)
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 50) || [];

  const calculateAge = (birthday: string | null, deathday: string | null) => {
    if (!birthday) return null;
    const endDate = deathday ? new Date(deathday) : new Date();
    const birthDate = new Date(birthday);
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0 pt-14 md:pt-28">
        <Header />
        <div className="p-4 space-y-4">
          <Skeleton className="w-32 h-32 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-14 md:pt-28">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Person not found</h1>
          <Link to="/" className="text-primary text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 pt-14 md:pt-28">
      <Header />
      
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              src={getPersonImageUrl(person.profile_path, "w342")}
              alt={person.name}
              className="w-40 h-40 md:w-56 md:h-auto md:aspect-[2/3] rounded-xl object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{person.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground mb-4">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                {person.known_for_department}
              </span>
              
              {person.birthday && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(person.birthday).toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                  {age && !person.deathday && ` (${age} years old)`}
                </span>
              )}
              
              {person.deathday && (
                <span className="text-muted-foreground">
                  — Died {new Date(person.deathday).toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                  {age && ` (aged ${age})`}
                </span>
              )}
              
              {person.place_of_birth && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {person.place_of_birth}
                </span>
              )}
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="mb-4">
                <h2 className="font-bold mb-2">Biography</h2>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {person.biography.length > 800 
                    ? person.biography.slice(0, 800) + "..." 
                    : person.biography}
                </p>
              </div>
            )}

            {/* Also Known As */}
            {person.also_known_as?.length > 0 && (
              <div>
                <h3 className="text-xs text-muted-foreground mb-1">Also Known As</h3>
                <p className="text-sm">{person.also_known_as.slice(0, 5).join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Filmography */}
        <div>
          <h2 className="text-xl font-bold mb-4">Filmography ({sortedCast.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {sortedCast.map((credit) => (
              <Link
                key={`${credit.media_type}-${credit.id}`}
                to={credit.media_type === "movie" ? `/movie/${credit.id}` : `/tv/${credit.id}`}
                className="group"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card mb-2 relative">
                  <img
                    src={getImageUrl(credit.poster_path, "w342")}
                    alt={credit.title || credit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {credit.vote_average > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-xs">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      {credit.vote_average.toFixed(1)}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 bg-primary/80 text-primary-foreground rounded text-[10px] uppercase font-medium">
                      {credit.media_type}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {credit.title || credit.name}
                </h3>
                {credit.character && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    as {credit.character}
                  </p>
                )}
                {(credit.release_date || credit.first_air_date) && (
                  <p className="text-xs text-muted-foreground">
                    {(credit.release_date || credit.first_air_date)?.slice(0, 4)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default ActorDetail;
