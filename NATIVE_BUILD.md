# MinDrop — Native Android Build (Capacitor)

This replaces the old Appilix WebView wrapper. Appilix cannot fire alarms
or notifications when the app is closed — a Capacitor build can, because
the OS schedules the notifications natively, not the WebView.

**All memory data stays on the device** (`/data/data/app.getmindrop/`).
No server. No account. Uninstall = full delete.

---

## One-time setup

```bash
npm install
npx cap add android
```

Requires [Android Studio](https://developer.android.com/studio) and a
JDK 17+.

---

## Every release

```bash
npm install         # picks up new packages
npm run build       # builds .output/public/ (TanStack Start + Nitro)
npx cap sync android
npx cap open android
```

In Android Studio: **Build → Generate Signed Bundle / APK → APK →**
choose or create a keystore → sign → export.

Signed APK lands in `android/app/build/outputs/apk/release/`.

> **Keep the same keystore for every release.** A different keystore forces
> users to uninstall the old build before installing the new one (they
> lose their memories unless they export first — see Migration below).

---

## AndroidManifest.xml — required permissions

Open `android/app/src/main/AndroidManifest.xml`. Inside the top-level
`<manifest>` tag (before `<application>`), add these if missing:

```xml
<!-- Notifications / alarms -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Voice notes -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

<!-- Location / geofences (Places) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

Inside `<application>`, register the geofence receiver:

```xml
<receiver
    android:name="app.getmindrop.places.GeofenceReceiver"
    android:exported="true"
    android:permission="android.permission.ACCESS_FINE_LOCATION">
    <intent-filter>
        <action android:name="app.getmindrop.places.TRANSITION" />
    </intent-filter>
</receiver>
```

`SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` are required on Android 12+
so alarms fire at the exact `dueAt` instead of being batched by Doze.
`RECEIVE_BOOT_COMPLETED` lets scheduled alarms survive a reboot (the
Capacitor LocalNotifications plugin ships the receiver).



---

## First-run permission prompts (in the app)

MinDrop's Permissions screen requests, in order:

1. **Notifications** — Android 13+ `POST_NOTIFICATIONS` runtime prompt.
2. **Microphone** — triggered on first voice capture.
3. **Battery optimization → Unrestricted** — deep-links to
   *Settings → Apps → MinDrop → Battery*. Users **must** set this to
   *Unrestricted* or Android's Doze will delay alarms by minutes.

---

## Migrating from the Appilix build

The Capacitor WebView uses a different origin than the Appilix WebView,
so the old `localStorage` is **not** carried over automatically.

1. Open the current Appilix APK → **Settings → Export memories** →
   save `mindrop-backup-YYYY-MM-DD.json`.
2. Uninstall the Appilix APK.
3. Install the new Capacitor APK.
4. Open it → **Settings → Import memories** → pick that JSON file.

---

## Verify alarms actually ring

1. Create a memory scheduled 2 minutes from now with `Notify = Alarm`.
2. Force-stop MinDrop (Settings → Apps → MinDrop → Force stop).
3. Lock the phone.
4. At `dueAt`, the OS wakes the alarm channel — full-screen notification,
   default alarm sound, vibrates. Two follow-up shots fire at +30s and
   +60s in case the first was missed.

If it doesn't ring:

| Symptom | Fix |
| --- | --- |
| Silent, no notification | POST_NOTIFICATIONS never granted → Settings → Apps → MinDrop → Permissions → Notifications. |
| Fires late (minutes off) | Battery not set to Unrestricted → Settings → Apps → MinDrop → Battery. |
| No exact time on Android 14 | Grant "Alarms & reminders" special access → Settings → Apps → Special app access → Alarms & reminders → MinDrop. |
| No sound but banner shows | Phone in Do Not Disturb → allow MinDrop as an exception, or channel importance dropped by user in system settings. |
| Alarms lost after reboot | RECEIVE_BOOT_COMPLETED missing from manifest → add it, rebuild. |

---

## iOS (optional, later)

```bash
npx cap add ios
```

Add to `ios/App/App/Info.plist` inside the top-level `<dict>`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>MinDrop uses the microphone so you can capture voice thoughts.</string>
```

Local notifications work with no extra Info.plist entry. Open with
`npx cap open ios`, set Team under Signing & Capabilities, Archive,
distribute via TestFlight.

---

## Native plugin sources (copy into `android/`)

After `npx cap add android`, copy the plugin sources from this repo into
the generated Android project:

```bash
mkdir -p android/app/src/main/java/app/getmindrop/places
cp native/android/places/*.kt android/app/src/main/java/app/getmindrop/places/
```

Then register the plugin in `android/app/src/main/java/app/getmindrop/MainActivity.java`
inside `onCreate` (after `super.onCreate(...)`):

```java
registerPlugin(app.getmindrop.places.PlacesBridgePlugin.class);
```

Add Play Services Location to `android/app/build.gradle` `dependencies { }`:

```gradle
implementation "com.google.android.gms:play-services-location:21.3.0"
```

---

## Places / geofencing

MinDrop registers Android OS `GeofencingClient` fences per saved place, so
enter/exit fires even when the app is fully closed. The system posts a
notification via the `mindrop-places` channel and — if the app is alive —
forwards the event to the WebView.

**Permission flow (first time user opens /places):**

1. `ACCESS_FINE_LOCATION` (foreground) — standard runtime prompt.
2. `ACCESS_BACKGROUND_LOCATION` — Android shows a separate prompt where the
   user MUST tap **"Allow all the time"**. "While using the app" is not
   enough — geofences won't fire when the app is closed.
3. Battery optimization → **Unrestricted** (same setting as alarms).

If a place never fires:

| Symptom | Fix |
| --- | --- |
| Fires only when app is open | Background location is "While using" → change to "Allow all the time". |
| Never fires at all | Location services off system-wide, or "Use precise location" is off for MinDrop. |
| Delayed by 5–10 min | Normal — geofences batch by design to save battery. Reduce radius (min 100 m recommended). |
