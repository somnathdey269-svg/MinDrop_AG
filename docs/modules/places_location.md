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
- **2026-07-21 23:51:20** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Replace old inline m logo header across all feature subpages (notify-feature, later-feature, places-feature, pricing, faq, terms, privacy, settings-feature) with animated MinDropHeaderLogo component'
- **2026-07-22 01:15:34** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 route generation for new pages, set 8 cards with INDEX as card 1, Chapters 01-06 in middle, THE CLOSURE as last card, and update layout design to match notify and places feature pages'
- **2026-07-22 01:22:34** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Expand interactive story pages to 5-6 slides each, replace Back to Deck with motivated Next Chapter redirects, and add super attractive view transitions'
- **2026-07-23 12:47:33** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Replace top/bottom UP/DOWN bars with an attractive subtle bottom-right floating navigation dock and full-screen slide layout'
- **2026-07-26 11:35:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Replace all 'Explore Chapter X' button labels with interesting, single-line motivational action text without chapter numbers.'
- **2026-07-26 13:03:48** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 4 bugs: (1) Chapter 1 about.tsx: on second-last slide (SlideSovereignty, index 4) scrolling down jumps to first page instead of last slide - investigate and fix the scroll/wheel event handler; (2) Chapter 3 future-feature.tsx: SlideContextSweeps (slide 5, index 4) has SlidersHorizontal which is NOT imported causing a crash/error when navigating to slide 4+ - fix by adding the missing import; (3) Chapter 4 places-feature.tsx: SlideRadiusDemo (slide 4, index 3) has interactive range slider and buttons that steal scroll events causing the slide navigation to jump to page 1 - fix by preventing interactive elements from interfering; (4) Closure vision.tsx: currently has 2 tabs (vision + pricing) accessible from the deck. User wants pricing to NOT be a standalone separate tab/card in the deck but instead be ONLY accessible from within the vision/closure flow as an embedded slide (pricing page content already links from vision slide 5). Remove pricing from DECK_CARDS array in ShowcaseCardData.tsx and embed pricing info as a final motivational slide inside vision.tsx'
- **2026-07-26 13:55:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix persistent scroll navigation bugs in about.tsx (Chapter 1), future-feature.tsx (Chapter 3), places-feature.tsx (Chapter 4): Replace the current wheel handler with a robust accumulated delta approach (accumulate wheel deltas, fire only when abs(accumulated) > 150, then lock for 800ms) that eliminates macOS trackpad inertia issues. Also: (1) Restore pricing card to DECK_CARDS in ShowcaseCardData.tsx - it was incorrectly removed. (2) Fix vision.tsx Closure last slide (SlideCloser) - the main CTA button/pill should link to /pricing not /download. The current SlideValuePricing (slide 5) should be removed since user did not request it - instead vision.tsx should have exactly the same slides as before (5 slides max) where the LAST slide has a button linking to /pricing. (3) Pricing.tsx last slide (SlideCloser) - the Download MinDrop button should prominently link to /download with the text Get App.'
- **2026-07-26 16:19:11** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix scroll reset issue across ALL 8 marketing route files (notify-feature.tsx, later-feature.tsx, privacy-feature.tsx, about.tsx, places-feature.tsx, future-feature.tsx, vision.tsx, pricing.tsx): (1) Update notify-feature.tsx, later-feature.tsx, and privacy-feature.tsx which were missing the wheelAccum scroll logic and interactive element event propagation stops. (2) Clamp wheelAccum to 0 when at boundaries (index 0 scrolling up or index TOTAL-1 scrolling down) to prevent stale accumulated deltas from causing sudden slide 0 resets. (3) Ensure e.preventDefault() is called unconditionally on all wheel and touchmove events across all 8 routes to block native browser overscroll/pull-to-refresh resets.'
- **2026-07-26 16:24:39** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix touch and wheel momentum desynchronization bugs across all 8 route files (about.tsx, notify-feature.tsx, places-feature.tsx, later-feature.tsx, future-feature.tsx, privacy-feature.tsx, vision.tsx, pricing.tsx): (1) In onTouchEnd and onTouchStart, always clear touchStartY.current = null immediately before returning on animation lock, eliminating stale touch coordinates that caused backwards slide jumps to slide 0. (2) Add cooldownUntil timestamp lock to wheelHandler to absorb post-animation trackpad momentum rebounds. (3) Ensure boundary conditions on index 0 and index TOTAL-1 strictly prevent unwanted resets.'
- **2026-07-26 16:33:15** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Refactor all 8 marketing route files (about.tsx, notify-feature.tsx, places-feature.tsx, later-feature.tsx, future-feature.tsx, privacy-feature.tsx, vision.tsx, pricing.tsx) to use Native CSS Scroll Snap (scroll-snap-type: y mandatory, scroll-snap-align: start) instead of custom JS wheel/touch event listeners. Hides scrollbars with CSS and relies on browser-native smooth snap navigation.'
- **2026-07-26 16:53:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: '1. Fix route navigation scroll reset issue across all detail views (about, notify-feature, places-feature, later-feature, future-feature, privacy-feature, vision, pricing, terms, privacy, download) so navigating between chapters always resets scrollTop to 0 and current slide to 0 (1st slide). 2. Implement Option 1 (3D Card Stack Overlap Effect) with card depth shadows, perspective scaling, and smooth stacked transitions across all marketing detail pages.'
- **2026-07-26 16:58:44** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: '1. Bulletproof scroll reset on route navigation: Add useLayoutEffect + requestAnimationFrame + setTimeout(0) scroll reset to 0 to all 11 detail routes and add resetScroll={true} to all Link components to guarantee 100% opening on slide 01. 2. Ultra-Attractive Visual Animations: Enhance slide presentation with 3D floating perspective cards (perspective: 1200px, rotateX: 8deg -> 0deg, scale: 0.90 -> 1.0), animated ambient gradient background glows, glassmorphism border highlights, and vibrant drop shadows across desktop and mobile.'
- **2026-07-26 22:16:37** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Develop the Get App / Download page in the exact same interactive story/presentation pattern as all other marketing feature pages (like about, places-feature, settings-feature), complete with full header navigation, slide dots, prev/next controls, keyboard navigation, animated icons, interactive Android download status, and MobileFeatureDock integration.'
