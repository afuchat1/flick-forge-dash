-- Create a table for admin-provided video links
CREATE TABLE public.video_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  video_url TEXT NOT NULL,
  video_title TEXT,
  is_full_movie BOOLEAN DEFAULT true,
  quality TEXT DEFAULT 'HD',
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tmdb_id, media_type)
);

-- Enable Row Level Security
ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;

-- Public can view all video links
CREATE POLICY "Anyone can view video links" 
ON public.video_links 
FOR SELECT 
USING (true);

-- Only authenticated users can insert (for now - can be restricted to admins later)
CREATE POLICY "Authenticated users can add video links" 
ON public.video_links 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own links
CREATE POLICY "Users can update their own video links" 
ON public.video_links 
FOR UPDATE 
USING (auth.uid() = added_by);

-- Users can delete their own links
CREATE POLICY "Users can delete their own video links" 
ON public.video_links 
FOR DELETE 
USING (auth.uid() = added_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_links_updated_at
BEFORE UPDATE ON public.video_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();