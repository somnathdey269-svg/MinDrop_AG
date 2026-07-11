# MinDrop — Google Play readiness

## App content declarations

**Sensitive permissions & Play policy answers**

| Permission | Why we need it | Play form answer |
|---|---|---|
| `POST_NOTIFICATIONS` | Post reminders/alarms the user created. | Core functionality |
| `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` | Fire reminders at the exact minute the user picked. | "Alarm/timer/calendar" use case — required. |
| `RECEIVE_BOOT_COMPLETED` | Rehydrate scheduled alarms after reboot so reminders don't disappear. | Required for reminder reliability. |
| `ACCESS_FINE_LOCATION` | Place-based reminders (arrive at grocery → remind). | Foreground location. |
| `ACCESS_BACKGROUND_LOCATION` | Fire place reminders when MinDrop is closed. Prominent-disclosure screen shown in `/permissions`. Demo video attached to release. | Background location — feature: location-triggered reminders. |
| `BIND_NOTIFICATION_LISTENER_SERVICE` | User-opt-in: react to notifications from other apps (e.g. "when Mom messages, remind me at 6 pm"). No content leaves the device. | Notification access — declared in Play Console "App content" as required for the Notification-rules feature. |
| `RECORD_AUDIO` | Voice notes attached to reminders. | Optional. |
| `READ_CONTACTS` | Pick a contact when creating a person-scoped rule. | Optional. |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Opt-in prompt so OEM doze doesn't drop alarms. Not requested at launch. | Required for reminder reliability. |

## Data safety form (short answers)

- Data collected: **email, name** (via Google Sign-in, only if the user chooses to sign in for cloud backup/premium).
- Data shared with third parties: **none**.
- Notification contents from other apps: **read on-device only**, never sent to any server.
- Location: **on-device only**, used to evaluate geofences. Never uploaded.
- Voice notes: **stored locally** (Cloud backup only if user enables Drive sync).
- Encryption in transit: yes (HTTPS).
- Users can request deletion: yes — Settings → Delete account.

## Store listing — required assets

- [ ] App icon 512×512 PNG (no alpha).
- [ ] Feature graphic 1024×500.
- [ ] Screenshots (phone) ×4 minimum — include one showing background-location prompt with prominent disclosure.
- [ ] Short description ≤80 chars.
- [ ] Full description ≤4000 chars, mention background location + notification access use.
- [ ] Privacy Policy URL — already live at `/privacy`.
- [ ] Content rating questionnaire.
- [ ] Target audience: 13+.
- [ ] Ads: none.
- [ ] Data safety questionnaire (see above).

## Pre-release checklist

- [ ] `versionCode` bumped in `android/app/build.gradle`.
- [ ] `versionName` matches marketing (e.g. `1.0.0`).
- [ ] Signed AAB (`./gradlew :app:bundleRelease`) — key stored outside repo.
- [ ] Proguard R8 shrink on: verify `AlarmsBridge`, `NotifyBridge`, `PlacesBridge` still work in release APK.
- [ ] Deep-link intents from `/permissions` all open the right screens on API 26, 30, 33, 34, 35.
- [ ] `docs/ANDROID_PHASE1_VERIFY.md` walked end-to-end on one physical device.
- [ ] Cold-start on Android 14 device — reminders fire while app is swiped away.
- [ ] Reboot test — pending alarms restored.

## Prominent disclosure copy (background location)

Use this exact text in the disclosure sheet shown before calling `PlacesBridge.requestPermission()`:

> MinDrop uses your location in the background to fire reminders when you
> arrive at or leave a place you've saved (e.g. "remind me to buy milk when
> I reach the grocery store"). Your location is evaluated on your phone
> only and is **never sent to MinDrop's servers**. You can turn this off
> anytime in Settings → Places.

## Prominent disclosure copy (notification access)

Shown BEFORE deep-linking to Notification Listener Settings (see `src/components/permissions/PermissionDisclosure.tsx`):

> MinDrop reads the notifications on your phone so your rules (e.g.
> "UPI debit over ₹5,000 → ring") can match them. Matching happens on
> your device — the text of your notifications is **never uploaded to
> our servers**. You control which rules run and can turn them off any
> time.

## Native background rule evaluation

The Notification Listener now evaluates a compact rule snapshot on the
device (`SharedPreferences: mindrop_notify_v1 / rules_snapshot`) so
alarms fire even when the WebView is dead. The JS engine keeps the
snapshot in sync on every rule edit via `NotifyBridge.syncRules`.

## Raw notification inbox (post-linkage)

Every captured notification is stored locally in
`localStorage: mindrop.notify.capture.v1` (ring-buffered). Free tier:
500 entries / 7 days. Paid: 5000 / 90 days. **Nothing is uploaded.**
User can browse and clear at `/notify-inbox`.

## Install country (data-safety disclosure)

`profiles.install_country` stores a single 2-letter country code the
first time a signed-in user opens the app, derived from Cloudflare
`cf-ipcountry` (or browser `Accept-Language`). Used for FX pricing
audit only. No IP address, city, or location coordinates are stored.
