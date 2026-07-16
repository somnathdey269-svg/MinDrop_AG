package app.getmindrop.alarms

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/**
 * Persistent storage of scheduled alarms so the BootCompletedReceiver can
 * rehydrate them after a reboot / app upgrade. Backed by SharedPreferences.
 *
 * Storage shape (one JSON blob under key "alarms"):
 *   [ { "id": "...", "at": 1730000000000, "title": "...",
 *       "body": "...", "delivery": "alarm|notify",
 *       "toneId": "classic", "exact": true } ]
 */
object AlarmStore {
    private const val PREFS = "mindrop.alarms"
    private const val KEY = "alarms"
    private const val KEY_DEFAULT_TONE = "defaultToneId"

    data class Entry(
        val id: String,
        val at: Long,
        val title: String,
        val body: String,
        /** "alarm" = ring loudly with tone; "notify" = silent heads-up */
        val delivery: String,
        val toneId: String,
        val exact: Boolean,
        val extra: String? = null
    )

    fun readAll(ctx: Context): MutableList<Entry> {
        val raw = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(KEY, "[]") ?: "[]"
        val out = mutableListOf<Entry>()
        try {
            val arr = JSONArray(raw)
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                // legacy field: "channelId" == "mindrop-alarm" → alarm
                val legacyChannel = o.optString("channelId", "")
                val delivery = when {
                    o.has("delivery") -> o.getString("delivery")
                    legacyChannel == "mindrop-alarm" -> "alarm"
                    else -> "notify"
                }
                out.add(
                    Entry(
                        id = o.getString("id"),
                        at = o.getLong("at"),
                        title = o.optString("title", "MinDrop reminder"),
                        body = o.optString("body", ""),
                        delivery = delivery,
                        toneId = o.optString("toneId", "classic"),
                        exact = o.optBoolean("exact", true),
                        extra = if (o.has("extra")) o.getString("extra") else null
                    )
                )
            }
        } catch (_: Throwable) {}
        return out
    }

    fun writeAll(ctx: Context, entries: List<Entry>) {
        val arr = JSONArray()
        entries.forEach {
            val o = JSONObject()
                .put("id", it.id)
                .put("at", it.at)
                .put("title", it.title)
                .put("body", it.body)
                .put("delivery", it.delivery)
                .put("toneId", it.toneId)
                .put("exact", it.exact)
            if (it.extra != null) o.put("extra", it.extra)
            arr.put(o)
        }
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(KEY, arr.toString()).apply()
    }

    fun upsert(ctx: Context, entry: Entry) {
        val list = readAll(ctx).filter { it.id != entry.id }.toMutableList()
        list.add(entry)
        writeAll(ctx, list)
    }

    fun find(ctx: Context, id: String): Entry? =
        readAll(ctx).firstOrNull { it.id == id }

    fun remove(ctx: Context, id: String) {
        writeAll(ctx, readAll(ctx).filter { it.id != id })
    }

    fun clear(ctx: Context) {
        writeAll(ctx, emptyList())
    }

    fun getDefaultToneId(ctx: Context): String =
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(KEY_DEFAULT_TONE, "classic") ?: "classic"

    fun setDefaultToneId(ctx: Context, id: String) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(KEY_DEFAULT_TONE, id).apply()
    }

    /** Stable int request code from a string id. */
    fun requestCode(id: String): Int {
        var h = 0
        for (c in id) h = ((h shl 5) - h + c.code) or 0
        return kotlin.math.abs(h).let { if (it == 0) 1 else it }
    }

    // ─── Local-only "last fired" ring buffer (max 20 entries) ─────────────
    // Used by the Diagnostics screen to verify alarms actually delivered.
    // Never leaves the device.

    private const val KEY_FIRED_LOG = "firedLog"
    private const val MAX_FIRED = 20

    data class FiredEntry(val id: String, val at: Long, val title: String, val delivery: String)

    fun recordFired(ctx: Context, entry: Entry) {
        val list = readFiredLog(ctx).toMutableList()
        list.add(0, FiredEntry(entry.id, System.currentTimeMillis(), entry.title, entry.delivery))
        while (list.size > MAX_FIRED) list.removeAt(list.size - 1)
        val arr = JSONArray()
        list.forEach {
            arr.put(JSONObject()
                .put("id", it.id)
                .put("at", it.at)
                .put("title", it.title)
                .put("delivery", it.delivery))
        }
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(KEY_FIRED_LOG, arr.toString()).apply()
    }

    fun readFiredLog(ctx: Context): List<FiredEntry> {
        val raw = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(KEY_FIRED_LOG, "[]") ?: "[]"
        val out = mutableListOf<FiredEntry>()
        try {
            val arr = JSONArray(raw)
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                out.add(FiredEntry(
                    id = o.optString("id"),
                    at = o.optLong("at"),
                    title = o.optString("title"),
                    delivery = o.optString("delivery", "alarm")
                ))
            }
        } catch (_: Throwable) {}
        return out
    }

    // ─── Active-Alarm Registry ─────────────────────────────────────────────
    // Prevents the same pkg+conversation from re-triggering the alarm while
    // one is still active. Key = "active_{pkg}_{conversationHash}".
    // Cleared ONLY when the user explicitly taps Stop (not Snooze).

    private const val ACTIVE_PREFIX = "active_"

    /**
     * Call when an alarm is fired for a given pkg + conversation title.
     * This blocks re-triggers from the same conversation until clearAlarmActive().
     */
    fun markAlarmActive(ctx: Context, pkg: String, conversationTitle: String) {
        val key = ACTIVE_PREFIX + "${pkg}_${conversationTitle}".hashCode()
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putLong(key, System.currentTimeMillis()).apply()
    }

    /**
     * Returns true if an alarm is already active for this pkg+conversation.
     * We treat it as "still active" for up to 30 minutes — after that we
     * allow a new trigger (covers the case the user killed the app mid-alarm).
     */
    fun isAlarmActive(ctx: Context, pkg: String, conversationTitle: String): Boolean {
        val key = ACTIVE_PREFIX + "${pkg}_${conversationTitle}".hashCode()
        val firedAt = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getLong(key, 0L)
        if (firedAt == 0L) return false
        return (System.currentTimeMillis() - firedAt) < 30 * 60 * 1000L // 30 min window
    }

    /**
     * Call when the user taps Stop. Clears the active marker so a future
     * message from the same contact can trigger again if rules match.
     */
    fun clearAlarmActive(ctx: Context, pkg: String, conversationTitle: String) {
        val key = ACTIVE_PREFIX + "${pkg}_${conversationTitle}".hashCode()
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().remove(key).apply()
    }

    /**
     * Convenience: clear ALL active alarm markers (called on global stop).
     */
    fun clearAllActiveAlarms(ctx: Context) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val toRemove = prefs.all.keys.filter { it.startsWith(ACTIVE_PREFIX) }
        prefs.edit().apply { toRemove.forEach { remove(it) } }.apply()
    }

    // ─── Stopped & Snoozed Alarms Registry ─────────────────────────────────
    // Tracks alarms that were stopped/snoozed from the notification drawer
    // while the app was closed. Read/cleared by JS on resume.

    private const val KEY_STOPPED = "stoppedAlarms"
    private const val KEY_SNOOZED = "snoozedAlarms"

    fun recordStoppedAlarm(ctx: Context, id: String) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val current = prefs.getStringSet(KEY_STOPPED, emptySet())?.toMutableSet() ?: mutableSetOf()
        current.add(id)
        prefs.edit().putStringSet(KEY_STOPPED, current).apply()
    }

    fun getStoppedAlarms(ctx: Context): Set<String> {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_STOPPED, emptySet()) ?: emptySet()
    }

    fun recordSnoozedAlarm(ctx: Context, id: String, minutes: Int) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val raw = prefs.getString(KEY_SNOOZED, "[]") ?: "[]"
        try {
            val arr = JSONArray(raw)
            // JSON shape matches { "id": "...", "minutes": N }
            val o = JSONObject().put("id", id).put("minutes", minutes)
            arr.put(o)
            prefs.edit().putString(KEY_SNOOZED, arr.toString()).apply()
        } catch (_: Throwable) {}
    }

    fun getSnoozedAlarmsJson(ctx: Context): String {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        return prefs.getString(KEY_SNOOZED, "[]") ?: "[]"
    }

    fun clearStoppedAlarms(ctx: Context) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs.edit().remove(KEY_STOPPED).remove(KEY_SNOOZED).apply()
    }
}
