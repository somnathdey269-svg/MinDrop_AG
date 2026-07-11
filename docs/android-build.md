# MinDrop — Android build (Capacitor)

The web app is wrapped as a native Android APK/AAB with Capacitor.
Push notifications on Android go through `@capacitor-firebase/messaging`
using your Firebase project's `google-services.json` (not the web VAPID key).

## One-time setup on your machine

1. **Install Android Studio** (Giraffe or newer) and the Android SDK
   (Platform 34+). Make sure `JAVA_HOME` points at a JDK 17 install.
2. **Clone the repo** and install deps:

   ```bash
   bun install
   ```

3. **Get `google-services.json`**
   - Firebase Console → Project settings → General → Your apps
   - Add an Android app with package name `in.mindrop.app`
   - Download `google-services.json`
4. **Add the Android platform** (creates the `android/` folder):

   ```bash
    bun run build:android
   npx cap add android
   ```

5. Copy the downloaded file into `android/app/google-services.json`.

## Every time you change web code

```bash
bun run build:android     # builds .output/public/ for Capacitor
npx cap sync android
npx cap open android   # opens Android Studio
```

Then in Android Studio: **Run ▶** on a device / emulator.

## Publishing to Play Store

1. In Android Studio: **Build → Generate Signed Bundle / APK → Android App
   Bundle (.aab)**. Create or reuse an upload keystore.
2. Upload the `.aab` to the Play Console under your app's release track.
3. In Play Console → Settings → App integrity, register the SHA-256 fingerprint
   from your upload keystore (also add it in Firebase Console → Project
   settings → your Android app, so FCM tokens keep working after Play signing).

## Push notifications

- The button in the app calls `enablePush()` from `src/lib/push.ts`.
- On Android it uses `@capacitor-firebase/messaging` and saves the token
  with `platform: "android"` in the `push_tokens` table.
- The Postgres cron job `fire-reminders-every-minute` calls
  `/api/public/hooks/fire-reminders` every minute; that endpoint sends FCM
  pushes for memories with `remind_at` due or `snoozed_until` elapsed.

## Live-reload against the Lovable preview (optional)

Uncomment the `server.url` / `cleartext` block in `capacitor.config.ts`,
run `npx cap sync android`, then open the app on-device — it will load the
preview URL directly. Comment it back out before shipping a release build.
