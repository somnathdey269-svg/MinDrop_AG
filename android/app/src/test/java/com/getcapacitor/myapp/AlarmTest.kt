package com.getcapacitor.myapp

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import app.getmindrop.alarms.AlarmStore
import app.getmindrop.alarms.AlarmScheduler
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.mockito.MockedStatic
import org.mockito.Mockito.mockStatic
import org.mockito.kotlin.*
import org.json.JSONArray
import org.json.JSONObject

class AlarmTest {

    private val mockContext: Context = mock()
    private val mockPrefs: SharedPreferences = mock()
    private val mockEditor: SharedPreferences.Editor = mock()
    private val mockAlarmManager: AlarmManager = mock()
    private val mockPackageManager: PackageManager = mock()
    private val memoryStore = mutableMapOf<String, Any>()

    @Before
    fun setUp() {
        memoryStore.clear()

        // Mock SharedPreferences Editor actions to update our memoryStore map
        whenever(mockContext.getSharedPreferences(any(), any())).thenReturn(mockPrefs)
        whenever(mockPrefs.edit()).thenReturn(mockEditor)
        whenever(mockContext.getSystemService(Context.ALARM_SERVICE)).thenReturn(mockAlarmManager)
        whenever(mockContext.packageManager).thenReturn(mockPackageManager)
        whenever(mockContext.packageName).thenReturn("in.mindrop.app")

        whenever(mockEditor.putString(any(), any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val value = inv.getArgument<String>(1)
            memoryStore[key] = value
            mockEditor
        }

        whenever(mockEditor.putStringSet(any(), any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val value = inv.getArgument<Set<String>>(1)
            memoryStore[key] = value
            mockEditor
        }

        whenever(mockEditor.putLong(any(), any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val value = inv.getArgument<Long>(1)
            memoryStore[key] = value
            mockEditor
        }

        whenever(mockEditor.putBoolean(any(), any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val value = inv.getArgument<Boolean>(1)
            memoryStore[key] = value
            mockEditor
        }

        whenever(mockEditor.remove(any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            memoryStore.remove(key)
            mockEditor
        }

        // Mock reading from the memoryStore map
        whenever(mockPrefs.getString(any(), anyOrNull())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val def = inv.getArgument<String?>(1)
            (memoryStore[key] as? String) ?: def
        }

        whenever(mockPrefs.getStringSet(any(), anyOrNull())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val def = inv.getArgument<Set<String>?>(1)
            (memoryStore[key] as? Set<String>) ?: def
        }

        whenever(mockPrefs.getLong(any(), any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val def = inv.getArgument<Long>(1)
            (memoryStore[key] as? Long) ?: def
        }

        whenever(mockPrefs.getBoolean(any(), any())).thenAnswer { inv ->
            val key = inv.getArgument<String>(0)
            val def = inv.getArgument<Boolean>(1)
            (memoryStore[key] as? Boolean) ?: def
        }
    }

    @Test
    fun testActiveAlarmGuard() {
        val pkg = "com.whatsapp"
        val sender = "Jane Doe"

        // Verify alarm is not active initially
        assertFalse(AlarmStore.isAlarmActive(mockContext, pkg, sender))

        // Mark alarm active
        AlarmStore.markAlarmActive(mockContext, pkg, sender)

        // Verify active alarm guard blocks re-triggers
        assertTrue(AlarmStore.isAlarmActive(mockContext, pkg, sender))

        // Clear active alarm
        AlarmStore.clearAlarmActive(mockContext, pkg, sender)

        // Verify alarm is no longer active
        assertFalse(AlarmStore.isAlarmActive(mockContext, pkg, sender))
    }

    @Test
    fun testSnoozeLogicDoesNotRecordAsStopped() {
        val alarmId = "notify-rule-1"

        // Simulate snooze recording
        AlarmStore.recordSnoozedAlarm(mockContext, alarmId, 5)

        // Verify it was recorded in snoozed alarms registry
        val snoozedJson = AlarmStore.getSnoozedAlarmsJson(mockContext)
        val arr = JSONArray(snoozedJson)
        assertEquals(1, arr.length())
        assertEquals(alarmId, arr.getJSONObject(0).getString("id"))
        assertEquals(5, arr.getJSONObject(0).getInt("minutes"))

        // Ensure stoppedAlarms is empty because recordStoppedAlarm should NOT be called for snoozes
        val stopped = AlarmStore.getStoppedAlarms(mockContext)
        assertTrue(stopped.isEmpty())
    }

    @Test
    fun testStopAlarmRecordsAsStopped() {
        val alarmId = "notify-rule-1"

        // Record a stopped alarm
        AlarmStore.recordStoppedAlarm(mockContext, alarmId)

        // Verify it exists in stopped alarms
        val stopped = AlarmStore.getStoppedAlarms(mockContext)
        assertTrue(stopped.contains(alarmId))
    }

    @Test
    fun testAlarmSchedulerSnoozeScheduling() {
        val alarmId = "notify-active-rule1"

        // Mock static methods on PendingIntent
        val mockPendingIntent: PendingIntent = mock()
        val mockedStatic: MockedStatic<PendingIntent> = mockStatic(PendingIntent::class.java)
        val mockedIntent = org.mockito.Mockito.mockConstruction(Intent::class.java)
        val mockedInfo = org.mockito.Mockito.mockConstruction(AlarmManager.AlarmClockInfo::class.java) { mock, context ->
            val triggerTime = context.arguments()[0] as Long
            whenever(mock.triggerTime).thenReturn(triggerTime)
        }

        try {
            mockedStatic.`when`<PendingIntent> {
                PendingIntent.getBroadcast(any(), any(), any(), any())
            }.thenReturn(mockPendingIntent)

            mockedStatic.`when`<PendingIntent> {
                PendingIntent.getActivity(any(), any(), any(), any())
            }.thenReturn(mockPendingIntent)

            // Setup mock package manager to return a launch intent
            val mockLaunchIntent: Intent = mock()
            whenever(mockPackageManager.getLaunchIntentForPackage(any())).thenReturn(mockLaunchIntent)

            // Save an initial alarm entry
            val entry = AlarmStore.Entry(
                id = alarmId,
                at = System.currentTimeMillis() - 10000L, // past
                title = "Test Alarm",
                body = "Triggered alarm",
                delivery = "alarm",
                toneId = "classic",
                exact = true
            )
            AlarmStore.upsert(mockContext, entry)

            // Calculate expected snooze time (5 minutes from now)
            val timeBeforeSnooze = System.currentTimeMillis()
            AlarmScheduler.snooze(mockContext, alarmId, 5)
            val timeAfterSnooze = System.currentTimeMillis()

            // Verify the entry in store was updated to the future snoozed time
            val updated = AlarmStore.find(mockContext, alarmId)
            assertNotNull(updated)
            assertTrue(updated!!.at >= timeBeforeSnooze + 5 * 60 * 1000L)
            assertTrue(updated.at <= timeAfterSnooze + 5 * 60 * 1000L)

            // Verify AlarmManager setAlarmClock or setExactAndAllowWhileIdle was called
            val alarmClockInfoCaptor = argumentCaptor<AlarmManager.AlarmClockInfo>()
            val pendingIntentCaptor = argumentCaptor<PendingIntent>()

            verify(mockAlarmManager).setAlarmClock(alarmClockInfoCaptor.capture(), pendingIntentCaptor.capture())

            val info = alarmClockInfoCaptor.firstValue
            assertTrue(info.triggerTime >= timeBeforeSnooze + 5 * 60 * 1000L)
            assertTrue(info.triggerTime <= timeAfterSnooze + 5 * 60 * 1000L)

        } finally {
            mockedStatic.close()
            mockedIntent.close()
            mockedInfo.close()
        }
    }
}
