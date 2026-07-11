# Deployment

How MindDrop ships to each environment. Cross-reference [MASTER_ARCHITECTURE.md §13–15](./MASTER_ARCHITECTURE.md) for the build/release/rollback pipelines.

---

## Environments

| Env | URL | Serves |
|---|---|---|
| Local | `http://localhost:8080` | `bun run dev` |
| Preview | `id-preview--<uuid>.lovable.app` and `project--<id>-dev.lovable.app` | latest sandbox build |
| Production | `getmindrop.lovable.app` and `project--<id>.lovable.app` | latest published build |

Stable URLs (`project--*.lovable.app`) never change and are the correct target for webhooks and cron.

## Development

```bash
bun install
bun run dev
```

Dev server runs on port 8080. Env vars come from Lovable Cloud. Hot reload via Vite. Playwright available for end-to-end verification in the sandbox.

## Preview

Every push to `dev` (or a Lovable draft) produces a preview build. Preview URLs require Lovable login by default; use **Share → Share preview** for a 7-day public link.

Backend changes (server functions, migrations) deploy to preview immediately on push.

## Production (Web)

1. Merge `dev` → `main`.
2. In Lovable, click **Publish** → **Update**.
3. Live within ~60s at `getmindrop.lovable.app`.

Backend changes (new server functions, migrations) deploy automatically — no manual step for backend. Only the frontend needs the Publish click.

## GitHub

- `main` is protected — PR + review + green CI required.
- Lovable syncs both ways with the connected repo.
- Never rebase `main` (Lovable sync stays linear via merge commits).
- Branch strategy: `dev`, `feature/*`, `android/*`, `hotfix/*`. See [MASTER_ARCHITECTURE.md §11](./MASTER_ARCHITECTURE.md#11-github-branching-strategy).

## Lovable

- Lovable is the source of truth for `src/`, `supabase/migrations/`, `public/`, and Lovable-written `docs/`.
- Never edit auto-generated files (`src/integrations/supabase/*`, `src/routeTree.gen.ts`, `supabase/config.toml`). See [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).

## Android

See [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md) for the full native build.

Steps (once the shell exists):
1. Bump `versionCode` + `versionName` in `android/app/build.gradle.kts`.
2. Update [CHANGELOG.md](./CHANGELOG.md).
3. Push `android/release-x.y.z` → PR → `main`.
4. GitHub Actions produces signed AAB.
5. Upload to Play Console → Internal → Closed → Open → Production (staged 10% → 50% → 100%).
6. Tag `vX.Y.Z-android`.

## Supabase

- Migrations run automatically when the app builds after a merge to `main`.
- Never edit historical migrations. Write a new compensating migration instead.
- `pg_cron` schedules live in DB; snapshot into `docs/` per release (TODO — see [DATABASE_REFERENCE.md](./DATABASE_REFERENCE.md#cron-jobs)).

## Rollback

| Layer | Method | Time |
|---|---|---|
| Web UI | Lovable version history → restore | < 2 min |
| Server fn | Revert commit, redeploy | < 5 min |
| DB | Forward-only compensating migration; use PITR for data corruption | 5–60 min |
| Feature flag | Toggle in `feature_flags` (server-driven) | seconds |
| Cashfree | Swap `CASHFREE_ENV` back to `SANDBOX` | immediate |
| Android APK | Play Console → halt rollout → promote previous AAB | 15–60 min |

Golden rule: risky releases go behind a feature flag; rollback = flip the flag, not revert code.

## Versioning

- Web: `vX.Y.Z-web` tag on every publish.
- Android: `vX.Y.Z-android` tag on every Play upload.
- Web and Android version independently.
- Server-driven config changes are NOT versioned; they take effect immediately (audit log entry required).

See [CHANGELOG.md](./CHANGELOG.md) for release history and [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) for pre-release gates.
