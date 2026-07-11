# Development Standards

Coding conventions for MindDrop. When code and this file disagree, update whichever is wrong in the same PR.

---

## Folder Conventions

- Routes → `src/routes/` (flat dot-separated; NEVER `src/pages/`).
- Server fns → `src/lib/**/*.functions.ts` (client-safe to import).
- Server-only helpers → `src/lib/**/*.server.ts` (never imported from client).
- Components → `src/components/`; shadcn primitives in `src/components/ui/`.
- Hooks → `src/hooks/`.
- Feature bundles → `src/lib/<feature>/` (e.g. `auth/`, `drive/`, `admin/`).
- Migrations → `supabase/migrations/` (append-only, never edit historical files).

Full map in [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).

## Naming Conventions

| Kind | Convention | Example |
|---|---|---|
| Route file | flat dot-notation | `posts.$postId.tsx` |
| Server fn file | `<domain>.functions.ts` | `payments.functions.ts` |
| Server-only helper | `<domain>.server.ts` | `fcm.server.ts` |
| Component file | PascalCase | `MemoryCard.tsx` |
| Hook file | camelCase starting `use` | `useMemories.ts` |
| Server fn export | camelCase verb | `createCashfreeOrder` |
| Table name | snake_case, plural | `notify_events` |
| Column name | snake_case | `plan_expires_at` |
| Feature flag | snake_case | `enable_voice_capture` |
| Env var (public) | `VITE_*` UPPER_SNAKE | `VITE_SUPABASE_URL` |
| Env var (server) | UPPER_SNAKE | `CASHFREE_APP_ID` |

## React

- Function components only.
- One component per file (co-locate small helpers).
- Fetch via TanStack Query (`useSuspenseQuery`), never `useEffect` + `fetch` for initial data.
- Loaders use `context.queryClient.ensureQueryData(queryOptions)`; components use `useSuspenseQuery(queryOptions)`.
- Every route with a loader defines `errorComponent` AND `notFoundComponent`.
- No `dangerouslySetInnerHTML` on user data.
- Use PhoneFrame for consumer routes — never add a second `<main>`.
- Consumer text uses one of the seven `.t-*` roles (`t-display|title|body|body-sm|meta|eyebrow|button`); no ad-hoc `text-xs`, `font-*`, `italic`. (Project memory rule.)
- Semantic tokens only (`bg-canvas`, `text-ink`, `bg-brand`) — no hardcoded colors.
- Icon-only buttons require `aria-label`; decorative icons `aria-hidden="true"`.

## Server Functions

- `createServerFn({ method }).inputValidator(zodSchema.parse).handler(...)` — chain unbroken, `inputValidator` first.
- Read secrets **inside** the handler, not at module scope.
- Return plain DTOs (no `Response`, no class instances, no streams).
- Auth: use `requireSupabaseAuth` middleware for user-scoped work; `supabaseAdmin` (loaded via `await import` inside handler) for verified webhooks / admin only.
- Never call a `$`-prefixed server fn from inside another handler; import the underlying `.server.ts` helper directly.
- Never manually `fetch()` a server fn URL; use the generated call or create a server route.
- Never put a `requireSupabaseAuth` fn in a public route's loader — build will 401 during prerender.

## Supabase

- Every `CREATE TABLE public.<t>` migration MUST include, in order: CREATE → GRANT → ALTER … ENABLE RLS → CREATE POLICY.
- Default GRANTs: `SELECT, INSERT, UPDATE, DELETE ON <t> TO authenticated;` and `ALL ON <t> TO service_role;`. Add `SELECT TO anon` only if a policy justifies it.
- Roles live in `user_roles`, never on `profiles`.
- RLS uses `has_role()` SECURITY DEFINER helper to avoid recursion.
- Migrations are append-only. Compensating migrations for rollbacks.
- Never edit `src/integrations/supabase/*` — auto-generated.

## Android (once shell exists)

- Kotlin only. No Java files.
- Jetpack Compose UI. No XML layouts except splash / launcher.
- Coroutines + `Dispatchers.IO` for network / DB.
- Room DB with proper `@TypeConverter`s.
- Every new permission needs a Play Store justification (see [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md)).
- AlarmManager: `setAlarmClock` for user-critical wake; never rely on `set` / `setExact`.
- Foreground service only while active; cancel promptly.

## Documentation

- Markdown, GitHub-flavored.
- Tables for enumerations, not bullet lists.
- Cross-reference other docs by relative path.
- Mark unfinished work with **TODO**.
- Never invent implementation status — cite the code.
- Update [CHANGELOG.md](./CHANGELOG.md) in the same PR as the feature.
- Update [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) `Last updated` when it changes.

## Git

### Branching
- `main` — protected, always deployable, auto-syncs to Lovable prod.
- `dev` — integration branch.
- `feature/<slug>` — short-lived, PR into `dev`.
- `android/<slug>` — Kotlin work.
- `hotfix/<slug>` — from `main`, PR into `main` + back-merge to `dev`.

Never rebase `main`. Merge commits only.

### Commit Messages

Format: `<type>(<scope>): <summary>`

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `security`, `build`.

Examples:
- `feat(payments): add refund server function`
- `fix(auth): stop redirect loop on hard refresh`
- `docs(security): document webhook verification`
- `security(db): remove split_helper_exec_sql`

Body (optional): explain *why*, not *what*. Reference issue: `Closes #123`.

### Pull Requests

- Small and single-purpose.
- Description covers: what changed, why, how tested, rollback plan.
- Link the doc updates in the same PR.
- Never squash-merge `main` (Lovable sync stays linear).

## Code Review

- One reviewer minimum for `main`; two for schema migrations or security-sensitive changes.
- Reviewers check: RLS + GRANTs on new tables; auth on new server fns; secrets not leaked; docs updated.
- CI must be green (typecheck, lint, tests once they exist).

## Never

- Do not commit `.env` with real secrets.
- Do not hardcode plan limits, feature toggles, or copy that should be server-driven.
- Do not add `console.log` of tokens / secrets / user PII.
- Do not use the word "AI" in user-facing copy — use "Smart" or "GetMinDrop" (project memory).
- Do not import `.server.ts` files from route files or components.
- Do not touch `src/routeTree.gen.ts` or `src/integrations/supabase/*`.
