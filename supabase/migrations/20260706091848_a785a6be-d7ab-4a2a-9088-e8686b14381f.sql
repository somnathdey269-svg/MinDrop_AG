
ALTER TABLE public.user_roles DISABLE TRIGGER prevent_new_superadmin;
INSERT INTO public.user_roles (user_id, role)
VALUES ('e6ef53d8-68e9-48c0-93bf-4c0c4c0789b8', 'superadmin'::app_role)
ON CONFLICT DO NOTHING;
ALTER TABLE public.user_roles ENABLE TRIGGER prevent_new_superadmin;
