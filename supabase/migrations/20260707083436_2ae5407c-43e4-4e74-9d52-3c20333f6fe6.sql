
-- 1) Chapter columns
ALTER TABLE public.story_chapters
  ADD COLUMN IF NOT EXISTS tab_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_key text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_alt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS backdrop_key text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone_screens jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS variant text NOT NULL DEFAULT 'immersive';

-- 2) Sub-chapter columns
ALTER TABLE public.story_subchapters
  ADD COLUMN IF NOT EXISTS headline text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tab_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_key text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_alt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS backdrop_key text NOT NULL DEFAULT '';

-- 3) Seed chapter-level defaults
UPDATE public.story_chapters SET
  tab_label = 'Chapter I · The Overwhelm',
  hero_key = 'ch1-hero-chaos',
  hero_alt = 'A person surrounded by a swirl of sticky notes at dawn',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/splash","/splash","/home"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'overwhelm';

UPDATE public.story_chapters SET
  tab_label = 'Chapter II · The Drop',
  hero_key = 'ch2-hero-shelf',
  hero_alt = 'A calm wooden shelf with a few glowing drops arranged in neat buckets',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/home","/packs","/recall"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'drop';

UPDATE public.story_chapters SET
  tab_label = 'Chapter III · The Quiet Ping',
  hero_key = 'ch3-hero-clockbirds',
  hero_alt = 'The Keeper conducting three little clockwork birds carrying notification cards',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/notify","/notify?tab=rules","/notify?tab=archived"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'ping';

UPDATE public.story_chapters SET
  tab_label = 'Chapter IV · The Walk-Past',
  hero_key = 'ch4-hero-placewalk',
  hero_alt = 'The Keeper walking past a small shop with a gentle map pin glowing on their phone',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/places/new","/places","/places?tab=archived"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'walk';

UPDATE public.story_chapters SET
  tab_label = 'Chapter V · Make It Yours',
  hero_key = 'ch5-hero-recall',
  hero_alt = 'Warm evening palette swatches and a stack of type specimens',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/settings","/settings","/settings"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'settings';

UPDATE public.story_chapters SET
  tab_label = 'Chapter VI · Why This Book',
  hero_key = 'ch6-hero-compare',
  hero_alt = 'The Keeper standing in front of a soft wall of unbranded app icons, holding a glowing drop',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/features","/how-it-works","/faq"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'why';

UPDATE public.story_chapters SET
  tab_label = 'Chapter VII · The Free Promise',
  hero_key = 'ch7-hero-packs',
  hero_alt = 'A small stack of open Memory Packs glowing warmly at twilight',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/paywall"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'free';

UPDATE public.story_chapters SET
  tab_label = 'Chapter VIII · Take It Home',
  hero_key = 'ch8-hero-keeper',
  hero_alt = 'The Keeper resting quietly, phone glowing gently on the bedside',
  backdrop_key = 'backdrop-scatter',
  phone_screens = '["/splash"]'::jsonb,
  variant = 'immersive'
WHERE slug = 'take-home';

-- 4) Seed sub-chapter beat content (headline, tab_label, caption, hero, alt)
-- Chapter 1 · Overwhelm
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter I · Dawn',
  headline = 'Too much to hold.',
  tab_label = 'Why your head feels full',
  caption = 'Sticky notes on the fridge. Screenshots you''ll never open. A voice memo called Untitled 47. Your head is doing three jobs at once.',
  hero_key = 'ch1-a-overwhelm',
  hero_alt = 'A person overwhelmed by a swirl of sticky notes at dawn',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='overwhelm' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'About the app',
  headline = 'Not an assistant. A quiet second memory.',
  tab_label = 'What the Keeper does',
  caption = 'Not a chatbot, not another to-do app. A calm inbox for the small things — chargers, birthdays, bills — the stuff your brain wasn''t built to carry.',
  hero_key = 'ch1-b-meet',
  hero_alt = 'The Keeper appearing quietly beside the person, holding a glowing drop',
  backdrop_key = 'backdrop-quiet'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='overwhelm' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Your five rooms',
  headline = 'Later, Notify, Places, Recall, Settings.',
  tab_label = 'How the app works',
  caption = 'That''s the whole app. One dark capture pill, five rooms, and a shelf that stays honest. Turn the page when you''re ready.',
  hero_key = 'ch1-c-offer',
  hero_alt = 'The person calmly handing a thought-drop to the Keeper at dawn',
  backdrop_key = 'backdrop-rooms'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='overwhelm' AND sc.sort_order = 3;

-- Chapter 2 · Drop
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter II · Morning · Reminder',
  headline = 'I''ll deal with this later.',
  tab_label = 'Drop it for later',
  caption = 'You''re brushing your teeth. A thought arrives — call the plumber. One tap on MinDrop and it''s off your mind. It lives on the Later shelf now, with a gentle nudge time.',
  hero_key = 'ch2-a-hold',
  hero_alt = 'The Keeper cradling a single glowing thought-drop in morning light',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='drop' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Packs',
  headline = 'Small things, in small buckets.',
  tab_label = 'Sort into buckets',
  caption = 'Packs are ready-made buckets — Parenting, Errand, Meds, Pet, Call, Workout. Drop straight into one and it lands tagged, so you don''t file it later.',
  hero_key = 'ch2-b-place',
  hero_alt = 'The Keeper placing a glowing drop into a small bucket on a wooden shelf',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='drop' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Recall',
  headline = 'Older thoughts, floated back.',
  tab_label = 'Yesterday''s review',
  caption = 'Recall surfaces yesterday''s captures so nothing rots at the bottom of the pile. Two minutes, then done — a calm scan, not another feed.',
  hero_key = 'ch2-c-shelf',
  hero_alt = 'A tidy shelf holding a few glowing drops, one gently floating back up',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='drop' AND sc.sort_order = 3;

-- Chapter 3 · Ping
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter III · Noon · Inbox',
  headline = 'Every ping, in one inbox.',
  tab_label = 'Catch every ping',
  caption = 'Mum''s WhatsApp lands during a meeting. You see it, you swipe it away. The Keeper quietly catches every ping so nothing important slips through by evening.',
  hero_key = 'ch3-a-cluttered',
  hero_alt = 'The Keeper standing under a cluttered cloud of notification cards at noon',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='ping' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Rules',
  headline = 'Write the rule once.',
  tab_label = 'Write a rule once',
  caption = 'Point the Keeper at a sender or a keyword. Matching pings auto-route to Later — you never triage the same thing twice.',
  hero_key = 'ch3-b-rule',
  hero_alt = 'The Keeper''s clockwork birds catching a notification card in a small net',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='ping' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Archived',
  headline = 'Handled, out of the way.',
  tab_label = 'Archive quietly',
  caption = 'Archived rules go quiet without being deleted. Flip them back on any time — nothing is truly lost.',
  hero_key = 'ch3-c-nudge',
  hero_alt = 'The Keeper filing a quiet notification card into a labelled drawer',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='ping' AND sc.sort_order = 3;

-- Chapter 4 · Walk
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter IV · Afternoon · Save location',
  headline = 'Save a place you care about.',
  tab_label = 'Save places you love',
  caption = 'School gate, bakery, home. Search an address or drop a pin — name it plainly, hit save. That spot is now on your map.',
  hero_key = 'ch4-a-walking',
  hero_alt = 'The Keeper walking down a warm afternoon street, phone in hand',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='walk' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Set rules',
  headline = 'This spot, this thought, this radius.',
  tab_label = 'Nudge me when there',
  caption = 'Each place has its own trigger radius — 50m for a shop, 500m for a neighbourhood. Attach any drop; it fires quietly when you cross.',
  hero_key = 'ch4-b-glow',
  hero_alt = 'A map pin glowing above a bakery door as the Keeper pauses outside',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='walk' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Archived',
  headline = 'Off-duty, not gone.',
  tab_label = 'Pause without losing',
  caption = 'Archived places stop firing but stay one tap from restore. Battery-friendly on Android — OS-level geofences, no constant GPS.',
  hero_key = 'ch4-c-enter',
  hero_alt = 'The Keeper stepping into the bakery with a warm loaf, the pin now dim',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='walk' AND sc.sort_order = 3;

-- Chapter 5 · Settings
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter V · Evening',
  headline = 'Colours from where you live.',
  tab_label = 'Colours you love',
  caption = 'Country themes pull warm, familiar palettes into every room of the app — the same greens you''d see on your street, not a stock template.',
  hero_key = 'ch5-a-forgotten',
  hero_alt = 'A row of warm colour swatches on a wooden shelf at evening',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='settings' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Type',
  headline = 'Type that fits your eyes.',
  tab_label = 'Type that fits',
  caption = 'Sans, serif, or mono — with three sizes. Pick once and the whole app follows: capture pill, memory cards, settings, everywhere.',
  hero_key = 'ch5-b-float',
  hero_alt = 'A specimen card showing sans, serif, and mono type sizes',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='settings' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'The small dials',
  headline = 'Permissions, packs, privacy — one screen.',
  tab_label = 'Honest settings',
  caption = 'Notification permissions, memory packs, privacy, backup, diagnostics. All the honest little dials sit in one calm list — no hidden state, no dark patterns.',
  hero_key = 'ch5-c-catch',
  hero_alt = 'A tidy row of small dials and switches beside a stack of glowing drops',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='settings' AND sc.sort_order = 3;

-- Chapter 6 · Why
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter VI · Dusk',
  headline = 'There are lots of reminder apps.',
  tab_label = 'How we compare',
  caption = 'The Keeper doesn''t pretend to be alone on the shelf. Some things it does the same. A few things it does its own way. This chapter is honest about both.',
  hero_key = 'ch6-a-wall',
  hero_alt = 'The Keeper standing in front of a soft wall of unbranded app icons at dusk',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='why' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Same, in shape',
  headline = 'Voice notes. Categories. Nudges.',
  tab_label = 'What feels familiar',
  caption = 'The Keeper''s version drops voice straight into the right bucket, treats categories as packs with real behaviour, and lets you write a note-to-self on every nudge.',
  hero_key = 'ch6-b-same',
  hero_alt = 'The Keeper mirrored beside a friendly silhouette of a generic reminder app',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='why' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'Different, on purpose',
  headline = 'Read the pings. Cap the shelf. Skip the drain.',
  tab_label = 'Our different choices',
  caption = 'Notify writes reminders from the pings you already get. Do-It-Later caps free at 5/day so the shelf stays honest. Places uses OS geofences on Android — no constant GPS.',
  hero_key = 'ch6-c-different',
  hero_alt = 'The Keeper stepping onto a quieter side-trail at dusk, leaving the crowd behind',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='why' AND sc.sort_order = 3;

-- Chapter 7 · Free
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter VII · Twilight',
  headline = 'Free is genuinely free.',
  tab_label = 'What''s free today',
  caption = '5 Do-It-Later drops per day. 3 Notify rules. 3 Places. Voice capture, categories, Recall, and a Recovery vault. No sign-up, no dark patterns.',
  hero_key = 'ch7-a-free',
  hero_alt = 'A stack of open Memory Packs glowing warmly at twilight, freely offered',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='free' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'The Premium plan',
  headline = 'For a calmer coffee-price.',
  tab_label = 'What Premium unlocks',
  caption = 'Unlimited memories. Pick any future date & time. All Memory Packs. Photo attachments. Recurring Notify rules (daily, date, range). Recovery vault forever.',
  hero_key = 'ch7-b-premium',
  hero_alt = 'The Keeper unlocking a larger Memory Pack with drops floating out at twilight',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='free' AND sc.sort_order = 2;

UPDATE public.story_subchapters sc SET
  eyebrow = 'The promise',
  headline = 'Coming soon. Payment? Not yet.',
  tab_label = 'Our honest promise',
  caption = 'Premium unlocks with the first stable release. Until then everything shown as Free is what you get today — the app enforces exactly these caps.',
  hero_key = 'ch7-c-promise',
  hero_alt = 'The Keeper''s open empty palm at twilight — a plain, honest promise',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='free' AND sc.sort_order = 3;

-- Chapter 8 · Take-home
UPDATE public.story_subchapters sc SET
  eyebrow = 'Chapter VIII · Night',
  headline = 'Goodnight. I''ve got it from here.',
  tab_label = 'Rest easy tonight',
  caption = 'The book ends the way a calm day does — quietly. Everything you dropped is safe. Tomorrow it comes back exactly when you''ll need it.',
  hero_key = 'ch8-a-rest',
  hero_alt = 'The Keeper resting on a bedside table beside a softly glowing phone at night',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='take-home' AND sc.sort_order = 1;

UPDATE public.story_subchapters sc SET
  eyebrow = 'One small step',
  headline = 'Put the Keeper on your phone.',
  tab_label = 'Get the app',
  caption = 'Android only. Play Store is coming; a direct APK works today. No account, no email, no drama — open it and start.',
  hero_key = 'ch8-b-take',
  hero_alt = 'A hand reaching for the glowing phone at night, the Keeper waiting inside',
  backdrop_key = 'backdrop-scatter'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='take-home' AND sc.sort_order = 2;

-- Chapter 8 has 2 real beats; the 3rd sub-chapter ("Put it on your phone") duplicates.
-- Leave whatever is at sort_order=3 as-is unless it's the placeholder title — if it duplicates beat 2, mark as draft.
UPDATE public.story_subchapters sc SET status = 'draft'
FROM public.story_chapters c
WHERE sc.chapter_id = c.id AND c.slug='take-home' AND sc.sort_order = 3 AND sc.headline = '';
