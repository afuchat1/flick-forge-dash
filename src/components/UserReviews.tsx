import { useState } from "react";
import { Star, Edit2, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useUserReview, useSubmitReview, useDeleteReview } from "@/hooks/useReviews";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserReviewsProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
}

const StarRating = ({ 
  rating, 
  onRate, 
  interactive = false 
}: { 
  rating: number; 
  onRate?: (rating: number) => void; 
  interactive?: boolean;
}) => {
  const [hovered, setHovered] = useState(0);
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hovered || rating)
                ? 'text-primary fill-primary'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const UserReviews = ({ tmdbId, mediaType, title }: UserReviewsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: reviews, isLoading } = useReviews(tmdbId, mediaType);
  const { data: userReview } = useUserReview(tmdbId, mediaType);
  const submitReview = useSubmitReview();
  const deleteReview = useDeleteReview();
  
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [content, setContent] = useState(userReview?.content || "");

  const handleSubmit = () => {
    if (!user) {
      toast.error("Please sign in to write a review");
      navigate("/auth");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    submitReview.mutate(
      { tmdbId, mediaType, rating, content },
      {
        onSuccess: () => {
          setIsWriting(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your review?")) {
      deleteReview.mutate({ tmdbId, mediaType });
      setRating(0);
      setContent("");
    }
  };

  const handleStartWriting = () => {
    if (!user) {
      toast.error("Please sign in to write a review");
      navigate("/auth");
      return;
    }
    setIsWriting(true);
    if (userReview) {
      setRating(userReview.rating);
      setContent(userReview.content || "");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">User Reviews</h3>
        {!isWriting && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartWriting}
          >
            {userReview ? (
              <>
                <Edit2 className="h-4 w-4 mr-1" /> Edit Review
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-1" /> Write Review
              </>
            )}
          </Button>
        )}
      </div>

      {/* Write/Edit Review Form */}
      {isWriting && (
        <div className="p-4 bg-card rounded-lg space-y-3">
          <p className="text-sm text-muted-foreground">Your rating for {title}</p>
          <StarRating rating={rating} onRate={setRating} interactive />
          <Textarea
            placeholder="Write your review (optional)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitReview.isPending}
            >
              <Send className="h-4 w-4 mr-1" />
              {submitReview.isPending ? "Submitting..." : "Submit"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsWriting(false)}
            >
              Cancel
            </Button>
            {userReview && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteReview.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-card rounded-md animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-2">
          {reviews.map((review) => (
            <div key={review.id} className="p-3 bg-card rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">
                      {review.profiles?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {review.profiles?.username || "User"}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                  <span className="text-xs font-bold text-primary">{review.rating}/10</span>
                </div>
              </div>
              {review.content && (
                <p className="text-sm text-foreground/80 mt-2">{review.content}</p>
              )}
              {review.user_id === user?.id && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={handleStartWriting}
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
};

export default UserReviews;
