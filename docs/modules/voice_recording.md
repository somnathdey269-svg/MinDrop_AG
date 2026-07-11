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
