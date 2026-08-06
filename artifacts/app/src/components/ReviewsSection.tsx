import { useState } from "react";
import { Star } from "lucide-react";

interface ReviewsSectionProps {
  reviews: any[];
  voteAverage?: number;
  voteCount?: number;
}

const ReviewCard = ({ review }: { review: any }) => {
  const [expanded, setExpanded] = useState(false);
  const long = review.content.length > 420;

  return (
    <article className="fact-panel p-3.5">
      <header className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{review.author}</p>
          {review.created_at && (
            <p className="text-[11px] text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        {review.author_details?.rating != null && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {review.author_details.rating}/10
          </span>
        )}
      </header>

      <p className={`whitespace-pre-line text-sm leading-relaxed text-foreground/80 ${expanded ? "" : "line-clamp-5"}`}>
        {review.content}
      </p>

      {long && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          {expanded ? "Read less" : "Read full review"}
        </button>
      )}
    </article>
  );
};

/** Audience scoring plus the full text of every official TMDB review. */
const ReviewsSection = ({ reviews = [], voteAverage, voteCount }: ReviewsSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Ratings &amp; Reviews</h2>
        {voteAverage ? (
          <span className="text-xs text-muted-foreground">
            <span className="font-display text-base text-primary">{voteAverage.toFixed(1)}</span>
            /10 · {voteCount?.toLocaleString() ?? 0} votes
          </span>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <p className="fact-panel p-3.5 text-sm text-muted-foreground">
          No written reviews have been published for this title yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {visible.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {showAll ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
