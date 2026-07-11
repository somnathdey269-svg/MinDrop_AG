
-- 1) profiles: expiry + source
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_source TEXT;

-- 2) is_premium: only premium while not expired
CREATE OR REPLACE FUNCTION public.is_premium(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id
      AND plan = 'premium'
      AND (plan_expires_at IS NULL OR plan_expires_at > now())
  )
$function$;

-- 3) guard_profile_plan_update: allow service_role bypass so payment
--    verifier & webhook can bump plan + expiry without human superadmin.
CREATE OR REPLACE FUNCTION public.guard_profile_plan_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    -- service_role (edge / server fn using admin client) is always allowed
    IF current_setting('request.jwt.claim.role', true) = 'service_role'
       OR auth.role() = 'service_role'
       OR public.has_role(auth.uid(), 'superadmin'::app_role) THEN
      NEW.plan_updated_at = now();
    ELSE
      RAISE EXCEPTION 'Only superadmins can change plan';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- 4) payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cf_order_id TEXT NOT NULL UNIQUE,
  cf_payment_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'CREATED',
  raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
CREATE POLICY "Users can read own payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments (created_at DESC);

DROP TRIGGER IF EXISTS payments_set_updated_at ON public.payments;
CREATE TRIGGER payments_set_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) seed platform_settings defaults (only inserted if missing)
INSERT INTO public.platform_settings (key, value) VALUES
  ('support_email',            'support@mindrop.in'),
  ('grievance_officer_name',   'Somnath Dey'),
  ('grievance_officer_email',  'support@mindrop.in'),
  ('company_legal_name',       'MinDrop'),
  ('company_address',          'Earth Allysum, Vasna Bhayli Road, Vadodara, 391410, India'),
  ('company_jurisdiction',     'Vadodara, Gujarat, India'),
  ('premium_price_inr',        '499'),
  ('premium_display_prices',   '{"INR":{"raw":499,"displayed":499,"symbol":"₹"}}'),
  ('premium_currency_updated_at', '')
ON CONFLICT (key) DO NOTHING;
