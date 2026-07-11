# Changelog

All notable changes to MindDrop are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/).

Web and Android are versioned independently — see [DEPLOYMENT.md](./DEPLOYMENT.md#versioning).

---

## [Unreleased]

### Added
- Full engineering documentation set under `docs/` (this changelog, [API_REFERENCE.md](./API_REFERENCE.md), [DATABASE_REFERENCE.md](./DATABASE_REFERENCE.md), and 17 others).

### TODO
- Cashfree PROD flip.
- Native Android shell generation.
- Sentry + PostHog wiring.
- Auth verification on cron endpoint (see [SECURITY.md](./SECURITY.md#audit-log)).
- Remove `split_helper_exec_sql` before public launch.

---

## [1.0.0] — 2026-07-08

Initial documented baseline. Reflects the state of the codebase at the time this changelog was created; see [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) for the audit that fed this entry.

### Added
- **Authentication:** Supabase email/password + Google OAuth via Lovable broker; password reset; account deletion; auth-gated `_authenticated/` subtree.
- **Memories:** capture (text/link), list, detail, edit; attach place/rule/reminder.
- **Reminder engine:** server-side scheduling and reminder sync (`memoryReminderSync.functions.ts`).
- **Notify:** in-app feed, notify rules, FCM VAPID push configured.
- **Places:** save/manage places; manual picker.
- **Rules:** CRUD + server evaluation + cron fan-out.
- **Packs:** system + custom packs (`custom_packs`).
- **Recall:** recall surface with basic ordering.
- **Premium plans:** `plan_limits`, `is_premium()`, plan enforcement in server fns.
- **Payments:** Cashfree checkout (SANDBOX) + webhook route `/api/public/cashfree-webhook`.
- **Google Drive:** OAuth connect, snapshot export.
- **Admin console** at obscured slug `ctrl-vx9k2m7fq3z/*`: users, flags, country themes, packs, pricing, quiz, greetings, personality, config, limits, audit.
- **Marketing site:** home, features, how-it-works, pricing, why-mindrop, faq, contact, privacy, terms, refunds, download, story pages.
- **Design system:** consumer typography roles (`.t-display|title|body|body-sm|meta|eyebrow|button`), warm canvas / ink palette, brand green `#4a5d4e`, PhoneFrame consumer shell.
- **DB security:** RLS on all 20 public tables; `has_role()` security-definer; superadmin bootstrap via `handle_new_user()`; `block_superadmin_insert` guard; `guard_profile_plan_update` guard.

### Security
- RLS enabled on every public-schema table.
- Superadmin role cannot be granted from user code (`block_superadmin_insert`).
- Plan column can only be changed by `service_role` / superadmin (`guard_profile_plan_update`).
- Split helper `split_helper_rename_table` restricted to `_disabled_` prefix toggles.
- Cashfree secrets stored server-side only.

### Known Issues (see [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md))
- No native Android app yet.
- Cashfree in SANDBOX.
- `split_helper_exec_sql` exists (superadmin-guarded, DROP-only) but should be removed before public launch.
- No Sentry / PostHog.
- No CI pipeline.

### Deprecated
- None.

### Removed
- None.

### Fixed
- Historical fixes not tracked pre-1.0.0.

---

## Versioning Convention

- `X.Y.Z-web` — web release tag.
- `X.Y.Z-android` — Android release tag (independent).
- Server-driven config changes (feature flags, plan limits) are NOT versioned; they take effect immediately and are logged in the admin audit trail.
