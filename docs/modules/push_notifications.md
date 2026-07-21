# Module: Push Notifications

## 1. Overview
Manages app push notifications, tokens registration, and Firebase messaging integration.

## 2. Dependencies
* `src/components/notify/`
* `src/lib/notify/`
* `@capacitor-firebase/messaging`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Push tokens must be registered inside Supabase profiles securely.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-11 22:35:06** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Configure the push notifications tokens registration logic'
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
- **2026-07-12 10:49:43** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'why notify is marked as black instead of green which is its main color, pls rectify the same from root cause'
- **2026-07-13 00:48:00** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesigned notification list cards and upgraded full-content preview details layout.'
- **2026-07-13 00:50:36** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Converted notification card action buttons to side-by-side icon-only layout to reduce card size.'
- **2026-07-13 01:12:18** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented dynamic notification rules matching engine, compound conditions builder (AND/OR/NOT, OTP, Transactions, Links), and interactive rule set UI.'
- **2026-07-13 01:20:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Removed microphone permission JIT check from notification rule setup flow.'
- **2026-07-13 18:48:05** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Resolved duplicate notifications in inbox and native buffer.'
- **2026-07-14 13:10:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed alarm notification dismissal and mapping order bugs.'
- **2026-07-14 15:03:35** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Restored native notification dismissal on alarm cancel.'
- **2026-07-14 20:03:41** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix two critical alarm issues: 1) When alarm is ringing and user opens the app, the MinDrop foreground service notification (with Stop/5m/30m buttons) stays visible alongside the app alarm dialog. It must be dismissed when the app opens. 2) When a new WhatsApp message arrives from the same contact who already triggered an alarm (which the user has not read yet), the alarm fires again because the notification history still contains the keyword. Need an active-alarm registry: once a rule fires an alarm for a contact/package combination, record that key in SharedPreferences. On next onNotificationPosted from same package+conversation, skip triggering if that alarm is still active. Only clear the registry when user clicks Stop (not Snooze).'
- **2026-07-15 14:59:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 4 alarm/notification concerns: (1) Alarm auto-stops after 30 seconds if user doesnt interact. (2) Close the once vs everytime loop - frequency field must be passed to native snapshot and native side must honor it - once means permanently retire after firing, always means keep alive. (3) If user stops alarm for a once-rule, it should never alarm again - native snapshot must re-sync after archiving. (4) Filter out group summary notifications in MindDropNotificationListener - only process individual atomic notifications to prevent duplicate alarms.'
- **2026-07-17 20:25:06** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'ensure a notification with Stop/Snooze action buttons is shown when a snoozed alarm triggers, identical to the first alarm ring'
- **2026-07-19 00:45:29** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign onboarding splash screen in src/routes/splash.tsx with crisp, engaging copy and premium framer-motion micro-animations for all slide visuals (logo, later, notify, places, privacy, quote) and sequential text entrance animations.'
- **2026-07-19 01:26:07** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Revamp the public marketing website to Path A (Modern Product Landing Page) by making src/routes/index.tsx, notify-feature.tsx, places-feature.tsx, pricing.tsx static React pages instead of database CMS pages. Add a new static route later-feature.tsx for Later module details, and update links in MarketingLayout.tsx. Make the content crisp, modern, explaining later alarms, notify rule filters, places geofencing, memory recall, and weekly summaries. Ensure fully responsive layout for all screens.'
- **2026-07-19 02:12:15** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Rebuild the website to exactly match Google Web Showcase (thewebshowcase.withgoogle.com). Homepage index.tsx must render a full-screen 3D card deck with Next card, Show me, and About overlays. Subpages later-feature, notify-feature, places-feature, pricing, faq, download must render as clean full-screen detailed cards with close X buttons.'
- **2026-07-19 02:20:52** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Add scroll wheel (trackpad) navigation and Grid View/Deck View toggle pill in index.tsx. Ensure subpage close buttons in later-feature, notify-feature, places-feature, pricing, faq, download preserve the previous hash mode.'
- **2026-07-19 12:16:03** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push finalized aligned card layouts and copy updates'
- **2026-07-19 17:36:36** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push View Transitions for card detail modals'
- **2026-07-19 17:40:47** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push customized CSS View Transitions timing and easing tweaks'
- **2026-07-19 18:12:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push card size and font adjustments for spacing optimization'
- **2026-07-19 18:25:06** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push card mobile width to 340px and size-up to text-3xl font'
- **2026-07-19 20:21:15** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push card header to 1 line and description to 3 lines clamp tweaks'
- **2026-07-20 15:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Storytelling rewrite of notify-feature, places-feature, settings-feature as full scrollable immersive pages with unique personalities, plain English, 95% responsive layout'
- **2026-07-21 22:19:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 card navigation error by updating ShowcaseCardData.tsx target routes to /later-feature, /notify-feature, and /places-feature, and creating route aliases in src/routes'
- **2026-07-21 23:06:24** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Push user updated pricing description in ShowcaseCardData.tsx to git main'
- **2026-07-21 23:20:08** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Update ShowcaseCardData titles to 2 words (Smart Notification, Location Reminder, Looping Alarm, Simple Pricing, Ask Me), fix 1-line graphic sub-pills, add vertical spacing between chapter tag and graphic, and remove Open Card footer/icon from grid view in DesktopShowcase.tsx'
- **2026-07-21 23:51:20** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Replace old inline m logo header across all feature subpages (notify-feature, later-feature, places-feature, pricing, faq, terms, privacy, settings-feature) with animated MinDropHeaderLogo component'
- **2026-07-22 01:15:34** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 route generation for new pages, set 8 cards with INDEX as card 1, Chapters 01-06 in middle, THE CLOSURE as last card, and update layout design to match notify and places feature pages'
