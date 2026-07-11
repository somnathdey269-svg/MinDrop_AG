# Security

MindDrop's security posture, controls, and pending hardening tasks.

For platform ownership see [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md). For open items with severity, see [PROJECT_AUDIT.md §Security](./PROJECT_AUDIT.md).

---

## Authentication

- Supabase Auth: email/password + Google (via Lovable broker).
- Sessions stored in `localStorage` by the browser client.
- `_authenticated/` layout gates all authenticated routes client-side; server functions revalidate every request via `requireSupabaseAuth`.
- OAuth `redirect_uri` must be public same-origin (`window.location.origin` or `/auth/callback`). Never a protected route.
- `supabase.auth.getUser()` (not `getSession()`) is the authority for server-side identity.

## Authorization

- Roles stored in `user_roles` (separate table — never on `profiles`).
- `has_role(uid, role)` is a `SECURITY DEFINER` function used inside RLS to avoid recursion.
- `superadmin` role cannot be granted from user code — `block_superadmin_insert` trigger enforces this. First user gets superadmin via `handle_new_user()`.
- Plan changes on `profiles` are gated by `guard_profile_plan_update` — only `service_role` or superadmin.
- Admin console lives at an obscured slug (`ctrl-vx9k2m7fq3z/*`) as defense-in-depth, but real access control is `has_role` checks on every server fn.

## Row-Level Security (RLS)

- Enabled on **every** public-schema table (20 tables today).
- User-data tables policy: `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE.
- Public-read tables (`plan_limits`, `platform_settings`, `country_themes`, `story_*`): narrow SELECT to `authenticated` (or `anon` where safe), admin-only writes.
- Every new `CREATE TABLE public.*` migration MUST include `GRANT` statements in the same file (see [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md#supabase)).
- `supabaseAdmin` (service role) is used ONLY for verified webhooks, admin ops, and role grants — never for ordinary reads.

## Secret Management

- All secrets stored via Lovable Cloud (`add_secret` / `generate_secret` / `set_secret`).
- Server secrets read **inside** handlers, not at module scope in shared files.
- Never logged, never returned from a server function.
- Publishable/anon keys in code are OK; anything else is not.
- Rotation policy: see [ENVIRONMENT_SETUP.md §Rotation Strategy](./ENVIRONMENT_SETUP.md#rotation-strategy).

## Webhook Verification

Every public route under `src/routes/api/public/*` **must** self-verify before any DB write.

Cashfree webhook (`/api/public/cashfree-webhook`):
- Verifies `x-webhook-signature` HMAC against `CASHFREE_WEBHOOK_SECRET` using `timingSafeEqual`.
- Rejects invalid signature with `401`.
- Only after verification does it invoke `supabaseAdmin`.

New webhook routes must follow the same pattern — copy the shape, do not weaken it.

## Payment Security

- Cashfree secrets server-only.
- Order verification uses server-to-server API call, not just client-reported status.
- Webhook is the authoritative source for status transitions.
- Refunds (TODO): must require superadmin + audit-logged.
- Never trust client-supplied amount or plan; the server derives price from `plan_limits` / `prices`.

## Rate Limiting

⚪ **Not enforced today.** Cloudflare/Lovable edge provides basic abuse mitigation.

Planned:
- Per-user throttling on `createCashfreeOrder`, `runLocalMigration`, `sendTestPush`.
- Per-IP throttling on `/auth` and public webhook routes.
- No standard Lovable primitive exists; must implement in-handler with a small `rate_limits` table or Redis when scale requires it.

## Audit Log

⚪ **Partial today.** Admin actions log to console. Recommended:

- Table `audit_log` (actor, action, target, before/after JSON, `created_at`).
- Superadmin-only SELECT policy.
- Log at minimum: plan changes, role grants, flag toggles, webhook events, refund actions.
- Retention: 2 years.

## Threat Model

| Threat | Vector | Mitigation |
|---|---|---|
| Account takeover | Weak password, phishing | Supabase password policy; Google OAuth; passkeys TODO |
| Privilege escalation | Client-side role manipulation | Roles in separate table; RLS; `has_role` SECURITY DEFINER |
| RLS bypass | Forgetting policies on new table | Migration convention + review |
| SQL injection | Dynamic SQL in `split_helper_*` | Superadmin-guarded, identifier-validated, DROP-only. **Remove `split_helper_exec_sql` before public launch.** |
| Webhook forgery | Fake Cashfree payload | HMAC signature verify + `timingSafeEqual` |
| Secret leakage | Committed in code, logged, returned | Lovable Cloud secret store; code review; no logs |
| CSRF | Cross-origin form submit | Supabase JWT bearer (not cookie session); `_authenticated/` client-only gate |
| XSS | User-supplied HTML | React auto-escapes; no `dangerouslySetInnerHTML` on user data |
| Data exfiltration by admin | Legitimate admin misuse | Audit log (TODO); principle of least privilege; superadmin count minimal |
| Rate abuse | Unbounded requests | Edge WAF today; per-user throttle TODO |
| Native permission abuse | Over-scoped Android perms | Runtime prompts + Play justification (see [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md)) |
| Signing key loss | Filesystem loss | Two encrypted backups (see [MASTER_ARCHITECTURE.md §16](./MASTER_ARCHITECTURE.md#16-disaster-recovery)) |

## Security Checklist (pre-release)

- [ ] Every new table has RLS enabled + GRANTs.
- [ ] Every new public route verifies its caller.
- [ ] No `supabaseAdmin` in loaders or components.
- [ ] No secret read at module scope in shared files.
- [ ] No `console.log` of tokens/keys.
- [ ] `split_helper_exec_sql` removed (public launch gate).
- [ ] Cron endpoint (`fireDueReminders`) authenticates its caller.
- [ ] Cashfree PROD flip: sandbox keys purged, PROD keys stored, webhook secret rotated.
- [ ] `security--run_security_scan` returns clean.
- [ ] Admin actions land in audit log.
- [ ] Signing keystore backed up in two places.
