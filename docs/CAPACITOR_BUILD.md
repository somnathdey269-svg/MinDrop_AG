# Capacitor + TanStack Start — build wiring

MinDrop's web app is built with `@lovable.dev/vite-tanstack-config`
(TanStack Start v1 + Nitro on Vite 7). Capacitor loads a static Android
shell from `.output/public`. This note explains the change that made
`npx cap sync android` work end-to-end and how to keep it working.

## The build fix

TanStack Start + Nitro **always** writes the client bundle to
`dist/client/`. The Android build then copies that client bundle to
`.output/public/` and writes a static SPA shell at `.output/public/index.html`.
It does not use TanStack's preview/prerender server and does not import a
`dist/server/server.js` entry.

Capacitor points at the Android-ready directory:

```ts
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: "in.mindrop.app",
  appName: "MinDrop",
  webDir: ".output/public", // Android static shell output
  // ...
};
```

`npm run build:android` produces `.output/public/index.html`, and
`npx cap sync android` copies it into
`android/app/src/main/assets/public/index.html`.

## Why not output to `dist/`?

- Vite's `build.outDir` is ignored by the Start+Nitro pipeline — Nitro
  owns the final emit and writes to `dist/client/`.
- Overriding `outDir` in `vite.config.ts` only moves the intermediate
  Vite chunks; Nitro still assembles the final bundle at
  `dist/client/`, so the override is silently discarded.
- A manual copy step would drift. The copy and static shell generation are
  part of `npm run build:android`, so `./rebuild.sh` stays hands-free.

Following the framework's convention is future-proof.

## Scripts you can run

| Command                       | What it does                                     |
| ----------------------------- | ------------------------------------------------ |
| `npm run android:doctor`      | Diagnose local machine (Node, JDK, SDK, env).    |
| `npm run build:android`       | Build the Capacitor SPA shell into `.output/public/`. |
| `npm run android:sync`        | `npm run build:android` + `npx cap sync android`. |
| `npm run android:open`        | Above + `npx cap open android`.                  |
| `./rebuild.sh`                | Full flow: git pull → install → build → sync.    |
| `./android-doctor.sh`         | Same as `npm run android:doctor` (bash).         |

Windows equivalents: `rebuild.bat`, `android-doctor.bat`,
`npm run android:doctor:win`.

## First-time setup

1. Install Android Studio, JDK 17, and set `ANDROID_HOME`.
2. Run `npm install`.
3. Run `npm run build:android` — verify `.output/public/index.html` exists.
4. Run `npx cap add android` — creates the `android/` project.
5. Run `npx cap sync android` — copies web assets and plugins.
6. Run `npx cap open android` — opens Android Studio.
7. In Android Studio: **Build → Build APK(s)**.

## Troubleshooting

**`Could not find the web assets directory: ./dist`**
→ `capacitor.config.ts` still says `webDir: "dist"`. Change it to
`".output/public"`.

**`.output/public/index.html` missing after `npm run build:android`**
→ Build likely failed. Re-run `npm run build:android` and read the error. If it
succeeds but the file is still missing, inspect `dist/client/assets` for the
generated JS/CSS bundle names.

**`No android/ directory found`** from `rebuild.sh`
→ First-time setup: run `npx cap add android`, then rerun.

## Compatibility with future Lovable updates

- `webDir: ".output/public"` is the stable Android package directory.
- The script only reads generated client assets from `dist/client`; it does not
  depend on any server output filename.
- `rebuild.sh` / `rebuild.bat` do not shell into `node_modules` or patch
  vendor files — they only call documented npm and Capacitor commands.
- `android-doctor.sh` is diagnostic-only; it never mutates the project.
- We do NOT copy build output into a second folder, so there is no
  duplicate to fall out of sync.

---

## Custom Capacitor plugins (PlacesBridge)

`native/android/places/` holds Kotlin source that is NOT an npm package, so
Capacitor 8's auto-discovery (via `capacitor.plugins.json`) does not pick it
up. Two steps are required on every fresh checkout / after `npx cap add
android`:

### 1. Copy Kotlin sources into the Android project

Automatic — `rebuild.sh` / `rebuild.bat` runs this after `cap sync`. You can
also run it standalone:

```bash
npm run android:native        # macOS/Linux
npm run android:native:win    # Windows
```

The script mirrors every `native/android/<pkg>/*.kt` file to
`android/app/src/main/java/app/getmindrop/<pkg>/`. It is idempotent.

### 2. Register the plugin in MainActivity.java

Open `android/app/src/main/java/in/mindrop/app/MainActivity.java` and add
the highlighted lines:

```java
package in.mindrop.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import app.getmindrop.places.PlacesBridgePlugin;   // ← add

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PlacesBridgePlugin.class);  // ← add BEFORE super.onCreate
        super.onCreate(savedInstanceState);
    }
}
```

`registerPlugin(...)` MUST run before `super.onCreate(...)`, otherwise the
bridge is built without the plugin and `PlacesBridge` calls from JS reject
with "Plugin not implemented".

Verify at runtime: `Capacitor.isPluginAvailable("PlacesBridge")` must return
`true` in the DevTools console when running the debug APK.

> **NotifyBridge status:** `src/lib/notify/bridge.ts` also calls
> `registerPlugin("NotifyBridge")`, but there is no Kotlin implementation in
> `native/` yet. On device the plugin resolves to a rejecting stub and the
> `/notify` screen falls back to its web mock. Wiring a real
> `NotificationListenerService` is out of scope for this pass.

---

## AndroidManifest.xml patch

Add the following inside `android/app/src/main/AndroidManifest.xml`. Every
entry is required by the current native code (PlacesBridge geofences,
GeofenceReceiver, FCM push, exact alarms, foreground reminder services).

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

  <!-- Location (foreground + background for geofences) -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

  <!-- Notifications (Android 13+) + boot re-arm for alarms/geofences -->
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
  <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
  <uses-permission android:name="android.permission.VIBRATE" />
  <uses-permission android:name="android.permission.WAKE_LOCK" />

  <!-- Exact alarms for reminder scheduling -->
  <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
  <uses-permission android:name="android.permission.USE_EXACT_ALARM" />

  <!-- Foreground service for long-running reminders / location work -->
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />

  <application ...>

    <!-- GeofenceReceiver: fires enter/exit even when app process is dead -->
    <receiver
        android:name="app.getmindrop.places.GeofenceReceiver"
        android:exported="true">
      <intent-filter>
        <action android:name="app.getmindrop.places.TRANSITION" />
      </intent-filter>
    </receiver>

    <!-- MainActivity, other Capacitor entries auto-generated by cap sync -->
  </application>
</manifest>
```

Notes:
- `@capacitor/geolocation` already merges Google Play Services metadata — no
  extra `<meta-data android:name="com.google.android.gms.version" ...>` line
  needed.
- `@capacitor-firebase/messaging` merges its own `FirebaseMessagingService`
  entry via manifest merger; do not add one manually.
- `android:exported="true"` on `GeofenceReceiver` is required for Android
  12+ because the OS delivers the geofence intent from outside the app.

---

## Gradle patch — android/app/build.gradle

Add inside the existing `dependencies { }` block:

```gradle
dependencies {
    // ...existing capacitor / androidx entries...

    // PlacesBridgePlugin uses GeofencingClient — pin the exact API version
    // the Kotlin code was written against.
    implementation "com.google.android.gms:play-services-location:21.3.0"
}
```

`@capacitor-firebase/messaging` handles Firebase Gradle wiring
automatically. The only manual step is placing your Firebase console
`google-services.json` at `android/app/google-services.json` before the
first Gradle Sync.

Minimum SDK expectations (verify `android/variables.gradle`):
- `minSdkVersion = 24` or higher (Capacitor 8 minimum).
- `compileSdkVersion = 34` or higher.
- `targetSdkVersion = 34` or higher (required by Play Store from Aug 2024).

---

## If Gradle Sync / APK build fails on your machine

The sandbox that generated these files has no Android SDK, so I could not
run `./gradlew assembleDebug` end-to-end. If Android Studio surfaces
additional errors on the first build (dependency resolution, manifest
merger, MainActivity typos, `google-services.json` missing, etc.):

1. Copy the **full** Gradle / Android Studio error output.
2. Paste it back in a single message.
3. You'll get **one consolidated patch** covering every remaining fix
   (Manifest + Gradle + MainActivity + native sources) — not incremental
   round-trips.
