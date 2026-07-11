# MinDrop — Play Internal Testing upload

Zero-to-track walkthrough.

## 1 — One-time keystore

Create once, back up somewhere safe. **Losing it means never updating this app again.**

```bash
keytool -genkey -v \
  -keystore ~/keys/mindrop-release.jks \
  -alias mindrop \
  -keyalg RSA -keysize 2048 -validity 10000
```

## 2 — Wire signing into Gradle (release only)

Add to `android/app/build.gradle` above `buildTypes {`:

```groovy
signingConfigs {
    release {
        storeFile file(System.getenv("MINDROP_KEYSTORE") ?: "keystore.not.set")
        storePassword System.getenv("MINDROP_KEYSTORE_PASSWORD")
        keyAlias System.getenv("MINDROP_KEY_ALIAS") ?: "mindrop"
        keyPassword System.getenv("MINDROP_KEY_PASSWORD")
    }
}
```

Change `release { ... }` to reference it:

```groovy
release {
    signingConfig signingConfigs.release
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
}
```

## 3 — Build the AAB

```bash
export MINDROP_KEYSTORE=~/keys/mindrop-release.jks
export MINDROP_KEYSTORE_PASSWORD=***
export MINDROP_KEY_ALIAS=mindrop
export MINDROP_KEY_PASSWORD=***

npm run build:android
npx cap sync android
cd android
./gradlew :app:bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

Verify the release APK before uploading:

```bash
./gradlew :app:assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
# Walk docs/ANDROID_PHASE1_VERIFY.md on this build — R8 must not break bridges.
```

## 4 — Play Console — Internal testing track

1. Play Console → **Testing → Internal testing → Create new release**.
2. Upload `app-release.aab`.
3. Release notes (e.g. `First internal build. Alarms, places, notification rules.`).
4. **App content** — complete:
   - Privacy Policy URL: `https://getmindrop.lovable.app/privacy`
   - Data safety: use `docs/PLAY_STORE_READINESS.md`.
   - Sensitive permissions:
     - **Background location** — attach demo video showing the prominent-disclosure sheet in `/permissions` and a place reminder firing while MinDrop is swiped away.
     - **SCHEDULE_EXACT_ALARM** — declare as an alarm/reminder app.
     - **Notification access** — declare feature name "Notification rules".
5. **Testers** — add up to 100 email addresses (or a Google Group). Copy the opt-in URL.
6. **Review release → Start rollout to Internal testing**.

## 5 — Post-upload health checks

- Play Console → **Statistics → Vitals** — watch ANR and crash rate for first 48 h.
- Play Console → **Reach and devices → Excluded devices** — usually zero; investigate any manifest-based exclusion.
- Ask 2–3 testers to reboot their phone after scheduling a reminder — confirms `BootCompletedReceiver` works in the R8-minified build.

## 6 — Promotion path

Internal → Closed (up to 20k testers) → Open → Production. Each stage needs at least 14 days of testing per Google's current rule for new apps with sensitive permissions.
