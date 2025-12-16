import { Star } from "lucide-react";
import { Review } from "@/data/movies";

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{review.author}</h4>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="font-semibold">{review.rating}/10</span>
              </div>
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
