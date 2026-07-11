
REVOKE EXECUTE ON FUNCTION public.is_premium(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_premium(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.guard_profile_plan_update() FROM PUBLIC, anon, authenticated;
