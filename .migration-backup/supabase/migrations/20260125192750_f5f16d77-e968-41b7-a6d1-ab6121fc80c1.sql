-- Add episode-specific video links support
-- Add season and episode columns to video_links table
ALTER TABLE public.video_links 
ADD COLUMN IF NOT EXISTS season_number integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS episode_number integer DEFAULT NULL;

-- Update the unique constraint to include season/episode
ALTER TABLE public.video_links DROP CONSTRAINT IF EXISTS video_links_tmdb_id_media_type_key;
CREATE UNIQUE INDEX IF NOT EXISTS video_links_unique_content ON public.video_links (tmdb_id, media_type, COALESCE(season_number, 0), COALESCE(episode_number, 0));