# Feature Backlog

Complete inventory of MindDrop features. Status reflects the current codebase; see [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) for detailed implementation notes. Anything not in the code is marked **TODO**.

**Owner legend:** Web = Lovable web team · Backend = server functions / DB · Android = Kotlin team · Ops = DevOps · Product = product owner.

**Status legend:** ✅ shipped · 🟡 partial · 🔵 planned · ⚪ TODO / not started.

---

## Authentication

| Feature | Description | Owner | Status | Deps | Priority | Native | Backend | Frontend | Admin | Future |
|---|---|---|---|---|---|---|---|---|---|---|
| Email/password auth | Supabase Auth email+password | Backend | ✅ | Supabase | P0 | – | ✔ | ✔ | – | Passkeys |
| Google OAuth | Lovable broker `signInWithOAuth('google')` | Web | ✅ | Broker | P0 | Native CredentialManager (planned) | ✔ | ✔ | – | Apple sign-in |
| Password reset | `reset-password.tsx` route | Web | ✅ | Supabase | P1 | – | ✔ | ✔ | – | – |
| Auth-gated layout | `_authenticated/` pathless layout | Web | ✅ | – | P0 | – | – | ✔ | – | – |
| Account deletion | `src/lib/auth/account.functions.ts` | Backend | ✅ | Auth admin | P1 | – | ✔ | ✔ | – | Grace period |

## Dashboard

| Feature | Description | Owner | Status | Deps | Priority | Native | Backend | Frontend | Admin | Future |
|---|---|---|---|---|---|---|---|---|---|---|
| Home dashboard | Landing after sign-in | Web | ✅ | – | P0 | – | ✔ | ✔ | – | Widgets |
| Splash | `splash.tsx` first-run | Web | ✅ | – | P2 | Native splash | – | ✔ | – | – |

## Memory

| Feature | Owner | Status | Deps | Priority | Native | Backend | Frontend | Admin | Future |
|---|---|---|---|---|---|---|---|---|---|
| Capture memory (text/link) | Web | ✅ | `memories` table | P0 | – | ✔ | ✔ | – | Image, voice |
| Memory list/detail | Web | ✅ | – | P0 | – | ✔ | ✔ | – | Search |
| Attach place/rule/reminder | Web | ✅ | related tables | P0 | – | ✔ | ✔ | – | – |
| Voice capture | Web | ⚪ TODO | STT provider | P2 | Native mic | ✔ | ✔ | – | – |
| Image/photo memory | Web | ⚪ TODO | Storage bucket | P2 | Native camera | ✔ | ✔ | – | – |

## Reminder

| Feature | Owner | Status | Notes |
|---|---|---|---|
| Time-based reminder | Backend | ✅ | `memoryReminderSync.functions.ts` |
| Recurrence | Backend | 🟡 | Basic recurrence; complex rules TODO |
| Native alarm (AlarmManager) | Android | ⚪ TODO | See NATIVE_ANDROID_GUIDE.md §Alarms |
| Snooze / dismiss | Web | 🟡 | Web only; native TODO |
| Boot-persistence | Android | ⚪ TODO | `BootReceiver` |

## Notify

| Feature | Owner | Status | Notes |
|---|---|---|---|
| In-app notify feed | Web | ✅ | `notify_events` table |
| Notify rules | Backend | ✅ | `notify_rules` |
| Match by app package | Android | ⚪ TODO | `NotificationListenerService` |
| Web push | Web | 🟡 | FCM VAPID configured |

## Places

| Feature | Owner | Status | Notes |
|---|---|---|---|
| Save place | Web | ✅ | `places` table |
| Manual place picker | Web | ✅ | – |
| Geofence trigger | Android | ⚪ TODO | `GeofencingClient` |
| Background location | Android | ⚪ TODO | Requires justification (Play) |

## Rules

| Feature | Owner | Status |
|---|---|---|
| Rule CRUD | Web | ✅ |
| Server evaluation | Backend | ✅ |
| Cron fan-out | Backend | ✅ *(TODO: verify auth on cron endpoint — PROJECT_AUDIT.md)* |

## Packs

| Feature | Owner | Status | Notes |
|---|---|---|---|
| System packs | Backend | ✅ | seeded via migration |
| Custom packs | Backend | ✅ | `custom_packs` table |
| Marketplace / share pack | Product | ⚪ TODO | – |

## Recall

| Feature | Owner | Status |
|---|---|---|
| Recall surface | Web | ✅ |
| Smart recall ordering | Backend | 🟡 |
| Spaced repetition | Backend | ⚪ TODO |

## Voice

| Feature | Owner | Status |
|---|---|---|
| Voice capture | Web/Android | ⚪ TODO |
| Voice playback | Web | ⚪ TODO |
| Voice → text | Backend (AI) | ⚪ TODO |

## Premium

| Feature | Owner | Status |
|---|---|---|
| Plan enforcement | Backend | ✅ (`is_premium`, `plan_limits`) |
| Upsell surfaces | Web | 🟡 |
| Grace period | Backend | ⚪ TODO |

## Payments

| Feature | Owner | Status | Notes |
|---|---|---|---|
| Cashfree checkout | Backend | ✅ | `payments.functions.ts`, SANDBOX |
| Cashfree webhook | Backend | ✅ | `/api/public/cashfree-webhook` |
| Cashfree PROD flip | Ops | ⚪ TODO | secret swap only |
| Refund flow | Backend | ⚪ TODO | – |
| Native Cashfree SDK | Android | ⚪ TODO | – |

## Drive

| Feature | Owner | Status |
|---|---|---|
| OAuth connect | Backend | ✅ (`drive_oauth_states`, `user_drive_tokens`) |
| Snapshot export | Backend | ✅ (`cloud/snapshot.functions.ts`) |
| Restore | Backend | 🟡 |
| Scheduled backup | Backend | ⚪ TODO |

## Analytics

| Feature | Owner | Status |
|---|---|---|
| Admin analytics dashboard | Web | ✅ (`admin/analytics.functions.ts`) |
| Product analytics (PostHog) | Ops | ⚪ TODO |
| Error monitoring (Sentry) | Ops | ⚪ TODO |

## Settings

| Feature | Owner | Status |
|---|---|---|
| Profile settings | Web | ✅ |
| Theme / country / language | Web | ✅ |
| Notification prefs | Web | ✅ |
| Font size / accessibility | Web | ✅ (`.t-*` roles) |

## Admin

| Feature | Owner | Status |
|---|---|---|
| Admin console (obscured slug) | Web | ✅ |
| User management | Backend | ✅ |
| Feature flags | Backend | ✅ (`admin/flags.functions.ts`) |
| Country themes | Backend | ✅ |
| Platform settings | Backend | ✅ |
| Superadmin bootstrap | Backend | ✅ (`handle_new_user`) |

## Marketing

| Feature | Owner | Status |
|---|---|---|
| Landing / features / pricing | Web | ✅ |
| Blog / story pages | Web | ✅ (`marketing/story.functions.ts`) |
| SEO metadata per route | Web | ✅ |
| Sitemap | Web | ⚪ TODO |

## AI

| Feature | Owner | Status |
|---|---|---|
| AI features (via Lovable AI Gateway) | Backend | ⚪ TODO |
| Smart tagging | Backend | ⚪ TODO |
| Copy: **never say "AI" to users** (memory rule) | Product | ✅ |

## Infrastructure

| Feature | Owner | Status |
|---|---|---|
| RLS on all public tables | Backend | ✅ |
| Auto-backups | Ops | ✅ (Supabase managed) |
| Cron via `pg_cron` | Backend | ✅ |
| CI (GitHub Actions) | Ops | ⚪ TODO |
| Error monitoring | Ops | ⚪ TODO |

## Android Native

See [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md). All ⚪ TODO until the shell is generated.

| Feature | Status |
|---|---|
| Android shell (Kotlin/Compose) | ⚪ |
| AlarmManager | ⚪ |
| Foreground Service | ⚪ |
| Geofencing | ⚪ |
| NotificationListener | ⚪ |
| Boot receiver | ⚪ |
| FCM push | ⚪ |
| Cashfree native SDK | ⚪ |
| Room offline cache | ⚪ |
| WorkManager sync | ⚪ |

## iOS

⚪ Not started. Not on the current roadmap. See [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md).

## Future Features

Tracked in [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md): spaced repetition, memory graph, shared vaults, coach linking parity (already a memory rule), widget on Android, wearable companion.
