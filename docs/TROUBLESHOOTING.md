# Troubleshooting

Common issues and how to resolve them.

Cross-reference [SECURITY.md](./SECURITY.md) for security-related failures and [DEPLOYMENT.md](./DEPLOYMENT.md) for build/publish issues.

---

## Sign-in

### "Unsupported provider" on Google sign-in
- **Cause:** Google provider not enabled in Supabase Auth.
- **Fix:** call `supabase--configure_social_auth` for `google`. Verify by hitting `/auth` in preview.

### OAuth redirects to a blank page or bounces to sign-in
- **Cause:** `redirect_uri` points to a protected route (e.g. `/dashboard`), so the callback runs before the session hydrates.
- **Fix:** set `redirect_uri` to `window.location.origin` or `/auth/callback`. Save the intended path separately, navigate after `getSession()` resolves.

### Session lost on hard refresh of an authenticated page
- **Cause:** protected route configured with `ssr: true` — the server has no `localStorage` session.
- **Fix:** move it under `_authenticated/`; the managed layout is `ssr: false`.

## Server Functions

### `Unauthorized: No authorization header provided`
- **Cause:** `src/start.ts` missing a client-side `functionMiddleware` that attaches the bearer.
- **Fix:** append `attachSupabaseAuth` from `@/integrations/supabase/auth-attacher` (or the project's own bearer middleware) — do not replace.

### `Server function info not found for <hash>` in production
- **Cause:** a `$`-prefixed server-fn stub called from another server-fn handler.
- **Fix:** import the underlying `.server.ts` helper directly inside the handler.

### `Expected 3 parts in JWT; got 1`
- **Cause:** using `supabaseAdmin` for ordinary Data API reads; Lovable Cloud injected an `sb_secret_*` format key.
- **Fix:** use a server publishable-key client for public reads; reserve `supabaseAdmin` for verified webhooks/admin ops.

### Build fails: `Error: Unauthorized`
- **Cause:** a protected server fn (`requireSupabaseAuth`) is called from a public route loader; prerender has no bearer.
- **Fix:** move the loader under `_authenticated/`, or convert to `useServerFn` + `useQuery` in a component.

## Database

### New table returns "permission denied" from the app
- **Cause:** missing `GRANT` in the migration.
- **Fix:** add `GRANT SELECT, INSERT, UPDATE, DELETE ON public.<t> TO authenticated;` and `GRANT ALL ... TO service_role;` in a new migration.

### RLS policy loop / infinite recursion
- **Cause:** policy queries a table whose policy queries back.
- **Fix:** use a `SECURITY DEFINER` helper (like `has_role`) instead of nested policy lookups.

### Plan change silently ignored
- **Cause:** `guard_profile_plan_update` requires `service_role` or superadmin.
- **Fix:** run the update from a server fn with `supabaseAdmin`, or use superadmin console.

## Payments (Cashfree)

### Webhook returns 401
- **Cause:** signature mismatch.
- **Fix:** confirm `CASHFREE_WEBHOOK_SECRET` matches the value configured in Cashfree dashboard. Redeploy after `update_secret`.

### Order created but plan never upgrades
- **Cause:** webhook never reached the app (Cashfree dashboard shows delivery failures) or webhook ran before `service_role` GRANT existed.
- **Fix:** verify `payments` row status; replay from Cashfree dashboard; check server-function-logs.

### `Provider request failed [400]: ...`
- **Cause:** Cashfree rejected the request payload (wrong env, wrong currency, missing field).
- **Fix:** read the body — Cashfree returns the exact failure. Adjust the payload; do not retry blindly.

## Push (FCM)

### Test push returns success but nothing arrives
- **Cause:** stale token, browser notification permission revoked, or VAPID key mismatch.
- **Fix:** re-register token, re-grant permission, verify `FCM_VAPID_PUBLIC_KEY` matches Firebase console.

## Drive

### `driveStatus` shows disconnected but user connected
- **Cause:** refresh token revoked by user or Google.
- **Fix:** delete row from `user_drive_tokens`, prompt reconnect.

## Reminders

### Reminder never fires on web
- Check `notify_events` for a row — if missing, `syncReminderForMemory` didn't run.
- Confirm cron job is active: `SELECT * FROM cron.job WHERE active;`.
- Confirm push token exists in `push_tokens`.

### Reminder never fires on Android *(post-native build)*
- Confirm exact-alarm permission granted (Android 12+).
- Confirm app is not battery-restricted (Settings → Battery → Unrestricted).
- OEM aggressive killers (MIUI, One UI): request user allow-list in-app.
- BootReceiver failed to reschedule: check adb logs after reboot.

## Native (Android)

### Alarm doesn't fire when app is killed
- Use `setAlarmClock` (not `set` / `setExact`) — bypasses Doze.
- Combine with foreground service for critical windows.
- See [NATIVE_ANDROID_GUIDE.md §Alarms](./NATIVE_ANDROID_GUIDE.md).

### Geofence never triggers
- Radius too small (< 100m).
- Location permission not `ACCESS_BACKGROUND_LOCATION`.
- Location Services disabled at OS level.

## Build / Deploy

### `Failed to resolve import "@/..."` in Vite
- File doesn't exist. Create the target file in the same edit batch.

### `[unenv] <method> not implemented` at runtime
- Node-only package running in Worker SSR.
- **Fix:** swap for a Worker-compatible library, or move the call to a Node-hosted service. See stack knowledge (`server-runtime`).

### Preview build hangs / wedged
- Restart the dev server (`code--restart_dev_server`) after lockfile or `vite.config` edits. Do not use for regular installs — those auto-restart.

## Recovery Steps

Broad-scope failures are handled in [MASTER_ARCHITECTURE.md §15–16](./MASTER_ARCHITECTURE.md#15-rollback-strategy). Quick reference:

- Bad web deploy → Lovable version history restore.
- Bad DB migration → forward-only compensating migration; PITR for data corruption.
- Bad feature → toggle feature flag off.
- Bad Cashfree config → swap `CASHFREE_ENV` back to `SANDBOX`.
- Play Store bad APK → halt rollout, promote previous AAB.
