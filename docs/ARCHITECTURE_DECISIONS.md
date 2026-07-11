# Architecture Decisions

ADR-style log of significant technical choices. Newest first. Each entry: **Decision · Reason · Alternatives · Impact · Future considerations.**

---

## ADR-011 — Documentation as first-class artifact
- **Decision:** treat `docs/` as source of truth for engineering knowledge; PR-block on missing updates.
- **Reason:** avoid tribal knowledge; enable contractors and future engineers.
- **Alternatives:** README-only; Notion; nothing.
- **Impact:** ~20 markdown files to maintain; small overhead per PR.
- **Future:** auto-generate `API_REFERENCE.md` from `*.functions.ts` signatures.

## ADR-010 — Native Android via pure Kotlin + Compose (not Capacitor)
- **Decision:** ship the Android app as a native Kotlin/Compose project talking directly to Supabase.
- **Reason:** background reliability. Alarms, geofence, notification listener need first-class native access. Capacitor's plugin ecosystem historically drops background events.
- **Alternatives:** Capacitor + Ionic; React Native; Flutter; WebView-only APK via Appilix.
- **Impact:** two codebases (web + Kotlin) sharing one backend; larger native surface to maintain.
- **Future:** iOS mirror in SwiftUI if warranted.

## ADR-009 — Marketing lives on the web; APK is app-facing only
- **Decision:** landing, pricing, blog stay on `getmindrop.lovable.app`. APK has no marketing routes.
- **Reason:** SEO belongs on the web; APK size stays lean; Play Store cares about app-only screenshots.
- **Alternatives:** duplicate marketing in the APK; iframe the marketing site.
- **Impact:** clean split. Deep links from marketing → app on install.
- **Future:** consider App Clips-style previews when Android supports them.

## ADR-008 — Server-driven config over client constants
- **Decision:** plan limits, feature flags, prompts, pricing all live in DB tables, read at runtime.
- **Reason:** change without a new APK; A/B test; kill switches during incidents.
- **Alternatives:** compile-time constants; remote config file in Storage.
- **Impact:** one extra query on boot; caching required at scale.
- **Future:** move flag reads to Cloudflare KV at 100k+ users.

## ADR-007 — Cashfree over Stripe (India-first)
- **Decision:** Cashfree for payments.
- **Reason:** INR-native, UPI support, lower fees for the target market.
- **Alternatives:** Stripe, Razorpay, Paddle.
- **Impact:** limited to INR initially; PROD onboarding requires KYC.
- **Future:** add Stripe when expanding to non-INR markets.

## ADR-006 — TanStack Start server functions over Supabase Edge Functions
- **Decision:** app-internal server logic uses `createServerFn`, not `supabase/functions/`.
- **Reason:** typed RPC, single deploy pipeline, no Edge Function cold start.
- **Alternatives:** Supabase Edge Functions.
- **Impact:** Edge Functions reserved for webhooks that must land inside Supabase network — currently none.
- **Future:** revisit if Supabase adds features tied to Edge Functions.

## ADR-005 — Roles in a separate table
- **Decision:** `user_roles(user_id, role)` — never `profiles.role`.
- **Reason:** privilege escalation via profile-column write is a common attack; separation + `SECURITY DEFINER has_role()` avoids it.
- **Alternatives:** role column on `profiles`; JWT claim.
- **Impact:** one extra table; RLS uses `has_role` helper.
- **Future:** none — this is the standard.

## ADR-004 — Auth-gated subtree via `_authenticated/` layout
- **Decision:** all authenticated routes under `src/routes/_authenticated/`; gate is `ssr: false` and client-only.
- **Reason:** Supabase sessions live in `localStorage`, invisible to SSR. Gating server-side causes redirect loops on hard refresh.
- **Alternatives:** per-route `beforeLoad` gate; SSR session via cookies.
- **Impact:** protected pages have no SSR (that's fine — they're user-specific).
- **Future:** revisit if `@supabase/ssr` becomes the standard.

## ADR-003 — Consumer typography as `.t-*` roles
- **Decision:** exactly seven typography roles in `src/styles.css`; no ad-hoc `text-xs`, `font-*`, `italic`.
- **Reason:** consistency; Settings size control works predictably; brand discipline.
- **Alternatives:** free-form Tailwind classes; MUI theme.
- **Impact:** small learning curve; linting recommended.
- **Future:** codify in `DEVELOPMENT_STANDARDS.md` and add ESLint rule.

## ADR-002 — Admin console at obscured slug
- **Decision:** `ctrl-vx9k2m7fq3z/*` for admin routes.
- **Reason:** defense-in-depth; real auth is `has_role('superadmin')`.
- **Alternatives:** `/admin`, subdomain, separate app.
- **Impact:** URLs are ugly; that's the point.
- **Future:** consider subdomain if admin surface grows.

## ADR-001 — Lovable Cloud (Supabase) as backend
- **Decision:** use Lovable Cloud for DB, auth, storage, cron.
- **Reason:** single vendor, managed, RLS-first, integrates with TanStack Start template.
- **Alternatives:** self-hosted Postgres + Auth.js; PlanetScale + Clerk.
- **Impact:** vendor lock-in on Supabase specifics (RLS syntax, `pg_cron`).
- **Future:** portable schema (standard SQL); avoid Supabase-only features where alternatives exist.

---

## How to add an ADR

1. Take the next number.
2. Fill Decision / Reason / Alternatives / Impact / Future.
3. Cross-link from any doc that references the choice.
4. Never edit an ADR once written; supersede with a new one.
