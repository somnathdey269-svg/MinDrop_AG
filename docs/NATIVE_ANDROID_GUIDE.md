# MinDrop — Native Android Build Guide (Kotlin)

Complete, self-contained handbook for building the MinDrop Android app in
Android Studio using Kotlin + Jetpack Compose, and wiring it to the existing
Lovable Cloud (Supabase) backend already powering `getmindrop.lovable.app`.

No separate Node backend is needed. Everything the app requires — auth, data,
quotas, payments, push — already exists on the web side and is reused by the
Android app.

---

## Table of contents

1. Architecture and separation of concerns
2. What stays on the website vs what lives in the app
3. Project setup (Android Studio)
4. Backend contract (existing tables + server functions)
5. AndroidManifest — full permission list
6. Auth (Supabase in Kotlin)
7. Data layer (Room cache + Supabase sync + Realtime)
8. Alarm that rings when the app is closed
9. Location rules (geofences)
10. Reading other apps' notifications
11. Push (FCM) — safety net
12. Payments — Cashfree native SDK
13. Dynamic plan limits (anon / free / premium)
14. Deep links and OAuth callback
15. Boot, battery optimization and OEM quirks
16. Offline behaviour
17. Publishing checklist (Play Store + sideload)
18. Things that do NOT work (documented pitfalls)
19. File / class layout reference

---

## 1. Architecture

```
[ Marketing website ]                [ Android app (Kotlin) ]
  getmindrop.lovable.app                  app.getmindrop (APK/AAB)
  - Landing, features, pricing            - Splash + full product
  - SEO pages, blog, legal                - Alarms, geofences, listener
  - Google sign-in for browser use        - FCM push
             \                                /
              \                              /
               \                            /
                +--------> Supabase <------+
                           (auth · memories · notify_rules
                            · places · plan_limits · profiles
                            · push_tokens · payments)
                                    |
                                    +-- Cashfree (payments)
                                    +-- FCM (push safety net)
```

Two shells, one backend. The Kotlin app is a first-class client, not a
WebView wrapper.

---

## 2. Website vs App — hard split

### Stays on the website only
- `/` (landing), `/features`, `/how-it-works`, `/why-mindrop`
- `/pricing`, `/download`, `/faq`, `/contact`
- `/privacy`, `/terms`, `/refunds`
- Marketing SEO / blog
- Web-only sign-in for people who want to use MinDrop in a browser

### Lives only in the Android app
- Splash → dashboard flow
- Capture bar, memories, packs, places, rules, notify, recall
- Settings (with Google Drive backup for premium)
- Native alarm ring, geofence triggers, notification listener
- Native Cashfree checkout

### Already enforced in code
`src/lib/platform.ts` exposes `isNativeApp()`. Marketing routes redirect
native shells straight to `/splash`. When you go **fully native Kotlin**, the
website is unreachable from the app process anyway — this check is a belt +
suspenders for the case where you ever wrap a WebView.

---

## 3. Project setup

- **Android Studio**: Hedgehog or newer.
- **Language**: Kotlin, JDK 17.
- **UI**: Jetpack Compose (Material 3).
- **min SDK**: 26 (Android 8). Below that, notification channels + geofences
  are painful.
- **target SDK**: current (34+).
- **App ID**: `app.getmindrop` (matches `capacitor.config.ts` — keeps the
  Google Cloud OAuth client / FCM sender ID reusable).
- **Signing**: create a release keystore in Android Studio → Build → Generate
  Signed Bundle. Store the keystore + passwords in a password manager.
  You'll need the **SHA-1** of both debug and release keystores registered in
  Google Cloud → Credentials for Google OAuth to work.

### Core gradle deps

```gradle
dependencies {
    // Compose
    implementation platform("androidx.compose:compose-bom:2024.10.00")
    implementation "androidx.compose.ui:ui"
    implementation "androidx.compose.material3:material3"
    implementation "androidx.activity:activity-compose:1.9.3"
    implementation "androidx.navigation:navigation-compose:2.8.4"

    // Supabase (native Kotlin client)
    implementation platform("io.github.jan-tennert.supabase:bom:2.6.1")
    implementation "io.github.jan-tennert.supabase:postgrest-kt"
    implementation "io.github.jan-tennert.supabase:gotrue-kt"
    implementation "io.github.jan-tennert.supabase:realtime-kt"
    implementation "io.ktor:ktor-client-android:2.3.13"

    // Room (offline cache)
    implementation "androidx.room:room-runtime:2.6.1"
    implementation "androidx.room:room-ktx:2.6.1"
    kapt "androidx.room:room-compiler:2.6.1"

    // Location / geofences
    implementation "com.google.android.gms:play-services-location:21.3.0"

    // FCM
    implementation platform("com.google.firebase:firebase-bom:33.5.1")
    implementation "com.google.firebase:firebase-messaging-ktx"

    // Cashfree
    implementation "com.cashfree.pg:api:2.2.2"

    // Google sign-in (Credential Manager — modern flow)
    implementation "androidx.credentials:credentials:1.3.0"
    implementation "androidx.credentials:credentials-play-services-auth:1.3.0"
    implementation "com.google.android.libraries.identity.googleid:googleid:1.1.1"
}
```

Add the FCM `google-services.json` in `app/` and apply the plugin.

---

## 4. Backend contract (already built)

| Concern            | Where                                                       |
|--------------------|-------------------------------------------------------------|
| Auth               | Supabase — email+password + Google OAuth                    |
| Memories/reminders | table `memories` (RLS `user_id = auth.uid()`)               |
| Notify rules       | table `notify_rules`                                        |
| Places / geofence  | table `places`                                              |
| Quotas             | table `plan_limits` (dynamic, editable in admin console)    |
| Premium status     | `profiles.plan`, `profiles.plan_expires_at`                 |
| Push tokens        | table `push_tokens` (POST via `savePushToken` server fn)    |
| Payments           | `payments` + `createCashfreeOrder` + Cashfree webhook       |

Server functions callable from the app:

- `GET  getPlanLimits`          — public, dynamic caps
- `POST savePushToken`          — auth
- `GET  getMyPremiumStatus`     — auth
- `POST createCashfreeOrder`    — auth → returns `paymentSessionId`
- `POST verifyCashfreeOrder`    — auth (optional; webhook is source of truth)
- `POST migrateLocalMemories`   — auth, one-shot after signup
- `POST upsertMemoryReminder`   — auth, mirrors reminder for FCM cron
- `POST deleteMemoryReminder`   — auth

Every one of these already exists; the Kotlin app calls them over HTTPS.

Base URL for server functions: `https://project--{project-id}.lovable.app`
(stable, immutable). Endpoints are `POST /_serverFn/<name>` with a
`Authorization: Bearer <supabase-access-token>` header.

---

## 5. AndroidManifest permissions

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:tools="http://schemas.android.com/tools">

    <!-- Alarms -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
    <uses-permission android:name="android.permission.USE_EXACT_ALARM"/>          <!-- SDK 33+ -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>       <!-- SDK 33+ -->
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS"/>

    <!-- Location -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>

    <!-- Read notifications from other apps -->
    <uses-permission android:name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
                     tools:ignore="ProtectedPermissions"/>

    <!-- Networking -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <!-- Optional but useful -->
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>            <!-- voice capture -->
</manifest>
```

---

## 6. Auth (Supabase in Kotlin)

Create a singleton:

```kotlin
// SupabaseClient.kt
object Backend {
    val client = createSupabaseClient(
        supabaseUrl = "https://<project-ref>.supabase.co",
        supabaseKey = "<publishable-anon-key>"
    ) {
        install(Auth) {
            flowType = FlowType.PKCE
            scheme = "app.getmindrop"   // deep link scheme
            host   = "auth-callback"
        }
        install(Postgrest)
        install(Realtime)
    }
}
```

### Email + password

```kotlin
Backend.client.auth.signInWith(Email) {
    email = "u@x.com"; password = "…"
}
Backend.client.auth.signUpWith(Email) {
    email = "u@x.com"; password = "…"
}
```

### Google — Credential Manager (recommended, no browser tab)

```kotlin
val cm = CredentialManager.create(context)
val option = GetGoogleIdOption.Builder()
    .setServerClientId("<web-oauth-client-id>.apps.googleusercontent.com")
    .setFilterByAuthorizedAccounts(false)
    .build()
val result = cm.getCredential(context, GetCredentialRequest(listOf(option)))
val cred = GoogleIdTokenCredential.createFrom(result.credential.data)
Backend.client.auth.signInWith(IDToken) {
    idToken = cred.idToken
    provider = Google
}
```

### Forgot password / OTP
Reuse the existing web flow — `signInWithOtp` on Supabase Kotlin client
sends the 6-digit email code, then `verifyOtp(email, token, type = Email)`.

---

## 7. Data layer

- Room DB with tables mirroring the public tables you care about: `memories`,
  `notify_rules`, `places`.
- On login: pull the user's rows, upsert into Room, then reschedule all
  AlarmManager alarms + geofences.
- On write: optimistic Room update → background sync to Supabase.
- On Supabase Realtime `INSERT`/`UPDATE`/`DELETE` events: apply to Room and
  reschedule alarms so a memory added on the web fires on the phone.

Skeleton:

```kotlin
Backend.client.channel("realtime:memories").apply {
    postgresChangeFlow<PostgresAction>("public") { table = "memories" }
        .onEach { evt -> MemorySync.apply(evt) }
        .launchIn(scope)
    subscribe()
}
```

---

## 8. Alarm-when-closed

The single most important native capability. Do NOT try to do this with a
WebView — it will die when Android kills the process.

### 8.1 Notification channel (create once)

```kotlin
class MindropApp : Application() {
    override fun onCreate() {
        super.onCreate()
        val nm = getSystemService(NotificationManager::class.java)
        val ch = NotificationChannel("mindrop_alarm", "Alarms",
                    NotificationManager.IMPORTANCE_HIGH).apply {
            description = "Reminders that ring like an alarm"
            enableVibration(true)
            setBypassDnd(true)
            lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            setSound(
                RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM),
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
        }
        nm.createNotificationChannel(ch)
    }
}
```

### 8.2 Scheduler — strongest wake path

```kotlin
object ReminderScheduler {
    fun schedule(ctx: Context, memoryId: String, title: String, whenMs: Long) {
        val am = ctx.getSystemService(AlarmManager::class.java)

        if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms()) {
            ctx.startActivity(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            return
        }

        val intent = Intent(ctx, AlarmReceiver::class.java).apply {
            putExtra("id", memoryId); putExtra("title", title)
        }
        val pi = PendingIntent.getBroadcast(
            ctx, memoryId.hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val show = PendingIntent.getActivity(
            ctx, memoryId.hashCode() + 1,
            Intent(ctx, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )
        // setAlarmClock = only guaranteed-exact, Doze-bypassing option.
        am.setAlarmClock(AlarmManager.AlarmClockInfo(whenMs, show), pi)
    }

    fun cancel(ctx: Context, memoryId: String) {
        val am = ctx.getSystemService(AlarmManager::class.java)
        val pi = PendingIntent.getBroadcast(
            ctx, memoryId.hashCode(),
            Intent(ctx, AlarmReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        am.cancel(pi)
    }
}
```

### 8.3 Receiver → foreground ring service

```kotlin
class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        val svc = Intent(ctx, AlarmRingService::class.java).apply {
            putExtra("id", intent.getStringExtra("id"))
            putExtra("title", intent.getStringExtra("title"))
        }
        ContextCompat.startForegroundService(ctx, svc)
    }
}
```

### 8.4 Foreground service — rings until dismissed

```kotlin
class AlarmRingService : Service() {
    private var mp: MediaPlayer? = null
    private var vib: Vibrator? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val id    = intent?.getStringExtra("id") ?: "x"
        val title = intent?.getStringExtra("title") ?: "MinDrop reminder"

        val dismiss = PendingIntent.getBroadcast(
            this, id.hashCode() + 2,
            Intent(this, DismissReceiver::class.java).putExtra("id", id),
            PendingIntent.FLAG_IMMUTABLE
        )
        val fullScreen = PendingIntent.getActivity(
            this, id.hashCode() + 3,
            Intent(this, AlarmActivity::class.java)
                .putExtra("id", id).putExtra("title", title)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
            PendingIntent.FLAG_IMMUTABLE
        )

        val notif = NotificationCompat.Builder(this, "mindrop_alarm")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("MinDrop")
            .setContentText(title)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setFullScreenIntent(fullScreen, true)
            .addAction(0, "Dismiss", dismiss)
            .setOngoing(true)
            .build()

        startForeground(id.hashCode().coerceAtLeast(1), notif)

        mp = MediaPlayer().apply {
            setAudioAttributes(AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
            setDataSource(this@AlarmRingService,
                RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM))
            isLooping = true; prepare(); start()
        }
        vib = getSystemService(Vibrator::class.java)
        vib?.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 600, 400), 0))

        return START_NOT_STICKY
    }

    override fun onDestroy() { mp?.stop(); mp?.release(); vib?.cancel(); super.onDestroy() }
    override fun onBind(i: Intent?) = null
}

class DismissReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        ctx.stopService(Intent(ctx, AlarmRingService::class.java))
    }
}
```

### 8.5 Reschedule on reboot

```kotlin
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        CoroutineScope(Dispatchers.IO).launch {
            RemindersRepo(ctx).pendingFuture().forEach {
                ReminderScheduler.schedule(ctx, it.id, it.title, it.remindAtMs)
            }
            GeofenceManager(ctx).registerAll(PlacesRepo(ctx).all())
        }
    }
}
```

Manifest additions:

```xml
<receiver android:name=".BootReceiver" android:exported="true">
    <intent-filter><action android:name="android.intent.action.BOOT_COMPLETED"/></intent-filter>
</receiver>
<receiver android:name=".AlarmReceiver" android:exported="false"/>
<receiver android:name=".DismissReceiver" android:exported="false"/>
<service  android:name=".AlarmRingService"
          android:foregroundServiceType="mediaPlayback"
          android:exported="false"/>
```

### 8.6 Battery optimization prompt

```kotlin
val pm = getSystemService(PowerManager::class.java)
if (!pm.isIgnoringBatteryOptimizations(packageName)) {
    startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
        Uri.parse("package:$packageName")))
}
```

---

## 9. Location rules — geofences

```kotlin
class GeofenceManager(private val ctx: Context) {
    private val client = LocationServices.getGeofencingClient(ctx)

    @SuppressLint("MissingPermission")
    fun register(placeId: String, lat: Double, lng: Double, radiusM: Float) {
        val fence = Geofence.Builder()
            .setRequestId(placeId)
            .setCircularRegion(lat, lng, radiusM)
            .setExpirationDuration(Geofence.NEVER_EXPIRE)
            .setTransitionTypes(
                Geofence.GEOFENCE_TRANSITION_ENTER or
                Geofence.GEOFENCE_TRANSITION_EXIT)
            .build()

        val req = GeofencingRequest.Builder()
            .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
            .addGeofence(fence).build()

        val pi = PendingIntent.getBroadcast(
            ctx, placeId.hashCode(),
            Intent(ctx, GeofenceReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE)
        client.addGeofences(req, pi)
    }

    fun unregister(placeId: String) = client.removeGeofences(listOf(placeId))
    fun registerAll(places: List<Place>) = places.forEach { register(it.id, it.lat, it.lng, it.radiusM) }
}
```

```kotlin
class GeofenceReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        val ev = GeofencingEvent.fromIntent(intent) ?: return
        if (ev.hasError()) return
        val transition = ev.geofenceTransition
        ev.triggeringGeofences?.forEach { g ->
            CoroutineScope(Dispatchers.IO).launch {
                val rule = RulesRepo(ctx).forPlace(g.requestId, transition) ?: return@launch
                val svc = Intent(ctx, AlarmRingService::class.java)
                    .putExtra("id", rule.id).putExtra("title", rule.message)
                ContextCompat.startForegroundService(ctx, svc)
            }
        }
    }
}
```

**Two-step permission flow (required Android 10+):**
1. Ask `ACCESS_FINE_LOCATION` on the place-creation screen.
2. On a *separate* explainer screen, prompt `ACCESS_BACKGROUND_LOCATION` with
   a clear "why we need this" message. Google Play rejects apps that combine
   the two prompts.

Register geofences again in `BootReceiver` — they are lost on reboot.

---

## 10. Reading other apps' notifications

```kotlin
class MindropNotificationListener : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val pkg   = sbn.packageName
        val title = sbn.notification.extras.getString(Notification.EXTRA_TITLE).orEmpty()
        val text  = sbn.notification.extras.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty()

        RulesRepo(this).matchIncoming(pkg, title, text)?.let { rule ->
            val svc = Intent(this, AlarmRingService::class.java)
                .putExtra("id", rule.id).putExtra("title", rule.message)
            ContextCompat.startForegroundService(this, svc)
        }
    }
}
```

Manifest:
```xml
<service android:name=".MindropNotificationListener"
         android:label="MinDrop notification access"
         android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
         android:exported="true">
    <intent-filter>
        <action android:name="android.service.notification.NotificationListenerService"/>
    </intent-filter>
</service>
```

Kick user to enable it (no runtime dialog exists):

```kotlin
startActivity(Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"))
```

**Play Store**: requires written justification during review; if rejected,
distribute the APK from your own website / update page.

---

## 11. Push (FCM) — safety net

FCM is not the primary alarm mechanism (AlarmManager is). It's the backup for
the case where the device is off / uninstalled-then-reinstalled / clock skew.

```kotlin
class MindropFcmService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        ApiClient.savePushToken(token, platform = "android")
    }
    override fun onMessageReceived(msg: RemoteMessage) {
        val id    = msg.data["id"] ?: return
        val title = msg.data["title"] ?: "MinDrop"
        val svc = Intent(this, AlarmRingService::class.java)
            .putExtra("id", id).putExtra("title", title)
        ContextCompat.startForegroundService(this, svc)
    }
}
```

Register in manifest:
```xml
<service android:name=".MindropFcmService" android:exported="false">
    <intent-filter><action android:name="com.google.firebase.MESSAGING_EVENT"/></intent-filter>
</service>
```

Server side is already sending pushes via `sendFcm` (in
`src/lib/fcm.server.ts`) using the same `FCM_SERVICE_ACCOUNT_JSON`.

---

## 12. Payments — Cashfree native SDK

```kotlin
// 1. Ask backend to create an order (existing server fn)
val order = ApiClient.createCashfreeOrder(currency = "INR")
// { orderId, paymentSessionId, amount, currency, mode }

// 2. Launch Cashfree Drop Checkout
val session = CFSession.CFSessionBuilder()
    .setEnvironment(if (order.mode == "production")
        CFSession.Environment.PRODUCTION else CFSession.Environment.SANDBOX)
    .setPaymentSessionID(order.paymentSessionId)
    .setOrderId(order.orderId)
    .build()

val cfPayment = CFDropCheckoutPayment.CFDropCheckoutPaymentBuilder()
    .setSession(session).build()

CFPaymentGatewayService.getInstance().doPayment(this, cfPayment)

// 3. Webhook (/api/public/cashfree-webhook) upgrades the user to premium.
//    App can call getMyPremiumStatus after the success callback and update UI.
```

Gradle:
```gradle
implementation "com.cashfree.pg:api:2.2.2"
```

---

## 13. Dynamic plan limits

Fetch `plan_limits` at login and cache in Room. Cap enforcement mirrors the
web:

- `later_per_day` — 3 anon / 5 free / unlimited premium (default seeds)
- `notify_rules_total` — 3 / 5 / unlimited
- `places_total` — 3 / 5 / unlimited

`-1` in the DB means unlimited. Admin can change these at
`/ctrl-vx9k2m7fq3z/limits` on the web and the app picks up the new values on
next fetch (or Realtime).

Behaviour when hit:
- **Anonymous**: show "Sign up to get 5 free" sheet (opens auth screen).
- **Free**: show "Go Premium for unlimited" sheet (opens Cashfree flow).
- **Premium**: no cap.

Google Drive backup is gated: server function `assertPremium` rejects
non-premium callers. Show a soft-locked card with "Upgrade to Premium" for
free users; enable "Connect Google Drive" only when premium.

---

## 14. Deep links / OAuth callback

Add to manifest so Supabase's PKCE callback returns to the app:

```xml
<activity android:name=".MainActivity" android:exported="true"
          android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="app.getmindrop" android:host="auth-callback"/>
    </intent-filter>
</activity>
```

Register the same redirect URL (`app.getmindrop://auth-callback`) in Supabase
Auth → URL Configuration and in the Google Cloud OAuth client.

---

## 15. Boot, battery optimization, OEM quirks

- `BootReceiver` reschedules every future alarm + geofence.
- Battery-optimization whitelist prompt on first launch.
- OEM autostart pages you should link the user to when detected:
  - Xiaomi: `com.miui.securitycenter/.permission.AutoStartManagementActivity`
  - Oppo/Realme: `com.coloros.safecenter/.startupapp.StartupAppListActivity`
  - Vivo: `com.iqoo.secure/.ui.phoneoptimize.BgStartUpManager`
  - Huawei: `com.huawei.systemmanager/.startupmgr.ui.StartupNormalAppListActivity`
- Don't nag: show these links once, inside the Diagnostics screen.

---

## 16. Offline behaviour

- Room stores everything so the app is fully usable without network.
- Reads render from Room; writes are queued via WorkManager and drained when
  connectivity returns.
- Alarms and geofences never depend on network — they fire from device state
  alone.
- Backup / restore: local JSON export works offline; Google Drive backup
  (premium) requires network.

---

## 17. Publishing checklist

**Functional smoke test on a real device:**
- [ ] Set a reminder 2 min in the future → force-stop app → alarm still rings.
- [ ] Reboot device → previously scheduled alarm still rings at the right time.
- [ ] Enable DND → alarm channel bypasses it.
- [ ] Walk in/out of a geofenced radius → correct rule fires.
- [ ] Post a matching notification from WhatsApp/SMS → listener fires alarm.
- [ ] Cashfree sandbox payment succeeds → `profiles.plan = 'premium'` within seconds.
- [ ] Google Drive backup + restore from a different install.

**OEM matrix:**
- [ ] Pixel, Samsung, Xiaomi, Oppo, Vivo — alarm reliability check.

**Play Console declarations:**
- [ ] Exact alarm — justification: "reminders scheduled by user must fire at exact time."
- [ ] Background location — screencast showing geofence trigger.
- [ ] Full-screen intent — same justification as exact alarm.
- [ ] Notification listener — written justification, or ship outside Play.
- [ ] Data safety form — declare on-device storage + Drive (user-owned) + Cashfree.
- [ ] Privacy policy URL (`getmindrop.lovable.app/privacy`).

**Sideload channel (if Play rejects notification listener):**
- [ ] Signed APK on the marketing site's `/download` page.
- [ ] In-app update check (compare `versionCode` with a JSON on the site).

---

## 18. Things that do NOT work

- **Appilix / URL-to-APK wrappers** — cannot run alarms, geofences, or read
  notifications. WebView is killed when app closes. Confirmed in prior debug
  sessions.
- **JavaScript `setTimeout` / Web Audio in a WebView** — dies with the process.
- **`Notification.showTrigger` / `TimestampTrigger`** — never shipped in
  production Chromium. Do not rely on it.
- **Web Push without a server** — impossible; you already have FCM + backend
  as the safety-net path.
- **`setExact` / `setExactAndAllowWhileIdle`** on Android 12+ — still deferred
  under Doze in some cases. Use `setAlarmClock` for guaranteed wake.
- **Combined location prompts** — Play rejects apps that ask for background
  location in the same dialog as foreground. Two screens, always.

---

## 19. Suggested class / package layout

```
app.getmindrop/
├── MindropApp.kt                    // Application; creates channels
├── MainActivity.kt                  // Compose host
├── AlarmActivity.kt                 // full-screen ring UI
│
├── auth/
│   ├── SupabaseClient.kt
│   ├── GoogleSignIn.kt
│   └── AuthViewModel.kt
│
├── data/
│   ├── Room DB + DAOs
│   ├── MemoriesRepo.kt
│   ├── RulesRepo.kt
│   ├── PlacesRepo.kt
│   ├── PlanLimitsRepo.kt
│   └── Sync.kt                      // Realtime + WorkManager
│
├── alarm/
│   ├── ReminderScheduler.kt
│   ├── AlarmReceiver.kt
│   ├── AlarmRingService.kt
│   ├── DismissReceiver.kt
│   └── BootReceiver.kt
│
├── location/
│   ├── GeofenceManager.kt
│   └── GeofenceReceiver.kt
│
├── listener/
│   └── MindropNotificationListener.kt
│
├── push/
│   └── MindropFcmService.kt
│
├── payments/
│   ├── ApiClient.kt                 // wraps server fns
│   └── CashfreeCheckout.kt
│
├── ui/
│   ├── splash/, dashboard/, capture/, memories/,
│   │   packs/, places/, rules/, notify/, settings/, paywall/
│   └── theme/                        // Material 3 tokens matching web palette
│
└── util/
    ├── OemAutostart.kt
    └── BatteryOpt.kt
```

---

**End of guide.** Everything above is what the Android build needs to match
the behaviour we designed on the web side, without giving up your no-server /
user-owned-data promise. Website stays for marketing; app is native Kotlin +
existing backend.
