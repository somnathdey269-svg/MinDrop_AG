# Module: Places & Geolocation

## 1. Overview
Handles user locations, geo-fences, and maps integrations.

## 2. Dependencies
* `src/components/places/`
* `src/lib/places/`
* `@capacitor/geolocation`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Geolocation coordinates must fall back to default region if GPS is unavailable.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
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
- **2026-07-12 10:31:54** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'You chnaged the position of the pill and move it words, pls dont do that, keep it at original place only'
- **2026-07-15 19:23:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Set android:allowBackup=false in AndroidManifest.xml so uninstalling the app fully wipes all app data and reinstall starts fresh. Also clean up backup.ts INCLUDE_PREFIXES to exclude operational/ephemeral keys: mindrop.snooze. (paywall snooze daily counts - runtime state), mindrop.drive. (last backup timestamp - device-specific), mindrop.countryThemes. (cache that auto-regenerates). Only user-created data (memories, rules, places, alarms, appearance, theme overrides) should be in backup.'
- **2026-07-19 00:45:29** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign onboarding splash screen in src/routes/splash.tsx with crisp, engaging copy and premium framer-motion micro-animations for all slide visuals (logo, later, notify, places, privacy, quote) and sequential text entrance animations.'
- **2026-07-19 01:26:07** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Revamp the public marketing website to Path A (Modern Product Landing Page) by making src/routes/index.tsx, notify-feature.tsx, places-feature.tsx, pricing.tsx static React pages instead of database CMS pages. Add a new static route later-feature.tsx for Later module details, and update links in MarketingLayout.tsx. Make the content crisp, modern, explaining later alarms, notify rule filters, places geofencing, memory recall, and weekly summaries. Ensure fully responsive layout for all screens.'
- **2026-07-19 02:12:15** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Rebuild the website to exactly match Google Web Showcase (thewebshowcase.withgoogle.com). Homepage index.tsx must render a full-screen 3D card deck with Next card, Show me, and About overlays. Subpages later-feature, notify-feature, places-feature, pricing, faq, download must render as clean full-screen detailed cards with close X buttons.'
- **2026-07-19 02:20:52** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Add scroll wheel (trackpad) navigation and Grid View/Deck View toggle pill in index.tsx. Ensure subpage close buttons in later-feature, notify-feature, places-feature, pricing, faq, download preserve the previous hash mode.'
- **2026-07-19 03:02:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Create live animations inside the blank space of our cards on the homepage deck. Add LaterAlarmIllustration, SmartFiltersIllustration, PlacesMappingIllustration, PricingTierIllustration, and FAQHelpIllustration with loop animations using Framer Motion inside index.tsx.'
- **2026-07-19 20:34:16** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Shorten copy of smart filters and location reminders cards to fit in exactly 4 lines'
- **2026-07-20 15:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Storytelling rewrite of notify-feature, places-feature, settings-feature as full scrollable immersive pages with unique personalities, plain English, 95% responsive layout'
- **2026-07-21 14:37:23** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Enlarge mobile typography to text-3xl and text-lg, disable automatic browser location permission prompts on website view, and verify clean routing'
- **2026-07-21 20:36:35** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Place graphic on top and content in lower section across web deck, mobile deck, and grid views, ensuring graphics are uncut'
- **2026-07-21 22:19:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 card navigation error by updating ShowcaseCardData.tsx target routes to /later-feature, /notify-feature, and /places-feature, and creating route aliases in src/routes'
- **2026-07-21 22:45:36** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Reorder DECK_CARDS so Smart Filters is Chapter 01/05, Places & Sweeps is Chapter 02/05, and Looping Alarms is Chapter 03/05 in ShowcaseCardData.tsx'
- **2026-07-21 23:20:08** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Update ShowcaseCardData titles to 2 words (Smart Notification, Location Reminder, Looping Alarm, Simple Pricing, Ask Me), fix 1-line graphic sub-pills, add vertical spacing between chapter tag and graphic, and remove Open Card footer/icon from grid view in DesktopShowcase.tsx'
- **2026-07-21 23:26:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Remove orange m logo icon from header and replace with highlighted animated MinDrop wordmark (M and D in orange) in DesktopShowcase.tsx and MobileShowcase.tsx'
