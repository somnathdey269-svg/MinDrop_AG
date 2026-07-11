# MindDrop

> A memory-first personal reminder platform. Capture what matters, and let MindDrop bring it back at the right time, place, or moment.

**Live:** https://getmindrop.lovable.app
**Status:** Web app in production; native Android in planning (see [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md))

---

## Product Vision

MindDrop is an "external memory" companion. Users save memories (text, links, photos, voice notes) and attach *rules* — time, place, notification match, mood, recurrence — that determine when the memory resurfaces. The product's north star: **the user should never have to remember to remember.**

Long-form vision, positioning, and roadmap are in [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md).

## Architecture Summary

Three surfaces sharing one backend:

- **Marketing web** — public routes on `getmindrop.lovable.app`.
- **Consumer web app** — authenticated routes under `/_authenticated/*`.
- **Native Android APK** *(future)* — Kotlin + Jetpack Compose shell for OS-level features (AlarmManager, Geofencing, NotificationListener).

Backend: Lovable Cloud (Supabase — Postgres, Auth, Storage, `pg_cron`) plus TanStack Start server functions for app-internal RPC and server routes under `src/routes/api/public/` for webhooks.

Full picture and ownership: [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md).
Implementation status snapshot: [PROJECT_AUDIT.md](./PROJECT_AUDIT.md).

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7) |
| Styling | Tailwind CSS v4 (tokens in `src/styles.css`) |
| UI primitives | shadcn/ui |
| Data | TanStack Query + Supabase JS |
| Backend | Lovable Cloud (Supabase Postgres, Auth, Storage, cron) |
| Server logic | `createServerFn` + server routes (`src/routes/api/public/*`) |
| Payments | Cashfree (SANDBOX today, PROD pending) |
| Push | Firebase Cloud Messaging |
| Backups | Google Drive OAuth |
| Native app | Kotlin + Jetpack Compose *(planned)* |
| Package manager | Bun |

## Folder Structure

```
src/
├── routes/                    TanStack file-based routes (pages + /api)
│   ├── __root.tsx             root layout, head metadata
│   ├── _authenticated/        auth-gated subtree
│   ├── api/public/            webhooks, cron endpoints
│   └── ctrl-vx9k2m7fq3z.*     admin console (obscured slug)
├── components/                UI components (ui/ = shadcn primitives)
├── lib/                       server + client helpers
│   ├── *.functions.ts         createServerFn wrappers
│   ├── *.server.ts            server-only helpers
│   └── {auth,payments,drive,notify,...}/
├── hooks/                     React hooks
├── integrations/supabase/     AUTO-GENERATED — never edit
└── styles.css                 Tailwind tokens + .t-* typography roles
supabase/migrations/           append-only DB history
docs/                          this folder
```

Ownership per folder: [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).

## Development Setup

```bash
bun install
bun run dev     # http://localhost:8080
```

Environment variables auto-populate from Lovable Cloud. See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for the full matrix.

## Build Commands

| Command | Purpose |
|---|---|
| `bun run dev` | Local dev server (Vite) |
| `bun run build` | Production build |
| `bunx tsgo --noEmit` | Type check |

Android build steps live in [android-build.md](./android-build.md) and [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md).

## Deployment Overview

- **Web** — push to `main` → Lovable builds → click Publish. Details: [DEPLOYMENT.md](./DEPLOYMENT.md).
- **Backend** — server functions & migrations deploy automatically with the app; no manual step.
- **Android** — CI produces signed AAB → Play Console Internal → Closed → Production. See [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).

## Documentation Index

Full index with "when to use each doc": [FINAL_DOCUMENT_INDEX.md](./FINAL_DOCUMENT_INDEX.md).

Quick links:

- [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) — single source of truth
- [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) — implementation status
- [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md) — Kotlin implementation
- [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md) — feature inventory
- [API_REFERENCE.md](./API_REFERENCE.md) — server functions
- [DATABASE_REFERENCE.md](./DATABASE_REFERENCE.md) — schema
- [CONNECTORS.md](./CONNECTORS.md) — external integrations
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) — env & secrets
- [DEPLOYMENT.md](./DEPLOYMENT.md) — deploy flows
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) — QA
- [SECURITY.md](./SECURITY.md) — security posture
- [PERFORMANCE.md](./PERFORMANCE.md) — perf notes
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — common issues
- [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) — platform limits
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) — release gates
- [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md) — who owns what
- [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) — future work
- [PROJECT_GLOSSARY.md](./PROJECT_GLOSSARY.md) — vocabulary
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) — ADRs
- [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) — coding standards
- [CHANGELOG.md](./CHANGELOG.md) — release notes
