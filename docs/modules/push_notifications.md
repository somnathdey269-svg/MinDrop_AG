# Module: Push Notifications

## 1. Overview
Manages app push notifications, tokens registration, and Firebase messaging integration.

## 2. Dependencies
* `src/components/notify/`
* `src/lib/notify/`
* `@capacitor-firebase/messaging`

## 3. Rules & Gotchas
* Rule: Under Capacitor development, always configure VITE_WEB_ORIGIN and VITE_API_ORIGIN in .env to map to http://localhost:8080.
* Push tokens must be registered inside Supabase profiles securely.

## 4. Version & Modification Ledger
- **2026-07-11 22:30:00** | System Initializer
  * **Change**: Initial documentation setup.
- **2026-07-11 22:35:06** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Configure the push notifications tokens registration logic'
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
- **2026-07-12 10:49:43** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'why notify is marked as black instead of green which is its main color, pls rectify the same from root cause'
- **2026-07-13 00:48:00** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Redesigned notification list cards and upgraded full-content preview details layout.'
- **2026-07-13 00:50:36** | Changed by: 20-Agent Pipeline
  * **Change**: Executed requirements: 'Converted notification card action buttons to side-by-side icon-only layout to reduce card size.'
