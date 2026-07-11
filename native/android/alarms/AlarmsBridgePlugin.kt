package app.getmindrop.alarms

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback

/**
 * AlarmsBridge — production-grade reminders on Android.
 *
 * v2: dynamic per-tone alarm channels (Android caches sound URI on the
 * channel, so switching tones needs a fresh channel), plus preview
 * playback and a snooze deep-link for use by the notification action.
 */
@CapacitorPlugin(
    name = "AlarmsBridge",
    permissions = [
        Permission(
            alias = "notifications",
            strings = [Manifest.permission.POST_NOTIFICATIONS]
        )
    ]
)
class AlarmsBridgePlugin : Plugin() {

    override fun load() {
        AlarmChannels.ensureNotifyChannel(context)
        AlarmChannels.ensureAlarmChannel(context, AlarmStore.getDefaultToneId(context))
    }

    // ─── permission checks ──────────────────────────────────────────────

    private fun postGranted(): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return true
        return ContextCompat.checkSelfPermission(
            context, Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun canExact(): Boolean {
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) am.canScheduleExactAlarms() else true
    }

    private fun ignoringBattery(): Boolean {
        val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        return pm.isIgnoringBatteryOptimizations(context.packageName)
    }

    private fun statusJson(): JSObject = JSObject()
        .put("postNotifications", postGranted())
        .put("canScheduleExactAlarms", canExact())
        .put("ignoringBatteryOptimizations", ignoringBattery())

    @PluginMethod
    fun getStatus(call: PluginCall) { call.resolve(statusJson()) }

    @PluginMethod
    fun requestNotificationPermission(call: PluginCall) {
        if (postGranted()) { call.resolve(statusJson()); return }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissionForAlias("notifications", call, "afterNotifPerm")
        } else {
            call.resolve(statusJson())
        }
    }

    @PermissionCallback
    private fun afterNotifPerm(call: PluginCall) { call.resolve(statusJson()) }

    // ─── deep-links ─────────────────────────────────────────────────────

    @PluginMethod
    fun openNotificationSettings(call: PluginCall) {
        val i = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                .putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
        } else {
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.fromParts("package", context.packageName, null))
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(i)
        call.resolve()
    }

    @PluginMethod
    fun openExactAlarmSettings(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val i = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                .setData(Uri.fromParts("package", context.packageName, null))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            try { context.startActivity(i) } catch (_: Throwable) {
                context.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                    Uri.fromParts("package", context.packageName, null))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            }
        }
        call.resolve()
    }

    @PluginMethod
    fun openBatteryOptimizationSettings(call: PluginCall) {
        val i = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
            .setData(Uri.parse("package:${context.packageName}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { context.startActivity(i) } catch (_: Throwable) {
            context.startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        }
        call.resolve()
    }

    @PluginMethod
    fun openAppDetails(call: PluginCall) {
        context.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
            Uri.fromParts("package", context.packageName, null))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        call.resolve()
    }

    // ─── tone management ────────────────────────────────────────────────

    @PluginMethod
    fun setDefaultTone(call: PluginCall) {
        val toneId = call.getString("toneId") ?: run { call.reject("toneId required"); return }
        AlarmStore.setDefaultToneId(context, toneId)
        AlarmChannels.ensureAlarmChannel(context, toneId)
        call.resolve()
    }

    @PluginMethod
    fun previewTone(call: PluginCall) {
        val toneId = call.getString("toneId") ?: run { call.reject("toneId required"); return }
        val i = Intent(context, AlarmRingService::class.java).apply {
            action = AlarmRingService.ACTION_PREVIEW
            putExtra("toneId", toneId)
        }
        ContextCompat.startForegroundService(context, i)
        call.resolve()
    }

    @PluginMethod
    fun stopPreview(call: PluginCall) {
        val i = Intent(context, AlarmRingService::class.java).apply {
            action = AlarmRingService.ACTION_STOP
        }
        try { context.startService(i) } catch (_: Throwable) {}
        call.resolve()
    }

    @PluginMethod
    fun snoozeAlarm(call: PluginCall) {
        val id = call.getString("id") ?: run { call.reject("id required"); return }
        val minutes = call.getInt("minutes") ?: 5
        AlarmScheduler.snooze(context, id, minutes.toLong())
        call.resolve()
    }

    // ─── scheduling ─────────────────────────────────────────────────────

    @PluginMethod
    fun scheduleAlarm(call: PluginCall) {
        val id = call.getString("id") ?: run { call.reject("id required"); return }
        val at = call.getLong("at") ?: run { call.reject("at required"); return }
        val title = call.getString("title") ?: "MinDrop reminder"
        val body = call.getString("body") ?: ""
        val delivery = call.getString("delivery") ?: "alarm"
        val toneId = call.getString("toneId") ?: AlarmStore.getDefaultToneId(context)
        val extra = call.getObject("extra")?.toString()

        // Make sure the channel exists before scheduling — Android needs it for
        // the sound URI when the AlarmReceiver posts.
        if (delivery == "alarm") AlarmChannels.ensureAlarmChannel(context, toneId)
        else AlarmChannels.ensureNotifyChannel(context)

        val entry = AlarmStore.Entry(
            id = id, at = at, title = title, body = body,
            delivery = delivery, toneId = toneId,
            exact = canExact(), extra = extra
        )
        AlarmStore.upsert(context, entry)
        AlarmScheduler.schedule(context, entry)

        // Report why an alarm might not actually ring on this device. The
        // reminder is still scheduled — the JS layer surfaces a nudge.
        val reason = when {
            !postGranted() -> "no_notif_permission"
            delivery == "alarm" && !canExact() -> "no_exact_permission"
            delivery == "alarm" && !ignoringBattery() -> "battery_optimized"
            else -> "ok"
        }
        call.resolve(statusJson().put("scheduled", true).put("reason", reason))
    }

    @PluginMethod
    fun getFiredLog(call: PluginCall) {
        val arr = com.getcapacitor.JSArray()
        AlarmStore.readFiredLog(context).forEach {
            arr.put(JSObject()
                .put("id", it.id)
                .put("at", it.at)
                .put("title", it.title)
                .put("delivery", it.delivery))
        }
        call.resolve(JSObject().put("entries", arr))
    }

    @PluginMethod
    fun cancelAlarm(call: PluginCall) {
        val id = call.getString("id") ?: run { call.reject("id required"); return }
        AlarmScheduler.cancel(context, id)
        AlarmStore.remove(context, id)
        call.resolve()
    }

    @PluginMethod
    fun cancelAll(call: PluginCall) {
        AlarmStore.readAll(context).forEach { AlarmScheduler.cancel(context, it.id) }
        AlarmStore.clear(context)
        call.resolve()
    }

    @PluginMethod
    fun getPending(call: PluginCall) {
        val arr = com.getcapacitor.JSArray()
        AlarmStore.readAll(context).forEach {
            arr.put(JSObject()
                .put("id", it.id)
                .put("at", it.at)
                .put("title", it.title)
                .put("body", it.body)
                .put("delivery", it.delivery)
                .put("toneId", it.toneId)
                .put("exact", it.exact))
        }
        call.resolve(JSObject().put("alarms", arr))
    }

    companion object {
        @Volatile var instance: AlarmsBridgePlugin? = null
    }

    override fun handleOnStart() { super.handleOnStart(); instance = this }
    override fun handleOnDestroy() { super.handleOnDestroy(); if (instance === this) instance = null }

    /** Called by AlarmReceiver when a scheduled alarm fires and the app is alive. */
    fun emitFired(id: String, extra: String?) {
        val data = JSObject().put("id", id).put("extra", extra ?: "")
        notifyListeners("alarmFired", data)
    }
}

/**
 * Channel factory: one channel per (delivery × toneId) so Android's cached
 * sound URI matches the user's current choice.
 */
object AlarmChannels {
    const val NOTIFY_CHANNEL = "mindrop-nudge"
    fun alarmChannelIdFor(toneId: String) = "mindrop-alarm-$toneId"

    fun ensureNotifyChannel(ctx: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = ctx.getSystemService(NotificationManager::class.java) ?: return
        if (nm.getNotificationChannel(NOTIFY_CHANNEL) == null) {
            nm.createNotificationChannel(NotificationChannel(
                NOTIFY_CHANNEL, "MinDrop nudges", NotificationManager.IMPORTANCE_DEFAULT
            ).apply { description = "Silent reminders" })
        }
    }

    fun ensureAlarmChannel(ctx: Context, toneId: String) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = ctx.getSystemService(NotificationManager::class.java) ?: return
        val channelId = alarmChannelIdFor(toneId)
        if (nm.getNotificationChannel(channelId) != null) return

        val soundUri = toneUri(ctx, toneId)
        val attrs = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        val ch = NotificationChannel(
            channelId, "MinDrop alarm — $toneId", NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Loud alarms for critical reminders"
            enableVibration(true)
            vibrationPattern = longArrayOf(0, 500, 300, 500, 300, 500)
            enableLights(true)
            setBypassDnd(true)
            lockscreenVisibility = NotificationManager.IMPORTANCE_HIGH
            if (soundUri != null) setSound(soundUri, attrs)
        }
        nm.createNotificationChannel(ch)
    }

    fun toneUri(ctx: Context, toneId: String): Uri? {
        // Resource name lives in res/raw/tone_<id>.ogg
        val resName = "tone_${toneId.lowercase()}"
        val id = ctx.resources.getIdentifier(resName, "raw", ctx.packageName)
        if (id == 0) return null
        return Uri.parse("android.resource://${ctx.packageName}/$id")
    }
}

/** Helper that hides AlarmManager quirks and PendingIntent construction. */
object AlarmScheduler {

    fun schedule(ctx: Context, e: AlarmStore.Entry) {
        val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val pi = pendingIntent(ctx, e)
        val useExact = e.exact && (Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms())
        try {
            if (e.delivery == "alarm" && useExact) {
                // Strongest Doze exemption + shows next-alarm icon.
                val showIntent = ctx.packageManager.getLaunchIntentForPackage(ctx.packageName)?.let {
                    PendingIntent.getActivity(
                        ctx, AlarmStore.requestCode(e.id) xor 0x1, it,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                }
                val info = AlarmManager.AlarmClockInfo(e.at, showIntent)
                am.setAlarmClock(info, pi)
            } else if (useExact) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, e.at, pi)
            } else {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, e.at, pi)
            }
        } catch (_: SecurityException) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, e.at, pi)
        }
    }

    fun cancel(ctx: Context, id: String) {
        val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val stub = AlarmStore.Entry(
            id = id, at = 0, title = "", body = "",
            delivery = "notify", toneId = "classic", exact = false
        )
        am.cancel(pendingIntent(ctx, stub))
        // Also stop any ringing service that may be alive for this id.
        try {
            val stop = Intent(ctx, AlarmRingService::class.java).apply {
                action = AlarmRingService.ACTION_STOP
                putExtra("id", id)
            }
            ctx.startService(stop)
        } catch (_: Throwable) {}
    }

    /** Reschedule an existing entry `minutes` from now. */
    fun snooze(ctx: Context, id: String, minutes: Long) {
        val existing = AlarmStore.find(ctx, id) ?: return
        val next = existing.copy(at = System.currentTimeMillis() + minutes * 60_000L)
        cancel(ctx, id)
        AlarmStore.upsert(ctx, next)
        schedule(ctx, next)
    }

    private fun pendingIntent(ctx: Context, e: AlarmStore.Entry): PendingIntent {
        val i = Intent(ctx, AlarmReceiver::class.java).apply {
            action = "app.getmindrop.alarms.FIRE"
            putExtra("id", e.id)
            putExtra("title", e.title)
            putExtra("body", e.body)
            putExtra("delivery", e.delivery)
            putExtra("toneId", e.toneId)
            if (e.extra != null) putExtra("extra", e.extra)
        }
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        return PendingIntent.getBroadcast(ctx, AlarmStore.requestCode(e.id), i, flags)
    }
}
