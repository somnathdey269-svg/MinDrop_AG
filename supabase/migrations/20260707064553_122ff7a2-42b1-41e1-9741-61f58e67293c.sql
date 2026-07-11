DROP POLICY IF EXISTS "Superadmins can manage roles" ON public.user_roles;

DROP POLICY IF EXISTS "Superadmins can write country themes" ON public.country_themes;
CREATE POLICY "Superadmins can write country themes"
  ON public.country_themes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

DROP POLICY IF EXISTS "Superadmins can write platform settings" ON public.platform_settings;
CREATE POLICY "Superadmins can write platform settings"
  ON public.platform_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

DROP POLICY IF EXISTS "Superadmins can read all chapters" ON public.story_chapters;
CREATE POLICY "Superadmins can read all chapters"
  ON public.story_chapters
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));
DROP POLICY IF EXISTS "Superadmins write chapters" ON public.story_chapters;
CREATE POLICY "Superadmins write chapters"
  ON public.story_chapters
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

DROP POLICY IF EXISTS "Superadmins can read all subchapters" ON public.story_subchapters;
CREATE POLICY "Superadmins can read all subchapters"
  ON public.story_subchapters
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));
DROP POLICY IF EXISTS "Superadmins write subchapters" ON public.story_subchapters;
CREATE POLICY "Superadmins write subchapters"
  ON public.story_subchapters
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

DROP POLICY IF EXISTS "Superadmins read all beats" ON public.story_walk_beats;
CREATE POLICY "Superadmins read all beats"
  ON public.story_walk_beats
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));
DROP POLICY IF EXISTS "Superadmins write beats" ON public.story_walk_beats;
CREATE POLICY "Superadmins write beats"
  ON public.story_walk_beats
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

DROP POLICY IF EXISTS "Superadmins read all steps" ON public.story_walk_steps;
CREATE POLICY "Superadmins read all steps"
  ON public.story_walk_steps
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));
DROP POLICY IF EXISTS "Superadmins write steps" ON public.story_walk_steps;
CREATE POLICY "Superadmins write steps"
  ON public.story_walk_steps
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

DROP POLICY IF EXISTS "Superadmins read all pills" ON public.story_pills;
CREATE POLICY "Superadmins read all pills"
  ON public.story_pills
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));
DROP POLICY IF EXISTS "Superadmins write pills" ON public.story_pills;
CREATE POLICY "Superadmins write pills"
  ON public.story_pills
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'::public.app_role));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;