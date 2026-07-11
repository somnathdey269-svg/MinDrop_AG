# Performance

Current state, known bottlenecks, and improvement targets.

---

## Current Performance

No formal benchmarking is in place. Anecdotal:

- TanStack Start SSR + Vite chunk splitting keeps first paint fast on the marketing routes.
- Consumer app uses `useSuspenseQuery` — first render blocks on the loader's `ensureQueryData`, subsequent navigations feel instant.
- Supabase Postgres on Lovable Cloud handles current load comfortably (<10k users).

TODO: instrument with Web Vitals + PostHog / Sentry Performance.

## Bottlenecks (suspected)

- **Reminder fan-out** — `fireDueReminders` scans `memories` for due rows every cron tick. Fine at current scale; will need partitioning past ~100k active reminders.
- **Recall surface** — recall query joins `memories` + `notify_events` + `places`; needs verified indexes on `(user_id, next_fire_at)` and `(user_id, fired_at)`.
- **Admin analytics** — full-table scans for growth/revenue rollups. Move to materialized views past 10k users.
- **Story pages** — currently server-fetched per request. Static generation is a future win.

## Caching

- **TanStack Query** — default `staleTime: 0` (see stack knowledge). Per-key `staleTime` tuning is a recommended follow-up for hot lists (memories, notify events).
- **HTTP cache headers** — Lovable edge caches static assets; server routes are dynamic.
- **Postgres query plans** — auto-managed. Add explicit indexes when `pg_stat_statements` shows hot seq scans.

## TanStack Query Guidance

- Loader → `ensureQueryData`; component → `useSuspenseQuery`. Never `useEffect` + `fetch` for initial data.
- Invalidate on identity transitions only (`SIGNED_IN` / `SIGNED_OUT` / `USER_UPDATED`) — see stack knowledge, do not add per-page auth listeners.
- Keep query keys stable and specific: `['memories', userId]`, not `['memories']`.

## Supabase

- Use RLS as the primary access control; do not add duplicate `WHERE user_id = ...` in every query (RLS already filters).
- Prefer `.select('col1,col2')` over `.select('*')` on wide tables.
- Batch writes with `.upsert([...])` where safe.
- Avoid N+1 by using `.select('*, related_table(*)')` PostgREST joins.

## Lazy Loading

- Route splitting is automatic in TanStack Start.
- Admin console routes (`ctrl-vx9k2m7fq3z.*`) should stay lazy — they're big and used by a tiny audience.
- Heavy third-party SDKs (Cashfree checkout) load on demand at the payment step, not at boot.

## Image Optimization

- Marketing images: hand-optimized WebP/AVIF in `public/`.
- User-uploaded images: TODO (feature not shipped). When it ships, plan Supabase Storage transformations or a CDN in front.
- `og:image` for social share: leaf-route level only, absolute HTTPS URL.

## Native (future)

Android performance notes belong in [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md). Key points:

- AlarmManager `setAlarmClock` for guaranteed wake, but sparingly (battery cost).
- Foreground service only while a critical operation is in flight — kill promptly.
- Geofence radius ≥ 100m — smaller radii burn battery and miss events.
- Room queries off the main thread (coroutines + `Dispatchers.IO`).

## Future Improvements

Prioritized:

1. Add Sentry Performance + Web Vitals (immediate visibility).
2. Add explicit indexes on hot columns after measuring.
3. Materialized views for admin analytics past 10k users.
4. Static generation for marketing/story routes.
5. Partition `notify_events` by month past 100k users.
6. Introduce Redis / Cloudflare KV for feature-flag reads at 100k+ users.
7. Split marketing site to a separate SSG project once traffic warrants.
