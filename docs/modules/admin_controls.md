# Module: Admin Dashboard Controls

## 1. Overview
Coordinates platform overview charts, user controls, plan modifications, and diagnostics.

## 2. Dependencies
* `src/components/admin/`
* `src/lib/admin/`

## 3. Rules & Gotchas
* Verify user has admin permissions on the Supabase metadata layer before displaying views or allowing edits.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-12 12:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix backup.ts to include ALL localStorage keys - add gmd:, mindrop.alarm., mindrop.theme., mindrop.appearance., mindrop.book., mindrop.dashboard., mindrop.cloud., mindrop.install_country, mindrop.tier., mindrop.countryThemes., mindrop.admin., mindrop.localMigration., mindrop.snooze., mindrop.summary., and memoryos.tour. prefixes to backup include list'
