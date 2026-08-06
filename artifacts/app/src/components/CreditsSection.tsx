import { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/hooks/useTMDB";

interface CreditsSectionProps {
  cast: any[];
  crew: any[];
}

const DEPARTMENT_ORDER = [
  "Directing",
  "Writing",
  "Production",
  "Camera",
  "Editing",
  "Sound",
  "Art",
  "Costume & Make-Up",
  "Visual Effects",
  "Lighting",
  "Crew",
];

/** Full cast grid plus the complete crew, grouped by department. */
const CreditsSection = ({ cast = [], crew = [] }: CreditsSectionProps) => {
  const [showAllCast, setShowAllCast] = useState(false);
  const [showCrew, setShowCrew] = useState(false);

  const visibleCast = showAllCast ? cast : cast.slice(0, 12);

  const crewByDept = crew.reduce<Record<string, any[]>>((acc, member) => {
    const dept = member.department || "Crew";
    if (!acc[dept]) acc[dept] = [];
    // de-dupe the same person appearing twice in a department
    if (!acc[dept].some((m) => m.id === member.id && m.job === member.job)) {
      acc[dept].push(member);
    }
    return acc;
  }, {});

  const departments = Object.keys(crewByDept).sort(
    (a, b) => (DEPARTMENT_ORDER.indexOf(a) + 1 || 99) - (DEPARTMENT_ORDER.indexOf(b) + 1 || 99),
  );

  if (cast.length === 0 && crew.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="section-title">Cast &amp; Crew</h2>

      {cast.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {visibleCast.map((actor) => (
              <Link
                key={`${actor.id}-${actor.credit_id}`}
                to={`/person/${actor.id}`}
                className="group text-left"
              >
                <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-secondary ring-1 ring-border transition-all group-hover:ring-primary">
                  <img
                    src={getImageUrl(actor.profile_path, "w185")}
                    alt={actor.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-1.5 text-xs font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {actor.name}
                </p>
                {actor.character && (
                  <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
                    as {actor.character}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {cast.length > 12 && (
            <button
              onClick={() => setShowAllCast((v) => !v)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {showAllCast ? "Show fewer" : `Show all ${cast.length} cast members`}
            </button>
          )}
        </div>
      )}

      {departments.length > 0 && (
        <div className="fact-panel p-3.5">
          <button
            onClick={() => setShowCrew((v) => !v)}
            className="flex w-full items-center justify-between text-sm font-semibold"
          >
            <span>Full crew ({crew.length})</span>
            <span className="text-primary text-xs">{showCrew ? "Hide" : "Show"}</span>
          </button>

          {showCrew && (
            <div className="mt-3 space-y-4">
              {departments.map((dept) => (
                <div key={dept}>
                  <p className="fact-label mb-1.5">{dept}</p>
                  <ul className="space-y-1">
                    {crewByDept[dept].map((m) => (
                      <li key={m.credit_id} className="flex justify-between gap-4 text-sm">
                        <Link to={`/person/${m.id}`} className="hover:text-primary transition-colors">
                          {m.name}
                        </Link>
                        <span className="text-muted-foreground text-xs text-right shrink-0">{m.job}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CreditsSection;
