# Known Limitations

Constraints imposed by platforms, providers, or the current codebase. Not bugs — things the product cannot do (yet) without workarounds.

---

## Browser

- **Background alarms are unreliable.** Service Workers cannot guarantee wake-up. Web push depends on the OS delivering FCM; iOS Safari is especially limited.
- **`localStorage` only, no true keychain.** Sessions live in `localStorage`; XSS = session theft. Mitigated by React auto-escaping and no `dangerouslySetInnerHTML`.
- **No filesystem, no notification listener, no geofence** in the browser. These are Android-only features.
- **iOS PWA quirks:** limited push, aggressive tab throttling, no persistent background.

## Android (planned)

- **Doze mode + App Standby** throttle alarms unless `setAlarmClock` or foreground service is used.
- **OEM aggressive killers** (MIUI, One UI, ColorOS) require per-vendor allow-list prompts.
- **`ACCESS_BACKGROUND_LOCATION`** requires Play Store justification and shows a scary permission dialog.
- **`NotificationListenerService`** is a sensitive permission — Play may reject apps without a strong justification.
- **`SCHEDULE_EXACT_ALARM`** (API 31+) requires user grant in Settings for many use cases.
- **Signing key loss = new package ID.** No recovery; users must migrate.

## Supabase (Lovable Cloud)

- **`SUPABASE_SERVICE_ROLE_KEY` and DB password are not user-fetchable.** Rotation via platform tool only.
- **PostgREST 5xx during migrations.** Brief blip while types regenerate.
- **Realtime not currently used.** Adding it later means row-level publications + policy review.
- **Edge Function cold starts.** Not used in this project (TanStack server fns instead), but the underlying Worker still has cold-start latency.
- **Storage buckets not yet configured.** Image/voice features require setup before shipping.
- **`pg_cron` runs in-DB.** Long-running or CPU-heavy work should not be in a cron function — offload to a server function called by cron.

## Capacitor (if chosen for shell)

Currently **not** used — the native path is a pure Kotlin/Compose APK. If Capacitor is later adopted:

- Bridge overhead for every native call.
- Plugin quality varies wildly for background execution.
- Location access is restricted; the user memory notes "separate APK, not through Appilix" for a reason — Capacitor plugins historically drop background geofence events. Prefer native modules for critical paths.

## Google APIs

- **Drive OAuth verification.** Sensitive scopes need Google's app verification for public release.
- **Quota limits.** Drive API 1B queries/day default, per-user 20k/100s. Plenty for MindDrop today.
- **Maps/geocoding billing.** `GOOGLE_API_KEY` is billable; add usage caps.
- **OAuth consent screen** must list every scope; changing scopes triggers re-review.

## Cashfree

- **INR only** by default. USD / cross-border needs merchant application.
- **Webhook order not guaranteed.** Verify by fetching current order status; do not trust event order alone.
- **Sandbox ≠ Production.** Config differences (allowed methods, MCC codes) surface only in PROD.
- **KYC / merchant approval** can take days; do not schedule launch on the same day as PROD flip.
- **Refunds** require a separate API call and admin flow — not implemented yet.

## Platform Constraints

- **Cloudflare Worker runtime** (SSR + server fns): no `child_process`, no native binaries, no `sharp`/`puppeteer`, `fs.watch` unsupported. See stack knowledge (`server-runtime`).
- **Cold start** on first request to a fresh Worker isolate.
- **Bundle size** — every package must be fully bundled; no runtime resolution.
- **10k stdout chars** limit inside the sandbox; redirect to file for noisy scripts.
- **Lovable secret cap** — 100 secrets per environment.

## Product / Feature

- No offline capture on web (no service worker persistence layer yet).
- No shared vaults / multi-user memories.
- No spaced-repetition scheduling.
- No wearable companion.
- No iOS app.
- No sitemap / RSS.
- Refund flow missing.
- Grace period on plan expiry missing.
- Rate limiting missing (see [SECURITY.md](./SECURITY.md#rate-limiting)).
- Audit log partial (see [SECURITY.md](./SECURITY.md#audit-log)).
- No CI test suite (see [TESTING_GUIDE.md](./TESTING_GUIDE.md)).

Track these in [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md).
