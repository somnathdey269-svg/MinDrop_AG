package app.getmindrop.alarms

import android.content.Context
import android.util.Log
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object Diagnostics {
    private const val FILE_NAME = "snooze_diagnostics.txt"
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US)

    @Synchronized
    fun log(context: Context, message: String) {
        try {
            val file = File(context.filesDir, FILE_NAME)
            val timestamp = dateFormat.format(Date())
            val line = "[$timestamp] $message\n"
            file.appendText(line)
            try {
                Log.d("MindDropDiagnostics", message)
            } catch (_: Throwable) {}
        } catch (e: Exception) {
            try {
                Log.e("MindDropDiagnostics", "Failed to write diagnostic log", e)
            } catch (_: Throwable) {}
        }
    }

    @Synchronized
    fun logError(context: Context, message: String, t: Throwable) {
        val stackTrace = try {
            Log.getStackTraceString(t)
        } catch (_: Throwable) {
            t.stackTraceToString()
        }
        log(context, "$message\nException: $stackTrace")
    }

    @Synchronized
    fun clear(context: Context) {
        try {
            val file = File(context.filesDir, FILE_NAME)
            if (file.exists()) {
                file.delete()
            }
        } catch (_: Exception) {}
    }
}
