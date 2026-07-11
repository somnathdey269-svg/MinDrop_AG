package app.getmindrop.places

import android.Manifest
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingClient
import com.google.android.gms.location.GeofencingRequest
import com.google.android.gms.location.LocationServices

/**
 * Registers Android OS geofences so enter/exit fires even when the app is
 * fully closed. Mirrors the JS PlacesBridge API in src/lib/places/bridge.ts.
 *
 * Requires build.gradle: implementation "com.google.android.gms:play-services-location:21.3.0"
 */
@CapacitorPlugin(
    name = "PlacesBridge",
    permissions = [
        Permission(
            alias = "foreground",
            strings = [Manifest.permission.ACCESS_FINE_LOCATION]
        ),
        Permission(
            alias = "background",
            strings = [Manifest.permission.ACCESS_BACKGROUND_LOCATION]
        )
    ]
)
class PlacesBridgePlugin : Plugin() {

    private lateinit var client: GeofencingClient

    override fun load() {
        client = LocationServices.getGeofencingClient(context)
    }

    private fun granted(perm: String): Boolean =
        ContextCompat.checkSelfPermission(context, perm) == PackageManager.PERMISSION_GRANTED

    private fun permissionStatus(): JSObject {
        val fg = granted(Manifest.permission.ACCESS_FINE_LOCATION)
        val bg = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
            granted(Manifest.permission.ACCESS_BACKGROUND_LOCATION) else fg
        return JSObject().put("foreground", fg).put("background", bg)
    }

    @PluginMethod
    fun hasPermission(call: PluginCall) { call.resolve(permissionStatus()) }

    @PluginMethod
    fun requestPermission(call: PluginCall) {
        if (!granted(Manifest.permission.ACCESS_FINE_LOCATION)) {
            requestPermissionForAlias("foreground", call, "afterForeground")
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
            && !granted(Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
            requestPermissionForAlias("background", call, "afterBackground")
        } else {
            call.resolve(permissionStatus())
        }
    }

    @PermissionCallback
    private fun afterForeground(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
            && granted(Manifest.permission.ACCESS_FINE_LOCATION)
            && !granted(Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
            requestPermissionForAlias("background", call, "afterBackground")
        } else {
            call.resolve(permissionStatus())
        }
    }

    @PermissionCallback
    private fun afterBackground(call: PluginCall) { call.resolve(permissionStatus()) }

    @PluginMethod
    fun openPermissionSettings(call: PluginCall) {
        val i = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
            Uri.fromParts("package", context.packageName, null))
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(i)
        call.resolve()
    }

    @PluginMethod
    fun startDwellService(call: PluginCall) {
        try { GeofenceDwellService.start(context) } catch (_: Throwable) {}
        call.resolve()
    }

    @PluginMethod
    fun stopDwellService(call: PluginCall) {
        try { GeofenceDwellService.stop(context) } catch (_: Throwable) {}
        call.resolve()
    }

    private fun pendingIntent(): PendingIntent {
        val i = Intent(context, GeofenceReceiver::class.java)
            .setAction("app.getmindrop.places.TRANSITION")
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        return PendingIntent.getBroadcast(context, 0, i, flags)
    }

    @PluginMethod
    fun registerFences(call: PluginCall) {
        if (!granted(Manifest.permission.ACCESS_FINE_LOCATION)) {
            call.reject("Location permission not granted"); return
        }
        val arr = call.getArray("fences") ?: run { call.reject("fences required"); return }
        val list = mutableListOf<Geofence>()
        for (i in 0 until arr.length()) {
            val f = arr.getJSONObject(i)
            val type = when (f.optString("transitionType", "both")) {
                "enter" -> Geofence.GEOFENCE_TRANSITION_ENTER
                "exit"  -> Geofence.GEOFENCE_TRANSITION_EXIT
                else    -> Geofence.GEOFENCE_TRANSITION_ENTER or Geofence.GEOFENCE_TRANSITION_EXIT
            }
            list.add(
                Geofence.Builder()
                    .setRequestId(f.getString("id"))
                    .setCircularRegion(f.getDouble("lat"), f.getDouble("lng"),
                        f.getDouble("radiusM").toFloat())
                    .setExpirationDuration(Geofence.NEVER_EXPIRE)
                    .setTransitionTypes(type)
                    .setNotificationResponsiveness(30_000)
                    .build()
            )
        }
        if (list.isEmpty()) { call.resolve(); return }
        val req = GeofencingRequest.Builder()
            .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
            .addGeofences(list).build()
        client.addGeofences(req, pendingIntent())
            .addOnSuccessListener { call.resolve() }
            .addOnFailureListener { call.reject("addGeofences failed: ${it.message}") }
    }

    @PluginMethod
    fun clearFences(call: PluginCall) {
        val ids = call.getArray("ids")
        if (ids != null && ids.length() > 0) {
            val list = (0 until ids.length()).map { ids.getString(it) }
            client.removeGeofences(list)
                .addOnCompleteListener { call.resolve() }
        } else {
            client.removeGeofences(pendingIntent())
                .addOnCompleteListener { call.resolve() }
        }
    }

    @PluginMethod
    fun getCurrentPosition(call: PluginCall) {
        if (!granted(Manifest.permission.ACCESS_FINE_LOCATION)) {
            call.reject("Location permission not granted"); return
        }
        LocationServices.getFusedLocationProviderClient(context).lastLocation
            .addOnSuccessListener { loc ->
                if (loc == null) { call.reject("No last location"); return@addOnSuccessListener }
                call.resolve(JSObject()
                    .put("lat", loc.latitude)
                    .put("lng", loc.longitude)
                    .put("accuracy", loc.accuracy.toDouble()))
            }
            .addOnFailureListener { call.reject(it.message ?: "location failed") }
    }

    /** Called by GeofenceReceiver when the OS delivers a transition while the app is alive. */
    fun emitTransition(placeId: String, kind: String, lat: Double, lng: Double, at: Long) {
        val data = JSObject()
            .put("placeId", placeId).put("kind", kind)
            .put("lat", lat).put("lng", lng).put("at", at)
        notifyListeners("placeTransition", data)
    }

    companion object {
        @Volatile var instance: PlacesBridgePlugin? = null
    }

    override fun handleOnStart() { super.handleOnStart(); instance = this }
    override fun handleOnDestroy() { super.handleOnDestroy(); if (instance === this) instance = null }
}
