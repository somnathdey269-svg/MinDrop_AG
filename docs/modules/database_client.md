# Module: Database Client (Supabase)

## 1. Overview
This module handles connections to Supabase, client initialization, and global query configurations.

## 2. Dependencies
* `@supabase/supabase-js`
* `.env` credentials

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Always prefix keys with `VITE_` for client-side bundle access (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
* Ensure `VITE_WEB_ORIGIN` and `VITE_API_ORIGIN` are mapped to `http://localhost:8080` for local android emulator development (using `adb reverse`).
* Always define RLS policies on newly created tables.

## 4. Version & Modification Ledger
- **2026-07-11 21:39:00** | System Initializer
  * **Change**: Standardized client-side connection variables and resolved CORS preflight blocks.
- **2026-07-11 22:20:33** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Configure the database connection keys and check the payment subscriptions'
- **2026-07-11 22:20:41** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-11 23:16:36** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement client-side useEffect redirect with userAgent fallback to prevent hydration mismatch'
- **2026-07-11 23:17:40** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Commit final safe index route client redirect logic with hydration mismatch prevention'
- **2026-07-14 14:56:38** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Removed cloud memory database sync mirroring.'
