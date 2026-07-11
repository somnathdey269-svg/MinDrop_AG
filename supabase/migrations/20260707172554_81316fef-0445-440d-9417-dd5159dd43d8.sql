
-- 1) Profile plan
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_updated_at timestamptz;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('free','premium'));

-- 2) is_premium helper
CREATE OR REPLACE FUNCTION public.is_premium(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND plan = 'premium'
  )
$$;

-- 3) Prevent users from self-upgrading via profiles UPDATE
CREATE OR REPLACE FUNCTION public.guard_profile_plan_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can change plan';
    END IF;
    NEW.plan_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_plan_update ON public.profiles;
CREATE TRIGGER trg_guard_profile_plan_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_plan_update();

-- 4) Memory reminder columns
ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS remind_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_fired_at timestamptz,
  ADD COLUMN IF NOT EXISTS snooze_fired_for timestamptz;

CREATE INDEX IF NOT EXISTS idx_memories_remind_at_pending
  ON public.memories (remind_at)
  WHERE remind_at IS NOT NULL AND reminder_fired_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_memories_snooze_pending
  ON public.memories (snoozed_until)
  WHERE snoozed_until IS NOT NULL;

-- 5) push_tokens.platform
ALTER TABLE public.push_tokens
  ADD COLUMN IF NOT EXISTS platform text NOT NULL DEFAULT 'web';

ALTER TABLE public.push_tokens
  DROP CONSTRAINT IF EXISTS push_tokens_platform_check;
ALTER TABLE public.push_tokens
  ADD CONSTRAINT push_tokens_platform_check CHECK (platform IN ('web','android','ios'));
