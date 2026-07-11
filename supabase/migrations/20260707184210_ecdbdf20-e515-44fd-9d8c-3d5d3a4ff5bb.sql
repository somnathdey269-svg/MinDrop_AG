INSERT INTO public.platform_settings (key, value, updated_at)
VALUES ('company_legal_name', 'Proprietor Somnath Dey', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();