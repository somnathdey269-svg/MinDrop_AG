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
