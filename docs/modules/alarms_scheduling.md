# Module: Alarms & Scheduling

## 1. Overview
Coordinates local alarm configurations, push notifications, and task triggers in the background.

## 2. Dependencies
* `@capacitor/local-notifications`
* Android AlarmManager bridges

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Ensure alarm notifications have unique channel IDs.
* Check that system alarms check permissions before firing intents.

## 4. Version & Modification Ledger
- **2026-07-11 22:15:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-12 09:42:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'In setting-permission i want toggle of permission rather than grant/granted text...

Also ensure that the user will be asked to provide the permission if they have not given for it

1. Notification: When user create remainder in later, set rules on particular notification in notify & places (If notification selected while setting)
2. Exact Alarms: same as notification (When user select alarm when creating remainder for later of set rules for notify or places)
3. Ignore Battery Optimsisation: When user set their first remainder in rule or link notification in notify or save their first place)
4. Location: when user set their first place
5. Notification Access: Same as 3
6. Microphone: Same as 3

User can always directly go to setting-permission and set the same anytime irrespective of whether they set the remainder or set rules or set their places/lnk notification for frist time

Can you check the existing rules and rectify the same and at the end of summary give me tabel of how if worked earlier and after changes

Also ensure all my 20 agent should work properly and the MD created for existing work is checked and ensure its updated after the changes (if any) and at th summary you include this also'
- **2026-07-12 09:49:24** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-12 12:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix backup.ts to include ALL localStorage keys - add gmd:, mindrop.alarm., mindrop.theme., mindrop.appearance., mindrop.book., mindrop.dashboard., mindrop.cloud., mindrop.install_country, mindrop.tier., mindrop.countryThemes., mindrop.admin., mindrop.localMigration., mindrop.snooze., mindrop.summary., and memoryos.tour. prefixes to backup include list'
- **2026-07-13 11:30:20** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented missing AlarmsBridge plugin methods, native reconciliation logs, and resolved duplicate ring on launch.'
- **2026-07-13 17:58:39** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Resolved alarm reconciler startup race condition.'
- **2026-07-13 21:55:10** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented native getActiveAlarm and getStoppedAlarms reconciler.'
- **2026-07-14 12:45:09** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented native active/stopped alarm tracking reconciler.'
- **2026-07-14 13:10:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed alarm notification dismissal and mapping order bugs.'
- **2026-07-14 15:03:35** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Restored native notification dismissal on alarm cancel.'
- **2026-07-14 15:15:30** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed sync loop race condition causing alarm refires.'
- **2026-07-14 17:04:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed messaging group conversation unread history alarm re-triggering.'
- **2026-07-14 17:38:57** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed foreground audio service background stop failures and implemented missing native alarm reconciliation.'
- **2026-07-14 20:03:41** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix two critical alarm issues: 1) When alarm is ringing and user opens the app, the MinDrop foreground service notification (with Stop/5m/30m buttons) stays visible alongside the app alarm dialog. It must be dismissed when the app opens. 2) When a new WhatsApp message arrives from the same contact who already triggered an alarm (which the user has not read yet), the alarm fires again because the notification history still contains the keyword. Need an active-alarm registry: once a rule fires an alarm for a contact/package combination, record that key in SharedPreferences. On next onNotificationPosted from same package+conversation, skip triggering if that alarm is still active. Only clear the registry when user clicks Stop (not Snooze).'
- **2026-07-15 14:59:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 4 alarm/notification concerns: (1) Alarm auto-stops after 30 seconds if user doesnt interact. (2) Close the once vs everytime loop - frequency field must be passed to native snapshot and native side must honor it - once means permanently retire after firing, always means keep alive. (3) If user stops alarm for a once-rule, it should never alarm again - native snapshot must re-sync after archiving. (4) Filter out group summary notifications in MindDropNotificationListener - only process individual atomic notifications to prevent duplicate alarms.'
- **2026-07-15 19:23:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Set android:allowBackup=false in AndroidManifest.xml so uninstalling the app fully wipes all app data and reinstall starts fresh. Also clean up backup.ts INCLUDE_PREFIXES to exclude operational/ephemeral keys: mindrop.snooze. (paywall snooze daily counts - runtime state), mindrop.drive. (last backup timestamp - device-specific), mindrop.countryThemes. (cache that auto-regenerates). Only user-created data (memories, rules, places, alarms, appearance, theme overrides) should be in backup.'
- **2026-07-17 13:07:08** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Great the same is working for 1st alarm But snooze has stopped now...i want same rule which you rectified for 1st time alarm is applicable to snooze also. Ensure snooze should work when user set for it'
- **2026-07-17 20:25:06** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'ensure a notification with Stop/Snooze action buttons is shown when a snoozed alarm triggers, identical to the first alarm ring'
- **2026-07-19 01:26:07** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Revamp the public marketing website to Path A (Modern Product Landing Page) by making src/routes/index.tsx, notify-feature.tsx, places-feature.tsx, pricing.tsx static React pages instead of database CMS pages. Add a new static route later-feature.tsx for Later module details, and update links in MarketingLayout.tsx. Make the content crisp, modern, explaining later alarms, notify rule filters, places geofencing, memory recall, and weekly summaries. Ensure fully responsive layout for all screens.'
- **2026-07-19 03:02:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Create live animations inside the blank space of our cards on the homepage deck. Add LaterAlarmIllustration, SmartFiltersIllustration, PlacesMappingIllustration, PricingTierIllustration, and FAQHelpIllustration with loop animations using Framer Motion inside index.tsx.'
- **2026-07-19 03:09:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Add live animations inside the catalog grid cards on index.tsx. Increase grid card height to h-[340px] and embed LaterAlarmIllustration, SmartFiltersIllustration, etc. inside the grid loop.'
- **2026-07-20 15:03:50** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign later-feature detail page with interactive alarm simulator and flow animations'
- **2026-07-20 15:13:45** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Rebuild later-feature as immersive storytelling landing page with scroll narrative, interactive alarm playground, and real-life scenarios'
- **2026-07-21 22:45:36** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Reorder DECK_CARDS so Smart Filters is Chapter 01/05, Places & Sweeps is Chapter 02/05, and Looping Alarms is Chapter 03/05 in ShowcaseCardData.tsx'
- **2026-07-21 23:20:08** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Update ShowcaseCardData titles to 2 words (Smart Notification, Location Reminder, Looping Alarm, Simple Pricing, Ask Me), fix 1-line graphic sub-pills, add vertical spacing between chapter tag and graphic, and remove Open Card footer/icon from grid view in DesktopShowcase.tsx'
