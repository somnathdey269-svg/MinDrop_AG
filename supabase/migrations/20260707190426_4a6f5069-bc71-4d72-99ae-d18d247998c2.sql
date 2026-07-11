DROP POLICY IF EXISTS "Anyone can read platform settings" ON public.platform_settings;

CREATE POLICY "Superadmins can read platform settings"
ON public.platform_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'::app_role));

REVOKE SELECT ON public.platform_settings FROM anon;