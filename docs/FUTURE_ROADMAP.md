# Future Roadmap

Prioritized, time-boxed. Complexity is engineer-days (S ≤ 3d, M 3–10d, L 10–30d, XL > 30d).

Reflects gaps in [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) and features in [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md).

---

## Next Release (0–4 weeks)

| Item | Complexity | Dependencies | Notes |
|---|---|---|---|
| Cashfree PROD flip | S | Merchant approval | Secret swap + one live test |
| Remove `split_helper_exec_sql` | S | – | Security gate ([SECURITY.md](./SECURITY.md)) |
| Auth on cron endpoint | S | – | ([SECURITY.md](./SECURITY.md#audit-log)) |
| Wire Sentry (errors) | S | Sentry account | Web first |
| Sitemap + robots.txt | S | – | SEO |
| Public share preview badge on marketing | S | – | – |
| CI: web `tsgo` + build check | S | GitHub Actions | Fail PR on error |

## 3 Months

| Item | Complexity | Dependencies |
|---|---|---|
| Native Android shell (Kotlin + Compose) | L | [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md) |
| AlarmManager + ForegroundService | M | Native shell |
| Boot receiver | S | Native shell |
| Google Credential Manager sign-in | S | Native shell |
| Supabase Kotlin client + Room cache | M | Native shell |
| Play Store internal track | S | Native shell + AAB |
| PostHog product analytics | S | Sentry precedent |
| Audit log table + admin viewer | M | – |
| Refund flow (Cashfree) | M | PROD flip |
| Image/voice memory (Storage bucket) | M | Feature scope decision |
| Spaced-repetition v0 (recall ordering) | M | – |
| Rate-limit middleware | S | Design decision (in-DB vs KV) |
| Materialized views for admin analytics | S | > 5k users |

## 6 Months

| Item | Complexity | Dependencies |
|---|---|---|
| Geofencing (native) | M | Background location Play approval |
| NotificationListenerService | M | Play sensitive permission approval |
| Cashfree native SDK | M | Native shell |
| FCM push (Android) | S | `google-services.json` |
| Widgets (home screen glance) | M | Native shell |
| Play Store production launch | S | All above |
| Shared vaults (multi-user memories) | L | Schema redesign |
| Coach linking parity (per user memory rule — history + analytics equal to player's own) | M | Multi-user primitives |
| Static generation for marketing routes | M | Traffic > 100k/mo |
| Grace period on plan expiry | S | – |
| Passkeys | M | Supabase Auth support |

## 12 Months

| Item | Complexity | Dependencies |
|---|---|---|
| iOS app (SwiftUI native shell, mirroring Android) | XL | Product decision |
| Wearable companion (Wear OS glance) | L | Android production stable |
| Memory graph / knowledge linking | L | AI pipeline |
| AI-assisted capture ("Smart" — never say "AI" per user memory) | M | Lovable AI Gateway wiring |
| Multi-language content (i18n) | M | Marketing scope |
| Data export in standard formats (JSON, ICS) | S | – |
| Public API for third-party integrations | L | Rate limit + auth model |

## Long Term (12+ months)

| Item | Complexity | Notes |
|---|---|---|
| Split marketing site into standalone SSG | M | Only past 500k MAU |
| Migrate hot tables to dedicated Postgres | L | Only past 100k MAU |
| Redis / Cloudflare KV for flags + hot reads | M | 100k+ users |
| Partition `notify_events` by month | M | 100k+ users |
| Federated / self-hostable MindDrop instance | XL | Community demand |
| End-to-end encryption for memories | XL | Product decision (loses server-side smart recall) |
| Voice-first mode | L | AI + native mic pipeline |

## Won't Do (explicit)

- Purple/indigo generic AI aesthetic (per project design memory).
- Serif or italic fonts in consumer surfaces (per project memory).
- Storing roles on `profiles` table (security anti-pattern).
- Using Supabase Edge Functions for app-internal logic (TanStack server fns are the standard here).
- Marketing pages inside the APK.
