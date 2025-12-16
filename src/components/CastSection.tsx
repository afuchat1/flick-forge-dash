import { CastMember } from "@/data/movies";

interface CastSectionProps {
  cast: CastMember[];
}

const CastSection = ({ cast }: CastSectionProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cast.map((member) => (
          <div 
            key={member.id} 
            className="group cursor-pointer"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-card mb-3">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="font-semibold text-foreground line-clamp-1">{member.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{member.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CastSection;
