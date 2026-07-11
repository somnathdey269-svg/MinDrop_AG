# Module: Native Android & iOS Build Configurations

## 1. Overview
Coordinates platform compiles, package manifests, podfiles, and build automation gradle scripts.

## 2. Dependencies
* `@capacitor/cli`
* Android Studio tools / Xcode tools

## 3. Rules & Gotchas
* Ensure gradle configurations map correctly to the active Capacitor version target.
* Ensure code packages are optimized.

## 4. Version & Modification Ledger
- **2026-07-11 22:15:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-11 23:01:34** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fix isNative App detection race condition to ensure splash screen shows first on mobile launch'
