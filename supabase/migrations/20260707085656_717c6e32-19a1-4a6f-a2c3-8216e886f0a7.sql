alter table public.story_subchapters
  add column if not exists hero_opacity numeric not null default 0.9,
  add column if not exists backdrop_opacity numeric not null default 0.85,
  add column if not exists mobile_image text not null default 'backdrop'
    check (mobile_image in ('hero', 'backdrop', 'both'));