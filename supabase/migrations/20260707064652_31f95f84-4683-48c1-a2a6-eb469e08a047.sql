DROP POLICY IF EXISTS "Superadmins read all subchapters" ON public.story_subchapters;
CREATE POLICY "Superadmins read all subchapters"
  ON public.story_subchapters
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));