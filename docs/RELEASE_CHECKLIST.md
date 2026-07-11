# Release Checklist

Gates every MindDrop release passes. Do not skip; do not reorder without updating this doc and [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md).

---

## Pre-Release (both surfaces)

- [ ] [CHANGELOG.md](./CHANGELOG.md) updated with the release entry.
- [ ] All P0/P1 items in the release scope closed on GitHub.
- [ ] [Regression checklist](./TESTING_GUIDE.md#regression-checklist) passes in preview.
- [ ] `security--run_security_scan` clean.
- [ ] `bunx tsgo --noEmit` clean.
- [ ] Migrations reviewed for GRANTs + RLS + policies (see [SECURITY.md](./SECURITY.md)).
- [ ] Any risky change is behind a feature flag.
- [ ] Rollback plan documented in the PR description.

## Web Release

- [ ] Merge `dev` → `main`.
- [ ] Migrations replay cleanly on production DB (they auto-run on build).
- [ ] Click **Publish** in Lovable.
- [ ] Verify at `https://getmindrop.lovable.app`:
  - [ ] Landing renders with correct title/description/OG.
  - [ ] Sign in works (Google + email).
  - [ ] Create/list/delete memory works.
  - [ ] Admin console loads for superadmin only.
- [ ] Tag `vX.Y.Z-web` on the merge commit.
- [ ] Update [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) if items moved.

## Android Release

Prerequisite: [NATIVE_ANDROID_GUIDE.md](./NATIVE_ANDROID_GUIDE.md) followed to build the shell.

- [ ] Bump `versionCode` + `versionName` in `android/app/build.gradle.kts`.
- [ ] `./gradlew lint testDebug` clean.
- [ ] `./gradlew bundleRelease` produces signed AAB.
- [ ] Manual matrix pass:
  - [ ] Stock Android (Pixel).
  - [ ] Samsung One UI.
  - [ ] Xiaomi MIUI.
- [ ] Alarm-when-killed test passes.
- [ ] Geofence enter/exit test passes.
- [ ] Boot receiver reschedules after reboot.
- [ ] FCM push delivers backgrounded.
- [ ] Cashfree native checkout succeeds (SANDBOX first, then PROD).
- [ ] Offline capture syncs on reconnect.
- [ ] Upload AAB to Play Console → Internal.
- [ ] Tag `vX.Y.Z-android`.

## Play Store Submission

- [ ] Store listing complete (title, short + full description, screenshots, feature graphic).
- [ ] Content rating questionnaire completed.
- [ ] **Data safety form** matches actual collection (see [SECURITY.md](./SECURITY.md)):
  - [ ] Personal info (email, name).
  - [ ] Location (if Places enabled).
  - [ ] Notifications (if listener enabled).
  - [ ] Payments (via Cashfree).
- [ ] Sensitive permission justifications submitted:
  - [ ] `ACCESS_BACKGROUND_LOCATION`.
  - [ ] `SCHEDULE_EXACT_ALARM`.
  - [ ] `BIND_NOTIFICATION_LISTENER_SERVICE`.
  - [ ] `FOREGROUND_SERVICE_*` types.
- [ ] Privacy policy URL live and accessible.
- [ ] Target API level meets Play requirement (34+ in 2026).
- [ ] Test accounts provided for reviewers.

## Google Play Review

- [ ] Internal testing 24–48h with real users, no crashes.
- [ ] Pre-launch report reviewed; no P0 findings.
- [ ] Promote to Closed track.
- [ ] Closed test 3–7 days with 20+ users.
- [ ] Promote to Open (optional) or directly Production.
- [ ] Staged rollout: 10% → 50% → 100% over 5–7 days.

## Production Verification (post-publish)

- [ ] Real user signs up on production build.
- [ ] Real payment (small amount) completes end-to-end on PROD Cashfree.
- [ ] Real reminder fires at scheduled time.
- [ ] Real Drive backup succeeds.
- [ ] server-function-logs quiet (no unexpected 5xx).
- [ ] No Sentry alerts (once wired).

## Rollback

If anything above fails after production is live:

1. **Web:** Lovable version history → restore previous. < 2 min.
2. **Server fn / migration:** revert commit and redeploy; write compensating migration if schema changed. < 30 min.
3. **Feature flag:** toggle off. Seconds.
4. **Cashfree:** flip `CASHFREE_ENV` back to `SANDBOX`. Immediate.
5. **Android:** Play Console → Halt rollout → Promote previous AAB. 15–60 min propagation.

Then:

- [ ] File incident note.
- [ ] Update [CHANGELOG.md](./CHANGELOG.md) with a `### Fixed` entry.
- [ ] Add regression test if applicable.
