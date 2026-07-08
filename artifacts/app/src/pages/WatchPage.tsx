import { useParams, useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useMovieDetails, useTVDetails } from "@/hooks/useTMDB";
import { usePublicDomainSource } from "@/hooks/usePublicDomainSource";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Loader2, Film } from "lucide-react";

const WatchPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const forceTrailer = searchParams.get("trailer") === "1";
  const navigate = useNavigate();
  const isTV = type === "tv";
  const mediaId = Number(id);

  const movieQuery = useMovieDetails(!isTV ? mediaId : 0);
  const tvQuery = useTVDetails(isTV ? mediaId : 0);
  const { data, isLoading } = isTV ? tvQuery : movieQuery;

  const title = data?.title || data?.name || "";
  const year = (data?.release_date || data?.first_air_date || "").slice(0, 4);
  const { data: publicDomain, isLoading: pdLoading } = usePublicDomainSource(
    !forceTrailer && !isTV ? title : undefined,
    year
  );

  const detailPath = isTV ? `/tv/${id}` : `/movie/${id}`;
  const handleBack = () => navigate(detailPath);

  if (!type || !mediaId || (type !== "movie" && type !== "tv")) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || (!forceTrailer && !isTV && pdLoading)) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const trailer =
    data?.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
    data?.videos?.results?.find((v: any) => v.site === "YouTube");

  // Prefer full public-domain film; else fall back to trailer.
  if (data && !forceTrailer && publicDomain) {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <VideoPlayer
          videoUrl={publicDomain.videoUrl}
          mimeType={publicDomain.mimeType}
          title={title}
          subtitle={`Public Domain · ${publicDomain.year || year || "AfuChat Movies"}`}
          onBack={handleBack}
        />
      </div>
    );
  }

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
