-- Create watch_progress table for continue watching feature
CREATE TABLE public.watch_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  season_number INTEGER,
  episode_number INTEGER,
  episode_title TEXT,
  video_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, tmdb_id, media_type, season_number, episode_number)
);

-- Enable RLS
ALTER TABLE public.watch_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own watch progress"
  ON public.watch_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch progress"
  ON public.watch_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch progress"
  ON public.watch_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch progress"
  ON public.watch_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_watch_progress_user_updated ON public.watch_progress(user_id, updated_at DESC);
CREATE INDEX idx_watch_progress_tmdb ON public.watch_progress(tmdb_id, media_type);

-- Update video_links policies to allow admins full control
CREATE POLICY "Admins can manage all video links"
  ON public.video_links FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));