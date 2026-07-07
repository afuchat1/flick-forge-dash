import { Sparkles, Lightbulb, Heart, Loader2 } from "lucide-react";
import { useMovieInsights, useMovieMood, toMovieData } from "@/hooks/useMovieInsights";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  movie: any;
  className?: string;
}

const AIInsights = ({ movie, className }: AIInsightsProps) => {
  const movieData = toMovieData(movie);
  const { data: insights, isLoading: insightsLoading } = useMovieInsights(movieData);
  const { data: mood, isLoading: moodLoading } = useMovieMood(movieData);

  const isLoading = insightsLoading || moodLoading;
  const hasContent = insights?.result || mood?.result;

  if (!hasContent && !isLoading) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mood Tag */}
      {mood?.result && (
        <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
          <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/90 italic leading-relaxed">
            {mood.result as string}
          </p>
        </div>
      )}

      {/* AI Insights */}
      {insights?.result && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="font-medium">AI Insights</span>
          </div>
          <div className="space-y-2">
            {(Array.isArray(insights.result) ? insights.result : [insights.result]).map((insight, i) => (
              <div 
                key={i} 
                className="flex items-start gap-2 p-2 bg-card/50 rounded-md"
              >
                <Lightbulb className="h-3.5 w-3.5 text-primary/70 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground/80 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !hasContent && (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Generating insights...</span>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
