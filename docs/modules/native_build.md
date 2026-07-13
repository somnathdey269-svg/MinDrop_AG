# Module: Native Android & iOS Build Configurations

## 1. Overview
Coordinates platform compiles, package manifests, podfiles, and build automation gradle scripts.

## 2. Dependencies
* `@capacitor/cli`
* Android Studio tools / Xcode tools

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Ensure gradle configurations map correctly to the active Capacitor version target.
* Ensure code packages are optimized.

## 4. Version & Modification Ledger
- **2026-07-11 22:15:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-11 23:01:34** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix isNative App detection race condition to ensure splash screen shows first on mobile launch'
- **2026-07-11 23:02:54** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-11 23:03:04** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Commit isNative fix to ensure correct splash screen load on native platform launch'
- **2026-07-11 23:09:41** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implement useEffect-based native app splash redirect on index page to resolve native bridge race condition'
- **2026-07-11 23:11:26** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Commit IndexComponent useEffect redirect fix to guarantee native device splash loading'
- **2026-07-12 14:42:55** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Enhance backup export/import flow with native share support, RFC 4180 parsing, and consolidated paid settings UI'
- **2026-07-13 01:12:18** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented dynamic notification rules matching engine, compound conditions builder (AND/OR/NOT, OTP, Transactions, Links), and interactive rule set UI.'
- **2026-07-13 11:30:20** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Implemented missing AlarmsBridge plugin methods, native reconciliation logs, and resolved duplicate ring on launch.'
