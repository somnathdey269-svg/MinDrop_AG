
-- 1. Drop the auto-bootstrap trigger + function that promoted the first signup to superadmin
DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.bootstrap_first_superadmin() CASCADE;

-- 2. Trigger that blocks any INSERT of superadmin role, always.
--    Even if RLS is bypassed via service role, existing superadmin rows are preserved
--    (this only fires on INSERT), but no new superadmin rows can be added by anyone.
CREATE OR REPLACE FUNCTION public.block_superadmin_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'superadmin'::app_role THEN
    RAISE EXCEPTION 'superadmin role cannot be granted';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_new_superadmin ON public.user_roles;
CREATE TRIGGER prevent_new_superadmin
BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.block_superadmin_insert();
