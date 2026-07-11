# Android Phase 1 — Verification checklist

Perform on a physical device or Android 13+ emulator. All items must pass
before promoting to Play Store internal testing.

## Prep

1. `npm run build:android`
2. `npx cap sync android`
3. Open `android/` in Android Studio, run on device.

## 1 — Permissions UX (no manual settings hunting)

Open `/permissions`. Each row's CTA MUST open the correct system surface:

- [ ] "Enable notifications" → runtime `POST_NOTIFICATIONS` dialog (Android 13+); dialog absent on Android ≤12 and row shows Granted.
- [ ] "Allow exact alarms" → **Alarms & Reminders** special-access screen scoped to MinDrop (only visible when `canScheduleExactAlarms === false`).
- [ ] "Ignore battery optimization" → per-app allow-list dialog.
- [ ] "Enable notification access" → Notification Access with MinDrop preselected.
- [ ] "Allow location (always)" → runtime foreground prompt first, then background upgrade path.

After granting each, return to the app: statuses refresh (relies on
`visibilitychange` handler).

## 2 — Alarm reliability

- [ ] Create a reminder 2 minutes out. Force-close the app. Notification fires.
- [ ] Create a reminder 5 minutes out. Reboot the phone. Notification fires. (Boot receiver rescheduled it.)
- [ ] Create a reminder while exact-alarm access is denied. Reminder still fires within a Doze maintenance window (may be delayed several minutes — this is expected without exact-alarm grant).

## 3 — Places / geofences

- [ ] Add a place with a 200 m radius. Grant location "Allow all the time".
- [ ] Use Android Studio → **Extended controls → Location** to teleport into and out of the radius. Enter/exit notifications appear.
- [ ] Kill the app. Repeat teleport. Notifications still appear (OS holds the fence via `GeofencingClient`).

## 4 — Notification Intelligence

- [ ] Enable Notification Access.
- [ ] Send yourself a WhatsApp message from another device.
- [ ] `/notify` inbox shows the event.
- [ ] Create a rule matching the message; a matching MinDrop reminder is scheduled.

## 5 — Deliverable log

Attach to release notes:

- `adb shell dumpsys alarm | grep in.mindrop.app` — shows persisted alarms.
- `adb shell dumpsys notification_listeners` — confirms our service is bound.
- `adb shell cmd package list packages -e in.mindrop.app` — confirms install.

## Known Android limitations

- OEM battery managers (Xiaomi, Oppo, Vivo, Realme, Huawei) may still kill background work. Battery-opt allow-list helps; per-OEM Autostart pages remain user-driven.
- `SCHEDULE_EXACT_ALARM` on Android 14 is auto-denied for non-calendar/alarm apps at install; user must toggle it manually. We fall back to `setAndAllowWhileIdle` (~±10 min accuracy).
- `ACCESS_BACKGROUND_LOCATION` on Android 11+ cannot be granted from a dialog — must be granted in Settings ("Allow all the time"). We deep-link there.
- `NotificationListenerService` requires user to enable in Settings; there is no runtime API.
- Play Store: prominent disclosure screen for background location + a demo video are required at review time.
