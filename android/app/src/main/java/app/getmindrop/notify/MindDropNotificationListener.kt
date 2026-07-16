package app.getmindrop.notify

import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.json.JSONArray
import org.json.JSONObject

/**
 * Reads notifications from other apps, evaluates the compact native rule
 * snapshot on-device, and (a) forwards raw events to JS for the inbox and
 * (b) fires an alarm notification directly when a rule matches — so the
 * user still gets pinged when the WebView is dead.
 */
class MindDropNotificationListener : NotificationListenerService() {

    private val prefs: SharedPreferences by lazy {
        applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        try {
            val n = sbn.notification ?: return
            if (sbn.packageName == packageName) return

            // ── Fix 4: Skip group-summary notifications ───────────────────
            // Android bundles individual notifications into a group summary
            // (FLAG_GROUP_SUMMARY). Processing summaries causes the same
            // message to trigger an alarm twice — once for the individual
            // notification and once for the summary. We only want to evaluate
            // the individual, atomic notification.
            if ((n.flags and android.app.Notification.FLAG_GROUP_SUMMARY) != 0) return

            val extracted = extractContent(n)
            val title = extracted.title
            val text = extracted.text
            val bigText = extracted.bigText
            val subText = extracted.subText
            if (title.isBlank() && text.isBlank() && bigText.isNullOrBlank()) return

            val appName = resolveAppLabel(sbn.packageName)
            val id = "${sbn.packageName}#${sbn.postTime}#${sbn.id}"

            NotifyBridgePlugin.cacheContentIntent(id, n.contentIntent)

            // 1. Evaluate rules natively so we fire even when JS is dead.
            evaluateAndFire(sbn.packageName, appName, title, text, bigText, n.priority)

            // 2. Buffer the raw event so JS can drain on next open.
            bufferEvent(id, sbn.packageName, appName, title, text, bigText, subText, n.priority, sbn.postTime)

            // 3. Live forward to JS if it's alive.
            NotifyBridgePlugin.instance?.emitNotification(
                id = id,
                pkg = sbn.packageName,
                appName = appName,
                title = title,
                text = text,
                bigText = bigText,
                subText = subText,
                priority = n.priority,
                timestamp = sbn.postTime
            )
        } catch (_: Throwable) {
            // Never crash the listener — Android will disable us if we do.
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) { /* no-op */ }

    override fun onListenerConnected() {
        super.onListenerConnected()
        NotifyBridgePlugin.markListenerConnected(true)
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        NotifyBridgePlugin.markListenerConnected(false)
    }

    private fun resolveAppLabel(pkg: String): String {
        return try {
            val pm = packageManager
            val ai = pm.getApplicationInfo(pkg, 0)
            pm.getApplicationLabel(ai).toString()
        } catch (_: PackageManager.NameNotFoundException) { pkg }
        catch (_: Throwable) { pkg }
    }

    private fun evaluateAndFire(
        pkg: String, appName: String, title: String, text: String,
        bigText: String?, priority: Int
    ) {
        val snap = prefs.getString(KEY_RULES, null) ?: return
        val arr = try { JSONArray(snap) } catch (_: Throwable) { return }

        // ── Normalize conversation title ───────────────────────────────────
        // Apps like WhatsApp update the notification title as messages accumulate:
        //   "Mr. X" → "Mr. X (2 messages)" → "Mr. X (5 messages)"
        // Strip the suffix so all updates map to the same conversation key.
        val conversationTitle = normalizeConversationTitle(title)

        // Use only the latest message text for keyword matching.
        // For MessagingStyle notifications (WhatsApp, etc.) bigText contains ALL
        // messages in the conversation thread. We only want the newest one
        // (EXTRA_TEXT) so old unread messages don't re-trigger the alarm.
        val hay = "$conversationTitle\n$text".lowercase()

        val dedupeKey = "$pkg::$conversationTitle::$text".hashCode()
        val now = System.currentTimeMillis()
        // 60s dedupe on exact same title+text
        val lastDedupe = prefs.getLong("dedupe_$dedupeKey", 0L)
        if (now - lastDedupe < 60_000L) return

        for (i in 0 until arr.length()) {
            val r = arr.optJSONObject(i) ?: continue
            val ruleId = r.optString("id")
            if (r.optString("pkg") != pkg) continue
            if (r.optBoolean("priorityOnly", false) && priority < 1) continue

            // ── Fix 2 & 3: Permanent once-rule guard ──────────────────────
            // "once" rules that the user has stopped (or that have already
            // fired once) are written into the stopped-rules set. They must
            // NEVER fire again — not even after a phone restart — because
            // SharedPreferences survives reboots.
            val frequency = r.optString("frequency", "once")
            if (frequency == "once" && isRuleStopped(ruleId)) continue

            val kwArr = r.optJSONArray("keywords") ?: JSONArray()
            var match = kwArr.length() == 0
            if (!match) {
                for (k in 0 until kwArr.length()) {
                    val kw = kwArr.optString(k, "").lowercase()
                    if (kw.isNotBlank() && hay.contains(kw)) { match = true; break }
                }
            }
            if (!match) continue

            // ── Active-alarm guard (for always-rules) ─────────────────────
            // Uses NORMALIZED title so "Mr. X" and "Mr. X (2 messages)" map
            // to the same conversation slot in the registry.
            if (app.getmindrop.alarms.AlarmStore.isAlarmActive(
                    applicationContext, pkg, conversationTitle)) {
                return // alarm already active for this conversation — skip
            }

            val delivery = r.optString("delivery", "notification")
            if (delivery == "alarm") {
                // ── Single-alarm ownership guard ──────────────────────────────
                // Rule: JS alive → JS owns the alarm. Native → only when JS dead.
                if (NotifyBridgePlugin.instance != null) {
                    prefs.edit().putLong("dedupe_$dedupeKey", now).apply()
                    break
                }
                fireNativeAlarm(
                    pkg = pkg,
                    conversationTitle = conversationTitle,
                    ruleId = ruleId,
                    titleOverride = r.optString("title", "$appName alert"),
                    bodyOverride = r.optString("body", "").ifBlank { "$conversationTitle · $text" }.take(240)
                )
            } else {
                fireAlarm(
                    ruleId = ruleId,
                    titleOverride = r.optString("title", "$appName alert"),
                    bodyOverride = r.optString("body", "").ifBlank { "$title · $text" }.take(240)
                )
            }

            // ── Fix 3: Retire once-rules permanently after first fire ──────
            if (frequency == "once") markRuleStopped(ruleId)

            prefs.edit().putLong("dedupe_$dedupeKey", now).apply()
            break // one alarm per notification
        }
    }

    // ── Conversation title normalizer ─────────────────────────────────────
    // Strips the " (N messages)" or " (N new messages)" suffix that messaging
    // apps append when a thread accumulates unread messages. Without this,
    // "Mr. X" and "Mr. X (2 messages)" hash to different active-alarm keys
    // and the guard fails → second alarm fires for the same conversation.
    private fun normalizeConversationTitle(title: String): String {
        // Matches patterns like " (2 messages)", " (5 new messages)", " (1 message)"
        return title.replace(Regex("\\s*\\(\\d+\\s+(new\\s+)?messages?\\)\\s*$"), "").trim()
    }

    // ── Stopped-rules set ────────────────────────────────────────────────
    // Persisted in SharedPreferences (survives reboots). Written when a
    // once-rule fires OR when the user explicitly taps Stop on any alarm
    // that originated from a once-rule. Checked before every evaluateAndFire.

    private fun isRuleStopped(ruleId: String): Boolean =
        prefs.getBoolean("stopped_rule_$ruleId", false)

    fun markRuleStopped(ruleId: String) {
        prefs.edit().putBoolean("stopped_rule_$ruleId", true).apply()
    }

    /**
     * Schedule an immediate loud alarm so it rings even if the WebView is dead.
     * Also marks the alarm as "active" for this pkg+conversation so subsequent
     * notification updates from the same thread do NOT re-trigger.
     */
    private fun fireNativeAlarm(
        pkg: String, conversationTitle: String,
        ruleId: String, titleOverride: String, bodyOverride: String
    ) {
        try {
            val ctx = applicationContext
            val toneId = app.getmindrop.alarms.AlarmStore.getDefaultToneId(ctx)
            app.getmindrop.alarms.AlarmChannels.ensureAlarmChannel(ctx, toneId)
            val alarmId = "notify-$ruleId-${System.currentTimeMillis()}"
            val entry = app.getmindrop.alarms.AlarmStore.Entry(
                id = alarmId,
                at = System.currentTimeMillis(),
                title = titleOverride,
                body = bodyOverride,
                delivery = "alarm",
                toneId = toneId,
                exact = true,
                // Format: "active_key::{pkg}::{conversationTitle}::{ruleId}"
                // AlarmReceiver uses these parts to clear all state on Stop.
                extra = "active_key::${pkg}::${conversationTitle}::${ruleId}"
            )
            app.getmindrop.alarms.AlarmStore.upsert(ctx, entry)
            app.getmindrop.alarms.AlarmScheduler.schedule(ctx, entry)
            // Mark this conversation as "alarm active" — blocks re-triggers
            app.getmindrop.alarms.AlarmStore.markAlarmActive(ctx, pkg, conversationTitle)
        } catch (e: Throwable) {
            fireAlarm(ruleId, titleOverride, bodyOverride)
        }
    }

    private fun fireAlarm(ruleId: String, titleOverride: String, bodyOverride: String) {
        try {
            val nm = NotificationManagerCompat.from(applicationContext)
            // Ensure channel (Alarms plugin already creates mindrop_reminders on init).
            val channel = "mindrop_reminders"
            val launch = packageManager.getLaunchIntentForPackage(packageName)?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            }
            val pi = launch?.let {
                PendingIntent.getActivity(
                    applicationContext, ruleId.hashCode(), it,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            }
            val builder = NotificationCompat.Builder(applicationContext, channel)
                .setSmallIcon(applicationInfo.icon)
                .setContentTitle(titleOverride)
                .setContentText(bodyOverride)
                .setStyle(NotificationCompat.BigTextStyle().bigText(bodyOverride))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setAutoCancel(true)
            if (pi != null) builder.setContentIntent(pi)
            nm.notify(("mindrop-notify-" + ruleId.hashCode()).hashCode(), builder.build())
        } catch (_: SecurityException) { /* POST_NOTIFICATIONS not granted */ }
        catch (_: Throwable) {}
    }

    private fun bufferEvent(
        id: String, pkg: String, appName: String, title: String, text: String,
        bigText: String?, subText: String?, priority: Int, timestamp: Long
    ) {
        try {
            val raw = prefs.getString(KEY_PENDING, "[]") ?: "[]"
            val arr = try { JSONArray(raw) } catch (_: Throwable) { JSONArray() }
            val o = JSONObject()
                .put("id", id).put("pkg", pkg).put("appName", appName)
                .put("title", title).put("text", text)
                .put("priority", priority).put("timestamp", timestamp)
            if (bigText != null) o.put("bigText", bigText)
            if (subText != null) o.put("subText", subText)
            arr.put(o)
            // cap 200
            while (arr.length() > 200) arr.remove(0)
            prefs.edit().putString(KEY_PENDING, arr.toString()).apply()
        } catch (_: Throwable) {}
    }

    private data class Extracted(
        val title: String, val text: String,
        val bigText: String?, val subText: String?
    )

    /**
     * Modern messaging apps (Google Messages, WhatsApp, Signal, Telegram…) use
     * MessagingStyle and leave EXTRA_TEXT set to a redacted placeholder like
     * "Sensitive notification content hidden". The real body lives inside
     * EXTRA_MESSAGES (array of Bundles with "text" + "sender"). We also fall
     * back to EXTRA_TEXT_LINES and tickerText before giving up on EXTRA_TEXT.
     */
    private fun extractContent(n: Notification): Extracted {
        val extras = n.extras
        var title = extras?.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty()
        var text = extras?.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty()
        var bigText = extras?.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()
        val subText = extras?.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()

        val looksRedacted = text.equals("Sensitive notification content hidden", true) ||
            text.contains("notification content hidden", true) ||
            text.contains("New message", true) && title.isBlank()

        // 1. MessagingStyle: EXTRA_MESSAGES is a Parcelable[] of Bundles.
        try {
            val msgs = extras?.getParcelableArray(Notification.EXTRA_MESSAGES)
            if (msgs != null && msgs.isNotEmpty()) {
                val lines = mutableListOf<String>()
                var lastSender: String? = null
                for (p in msgs) {
                    val b = p as? android.os.Bundle ?: continue
                    val body = b.getCharSequence("text")?.toString().orEmpty()
                    val sender = b.getCharSequence("sender")?.toString()
                        ?: (b.getBundle("sender_person")?.getCharSequence("name")?.toString())
                    if (body.isBlank()) continue
                    if (sender != null) lastSender = sender
                    lines += if (sender != null) "$sender: $body" else body
                }
                if (lines.isNotEmpty()) {
                    val joined = lines.joinToString("\n")
                    if (looksRedacted || text.isBlank()) text = lines.last().substringAfter(": ", lines.last())
                    if (bigText.isNullOrBlank()) bigText = joined
                    if (title.isBlank() && lastSender != null) title = lastSender
                }
            }
        } catch (_: Throwable) {}

        // 2. InboxStyle: EXTRA_TEXT_LINES is a CharSequence[].
        if (looksRedacted || text.isBlank()) {
            try {
                val lines = extras?.getCharSequenceArray(Notification.EXTRA_TEXT_LINES)
                if (lines != null && lines.isNotEmpty()) {
                    val joined = lines.joinToString("\n") { it.toString() }
                    if (bigText.isNullOrBlank()) bigText = joined
                    text = lines.last().toString()
                }
            } catch (_: Throwable) {}
        }

        // 3. tickerText (older apps set it even when body is redacted).
        if (text.isBlank() || text.equals("Sensitive notification content hidden", true)) {
            val ticker = n.tickerText?.toString().orEmpty()
            if (ticker.isNotBlank()) text = ticker
        }

        return Extracted(title, text, bigText, subText)
    }

    companion object {
        const val PREFS = "mindrop_notify_v1"
        const val KEY_RULES = "rules_snapshot"
        const val KEY_PENDING = "pending_events"
    }
}
