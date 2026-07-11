# Connectors

External services MindDrop integrates with. Each entry lists purpose, config, secrets, current status, production-readiness, testing, and failure handling.

Secrets are managed via Lovable Cloud secrets (see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)).

---

## Supabase (Lovable Cloud) — Postgres, Auth, Storage

- **Purpose:** primary backend (data, auth, cron).
- **Config:** managed by Lovable Cloud; project settings via the Lovable console.
- **Secrets:** `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`.
- **Status:** ✅ Production.
- **Production ready:** yes.
- **Testing:** verify auth flow, RLS via `supabase--read_query`, and migration replay in preview.
- **Failure handling:** transient DB errors surface as `PGRST*` codes; server functions log and rethrow. On outage, show a maintenance banner (server-driven flag).

## Cashfree — Payments

- **Purpose:** Indian rupee subscription payments.
- **Config:** `src/lib/payments.functions.ts` + `/api/public/cashfree-webhook`.
- **Secrets:** `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV`, `CASHFREE_WEBHOOK_SECRET`.
- **Status:** 🟡 SANDBOX. Flip to PROD by changing `CASHFREE_ENV` and swapping keys.
- **Production ready:** code yes; PROD keys pending business signoff.
- **Testing:** use Cashfree test cards in SANDBOX; run `verifyCashfreePayment` end-to-end; simulate webhook with the Cashfree dashboard's replay tool.
- **Failure handling:** provider errors surfaced as `Provider request failed [status]: body`. Webhook route rejects invalid HMAC with 401. Retries handled by Cashfree.

## Firebase Cloud Messaging (FCM)

- **Purpose:** push notifications (web + future Android).
- **Config:** `src/lib/fcm.server.ts`, `src/lib/firebase.ts`, `src/lib/push.functions.ts`.
- **Secrets:** `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_JSON`, `FCM_VAPID_PUBLIC_KEY`.
- **Status:** ✅ Web push configured; Android push TODO (needs `google-services.json`).
- **Production ready:** web yes.
- **Testing:** `sendTestPush` from admin console; verify token registration in `push_tokens`.
- **Failure handling:** FCM 404 on token → remove stale row; 5xx → retry with exponential backoff.

## Google Drive

- **Purpose:** user-owned backup destination.
- **Config:** `src/lib/drive/drive.functions.ts` (OAuth PKCE) + `cloud/snapshot.functions.ts` (upload).
- **Secrets:** `GOOGLE_DRIVE_CLIENT_ID`, `GOOGLE_DRIVE_CLIENT_SECRET`, `GOOGLE_API_KEY`.
- **Status:** ✅ Connect + snapshot; scheduled backup TODO.
- **Production ready:** yes.
- **Testing:** connect a real Drive account in preview, run `exportSnapshot` + `pushSnapshotToDrive`, verify file in the user's Drive.
- **Failure handling:** token expiry → refresh via stored refresh token; if revoked, mark connection dead and prompt reconnect.

## Google OAuth (Sign-in) via Lovable Broker

- **Purpose:** Google sign-in.
- **Config:** `lovable.auth.signInWithOAuth('google', ...)`; provider enabled via `supabase--configure_social_auth`.
- **Secrets:** managed by broker.
- **Status:** ✅.
- **Production ready:** yes.
- **Testing:** sign in with a Google account from `/auth`; verify session and profile creation.
- **Failure handling:** if "Unsupported provider" → re-run `configure_social_auth`. `redirect_uri` must be a public same-origin URL.

## Lovable AI Gateway

- **Purpose:** future AI features (smart tagging, voice transcription).
- **Secrets:** `LOVABLE_API_KEY` (managed).
- **Status:** ⚪ Not wired yet.
- **Production ready:** N/A.
- **Testing:** TBD.
- **Failure handling:** relay provider errors; never fail silently.

## Cloudflare (implicit)

- **Purpose:** hosting the Worker runtime for TanStack Start SSR.
- **Config:** managed by Lovable.
- **Status:** ✅.
- **Failure handling:** platform-level; monitor Lovable status.

---

## Adding a New Connector

1. If a Lovable-managed connector exists, prefer `standard_connectors--connect` over pasting a raw API key.
2. Store secrets via the `add_secret` tool — never in code, never in `.env` committed.
3. Document the entry here with: purpose, config file(s), secrets used, status, test steps, failure mode.
4. Update [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) and [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).
