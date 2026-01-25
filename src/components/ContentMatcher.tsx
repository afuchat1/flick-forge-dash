import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useContentMatcher } from "@/hooks/useContentMatcher";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
        <h3 className="text-sm font-semibold">If you like this, you'll love...</h3>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-card/50 border border-border">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3 mt-1" />
            </div>
          ))}
        </div>
      ) : data?.matches && data.matches.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.matches.slice(0, 6).map((match, index) => (
            <Link
              key={index}
              to={`/search?q=${encodeURIComponent(match.title)}`}
              className="group p-3 rounded-lg bg-gradient-to-br from-card/80 to-card/40 border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {match.title}
                </h4>
                <Badge 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary flex-shrink-0"
                >
                  {match.matchScore}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {match.reason}
              </p>
              <div className="flex gap-1 flex-wrap">
                {match.sharedThemes.slice(0, 2).map((theme) => (
                  <span
                    key={theme}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default ContentMatcher;
