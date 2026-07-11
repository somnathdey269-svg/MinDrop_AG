-- Seed default feature flag values into platform_settings (per env).
-- Keys follow feature.<slug>.<env>; values are '1' (on) or '0' (off).
-- Uses ON CONFLICT DO NOTHING so we never clobber values a superadmin set.

INSERT INTO public.platform_settings (key, value) VALUES
  ('feature.story.dev', '1'), ('feature.story.staging', '1'), ('feature.story.prod', '1'),
  ('feature.quiz.dev', '1'), ('feature.quiz.staging', '1'), ('feature.quiz.prod', '0'),
  ('feature.packs.dev', '1'), ('feature.packs.staging', '1'), ('feature.packs.prod', '0'),
  ('feature.recall.dev', '1'), ('feature.recall.staging', '1'), ('feature.recall.prod', '0'),
  ('feature.rules.dev', '1'), ('feature.rules.staging', '1'), ('feature.rules.prod', '0'),
  ('feature.personality.dev', '1'), ('feature.personality.staging', '1'), ('feature.personality.prod', '0'),
  ('feature.experiments.dev', '1'), ('feature.experiments.staging', '0'), ('feature.experiments.prod', '0'),
  ('feature.categories.dev', '1'), ('feature.categories.staging', '1'), ('feature.categories.prod', '1'),
  ('feature.greetings.dev', '1'), ('feature.greetings.staging', '1'), ('feature.greetings.prod', '1'),
  ('feature.country-themes.dev', '1'), ('feature.country-themes.staging', '1'), ('feature.country-themes.prod', '1')
ON CONFLICT (key) DO NOTHING;