# Database Reference

Postgres schema for MindDrop (managed via Supabase / Lovable Cloud).

**Source of truth:** `supabase/migrations/*.sql` (append-only). This document summarizes the tables, functions, policies, and cron jobs; column-by-column detail lives in the migration history and the auto-generated types file (`src/integrations/supabase/types.ts`).

---

## Tables (public schema)

20 tables. All have RLS enabled. All have GRANTs to `authenticated` + `service_role` unless noted.

| Table | Purpose | Owner column | Notable policies |
|---|---|---|---|
| `profiles` | User profile + plan | `id = auth.uid()` | user r/w own; plan column guarded by trigger |
| `user_settings` | Per-user preferences | `user_id` | user r/w own |
| `user_roles` | Role assignments (never on profile!) | `user_id` | user reads own via `has_role()`; inserts blocked for superadmin |
| `memories` | Core memory entries | `user_id` | user r/w own |
| `places` | Saved locations | `user_id` | user r/w own |
| `notify_rules` | User notify rule config | `user_id` | user r/w own |
| `notify_events` | Fired notify events | `user_id` | user reads own |
| `custom_packs` | User-created packs | `user_id` | user r/w own |
| `push_tokens` | FCM / web push tokens | `user_id` | user r/w own |
| `payments` | Cashfree orders/txns | `user_id` | user reads own; service_role writes |
| `plan_limits` | Plan → quota mapping | – | public read; admin write |
| `platform_settings` | Public runtime config | – | public read; admin write |
| `country_themes` | Country-specific themes | – | public read; admin write |
| `drive_oauth_states` | PKCE state for Drive OAuth | `user_id` | user r/w own; short-lived |
| `user_drive_tokens` | Drive access/refresh tokens | `user_id` | user r/w own (tokens encrypted at rest by Supabase) |
| `story_chapters` | Marketing story content | – | public read published; admin write |
| `story_subchapters` | Nested story content | – | public read published; admin write |
| `story_pills` | Story tags | – | public read; admin write |
| `story_walk_steps` | Guided walk steps | – | public read published; admin write |
| `story_walk_beats` | Walk timing beats | – | public read published; admin write |

Column details: read the migration files chronologically, or `src/integrations/supabase/types.ts`. Never reverse-engineer from the client — the migration history is canonical.

## Relationships

- `profiles.id` → `auth.users.id` (1:1)
- `user_settings.user_id` → `auth.users.id`
- `user_roles.user_id` → `auth.users.id`
- `memories.user_id` → `auth.users.id`; `memories.place_id` → `places.id`
- `custom_packs.user_id` → `auth.users.id`
- `notify_rules.user_id` → `auth.users.id`
- `notify_events.user_id` → `auth.users.id`; may reference `memories`
- `payments.user_id` → `auth.users.id`
- `push_tokens.user_id` → `auth.users.id`
- `story_subchapters.chapter_id` → `story_chapters.id`
- `story_walk_beats.step_id` → `story_walk_steps.id`
- `drive_oauth_states.user_id` / `user_drive_tokens.user_id` → `auth.users.id`

## Indexes

Primary keys on `id`. `user_id` FKs indexed by convention. `notify_events(user_id, fired_at)` and `memories(user_id, next_fire_at)` are the hot paths — verify in migrations. TODO: add explicit index audit.

## Functions

Source: current DB state (see `<db-functions>` in project state).

| Function | Type | Purpose |
|---|---|---|
| `has_role(_user_id, _role)` | STABLE SECURITY DEFINER | Role check; used in RLS to avoid recursion |
| `is_premium(_user_id)` | STABLE SECURITY DEFINER | True if plan=premium and not expired |
| `handle_new_user()` | trigger (auth.users insert) | Seeds `profiles` + `user_settings`; grants first user superadmin |
| `block_superadmin_insert()` | trigger (user_roles insert) | Prevents anyone from granting superadmin via normal path |
| `guard_profile_plan_update()` | trigger (profiles update) | Only service_role / superadmin may change `plan` |
| `set_updated_at()` / `story_touch_updated_at()` | trigger utility | `updated_at` maintenance |
| `split_helper_list_tables()` | SECURITY DEFINER | Superadmin-only table listing (dev tool) |
| `split_helper_rename_table(from, to)` | SECURITY DEFINER | Toggles `_disabled_` prefix; superadmin only |
| `split_helper_exec_sql(sql)` | SECURITY DEFINER | **Superadmin-only, DROP TABLE only. Remove before public launch — see [SECURITY.md](./SECURITY.md).** |

## Triggers

- `handle_new_user` on `auth.users` after insert.
- `block_superadmin_insert` on `user_roles` before insert.
- `guard_profile_plan_update` on `profiles` before update.
- `set_updated_at` / `story_touch_updated_at` on relevant tables before update.

(There are currently no *user-defined* triggers shown by the schema introspection tool; the ones above are wired via migration SQL.)

## Policies

Every user-data table follows the pattern:

```sql
CREATE POLICY "own_select" ON <t> FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_write"  ON <t> FOR ALL    USING (auth.uid() = user_id)
                                              WITH CHECK (auth.uid() = user_id);
```

Public-read tables (`plan_limits`, `platform_settings`, `country_themes`, `story_*`) have `TO authenticated` (and, where safe, `TO anon`) SELECT policies and admin-only write policies gated by `has_role(auth.uid(), 'superadmin')`.

## Views

None currently. TODO: consider a `v_active_memories` view if the recall query becomes expensive.

## Storage

No Supabase Storage buckets today. Image/voice memory features will require buckets — plan when those features ship (see [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md#memory)).

## Cron Jobs

Provided by `pg_cron`. At least one job invokes reminder fan-out (`fireDueReminders` — see [API_REFERENCE.md](./API_REFERENCE.md#memory-reminder-sync)). Enumerate with:

```sql
SELECT jobname, schedule, command, active FROM cron.job ORDER BY jobid;
```

TODO: check into `docs/` a snapshot of cron jobs on every release.

## Migration History

Migrations live in `supabase/migrations/` and are append-only.

- Never edit an existing migration.
- Never `DROP` to "roll back"; write a compensating migration.
- Every new `CREATE TABLE public.*` must include `GRANT` statements in the same migration (see [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md#supabase)).
- Types (`src/integrations/supabase/types.ts`) regenerate after each migration; do not hand-edit.

Current baseline runs from `20260707064138` through `20260708185229` (see filenames in `supabase/migrations/`).
