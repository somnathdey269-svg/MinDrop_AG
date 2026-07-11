
-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.story_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 1. chapters
CREATE TABLE public.story_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  number INTEGER NOT NULL,
  path TEXT NOT NULL,
  roman_numeral TEXT NOT NULL,
  title TEXT NOT NULL,
  teaser TEXT NOT NULL DEFAULT '',
  recap TEXT NOT NULL DEFAULT '',
  time_of_day TEXT NOT NULL DEFAULT 'morning',
  sky_top TEXT NOT NULL DEFAULT '#ffffff',
  sky_bottom TEXT NOT NULL DEFAULT '#ffffff',
  ink TEXT NOT NULL DEFAULT '#000000',
  status TEXT NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.story_chapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_chapters TO authenticated;
GRANT ALL ON public.story_chapters TO service_role;
ALTER TABLE public.story_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published chapters" ON public.story_chapters
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Superadmins can read all chapters" ON public.story_chapters
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE POLICY "Superadmins write chapters" ON public.story_chapters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE TRIGGER story_chapters_touch BEFORE UPDATE ON public.story_chapters
  FOR EACH ROW EXECUTE FUNCTION public.story_touch_updated_at();

-- 2. sub-chapters
CREATE TABLE public.story_subchapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.story_chapters(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  eyebrow TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  layout TEXT NOT NULL DEFAULT 'immersive',
  poster_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chapter_id, key)
);
GRANT SELECT ON public.story_subchapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_subchapters TO authenticated;
GRANT ALL ON public.story_subchapters TO service_role;
ALTER TABLE public.story_subchapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published subchapters" ON public.story_subchapters
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Superadmins read all subchapters" ON public.story_subchapters
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE POLICY "Superadmins write subchapters" ON public.story_subchapters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE TRIGGER story_subchapters_touch BEFORE UPDATE ON public.story_subchapters
  FOR EACH ROW EXECUTE FUNCTION public.story_touch_updated_at();

-- 3. walkthrough beats
CREATE TABLE public.story_walk_beats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subchapter_id UUID NOT NULL REFERENCES public.story_subchapters(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT '',
  default_screen TEXT NOT NULL DEFAULT '/home',
  status TEXT NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.story_walk_beats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_walk_beats TO authenticated;
GRANT ALL ON public.story_walk_beats TO service_role;
ALTER TABLE public.story_walk_beats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published beats" ON public.story_walk_beats
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Superadmins read all beats" ON public.story_walk_beats
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE POLICY "Superadmins write beats" ON public.story_walk_beats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE TRIGGER story_walk_beats_touch BEFORE UPDATE ON public.story_walk_beats
  FOR EACH ROW EXECUTE FUNCTION public.story_touch_updated_at();

-- 4. walkthrough steps
CREATE TABLE public.story_walk_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  beat_id UUID NOT NULL REFERENCES public.story_walk_beats(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  target TEXT,
  screen TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.story_walk_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_walk_steps TO authenticated;
GRANT ALL ON public.story_walk_steps TO service_role;
ALTER TABLE public.story_walk_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published steps" ON public.story_walk_steps
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Superadmins read all steps" ON public.story_walk_steps
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE POLICY "Superadmins write steps" ON public.story_walk_steps
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE TRIGGER story_walk_steps_touch BEFORE UPDATE ON public.story_walk_steps
  FOR EACH ROW EXECUTE FUNCTION public.story_touch_updated_at();

-- 5. pills
CREATE TABLE public.story_pills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subchapter_id UUID NOT NULL REFERENCES public.story_subchapters(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'custom',
  label TEXT NOT NULL DEFAULT '',
  target_key TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.story_pills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_pills TO authenticated;
GRANT ALL ON public.story_pills TO service_role;
ALTER TABLE public.story_pills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published pills" ON public.story_pills
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Superadmins read all pills" ON public.story_pills
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE POLICY "Superadmins write pills" ON public.story_pills
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
CREATE TRIGGER story_pills_touch BEFORE UPDATE ON public.story_pills
  FOR EACH ROW EXECUTE FUNCTION public.story_touch_updated_at();

-- Useful indexes
CREATE INDEX ON public.story_subchapters (chapter_id, sort_order);
CREATE INDEX ON public.story_walk_beats (subchapter_id, sort_order);
CREATE INDEX ON public.story_walk_steps (beat_id, sort_order);
CREATE INDEX ON public.story_pills (subchapter_id, sort_order);
