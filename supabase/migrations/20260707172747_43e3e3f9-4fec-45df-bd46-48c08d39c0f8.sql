
CREATE OR REPLACE FUNCTION public.guard_profile_plan_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    IF NOT public.has_role(auth.uid(), 'superadmin'::app_role) THEN
      RAISE EXCEPTION 'Only superadmins can change plan';
    END IF;
    NEW.plan_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.guard_profile_plan_update() FROM PUBLIC, anon, authenticated;
