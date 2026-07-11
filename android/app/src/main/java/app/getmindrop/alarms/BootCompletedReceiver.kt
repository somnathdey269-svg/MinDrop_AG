package app.getmindrop.alarms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Rehydrates persisted alarms after device reboot or app upgrade. Alarms
 * scheduled with AlarmManager are wiped on reboot; without this receiver
 * every future reminder would be lost.
 */
class BootCompletedReceiver : BroadcastReceiver() {

    private val ACCEPTED = setOf(
        Intent.ACTION_BOOT_COMPLETED,
        Intent.ACTION_LOCKED_BOOT_COMPLETED,
        Intent.ACTION_MY_PACKAGE_REPLACED,
        "android.intent.action.QUICKBOOT_POWERON",
        "com.htc.intent.action.QUICKBOOT_POWERON"
    )

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action !in ACCEPTED) return

        val now = System.currentTimeMillis()
        val kept = mutableListOf<AlarmStore.Entry>()

        for (e in AlarmStore.readAll(context)) {
            if (e.at <= now) continue // past — drop
            AlarmScheduler.schedule(context, e)
            kept.add(e)
        }
        AlarmStore.writeAll(context, kept)
    }
}
