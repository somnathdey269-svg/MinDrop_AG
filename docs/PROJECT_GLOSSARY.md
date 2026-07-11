# Project Glossary

Every business and technical term used across MindDrop. When you introduce a new term, add it here and cross-link.

---

## Core Product Terms

**Memory** — the atomic unit. A user-saved item (text, link, later image/voice) that MindDrop can bring back at the right moment. Table: `memories`.

**Pack** — a curated bundle of related memories or prompts. System packs are seeded via migration; users create custom packs. Table: `custom_packs`.

**Recall** — the surface where MindDrop brings memories back to the user, ordered by relevance / due time.

**Notify** — the notification system that fires reminders. Consists of *notify rules* (config), *notify events* (fired instances), and delivery via web push / native alarm. Tables: `notify_rules`, `notify_events`.

**Place** — a saved location a memory can be pinned to. Triggers a reminder when the user enters/exits (native geofence, future). Table: `places`.

**Rule** — user-defined condition that determines when a memory resurfaces. Time-based, place-based, or notification-match.

**Reminder** — a scheduled instance of a rule firing. Not a separate table; encoded as `next_fire_at` on `memories` + rows in `notify_events`.

**Vault** — conceptual: the user's private memory store. Not a table today; future multi-user shared vaults are on the roadmap.

**Recovery** — restoring from a Google Drive snapshot. See [API_REFERENCE.md §Cloud Snapshot](./API_REFERENCE.md#cloud-snapshot).

**Story** — long-form marketing/onboarding content: chapters, sub-chapters, walk steps, walk beats. Tables: `story_chapters`, `story_subchapters`, `story_walk_steps`, `story_walk_beats`, `story_pills`.

**Theme** — a country/personality-specific visual + copy variant. Table: `country_themes`.

**Greeting / Personality / Quiz** — admin-configurable onboarding surfaces at `ctrl-vx9k2m7fq3z.greetings.tsx` etc.

## Commercial Terms

**Plan** — the user's subscription tier (`free`, `premium`). Column `profiles.plan`.

**Quota** — a per-plan limit (e.g. max memories, max packs). Table: `plan_limits`.

**Premium** — paid plan with expanded quotas. Determined by `is_premium(user_id)`.

**Grace period** — TODO. Time between plan expiry and hard downgrade.

**Feature Flag** — a runtime toggle stored server-side. Changing a flag does NOT require a new release. Managed via `src/lib/admin/flags.functions.ts`. See [MASTER_ARCHITECTURE.md §7](./MASTER_ARCHITECTURE.md#7-server-driven-configuration).

## Technical Terms

**Server Function** — a `createServerFn` wrapper, called as typed RPC from the client. Lives in `*.functions.ts`.

**Server Route** — a `createFileRoute` under `src/routes/api/**` with a `server.handlers` block. Used for webhooks and public HTTP endpoints.

**RLS** — Postgres Row-Level Security. Every public table has it enabled.

**Superadmin** — the highest role. Set for the first user via `handle_new_user`; cannot be granted otherwise.

**Publishable key** — Supabase anon key; safe in the browser.

**Service role key** — Supabase admin key; RLS bypassed; server-only.

**Broker (Lovable Auth Broker)** — Lovable's OAuth broker used for Google sign-in.

**Bearer attacher** — client middleware in `src/start.ts` that attaches the Supabase JWT to every server-function call.

**PhoneFrame** — the shell component that wraps every consumer route in a phone-sized frame. Holds the single `<main>` landmark.

**`.t-*` roles** — the seven typography roles in `src/styles.css` (`t-display`, `t-title`, `t-body`, `t-body-sm`, `t-meta`, `t-eyebrow`, `t-button`). Every consumer text uses one — no ad-hoc sizes.

**Obscured admin slug** — `ctrl-vx9k2m7fq3z` prefix for admin routes. Security-by-obscurity layer; real auth is `has_role`.

**Snapshot** — the export bundle for a user's data, pushed to Google Drive.

## Never Say (product-writing rules)

**"AI"** — user-facing copy uses **"Smart"** or **"GetMinDrop"** (per project memory in `mem://index.md`). Internal docs may say "AI" freely.

## Acronyms

- **AAB** — Android App Bundle (Play Store artifact).
- **APK** — Android Package (installable).
- **BFF** — Backend-for-Frontend.
- **FCM** — Firebase Cloud Messaging.
- **HMAC** — Hash-based Message Authentication Code (webhook verification).
- **KYC** — Know Your Customer (Cashfree merchant onboarding).
- **MAU / DAU** — Monthly / Daily Active Users.
- **PITR** — Point-In-Time Recovery (Supabase backups).
- **PWA** — Progressive Web App.
- **RLS** — Row-Level Security.
- **RPC** — Remote Procedure Call.
- **SSR / SSG** — Server-Side Rendering / Static Site Generation.
- **STT** — Speech-To-Text.
- **VAPID** — Voluntary Application Server Identification (web push).
