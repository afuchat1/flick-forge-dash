import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useContentMatcher } from "@/hooks/useContentMatcher";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentMatcherProps {
  title: string;
  type: string;
  genres?: string[];
  overview?: string;
}

const ContentMatcher = ({ title, type, genres, overview }: ContentMatcherProps) => {
  const { data, isLoading, error } = useContentMatcher({
    title,
    type,
    genres,
    overview,
  });

  if (error) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">You might also like</h3>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-36">
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : data?.matches && data.matches.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {data.matches.slice(0, 6).map((match, index) => (
            <Link
              key={index}
              to={`/search?q=${encodeURIComponent(match.title)}`}
              className="flex-shrink-0 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-44 p-3 rounded-lg bg-gradient-to-br from-card to-card/60 border border-border hover:border-primary/50 transition-all hover:scale-[1.02]">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-xs line-clamp-1 group-hover:text-primary transition-colors">
                    {match.title}
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/20 text-primary flex-shrink-0">
                    {match.matchScore}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">
                  {match.reason}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {match.sharedThemes.slice(0, 2).map((theme) => (
                    <span
                      key={theme}
                      className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default ContentMatcher;
