import { useState } from "react";
import { Sparkles, Smile, Frown, Heart, Zap, Moon, Coffee, Flame, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const moods = [
  { id: "happy", label: "Happy", icon: Smile, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: "sad", label: "Emotional", icon: Frown, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  { id: "excited", label: "Excited", icon: Zap, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: "relaxed", label: "Relaxed", icon: Moon, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { id: "cozy", label: "Cozy", icon: Coffee, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "thrilled", label: "Thrilled", icon: Flame, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: "thoughtful", label: "Thoughtful", icon: Brain, color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
];

interface MoodSuggestion {
  title: string;
  reason: string;
  genres: string[];
}

const MoodMatcher = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const { data: suggestions, isLoading, isFetching } = useQuery({
    queryKey: ["mood-suggestions", selectedMood],
    queryFn: async () => {
      if (!selectedMood) return null;
      
      const { data, error } = await supabase.functions.invoke("mood-matcher", {
        body: { mood: selectedMood },
      });
      
      if (error) throw error;
      return data as { suggestions: MoodSuggestion[] };
    },
    enabled: !!selectedMood,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <section className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">How are you feeling?</h2>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          return (
            <Button
              key={mood.id}
              variant="outline"
              size="sm"
              onClick={() => setSelectedMood(isSelected ? null : mood.id)}
              className={`flex-shrink-0 gap-1.5 rounded-full border transition-all ${
                isSelected 
                  ? mood.color + " border-2" 
                  : "bg-card/50 border-border hover:bg-card"
              }`}
            >
              <Icon className="h-4 w-4" />
              {mood.label}
            </Button>
          );
        })}
      </div>

      {(isLoading || isFetching) && selectedMood && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Finding perfect matches for your mood...
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 bg-card/50 border-border">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </Card>
            ))}
          </div>
        </div>
      )}

      {suggestions && !isFetching && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Perfect picks for your <span className="text-primary font-medium">{moods.find(m => m.id === selectedMood)?.label}</span> mood:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestions.suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className="p-4 bg-gradient-to-br from-card/80 to-card/40 border-border hover:border-primary/50 transition-all cursor-pointer group"
              >
                <Link to={`/search?q=${encodeURIComponent(suggestion.title)}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {suggestion.reason}
                  </p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {suggestion.genres.slice(0, 2).map((genre) => (
                      <span 
                        key={genre} 
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MoodMatcher;
