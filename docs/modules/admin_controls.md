# Module: Admin Dashboard Controls

## 1. Overview
Coordinates platform overview charts, user controls, plan modifications, and diagnostics.

## 2. Dependencies
* `src/components/admin/`
* `src/lib/admin/`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Verify user has admin permissions on the Supabase metadata layer before displaying views or allowing edits.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-12 12:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix backup.ts to include ALL localStorage keys - add gmd:, mindrop.alarm., mindrop.theme., mindrop.appearance., mindrop.book., mindrop.dashboard., mindrop.cloud., mindrop.install_country, mindrop.tier., mindrop.countryThemes., mindrop.admin., mindrop.localMigration., mindrop.snooze., mindrop.summary., and memoryos.tour. prefixes to backup include list'
- **2026-07-12 12:45:22** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-19 00:45:29** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign onboarding splash screen in src/routes/splash.tsx with crisp, engaging copy and premium framer-motion micro-animations for all slide visuals (logo, later, notify, places, privacy, quote) and sequential text entrance animations.'
- **2026-07-19 01:26:07** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Revamp the public marketing website to Path A (Modern Product Landing Page) by making src/routes/index.tsx, notify-feature.tsx, places-feature.tsx, pricing.tsx static React pages instead of database CMS pages. Add a new static route later-feature.tsx for Later module details, and update links in MarketingLayout.tsx. Make the content crisp, modern, explaining later alarms, notify rule filters, places geofencing, memory recall, and weekly summaries. Ensure fully responsive layout for all screens.'
- **2026-07-19 02:42:52** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix mobile layout overlaps in index.tsx. Reposition Next Card and Show Me controls below the card stack on mobile viewports. Apply responsive scaling for cards and clean up footer overlaps.'
- **2026-07-20 16:04:58** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Convert all 4 feature pages to full-page fade-based presentation layout with dot navigation, wheel controls, and touch support'
