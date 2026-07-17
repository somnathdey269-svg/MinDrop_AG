package app.getmindrop.notify

import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.ContactsContract
import android.provider.Settings
import androidx.core.app.NotificationManagerCompat
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import java.util.concurrent.ConcurrentHashMap

/**
 * NotifyBridge — matches the JS interface in src/lib/notify/bridge.ts.
 *
 *  hasPermission()               → is notification-access enabled?
 *  openPermissionSettings()      → deep-link to the OS toggle
 *  openContactsPicker()          → returns { name, phone? }
 *  launchNotification({ id })    → re-fires cached PendingIntent
 *  launchApp({ pkg })            → opens another app
 *  event "notificationPosted"    → from MindDropNotificationListener
 */
@CapacitorPlugin(name = "NotifyBridge")
class NotifyBridgePlugin : Plugin() {

    // ─── permission ────────────────────────────────────────────────────

    private fun accessGranted(): Boolean {
        val pkgs = NotificationManagerCompat.getEnabledListenerPackages(context)
        return pkgs.contains(context.packageName)
    }

    @PluginMethod
    fun hasPermission(call: PluginCall) {
        call.resolve(JSObject().put("granted", accessGranted()))
    }

    @PluginMethod
    fun openPermissionSettings(call: PluginCall) {
        // Preferred: land the user on OUR row on Android 11+.
        val direct = Intent(Settings.ACTION_NOTIFICATION_LISTENER_DETAIL_SETTINGS).apply {
            val cn = ComponentName(context, MindDropNotificationListener::class.java)
            putExtra(Settings.EXTRA_NOTIFICATION_LISTENER_COMPONENT_NAME, cn.flattenToString())
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        val fallback = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { context.startActivity(direct) } catch (_: Throwable) {
            try { context.startActivity(fallback) } catch (_: Throwable) {}
        }
        call.resolve()
    }

    // ─── contacts picker ───────────────────────────────────────────────

    private var pickCall: PluginCall? = null

    @PluginMethod
    fun openContactsPicker(call: PluginCall) {
        pickCall = call
        val i = Intent(Intent.ACTION_PICK, ContactsContract.CommonDataKinds.Phone.CONTENT_URI)
        startActivityForResult(call, i, "afterContactPick")
    }

    @com.getcapacitor.annotation.ActivityCallback
    private fun afterContactPick(call: PluginCall, result: androidx.activity.result.ActivityResult) {
        val out = JSObject()
        val data = result.data
        val uri: Uri? = data?.data
        if (uri != null) {
            try {
                context.contentResolver.query(
                    uri,
                    arrayOf(
                        ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                        ContactsContract.CommonDataKinds.Phone.NUMBER
                    ), null, null, null
                )?.use { c ->
                    if (c.moveToFirst()) {
                        out.put("name", c.getString(0))
                        out.put("phone", c.getString(1))
                    }
                }
            } catch (_: Throwable) {}
        }
        call.resolve(out)
    }

    // ─── re-fire another app's notification / launch app ───────────────

    @PluginMethod
    fun launchNotification(call: PluginCall) {
        val id = call.getString("id") ?: run { call.reject("id required"); return }
        val pi = pendingIntents[id]
        if (pi == null) { call.resolve(JSObject().put("ok", false)); return }
        try { pi.send(); call.resolve(JSObject().put("ok", true)) }
        catch (t: Throwable) { call.resolve(JSObject().put("ok", false).put("error", t.message ?: "")) }
    }

    @PluginMethod
    fun launchApp(call: PluginCall) {
        val pkg = call.getString("pkg") ?: run { call.reject("pkg required"); return }
        val i = context.packageManager.getLaunchIntentForPackage(pkg)
        if (i == null) { call.resolve(JSObject().put("ok", false)); return }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { context.startActivity(i); call.resolve(JSObject().put("ok", true)) }
        catch (t: Throwable) { call.resolve(JSObject().put("ok", false).put("error", t.message ?: "")) }
    }

    // ─── rule snapshot / pending drain ─────────────────────────────────

    @PluginMethod
    fun syncRules(call: PluginCall) {
        val rules = call.getArray("rules") ?: JSArray()
        val prefs = context.getSharedPreferences(
            MindDropNotificationListener.PREFS, Context.MODE_PRIVATE
        )
        prefs.edit().putString(MindDropNotificationListener.KEY_RULES, rules.toString()).apply()
        call.resolve()
    }

    @PluginMethod
    fun drainPendingEvents(call: PluginCall) {
        val prefs = context.getSharedPreferences(
            MindDropNotificationListener.PREFS, Context.MODE_PRIVATE
        )
        val raw = prefs.getString(MindDropNotificationListener.KEY_PENDING, "[]") ?: "[]"
        val arr = try { JSONArray(raw) } catch (_: Throwable) { JSONArray() }
        prefs.edit().remove(MindDropNotificationListener.KEY_PENDING).apply()
        val out = JSObject()
        out.put("events", JSArray(arr.toString()))
        call.resolve(out)
    }

    // ─── emission from listener ────────────────────────────────────────

    fun emitNotification(
        id: String, pkg: String, appName: String,
        title: String, text: String, bigText: String?, subText: String?,
        priority: Int, timestamp: Long, isMessaging: Boolean, isAlarmActive: Boolean
    ) {
        val o = JSObject()
            .put("id", id)
            .put("pkg", pkg)
            .put("appName", appName)
            .put("title", title)
            .put("text", text)
            .put("priority", priority)
            .put("timestamp", timestamp)
            .put("isMessaging", isMessaging)
            .put("isAlarmActive", isAlarmActive)
        if (bigText != null) o.put("bigText", bigText)
        if (subText != null) o.put("subText", subText)
        notifyListeners("notificationPosted", o)
    }

    companion object {
        @Volatile var instance: NotifyBridgePlugin? = null
        @Volatile var listenerConnected: Boolean = false
        private val pendingIntents = ConcurrentHashMap<String, PendingIntent>()
        private const val MAX_CACHE = 128
        private val order = ArrayDeque<String>()

        fun cacheContentIntent(id: String, pi: PendingIntent?) {
            if (pi == null) return
            synchronized(order) {
                if (pendingIntents.put(id, pi) == null) order.addLast(id)
                while (order.size > MAX_CACHE) {
                    val old = order.removeFirst()
                    pendingIntents.remove(old)
                }
            }
        }

        fun markListenerConnected(v: Boolean) { listenerConnected = v }
    }

    override fun handleOnStart() { super.handleOnStart(); instance = this }
    override fun handleOnDestroy() { super.handleOnDestroy(); if (instance === this) instance = null }
}
