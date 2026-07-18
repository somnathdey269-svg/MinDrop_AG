# Module: Payments & Subscription Limits

Depends On: database_client.md

## 1. Overview
Manages pricing structures, active user limits, stripe/payment gateways, and limit checks.

## 2. Dependencies
* `src/lib/payments.functions.ts`
* `src/lib/limits.functions.ts`
* Supabase profiles/plans tables

## 3. Rules & Gotchas
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
