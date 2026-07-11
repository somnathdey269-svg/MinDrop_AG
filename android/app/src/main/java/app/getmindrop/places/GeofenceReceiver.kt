package app.getmindrop.places

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingEvent

/**
 * Fires when the OS detects enter/exit on a registered fence — even if the
 * app process is fully dead. Posts a system notification and (if the app is
 * alive) forwards the event to the JS layer via PlacesBridgePlugin.
 */
class GeofenceReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val ev = GeofencingEvent.fromIntent(intent) ?: return
        if (ev.hasError()) return

        val kind = when (ev.geofenceTransition) {
            Geofence.GEOFENCE_TRANSITION_ENTER -> "enter"
            Geofence.GEOFENCE_TRANSITION_EXIT  -> "exit"
            else -> return
        }
        val loc = ev.triggeringLocation
        val lat = loc?.latitude ?: 0.0
        val lng = loc?.longitude ?: 0.0
        val at = System.currentTimeMillis()

        ensureChannel(context)
        val nm = context.getSystemService(NotificationManager::class.java)
        var idSeed = at.toInt()

        for (fence in ev.triggeringGeofences ?: emptyList()) {
            val placeId = fence.requestId
            postNotification(context, nm, idSeed++, placeId, kind)
            // If app is alive, hand to JS.
            PlacesBridgePlugin.instance?.emitTransition(placeId, kind, lat, lng, at)
        }
    }

    private fun ensureChannel(ctx: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val nm = ctx.getSystemService(NotificationManager::class.java)
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return
        nm.createNotificationChannel(NotificationChannel(
            CHANNEL_ID, "MinDrop places",
            NotificationManager.IMPORTANCE_HIGH
        ).apply { description = "Fires when you arrive at or leave a saved place" })
    }

    private fun postNotification(ctx: Context, nm: NotificationManager, id: Int, placeId: String, kind: String) {
        val title = if (kind == "enter") "You arrived somewhere" else "You just left"
        val body = "MinDrop reminder for place $placeId"
        val n = NotificationCompat.Builder(ctx, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_map)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        nm.notify(id, n)
    }

    companion object { private const val CHANNEL_ID = "mindrop-places" }
}
