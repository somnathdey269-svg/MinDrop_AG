# MinDrop — Project Audit

_Generated 2026-07-08 from the current codebase. Facts only — no invented state._

---

## 1. Project Overview

| Item              | Value                                                              |
|-------------------|--------------------------------------------------------------------|
| Project name      | MinDrop (`in.mindrop.app` on native; `getmindrop.lovable.app` web) |
| Framework         | TanStack Start v1 (React 19, SSR + server functions) on Vite 7    |
| Styling           | Tailwind CSS v4 (via `@tailwindcss/vite`) + Radix UI + shadcn      |
| State/data        | TanStack Query 5, Supabase JS 2                                    |
| Motion / UI       | framer-motion, sonner, vaul, recharts, embla, react-hook-form + zod|
| Native shell      | Capacitor 8 (Android + iOS packages installed, no `android/` dir yet)|
| Voice             | `capacitor-voice-recorder`                                         |
| Push (native)     | `@capacitor-firebase/messaging` + `firebase` JS SDK for web push   |
| Maps              | Leaflet (client-only, dynamically imported)                        |
| Build / package   | Vite + TanStack Router plugin; **Bun** (`bun.lock` present)        |
| Runtime target    | Cloudflare Worker (via TanStack Start on Lovable Cloud)            |
| Deployment        | Lovable Cloud (production URL: `https://getmindrop.lovable.app`)   |

### Folder layout (top-level)

```
src/
├── routes/              file-based routes (marketing, auth, _authenticated/, api/, ctrl-<slug>.*)
├── components/          UI, layout, memory/notify/places/auth widgets
├── lib/                 domain logic; *.functions.ts = server fns, *.server.ts = server-only
├── integrations/
│   ├── supabase/        auto-generated client, admin client, auth middleware, types
│   └── lovable/         Lovable Cloud auth broker (Google OAuth)
├── hooks/
├── assets/
├── router.tsx           router creation
├── start.ts             TanStack Start instance + middleware
├── server.ts            SSR entry
└── styles.css           Tailwind v4 tokens
supabase/migrations/     20 SQL migration files (all dated 2026-07-07 → 07-08)
capacitor.config.ts      app id in.mindrop.app, name "MinDrop"
```

### Important directories
- `src/routes/_authenticated/` — protected app routes (dashboard, memory, packs, places, notify, rules, settings, paywall, quiz, recall, permissions, diagnostics, do-it-later)
- `src/routes/ctrl-vx9k2m7fq3z.*` — hidden superadmin console (obscured by slug)
- `src/routes/api/public/` — public endpoints (`cashfree-webhook`, `hooks/fire-reminders`)
- `src/routes/api/auth/drive/callback.ts` — Google Drive OAuth callback
- `src/lib/memoryos/` — memories, scheduler, packs, recall, quiz, recorder, personality
- `src/lib/notify/` — notification-listener capture + rule engine (Android)
- `src/lib/places/` — geofencing engine (client-side haversine, no native geofence)
- `src/lib/drive/`, `src/lib/payments.functions.ts`, `src/lib/push.functions.ts`

### Environment
- Preview: `https://id-preview--48ee5021-…lovable.app`
- Published: `https://getmindrop.lovable.app`
- No custom domain configured

---

## 2. Architecture

### High-level

```
Browser (Marketing + App)     Native shell (Capacitor)
       │                                │
       └────── TanStack Start SSR ──────┘
                        │
              ┌─────────┴──────────┐
              │  server functions  │  createServerFn (~50 across src/lib/**)
              │  server routes     │  /api/public/*, /api/auth/drive/callback
              └─────────┬──────────┘
                        │
         ┌──────────────┼─────────────────┐
         │              │                 │
     Supabase        Cashfree PG      Google APIs
     (auth+DB)       (payments)       (Drive, FCM,
                                       Maps, OAuth)
```

### Frontend
- All UI is React 19 + Tailwind v4 tokens defined in `src/styles.css`.
- Routes under `_authenticated/` gate on the managed layout (`ssr:false`, allows anon browsing per the current `route.tsx` — sign-in only required when premium action fires).
- Marketing routes are top-level SSR (`/`, `/features`, `/pricing`, `/how-it-works`, etc.).
- `src/lib/platform.ts` `isNativeApp()` redirects native shells past marketing.
- Global providers: TanStack Query client + Router; `sonner` toaster; error capture.

### Backend
- **No separate Node backend.** Everything server-side is TanStack Start server functions or server routes running in the Cloudflare Worker on Lovable Cloud.
- Supabase Data API is called from three client tiers:
  - Browser publishable client (`src/integrations/supabase/client.ts`)
  - Server publishable client (per-handler, for public reads)
  - `requireSupabaseAuth` middleware (bearer-authenticated server fns)
  - `supabaseAdmin` (service role) inside verified webhooks + admin fns only

### Supabase integration
- Auth: email+password + Google OAuth via `@lovable.dev/cloud-auth-js` broker; email OTP for sign-up and forgot-password.
- Data: 20 tables (see §6), RLS enabled on all with `auth.uid()` scoping.
- Realtime: not currently subscribed anywhere — DB is polled/reloaded per screen.
- Types: `src/integrations/supabase/types.ts` is auto-generated.

### Authentication flow
1. User hits `/auth`. Choices: Google OAuth, email+password sign-in, sign-up (password + email OTP verify), forgot password (email OTP + new password).
2. Google OAuth goes through `lovable.auth.signInWithOAuth("google", { redirect_uri: origin + "/auth/callback" })`.
3. `/auth/callback` waits for the session, runs `runLocalMemoryMigration()` (pushes local `localStorage` memories to Supabase), then navigates to `next` param or `/dashboard`.
4. `_authenticated/route.tsx` (integration-managed) is `ssr:false` and does NOT force redirect — anonymous browsing is allowed; sign-in is triggered at premium gates.
5. `attachSupabaseAuth` middleware in `src/start.ts` attaches bearer to every server-fn call.

### Server functions
- ~50 `createServerFn` handlers across `src/lib/**/*.functions.ts` (see §7).
- All app-internal writes/reads go through server fns; loaders call them via TanStack Query.

### API flow
- Component → `useServerFn` / TanStack Query loader → server fn → Supabase or external API → typed DTO back.
- Webhooks and cron use TanStack server routes under `/api/public/*`.

### Node backend?
**None.** Cloudflare Worker (via TanStack Start) is the only server runtime.

---

## 3. Current Features

Legend: ✅ Completed  🟡 Partially Completed  ⚪ Placeholder  ⛔ Not Started

| Area | Status | Notes |
|---|---|---|
| **Authentication** — email+password, Google OAuth, email OTP for sign-up/forgot, anon browsing, `/auth/callback`, local-memory migration on first sign-in | ✅ | Anon users can use the app; premium gates prompt sign-in |
| **Splash / onboarding** — 8-slide splash with story, animated visuals | ✅ | `/splash` |
| **Dashboard** — greeting, capture bar, recall/notify/places tiles, usage strip | ✅ | `/_authenticated/dashboard` |
| **Memories** — capture (text/voice/photo), edit, archive, soft-delete, reschedule, mirror to Supabase for cron push | ✅ | `useMemories()` in `src/lib/memoryos/store.ts` |
| **Reminder engine** — `scheduler.ts` schedules Capacitor `LocalNotifications` on native, web-audio + Notification API fallback in browser; mirrors reminders to `memories` table so `fire-reminders` cron can push FCM as safety net | ✅ | `src/lib/memoryos/scheduler.ts` |
| **Notification rules** — Android-only capture via `NotifyBridge` (`@capacitor-community/notification-listener`), inbox, rule engine (sender + topic includes/excludes), turns into a scheduled memory or alarm | 🟡 | Rule engine is complete; requires native plugin registered in an Android build (not yet created) |
| **Places / geofencing** — CRUD with map picker, haversine `PlaceRuntime`, enter/exit debounce, per-place windows, mirror to DB | 🟡 | Runs on `@capacitor/geolocation` foreground polling; **no native geofence background trigger** yet |
| **Memory Packs** — seed packs, custom packs, pack picker, per-pack detail routes, install/uninstall | ✅ | `_authenticated/packs*` |
| **Recall** — question-driven recall, recall content library, `/recall` route | ✅ | |
| **Do-it-later** — snooze counter with daily cap (`later_per_day` from `plan_limits`) | ✅ | |
| **Voice capture** — `capacitor-voice-recorder`, MediaRecorder web fallback | ✅ | |
| **AI features** | ⛔ | No AI Gateway usage in the current tree; `LOVABLE_API_KEY` present but unused |
| **Google Drive backup** (Premium only) — OAuth start/callback, backup JSON, restore latest, disconnect, status | ✅ | `src/lib/drive/*` + `/api/auth/drive/callback` |
| **Premium plan** — `profiles.plan`, `plan_expires_at`, `is_premium()` fn, `getMyPremiumStatus`, guarded features | ✅ | |
| **Payments** — Cashfree PG v3 create order, verify, webhook (`/api/public/cashfree-webhook`) upgrades profile to premium for 365 days | ✅ | Sandbox + prod switch by `CASHFREE_ENV` |
| **Push notifications** — VAPID key exposure, save token, send test, cron endpoint `/api/public/hooks/fire-reminders` sends FCM via HTTP v1 + service account | ✅ | Web + native (via `@capacitor-firebase/messaging`) |
| **Analytics** — Lovable production analytics visible; `getAdminAnalytics` server fn for admin console | ✅ | No PostHog / Sentry integrated |
| **Settings** — profile card, plan CTA, region theme, appearance (font/size), permissions, packs, privacy sheet, backup+restore sheet, Google Drive sheet, diagnostics, changelog, account actions (sign out / delete) | ✅ | `_authenticated/settings.tsx` |
| **Diagnostics** — permission and storage checks | ✅ | |
| **Admin console (hidden)** — routes under `/ctrl-vx9k2m7fq3z/*`: index, audit, categories, config, country-themes, experiments, flags, greetings, limits, packs (list + detail), personality, pricing, quiz, recall, rules, settings, signin, story, users | ✅ | Slug-obscured; gated by `superadmin` role via `has_role()` |
| **Plan limits (dynamic caps)** — `plan_limits` table, `getPlanLimits`, admin editor at `/ctrl…/limits`, `useTier()` + `useQuotaGuard()` | ✅ | later_per_day, notify_rules_total, places_total |
| **Country themes** — theme by user country, admin CRUD | ✅ | |
| **Feature flags** — per-env flags in `platform_settings`, admin editor | ✅ | |
| **Story marketing CMS** — chapters, subchapters, walk beats, steps, pills; publish/draft; admin editor | ✅ | Not visible to consumers; feeds internal story splash |
| **Local backup / restore** — JSON export/import in Settings | ✅ | |
| **Recovery vault** — `/recovery` route | 🟡 | Route exists; deeper flow depends on Premium retention |
| **iOS build** | ⛔ | `@capacitor/ios` installed; no `ios/` directory generated |
| **Android build** | ⛔ | `@capacitor/android` installed; no `android/` directory generated |

---

## 4. Connectors

| Connector | Purpose | Status | Missing |
|---|---|---|---|
| **Lovable Cloud (Supabase)** | Auth, database, storage(none), Data API | ✅ Fully configured | — |
| **Lovable AI Gateway** | Hosted models (no key needed) | 🟡 Key present, no usage | Actual AI feature to consume it |
| **Google OAuth** (via Lovable broker) | Sign-in | ✅ | Google provider must remain enabled in Auth |
| **Google Drive API** | Premium backup | ✅ | Requires `GOOGLE_DRIVE_CLIENT_ID` + `_SECRET` (both set) |
| **Google Maps** | Place picker geocoding | 🟡 | `GOOGLE_API_KEY` secret set; verify billing enabled |
| **Firebase Cloud Messaging** | Push (web + native) | ✅ | `FCM_SERVICE_ACCOUNT_JSON`, `FCM_PROJECT_ID`, `FCM_VAPID_PUBLIC_KEY` all set |
| **Cashfree PG v3** | Payments | ✅ | `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET`, `CASHFREE_ENV` set. **Currently `TEST` unless flipped** |
| **Sentry** | Error monitoring | ⛔ Not configured | — |
| **PostHog** | Product analytics | ⛔ Not configured | — |
| **Email (custom domain)** | Transactional / auth | 🟡 | Uses Supabase default sender; no custom domain set |

Production readiness: Supabase, Google OAuth, Drive, FCM, Cashfree = ready. AI Gateway idle. Sentry/PostHog absent.

---

## 5. Environment Variables

### Public (browser-visible, `VITE_*` in `.env`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Server-only (Lovable Cloud secrets)

**Supabase**
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_URL`

**Google**
- `GOOGLE_DRIVE_CLIENT_ID`, `GOOGLE_DRIVE_CLIENT_SECRET`
- `GOOGLE_API_KEY` (Maps)

**Firebase / FCM**
- `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_JSON`, `FCM_VAPID_PUBLIC_KEY`

**Cashfree**
- `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET`, `CASHFREE_ENV`

**Lovable**
- `LOVABLE_API_KEY` (AI Gateway — unused so far)

### Missing / Not present
| Category | Missing var | Needed for |
|---|---|---|
| Sentry | `SENTRY_DSN` | Error monitoring |
| PostHog | `POSTHOG_PROJECT_KEY`, `POSTHOG_HOST` | Product analytics |
| Email | Custom domain SPF/DKIM (Lovable Email) | Branded transactional email |
| Cashfree | `CASHFREE_ENV=PROD` flip when going live | Live payments |
| FCM Android | `google-services.json` in Android project | Native FCM (only when Android project generated) |
| Play Signing | Release keystore + passwords | Signed AAB upload |

---

## 6. Database

**Tables (20):**
`country_themes`, `custom_packs`, `drive_oauth_states`, `memories`, `notify_events`, `notify_rules`, `payments`, `places`, `plan_limits`, `platform_settings`, `profiles`, `push_tokens`, `story_chapters`, `story_pills`, `story_subchapters`, `story_walk_beats`, `story_walk_steps`, `user_drive_tokens`, `user_roles`, `user_settings`

**Views:** none.

**Storage buckets:** none configured.

**Functions:**
- `handle_new_user()` — provisions `profiles` + `user_settings` on signup; first user → superadmin
- `has_role(_user_id, _role)` — SECURITY DEFINER role check (avoids RLS recursion)
- `is_premium(_user_id)` — used by RLS + server fns
- `block_superadmin_insert()` — trigger guard against role escalation
- `guard_profile_plan_update()` — only service_role/superadmin can flip `plan`
- `set_updated_at()` / `story_touch_updated_at()` — updated_at maintenance
- `split_helper_list_tables`, `split_helper_rename_table`, `split_helper_exec_sql` — superadmin-only DB maintenance helpers (destructive; audit-worthy)

**Triggers:** _tool reports "none in triggers list"_ — the functions above are declared but the current schema-inspection tool shows an empty trigger set. Verify with the migrations that `handle_new_user` is wired via `on_auth_users_created` and `guard_profile_plan_update` on `profiles`. **Action item** — confirm during Play submission testing.

**RLS policies:** ~78 policies across the 20 tables (from migration grep). All user-data tables scope to `auth.uid()`. Public reads (`plan_limits`, `story_*` published) exposed via `TO anon` policies.

**Cron:** `/api/public/hooks/fire-reminders` is written for pg_cron to hit every minute. **Verify a `cron.schedule` entry exists in the DB** — not visible in the migrations list from the tool; if missing, push notifications will never fire from server.

**Incomplete DB items:**
- No storage bucket for voice recordings / photo captures — currently `localStorage` only. If premium sync ever includes media, a bucket is required.
- No `cron.schedule` visible in the DB dump for `fire-reminders` — verify or add.

---

## 7. Server Functions

50 functions across `src/lib/**`. Auth column: **A** = requires `requireSupabaseAuth`, **P** = public.

| Function | Purpose | Req / Resp | Auth | Consumer |
|---|---|---|---|---|
| `getPlanLimits` | Fetch dynamic tier caps | GET → `{limits[]}` | P | `useTier` (everywhere) |
| `upsertPlanLimit` | Superadmin edits caps | POST | A + superadmin | `/ctrl…/limits` |
| `deletePlanLimit` | Superadmin removes key | POST | A + superadmin | `/ctrl…/limits` |
| `getGoogleMapsKey` | Return Maps key | GET | A | Place picker |
| `setGoogleMapsKey` | Superadmin sets key | POST | A + superadmin | `/ctrl…/config` |
| `getMyRole` | Caller's role | GET | A | Admin gate |
| `getPublicSettings` | Feature flags/pricing/etc | GET | P | Root + splash |
| `updateSettings` | Superadmin platform settings | POST | A + superadmin | `/ctrl…/config` |
| `getMyPlan` | Current plan | GET | A | Settings, Drive sheet |
| `setUserPlan` | Superadmin plan override | POST | A + superadmin | `/ctrl…/users` |
| `refreshPremiumFxRates` | Refresh FX for pricing | POST | A + superadmin | `/ctrl…/pricing` |
| `migrateLocalMemories` | One-shot local→cloud on sign-up | POST | A | `runLocalMigration` (auth callback) |
| `getVapidPublicKey` | VAPID for web push | GET | P | `EnablePushButton` |
| `savePushToken` | Store FCM token | POST | A | Push enable + native FCM handler |
| `sendTestPush` | Test notification | POST | A | Settings diagnostics |
| `getDriveAuthUrl` | Start Drive OAuth (Premium only) | GET | A | Settings Drive sheet |
| `disconnectDrive` | Revoke tokens | POST | A | Settings Drive sheet |
| `getDriveStatus` | Connected? when? | GET | A | Settings Drive sheet |
| `backupToDrive` | Push backup JSON | POST | A | Settings Drive sheet |
| `restoreFromDrive` | Pull latest backup | GET | A | Settings Drive sheet |
| `getCloudSnapshot` | Legacy cloud state snapshot | GET | A | (unused today) |
| `putCloudSnapshot` | Legacy write | POST | A | (unused today) |
| `deleteMyAccount` | Full account + data delete | POST | A | Settings → account |
| `listCountryThemes` | Admin list | GET | A + superadmin | `/ctrl…/country-themes` |
| `saveCountryTheme` / `deleteCountryTheme` | Admin CRUD | POST | A + superadmin | same |
| `resolveCountry` | IP → country for theme | GET | P | Root |
| `createCashfreeOrder` | Create PG order | POST | A | Paywall |
| `verifyCashfreeOrder` | Server-side status check | POST | A | Paywall polling |
| `getMyPremiumStatus` | Live premium state | GET | A | `useTier`, Settings |
| `getPublishedChapters` / `getPublishedStory` / `getPublishedChapterBySlug` | Story CMS public reads | GET | P | (marketing story) |
| `getAllChapters` / `getAllStory` | Admin lists | GET | A + superadmin | `/ctrl…/story` |
| `upsertChapter` / `deleteChapter` / `setChapterStatus` | Chapter CMS | POST | A + superadmin | same |
| `upsertSubchapter` / `upsertBeat` / `upsertStep` / `upsertPill` / `deleteNode` / `setNodeStatus` | Story tree CMS | POST | A + superadmin | same |
| `listFeatureFlags` / `setFeatureFlag` | Flag admin | GET/POST | A + superadmin | `/ctrl…/flags` |
| `getPublicFeatureFlags` | Flags for consumer app | GET | P | Root |
| `getAdminAnalytics` | Aggregate KPIs | GET | A + superadmin | `/ctrl…/index` |
| `listPlatformUsers` | User list | GET | A + superadmin | `/ctrl…/users` |
| `upsertMemoryReminder` / `deleteMemoryReminder` | Mirror reminders to DB for cron | POST | A | `useMemories` |

**Unused/legacy server functions:**
- `getCloudSnapshot`, `putCloudSnapshot` — no importers found in components; candidates for removal.

**Server routes (raw HTTP):**
- `/api/public/cashfree-webhook` — signed webhook, HMAC verified, idempotent
- `/api/public/hooks/fire-reminders` — cron endpoint (pg_cron)
- `/api/auth/drive/callback` — Google Drive OAuth callback

---

## 8. Native Android Readiness

Legend: ✅ Implemented  🔨 Needs native Kotlin  ➖ Not required

| Capability | Status | Notes |
|---|---|---|
| **Capacitor project generated** | 🔨 | `capacitor.config.ts` present; **no `android/` directory** — must run `npx cap add android` (or build native Kotlin app) |
| **AlarmManager (exact wake)** | 🔨 | Web scheduler + `LocalNotifications` present; true `AlarmManager.setAlarmClock` requires native |
| **Foreground service (ring until dismissed)** | 🔨 | Not present |
| **Boot receiver (reschedule after reboot)** | 🔨 | Not present — Capacitor Local Notifications handle reschedule after reboot for scheduled notifs, but a native app should also verify |
| **Notification listener (read other apps)** | 🔨 | `NotifyBridge` calls `@capacitor-community/notification-listener`; plugin must be registered natively |
| **Geofencing (background)** | 🔨 | Only foreground haversine polling today; `GeofencingClient` not wired |
| **Exact alarm permission (SDK 31+)** | 🔨 | Must be requested natively |
| **Background location (SDK 29+)** | 🔨 | Two-step permission flow not implemented |
| **Notification channels** | ✅ | `mindrop-alarm` (IMPORTANCE_MAX) + `mindrop-nudge` (HIGH) created in `scheduler.ts` |
| **FCM** | ✅ | Web + `@capacitor-firebase/messaging` package; needs `google-services.json` when Android project generated |
| **Google Drive backup** | ✅ | Server-side OAuth flow already works cross-platform |
| **Cashfree native SDK** | 🔨 | Currently web checkout; native Android app should embed `com.cashfree.pg:api` |
| **Battery optimization prompt** | 🔨 | Not implemented |
| **Deep links / OAuth callback** | 🔨 | Custom scheme `in.mindrop.app://` not declared in a manifest yet |
| **WorkManager (background sync/retry)** | 🔨 | Not present |
| **Room database (offline cache)** | 🔨 | Currently `localStorage` only |
| **Realtime sync** | ➖ (not used) | No Supabase Realtime subscription; polling is fine |
| **Offline support** | 🟡 | Local `localStorage` cache exists; no queued mutation retry |
| **AndroidManifest** | 🔨 | Not generated |
| **Gradle dependencies** | 🔨 | Not generated |
| **Permissions requested** | 🟡 | Web-level asks only (`Notification.requestPermission`, geolocation); Android runtime perms not implemented |

Full Kotlin implementation guide lives in `NATIVE_ANDROID_GUIDE.md` alongside this file.

---

## 9. Third-Party Services

| Service | Purpose | Config status |
|---|---|---|
| **Supabase / Lovable Cloud** | Auth, DB, Data API | ✅ Live |
| **Lovable AI Gateway** | Optional LLM models | 🟡 Key present, unused |
| **Google OAuth** | Sign-in | ✅ |
| **Google Drive API** | Premium backup | ✅ |
| **Google Maps / Geocoding** | Place picker | 🟡 Verify billing on `GOOGLE_API_KEY` |
| **Firebase Cloud Messaging** | Push (web + native) | ✅ |
| **Cashfree PG v3** | Payments | ✅ (currently TEST) |
| **Sentry** | Errors | ⛔ |
| **PostHog / Amplitude** | Product analytics | ⛔ |
| **Lovable Email (custom domain)** | Auth + transactional email | ⛔ |
| **Leaflet + OSM tiles** | Map rendering | ✅ (no key needed) |

---

## 10. Security Review

Checked: RLS coverage, `TO anon` breadth, secret handling, public endpoints.

- **RLS coverage** — ✅ All 20 tables have RLS enabled; ~78 policies scoping to `auth.uid()`. Story CMS + `plan_limits` + `platform_settings` have deliberate `TO anon SELECT` policies for public reads.
- **Role model** — ✅ Roles stored in dedicated `user_roles` table; `has_role()` is SECURITY DEFINER; `block_superadmin_insert` guards escalation via API; `handle_new_user` bootstraps only when zero roles exist (first-user superadmin).
- **Plan flipping** — ✅ `guard_profile_plan_update()` blocks plan changes from anyone except service role / superadmin.
- **Webhook auth** — ✅ `cashfree-webhook` verifies HMAC (`timingSafeEqual`) with `CASHFREE_WEBHOOK_SECRET`.
- **Cron endpoint auth** — ⚠️ `fire-reminders` doc-comment says it uses Supabase `apikey`; verify the current handler actually rejects unauthenticated callers (public URL, so must self-guard). **High priority to confirm**.
- **`split_helper_exec_sql`** — ⚠️ SECURITY DEFINER function that runs `DROP TABLE` statements. Restricted to `superadmin` via `has_role`, but this is a footgun; consider removing before launch.
- **Client secrets** — ✅ No service role key or Cashfree secret referenced in client bundles (all inside `.server.ts` / handler-scoped `await import`).
- **Public server routes** — `/api/public/cashfree-webhook` (HMAC-verified), `/api/public/hooks/fire-reminders` (needs verified auth check), `/api/auth/drive/callback` (uses stored `state`).
- **Sign-in flow** — Email OTP + password + Google. OTP resend cooldown enforced (30s). Password min 8 chars.
- **Admin obfuscation** — Slug-based (`ctrl-vx9k2m7fq3z`) — security by obscurity only; the `has_role('superadmin')` check is what actually protects the routes.
- **CORS / CSRF** — Server fns are RPC-serialized to the same origin; webhooks accept POST only. No custom CORS added — inherit Lovable defaults.
- **Missing** — No rate-limiting on public server fns (`getPlanLimits`, `getPublicSettings`, `resolveCountry`, `getVapidPublicKey`). Cheap reads but abuseable.

**Recommended actions before Play launch**
1. Confirm `fire-reminders` rejects callers without the expected header/secret.
2. Remove or lock down `split_helper_exec_sql` in production.
3. Add rate limiting or Cloudflare WAF rules on public endpoints.
4. Wire Sentry.

---

## 11. Technical Debt

| Item | Severity | Note |
|---|---|---|
| No `android/` directory generated | **High** | Blocks Play Store submission |
| No native alarm / geofence / listener implementation | **High** | Core value prop can't run reliably in a WebView |
| `getCloudSnapshot` / `putCloudSnapshot` unused | Low | Dead code — remove |
| `split_helper_exec_sql` DROP-TABLE helper live in prod | Medium | Keep only if genuinely needed post-launch |
| `fire-reminders` cron auth check needs verification | **High** | If unguarded, anyone can drain FCM quota |
| No Supabase cron schedule verified in DB | **High** | Without it, reminders don't push server-side |
| No Room / offline mutation queue on native | Medium | Native app should not depend on `localStorage` |
| Notification listener plugin (`@capacitor-community/notification-listener`) not in `package.json` | **High** | The `NotifyBridge` will no-op until the plugin is installed and the Android project is generated with it |
| Realtime Supabase subscription absent | Low | Not required if pull-on-focus is acceptable |
| No Sentry / PostHog | Medium | Blind to production issues |
| Cashfree still `TEST` | **High to flip before launch** | `CASHFREE_ENV=PROD` |
| Admin slug is stable string in code (`ctrl-vx9k2m7fq3z`) | Low | Only cosmetic; role check is real gate |
| `useCloudSnapshot` legacy path | Low | Delete alongside snapshot fns |
| No TODOs / FIXMEs found in source | — | Clean on that front |

---

## 12. Production Readiness Score (0–100)

| Area | Score | Why |
|---|---|---|
| UI (web) | **90** | Design system + tokens consistent; auth page + settings refreshed; a11y basics in place |
| Backend (server fns) | **85** | 50 fns, typed, validated with Zod; a couple of unused legacy fns |
| Database | **80** | RLS + role model solid; missing storage bucket for media; verify cron.schedule row |
| Authentication | **90** | Google + email+password + OTP; anon browsing; local→cloud migration |
| Payments | **75** | Cashfree integration + webhook complete; still in TEST mode |
| Notifications | **70** | Web + FCM push wired; native alarm reliability depends on native shell not yet built |
| Offline | **55** | `localStorage` works; no queued sync; no Room on native |
| Native Android | **20** | Capacitor packages installed, Android project not generated, no native modules for alarm/listener/geofence |
| Performance | **75** | SSR + Query cache; no image CDN metrics; bundle not audited |
| Security | **75** | RLS thorough; needs cron-endpoint auth confirmation + rate limits + Sentry |
| Deployment | **80** | Published on Lovable Cloud; no custom domain yet; env pipeline healthy |

**Weighted overall:** ≈ **72 / 100**. Web app is production-shape; native + observability are the gaps.

---

## 13. Recommended Development Roadmap

### Phase 1 — Server hardening (2–3 days)
- **P1.1** Verify + secure `fire-reminders` cron endpoint (header token check).
- **P1.2** Verify `cron.schedule` entry for reminders exists; if not, add via migration.
- **P1.3** Remove `getCloudSnapshot`/`putCloudSnapshot` and `split_helper_exec_sql` (or lock behind a build flag).
- **P1.4** Add rate limits on public server fns.
- **P1.5** Add Sentry (server fns + client).
- **Dependencies:** none. Blocks nothing but should ship before Cashfree PROD.

### Phase 2 — Native Android build (2–3 weeks)
- **P2.1** `npx cap add android` — generate project + wire `google-services.json`.
- **P2.2** Add `@capacitor-community/notification-listener` plugin + native registration.
- **P2.3** Implement `AlarmManager`+`AlarmRingService`+`BootReceiver` (see `NATIVE_ANDROID_GUIDE.md`).
- **P2.4** Implement `GeofencingClient` + `GeofenceReceiver`.
- **P2.5** Wire native FCM handler → `AlarmRingService`.
- **P2.6** Battery-optim prompt, exact-alarm permission, background-location two-step prompt.
- **P2.7** Deep-link scheme `in.mindrop.app://auth-callback`.
- **P2.8** Room cache + WorkManager sync queue.
- **Dependencies:** Phase 1 (secured backend).

### Phase 3 — Payments live + observability (2–3 days)
- **P3.1** Flip `CASHFREE_ENV=PROD`, add PROD keys, verify a real ₹1 order end-to-end.
- **P3.2** Cashfree native SDK integration inside the Android project.
- **P3.3** PostHog for product analytics (funnel: install → sign-up → premium).
- **P3.4** Custom email domain (Lovable Email) for auth + transactional.
- **Dependencies:** Phase 2 (native shell ready).

### Phase 4 — Play Store submission (1 week)
- **P4.1** Play Console setup, data-safety form, privacy policy URL.
- **P4.2** Declarations: exact alarm, background location, notification listener (or side-load), full-screen intent.
- **P4.3** Internal testing track → closed beta → production.
- **P4.4** Sideload channel on `/download` for notification-listener fallback if Play rejects.
- **Dependencies:** Phase 3.

### Phase 5 — Post-launch nice-to-haves (ongoing)
- Storage bucket for voice/photo captures on premium sync.
- Supabase Realtime for cross-device memory updates.
- AI features (summarize a memory, extract dates → auto-schedule) via Lovable AI Gateway.
- iOS build (`npx cap add ios`) — parallel to P2 if resource available.

---

## 14. Final Summary

### What's complete
- Full-featured web app: auth (Google + email+password + OTP), memories, packs, recall, places, notify rules, do-it-later, settings, diagnostics, admin console (12+ management pages), plan limits, Google Drive backup for premium, Cashfree payment flow, FCM push, story CMS, country themes, feature flags.
- Backend: 50 typed server functions, ~78 RLS policies across 20 tables, role model with escalation guards, HMAC-verified Cashfree webhook, cron endpoint for reminders.
- Design system: warm-canvas / ink / brand tokens; consistent `t-*` typography; responsive PhoneFrame.

### What's missing
- Any generated Android project (`android/`), keystore, `google-services.json`.
- Native modules for alarm-ringing, background geofencing, notification listener.
- Cashfree PROD credentials flipped on.
- Server-side observability (Sentry) and product analytics (PostHog).
- Custom email domain.

### Biggest technical risks
1. **Reminder cron auth** — public endpoint that could be abused if unguarded.
2. **Alarm reliability** — until the native app ships, "ring when closed" is not truly guaranteed on Android; you're leaning on FCM + Capacitor local notifications inside a Capacitor shell that itself doesn't exist yet.
3. **`split_helper_exec_sql`** left in production DB.

### Biggest blockers to Play Store
1. No `android/` project.
2. Native permissions + services not implemented (alarms, geofences, listener).
3. Cashfree still in sandbox.

### What to do next
1. Fix cron-endpoint auth + confirm pg_cron schedule row (Phase 1).
2. Generate the Android project, wire FCM `google-services.json`, and implement the native alarm / geofence / listener services from `NATIVE_ANDROID_GUIDE.md` (Phase 2).
3. Flip Cashfree to PROD and end-to-end test one real payment (Phase 3).
4. Ship internal-testing track on Play Console (Phase 4).

_End of audit._
