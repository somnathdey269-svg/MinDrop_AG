# Module: Payments & Subscription Limits

Depends On: database_client.md

## 1. Overview
Manages pricing structures, active user limits, stripe/payment gateways, and limit checks.

## 2. Dependencies
* `src/lib/payments.functions.ts`
* `src/lib/limits.functions.ts`
* Supabase profiles/plans tables

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Ensure validation is processed server-side (using server functions) rather than purely client-side to prevent bypasses.

## 4. Version & Modification Ledger
- **2026-07-11 22:15:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-11 22:20:33** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Configure the database connection keys and check the payment subscriptions'
- **2026-07-19 00:45:29** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesign onboarding splash screen in src/routes/splash.tsx with crisp, engaging copy and premium framer-motion micro-animations for all slide visuals (logo, later, notify, places, privacy, quote) and sequential text entrance animations.'
- **2026-07-19 01:26:07** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Revamp the public marketing website to Path A (Modern Product Landing Page) by making src/routes/index.tsx, notify-feature.tsx, places-feature.tsx, pricing.tsx static React pages instead of database CMS pages. Add a new static route later-feature.tsx for Later module details, and update links in MarketingLayout.tsx. Make the content crisp, modern, explaining later alarms, notify rule filters, places geofencing, memory recall, and weekly summaries. Ensure fully responsive layout for all screens.'
- **2026-07-20 17:39:16** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Configure free limits to 3 limits, set default fallback price to 999, expand compliance document content blocks, balance showcase cards grid columns, and fix scroll-up trackpad logic'
- **2026-07-20 17:39:27** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-21 22:19:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix 404 card navigation error by updating ShowcaseCardData.tsx target routes to /later-feature, /notify-feature, and /places-feature, and creating route aliases in src/routes'
- **2026-07-26 23:06:35** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement complete dynamic CMS system: Supabase SQL migration for marketing_pages, CMS types and server functions, dynamic frontend renderers with dynamic typography (H1-H5, font size, color, bold, italic) and adaptive box/grid layouts, Super Admin CMS portal UI under ctrl-vx9k2m7fq3z.cms, and wire all marketing routes with zero-downtime static fallbacks.'
- **2026-07-26 23:24:32** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix TanStack Start server function error response format in adminAuth.functions.ts and ctrl-vx9k2m7fq3z.signin.tsx so error messages render as readable strings instead of {}.'
- **2026-07-27 00:29:47** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Remove updated_by property from saveMarketingPageFn payload in cms.functions.ts to match marketing_pages table schema.'
