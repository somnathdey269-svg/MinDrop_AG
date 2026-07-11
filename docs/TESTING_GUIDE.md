# Testing Guide

There is currently **no automated test suite** in the repository — this is a gap flagged in [PROJECT_AUDIT.md](./PROJECT_AUDIT.md). The sections below describe the intended shape and the manual procedures used today.

---

## Unit Testing (TODO)

- Framework: Vitest + React Testing Library (recommended, not yet installed).
- Scope: pure helpers in `src/lib/**/*.ts` (formatters, reducers, plan-limit math).
- Command (future): `bunx vitest run`.
- Coverage target: 70% for `src/lib`; UI components excluded until Playwright covers them.

## Integration Testing (TODO)

- Server functions invoked with mock Supabase (using `service_role` in a scratch project) or against preview DB.
- Cover: auth flow, memory CRUD, plan enforcement, Cashfree order → verify path, Drive OAuth exchange.

## Manual Testing (current source of truth)

Every release, walk through the [Regression Checklist](#regression-checklist) below in preview, then repeat the smoke subset in production.

Playwright is available inside the sandbox for scripted UI verification — use it to reproduce bugs and validate fixes.

## Android Testing (TODO)

Once the native shell exists (see [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md)):

- **Unit:** JUnit + Kotlin coroutines-test on Kotlin modules.
- **Instrumentation:** Espresso / Compose Testing on emulator (`./gradlew connectedAndroidTest`).
- **Manual matrix:** at minimum Pixel 6 (stock Android), Samsung mid-range (One UI + battery quirks), Xiaomi mid-range (MIUI aggressive killer).
- Check: alarm fires when app killed; geofence triggers on entry/exit; notification listener receives events after reboot; foreground service survives Doze.

## Payment Testing

- **SANDBOX:** Cashfree test cards (see Cashfree docs). Verify:
  - Order creation returns valid `paymentSessionId`.
  - Redirect back updates `payments.status`.
  - `/api/public/cashfree-webhook` accepts a signed replay; rejects unsigned.
  - `profiles.plan` flips to `premium` and `plan_expires_at` sets correctly.
- **PROD (post-flip):** run one live low-value transaction end-to-end before public launch.

## Reminder Testing

- Create a memory with a fire time 2 minutes out. Confirm:
  - `notify_events` row appears at fire time.
  - Web push (if enabled) delivers.
  - Native alarm rings when app is killed *(post-Android build)*.
  - Snooze / dismiss updates state and reschedules correctly.
- Recurrence: create daily / weekly / monthly rules; verify next-fire calc across DST boundary.

## Notification Testing

- Web: grant notification permission; run `sendTestPush` from admin.
- Android *(future)*: enable NotificationListener; incoming notification from a whitelisted app produces a `notify_events` row.

## Offline Testing

- Web: disable network; app should render cached routes; queued mutations retry on reconnect (TanStack Query default).
- Android *(future)*: Room DB caches memories; WorkManager syncs pending writes when connection returns.

## Play Store Testing

- Internal testing track first (personal + team accounts).
- Closed testing (invited beta users).
- Open testing (public opt-in) — collect Play Console pre-launch report.
- Verify all `AndroidManifest` permissions have justifications in the Play Console form.
- Data safety form matches actual data collection (see [SECURITY.md](./SECURITY.md)).

## Regression Checklist

Run before every web release:

- [ ] Landing page renders; SEO title/description correct.
- [ ] Sign up (email) — profile row created; superadmin only for first user.
- [ ] Sign in (Google) — no "Unsupported provider" error.
- [ ] Sign in (email) — session persists on reload.
- [ ] Password reset flow completes.
- [ ] Create memory — appears in list.
- [ ] Edit memory — persists.
- [ ] Delete memory — removed.
- [ ] Attach reminder — `next_fire_at` computed.
- [ ] Attach place — geofence marked (server-side).
- [ ] Recall surface shows expected order.
- [ ] Plan limit blocks 11th memory on free plan (or current threshold).
- [ ] Upgrade → Cashfree SANDBOX → return → plan = premium.
- [ ] Drive connect → snapshot → file visible in Drive.
- [ ] Admin console loads at obscured slug for superadmin, 404 for others.
- [ ] Feature flag toggle takes effect without redeploy.
- [ ] Sign out — session cleared, redirect to `/auth`.
- [ ] Delete account — profile + related rows removed.
- [ ] No console errors on any of the above.

Android release adds:

- [ ] Alarm fires with app killed on stock Android.
- [ ] Alarm fires with app killed on MIUI / One UI.
- [ ] Geofence enter fires within 60s on a real device.
- [ ] Boot receiver reschedules alarms after reboot.
- [ ] Notification listener captures a whitelisted app's notification.
- [ ] Cashfree native checkout completes.
- [ ] FCM push delivers when app backgrounded.
- [ ] Offline capture → sync on reconnect.
