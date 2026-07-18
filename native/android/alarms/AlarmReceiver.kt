package app.getmindrop.alarms

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat

/**
 * Fired by AlarmManager at the scheduled instant — even while the app is
 * dead. Two branches:
 *
 *  - delivery = "alarm"  → start the AlarmRingService (loud loop + vibration)
 *                          AND post a full-screen-intent notification so the
 *                          screen wakes and the user sees Stop / Snooze.
 *  - delivery = "notify" → post a silent heads-up notification.
 *
 * The notification carries three action buttons that route back through
 * BroadcastReceiver actions handled below: STOP, SNOOZE_5, SNOOZE_30, SNOOZE_60.
 */
class AlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Diagnostics.log(context, "AlarmReceiver.onReceive: action=${intent.action}, id=${intent.getStringExtra("id")}")
        when (intent.action) {
            ACTION_STOP -> {
                val id = intent.getStringExtra("id") ?: return
                stopAlarm(context, id, removeEntry = true)
                return
            }
            ACTION_SNOOZE -> {
                val mins = intent.getIntExtra("minutes", 5)
                return snoozeAndStop(context, intent, mins)
            }
            ACTION_SNOOZE_5 -> return snoozeAndStop(context, intent, 5)
            ACTION_SNOOZE_30 -> return snoozeAndStop(context, intent, 30)
            ACTION_SNOOZE_60 -> return snoozeAndStop(context, intent, 60)
        }

        val id = intent.getStringExtra("id") ?: return
        val title = intent.getStringExtra("title") ?: "MinDrop reminder"
        val body = intent.getStringExtra("body") ?: ""
        val delivery = intent.getStringExtra("delivery") ?: "alarm"
        val toneId = intent.getStringExtra("toneId") ?: "classic"
        val extra = intent.getStringExtra("extra")

        // Local-only diagnostics ring buffer — helps users see whether alarms
        // actually delivered. Never leaves the device.
        AlarmStore.recordFired(context, AlarmStore.Entry(
            id = id, at = System.currentTimeMillis(),
            title = title, body = body,
            delivery = delivery, toneId = toneId,
            exact = true, extra = extra
        ))

        val canPost = ContextCompat.checkSelfPermission(
            context, android.Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
                || android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.TIRAMISU

        val channelId = if (delivery == "alarm")
            AlarmChannels.alarmChannelIdFor(toneId) else AlarmChannels.NOTIFY_CHANNEL
        if (delivery == "alarm") AlarmChannels.ensureAlarmChannel(context, toneId)
        else AlarmChannels.ensureNotifyChannel(context)

        if (canPost && delivery != "alarm") {
            val nm = context.getSystemService(NotificationManager::class.java)

            val contentIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
                ?.let {
                    PendingIntent.getActivity(
                        context, AlarmStore.requestCode(id), it,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                }

            val builder = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(NotificationCompat.BigTextStyle().bigText(body))
                .setAutoCancel(true)
                .setContentIntent(contentIntent)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)

            Diagnostics.log(context, "AlarmReceiver.onReceive: calling nm.notify for non-alarm delivery id=$id, requestCode=${AlarmStore.requestCode(id)}")
            nm.notify(AlarmStore.requestCode(id), builder.build())
            Diagnostics.log(context, "AlarmReceiver.onReceive: nm.notify completed successfully")
        } else if (!canPost) {
            Diagnostics.log(context, "AlarmReceiver.onReceive: canPost was FALSE (cannot post notification)")
        }
        if (delivery == "alarm") {
            // Loud looping ringtone + vibration.
            Diagnostics.log(context, "AlarmReceiver.onReceive: starting foreground service AlarmRingService for id=$id")
            val svc = Intent(context, AlarmRingService::class.java).apply {
                action = AlarmRingService.ACTION_RING
                putExtra("id", id)
                putExtra("title", title)
                putExtra("body", body)
                putExtra("toneId", toneId)
            }
            try {
                ContextCompat.startForegroundService(context, svc)
                Diagnostics.log(context, "AlarmReceiver.onReceive: foreground service start successful")
            } catch (t: Throwable) {
                Diagnostics.logError(context, "AlarmReceiver.onReceive: failed to start foreground service", t)
            }
        }

        // The one-shot notification has fired — remove it from the persisted
        // queue. Keep alarm entries while ringing so Stop/Snooze actions can
        // still find the original reminder.
        if (delivery != "alarm") AlarmStore.remove(context, id)

        // Forward to JS if plugin is alive.
        AlarmsBridgePlugin.instance?.emitFired(id, extra)
    }

    private fun stopAlarm(ctx: Context, id: String, removeEntry: Boolean = true, recordStopped: Boolean = true) {
        Diagnostics.log(ctx, "AlarmReceiver.stopAlarm: stop clicked for id=$id, removeEntry=$removeEntry, recordStopped=$recordStopped")
        val nm = ctx.getSystemService(NotificationManager::class.java)
        nm.cancel(AlarmStore.requestCode(id))

        // Record that this alarm was stopped so the JS side can reconcile it on opening.
        if (recordStopped) {
            AlarmStore.recordStoppedAlarm(ctx, id)
        }

        // Read the stored alarm entry BEFORE removing it.
        val entry = AlarmStore.find(ctx, id)
        val extra = entry?.extra ?: ""
        // Format: "active_key::{pkg}::{conversationTitle}::{ruleId}"
        if (removeEntry && extra.startsWith("active_key::")) {
            val parts = extra.removePrefix("active_key::").split("::", limit = 3)
            if (parts.size >= 2) {
                AlarmStore.clearAlarmActive(ctx, parts[0], parts[1])
            }
            // Permanently retire once-rules on Stop.
            if (parts.size == 3 && parts[2].isNotBlank()) {
                val listenerPrefs = ctx.getSharedPreferences(
                    app.getmindrop.notify.MindDropNotificationListener.PREFS,
                    android.content.Context.MODE_PRIVATE
                )
                listenerPrefs.edit().putBoolean("stopped_rule_${parts[2]}", true).apply()
            }
        }

        if (removeEntry) AlarmStore.remove(ctx, id)

        try {
            ctx.stopService(Intent(ctx, AlarmRingService::class.java))
        } catch (t: Throwable) {
            Diagnostics.logError(ctx, "AlarmReceiver.stopAlarm: failed to stop service", t)
        }
    }


    private fun snoozeAndStop(ctx: Context, intent: Intent, minutes: Int) {
        val id = intent.getStringExtra("id") ?: return
        Diagnostics.log(ctx, "AlarmReceiver.snoozeAndStop: snooze action received for id=$id, minutes=$minutes")
        // Record that this alarm was snoozed so the JS side can reconcile it on opening.
        AlarmStore.recordSnoozedAlarm(ctx, id, minutes)
        stopAlarm(ctx, id, removeEntry = false, recordStopped = false)
        AlarmScheduler.snooze(ctx, id, minutes.toLong())
    }

    private fun actionPI(ctx: Context, id: String, action: String): PendingIntent {
        val i = Intent(ctx, AlarmReceiver::class.java).apply {
            this.action = action
            putExtra("id", id)
        }
        val rc = (AlarmStore.requestCode(id) xor action.hashCode()) and 0x7fffffff
        return PendingIntent.getBroadcast(
            ctx, rc, i,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    companion object {
        const val ACTION_STOP      = "app.getmindrop.alarms.STOP"
        const val ACTION_SNOOZE    = "app.getmindrop.alarms.SNOOZE"
        const val ACTION_SNOOZE_5  = "app.getmindrop.alarms.SNOOZE_5"
        const val ACTION_SNOOZE_30 = "app.getmindrop.alarms.SNOOZE_30"
        const val ACTION_SNOOZE_60 = "app.getmindrop.alarms.SNOOZE_60"
    }
}
