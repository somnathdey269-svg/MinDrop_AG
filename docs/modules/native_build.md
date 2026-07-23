# Module: Native Android & iOS Build Configurations

## 1. Overview
Coordinates platform compiles, package manifests, podfiles, and build automation gradle scripts.

## 2. Dependencies
* `@capacitor/cli`
* Android Studio tools / Xcode tools

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Ensure gradle configurations map correctly to the active Capacitor version target.
* Ensure code packages are optimized.

## 4. Version & Modification Ledger
- **2026-07-11 22:15:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-11 23:01:34** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix isNative App detection race condition to ensure splash screen shows first on mobile launch'
- **2026-07-11 23:02:54** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-11 23:03:04** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Commit isNative fix to ensure correct splash screen load on native platform launch'
- **2026-07-11 23:09:41** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement useEffect-based native app splash redirect on index page to resolve native bridge race condition'
- **2026-07-11 23:11:26** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Commit IndexComponent useEffect redirect fix to guarantee native device splash loading'
- **2026-07-12 14:42:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Enhance backup export/import flow with native share support, RFC 4180 parsing, and consolidated paid settings UI'
- **2026-07-13 01:12:18** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented dynamic notification rules matching engine, compound conditions builder (AND/OR/NOT, OTP, Transactions, Links), and interactive rule set UI.'
- **2026-07-13 11:30:20** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented missing AlarmsBridge plugin methods, native reconciliation logs, and resolved duplicate ring on launch.'
- **2026-07-13 18:48:05** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Resolved duplicate notifications in inbox and native buffer.'
- **2026-07-13 21:55:10** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented native getActiveAlarm and getStoppedAlarms reconciler.'
- **2026-07-13 22:09:57** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed snooze immediately refiring and native stopService cleanup.'
- **2026-07-14 12:45:09** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented native active/stopped alarm tracking reconciler.'
- **2026-07-14 15:03:35** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Restored native notification dismissal on alarm cancel.'
- **2026-07-14 17:38:57** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed foreground audio service background stop failures and implemented missing native alarm reconciliation.'
- **2026-07-15 14:59:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 4 alarm/notification concerns: (1) Alarm auto-stops after 30 seconds if user doesnt interact. (2) Close the once vs everytime loop - frequency field must be passed to native snapshot and native side must honor it - once means permanently retire after firing, always means keep alive. (3) If user stops alarm for a once-rule, it should never alarm again - native snapshot must re-sync after archiving. (4) Filter out group summary notifications in MindDropNotificationListener - only process individual atomic notifications to prevent duplicate alarms.'
- **2026-07-15 19:23:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Set android:allowBackup=false in AndroidManifest.xml so uninstalling the app fully wipes all app data and reinstall starts fresh. Also clean up backup.ts INCLUDE_PREFIXES to exclude operational/ephemeral keys: mindrop.snooze. (paywall snooze daily counts - runtime state), mindrop.drive. (last backup timestamp - device-specific), mindrop.countryThemes. (cache that auto-regenerates). Only user-created data (memories, rules, places, alarms, appearance, theme overrides) should be in backup.'
- **2026-07-19 02:12:15** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Rebuild the website to exactly match Google Web Showcase (thewebshowcase.withgoogle.com). Homepage index.tsx must render a full-screen 3D card deck with Next card, Show me, and About overlays. Subpages later-feature, notify-feature, places-feature, pricing, faq, download must render as clean full-screen detailed cards with close X buttons.'
- **2026-07-20 14:44:08** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Gracefully fallback to default settings when database queries throw exceptions during static builds'
- **2026-07-20 15:13:45** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Rebuild later-feature as immersive storytelling landing page with scroll narrative, interactive alarm playground, and real-life scenarios'
- **2026-07-20 17:16:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Correct pricing to yearly subscription, fix upgrade flow layout wrap, and enable native scrolling on legal document slides'
- **2026-07-22 00:53:33** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign /download Get App page into a 2-slide interactive story experience with Android-exclusive comedy dig and motivational Play Store coming soon launch'
- **2026-07-23 16:41:37** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement Option 3 Native Mobile Corner Stepper and left navigation island'
