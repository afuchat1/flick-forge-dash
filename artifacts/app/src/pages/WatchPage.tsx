import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useMovieDetails, useTVDetails } from "@/hooks/useTMDB";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Loader2, Film } from "lucide-react";

const WatchPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const isTV = type === "tv";
  const mediaId = Number(id);

  const movieQuery = useMovieDetails(!isTV ? mediaId : 0);
  const tvQuery = useTVDetails(isTV ? mediaId : 0);
  const { data, isLoading } = isTV ? tvQuery : movieQuery;

  const detailPath = isTV ? `/tv/${id}` : `/movie/${id}`;
  const handleBack = () => navigate(detailPath);

  if (!type || !mediaId || (type !== "movie" && type !== "tv")) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const title = data?.title || data?.name || "Untitled";
  const trailer =
    data?.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
    data?.videos?.results?.find((v: any) => v.site === "YouTube");

  if (!data || !trailer) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Film className="h-10 w-10 text-white/30" />
        <p className="text-white/70 text-sm max-w-xs">
          No video is available for this title yet. Check the streaming providers on the details page instead.
        </p>
        <Button onClick={handleBack} variant="secondary">
          Back to details
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <VideoPlayer
        videoId={trailer.key}
        title={title}
        subtitle="Official Trailer · AfuChat Movies"
        onBack={handleBack}
      />
    </div>
  );
};

export default WatchPage;
