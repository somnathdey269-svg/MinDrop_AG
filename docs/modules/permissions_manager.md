# Module: Device Permissions Manager

## 1. Overview
Coordinates Android/iOS system level permission checks and alerts (mic, location, files).

## 2. Dependencies
* `src/components/permissions/`
* `src/lib/permissions/`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Request permission dialogs dynamically; never perform operations without active authorization checks.
* The Settings Permissions screen uses visual `Switch` toggles for all permissions. Clicking a row triggers the request sequence if denied/not granted, or opens native settings if already granted (since permissions cannot be programmatically revoked).
* Just-In-Time (JIT) permission prompts queue up sequentially and block actions:
  - **Notification**: Prompted when saving a reminder in Later or rules in Notify/Places if "notification" is chosen as the delivery channel.
  - **Exact Alarms**: Prompted when saving a reminder in Later or rules in Notify/Places if "alarm" is chosen as the delivery channel.
  - **Location**: Prompted when saving the user's first place.
  - **Ignore Battery Optimisation**, **Notification Access**, and **Microphone**: Prompted when the user performs their first configuration action (first reminder, first rule, first linked notification, or first place).

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-12 09:42:19** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'In setting-permission i want toggle of permission rather than grant/granted text...

Also ensure that the user will be asked to provide the permission if they have not given for it

1. Notification: When user create remainder in later, set rules on particular notification in notify & places (If notification selected while setting)
2. Exact Alarms: same as notification (When user select alarm when creating remainder for later of set rules for notify or places)
3. Ignore Battery Optimsisation: When user set their first remainder in rule or link notification in notify or save their first place)
4. Location: when user set their first place
5. Notification Access: Same as 3
6. Microphone: Same as 3

User can always directly go to setting-permission and set the same anytime irrespective of whether they set the remainder or set rules or set their places/lnk notification for frist time

Can you check the existing rules and rectify the same and at the end of summary give me tabel of how if worked earlier and after changes

Also ensure all my 20 agent should work properly and the MD created for existing work is checked and ensure its updated after the changes (if any) and at th summary you include this also'
- **2026-07-12 09:49:24** | Self-Healed Learning Loop
  * **Rule Added**: Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
- **2026-07-12 09:57:23** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'In setting permission it shows 2 out of 4 why? it should be always out of 6 and keep this dynamci if in future i remove or add any new permission it should count the real number'
- **2026-07-12 11:09:08** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Now in setting bring teh app permission first then country selection and then appearance selection. No change in header 2 boxes (Friendof MinDrop and go premium)'
- **2026-07-13 01:20:53** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Removed microphone permission JIT check from notification rule setup flow.'
- **2026-07-13 23:46:44** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Fixed permissions switch initial states and settings latency check.'
