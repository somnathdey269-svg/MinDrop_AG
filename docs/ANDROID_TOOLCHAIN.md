# MinDrop Android Toolchain — Compatibility Matrix

This is the **supported version matrix** for the MinDrop Android build. Every
Android/Capacitor build validates against this matrix before it runs.

- **Machine-readable source of truth:** [`scripts/android-toolchain.json`](../scripts/android-toolchain.json)
- **Enforcement:** [`scripts/validate-toolchain.mjs`](../scripts/validate-toolchain.mjs), invoked from `scripts/validate-android.mjs` (which `./rebuild.sh` runs before `npx cap sync android`)
- **Fail-fast policy:** any drift outside the ranges below stops the build with a clear error.

If you bump a version, update `scripts/android-toolchain.json` **and** this document in the same commit.

---

## Supported versions

| Component | Min | Max | Recommended | Where it is set |
|---|---|---|---|---|
| Java (JDK) | 17 | 21 | **21** (Temurin) | `JAVA_HOME` on the host / Android Studio |
| Gradle wrapper | 8.11.0 | 8.14.99 | **8.14.3** | `android/gradle/wrapper/gradle-wrapper.properties` |
| Android Gradle Plugin | 8.7.0 | 8.13.99 | **8.13.0** | `android/build.gradle` (`classpath 'com.android.tools.build:gradle:…'`) |
| Kotlin | 2.2.20 | 2.2.99 | **2.2.20** | `android/variables.gradle` (`kotlin_version`) + classpath in `android/build.gradle` |
| compileSdk | 35 | 36 | **36** | `android/variables.gradle` |
| minSdk | 24 | 26 | **24** | `android/variables.gradle` |

### Capacitor packages

All `@capacitor/*` packages MUST share the same major version (currently **8**).
The validator fails if you mix majors (e.g. `@capacitor/core@8` + `@capacitor/geolocation@7`).

| Package | Required spec |
|---|---|
| `@capacitor/core` | `^8.4.0` |
| `@capacitor/android` | `^8.4.0` |
| `@capacitor/cli` | `^8.4.0` |
| `@capacitor/ios` | `^8.4.0` |
| `@capacitor/app` | `^8.1.0` |
| `@capacitor/geolocation` | `^8.2.0` |
| `@capacitor/local-notifications` | `^8.2.0` |
| `@capacitor-firebase/messaging` | `^8.3.0` |
| `capacitor-voice-recorder` | `^7.0.0` |

---

## Why Kotlin is locked to 2.2.20

Every `@capacitor/*` plugin's `android/build.gradle` reads
`rootProject.ext.kotlin_version` and defaults to **Kotlin 2.2.20**.
Pinning a lower Kotlin at the root forces the older compiler on plugin
sources that use Kotlin 2.x stdlib APIs. The historical symptom was:

```
:capacitor-geolocation:compileDebugKotlin
GeolocationErrors.kt: Unresolved reference: padStart
```

The validator now dynamically reads the highest `kotlin_version` any
installed Capacitor plugin expects and fails the build if the root pins
anything lower — so future plugin upgrades cannot silently break the build.

## Upgrade playbook

1. Bump the number in `scripts/android-toolchain.json`.
2. Update the matching config file (`variables.gradle`, `build.gradle`, `gradle-wrapper.properties`, `package.json`).
3. Update the table above with the same numbers.
4. Run `node scripts/validate-toolchain.mjs` → must be all green.
5. Run `./rebuild.sh` → full pipeline validation.
6. Rebuild in Android Studio; run on emulator.

## Failure examples & fixes

| Validator says | Fix |
|---|---|
| `Kotlin ≥ plugin default … root=1.9.24 plugins want ≥2.2.20` | Set `kotlin_version = '2.2.20'` in `android/variables.gradle` and `kotlin-gradle-plugin:2.2.20` in `android/build.gradle` |
| `Kotlin classpath match … variables=X classpath=Y` | Make the two Kotlin values equal |
| `@capacitor/geolocation … have 7.x, matrix wants ^8.2.0` | Upgrade **all** `@capacitor/*` together: `npm i @capacitor/core@^8 @capacitor/android@^8 @capacitor/cli@^8 @capacitor/ios@^8 @capacitor/geolocation@^8 @capacitor/local-notifications@^8 @capacitor/app@^8` |
| `@capacitor/* majors aligned … found majors: [7, 8]` | Same as above — one major across every `@capacitor/*` package |
| `Gradle … have 8.9, need 8.11.0..8.14.99` | Edit `android/gradle/wrapper/gradle-wrapper.properties` |
| `AGP … have 8.5.0, need 8.7.0..8.13.99` | Bump the AGP classpath in `android/build.gradle` |
| `Java … have 17, need 17..21 (recommend 21)` — pass but not recommended | Consider installing JDK 21 (Temurin) |
