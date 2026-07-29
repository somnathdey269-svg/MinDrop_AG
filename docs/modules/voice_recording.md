# Module: Voice Recording Service

## 1. Overview
Handles voice and audio recordings via native plugins.

## 2. Dependencies
* `capacitor-voice-recorder` plugin
* Android Audio recording permission configurations

## 3. Rules & Gotchas
* Always check and request runtime mic permissions using the Capacitor Permissions API before starting recording streams.
* Verify storage directories are clean after uploads.

## 4. Version & Modification Ledger
- **2026-07-11 22:15:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-19 00:45:29** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign onboarding splash screen in src/routes/splash.tsx with crisp, engaging copy and premium framer-motion micro-animations for all slide visuals (logo, later, notify, places, privacy, quote) and sequential text entrance animations.'
- **2026-07-19 01:26:07** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Revamp the public marketing website to Path A (Modern Product Landing Page) by making src/routes/index.tsx, notify-feature.tsx, places-feature.tsx, pricing.tsx static React pages instead of database CMS pages. Add a new static route later-feature.tsx for Later module details, and update links in MarketingLayout.tsx. Make the content crisp, modern, explaining later alarms, notify rule filters, places geofencing, memory recall, and weekly summaries. Ensure fully responsive layout for all screens.'
- **2026-07-21 22:19:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 card navigation error by updating ShowcaseCardData.tsx target routes to /later-feature, /notify-feature, and /places-feature, and creating route aliases in src/routes'
- **2026-07-26 16:58:44** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: '1. Bulletproof scroll reset on route navigation: Add useLayoutEffect + requestAnimationFrame + setTimeout(0) scroll reset to 0 to all 11 detail routes and add resetScroll={true} to all Link components to guarantee 100% opening on slide 01. 2. Ultra-Attractive Visual Animations: Enhance slide presentation with 3D floating perspective cards (perspective: 1200px, rotateX: 8deg -> 0deg, scale: 0.90 -> 1.0), animated ambient gradient background glows, glassmorphism border highlights, and vibrant drop shadows across desktop and mobile.'
- **2026-07-27 00:31:51** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Update public route components (pricing.tsx, about.tsx, faq.tsx, download.tsx) so when custom CMS blocks are published (hasBlocks is true), the page renders the published CMS blocks as its primary content view.'
- **2026-07-27 00:43:09** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement structured section text CMS editing for Pricing page while preserving 100% of original custom slide deck designs and interactive components.'
- **2026-07-29 19:38:47** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement updated card layout primitive with side-by-side Icon (20% w) and Header (72.5% w) in Slot 4 (20% h), Pill in Slot 2 (15% h), Description in Slot 6 (55% h), with 2.5% padding margins and gaps across all Deck and Grid views in Desktop and Mobile components'
