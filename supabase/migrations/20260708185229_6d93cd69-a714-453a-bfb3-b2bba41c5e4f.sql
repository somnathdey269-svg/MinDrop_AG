
CREATE TABLE public.plan_limits (
  key text PRIMARY KEY,
  label text NOT NULL,
  description text,
  anon_limit integer NOT NULL DEFAULT 3,
  free_limit integer NOT NULL DEFAULT 5,
  premium_limit integer NOT NULL DEFAULT -1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.plan_limits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plan_limits TO authenticated;
GRANT ALL ON public.plan_limits TO service_role;

ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plan limits"
  ON public.plan_limits FOR SELECT
  USING (true);

CREATE POLICY "Superadmins can insert plan limits"
  ON public.plan_limits FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can update plan limits"
  ON public.plan_limits FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can delete plan limits"
  ON public.plan_limits FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role));

CREATE TRIGGER plan_limits_touch_updated_at
  BEFORE UPDATE ON public.plan_limits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.plan_limits (key, label, description, anon_limit, free_limit, premium_limit) VALUES
  ('later_per_day',      'Do-it-later per day',   'Maximum memories a user can push to later each local day.', 3, 5, -1),
  ('notify_rules_total', 'Notify rules (total)',  'Maximum active notification rules a user can keep.',        3, 5, -1),
  ('places_total',       'Saved places (total)',  'Maximum saved places + geo rules a user can keep.',         3, 5, -1);
