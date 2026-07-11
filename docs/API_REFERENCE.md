# API Reference

Every server function and public server route in MindDrop.

**Source of truth:** the `.functions.ts` files under `src/lib/**` and the routes under `src/routes/api/public/**`. When this document drifts, the code wins — re-generate this file.

**Conventions:**
- **Auth: user** — uses `requireSupabaseAuth` middleware; bearer token attached client-side. RLS applies.
- **Auth: admin** — user + `has_role(uid, 'superadmin')` check inside handler.
- **Auth: public** — no middleware; endpoint must self-verify (webhook signature, HMAC, etc.).
- **Auth: system** — cron / internal only; see [SECURITY.md](./SECURITY.md).

Where fields are not exhaustively enumerated below, treat the file itself as source of truth. See [DATABASE_REFERENCE.md](./DATABASE_REFERENCE.md) for table columns.

---

## Modules

- [Auth / Account](#auth--account)
- [Payments](#payments)
- [Push](#push)
- [Drive](#drive)
- [Plan & Limits](#plan--limits)
- [Settings](#settings)
- [Memory Reminder Sync](#memory-reminder-sync)
- [FX (currency)](#fx-currency)
- [Local Migration](#local-migration)
- [Platform Settings](#platform-settings)
- [Theme (country)](#theme-country)
- [Marketing / Story](#marketing--story)
- [Admin — Analytics](#admin--analytics)
- [Admin — Flags](#admin--flags)
- [Cloud Snapshot](#cloud-snapshot)
- [Public HTTP Routes](#public-http-routes)

---

### Auth / Account
`src/lib/auth/account.functions.ts`

| Function | Auth | Input | Output | Consumer Screen | Tables |
|---|---|---|---|---|---|
| `deleteAccount` | user | – | `{ ok }` | Settings → Danger zone | `profiles`, `user_roles`, `user_settings`, cascades |

**Errors:** unauthorized (401), delete failed (500).
**Rate limit:** none enforced today (TODO).

### Payments
`src/lib/payments.functions.ts` · Cashfree

| Function | Auth | Purpose | Output | Screen | Tables |
|---|---|---|---|---|---|
| `createCashfreeOrder` | user | Create Cashfree order + return payment session | `{ orderId, paymentSessionId }` | Pricing → Upgrade | `payments`, `profiles` |
| `verifyCashfreePayment` | user | Poll/verify order status after redirect | `{ status }` | Post-checkout | `payments`, `profiles` |

**Env:** `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV`, `CASHFREE_WEBHOOK_SECRET`. See [CONNECTORS.md](./CONNECTORS.md#cashfree).
**Errors:** provider errors relayed as `Provider request failed [status]: body`.

### Push
`src/lib/push.functions.ts` · FCM

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `registerPushToken` | user | Store/refresh FCM/web push token | `push_tokens` |
| `unregisterPushToken` | user | Remove token on sign-out | `push_tokens` |
| `sendTestPush` | admin | Send test notification | `push_tokens` |

**Env:** `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_JSON`, `FCM_VAPID_PUBLIC_KEY`.

### Drive
`src/lib/drive/drive.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `startDriveOAuth` | user | Begin Google Drive OAuth (PKCE state) | `drive_oauth_states` |
| `completeDriveOAuth` | user | Exchange code, persist tokens | `user_drive_tokens` |
| `disconnectDrive` | user | Revoke + delete tokens | `user_drive_tokens` |
| `driveStatus` | user | Check connection state | `user_drive_tokens` |

**Env:** `GOOGLE_DRIVE_CLIENT_ID`, `GOOGLE_DRIVE_CLIENT_SECRET`.

### Plan & Limits
`src/lib/plan.functions.ts`, `src/lib/limits.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `getMyPlan` | user | Current plan + expiry | `profiles` |
| `getPlanLimits` | user | Effective limits for user's plan | `plan_limits`, `profiles` |
| `checkLimit(kind)` | user | Whether user is within a given quota | `plan_limits`, `memories`, etc. |

### Settings
`src/lib/settings.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `getMySettings` | user | User preferences | `user_settings` |
| `updateMySettings` | user | Update preferences | `user_settings` |

### Memory Reminder Sync
`src/lib/memoryReminderSync.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `syncReminderForMemory` | user | Recompute next-fire for a memory | `memories`, `notify_events` |
| `fireDueReminders` | system/admin | Fan-out due reminders (called by cron) | `memories`, `notify_events`, `push_tokens` |

> **Security TODO:** confirm the cron/public entrypoint for `fireDueReminders` verifies caller (per [PROJECT_AUDIT.md](./PROJECT_AUDIT.md#security)).

### FX (currency)
`src/lib/fx.functions.ts`

| Function | Auth | Purpose |
|---|---|---|
| `convert(amount, from, to)` | user | Currency conversion for pricing display |

### Local Migration
`src/lib/localMigration.functions.ts`

| Function | Auth | Purpose |
|---|---|---|
| `runLocalMigration` | user | One-shot import from legacy local storage into cloud tables |

### Platform Settings
`src/lib/platformSettings.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `getPlatformSettings` | user | Public runtime config | `platform_settings` |
| `updatePlatformSettings` | admin | Update platform config | `platform_settings` |

### Theme (country)
`src/lib/theme/country.functions.ts`, `src/lib/theme/countryThemes.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `detectCountry` | user | Country from IP / profile | `profiles` |
| `getCountryThemes` | user | Themes for a country | `country_themes` |
| `upsertCountryTheme` | admin | Admin CRUD | `country_themes` |

### Marketing / Story
`src/lib/marketing/story.functions.ts`

| Function | Auth | Purpose | Tables |
|---|---|---|---|
| `listStories` | public (loader-safe) | List published stories | `story_chapters`, `story_subchapters` |
| `getStory(slug)` | public | Single story w/ chapters | `story_*` |
| `upsertStory` | admin | Author/edit | `story_*` |

### Admin — Analytics
`src/lib/admin/analytics.functions.ts`

| Function | Auth | Purpose |
|---|---|---|
| `getUserGrowth` | admin | Daily/weekly signups |
| `getRevenueSummary` | admin | Cashfree revenue rollup |
| `getFeatureUsage` | admin | Usage per feature |

### Admin — Flags
`src/lib/admin/flags.functions.ts`

| Function | Auth | Purpose |
|---|---|---|
| `listFlags` | admin | Read all feature flags |
| `upsertFlag` | admin | Create/update a flag |
| `deleteFlag` | admin | Remove a flag |

### Cloud Snapshot
`src/lib/cloud/snapshot.functions.ts`

| Function | Auth | Purpose |
|---|---|---|
| `exportSnapshot` | user | Build user-scoped export bundle |
| `pushSnapshotToDrive` | user | Upload snapshot to Google Drive |
| `restoreSnapshot` | user | Restore from snapshot (partial — see [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md)) |

---

## Public HTTP Routes

Under `src/routes/api/public/*` — bypass auth on published sites; must self-verify. See [SECURITY.md](./SECURITY.md#webhook-verification).

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/public/cashfree-webhook` | POST | HMAC signature | Cashfree order status updates. Verifies `x-webhook-signature` with `CASHFREE_WEBHOOK_SECRET`. Writes to `payments`, may update `profiles.plan` via `service_role`. |
| `/api/public/hooks/*` | varies | per hook | Additional webhook endpoints — see files under `src/routes/api/public/hooks/`. |

---

## Rate Limits

Global rate limits are **not** enforced today. Cloudflare/Lovable edge provides basic abuse protection. Application-level limits are TODO — see [PERFORMANCE.md](./PERFORMANCE.md) and [SECURITY.md](./SECURITY.md#rate-limiting).

## Error Contract

All server functions surface provider errors verbatim to server logs and return a plain `Error` client-side. Never assume a redacted message; check server-function-logs. Handlers must:
- Check `response.ok` before parsing external HTTP.
- Log `[status]: body`.
- Never leak `SUPABASE_SERVICE_ROLE_KEY` or Cashfree secrets.
