package app.getmindrop.places

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

/**
 * GeofenceDwellService — optional foreground service the app starts when the
 * user has any "dwell" or high-reliability place rules active. On Android 12+,
 * OS geofences alone can be throttled aggressively when the app is fully
 * unloaded; a foreground service with FOREGROUND_SERVICE_LOCATION keeps the
 * process warm and geofence delivery immediate.
 *
 * Start from JS via a future PlacesBridge.startDwellService() call; for now
 * it can be started manually via:
 *   Intent(ctx, GeofenceDwellService::class.java).also { ContextCompat.startForegroundService(ctx, it) }
 */
class GeofenceDwellService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        ensureChannel()
        val n = NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle("MinDrop places active")
            .setContentText("Watching for your saved places.")
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION)
        } else {
            startForeground(NOTIF_ID, n)
        }
        // START_STICKY: the OS restarts us if killed while there are active fences.
        return START_STICKY
    }

    private fun ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = getSystemService(NotificationManager::class.java) ?: return
        if (nm.getNotificationChannel(CHANNEL) == null) {
            nm.createNotificationChannel(NotificationChannel(
                CHANNEL, "MinDrop places (background)",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shown while MinDrop is watching your saved places."
                setShowBadge(false)
            })
        }
    }

    companion object {
        private const val CHANNEL = "mindrop-places-fg"
        private const val NOTIF_ID = 4711

        fun start(ctx: Context) {
            val i = Intent(ctx, GeofenceDwellService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ctx.startForegroundService(i)
            else ctx.startService(i)
        }

        fun stop(ctx: Context) {
            ctx.stopService(Intent(ctx, GeofenceDwellService::class.java))
        }
    }
}
