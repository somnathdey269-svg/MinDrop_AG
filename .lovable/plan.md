## Why the map says "unavailable"

`PlacePickerMap` loads Google Maps only if `platform_settings.google_maps_api_key` is filled by a superadmin. On your device that row is empty, so we render the "Map unavailable" card. Meanwhile, the project **already has the Google Maps connector linked**, which exposes a referrer-restricted browser key as `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`. We just never used it.

## What I'll change

### 1. Map — make it work automatically (no admin step)
- `src/components/places/PlacePickerMap.tsx`: prefer `import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`, fall back to the platform key. Include the tracking-id `channel` param. Show a plainer "Map unavailable" only if BOTH are empty.
- `src/components/places/AddressSearchField.tsx`: same fallback, so address search works too.

### 2. Place Rules — add the two missing data points (parity with Notify rules)
Update `src/lib/places/types.ts` `PlaceRule`:
- `delivery?: "alarm" | "notification"` (default `notification`)
- `remindNote?: string` (custom reminder text; falls back to rule.message)

Update `src/components/places/RuleEditorSheet.tsx`:
- Add step **"Delivery"** (Loud alarm vs Silent notification) — same copy/pattern as Notify.
- Add step **"What to remind you?"** free-text field (replaces the current single "message" step being overloaded).
- Reorder steps: Place → Radius → What to remind → Trigger → Delivery → Frequency → Review.
- Swap the bright accent tints (`tint(10)/tint(18)`) for the same subtle ink/canvas neutral palette used in `src/components/notify/RuleEditorSheet.tsx` (soft `bg-card`, `border-ink/10`, muted selected state). Accent is used only for the progress bar and primary CTA.
- Backfill: existing rules migrate to `delivery: "notification"` on read.

### 3. Firing engine — respect delivery, ring loud when asked
`src/lib/places/runtime.ts` `recordFire()` currently only calls `new Notification(...)`. That's why a "loud" place rule would silently pop a heads-up like your WhatsApp rule did before.
- If `rule.delivery === "alarm"`: call `AlarmsBridge.scheduleAlarm({ at: Date.now(), delivery: "alarm", title, body: remindNote || message, extra:{ source:"places", placeId, ruleId } })` so the native `AlarmRingService` triggers a full-screen loud alarm (works when app is backgrounded / killed, same path we just fixed for reminders).
- If `delivery === "notification"` (or undefined): schedule via `AlarmsBridge` with `delivery:"notify"` (native heads-up) instead of the fragile Web Notification API — mirrors the notify engine.
- Web fallback (no `AlarmsBridge`): keep the existing `Notification` for browser preview.
- `mirrorPlaceFireToInbox` continues to write to the Notify inbox using `remindNote || message`.

### 4. Native listener parity (Android)
`native/android/places/GeofenceReceiver.kt` currently posts a notification via the OS. To honor loud mode when the app is killed, extend the JS bridge payload to include `delivery` + `remindNote` per rule, and have the receiver call the same `AlarmRingService` we use for reminders when `delivery == "alarm"`. Same fix pattern as `MindDropNotificationListener.kt` from the WhatsApp rule fix.

### 5. Verification (learned from the reminders + notify misses)
Before I ping you to test I will:
- Confirm delivery-aware firing on the JS path (web + Capacitor foreground) via a `testFireRule` unit-check.
- Confirm the migration doesn't drop old rules (auto-set `delivery = "notification"`).
- Confirm `AlarmsBridge.scheduleAlarm({ at: Date.now(), ... })` on the place path uses the same OVERDUE_GRACE the reminder path already respects.
- Confirm the map renders in the APK by reading the browser key from `import.meta.env` at build time (baked into the bundle, works offline).
- Confirm rescheduling on rule edit does NOT blanket-cancel other native alarms — reuses the reminder scheduler's per-ID tracking pattern.

### Out of scope (call out)
- Superadmin platform key UI still works as an override (untouched).
- No change to Places tabs / History placement — those are already where you asked.

Ready to switch to build mode and apply this?