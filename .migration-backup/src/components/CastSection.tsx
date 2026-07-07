import { CastMember } from "@/data/movies";

interface CastSectionProps {
  cast: CastMember[];
}

const CastSection = ({ cast }: CastSectionProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Cast & Crew</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {cast.map((member) => (
          <div
            key={member.id}
            className="group glass-card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
            <div className="p-3 space-y-0.5">
              <p className="font-semibold text-sm text-foreground line-clamp-1">{member.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{member.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastSection;
