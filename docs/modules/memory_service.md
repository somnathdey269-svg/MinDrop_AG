# Module: Memory Service (MemoryOS)

## 1. Overview
Coordinates user memory storage, voice backup, and cloud synchronizations.

## 2. Dependencies
* `src/components/memory/`
* `src/lib/memoryos/`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Ensure audio binary uploads are validated.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-12 11:06:25** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Remove memory packs privacy and what.s new section. Also the other boxes color should be divided into india color flag color irrespective of main color being different fro different tabs'
- **2026-07-12 12:44:22** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix backup.ts to include ALL localStorage keys - add gmd:, mindrop.alarm., mindrop.theme., mindrop.appearance., mindrop.book., mindrop.dashboard., mindrop.cloud., mindrop.install_country, mindrop.tier., mindrop.countryThemes., mindrop.admin., mindrop.localMigration., mindrop.snooze., mindrop.summary., and memoryos.tour. prefixes to backup include list'
- **2026-07-12 12:45:22** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-13 22:09:57** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed snooze immediately refiring and native stopService cleanup.'
- **2026-07-14 14:56:38** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Removed cloud memory database sync mirroring.'
