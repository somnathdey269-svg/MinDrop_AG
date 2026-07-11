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
}
