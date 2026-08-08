-- Restrict public read access on reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Authenticated users can view reviews"
ON public.reviews FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.reviews FROM anon;

-- Restrict public read access on video_links
DROP POLICY IF EXISTS "Anyone can view video links" ON public.video_links;
CREATE POLICY "Authenticated users can view video links"
ON public.video_links FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.video_links FROM anon;

-- Lock down SECURITY DEFINER functions that must not be callable from the API
REVOKE ALL ON FUNCTION public.get_user_id_by_email(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_admin_on_signup() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;