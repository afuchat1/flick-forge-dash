import { Star, ThumbsUp } from "lucide-react";
import { Review } from "@/data/movies";

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Reviews</h2>
        <button className="text-sm text-primary font-medium hover:underline">
          See All Reviews
        </button>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="glass-card rounded-xl p-4 md:p-5 space-y-3 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-primary fill-primary" />
                <span className="text-xs font-bold text-primary">{review.rating}</span>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
              {review.content}
            </p>
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Helpful</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
