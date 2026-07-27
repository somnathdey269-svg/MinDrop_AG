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
- **2026-07-21 22:19:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 card navigation error by updating ShowcaseCardData.tsx target routes to /later-feature, /notify-feature, and /places-feature, and creating route aliases in src/routes'
- **2026-07-23 12:56:21** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Add elevated bottom floating dock footer with Home, Up/Down segment controls, Get App and clean header to detail pages'
- **2026-07-23 13:18:43** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign mobile bottom dock into a sleek dynamic theme-matching floating dock with icon-only up/down controls'
- **2026-07-26 16:58:44** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: '1. Bulletproof scroll reset on route navigation: Add useLayoutEffect + requestAnimationFrame + setTimeout(0) scroll reset to 0 to all 11 detail routes and add resetScroll={true} to all Link components to guarantee 100% opening on slide 01. 2. Ultra-Attractive Visual Animations: Enhance slide presentation with 3D floating perspective cards (perspective: 1200px, rotateX: 8deg -> 0deg, scale: 0.90 -> 1.0), animated ambient gradient background glows, glassmorphism border highlights, and vibrant drop shadows across desktop and mobile.'
- **2026-07-26 22:16:37** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Develop the Get App / Download page in the exact same interactive story/presentation pattern as all other marketing feature pages (like about, places-feature, settings-feature), complete with full header navigation, slide dots, prev/next controls, keyboard navigation, animated icons, interactive Android download status, and MobileFeatureDock integration.'
- **2026-07-26 23:06:35** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement complete dynamic CMS system: Supabase SQL migration for marketing_pages, CMS types and server functions, dynamic frontend renderers with dynamic typography (H1-H5, font size, color, bold, italic) and adaptive box/grid layouts, Super Admin CMS portal UI under ctrl-vx9k2m7fq3z.cms, and wire all marketing routes with zero-downtime static fallbacks.'
- **2026-07-26 23:20:16** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement server-side adminSignInFn server function to bypass browser CORS network errors for super admin sign-in.'
- **2026-07-26 23:24:32** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix TanStack Start server function error response format in adminAuth.functions.ts and ctrl-vx9k2m7fq3z.signin.tsx so error messages render as readable strings instead of {}.'
- **2026-07-26 23:45:59** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign Super Admin Page Builder UI in ctrl-vx9k2m7fq3z.cms.tsx with sleek modern typography toggles, collapsible block cards, split view, and clean visual aesthetics.'
- **2026-07-26 23:49:43** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Pre-populate exact authentic page content for all 16 marketing pages in ctrl-vx9k2m7fq3z.cms.tsx so super admin sees exact real content to edit.'
- **2026-07-27 00:31:51** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Update public route components (pricing.tsx, about.tsx, faq.tsx, download.tsx) so when custom CMS blocks are published (hasBlocks is true), the page renders the published CMS blocks as its primary content view.'
- **2026-07-27 00:43:09** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement structured section text CMS editing for Pricing page while preserving 100% of original custom slide deck designs and interactive components.'
- **2026-07-27 08:24:31** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement clean pricing cards, superadmin plan cadence selection (Yearly / Lifetime / Monthly), and automatic location-based country currency detection with superadmin price management.'
- **2026-07-27 11:46:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Connect 8 Homepage Grid Cards to Super Admin Page Builder CMS with structured card fields and live grid preview.'
- **2026-07-27 15:12:47** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Add exact pixel font size controls in Super Admin CMS for all content across the platform'
