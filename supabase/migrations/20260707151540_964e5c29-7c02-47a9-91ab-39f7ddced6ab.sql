CREATE TABLE public.user_drive_tokens (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token text NOT NULL,
  folder_id text,
  connected_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_drive_tokens TO authenticated;
GRANT ALL ON public.user_drive_tokens TO service_role;

ALTER TABLE public.user_drive_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own Drive tokens"
ON public.user_drive_tokens
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.drive_oauth_states (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  state text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '10 minutes'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.drive_oauth_states TO authenticated;
GRANT ALL ON public.drive_oauth_states TO service_role;

ALTER TABLE public.drive_oauth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own Drive OAuth states"
ON public.drive_oauth_states
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_user_drive_tokens_updated_at
BEFORE UPDATE ON public.user_drive_tokens
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
