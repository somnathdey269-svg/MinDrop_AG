# Module: Memory Service (MemoryOS)

## 1. Overview
Coordinates user memory storage, voice backup, and cloud synchronizations.

## 2. Dependencies
* `src/components/memory/`
* `src/lib/memoryos/`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Ensure audio binary uploads are validated.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-12 11:06:25** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Remove memory packs privacy and what.s new section. Also the other boxes color should be divided into india color flag color irrespective of main color being different fro different tabs'
- **2026-07-12 12:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix backup.ts to include ALL localStorage keys - add gmd:, mindrop.alarm., mindrop.theme., mindrop.appearance., mindrop.book., mindrop.dashboard., mindrop.cloud., mindrop.install_country, mindrop.tier., mindrop.countryThemes., mindrop.admin., mindrop.localMigration., mindrop.snooze., mindrop.summary., and memoryos.tour. prefixes to backup include list'
- **2026-07-12 12:45:22** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-13 22:09:57** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed snooze immediately refiring and native stopService cleanup.'
- **2026-07-14 14:56:38** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Removed cloud memory database sync mirroring.'
- **2026-07-14 17:38:57** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed foreground audio service background stop failures and implemented missing native alarm reconciliation.'
- **2026-07-14 20:03:41** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix two critical alarm issues: 1) When alarm is ringing and user opens the app, the MinDrop foreground service notification (with Stop/5m/30m buttons) stays visible alongside the app alarm dialog. It must be dismissed when the app opens. 2) When a new WhatsApp message arrives from the same contact who already triggered an alarm (which the user has not read yet), the alarm fires again because the notification history still contains the keyword. Need an active-alarm registry: once a rule fires an alarm for a contact/package combination, record that key in SharedPreferences. On next onNotificationPosted from same package+conversation, skip triggering if that alarm is still active. Only clear the registry when user clicks Stop (not Snooze).'
- **2026-07-15 19:23:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Set android:allowBackup=false in AndroidManifest.xml so uninstalling the app fully wipes all app data and reinstall starts fresh. Also clean up backup.ts INCLUDE_PREFIXES to exclude operational/ephemeral keys: mindrop.snooze. (paywall snooze daily counts - runtime state), mindrop.drive. (last backup timestamp - device-specific), mindrop.countryThemes. (cache that auto-regenerates). Only user-created data (memories, rules, places, alarms, appearance, theme overrides) should be in backup.'
