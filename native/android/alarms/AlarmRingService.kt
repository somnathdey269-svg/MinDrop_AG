package app.getmindrop.alarms

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

/**
 * AlarmRingService — foreground service that actually plays the alarm tone
 * on the ALARM audio stream and vibrates. Started by AlarmReceiver when a
 * scheduled alarm fires; stopped by the Stop / Snooze notification actions
 * or the JS AlarmSheet.
 */
class AlarmRingService : Service() {

    private var player: MediaPlayer? = null
    private var vibrator: Vibrator? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_RING
        when (action) {
            ACTION_STOP -> {
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
                val toneId = intent?.getStringExtra("toneId") ?: "classic"
                startForegroundIfNeeded("Alarm ringing")
                startTone(toneId, vibrate = true)
                return START_NOT_STICKY
            }
        }
    }

    private fun startForegroundIfNeeded(text: String) {
        ensureServiceChannel()
        val n: Notification = NotificationCompat.Builder(this, SERVICE_CHANNEL)
            .setContentTitle("MinDrop")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(
                    SERVICE_NOTIFICATION_ID, n,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
                )
            } else {
                startForeground(SERVICE_NOTIFICATION_ID, n)
            }
        } catch (_: Throwable) {
            try { startForeground(SERVICE_NOTIFICATION_ID, n) } catch (_: Throwable) {}
        }
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
            // Silent tone or missing resource — vibrate only.
            if (vibrate) startVibration()
            return
        }
        try {
            player = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                isLooping = true
                setDataSource(this@AlarmRingService, uri)
                prepare()
                start()
            }
        } catch (_: Throwable) {
            player = null
            try {
                // Fall back to system default alarm.
                val def = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                player = MediaPlayer().apply {
                    setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
                    )
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
        stopPlayback()
        try { stopForeground(STOP_FOREGROUND_REMOVE) } catch (_: Throwable) {}
        stopSelf()
    }

    override fun onDestroy() {
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
        const val ACTION_RING = "app.getmindrop.alarms.RING"
        const val ACTION_STOP = "app.getmindrop.alarms.RING_STOP"
        const val ACTION_PREVIEW = "app.getmindrop.alarms.RING_PREVIEW"
        private const val SERVICE_CHANNEL = "mindrop-alarm-service"
        private const val SERVICE_NOTIFICATION_ID = 9911
    }
}
