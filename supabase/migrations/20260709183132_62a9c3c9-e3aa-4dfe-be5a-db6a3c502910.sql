ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS install_country char(2),
  ADD COLUMN IF NOT EXISTS install_country_set_at timestamptz;