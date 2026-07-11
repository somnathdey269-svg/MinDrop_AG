# MinDrop — Build Your Android App (Plain-English Guide)

**Read this ONCE, follow it ONCE. After that, you just run `./rebuild.sh` every time you edit in Lovable.**

---

## What you're doing

You're taking your Lovable web app and wrapping it into a real Android app (`.apk` file) that you install on your phone. This wrapper is what makes alarms ring when the app is closed, lets it read notifications, and track location in the background — things a plain browser can't do.

- **One-time setup:** ~2-3 hours on a weekend. You do this ONCE. Ever.
- **After that:** ~3 minutes per rebuild, using the script below.

---

# PART 1 — ONE-TIME SETUP (do this once, ever)

## Step 1 — Install 3 programs on your computer

Download and install these. Click "Next / Next / Finish" on every screen — the defaults are fine.

| # | Program | Where to download | Notes |
|---|---------|-------------------|-------|
| 1 | **Node.js** (LTS version) | https://nodejs.org | Click the big green LTS button |
| 2 | **Git** | https://git-scm.com | Just click Next on every screen |
| 3 | **Android Studio** | https://developer.android.com/studio | Big download (~4 GB). Grab coffee. |

## Step 2 — Open Android Studio once

Launch it. It will download "SDK components" — let it finish (~15 min). Click Next / Finish on everything. Close it. You won't touch it again until Step 7.

## Step 3 — Get your Lovable code onto your computer

1. In Lovable (top-right corner) → click **GitHub** → **Connect to GitHub**. Make a free github.com account if you don't have one.
2. Lovable pushes your code to a repo. Copy that repo's URL (looks like `https://github.com/YOUR-NAME/mindrop.git`).
3. On your computer, open a terminal:
   - **Mac:** press ⌘+Space, type "Terminal", hit Enter.
   - **Windows:** press Start, type "PowerShell", hit Enter.
4. Type these commands one at a time (paste, hit Enter, wait for it to finish, then next):
   ```
   git clone https://github.com/YOUR-NAME/mindrop.git
   cd mindrop
   npm install
   ```
   The last one takes 2-3 minutes.

## Step 4 — Add the Android wrapper

Still in the terminal, still inside the `mindrop` folder, run:
```
npx cap add android
npm run build
npx cap sync android
```
This creates a new folder called `android/`. That's your Android app.

## Step 5 — Copy the native code into the Android folder

Your project already has the Kotlin files written for you (in `native/android/places/`). You just need to copy them into the Android app folder. Run:

**Mac / Linux:**
```
mkdir -p android/app/src/main/java/app/getmindrop/places
cp native/android/places/*.kt android/app/src/main/java/app/getmindrop/places/
```

**Windows (PowerShell):**
```
mkdir android\app\src\main\java\app\getmindrop\places
copy native\android\places\*.kt android\app\src\main\java\app\getmindrop\places\
```

## Step 6 — Edit 3 files (careful copy-paste, 5 min)

### File A: `android/app/src/main/AndroidManifest.xml`

Open this file in any text editor (Notepad works). Find the line `<application` — **above** it, paste this block:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

Then find `</application>` (with the slash). **Just above** that line, paste:

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

Save the file.

### File B: `android/app/src/main/java/app/getmindrop/MainActivity.java`

Open it. Find the line `super.onCreate(savedInstanceState);`. **Just below** it, paste:
```java
registerPlugin(app.getmindrop.places.PlacesBridgePlugin.class);
```
Save.

### File C: `android/app/build.gradle`

Open it. Find the section that says `dependencies {`. Inside that block, paste this new line:
```
implementation "com.google.android.gms:play-services-location:21.3.0"
```
Save.

## Step 7 — Build your first APK

Back in the terminal, still inside the `mindrop` folder:
```
npx cap open android
```
Android Studio opens with your project. Wait for the bottom-right progress bar to finish (says "Gradle sync" — takes 2-5 min the first time).

Then in the top menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

Wait 3-5 min. When done, a small popup appears bottom-right: **"APK(s) generated successfully"** with a **locate** link. Click it → there's your `.apk` file. Email it to yourself → open on phone → install.

✅ **Setup complete. You never do Steps 1-7 again.**

---

# PART 2 — EVERY TIME YOU EDIT IN LOVABLE (the fast loop)

Your project now has a script called `rebuild.sh` (Mac/Linux) or `rebuild.bat` (Windows). After editing in Lovable:

**Mac / Linux:**
```
./rebuild.sh
```

**Windows:**
```
rebuild.bat
```

That's it. The script does everything: pulls your Lovable edits, rebuilds, and syncs Android. Then just click **Build → Build APK(s)** in Android Studio again.

⏱️ **Total time per edit: ~3 minutes.** No Kotlin, no permissions, no file editing. Ever again.

---

# PART 3 — Answers to your questions

### "What's the Kotlin thing?"
Kotlin is the programming language Android uses for the native bits (alarms, location, notifications). **You don't need to write any Kotlin.** The `.kt` files are already written and living in `native/android/places/`. Step 5 just copies them into place. Once copied, forget about them.

### "Do I redo all this every time I edit?"
**No.** Parts 1 (Steps 1-7) are ONE-TIME. After that, only Part 2 (`./rebuild.sh`) — 3 minutes.

The only time you'd touch Kotlin/permissions again is if you add a **brand new** native capability (e.g. Bluetooth, SMS reading). Normal Lovable edits (UI, colors, text, features, screens) never require it.

### "What if a new native plugin is needed later?"
I'll tell you exactly which line to add to which file. You copy-paste, re-run `./rebuild.sh`. Done.

---

# PART 4 — When something breaks

| Problem | Fix |
|---------|-----|
| Alarm doesn't ring | Phone Settings → Apps → MinDrop → Battery → **Unrestricted** |
| Notification-read doesn't work | Phone Settings → Apps → Special access → **Notification access** → toggle MinDrop ON |
| Location doesn't fire when app closed | Phone Settings → Apps → MinDrop → Permissions → Location → **Allow all the time** |
| Android Studio shows red errors after `cap sync` | Menu: **File → Sync Project with Gradle Files** |
| APK won't install on phone | Phone Settings → Security → enable **Install from unknown sources** for your email/browser app |

---

# PART 5 — When you're ready for the Play Store (optional)

Sideloading the APK (emailing it to yourself) works forever and is free. If you want it on the Play Store later:
- Google Play Console: $25 one-time fee
- Takes ~2 hours to set up the listing, screenshots, and signing key
- I'll walk you through it when you ask

---

**That's the whole thing. Bookmark this file. You're done reading manuals.**
