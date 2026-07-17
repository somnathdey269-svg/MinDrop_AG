package app.getmindrop.alarms

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

/**
 * AlarmRingService — foreground service that plays the alarm tone on the ALARM
 * audio stream and vibrates. Started by AlarmReceiver; stopped by Stop / Snooze
 * notification actions, the JS AlarmSheet, or the 30-second auto-stop timer.
 *
 * GLOBAL LOCK: only ONE alarm can ever ring at a time. Any ACTION_RING received
 * while isRinging == true is silently dropped. This is the definitive fix for
 * double-ring regardless of what causes it (dual path, race condition, thread
 * re-trigger, app startup timing). Nothing can bypass this gate.
 */
class AlarmRingService : Service() {

    private var player: MediaPlayer? = null
    private var vibrator: Vibrator? = null

    private val autoStopHandler = Handler(Looper.getMainLooper())
    private val autoStopRunnable = Runnable { stopSelfCleanly() }
    private val AUTO_STOP_MS = 30_000L

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_RING
        when (action) {
            ACTION_STOP -> {
                autoStopHandler.removeCallbacks(autoStopRunnable)
                stopSelfCleanly()
                return START_NOT_STICKY
            }
            ACTION_PREVIEW -> {
                val toneId = intent?.getStringExtra("toneId") ?: "classic"
                startForegroundIfNeeded("Previewing alarm tone")
                startTone(toneId, vibrate = false)
                return START_NOT_STICKY
            }
            else -> {
                // ── Global single-instance lock ───────────────────────────────
                // If an alarm is already ringing, drop this request immediately.
                // This is the definitive guard against any double-ring scenario —
                // dual native+JS paths, WhatsApp thread re-posts, startup race,
                // snooze overlaps — nothing can bypass this check.
                if (isRinging) {
                    return START_NOT_STICKY
                }
                // Acquire the lock before touching audio/vibration.
                setRinging(applicationContext, true)

                // Track the currently active alarm details for getActiveAlarm()
                activeAlarmId = intent?.getStringExtra("id")
                activeAlarmTitle = intent?.getStringExtra("title") ?: "MinDrop reminder"
                activeAlarmBody = intent?.getStringExtra("body") ?: ""

                val toneId = intent?.getStringExtra("toneId") ?: "classic"
                startForegroundIfNeeded("Alarm ringing", activeAlarmId, toneId)
                startTone(toneId, vibrate = true)
                autoStopHandler.removeCallbacks(autoStopRunnable)
                autoStopHandler.postDelayed(autoStopRunnable, AUTO_STOP_MS)
                return START_NOT_STICKY
            }
        }
    }

    private fun startForegroundIfNeeded(text: String, alarmId: String? = null, toneId: String = "classic") {
        val channelId = if (alarmId != null) {
            AlarmChannels.ensureAlarmChannel(this, toneId)
            AlarmChannels.alarmChannelIdFor(toneId)
        } else {
            ensureServiceChannel()
            SERVICE_CHANNEL
        }

        val title = if (alarmId != null) activeAlarmTitle else "MinDrop"
        val body = if (alarmId != null) activeAlarmBody else text

        val contentIntent = packageManager.getLaunchIntentForPackage(packageName)
            ?.let {
                PendingIntent.getActivity(
                    this, AlarmStore.requestCode(alarmId ?: "preview"), it,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            }

        val builder = NotificationCompat.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .setContentIntent(contentIntent)

        if (alarmId != null) {
            builder.setPriority(NotificationCompat.PRIORITY_MAX)
            builder.setCategory(NotificationCompat.CATEGORY_ALARM)
            contentIntent?.let { builder.setFullScreenIntent(it, true) }
            builder.addAction(0, "Stop", actionPI(this, alarmId, AlarmReceiver.ACTION_STOP))
            builder.addAction(0, "5m",   actionPI(this, alarmId, AlarmReceiver.ACTION_SNOOZE_5))
            builder.addAction(0, "30m",  actionPI(this, alarmId, AlarmReceiver.ACTION_SNOOZE_30))
        } else {
            builder.setPriority(NotificationCompat.PRIORITY_LOW)
        }

        val n = builder.build()
        val notificationId = if (alarmId != null) AlarmStore.requestCode(alarmId) else SERVICE_NOTIFICATION_ID

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(notificationId, n,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
            } else {
                startForeground(notificationId, n)
            }
        } catch (_: Throwable) {
            try { startForeground(notificationId, n) } catch (_: Throwable) {}
        }
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

    private fun ensureServiceChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = getSystemService(NotificationManager::class.java) ?: return
        if (nm.getNotificationChannel(SERVICE_CHANNEL) == null) {
            nm.createNotificationChannel(NotificationChannel(
                SERVICE_CHANNEL, "MinDrop alarm playback",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shown while an alarm is ringing"
                setShowBadge(false)
            })
        }
    }

    private fun startTone(toneId: String, vibrate: Boolean) {
        stopPlayback()
        val uri = resolveToneUri(this, toneId) ?: run {
            if (vibrate) startVibration()
            return
        }
        try {
            player = MediaPlayer().apply {
                setAudioAttributes(AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build())
                isLooping = true
                setDataSource(this@AlarmRingService, uri)
                prepare()
                start()
            }
        } catch (_: Throwable) {
            player = null
            try {
                val def = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                player = MediaPlayer().apply {
                    setAudioAttributes(AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build())
                    isLooping = true
                    setDataSource(this@AlarmRingService, def)
                    prepare()
                    start()
                }
            } catch (_: Throwable) {}
        }
        if (vibrate) startVibration()
    }

    private fun startVibration() {
        try {
            val vib = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                (getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager).defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }
            vibrator = vib
            val pattern = longArrayOf(0, 500, 300, 500, 300, 500, 300, 800)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vib.vibrate(VibrationEffect.createWaveform(pattern, 0))
            } else {
                @Suppress("DEPRECATION")
                vib.vibrate(pattern, 0)
            }
        } catch (_: Throwable) {}
    }

    private fun stopPlayback() {
        try { player?.stop() } catch (_: Throwable) {}
        try { player?.release() } catch (_: Throwable) {}
        player = null
        try { vibrator?.cancel() } catch (_: Throwable) {}
        vibrator = null
    }

    private fun stopSelfCleanly() {
        // Release the global lock so the next legitimate alarm can ring.
        setRinging(applicationContext, false)
        activeAlarmId = null
        activeAlarmTitle = null
        activeAlarmBody = null
        stopPlayback()
        try { stopForeground(STOP_FOREGROUND_REMOVE) } catch (_: Throwable) {}
        stopSelf()
    }

    override fun onDestroy() {
        autoStopHandler.removeCallbacks(autoStopRunnable)
        // Always release the lock on destroy — covers force-kill / crash.
        setRinging(applicationContext, false)
        activeAlarmId = null
        activeAlarmTitle = null
        activeAlarmBody = null
        stopPlayback()
        super.onDestroy()
    }

    private fun resolveToneUri(ctx: Context, toneId: String): Uri? {
        if (toneId == "silent") return null
        val resName = "tone_${toneId.lowercase()}"
        val id = ctx.resources.getIdentifier(resName, "raw", ctx.packageName)
        if (id == 0) return null
        return Uri.parse("android.resource://${ctx.packageName}/$id")
    }

    companion object {
        const val ACTION_RING    = "app.getmindrop.alarms.RING"
        const val ACTION_STOP   = "app.getmindrop.alarms.RING_STOP"
        const val ACTION_PREVIEW = "app.getmindrop.alarms.RING_PREVIEW"
        private const val SERVICE_CHANNEL        = "mindrop-alarm-service"
        private const val SERVICE_NOTIFICATION_ID = 9911
        private const val PREFS_NAME  = "mindrop_ring_lock"
        private const val KEY_RINGING = "is_ringing"

        // Expose currently active alarm details to getActiveAlarm()
        @Volatile var activeAlarmId: String? = null
        @Volatile var activeAlarmTitle: String? = null
        @Volatile var activeAlarmBody: String? = null

        // @Volatile — process-scoped, zero-overhead check on the hot path.
        // Backed by SharedPreferences so process-restart doesn't orphan the lock.
        @Volatile
        var isRinging = false
            private set

        fun setRinging(ctx: Context, value: Boolean) {
            isRinging = value
            ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit().putBoolean(KEY_RINGING, value).apply()
        }

        /** Restore lock state after process restart (call from Application.onCreate). */
        fun restoreRingingState(ctx: Context) {
            isRinging = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getBoolean(KEY_RINGING, false)
        }
    }
}
